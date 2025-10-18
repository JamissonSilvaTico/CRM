import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  getSchedules,
  deleteSchedule,
  addSchedule,
  updateSchedule,
} from "../services/schedulingService";
import { getCustomers } from "../services/customerService";
import type { Scheduling, SchedulingFormData, Customer } from "../types";
import { SessionType, PaymentStatus, PaymentMethod } from "../types";
import Input from "../components/Input";
import Button from "../components/Button";

const SchedulingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: SchedulingFormData, id?: string) => Promise<void>;
  scheduleToEdit: Scheduling | null;
  customers: Customer[];
}> = ({ isOpen, onClose, onSave, scheduleToEdit, customers }) => {
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
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (scheduleToEdit) {
        setFormData({
          customerId: scheduleToEdit.customerId,
          customerName: scheduleToEdit.customerName,
          sessionType: scheduleToEdit.sessionType,
          date: new Date(scheduleToEdit.date).toISOString().split("T")[0],
          observacao: scheduleToEdit.observacao || "",
          indicacao: scheduleToEdit.indicacao || "",
          paymentStatus: scheduleToEdit.paymentStatus || PaymentStatus.PENDENTE,
          entryValue: scheduleToEdit.entryValue,
          paymentMethod: scheduleToEdit.paymentMethod,
        });
      } else {
        setFormData({
          customerName: "",
          sessionType: Object.values(SessionType)[0],
          date: "",
          observacao: "",
          indicacao: "",
          paymentStatus: PaymentStatus.PENDENTE,
          entryValue: undefined,
          paymentMethod: undefined,
        });
      }
      setErrorMessage("");
    }
  }, [scheduleToEdit, isOpen]);

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const selectedCustomer = customers.find(
      (c) => (c.preferredName || c.fullName) === name
    );
    setFormData((prev) => ({
      ...prev,
      customerName: name,
      customerId: selectedCustomer ? selectedCustomer.id : undefined,
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
    setErrorMessage("");

    try {
      await onSave(formData, scheduleToEdit?.id);
      onClose();
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
          {scheduleToEdit ? "Editar Agendamento" : "Novo Agendamento"}
        </h2>
        {errorMessage && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6"
            role="alert"
          >
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Digite ou selecione"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm transition"
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
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
              >
                {Object.values(SessionType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
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

          <Input
            label="Indicação"
            id="indicacao"
            name="indicacao"
            value={formData.indicacao || ""}
            onChange={handleChange}
            placeholder="Quem indicou?"
          />

          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Pagamento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="paymentStatus"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status do Pagamento
                </label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                >
                  {Object.values(PaymentStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {formData.paymentStatus === PaymentStatus.ENTRADA_PAGA && (
                <Input
                  label="Valor da Entrada (R$)"
                  id="entryValue"
                  name="entryValue"
                  type="number"
                  step="0.01"
                  value={formData.entryValue || ""}
                  onChange={handleChange}
                  placeholder="Ex: 100,00"
                />
              )}

              {formData.paymentStatus !== PaymentStatus.PENDENTE && (
                <div>
                  <label
                    htmlFor="paymentMethod"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Forma de Pagamento
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod || ""}
                    onChange={handleChange}
                    required={true}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                  >
                    <option value="">Selecione...</option>
                    {Object.values(PaymentMethod).map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

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
              rows={3}
              value={formData.observacao || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm transition"
              placeholder="Adicione observações sobre o agendamento..."
            />
          </div>
          <div className="pt-6 flex space-x-4">
            <Button type="submit" isLoading={isLoading}>
              {scheduleToEdit ? "Salvar Alterações" : "Agendar"}
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SchedulingListPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Scheduling[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    month: "",
    year: "",
    sessionType: "",
    indicacao: "",
    paymentStatus: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Scheduling | null>(
    null
  );

  const fetchSchedules = useCallback(async (currentFilters: typeof filters) => {
    setIsLoading(true);
    setError("");
    try {
      const params = {
        month: currentFilters.month || undefined,
        year: currentFilters.year || undefined,
        sessionType: currentFilters.sessionType || undefined,
        indicacao: currentFilters.indicacao || undefined,
        paymentStatus: currentFilters.paymentStatus || undefined,
      };
      const scheduleData = await getSchedules(params);
      setSchedules(scheduleData);
    } catch (err) {
      setError("Falha ao carregar agendamentos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const customerData = await getCustomers();
        setCustomers(customerData);
        const scheduleData = await getSchedules({}); // Fetch all schedules initially
        setSchedules(scheduleData);
      } catch (err) {
        setError("Falha ao carregar dados iniciais.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyFilters = () => {
    fetchSchedules(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      month: "",
      year: "",
      sessionType: "",
      indicacao: "",
      paymentStatus: "",
    };
    setFilters(clearedFilters);
    fetchSchedules(clearedFilters);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este agendamento?")) {
      try {
        await deleteSchedule(id);
        fetchSchedules(filters);
      } catch (err) {
        setError("Falha ao excluir o agendamento.");
      }
    }
  };

  const handleSaveSchedule = async (
    scheduleData: SchedulingFormData,
    id?: string
  ) => {
    const payload = { ...scheduleData };
    if (!payload.customerId) {
      delete payload.customerId;
    }
    try {
      if (id) {
        await updateSchedule(id, payload);
      } else {
        await addSchedule(payload);
      }
      fetchSchedules(filters);
    } catch (error) {
      console.error("Failed to save schedule", error);
      throw error;
    }
  };

  const openModalForNew = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (schedule: Scheduling) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  const getPaymentStatusStyle = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAGO_INTEGRALMENTE:
        return "text-green-600 font-bold";
      case PaymentStatus.ENTRADA_PAGA:
        return "text-yellow-600 font-bold";
      case PaymentStatus.PENDENTE:
      default:
        return "text-red-600 font-bold";
    }
  };

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  }, []);

  const months = [
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6 border-b pb-4 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Gestão de Agendamentos
        </h2>
        <Button
          onClick={openModalForNew}
          className="!w-auto bg-green-600 hover:bg-green-700"
        >
          + Novo Agendamento
        </Button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-6 p-4 border rounded-md bg-gray-50 items-center">
        <select
          name="month"
          value={filters.month}
          onChange={handleFilterChange}
          className="w-full text-base border-gray-300 focus:outline-none focus:ring-gray-700 focus:border-gray-700 sm:text-sm rounded-md"
        >
          <option value="">Mês</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <select
          name="year"
          value={filters.year}
          onChange={handleFilterChange}
          className="w-full text-base border-gray-300 focus:outline-none focus:ring-gray-700 focus:border-gray-700 sm:text-sm rounded-md"
        >
          <option value="">Ano</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          name="sessionType"
          value={filters.sessionType}
          onChange={handleFilterChange}
          className="w-full text-base border-gray-300 focus:outline-none focus:ring-gray-700 focus:border-gray-700 sm:text-sm rounded-md"
        >
          <option value="">Tipo de Ensaio</option>
          {Object.values(SessionType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input
          name="indicacao"
          placeholder="Pesquisar indicação"
          value={filters.indicacao}
          onChange={handleFilterChange}
          className="w-full text-base border-gray-300 focus:outline-none focus:ring-gray-700 focus:border-gray-700 sm:text-sm rounded-md px-3 py-2 bg-white shadow-sm"
        />
        <select
          name="paymentStatus"
          value={filters.paymentStatus}
          onChange={handleFilterChange}
          className="w-full text-base border-gray-300 focus:outline-none focus:ring-gray-700 focus:border-gray-700 sm:text-sm rounded-md"
        >
          <option value="">Status Pagamento</option>
          {Object.values(PaymentStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button
          onClick={handleApplyFilters}
          className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Filtrar
        </button>
        <button
          onClick={handleClearFilters}
          className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Limpar
        </button>
      </div>

      {!isLoading && schedules.length > 0 && (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-md font-semibold text-gray-800">
            {schedules.length} agendamento(s) encontrado(s).
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-10">Carregando agendamentos...</div>
      ) : schedules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-700">
                  {schedule.customerName}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {schedule.sessionType}
                </p>
                <p className="text-md font-semibold text-gray-800 mt-4">
                  {new Date(schedule.date).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  })}
                </p>
                {schedule.indicacao && (
                  <p className="text-sm text-gray-500 mt-2">
                    <strong>Indicação:</strong> {schedule.indicacao}
                  </p>
                )}
                {schedule.observacao && (
                  <p className="text-sm text-gray-500 mt-2 italic whitespace-pre-wrap">
                    <strong>Obs:</strong> {schedule.observacao}
                  </p>
                )}
                <div className="mt-4 pt-4 border-t text-sm space-y-1">
                  <p>
                    <strong>Pagamento:</strong>{" "}
                    <span
                      className={getPaymentStatusStyle(schedule.paymentStatus)}
                    >
                      {schedule.paymentStatus}
                    </span>
                  </p>
                  {schedule.paymentStatus === PaymentStatus.ENTRADA_PAGA &&
                    schedule.entryValue && (
                      <p>
                        <strong>Entrada:</strong> R${" "}
                        {schedule.entryValue.toFixed(2).replace(".", ",")}
                      </p>
                    )}
                  {schedule.paymentMethod && (
                    <p>
                      <strong>Forma:</strong> {schedule.paymentMethod}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                <button
                  onClick={() => openModalForEdit(schedule)}
                  className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(schedule.id)}
                  className="px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-md">
          <p className="text-gray-600">Nenhum agendamento encontrado.</p>
        </div>
      )}

      <SchedulingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSchedule}
        scheduleToEdit={editingSchedule}
        customers={customers}
      />
    </div>
  );
};

export default SchedulingListPage;
