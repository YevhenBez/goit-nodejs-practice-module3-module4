const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    //отримуємо токен
    const [type, token] = req.headers.authorization.split(" ");

    if (type === "Bearer" && token) {
      // розшифровуємо токен
      const decoded = jwt.verify(token, "pizza");
      // передаємо інформацію з токена далі
      req.user = decoded;

      next();
    }


  } catch (error) {
    res.status(401);
    res.json({ code: 401, message: error.message });
  }
};


