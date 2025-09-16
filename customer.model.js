const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: String, required: true },
}, {_id: false});

const customerSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    preferredName: { type: String },
    cpf: { type: String, required: true, unique: true },
    dob: { type: String, required: true },
    address: { type: String, required: true },
    cep: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    instagram: { type: String },
    children: [childSchema],
    husbandName: { type: String },
    husbandDob: { type: String },
}, { timestamps: true });

// Create a virtual 'id' property that gets the string value of '_id'
customerSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

// Ensure virtual fields are included in toJSON and toObject outputs
customerSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model('Customer', customerSchema);
