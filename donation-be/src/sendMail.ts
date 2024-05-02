import { createTransport, SendMailOptions, Transporter } from "nodemailer";
import { RowData } from "./interfaces.js";
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
import { PDFDocument } from "pdf-lib";
import { ToWords } from 'to-words';

dotenv.config(); // Load environment variables from .env file

const toWords = new ToWords({
    localeCode: 'en-IN',
    converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
        currencyOptions: {
            // can be used to override defaults for the selected locale
            name: 'Rupee',
            plural: 'Rupees',
            symbol: '₹',
            fractionalUnit: {
                name: 'Paisa',
                plural: 'Paise',
                symbol: '',
            },
        },
    },
});

export const sendMail = async (rowData: RowData): Promise<void> => {

    const toWords = new ToWords({
        localeCode: 'en-IN',
        converterOptions: {
            currency: true,
            ignoreDecimal: false,
            ignoreZeroCurrency: false,
            doNotAddOnly: false,
            currencyOptions: {
                // can be used to override defaults for the selected locale
                name: 'Rupee',
                plural: 'Rupees',
                symbol: '₹',
                fractionalUnit: {
                    name: 'Paisa',
                    plural: 'Paise',
                    symbol: '',
                },
            },
        },
    });


    try {

        helper(rowData);

        // Now, you can send an email after navigating to the endpoint and intercepting the request
        // Create a transporter using Gmail service
        const transporter: Transporter = createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER!, // Use environment variables instead of hardcoding
                pass: process.env.EMAIL_PASS!, // Use environment variables instead of hardcoding
            },
        });

        // Update the mailOptions object with the PDF attachment
        const mailOptions: SendMailOptions = {
            from: process.env.EMAIL_USER!,
            to: rowData.Email,
            subject: "Invoice",
            html: `Hey ${rowData.Name}, Please find the invoice attached.`,
            attachments: [{
                filename: "invoice.pdf",
                path: path.join(__dirname, process.env.OUTPUT_PDF_PATH),
                contentType: 'application/pdf'
            }]
        };

        // Send email with PDF attachment
        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
};

async function appendTextToPDF(pdfDoc, contents) {
    contents.forEach((content) => {
        pdfDoc.getPages()[content.pageNo]?.drawText(content.text, {
            x: content.x,
            y: content.y,
            size: content.size,
            bold: content.bold,
            color: content.color,
        });
    });
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}

const helper = async (data: RowData) => {
    const existingPdfBytes = fs.readFileSync(path.join(__dirname, process.env.INPUT_PDF_PATH));
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const updatedPdfBytes = await appendTextToPDF(pdfDoc, [
        {
            text: data["Receipt No"],
            pageNo: 0,
            x: 428,
            y: 560,
            size: 12,
        },
        {
            text: data["Today’s Date"],
            pageNo: 0,
            x: 395,
            y: 539,
            size: 12,
        },
        {
            text: data["Name"],
            pageNo: 0,
            x: 112.44,
            y: 507,
            size: 12,
        },
        {
            text: data["Address"],
            pageNo: 0,
            x: 125.44,
            y: 489,
            size: 12,
        },
        {
            text: data["PAN"],
            pageNo: 0,
            x: 110.44,
            y: 472,
            size: 12,
        },
        {
            text: 'INR ' + parseInt(data["Amount Received"]).toLocaleString('en-IN') + '/- (' + toWords.convert(parseInt(data["Amount Received"])) + ')',
            pageNo: 0,
            x: 178,
            y: 454.4,
            size: 12,
        },
        {
            text: data["Mode of Payment"],
            pageNo: 0,
            x: 177,
            y: 435,
            size: 12,
        },
        {
            text: data["Check/CC/Reference Number"],
            pageNo: 0,
            x: 250,
            y: 417.5,
            size: 12,
        },
        {
            text: data["This donation has gone towards"],
            pageNo: 0,
            x: 258,
            y: 400,
            size: 12,
        }
    ]);

    // Write the updated PDF bytes to a new file
    fs.writeFileSync(path.join(__dirname, process.env.OUTPUT_PDF_PATH), updatedPdfBytes);
}
