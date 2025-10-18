const express = require("express");
const router = express.Router();
const Scheduling = require("./scheduling.model");
const mongoose = require("mongoose");

// GET all schedules with optional filters
router.get("/", async (req, res) => {
  try {
    const { month, year, sessionType, indicacao, paymentStatus } = req.query;
    const filter = {};

    if (sessionType) {
      filter.sessionType = sessionType;
    }

    if (indicacao) {
      filter.indicacao = { $regex: indicacao, $options: "i" };
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (year) {
      const yearInt = parseInt(year, 10);
      const monthInt = month ? parseInt(month, 10) - 1 : 0;

      const startDate = new Date(Date.UTC(yearInt, monthInt, 1));

      const endDate = month
        ? new Date(Date.UTC(yearInt, monthInt + 1, 0, 23, 59, 59, 999))
        : new Date(Date.UTC(yearInt, 11, 31, 23, 59, 59, 999));

      filter.date = { $gte: startDate, $lte: endDate };
    }

    const schedules = await Scheduling.find(filter)
      .sort({ date: 1 })
      .populate("customerId");
    res.json(schedules);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching schedules", error: err.message });
  }
});

// GET a single schedule by ID
router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid schedule ID" });
  }
  try {
    const schedule = await Scheduling.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.json(schedule);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching schedule", error: err.message });
  }
});

// POST a new schedule
router.post("/", async (req, res) => {
  const {
    customerId,
    customerName,
    sessionType,
    date,
    observacao,
    indicacao,
    paymentStatus,
    entryValue,
    paymentMethod,
  } = req.body;

  if (!customerName || !sessionType || !date) {
    return res
      .status(400)
      .json({ message: "Customer name, session type, and date are required" });
  }

  const scheduleData = {
    customerName,
    sessionType,
    date,
    observacao,
    indicacao,
    paymentStatus,
    entryValue,
    paymentMethod,
  };
  // Only associate with a customer if a valid ID is provided
  if (customerId && mongoose.Types.ObjectId.isValid(customerId)) {
    scheduleData.customerId = customerId;
  }

  const schedule = new Scheduling(scheduleData);

  try {
    const newSchedule = await schedule.save();
    res.status(201).json(newSchedule);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating schedule", error: err.message });
  }
});

// PUT (update) a schedule
router.put("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid schedule ID" });
  }
  try {
    const updateData = { ...req.body };
    const ops = {};

    // If customerId is present but empty/invalid, unset it.
    // If it's valid, set it. If it's not present, do nothing to it.
    if (updateData.hasOwnProperty("customerId")) {
      if (
        updateData.customerId &&
        mongoose.Types.ObjectId.isValid(updateData.customerId)
      ) {
        ops.$set = { ...ops.$set, customerId: updateData.customerId };
      } else {
        ops.$unset = { customerId: 1 };
      }
      delete updateData.customerId;
    }

    // Payment logic: unset fields that are no longer relevant based on status
    if (updateData.paymentStatus === "Pendente") {
      ops.$unset = { ...ops.$unset, entryValue: 1, paymentMethod: 1 };
      delete updateData.entryValue;
      delete updateData.paymentMethod;
    } else if (updateData.paymentStatus === "Pago Integralmente") {
      ops.$unset = { ...ops.$unset, entryValue: 1 };
      delete updateData.entryValue;
    }

    ops.$set = { ...ops.$set, ...updateData };

    const updatedSchedule = await Scheduling.findByIdAndUpdate(
      req.params.id,
      ops,
      { new: true, runValidators: true }
    );
    if (!updatedSchedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.json(updatedSchedule);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating schedule", error: err.message });
  }
});

// DELETE a schedule
router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid schedule ID" });
  }
  try {
    const schedule = await Scheduling.findByIdAndDelete(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.status(204).send(); // No Content
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting schedule", error: err.message });
  }
});

module.exports = router;
