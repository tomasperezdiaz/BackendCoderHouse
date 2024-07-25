import bcrypt from "bcrypt";

export const createHash = (password) => {
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  
};

export const isValidPass = (password, userPassword) => {
  const passValid = bcrypt.compareSync(password, userPassword);
  return passValid;
};

