const mongoose = require("mongoose");

const sessionTypes = [
  "Acompanhamento Infantil",
  "Acompanhamento Gestante",
  "Ensaio Infantil",
  "Ensaio de Gestante",
  "Ensaio de Família",
  "Perfil Profissional",
  "Parto",
  "Eventos",
  "Newborn",
  "Smash the Cake",
  "Sessão Especial",
];

const schedulingSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    customerName: { type: String, required: true },
    sessionType: { type: String, required: true, enum: sessionTypes },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

// Create a virtual 'id' property that gets the string value of '_id'
schedulingSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are included in toJSON and toObject outputs
schedulingSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("Scheduling", schedulingSchema);
