const mongoose = require("mongoose");

const serviceTypes = [
  "Acompanhamento de bebes",
  "Acompanhamento de Gestante",
  "Ensaio Gestante",
  "Ensaio Infantil",
  "Eventos",
  "Parto",
  "Newborn",
  "Ensaio Familia",
  "Perfil Profissional",
  "Smash the cake",
  "Selebration",
  "Sessão especial",
  "Natal",
  "Dia dos Pais",
  "Dia das mães",
];

const statusOptions = ["Não iniciado", "Em andamento", "Finalizado"];

const taskSchema = new mongoose.Schema(
  {
    cliente: { type: String, required: true },
    filho: { type: String, default: "N/A" },
    servico: { type: String, required: true, enum: serviceTypes },
    dataEnsaio: { type: Date, required: true }, // Armazenado como Date
    dataEntrega: { type: Date, required: true }, // Armazenado como Date
    status: {
      type: String,
      required: true,
      enum: statusOptions,
      default: "Não iniciado",
    },
    armazenadoHD: { type: String },
    minFotos: { type: Number },
    observacao: { type: String },
  },
  { timestamps: true }
);

// Cria uma propriedade virtual 'id'
taskSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Inclui campos virtuais e remove _id e __v nos retornos JSON
taskSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("Task", taskSchema);
