
# Student Finance Tracker

## Project Overview

The Student Finance Tracker is a responsive web application for recording and managing personal income and expenses. It helps students monitor their spending, understand their financial habits, and manage a spending target.

**Technologies:** HTML5, CSS3, and vanilla JavaScript.

**Repository:** https://github.com/Abigail-Cobbina/frontend_summative_Abigail-Cobbina

**Live Demo:** Add the GitHub Pages URL here after deployment is complete.

## Features

- Add, edit, and delete income and expense records.
- Validate transaction descriptions, amounts, dates, and categories.
- Search transactions using regular expressions.
- Toggle case-sensitive search and highlight matching text.
- Sort transactions by date, description, and amount.
- View total income, total expenses, balance, transaction count, and top expense category.
- View an expense trend for the last seven days.
- Set a spending cap and view remaining funds or overspending.
- Save and restore transactions using browser localStorage.
- Import and export transaction data as JSON.
- Configure the display currency and manual exchange rates.
- Use separate Dashboard, Transactions, Settings, and About pages.
- View transaction records in a responsive layout.

## Data Model

Every Transaction contains:

| Field | Description |
|---|---|
| `id` | Unique transaction identifier |
| `description` | Transaction description |
| `amount` | Numeric transaction amount |
| `type` | `income` or `expense` |
| `category` | Transaction category |
| `date` | Transaction date in `YYYY-MM-DD` format |
| `createdAt` | Creation timestamp |
| `updatedAt` | Most recent update timestamp |

Transaction amounts are stored as numeric values. Currency display settings affect presentation and do not change the stored transaction amounts.

## Regular Expression Catalog

### 1. Description spacing

Pattern: `/^\S(?:.*\S)?$/`

Checks that a description does not begin or end with whitespace. A separate check, `/\s{2,}/`, rejects repeated whitespace.

Examples:
- `Weekly groceries` — accepted.
- ` Weekly groceries` — rejected.
- `Weekly  groceries` — rejected.

### 2. Amount format

Pattern: `/^(0|[1-9]\d*)(\.\d{1,2})?$/`

Accepts non-negative whole numbers or numbers with one or two decimal places.

Examples:
- `2500` — accepted.
- `2500.75` — accepted.
- `2500.755` — rejected.
- `-25` — rejected.

### 3. Date format

Pattern: `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/`

Checks the `YYYY-MM-DD` format and valid month/day ranges. Additional JavaScript date checks reject impossible calendar dates.

Examples:
- `2026-10-12` — accepted.
- `2026-13-12` — rejected.
- `2026-02-30` — rejected.

### 4. Category format

Pattern: `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/`

Allows alphabetic words separated by a single space or hyphen.

Examples:
- `Transport` — accepted.
- `Personal Care` — accepted.
- `Food2` — rejected.

### 5. Duplicate-word detection

Pattern: `/\b(\w+)\s+\1\b/i`

Uses a capturing group and back-reference to detect a repeated word. The `i` flag makes matching case-insensitive.

Examples:
- `food food` — detected.
- `Food food` — detected.
- `food transport` — no duplicate detected.

## Search and Sorting

The search field accepts regular expressions. Invalid expressions are caught and reported rather than crashing the application. Search can be case-sensitive or case-insensitive, and matches are highlighted.

Available sorting options include:
- Date ascending and descending.
- Description ascending and descending.
- Amount ascending and descending.

## Keyboard Navigation

- `Tab` — move to the next interactive element.
- `Shift + Tab` — move to the previous interactive element.
- `Enter` — activate a focused link or button.
- `Space` — activate a focused button or checkbox.
- `Esc` — dismiss certain browser dialogs or controls when supported.

A skip link is provided to help keyboard users reach the main content.

## Accessibility

The application aims to support accessible use through:
- Semantic HTML landmarks and headings.
- Labels for form controls.
- Accessible names for transaction action buttons.
- Visible keyboard focus styles.
- A skip link to main content.
- Live regions for important status messages.
- Responsive layouts for mobile, tablet, and desktop screens.

## Persistence and JSON

Transactions are stored in browser localStorage so they remain available after refreshing the page in the same browser.

Use the application's export feature to download transaction data as JSON. Use the import feature to select a JSON file; imported data is validated before it replaces the current records.

The `seed.json` file contains sample transaction records for testing and demonstration.

## Running the Project Locally

1. Clone or download this repository.
2. Open a terminal in the project directory.
3. Start a local web server:

   ```bash
   python3 -m http.server 8000
   ```

4. Open `http://localhost:8000/` in your browser.
5. Open `http://localhost:8000/tests.html` to run the validation tests.
6. Stop the server with `Ctrl + C` when finished.

Run the project through a local web server because the JavaScript modules use browser module imports.

## Validation Tests

The `tests.html` page runs automated checks against the validation functions in `scripts/validators.js`.

The tests cover:
- Description spacing.
- Amount format and decimal precision.
- Date format and calendar validity.
- Category format.
- Duplicate-word detection.

Open the test page in a browser and check that all tests pass.

## Project Structure

```text
.
├── index.html
├── pages/
│   ├── dashboard.html
│   ├── transactions.html
│   ├── settings.html
│   └── about.html
├── styles/
│   └── style.css
├── scripts/
│   ├── main.js
│   ├── search.js
│   ├── state.js
│   ├── storage.js
│   ├── ui.js
│   └── validators.js
├── assets/
│   └── wireframe.txt
├── seed.json
├── tests.html
├── PROJECT_SPEC.md
└── README.md
```

## Deployment

The Student Finance Tracker is deployed using GitHub Pages.

**Live Demo:** https://abigail-cobbina.github.io/frontend_summative_Abigail-Cobbina/

**Repository:** https://github.com/Abigail-Cobbina/frontend_summative_Abigail-Cobbina

## Demo Video

**Status:** To be added after recording.

The unlisted 2–3 minute demo video will demonstrate:

1. Keyboard navigation through the application.
2. Form validation and regular expression edge cases.
3. Adding, editing, and deleting transactions.
4. Regex search, sorting, and dashboard statistics.
5. JSON data import and export.
6. Currency settings and data persistence.

The video link will be added here after the recording is uploaded.
