import { RowData } from '../src/interfaces.js';

// Define a function to validate the row data
export function validateRow(row: RowData, rowNumber: Number) {
    // Validate each field
    if (
        !row['Receipt No'] ||
        !row['Today’s Date'] ||
        !row['Name'] ||
        !row['Address'] ||
        !row['PAN'] ||
        !row['Phone number'] ||
        !row['Email'] ||
        !row['Amount Received'] ||
        !row['Mode of Payment'] ||
        !row['Check/CC/Reference Number'] ||
        !row['This donation has gone towards']
    ) {
        throw new Error('Invalid row: Some fields are empty in Row No :- ' + rowNumber);
    }

    // Validate email format using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(row['Email'])) {
        throw new Error('Invalid row: Email format is not valid in Row No :- ' + rowNumber);
    }

}