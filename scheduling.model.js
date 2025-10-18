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
  "Natal",
  "Dia dos Pais",
  "Dia das Mães",
];

const paymentStatusOptions = ["Pendente", "Entrada Paga", "Pago Integralmente"];
const paymentMethodOptions = ["Dinheiro", "Pix", "Débito", "Crédito"];

const schedulingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    },
    customerName: { type: String, required: true },
    sessionType: { type: String, required: true, enum: sessionTypes },
    date: { type: Date, required: true },
    observacao: { type: String },
    indicacao: { type: String },
    paymentStatus: {
      type: String,
      required: true,
      enum: paymentStatusOptions,
      default: "Pendente",
    },
    entryValue: { type: Number },
    paymentMethod: { type: String, enum: paymentMethodOptions },
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
