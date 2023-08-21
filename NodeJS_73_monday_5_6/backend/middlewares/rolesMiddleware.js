const jwt = require("jsonwebtoken");

module.exports = (rolesArray) => {
  return (req, res, next) => {
    try {
        const roles = req.user.roles;
        let hasRole = false;
        roles.forEach((role) => {
          if (rolesArray.includes(role)) {
            hasRole = true;
          }
        });
        if (!hasRole) {
          res.status(403);
          throw new Error("forbidden");
        }
        next();
    } catch (error) {
      res.status(403);
      res.json({ code: 403, message: error.message });
    }
  };
};
