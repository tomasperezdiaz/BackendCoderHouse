import { userModel } from "../dao/mongo/models/user.js";
import { CustomError } from "../utils/CustomError.js";
import { ERROR_TYPES } from "../utils/EErrors.js";

export const userController = async (req, res, next) => {
  try {
    let { uid } = req.params;

    try {
      const user = await userModel.findOne({ _id: uid });
      console.log(user);
      if (user.rol.toLowerCase() == "user") {
        user.rol = "premium";
        await user.save();
        return res
          .status(200)
          .json({ payload: `User ${user.email} is now ${user.rol}` });
      }
      if (user.rol.toLowerCase() == "premium") {
        user.rol = "user";
        await user.save();
        return res
          .status(200)
          .json({ payload: `User ${user.email} is now ${user.rol}` });
      }
      if (user.rol.toLowerCase() == "admin") {
        return CustomError.createError(
          "ERROR",
          null,
          "Cannot change administrator role",
          ERROR_TYPES.TIPO_DE_DAROS
        );
      }
    } catch (error) {
      return CustomError.createError(
        "Not found",
        null,
        "User not found",
        ERROR_TYPES.NOT_FOUND
      );
    }
  } catch (error) {
    next(error);
  }
};
