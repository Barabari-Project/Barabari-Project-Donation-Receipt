// Google sheet npm package
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';
import fs from 'fs';
import { sendMail } from './sendMail'; // Import the sendMail function
import { RowData } from './interfaces'; // Import the RowData interface

dotenv.config(); // Load environment variables from .env file

// Spreadsheet key is the long ID in the sheets URL
const RESPONSES_SHEET_ID: string = process.env.RESPONSES_SHEET_ID!;

// Credentials for the service account
const CREDENTIALS: { client_email: string, private_key: string } = JSON.parse(fs.readFileSync('service_cred.json', 'utf8'));

// Authenticate using JWT (JSON Web Tokens)
const serviceAccountAuth = new JWT({
    email: CREDENTIALS.client_email,
    key: CREDENTIALS.private_key,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ],
});

// Create a new GoogleSpreadsheet instance
const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID, serviceAccountAuth);
console.log('from read file data ' + RESPONSES_SHEET_ID)

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
                console.log(row.toObject());
                // Extract necessary data from the row
                const data: RowData = {
                    email: row.get('email'), // Assuming email is a column in the sheet
                    // Add more properties as needed
                };
                
                // Call sendMail function with row data
                await sendMail(data);
                console.log('mail sent successfully');
            } else {
                console.log("No data found at index:", index);
                console.log(row);
            }
        }
    } catch (error) {
        throw error;
    }
};
