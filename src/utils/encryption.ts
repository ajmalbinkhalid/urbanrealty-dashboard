import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY as string;

export const encrypt = (text: string): string => {
  if (!SECRET_KEY) {
    throw new Error("NEXT_PUBLIC_SECRET_KEY is not defined");
  }

  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decrypt = (cipherText: string): string => {
  if (!(cipherText && SECRET_KEY)) {
    return "";
  }

  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
