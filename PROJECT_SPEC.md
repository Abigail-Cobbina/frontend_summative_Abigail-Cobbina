# Student Finance Tracker — Project Specification

## 1. Project Overview

The Student Finance Tracker is a responsive web application designed to help students manage their personal finances. It allows students to record their income and expenses, monitor their spending, and understand how they use their money.

## 2. Problem Statement

Students need a simple way to keep track of their money. Without organized records, it can be difficult to know how much money they have, how much they spend, and which categories take up most of their budget.

This application aims to make personal financial tracking easier and more organized.

## 3. Target Users

The primary users are students who want to manage their income, expenses, and spending habits.

## 4. Project Objectives

* Allow users to record income and expenses.
* Display the user's balance, total income, and total expenses.
* Organize transactions by category and date.
* Allow users to search, sort, edit, and delete transactions.
* Provide spending statistics and budget tracking.
* Save financial records locally in the browser.
* Support importing and exporting records as JSON files.
* Provide a responsive, accessible interface that works on mobile phones, tablets, and desktop computers.

## 5. Core Features

1. **Dashboard:** Displays the current balance, total income, and total expenses.
2. **Transaction Form:** Collects a description, amount, transaction type, category, and date.
3. **Transaction History:** Displays recorded transactions in a responsive layout.
4. **Validation:** Uses regular expressions and appropriate input checks to validate user entries.
5. **Search and Sorting:** Allows users to search transactions and sort records by relevant fields.
6. **Statistics:** Summarizes financial activity and helps users monitor a budget target.
7. **Data Persistence:** Uses local storage to retain records between visits.
8. **Import and Export:** Allows users to import and export JSON transaction data after validation.
9. **Settings:** Supports preferences such as currency, manual exchange rates, and editable categories.
10. **Accessibility:** Includes semantic HTML, keyboard navigation, visible focus indicators, and accessible status messages.

## 6. Default Transaction Categories

* Food
* Books
* Transport
* Entertainment
* Fees
* Other

## 7. Technologies

* HTML for the structure and content.
* CSS for styling and responsive layouts.
* Vanilla JavaScript for validation, interaction, calculations, and data management.
* Browser local storage for saving records.
* JSON for importing and exporting data.

## 8. Design and Accessibility Requirements

The application will use a mobile-first layout, Flexbox, and media queries. It will include clear form labels, semantic page sections, keyboard-accessible controls, visible focus indicators, and appropriate status announcements.

## 9. Expected Outcome

The completed application will provide students with a practical, accessible tool for recording transactions, reviewing spending patterns, and managing a personal budget.

