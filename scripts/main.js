
import { addTransaction, getTransactions } from "./state.js";
import { renderTransactions } from "./ui.js";
import {
    validateDescription,
    validateAmount,
    validateDate,
    validateCategory,
    hasDuplicateWords
} from "./validators.js";
import { searchAndSortTransactions } from "./search.js";

const form = document.querySelector("#transaction-form");

const fields = {
    description: document.querySelector("#description"),
    amount: document.querySelector("#amount"),
    category: document.querySelector("#category"),
    date: document.querySelector("#date")
};

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
        showError("description", "Remove leading, trailing, or repeated spaces.");
        isValid = false;
    } else if (hasDuplicateWords(description)) {
        showError("description", "Please remove repeated words, such as 'lunch lunch'.");
        isValid = false;
    } else {
        showError("description", "");
    }

    if (!validateAmount(amount) || Number(amount) <= 0) {
        showError("amount", "Enter an amount greater than zero, with up to two decimal places.");
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

function updateTransactionList() {
    const query = searchInput.value;

    const { results, error, pattern } = searchAndSortTransactions(
        getTransactions(),
        query,
        caseSensitiveInput.checked,
        sortSelect.value
    );

    if (error) {
        searchStatus.textContent = error;
        return;
    }

    renderTransactions(results, query.trim() ? pattern : null);
    searchStatus.textContent = `${results.length} transaction(s) found.`;
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm()) {
        const firstInvalidField = form.querySelector('[aria-invalid="true"]');
        firstInvalidField?.focus();
        return;
    }

    addTransaction({
        description: fields.description.value,
        amount: fields.amount.value,
        type: document.querySelector("#type").value,
        category: fields.category.value,
        date: fields.date.value
    });

    updateTransactionList();
    form.reset();
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

searchInput.addEventListener("input", updateTransactionList);
caseSensitiveInput.addEventListener("change", updateTransactionList);
sortSelect.addEventListener("change", updateTransactionList);
