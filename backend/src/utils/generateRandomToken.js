import crypto from "crypto"

export const generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString("base64").slice(0, length)
}
// Usage example:
// const token = generateRandomToken(16);
// console.log(token); // Outputs a random token of 16 characters
