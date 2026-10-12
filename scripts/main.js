import {
    addTransaction,
    updateTransaction,
    deleteTransaction,
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

const CAP_STORAGE_KEY = "student-finance-tracker-spending-cap";

let editingTransactionId = null;

function loadSpendingCap() {
    try {
        const savedCap = localStorage.getItem(CAP_STORAGE_KEY);

        if (savedCap === null) {
            return null;
        }

        const cap = Number(savedCap);
        return Number.isFinite(cap) && cap >= 0 ? cap : null;
    } catch (error) {
        console.error("Could not load spending cap:", error);
        return null;
    }
}

function saveSpendingCap(cap) {
    try {
        localStorage.setItem(CAP_STORAGE_KEY, String(cap));
        return true;
    } catch (error) {
        console.error("Could not save spending cap:", error);
        return false;
    }
}

let spendingCap = loadSpendingCap();

if (spendingCap !== null) {
    capInput.value = String(spendingCap);
}

function showError(fieldName, message) {
    errors[fieldName].textContent = message;

    fields[fieldName].setAttribute(
        "aria-invalid",
        message ? "true" : "false"
    );
}

function validateForm() {
    let isValid = true;

    const description = fields.description.value;
    const amount = fields.amount.value;
    const category = fields.category.value;
    const date = fields.date.value;

    if (!validateDescription(description)) {
        showError(
            "description",
            "Remove leading, trailing, or repeated spaces."
        );
        isValid = false;
    } else if (hasDuplicateWords(description)) {
        showError(
            "description",
            "Please remove repeated words, such as 'lunch lunch'."
        );
        isValid = false;
    } else {
        showError("description", "");
    }

    if (!validateAmount(amount) || Number(amount) <= 0) {
        showError(
            "amount",
            "Enter an amount greater than zero, with up to two decimal places."
        );
        isValid = false;
    } else {
        showError("amount", "");
    }

    if (!validateCategory(category)) {
        showError("category", "Choose a valid category.");
        isValid = false;
    } else {
        showError("category", "");
    }

    if (!validateDate(date)) {
        showError("date", "Enter a valid date.");
        isValid = false;
    } else {
        showError("date", "");
    }

    return isValid;
}

function resetEditing() {
    editingTransactionId = null;
    form.reset();
    submitButton.textContent = "Add Transaction";

    Object.keys(errors).forEach((fieldName) => {
        showError(fieldName, "");
    });
}

function startEditing(id) {
    const transaction = getTransactions().find(
        (item) => item.id === id
    );

    if (!transaction) {
        searchStatus.textContent = "That transaction could not be found.";
        return;
    }

    editingTransactionId = id;

    fields.description.value = transaction.description;
    fields.amount.value = String(transaction.amount);
    typeField.value = transaction.type;
    fields.category.value = transaction.category;
    fields.date.value = transaction.date;

    Object.keys(errors).forEach((fieldName) => {
        showError(fieldName, "");
    });

    submitButton.textContent = "Save Changes";
    fields.description.focus();

    form.scrollIntoView({ behavior: "smooth", block: "center" });

    searchStatus.textContent =
        `Editing "${transaction.description}". Update the form and save your changes.`;
}

function updateCapStatus(transactions) {
    if (spendingCap === null) {
        capStatus.textContent = "Set a spending cap to get started.";
        capStatus.setAttribute("aria-live", "polite");
        return;
    }

    const totalExpenses = transactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((total, transaction) => total + transaction.amount, 0);

    const remaining = spendingCap - totalExpenses;

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
    const allTransactions = getTransactions();

    renderDashboard(allTransactions);
    updateCapStatus(allTransactions);

    const { results, error, pattern } = searchAndSortTransactions(
        allTransactions,
        searchInput.value,
        caseSensitiveInput.checked,
        sortSelect.value
    );

    if (error) {
        searchStatus.textContent = error;
        renderTransactions([]);
        return;
    }

    renderTransactions(results, searchInput.value.trim() ? pattern : null);

    if (!error) {
        searchStatus.textContent =
            `${results.length} transaction(s) found.`;
    }
}

capForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const value = capInput.value;

    if (
        value.trim() === "" ||
        !Number.isFinite(Number(value)) ||
        Number(value) < 0
    ) {
        capStatus.textContent =
            "Enter a valid spending cap of zero or more.";
        capStatus.setAttribute("aria-live", "assertive");
        capInput.focus();
        return;
    }

    const newCap = Number(value);

    if (!saveSpendingCap(newCap)) {
        capStatus.textContent =
            "The spending cap could not be saved. Please try again.";
        capStatus.setAttribute("aria-live", "assertive");
        return;
    }

    spendingCap = newCap;
    updateTransactionList();
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm()) {
        const firstInvalidField = form.querySelector(
            '[aria-invalid="true"]'
        );

        firstInvalidField?.focus();
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
        const success = updateTransaction(editingTransactionId, data);

        if (!success) {
            searchStatus.textContent =
                "The transaction could not be updated. Please try again.";
            return;
        }

        searchStatus.textContent = "Transaction updated successfully.";
        resetEditing();
    } else {
        addTransaction(data);
        form.reset();
        searchStatus.textContent = "Transaction added successfully.";
    }

    updateTransactionList();
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

document.querySelector("#transaction-list").addEventListener(
    "click",
    function (event) {
        const editButton = event.target.closest(".edit-transaction");
        const deleteButton = event.target.closest(".delete-transaction");

        if (editButton) {
            startEditing(editButton.dataset.id);
            return;
        }

        if (deleteButton) {
            const id = deleteButton.dataset.id;

            const transaction = getTransactions().find(
                (item) => item.id === id
            );

            if (!transaction) {
                searchStatus.textContent =
                    "That transaction could not be found.";
                return;
            }

            const confirmed = window.confirm(
                `Delete "${transaction.description}"? This action cannot be undone.`
            );

            if (!confirmed) {
                return;
            }

            const success = deleteTransaction(id);

            if (!success) {
                searchStatus.textContent =
                    "The transaction could not be deleted.";
                return;
            }

            if (editingTransactionId === id) {
                resetEditing();
            }

            updateTransactionList();
            searchStatus.textContent = "Transaction deleted successfully.";
        }
    }
);

searchInput.addEventListener("input", updateTransactionList);
caseSensitiveInput.addEventListener("change", updateTransactionList);
sortSelect.addEventListener("change", updateTransactionList);

updateTransactionList();
