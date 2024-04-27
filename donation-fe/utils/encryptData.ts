import CryptoJS from 'crypto-js';

const secretKey = import.meta.env.VITE_CRYPTO_SECRET_KEY as string;

const encryptData = (dataObj: any) => {
    console.log('this is key '+secretKey);
    const objStr = JSON.stringify({ ...dataObj });
    const encryptedObj = CryptoJS.AES.encrypt(objStr, secretKey).toString();
    const bytes = CryptoJS.AES.decrypt(encryptedObj, secretKey); // Using empty string as fallback if secret key is undefined
    console.log('we decrypted the data');
    // Parse the decrypted bytes to JSON
    console.log(bytes)
    const temp = bytes.toString(CryptoJS.enc.Utf8);
    console.log(temp)
    const decryptedObj = JSON.parse(temp);
    console.log(decryptedObj);
    return encryptedObj;
};

export default encryptData;