import jwt from "jsonwebtoken";
import { userModel } from "../dao/mongo/models/user.js";
import { createHash, createHashs, isValidPass, validatePasswordd } from "../utils/bcryptPassword.js";
import { sendResetPassword } from "../utils/mailing.js";
import { CustomError } from "../utils/CustomError.js";
import { ERROR_TYPES } from "../utils/EErrors.js";

const JWT_SECRET = process.env.SECRET;

export const requestPasswordReset = (req, res) => {
  res.render("requestPassword");
};

export const sendPasswordResetEmail = async (req, res) => {
  const email = req.body.email;

  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return CustomError.createError(
        "ERROR",
        null,
        "No hay un usuario con ese email",
        ERROR_TYPES.ARGUMENTOS_INVALIDOS
      );
    }

    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    sendResetPassword(token, user);
    res
      .status(200)
      .send("Se te envio un email a " + user.email + " con las intrucciones");
  } catch (err) {
    return CustomError.createError(
      "ERROR",
      null,
      "Error al mandar el email",
      ERROR_TYPES.INTERNAL_SERVER_ERROR
    );
  }
};

export const resetPassword = (req, res) => {
  const token = req.params.token;

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.redirect("/requestPassword");
    }

    res.render("resetPassword", { token });
  });
};

export const updatePassword = async (req, res) => {
  const token = req.params.token;
  const newPassword = req.body.password;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return CustomError.createError(
        "ERROR",
        null,
        "No se encontro el usuario",
        ERROR_TYPES.NOT_FOUND
      );
    }
    if (!newPassword || !user.password) {
      return CustomError.createError(
        "ERROR",
        null,
        "La password tiene que estar completa",
        ERROR_TYPES.ARGUMENTOS_INVALIDOS
      );
    }

    const isSame = validatePasswordd(newPassword, user);
    if (isSame) {
      return CustomError.createError(
        "ERROR",
        null,
        "La nueva contraseña no puede ser igual que la antigua",
        ERROR_TYPES.ARGUMENTOS_INVALIDOS
      );
    }
    const hash = createHashs(newPassword);
    user.password = hash;
    await user.save();
    res.status(200).send("La contraseña se ha cambiado");
  } catch (err) {
    return CustomError.createError(
      "ERROR",
      null,
      console.log(err),
      "No hay un usuario con ese email",
      ERROR_TYPES.INTERNAL_SERVER_ERROR
     
    );
  }
};
