export default function role(allowedRoles) {
  return function (req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect("/").alert({ message: "No autorizado" })
      
    }
    const userRole = req.user.rol;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    next();
  };
}
