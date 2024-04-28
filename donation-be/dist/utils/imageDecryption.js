import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file
// Retrieve the secret key from environment variables
const secretKey = process.env.IMAGE_SECRET_KEY;
// Function to decrypt the encrypted value and return the original number
const imageDecryption = (encryptedValue) => {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey); // Decrypt the encrypted value
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8); // Convert decrypted bytes to string
    const decryptedObj = JSON.parse(decryptedString); // Parse the decrypted string to object
    return decryptedObj.key; // Return the original number
};
export default imageDecryption;
//# sourceMappingURL=imageDecryption.js.map