
# Student Finance Tracker

## Project Overview

The Student Finance Tracker is a responsive web application that helps students manage their income and expenses. Users can record transactions, organize them by category, search and sort records, and monitor their financial activity through a dashboard.

## Theme

**Student Finance Tracker**

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Regular Expressions (Regex)
- JSON for data import and export
- Local Storage for data persistence

## Links

- **GitHub Repository:** https://github.com/Abigail-Cobbina/frontend_summative_Abigail-Cobbina
- **Live Website:** https://abigail-cobbina.github.io/frontend_summative_Abigail-Cobbina/
- **Demo Video:** https://youtu.be/jBXJ5kamu4U

## Features

- Add income and expense transactions.
- Edit and delete transactions.
- Validate transaction descriptions, amounts, dates, and categories.
- Search transactions using regular expressions.
- Highlight matching search results.
- Sort transactions.
- View dashboard statistics for income and expenses.
- Import and export transaction data using JSON files.
- Save transaction data using Local Storage.
- Navigate the application using the keyboard.
- Use a responsive layout across different screen sizes.
- Display validation feedback when entered information is invalid.

## Data Model

Each transaction contains the following information:

| Field | Description |
|---|---|
| `id` | Unique transaction identifier |
| `type` | Transaction type: income or expense |
| `description` | Description of the transaction |
| `amount` | Transaction amount |
| `category` | Category assigned to the transaction |
| `date` | Date of the transaction |

## Regex Validation Catalog

Regular expressions are used to validate user input and identify patterns.

### 1. Description Validation

**Pattern:**

```regex
^\S(?:.*\S)?$
```

**Purpose:** Checks that a description does not begin or end with whitespace.

**Examples:**
- `Lunch` — valid
- `Bus fare` — valid
- ` Lunch` — invalid
- `Lunch ` — invalid

The application also checks for repeated consecutive whitespace:

```regex
\s{2,}
```

This prevents descriptions containing two or more consecutive whitespace characters.

### 2. Amount Validation

**Pattern:**

```regex
^(0|[1-9]\d*)(\.\d{1,2})?$
```

**Purpose:** Accepts non-negative whole numbers or decimal amounts with up to two decimal places.

**Examples:**
- `100` — valid
- `25.50` — valid
- `0.99` — valid
- `-20` — invalid
- `12.345` — invalid
- `abc` — invalid

### 3. Date Validation

**Pattern:**

```regex
^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$
```

**Purpose:** Checks that a date follows the `YYYY-MM-DD` format and that its month and day fall within the pattern's permitted ranges.

The application also checks the actual calendar date using JavaScript, which rejects impossible dates.

**Examples:**
- `2026-10-17` — valid
- `2024-02-29` — valid
- `2026-13-01` — invalid
- `2026-02-30` — invalid

### 4. Category Validation

**Pattern:**

```regex
^[A-Za-z]+(?:[ -][A-Za-z]+)*$
```

**Purpose:** Accepts category names containing letters, with optional single spaces or hyphens between words.

**Examples:**
- `Food` — valid
- `Transport` — valid
- `School Supplies` — valid
- `Home-Care` — valid
- `Food123` — invalid
- `Food@Home` — invalid

### 5. Duplicate Word Detection

**Pattern:**

```regex
\b(\w+)\s+\1\b
```

**Purpose:** Detects a repeated word appearing consecutively. The application uses the case-insensitive flag (`i`).

**Examples:**
- `food food` — duplicate detected
- `Lunch lunch` — duplicate detected
- `food transport` — no duplicate detected

The capturing group `(\w+)` matches a word, and the back-reference `\1` checks whether the same word appears again.

## Search and Sorting

The application supports regex-based transaction searches. Matching results are highlighted to help users identify relevant transactions.

Invalid regular-expression syntax is handled by displaying an error message instead of allowing the search to fail silently.

Users can also sort transaction records to make financial information easier to review.

## Keyboard Navigation

The application supports keyboard interaction through the following keys where applicable:

| Key | Function |
|---|---|
| `Tab` | Move to the next focusable element |
| `Shift + Tab` | Move to the previous focusable element |
| `Enter` | Activate a focused link or button |
| `Space` | Activate supported buttons or controls |
| `Esc` | Dismiss supported interfaces or cancel an active interaction where implemented |

Visible focus indicators help users identify the currently focused element.

## Accessibility Notes

Accessibility considerations include:

- Semantic HTML elements to provide meaningful page structure.
- Labels for form controls.
- Accessible names for interactive buttons.
- Keyboard navigation and visible focus indicators.
- Inline validation feedback to help users correct input.
- Appropriate ARIA attributes for invalid fields and dynamic status messages.
- Text-based search highlighting using `<mark>` elements.
- Responsive layouts that support different screen sizes.

## Data Persistence and JSON

The application uses Local Storage to preserve transaction data between page visits.

Users can export transaction data as JSON and import JSON data into the application.

The project includes a `seed.json` file containing sample transaction records for testing and demonstration.

## Running the Project Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/Abigail-Cobbina/frontend_summative_Abigail-Cobbina.git
   ```

2. Navigate into the project directory:

   ```bash
   cd frontend_summative_Abigail-Cobbina
   ```

3. Start a local HTTP server. If Python is installed, run:

   ```bash
   python -m http.server 8000
   ```

4. Open the application in your browser:

   ```text
   http://localhost:8000/
   ```

5. To run the validation tests, open:

   ```text
   http://localhost:8000/tests.html
   ```

## Validation Tests

The project includes a test page for checking input validation and related functionality.

The tests cover examples such as:

- Valid and invalid descriptions.
- Valid and invalid amounts.
- Valid and invalid dates.
- Valid and invalid categories.
- Duplicate word detection.
- Other implemented validation cases.

Open `tests.html` through the local HTTP server to run the tests.

## Project Structure

```text
frontend_summative_Abigail-Cobbina/
├── index.html
├── pages/
├── scripts/
├── styles/
├── assets/
├── seed.json
├── tests.html
├── PROJECT_SPEC.md
└── README.md
```

## Deployment

The application is deployed using GitHub Pages.

**Live Website:**  
https://abigail-cobbina.github.io/frontend_summative_Abigail-Cobbina/

**GitHub Repository:**  
https://github.com/Abigail-Cobbina/frontend_summative_Abigail-Cobbina

## Demo Video

The demo video presents the Student Finance Tracker's main features, including:

1. Keyboard navigation through the application.
2. Form validation and regular-expression edge cases.
3. Transaction management.
4. Regex search, sorting, and dashboard statistics.
5. JSON data import and export.
6. Responsive layouts across different screen sizes.
7. Data persistence.

[Watch the Student Finance Tracker Demo](https://youtu.be/jBXJ5kamu4U)

