import {
    addTransaction,
    updateTransaction,
    deleteTransaction,
    replaceTransactions,
    getTransactions
} from "./state.js";

import { renderTransactions, renderDashboard } from "./ui.js";

import {
    validateDescription,
    validateAmount,
    validateDate,
    validateCategory,
    hasDuplicateWords
} from "./validators.js";

import { searchAndSortTransactions } from "./search.js";

const form = document.querySelector("#transaction-form");
const submitButton = form.querySelector('button[type="submit"]');
const cancelEditButton = document.querySelector("#cancel-edit");

const fields = {
    description: document.querySelector("#description"),
    amount: document.querySelector("#amount"),
    category: document.querySelector("#category"),
    date: document.querySelector("#date")
};

const typeField = document.querySelector("#type");

const errors = {
    description: document.querySelector("#description-error"),
    amount: document.querySelector("#amount-error"),
    category: document.querySelector("#category-error"),
    date: document.querySelector("#date-error")
};

const searchInput = document.querySelector("#search-input");
const caseSensitiveInput = document.querySelector("#case-sensitive");
const sortSelect = document.querySelector("#sort-by");
const searchStatus = document.querySelector("#search-status");

const capForm = document.querySelector("#cap-form");
const capInput = document.querySelector("#spending-cap");
const capStatus = document.querySelector("#cap-status");

const currencyForm = document.querySelector("#currency-form");
const baseCurrencyInput = document.querySelector("#base-currency");
const usdRateInput = document.querySelector("#usd-rate");
const eurRateInput = document.querySelector("#eur-rate");

const exportButton = document.querySelector("#export-json");
const importInput = document.querySelector("#import-json");
const importButton = document.querySelector("#import-json-button");
const dataStatus = document.querySelector("#data-status");

const CAP_STORAGE_KEY = "student-finance-tracker-spending-cap";
const CURRENCY_STORAGE_KEY = "student-finance-tracker-currency";
const CATEGORIES = [
    "Food",
    "Transport",
    "Books",
    "Entertainment",
    "Fees",
    "Other"
];

let editingTransactionId = null;
let spendingCap = loadSpendingCap();
let currencySettings = loadCurrencySettings();

function loadSpendingCap() {
    try {
        const saved = localStorage.getItem(CAP_STORAGE_KEY);

        if (saved === null) return null;

        const value = Number(saved);
        return Number.isFinite(value) && value >= 0 ? value : null;
    } catch (error) {
        console.error("Could not load spending cap:", error);
        return null;
    }
}

function loadCurrencySettings() {
    const defaults = {
        baseCurrency: "RWF",
        usdRate: 1 / 1400,
        eurRate: 1 / 1600
    };

    try {
        const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
        if (!saved) return defaults;

        const settings = JSON.parse(saved);

        if (
            !["RWF", "USD", "EUR"].includes(settings.baseCurrency) ||
            !Number.isFinite(settings.usdRate) ||
            settings.usdRate <= 0 ||
            !Number.isFinite(settings.eurRate) ||
            settings.eurRate <= 0
        ) {
            return defaults;
        }

        return settings;
    } catch (error) {
        console.error("Could not load currency settings:", error);
        return defaults;
    }
}

function saveCurrencySettings(settings) {
    try {
        localStorage.setItem(
            CURRENCY_STORAGE_KEY,
            JSON.stringify(settings)
        );
        return true;
    } catch (error) {
        console.error("Could not save currency settings:", error);
        return false;
    }
}

function saveSpendingCap(value) {
    try {
        localStorage.setItem(CAP_STORAGE_KEY, String(value));
        return true;
    } catch (error) {
        console.error("Could not save spending cap:", error);
        return false;
    }
}

function showError(fieldName, message) {
    errors[fieldName].textContent = message;
    fields[fieldName].setAttribute(
        "aria-invalid",
        message ? "true" : "false"
    );
}

function validateForm() {
    let valid = true;

    const description = fields.description.value;
    const amount = fields.amount.value;
    const category = fields.category.value;
    const date = fields.date.value;

    if (!validateDescription(description)) {
        showError(
            "description",
            "Remove leading, trailing, or repeated spaces."
        );
        valid = false;
    } else if (hasDuplicateWords(description)) {
        showError(
            "description",
            "Remove repeated words, such as 'lunch lunch'."
        );
        valid = false;
    } else {
        showError("description", "");
    }

    if (!validateAmount(amount) || Number(amount) <= 0) {
        showError(
            "amount",
            "Enter an amount greater than zero, with up to two decimal places."
        );
        valid = false;
    } else {
        showError("amount", "");
    }

    if (!validateCategory(category)) {
        showError("category", "Choose a valid category.");
        valid = false;
    } else {
        showError("category", "");
    }

    if (!validateDate(date)) {
        showError("date", "Enter a valid date.");
        valid = false;
    } else {
        showError("date", "");
    }

    return valid;
}

function resetEditing() {
    editingTransactionId = null;
    form.reset();
    submitButton.textContent = "Add Transaction";
    cancelEditButton.hidden = true;

    Object.keys(errors).forEach((name) => showError(name, ""));
}

function startEditing(id) {
    const transaction = getTransactions().find((item) => item.id === id);

    if (!transaction) {
        searchStatus.textContent = "Transaction not found.";
        return;
    }

    editingTransactionId = id;
    fields.description.value = transaction.description;
    fields.amount.value = String(transaction.amount);
    typeField.value = transaction.type;
    fields.category.value = transaction.category;
    fields.date.value = transaction.date;

    Object.keys(errors).forEach((name) => showError(name, ""));

    submitButton.textContent = "Save Changes";
    cancelEditButton.hidden = false;
    fields.description.focus();
    form.scrollIntoView({ behavior: "smooth", block: "center" });

    searchStatus.textContent = `Editing "${transaction.description}".`;
}

function updateCapStatus(transactions) {
    if (spendingCap === null) {
        capStatus.textContent = "Set a spending cap to get started.";
        capStatus.setAttribute("aria-live", "polite");
        return;
    }

    const expenses = transactions
        .filter((item) => item.type === "expense")
        .reduce((total, item) => total + item.amount, 0);

    const remaining = spendingCap - expenses;

    if (remaining < 0) {
        capStatus.textContent =
            `Spending cap exceeded by RWF ${Math.abs(remaining).toFixed(2)}. ` +
            `Your cap is RWF ${spendingCap.toFixed(2)}.`;
        capStatus.setAttribute("aria-live", "assertive");
    } else {
        capStatus.textContent =
            `RWF ${remaining.toFixed(2)} remaining from your ` +
            `RWF ${spendingCap.toFixed(2)} spending cap.`;
        capStatus.setAttribute("aria-live", "polite");
    }
}

function updateTransactionList() {
    const transactions = getTransactions();

    renderDashboard(transactions);
    updateCapStatus(transactions);

    const { results, error, pattern } = searchAndSortTransactions(
        transactions,
        searchInput.value,
        caseSensitiveInput.checked,
        sortSelect.value
    );

    if (error) {
        renderTransactions([]);
        searchStatus.textContent = error;
        return;
    }

    renderTransactions(results, searchInput.value.trim() ? pattern : null);
    searchStatus.textContent = `${results.length} transaction(s) found.`;
}

function isValidImportedTransaction(item) {
    return Boolean(
        item &&
        typeof item.id === "string" &&
        item.id.trim() !== "" &&
        typeof item.description === "string" &&
        validateDescription(item.description) &&
        !hasDuplicateWords(item.description) &&
        Number.isFinite(item.amount) &&
        item.amount > 0 &&
        ["income", "expense"].includes(item.type) &&
        typeof item.category === "string" &&
        validateCategory(item.category) &&
        CATEGORIES.includes(item.category) &&
        typeof item.date === "string" &&
        validateDate(item.date) &&
        typeof item.createdAt === "string" &&
        !Number.isNaN(Date.parse(item.createdAt)) &&
        typeof item.updatedAt === "string" &&
        !Number.isNaN(Date.parse(item.updatedAt))
    );
}

function validateImportedFile(data) {
    const transactions = Array.isArray(data)
        ? data
        : data && Array.isArray(data.transactions)
            ? data.transactions
            : null;

    if (!transactions) {
        throw new Error(
            "The JSON must contain a transactions array."
        );
    }

    if (!transactions.every(isValidImportedTransaction)) {
        throw new Error(
            "One or more transactions have invalid or missing fields."
        );
    }

    const ids = transactions.map((item) => item.id);

    if (new Set(ids).size !== ids.length) {
        throw new Error("The file contains duplicate transaction IDs.");
    }

    return transactions;
}

capForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const value = capInput.value;

    if (
        value.trim() === "" ||
        !Number.isFinite(Number(value)) ||
        Number(value) < 0
    ) {
        capStatus.textContent = "Enter a valid spending cap of zero or more.";
        capStatus.setAttribute("aria-live", "assertive");
        capInput.focus();
        return;
    }

    const cap = Number(value);

    if (!saveSpendingCap(cap)) {
        capStatus.textContent = "Could not save the spending cap.";
        capStatus.setAttribute("aria-live", "assertive");
        return;
    }

    spendingCap = cap;
    updateTransactionList();
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) {
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
    }

    const data = {
        description: fields.description.value,
        amount: fields.amount.value,
        type: typeField.value,
        category: fields.category.value,
        date: fields.date.value
    };

    if (editingTransactionId !== null) {
        if (!updateTransaction(editingTransactionId, data)) {
            searchStatus.textContent = "Could not update the transaction.";
            return;
        }

        resetEditing();
        searchStatus.textContent = "Transaction updated successfully.";
    } else {
        addTransaction(data);
        form.reset();
        searchStatus.textContent = "Transaction added successfully.";
    }

    updateTransactionList();
    fields.description.focus();
});

cancelEditButton.addEventListener("click", () => {
    resetEditing();
    searchStatus.textContent = "Editing cancelled.";
    fields.description.focus();
});

for (const field of Object.values(fields)) {
    field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") {
            validateForm();
        }
    });

    field.addEventListener("change", () => {
        if (field.getAttribute("aria-invalid") === "true") {
            validateForm();
        }
    });
}

document.querySelector("#transaction-list").addEventListener("click", (event) => {
    const editButton = event.target.closest(".edit-transaction");
    const deleteButton = event.target.closest(".delete-transaction");

    if (editButton) {
        startEditing(editButton.dataset.id);
        return;
    }

    if (deleteButton) {
        const id = deleteButton.dataset.id;
        const transaction = getTransactions().find((item) => item.id === id);

        if (!transaction) {
            searchStatus.textContent = "Transaction not found.";
            return;
        }

        if (!window.confirm(
            `Delete "${transaction.description}"? This action cannot be undone.`
        )) {
            return;
        }

        if (!deleteTransaction(id)) {
            searchStatus.textContent = "Could not delete the transaction.";
            return;
        }

        if (editingTransactionId === id) {
            resetEditing();
        }

        updateTransactionList();
        searchStatus.textContent = "Transaction deleted successfully.";
    }
});

currencyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const usdRate = Number(usdRateInput.value);
    const eurRate = Number(eurRateInput.value);

    if (
        usdRateInput.value.trim() === "" ||
        eurRateInput.value.trim() === "" ||
        !Number.isFinite(usdRate) ||
        !Number.isFinite(eurRate) ||
        usdRate <= 0 ||
        eurRate <= 0
    ) {
        dataStatus.textContent = "Enter valid positive exchange rates.";
        dataStatus.setAttribute("aria-live", "assertive");
        return;
    }

    const settings = {
        baseCurrency: baseCurrencyInput.value,
        usdRate,
        eurRate
    };

    if (!saveCurrencySettings(settings)) {
        dataStatus.textContent = "Could not save currency settings.";
        return;
    }

    currencySettings = settings;
    dataStatus.textContent =
        `Currency settings saved. Selected currency: ${currencySettings.baseCurrency}.`;
});

function displayCurrencySettings() {
    baseCurrencyInput.value = currencySettings.baseCurrency;
    usdRateInput.value = String(currencySettings.usdRate);
    eurRateInput.value = String(currencySettings.eurRate);
}

exportButton.addEventListener("click", () => {
    const backup = {
        version: 1,
        exportedAt: new Date().toISOString(),
        transactions: getTransactions()
    };

    const blob = new Blob(
        [JSON.stringify(backup, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "student-finance-tracker-backup.json";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    dataStatus.textContent =
        `${backup.transactions.length} transaction(s) exported successfully.`;
});

importButton.addEventListener("click", async () => {
    const file = importInput.files[0];

    if (!file) {
        dataStatus.textContent = "Choose a JSON file to import first.";
        dataStatus.setAttribute("aria-live", "assertive");
        importInput.focus();
        return;
    }

    try {
        const text = await file.text();
        const data = JSON.parse(text);
        const importedTransactions = validateImportedFile(data);

        const confirmed = window.confirm(
            `Import ${importedTransactions.length} transaction(s)? ` +
            "This will replace your current transactions."
        );

        if (!confirmed) {
            dataStatus.textContent = "Import cancelled. Your data is unchanged.";
            return;
        }

        if (!replaceTransactions(importedTransactions)) {
            throw new Error(
                "Could not save imported data. Your previous transactions were restored."
            );
        }

        if (
            editingTransactionId !== null &&
            !importedTransactions.some(
                (item) => item.id === editingTransactionId
            )
        ) {
            resetEditing();
        }

        updateTransactionList();
        dataStatus.textContent =
            `Successfully imported ${importedTransactions.length} transaction(s).`;
        importInput.value = "";
    } catch (error) {
        dataStatus.textContent =
            `Import failed: ${error.message || "Invalid JSON file."}`;
        dataStatus.setAttribute("aria-live", "assertive");
    }
});

searchInput.addEventListener("input", updateTransactionList);
caseSensitiveInput.addEventListener("change", updateTransactionList);
sortSelect.addEventListener("change", updateTransactionList);

displayCurrencySettings();

if (spendingCap !== null) {
    capInput.value = String(spendingCap);
}

updateTransactionList();
