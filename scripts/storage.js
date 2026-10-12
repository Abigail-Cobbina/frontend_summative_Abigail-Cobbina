
const STORAGE_KEY = "student-finance-tracker-transactions";

function saveTransactions(transactions) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
        return true;
    } catch (error) {
        console.error("Could not save transactions:", error);
        return false;
    }
}

function loadTransactions() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (!savedData) {
            return [];
        }

        const transactions = JSON.parse(savedData);

        if (!Array.isArray(transactions)) {
            return [];
        }

        return transactions.filter((transaction) =>
            transaction &&
            typeof transaction.id === "string" &&
            typeof transaction.description === "string" &&
            Number.isFinite(transaction.amount) &&
            ["income", "expense"].includes(transaction.type) &&
            typeof transaction.category === "string" &&
            typeof transaction.date === "string"
        );
    } catch (error) {
        console.error("Could not load transactions:", error);
        return [];
    }
}

function clearTransactions() {
    localStorage.removeItem(STORAGE_KEY);
}

export { saveTransactions, loadTransactions, clearTransactions };
