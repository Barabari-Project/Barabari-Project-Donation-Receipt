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
import imageEncryption from "../utils/imageEncryption.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config(); // Load environment variables from .env file

export const sendMail = async (rowData: RowData): Promise<void> => {
    // Extract email ID from row data
    const mailId: string = rowData.Email;

    // Ensure email ID is present
    if (!mailId) {
        throw new Error("Email ID is not provided in row data");
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set up request interception
        await page.setRequestInterception(true);

        const images: Record<string, string> = {};

        for (let i = 1; i <= 6; i++) {
            images[i.toString()] = `http://localhost:3000/image/${imageEncryption(i)}`;
        }
        console.log('we are here');

        const html = await ejs.renderFile(path.join(__dirname, process.env.CONTENT_PATH), { data: rowData, images });

        pdf.create(html).toFile(path.join(__dirname, process.env.PDF_PATH), (err, res) => {
            if (err) return console.log(err);
            console.log('PDF generated successfully:', res);
        });

        // Intercept requests and modify as needed
        // page.on("request", async interceptedRequest => {
        //     if (interceptedRequest.url().includes('/abc')) {
        //         // Intercept the request to '/abc' and continue with custom data
        //         await interceptedRequest.continue({
        //             method: "POST",
        //             postData: JSON.stringify({ data: rowData, password: process.env.PASSWORD, images }),
        //             headers: { "Content-Type": "application/json" },
        //         });
        //     } else {
        //         // Continue other requests as normal
        //         await interceptedRequest.continue();
        //     }
        // });

        // // Navigate to the endpoint where request will be intercepted
        // await page.goto(`${process.env.BASE_URI}/abc`, {
        //     waitUntil: "networkidle2"
        // });

        // await page.pdf({
        //     path: path.join(__dirname, process.env.PDF_PATH),
        //     format: 'A4'
        // });

        // // Close the browser after navigation
        // await browser.close();

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
            to: mailId,
            subject: "Invoice",
            html: `Hey ${rowData.Name}, Please find the invoice attached.`,
            attachments: [{
                filename: "invoice.pdf",
                path: path.join(__dirname, process.env.PDF_PATH),
                contentType: 'application/pdf'
            }]
        };

        // Send email with PDF attachment
        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
};
