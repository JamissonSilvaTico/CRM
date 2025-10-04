const express = require("express");
const router = express.Router();
const Task = require("./task.model");
const mongoose = require("mongoose");

// GET all tasks with optional filters
router.get("/", async (req, res) => {
  try {
    const { status, servico, mes } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (servico) {
      filter.servico = servico;
    }

    // Filter by delivery month
    if (mes) {
      const mesInt = parseInt(mes, 10);
      const year = new Date().getFullYear();

      // Dates are stored as UTC in MongoDB
      const startDate = new Date(Date.UTC(year, mesInt, 1));
      const endDate = new Date(Date.UTC(year, mesInt + 1, 0, 23, 59, 59, 999));

      filter.dataEntrega = { $gte: startDate, $lte: endDate };
    }

    // Sort by dataEntrega (ascending)
    const tasks = await Task.find(filter).sort({ dataEntrega: 1 });
    res.json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: err.message });
  }
});

// GET a single task by ID
router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching task", error: err.message });
  }
});

// POST a new task
router.post("/", async (req, res) => {
  const task = new Task({
    ...req.body,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating task", error: err.message });
  }
});

// PUT (update) a task
router.put("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(updatedTask);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating task", error: err.message });
  }
});

// DELETE a task
router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(204).send();
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: err.message });
  }
});

module.exports = router;
