const express = require('express');
const router = express.Router();
const Customer = require('./customer.model');

// GET all customers
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching customers', error: err.message });
    }
});

// POST a new customer
router.post('/', async (req, res) => {
    const customer = new Customer({
        ...req.body
    });

    try {
        const newCustomer = await customer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        // Handle duplicate key errors for cpf/email
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            return res.status(409).json({ message: `Erro: ${field === 'cpf' ? 'CPF' : 'Email'} já cadastrado.` });
        }
        res.status(400).json({ message: 'Erro ao criar cliente', error: err.message });
    }
});

module.exports = router;
