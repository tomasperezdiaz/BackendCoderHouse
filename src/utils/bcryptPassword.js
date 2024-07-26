import bcrypt from "bcrypt";

export const createHash = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const passHash = bcrypt.hashSync(password, salt);
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  return passHash;
};

export const isValidPass = (password, userPassword) => {
  const passValid = bcrypt.compareSync(password, userPassword);
  return passValid;
};

export const createHashs = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validatePasswordd = (password, user) =>
  bcrypt.compareSync(password, user.password);
