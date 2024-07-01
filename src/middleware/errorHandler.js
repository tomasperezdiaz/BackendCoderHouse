import  ERROR_TYPES  from "../utils/EErrors.js";
import __dirname from "../utils.js";

const errorHandler = (error, req,res,next) => {
    switch (error.code) {
        case ERROR_TYPES.AUTENTICATION || ERROR_TYPES.AUTORIZACION:
          return res.status(401).json({ error: `Credenciales incorrectas` });
    
        case ERROR_TYPES.INVALID_ARGUMENTS:
          return res.status(400).json({ error: `${error.message}` });
    
        case ERROR_TYPES.NOT_FOUND:
          return res.status(404).json({ error: `${error.message}` });
    
        default:
          return res.status(500).json({ error: `Error - Contacte un admin` });
      }

   
}
export default errorHandler;