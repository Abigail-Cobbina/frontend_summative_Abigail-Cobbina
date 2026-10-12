
const transactionList = document.querySelector("#transaction-list");

function appendHighlightedText(element, text, pattern) {
    const value = String(text);

    if (!pattern) {
        element.textContent = value;
        return;
    }

    // Use a fresh regex so repeated searches behave consistently.
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

        // Avoid an infinite loop for patterns that match empty strings.
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
        details.textContent =
            `${transaction.category} · ${transaction.date}`;

        card.append(description, amount, details);
        transactionList.append(card);
    });
}

export { renderTransactions };
