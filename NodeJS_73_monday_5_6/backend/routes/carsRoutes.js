// Cannot GET /api/v1/cars

const carsController = require("../controllers/CarsController");
const authMiddleware = require("../middlewares/authMiddleware");
const rolesMiddleware = require('../middlewares/rolesMiddleware');

const carsRoutes = require("express").Router();
// Додати машину
carsRoutes.post(
  "/cars",
  (req, res, next) => {
    console.log("Joi");
    next();
  },
  carsController.addNew
);
// ["ADMIN", "MODERATOR", "USER", "CTO", "CUSTOMER"]
// Отримати всі машини
carsRoutes.get(
  "/cars",
  authMiddleware, 
  rolesMiddleware(["USER", "MODERATOR", "ADMIN"]),
  carsController.getAll
);

// Отримати одну машину
carsRoutes.get("/cars/:id", carsController.getById);

//Оновити машину
carsRoutes.patch("/cars/:id", carsController.updateById);

//Видалити машину
carsRoutes.delete("/cars/:id", carsController.removeById);

module.exports = carsRoutes;
