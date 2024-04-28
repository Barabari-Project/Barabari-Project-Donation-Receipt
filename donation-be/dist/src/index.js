import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
import decryptData from '../utils/decryptData.js';
import imageDecryption from '../utils/imageDecryption.js';
import { readDataAndSendMail } from './readDataAndSendMail.js';
dotenv.config(); // Load environment variables from .env file
// Check if all required environment variables are present
const requiredEnvVariables = ['PORT', 'RESPONSES_SHEET_ID', 'EMAIL_USER', 'EMAIL_PASS', 'ENV', 'CRYPTO_SECRET_KEY', 'PASSWORD', 'BASE_URI', 'FRONTEND_BASE_URI', 'client_email', 'IMAGE_SECRET_KEY', 'service_cred', 'image_dir_url'];
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
app.use(morgan(process.env.ENV));
// Route for handling POST requests
app.post('/', async (req, res, next) => {
    const { startingRowNo, endingRowNo, password } = decryptData(req.body.encryptedData);
    if (password == process.env.PASSWORD) {
        try {
            await readDataAndSendMail(startingRowNo, endingRowNo);
            res.status(200).send();
        }
        catch (error) {
            next(error); // Pass the error to the error handling middleware
        }
    }
    else {
        throw new Error('Invalid Credentials');
    }
});
// Route for handling POST requests to "/abc" endpoint
app.post("/abc", async (req, res) => {
    try {
        // Destructure the request body to get RowData and password
        const { data, password, images } = req.body;
        // Check if the provided password matches the one from environment variables
        if (password === process.env.PASSWORD) {
            // Render the EJS template with the provided data
            const html = await ejs.renderFile(path.join(__dirname, '../../content.ejs'), { data, images });
            // Send the rendered HTML as response
            return res.status(200).send(html);
        }
        else {
            // If password doesn't match, throw an error
            throw new Error('Invalid Credentials');
        }
    }
    catch (error) {
        // Catch any errors and send an error response
        return res.status(500).json({ error: error.message });
    }
});
// Route for serving images based on ID
app.get('/image/:id', (req, res) => {
    // Serve different images based on ID
    if (imageDecryption(req.params.id) === 1) {
        res.sendFile(`${path.join(__dirname, process.env.image_dir_url, 'image1.png')}`);
    }
    else if (imageDecryption(req.params.id) === 2) {
        res.sendFile(`${path.join(__dirname, process.env.image_dir_url, ',mage2.png')}`);
    }
    else if (imageDecryption(req.params.id) === 3) {
        res.sendFile(`${path.join(__dirname, process.env.image_dir_url, 'image3.png')}`);
    }
    else if (imageDecryption(req.params.id) === 4) {
        res.sendFile(`${path.join(__dirname, process.env.image_dir_url, 'image4.png')}`);
    }
    else if (imageDecryption(req.params.id) === 5) {
        res.sendFile(`${path.join(__dirname, process.env.image_dir_url, 'image5.png')}`);
    }
    else if (imageDecryption(req.params.id) === 6) {
        res.sendFile(`${path.join(__dirname, process.env.image_dir_url, 'image6.png')}`);
    }
    else {
        res.status(404).send('Image not found');
    }
});
// Error handling middleware
app.use((err, req, res, next) => {
    res.status(500).send(err.message);
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
//# sourceMappingURL=index.js.map