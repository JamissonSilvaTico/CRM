import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomers } from "../services/customerService";
import {
  addSchedule,
  getScheduleById,
  updateSchedule,
} from "../services/schedulingService";
import type { Customer, SchedulingFormData } from "../types";
import { SessionType, PaymentStatus } from "../types";
import Input from "../components/Input";
import Button from "../components/Button";

const SchedulingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState<SchedulingFormData>({
    customerName: "",
    sessionType: Object.values(SessionType)[0],
    date: "",
    observacao: "",
    indicacao: "",
    paymentStatus: PaymentStatus.PENDENTE,
    entryValue: undefined,
    paymentMethod: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsFetching(true);
      try {
        const customerData = await getCustomers();
        setCustomers(customerData);

        if (isEditing && id) {
          const scheduleData = await getScheduleById(id);
          setFormData({
            customerId: scheduleData.customerId,
            customerName: scheduleData.customerName,
            sessionType: scheduleData.sessionType,
            date: new Date(scheduleData.date).toISOString().split("T")[0],
            observacao: scheduleData.observacao || "",
            indicacao: scheduleData.indicacao || "",
            paymentStatus: scheduleData.paymentStatus,
            entryValue: scheduleData.entryValue,
            paymentMethod: scheduleData.paymentMethod,
          });
        }
      } catch (error) {
        setErrorMessage("Falha ao carregar dados.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchInitialData();
  }, [id, isEditing]);

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const selectedCustomer = customers.find(
      (c) => (c.preferredName || c.fullName) === name
    );
    setFormData((prev) => ({
      ...prev,
      customerName: name,
      customerId: selectedCustomer ? selectedCustomer.id : "",
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const payload: Partial<SchedulingFormData> = { ...formData };
    // Ensure we don't send an empty customerId string if no customer is selected
    if (!payload.customerId) {
      delete payload.customerId;
    }

    try {
      if (isEditing && id) {
        await updateSchedule(id, payload);
        setSuccessMessage("Agendamento atualizado com sucesso!");
      } else {
        await addSchedule(payload as SchedulingFormData);
        setSuccessMessage("Agendamento criado com sucesso!");
        setFormData({
          customerName: "",
          sessionType: Object.values(SessionType)[0],
          date: "",
          observacao: "",
          indicacao: "",
          paymentStatus: PaymentStatus.PENDENTE,
          entryValue: undefined,
          paymentMethod: undefined,
          customerId: undefined,
        });
      }
      window.scrollTo(0, 0);
      setTimeout(() => navigate("/scheduling-list"), 2000);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message || "Ocorreu um erro.");
      } else {
        setErrorMessage("Ocorreu um erro desconhecido.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="text-center p-10">Carregando...</div>;
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
        {isEditing ? "Editar Agendamento" : "Novo Agendamento"}
      </h2>

      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-6"
          role="alert"
        >
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="customerName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nome do Cliente
          </label>
          <input
            id="customerName"
            name="customerName"
            type="text"
            list="customer-list"
            value={formData.customerName}
            onChange={handleCustomerChange}
            placeholder="Digite ou selecione o nome do cliente"
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
          />
          <datalist id="customer-list">
            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.preferredName || customer.fullName}
              />
            ))}
          </datalist>
        </div>

        <div>
          <label
            htmlFor="sessionType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tipo de Ensaio
          </label>
          <select
            id="sessionType"
            name="sessionType"
            value={formData.sessionType}
            onChange={handleChange}
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {Object.values(SessionType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Data do Ensaio"
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <div>
          <label
            htmlFor="observacao"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Observação
          </label>
          <textarea
            id="observacao"
            name="observacao"
            rows={4}
            value={formData.observacao || ""}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
            placeholder="Adicione observações sobre o agendamento..."
          />
        </div>

        <div className="pt-6 flex space-x-4">
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? "Salvar Alterações" : "Agendar"}
          </Button>
          <button
            type="button"
            onClick={() => navigate(isEditing ? "/scheduling-list" : "/list")}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default SchedulingPage;
