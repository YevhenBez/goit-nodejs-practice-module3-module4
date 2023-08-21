const { model, Schema } = require("mongoose");

const roleSchema = new Schema({
  value: {
    type: String,
    default: "USER",
  },
  
});

module.exports = model("roles", roleSchema);
