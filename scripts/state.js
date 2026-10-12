
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

function getTransactions() {
    return [...transactions];
}

export { addTransaction, getTransactions };
