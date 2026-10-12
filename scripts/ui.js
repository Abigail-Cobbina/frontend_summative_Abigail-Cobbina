const transactionList = document.querySelector("#transaction-list");
const balanceElement = document.querySelector("#balance");
const incomeElement = document.querySelector("#income");
const expensesElement = document.querySelector("#expenses");
const totalTransactionsElement = document.querySelector("#total-transactions");
const topCategoryElement = document.querySelector("#top-category");
const weeklyTrendElement = document.querySelector("#weekly-trend");

function appendHighlightedText(element, text, pattern) {
    const value = String(text);

    if (!pattern) {
        element.textContent = value;
        return;
    }

    const flags = pattern.flags.replace("g", "");
    const regex = new RegExp(pattern.source, `${flags}g`);
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(value)) !== null) {
        element.append(
            document.createTextNode(value.slice(lastIndex, match.index))
        );

        const mark = document.createElement("mark");
        mark.textContent = match[0];
        element.append(mark);

        lastIndex = match.index + match[0].length;

        if (match[0].length === 0) {
            regex.lastIndex++;
        }
    }

    element.append(document.createTextNode(value.slice(lastIndex)));
}

function renderTransactions(transactions, pattern = null) {
    transactionList.replaceChildren();

    if (transactions.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No matching transactions found.";
        transactionList.append(message);
        return;
    }

    transactions.forEach((transaction) => {
        const card = document.createElement("article");
        card.className = "transaction-card";

        const description = document.createElement("h3");
        appendHighlightedText(description, transaction.description, pattern);

        const amount = document.createElement("p");
        amount.textContent =
            `${transaction.type === "income" ? "+" : "-"} RWF ${transaction.amount.toFixed(2)}`;

        const details = document.createElement("p");
        details.textContent = `${transaction.category} · ${transaction.date}`;

        const actions = document.createElement("div");
        actions.className = "transaction-actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "edit-transaction";
        editButton.dataset.id = transaction.id;
        editButton.textContent = "Edit";
        editButton.setAttribute(
            "aria-label",
            `Edit transaction: ${transaction.description}`
        );

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-transaction";
        deleteButton.dataset.id = transaction.id;
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute(
            "aria-label",
            `Delete transaction: ${transaction.description}`
        );

        actions.append(editButton, deleteButton);
        card.append(description, amount, details, actions);
        transactionList.append(card);
    });
}

function getLocalDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function renderTopCategory(transactions) {
    const categoryTotals = {};

    transactions
        .filter((transaction) => transaction.type === "expense")
        .forEach((transaction) => {
            categoryTotals[transaction.category] =
                (categoryTotals[transaction.category] || 0) +
                transaction.amount;
        });

    const categories = Object.entries(categoryTotals);

    if (categories.length === 0) {
        topCategoryElement.textContent = "None yet";
        return;
    }

    categories.sort((a, b) => b[1] - a[1]);

    const [category, total] = categories[0];

    topCategoryElement.textContent =
        `${category} — RWF ${total.toFixed(2)}`;
}

function renderWeeklyTrend(transactions) {
    weeklyTrendElement.replaceChildren();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];

    for (let offset = 6; offset >= 0; offset--) {
        const date = new Date(today);
        date.setDate(today.getDate() - offset);

        days.push({
            dateKey: getLocalDateKey(date),
            label: date.toLocaleDateString("en", {
                weekday: "short"
            }),
            total: 0
        });
    }

    const totalsByDate = {};

    transactions
        .filter((transaction) => transaction.type === "expense")
        .forEach((transaction) => {
            totalsByDate[transaction.date] =
                (totalsByDate[transaction.date] || 0) +
                transaction.amount;
        });

    days.forEach((day) => {
        day.total = totalsByDate[day.dateKey] || 0;
    });

    const highestTotal = Math.max(...days.map((day) => day.total));

    days.forEach((day) => {
        const dayColumn = document.createElement("div");
        dayColumn.className = "trend-day";

        const amount = document.createElement("span");
        amount.className = "trend-amount";
        amount.textContent = `RWF ${day.total.toFixed(0)}`;

        const barTrack = document.createElement("div");
        barTrack.className = "trend-bar-track";

        const bar = document.createElement("div");
        bar.className = "trend-bar";

        const height = highestTotal > 0
            ? (day.total / highestTotal) * 100
            : 0;

        bar.style.height = `${height}%`;
        bar.setAttribute("aria-hidden", "true");

        barTrack.append(bar);

        const label = document.createElement("span");
        label.className = "trend-label";
        label.textContent = day.label;

        dayColumn.append(amount, barTrack, label);
        weeklyTrendElement.append(dayColumn);
    });
}

function renderDashboard(transactions) {
    const income = transactions
        .filter((transaction) => transaction.type === "income")
        .reduce((total, transaction) => total + transaction.amount, 0);

    const expenses = transactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((total, transaction) => total + transaction.amount, 0);

    const balance = income - expenses;

    incomeElement.textContent = `RWF ${income.toFixed(2)}`;
    expensesElement.textContent = `RWF ${expenses.toFixed(2)}`;
    balanceElement.textContent = `RWF ${balance.toFixed(2)}`;

    totalTransactionsElement.textContent = String(transactions.length);

    renderTopCategory(transactions);
    renderWeeklyTrend(transactions);
}

export { renderTransactions, renderDashboard };
