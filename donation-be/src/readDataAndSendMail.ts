// Google sheet npm package
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';
import fs from 'fs';
import { sendMail } from './sendMail.js'; // Import the sendMail function
import { RowData } from './interfaces.js'; // Import the RowData interface
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { validateRow } from '../utils/validateRowData.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config(); // Load environment variables from .env file

// Spreadsheet key is the long ID in the sheets URL
// const RESPONSES_SHEET_ID: string = process.env.RESPONSES_SHEET_ID!;

// Credentials for the service account
// const CREDENTIALS: { private_key: string } = JSON.parse(fs.readFileSync(`${path.join(__dirname, process.env.SERVICE_CRED!)}`, 'utf8'));

// const serviceAccountAuth = new JWT({
//     email: process.env.CLIENT_EMAIL,
//     key: CREDENTIALS.private_key,
//     scopes: [
//         'https://www.googleapis.com/auth/spreadsheets',
//     ],
// });

// Create a new GoogleSpreadsheet instance
// const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID, serviceAccountAuth);

// Function to get and process rows from the spreadsheet and send email
export const readDataAndSendMail = async (
    startingRowNo: number,
    endingRowNo: number,
    fileData: RowData[],
    email: string,
    ccEmail: string[],
    password: string): Promise<void> => {
    try {
        startingRowNo -= 2; // Adjust index to account for header rows
        endingRowNo -= 2; // Adjust index to account for header rows
        // Load the document info
        // await doc.loadInfo();

        // // Get the first sheet
        // let sheet = doc.sheetsByIndex[0];

        // // Get all the rows
        // let rows = await sheet.getRows();

        // Loop through each row
        for (let index = startingRowNo; index <= endingRowNo; index++) {
            const row = fileData[index];
            console.log(row);
            if (row) {
                // Extract necessary data from the row
                const data: RowData = {
                    "Receipt No": row['Receipt No'], // Assuming 'Receipt No' is a column in the sheet
                    "Today’s Date": row['Today’s Date'],
                    "Name": row['Name:'],
                    "Address": row['Address'],
                    "PAN": row['PAN'],
                    "Phone number": row['Phone number'],
                    "Email": row['Email'], // Assuming 'email' is a column in the sheet
                    "Amount Received": row['Amount Received'],
                    "Mode of Payment": row['Mode of Payment'],
                    "Check/CC/Reference Number": row['Check/CC/Reference Number'],
                    "This donation has gone towards": row['This donation has gone towards']
                };
                validateRow(data, index + 2);
                await sendMail(data,email,ccEmail,password);
            }
        }
    } catch (error) {
        console.log(error)
        throw error;
    }
};
