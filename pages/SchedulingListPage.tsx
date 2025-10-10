import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { getSchedules, deleteSchedule } from "../services/schedulingService";
import type { Scheduling } from "../types";
import { SessionType } from "../types";

const SchedulingListPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Scheduling[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    month: "",
    year: "",
    sessionType: "",
  });

  const fetchSchedules = useCallback(
    async (currentFilters: {
      month: string;
      year: string;
      sessionType: string;
    }) => {
      setIsLoading(true);
      setError("");
      try {
        const params = {
          month: currentFilters.month || undefined,
          year: currentFilters.year || undefined,
          sessionType: currentFilters.sessionType || undefined,
        };
        const data = await getSchedules(params);
        setSchedules(data);
      } catch (err) {
        setError("Falha ao carregar agendamentos.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchSchedules(filters);
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyFilters = () => {
    fetchSchedules(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = { month: "", year: "", sessionType: "" };
    setFilters(clearedFilters);
    fetchSchedules(clearedFilters);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este agendamento?")) {
      try {
        await deleteSchedule(id);
        setSchedules((prev) => prev.filter((s) => s.id !== id));
      } catch (err) {
        setError("Falha ao excluir o agendamento.");
      }
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
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Lista de Agendamentos
        </h2>
        <Link
          to="/scheduling"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Novo Agendamento
        </Link>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 p-4 border rounded-md bg-gray-50 items-center">
        <select
          name="month"
          value={filters.month}
          onChange={handleFilterChange}
          className="w-full text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
          className="w-full text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
          className="w-full text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Tipo de Ensaio</option>
          {Object.values(SessionType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button
          onClick={handleApplyFilters}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
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
                <h3 className="text-xl font-bold text-blue-700">
                  {schedule.customerName}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {schedule.sessionType}
                </p>
                {schedule.observacao && (
                  <p className="text-sm text-gray-500 mt-2 italic whitespace-pre-wrap">
                    <strong>Obs:</strong> {schedule.observacao}
                  </p>
                )}
                <p className="text-md font-semibold text-gray-800 mt-4">
                  {new Date(schedule.date).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  })}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                <Link
                  to={`/scheduling/${schedule.id}`}
                  className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
                >
                  Editar
                </Link>
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
    </div>
  );
};

export default SchedulingListPage;
