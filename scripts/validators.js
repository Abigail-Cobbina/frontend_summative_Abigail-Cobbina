function validateDescription(description) {
    const pattern = /^\S(?:.*\S)?$/;
    return pattern.test(description) && !/\s{2,}/.test(description);
}

/* 1. Validate the transaction description */
function validateDescription(description) {
    const pattern = /^\S(?:.*\S)?$/;
    return pattern.test(description) && !/\s{2,}/.test(description);
}

/* 2. Validate the transaction amount */
function validateAmount(amount) {
    const pattern = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    return pattern.test(String(amount));
}

/* 3. Validate the transaction date */
function validateDate(date) {
    const pattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

    if (!pattern.test(date)) {
        return false;
    }

    const [year, month, day] = date.split("-").map(Number);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));

    return (
        parsedDate.getUTCFullYear() === year &&
        parsedDate.getUTCMonth() === month - 1 &&
        parsedDate.getUTCDate() === day
    );
}

/* 4. Validate the transaction category */
function validateCategory(category) {
    const pattern = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
    return pattern.test(category);
}

/* 5. Detect repeated words */
function hasDuplicateWords(text) {
    const pattern = /\b(\w+)\s+\1\b/i;
    return pattern.test(text);
}

export {
    validateDescription,
    validateAmount,
    validateDate,
    validateCategory,
    hasDuplicateWords
};
