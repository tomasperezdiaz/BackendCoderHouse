export const auth = (privileges = []) => {
  return (req, res, next) => {
    privileges = privileges.map((p) => p.toLowerCase());

    if (privileges.includes("public")) {
      return next();
    }

    if (!req.session.user?.rol) {
      return res.status(401).json({
        error: `Tenes que logearte o hay un problema con el rol`,
      });
    }

    if (!privileges.includes(req.session.user.rol.toLowerCase())) {
      return res
        .status(403)
        .json({ error: `No tenes el rol que te permite entrar` });
    }

    return next();
  };
};

