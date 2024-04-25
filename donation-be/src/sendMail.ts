import { createTransport, SendMailOptions, Transporter } from "nodemailer";
import { RowData } from "./interfaces";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

export const sendMail = async (rowData: RowData): Promise<void> => {
    // Extract email ID from row data
    const mailId: string = rowData.email;
    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS);
    console.log(process.env.RESPONSES_SHEET_ID);
    new Error('facing some issues');
    // Ensure email ID is present
    if (!mailId) {
        throw new Error("Email ID is not provided in row data");
    }

    // Create a transporter using Gmail service
    const transporter: Transporter = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER!, // Use environment variables instead of hardcoding
            pass: process.env.EMAIL_PASS!, // Use environment variables instead of hardcoding
        },
    });

    try {
        // Send email with attachment
        const mailOptions: SendMailOptions = {
            from: process.env.EMAIL_USER!,
            to: mailId,
            subject: "Invoice",
            html: "<b>We will get this kind of pdf in invoice for billing.</b>",
            attachments: [{
                filename: 'Invoice_Bill.pdf',
                path: `PDF/${"abc"}.pdf`, // Adjust the path to your PDF file
                contentType: 'application/pdf'
            }],
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Message sent:", info.messageId);
    } catch (error) {
        throw error;
    }
};
