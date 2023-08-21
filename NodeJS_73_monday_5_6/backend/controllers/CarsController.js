const { isValidObjectId } = require("mongoose");

const carModel = require("../models/carModel");
const asyncHandler = require("express-async-handler");

class CarsController {
  checkId = (id) => {
    if (isValidObjectId(id)) {
      return true;
    }
    return false;
  };

  addNew = asyncHandler(async (req, res) => {
    const { title, color } = req.body;
    if (!title || !color) {
      res.status(400);
      throw new Error("provide all required fields");
    }
    const car = await carModel.create({ ...req.body });
    res.status(201).json({ code: 201, data: car });
  });

  getAll = asyncHandler(async (req, res) => {
    const allCars = await carModel.find({});
    res.status(200).json({ code: 200, data: allCars, qty: allCars.length });
  });

  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!this.checkId(id)) {
      res.status(400);
      throw new Error("invalid ID");
    }
    const carById = await carModel.findById(id);
    if (carById === null) {
      res.status(400);
      throw new Error("car with this ID not found");
    }
    res.status(200).json({ code: 200, data: carById });
  });

  updateById = (req, res) => {
    // carModel.findByIdAndUpdate();

  };

  removeById = (req, res) => {
    // carModel.findByIdAndRemove();
 
  };
}

module.exports = new CarsController();
