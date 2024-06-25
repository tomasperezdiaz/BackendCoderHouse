import bcrypt from "bcrypt";

export const createHash = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const passHash = bcrypt.hashSync(password, salt);
  
  return passHash;
};

export const isValidPass = (password, userPassword) => {
  const passValid = bcrypt.compareSync(password, userPassword);
  return passValid;
};
