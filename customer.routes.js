const express = require("express");
const router = express.Router();
const Customer = require("./customer.model");
const mongoose = require("mongoose");

// GET all customers
router.get("/", async (req, res) => {
  try {
    const { month } = req.query;
    const filter = {};

    if (month) {
      // Month comes as 1-12, needs to be formatted to "01", "02" for regex matching
      const monthStr = String(month).padStart(2, "0");
      // Matches dates in YYYY-MM-DD format
      const birthdayRegex = new RegExp(`-${monthStr}-`);

      filter.$or = [
        { dob: { $regex: birthdayRegex } },
        { husbandDob: { $regex: birthdayRegex } },
        { "children.dob": { $regex: birthdayRegex } },
      ];
    }

    // Sort alphabetically by full name
    const customers = await Customer.find(filter).sort({ fullName: 1 });
    res.json(customers);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching customers", error: err.message });
  }
});

// GET a single customer by ID
router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid customer ID" });
  }
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching customer", error: err.message });
  }
});

// POST a new customer
router.post("/", async (req, res) => {
  const customer = new Customer({
    ...req.body,
  });

  try {
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    // Handle duplicate key errors for cpf/email
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(409).json({
        message: `Erro: ${field === "cpf" ? "CPF" : "Email"} já cadastrado.`,
      });
    }
    res
      .status(400)
      .json({ message: "Erro ao criar cliente", error: err.message });
  }
});

// PUT (update) a customer
router.put("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid customer ID" });
  }
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // new: true returns the updated doc, runValidators ensures schema rules are met
    );
    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(updatedCustomer);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(409).json({
        message: `Erro: ${
          field === "cpf" ? "CPF" : "Email"
        } já pertence a outro cliente.`,
      });
    }
    res
      .status(400)
      .json({ message: "Error updating customer", error: err.message });
  }
});

// DELETE a customer
router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid customer ID" });
  }
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(204).send(); // 204 No Content
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting customer", error: err.message });
  }
});

module.exports = router;
