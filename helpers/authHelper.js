// Two functions:
// 1) One to perform hash
// 2) Another is to compare and decrypt

import bcrypt from "bcrypt";

import colors from "colors";
const { bgRed } = colors;

export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    // console.log(`Error in hashPassword, inside authHelper.js: ${error}`.bgRed.white);
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
  } catch (error) {
    // console.log(`Error in hashPassword, inside comparePassword.js: ${error}`.bgRed.white);
  }
};
