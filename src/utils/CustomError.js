import { TIPOS_ERROR } from "./EErrors.js";

export class CustomError {
  static createError(name = "Error", cause, message, code) {
    
    const error = new Error(message, { cause: cause });
    error.name = name;
    error.code = TIPOS_ERROR.INTERNAL_SERVER_ERROR

    throw error
  }
}
