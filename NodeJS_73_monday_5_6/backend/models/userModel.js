const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    require: [true, "db: email is required"],
  },
  password: {
    type: String,
    require: [true, "db: password is required"],
  },
  name: {
    type: String,
    default: "Jack Black",
  },
  token: {
    type: String,
    default: null,
  },
  roles: [
    {
      type: String,
      ref: "roles",
    },
  ],
});

module.exports = model("users", userSchema);
