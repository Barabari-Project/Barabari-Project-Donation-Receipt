import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

// Retrieve the secret key from environment variables
const secretKey: string = process.env.IMAGE_SECRET_KEY!;

// Function to encrypt the number
const imageEncryption = (i: number): string => {
    return i;
    const dataObj = { key: i }; // Create an object with the number
    const objStr = JSON.stringify(dataObj); // Convert object to JSON string
    const encryptedObj = CryptoJS.AES.encrypt(objStr, secretKey).toString(); // Encrypt JSON string
    return encryptedObj; // Return encrypted value
};

export default imageEncryption;
