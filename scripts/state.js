import { saveTransactions, loadTransactions } from "./storage.js";

let transactions = loadTransactions();

function createTransaction(data) {
    const now = new Date().toISOString();

    return {
        id: `rec_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        description: data.description.trim(),
        amount: Number(data.amount),
        type: data.type,
        category: data.category,
        date: data.date,
        createdAt: now,
        updatedAt: now
    };
}

function addTransaction(data) {
    const transaction = createTransaction(data);

    transactions.push(transaction);
    saveTransactions(transactions);

    return transaction;
}

function updateTransaction(id, data) {
    const index = transactions.findIndex(
        (transaction) => transaction.id === id
    );

    if (index === -1) {
        return false;
    }

    const existingTransaction = transactions[index];

    transactions[index] = {
        ...existingTransaction,
        description: data.description.trim(),
        amount: Number(data.amount),
        type: data.type,
        category: data.category,
        date: data.date,
        updatedAt: new Date().toISOString()
    };

    saveTransactions(transactions);

    return true;
}

function deleteTransaction(id) {
    const index = transactions.findIndex(
        (transaction) => transaction.id === id
    );

    if (index === -1) {
        return false;
    }

    transactions.splice(index, 1);
    saveTransactions(transactions);

    return true;
}

function getTransactions() {
    return [...transactions];
}

export {
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactions
};
