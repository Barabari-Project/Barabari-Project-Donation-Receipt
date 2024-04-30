import { createTransport, SendMailOptions, Transporter } from "nodemailer";
import { RowData } from "./interfaces.js";
import ejs from 'ejs';
import dotenv from 'dotenv';
import path from 'path';
import pdf from 'html-pdf';
import fs from 'fs';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
import { PDFDocument } from "pdf-lib";

dotenv.config(); // Load environment variables from .env file

export const sendMail = async (rowData: RowData): Promise<void> => {

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
            x: 418.44,
            y: 547.69,
            size: 12,
        },
        {
            text: data["Today’s Date"],
            pageNo: 0,
            x: 430.44,
            y: 525.69,
            size: 12,
        },
        {
            text: data["Name"],
            pageNo: 0,
            x: 112.44,
            y: 493,
            size: 12,
        },
        {
            text: data["Address"],
            pageNo: 0,
            x: 125.44,
            y: 465.69,
            size: 12,
        },
        {
            text: data["PAN"],
            pageNo: 0,
            x: 110.44,
            y: 439.69,
            size: 12,
        },
        {
            text: data["Phone number"],
            pageNo: 0,
            x: 162.44,
            y: 412,
            size: 12,
        },
        {
            text: data["Email"],
            pageNo: 0,
            x: 110.44,
            y: 385.69,
            size: 12,
        },
        {
            text: data["Amount Received"],
            pageNo: 0,
            x: 176,
            y: 358.69,
            size: 12,
        },
        {
            text: data["Mode of Payment"],
            pageNo: 0,
            x: 177,
            y: 331.69,
            size: 12,
        },
        {
            text: data["Check/CC/Reference Number"],
            pageNo: 0,
            x: 241,
            y: 304,
            size: 12,
        },
        {
            text: data["This donation has gone towards"],
            pageNo: 0,
            x: 255,
            y: 277.69,
            size: 12,
        }
    ]);

    // Write the updated PDF bytes to a new file
    fs.writeFileSync(path.join(__dirname, process.env.OUTPUT_PDF_PATH), updatedPdfBytes);
}
