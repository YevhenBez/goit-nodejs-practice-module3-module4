const { model, Schema } = require("mongoose");

const carsSchema = new Schema({
  title: {
    type: String,
    require: [true, "db: title is required"],
  },
  year: {
    type: Number,
    require: [true, "db: year is required"],
  },
  model: {
    type: String,
    default: "Toyota",
  },
  color: {
    type: String,
    default: "White",
  },
});

module.exports = model("cars", carsSchema);
