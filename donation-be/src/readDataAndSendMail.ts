// Google sheet npm package
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';
import fs from 'fs';
import { sendMail } from './sendMail'; // Import the sendMail function
import { RowData } from './interfaces'; // Import the RowData interface
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config(); // Load environment variables from .env file

// Spreadsheet key is the long ID in the sheets URL
const RESPONSES_SHEET_ID: string = process.env.RESPONSES_SHEET_ID!;

// Credentials for the service account
const CREDENTIALS: { private_key: string } = JSON.parse(fs.readFileSync(`${path.join(__dirname,process.env.service_cred!)}`, 'utf8'));

const serviceAccountAuth = new JWT({
    email: process.env.client_email,
    key: CREDENTIALS.private_key,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ],
});

// Create a new GoogleSpreadsheet instance
const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID, serviceAccountAuth);

// Function to get and process rows from the spreadsheet and send email
export const readDataAndSendMail = async (startingRowNo: number, endingRowNo: number): Promise<void> => {
    try {
        startingRowNo -= 2; // Adjust index to account for header rows
        endingRowNo -= 2; // Adjust index to account for header rows
        // Load the document info
        await doc.loadInfo();

        // Get the first sheet
        let sheet = doc.sheetsByIndex[0];

        // Get all the rows
        let rows = await sheet.getRows();

        // Loop through each row
        for (let index = startingRowNo; index <= endingRowNo; index++) {
            const row = rows[index];
            if (row) {
                // Extract necessary data from the row
                const data: RowData = {
                    "Receipt No": row.get('Receipt No'), // Assuming 'Receipt No' is a column in the sheet
                    "Today’s Date": row.get('Today’s Date'),
                    "Name": row.get('Name:'),
                    "Address": row.get('Address'),
                    "PAN": row.get('PAN'),
                    "Phone number": row.get('Phone number'),
                    "Email": row.get('Email'), // Assuming 'email' is a column in the sheet
                    "Amount Received": row.get('Amount Received'),
                    "Mode of Payment": row.get('Mode of Payment'),
                    "Check/CC/Reference Number": row.get('Check/CC/Reference Number'),
                    "This donation has gone towards": row.get('This donation has gone towards')
                };
                // Call sendMail function with row data
                await sendMail(data);
            }
        }
    } catch (error) {
        console.log(error)
        throw error;
    }
};
