
function searchAndSortTransactions(
    transactions,
    query,
    caseSensitive,
    sortBy
) {
    let results = [...transactions];
    let pattern = null;

    if (query.trim() !== "") {
        try {
            const flags = caseSensitive ? "g" : "gi";
            pattern = new RegExp(query, flags);

            results = results.filter((transaction) => {
                const searchableText = [
                    transaction.description,
                    transaction.category,
                    transaction.type,
                    transaction.date,
                    String(transaction.amount)
                ].join(" ");

                // Remove the global flag's state before testing.
                pattern.lastIndex = 0;
                return new RegExp(
                    pattern.source,
                    caseSensitive ? "" : "i"
                ).test(searchableText);
            });
        } catch (error) {
            return {
                results: [],
                pattern: null,
                error: "Invalid regex. Please check your pattern."
            };
        }
    }

    const sortOptions = {
        "date-asc": (a, b) => a.date.localeCompare(b.date),
        "date-desc": (a, b) => b.date.localeCompare(a.date),
        "description-asc": (a, b) =>
            a.description.localeCompare(b.description),
        "description-desc": (a, b) =>
            b.description.localeCompare(a.description),
        "amount-asc": (a, b) => a.amount - b.amount,
        "amount-desc": (a, b) => b.amount - a.amount
    };

    results.sort(sortOptions[sortBy] || sortOptions["date-desc"]);

    return { results, pattern, error: null };
}

export { searchAndSortTransactions };
