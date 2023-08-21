const express = require("express");

const errorHandler = require("./middlewares/errorHandler");
const asyncHandler = require("express-async-handler");

const connectDb = require("../config/connectDb.js");
const userModel = require("./models/userModel");
const rolesModel = require("./models/rolesModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authMiddleware = require("./middlewares/authMiddleware");

require("colors");
const path = require("path");
const configPath = path.join(__dirname, "..", "config", ".env");
require("dotenv").config({ path: configPath });
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/v1", require("./routes/carsRoutes.js"));

// registration - Збереження користувача в базу даних
// аутентифікація - Звірка даних від користувача з даними в базі
// авторизація - перевірка прав доступа
// логаут - вихід з акаунту (втрата авторизацї)

app.post(
  "/register",
  asyncHandler(async (req, res) => {
    // 1. отримуєм і валідуєм дані від користувача
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("provide all required fields");
    }

    // 2. шукаєм користувача в базі ()
    const candidate = await userModel.findOne({ email });

    // - якщо знайшли -- повідомляєм про помилку
    if (candidate) {
      res.status(400);
      throw new Error("user already exist");
    }
    // - якщо не знайшли -- хешуємо пароль
    const hashPassword = bcrypt.hashSync(password, 5);
    const roles = await rolesModel.findOne({ value: "ADMIN" });
    // 3. зберігаєм користувача з захешованим паролем в базу
    const user = await userModel.create({
      ...req.body,
      password: hashPassword,
      roles: [roles.value],
    });
    res
      .status(201)
      .json({ code: 201, data: { name: user.name, email: user.email } });
  })
);

app.post(
  "/login",
  asyncHandler(async (req, res) => {
    // 1. отримуєм і валідуєм дані від користувача
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("provide all required fields");
    }

    // 2. шукаєм користувача в базі і розшифровуєм пароль
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("invalid login or password");
    }
    // - якщо не знайшли або не розшифрували пароль-- повідомляєм про помилку - invalid login or password
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      res.status(400);
      throw new Error("invalid login or password");
    }

    // - якщо все ок -- видаєм токен
    const token = generateToken({
      friends: ["ilya", "vlad", "sergiy"],
      id: user._id,
      roles: user.roles,
    });
    // 3. зберігаєм користувача з отриманим токеном в базу

    user.token = token;
    await user.save();

    res
      .status(200)
      .json({ code: 200, data: { token: user.token, email: user.email } });
  })
);

function generateToken(data) {
  const payload = { ...data };
  return jwt.sign(payload, "pizza", { expiresIn: "23h" });
}

app.get(
  "/logout",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user.id);
    user.token = null;
    await user.save();
    res.status(200).json({ code: 200, message: "logout success" });
  })
);

app.use(errorHandler);

connectDb();

app.listen(process.env.PORT, () => {
  console.log(`Server on port: ${process.env.PORT}`.green.italic.bold);
});
