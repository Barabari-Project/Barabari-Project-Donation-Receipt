import { createTransport } from "nodemailer";
import dotenv from 'dotenv';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import imageEncryption from "../utils/imageEncryption.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config(); // Load environment variables from .env file
import pdf from 'html-pdf';


export const sendMail = async (rowData) => {
    // Extract email ID from row data
    const mailId = rowData.Email;
    // Ensure email ID is present
    if (!mailId) {
        throw new Error("Email ID is not provided in row data");
    }
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        // Set up request interception
        await page.setRequestInterception(true);
        const images = {};
        for (let i = 1; i <= 6; i++) {
            images[i.toString()] = `image/${imageEncryption(i)}`;
        }
        const html = await ejs.renderFile(path.join(__dirname, process.env.CONTENT_PATH), { data, images });
        // Intercept requests and modify as needed
        // page.on("request", async (interceptedRequest) => {
        //     if (interceptedRequest.url().includes('/abc')) {
        //         // Intercept the request to '/abc' and continue with custom data
        //         await interceptedRequest.continue({
        //             method: "POST",
        //             postData: JSON.stringify({ data: rowData, password: process.env.PASSWORD, images }),
        //             headers: { "Content-Type": "application/json" },
        //         });
        //     }
        //     else {
        //         // Continue other requests as normal
        //         await interceptedRequest.continue();
        //     }
        // });
        // // Navigate to the endpoint where request will be intercepted
        // await page.goto(`${process.env.BASE_URI}/abc`, {
        //     waitUntil: "networkidle2"
        // });
        // await page.pdf({
        //     path: path.join(__dirname, '../../PDF/123.pdf'),
        //     format: 'A4'
        // });
        // // Close the browser after navigation
        // await browser.close();

        pdf.create(htmlContent).toFile(path.join(__dirname, '../../PDF/123.pdf'), (err, res) => {
            if (err) return console.log(err);
            console.log('PDF generated successfully:', res);
        });

        // Now, you can send an email after navigating to the endpoint and intercepting the request
        // Create a transporter using Gmail service
        const transporter = createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Use environment variables instead of hardcoding
                pass: process.env.EMAIL_PASS, // Use environment variables instead of hardcoding
            },
        });
        // Update the mailOptions object with the PDF attachment
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: mailId,
            subject: "Invoice",
            html: `Hey ${rowData.Name}, Please find the invoice attached.`,
            attachments: [{
                filename: "invoice.pdf",
                path: path.join(__dirname, '../../PDF/123.pdf'),
                contentType: 'application/pdf'
            }]
        };
        // Send email with PDF attachment
        const info = await transporter.sendMail(mailOptions);
    }
    catch (error) {
        throw error;
    }
};
//# sourceMappingURL=sendMail.js.map