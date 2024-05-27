import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import * as XLSX from 'xlsx';
import decryptData from '../utils/decryptData.js';
import { readDataAndSendMail } from './readDataAndSendMail.js';
import { ToWords } from 'to-words';

dotenv.config(); // Load environment variables from .env file

// Check if all required environment variables are present
const requiredEnvVariables = [
    'PORT',
    'RESPONSES_SHEET_ID',
    'EMAIL_USER',
    'EMAIL_PASS',
    'ENV',
    'CRYPTO_SECRET_KEY',
    'PASSWORD',
    'FRONTEND_BASE_URI',
    'CLIENT_EMAIL',
    'OUTPUT_PDF_PATH',
    'INPUT_PDF_PATH',
    'SERVICE_CRED'
];

const missingEnvVariables = requiredEnvVariables.filter(variable => !process.env[variable]);
if (missingEnvVariables.length > 0) {
    throw new Error(`Required environment variables are missing: ${missingEnvVariables.join(', ')}`);
}

const app = express();
const PORT = parseInt(process.env.PORT || '3000'); // Use port from environment variables or default to 3000

app.use(express.json()); // Enable JSON parsing middleware

// Enable CORS with specific origin
app.use(cors({
    origin: process.env.FRONTEND_BASE_URI
}));

// Set up morgan middleware for logging
app.use(morgan(process.env.ENV!));

const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for multer

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('Server Is Running');
});

// Route for handling POST requests with file upload
app.post('/', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
    const encryptedData = req.body.encryptedData;
    const {
        startingRowNo,
        endingRowNo,
        fileData,
        email,
        ccEmail,
        password } = decryptData(encryptedData);

    try {
        // Your existing logic
        await readDataAndSendMail(startingRowNo, endingRowNo, fileData,email,ccEmail,password);
        res.status(200).send();
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(400).send(err.message);
});

// Start the server
const server = app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Gracefully close the server and then exit
    server.close(() => {
        process.exit(1);
    });
});
