import React, { useState } from "react";

const ChevronDownIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const SchedulingForm: React.FC = () => {
  const [clientName, setClientName] = useState("");
  const [rehearsalType, setRehearsalType] = useState("Acompanhamento Infantil");
  const [rehearsalDate, setRehearsalDate] = useState("");
  const [observation, setObservation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setClientName("");
    setRehearsalType("Acompanhamento Infantil");
    setRehearsalDate("");
    setObservation("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      clientName,
      rehearsalType,
      rehearsalDate,
      observation,
    };

    console.log("Sending data to server:", formData);

    // Simulate an API call to store data in the database
    try {
      // In a real application, you would replace this with a fetch call:
      // const response = await fetch('/api/schedules', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(formData),
      // });
      // if (!response.ok) throw new Error('Network response was not ok.');

      // Simulating a 1.5 second network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate a successful response
      alert("Agendamento salvo com sucesso!");
      resetForm();
    } catch (error) {
      console.error("Failed to submit schedule:", error);
      alert("Falha ao salvar o agendamento. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-8 md:p-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
          Novo Agendamento
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="clientName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome do Cliente
            </label>
            <input
              type="text"
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Digite ou selecione o nome do cliente"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="rehearsalType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tipo de Ensaio
            </label>
            <div className="relative">
              <select
                id="rehearsalType"
                value={rehearsalType}
                onChange={(e) => setRehearsalType(e.target.value)}
                className="w-full appearance-none bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Acompanhamento Infantil</option>
                <option>Ensaio Gestante</option>
                <option>Newborn</option>
                <option>Smash the Cake</option>
                <option>Aniversário</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <ChevronDownIcon />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="rehearsalDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Data do Ensaio
            </label>
            <input
              type="date"
              id="rehearsalDate"
              value={rehearsalDate}
              onChange={(e) => setRehearsalDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="dd/mm/aaaa"
              required
            />
          </div>

          <div>
            <label
              htmlFor="observation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Observação
            </label>
            <textarea
              id="observation"
              rows={4}
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Adicione qualquer observação relevante aqui..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end items-center pt-4 gap-4">
            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Agendando..." : "Agendar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchedulingForm;
