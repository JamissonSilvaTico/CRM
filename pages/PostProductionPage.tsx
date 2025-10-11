import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../services/taskService";
import type { Task, TaskFormData, TaskStatus } from "../types";
import { TaskServiceType } from "../types";
import Input from "../components/Input";
import Button from "../components/Button";

// Constantes adaptadas do código original (index.tsx)
const SERVICOS = Object.values(TaskServiceType);
const STATUS_OPTIONS: TaskStatus[] = [
  "Não iniciado",
  "Em andamento",
  "Finalizado",
];
const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const PRIORIDADES = {
  URGENTE: { label: "Urgente", color: "#e63946", days: 2 },
  MEDIA: { label: "Média", color: "#ffc300", days: 4 },
  BAIXA: { label: "Baixa", color: "#457b9d", days: 6 },
  NENHUMA: { label: "Normal", color: "#6c757d", days: Infinity },
};
const priorityOptions = ["Urgente", "Média", "Baixa", "Normal"];

const getPriority = (task: Task) => {
  if (task.status === "Finalizado") return PRIORIDADES.NENHUMA;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Use dataEnsaio and dataEntrega as Date objects from ISO strings
  const deliveryDate = new Date(task.dataEntrega);

  const diffTime = deliveryDate.getTime() - today.getTime();
  if (diffTime < 0) return PRIORIDADES.URGENTE;

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= PRIORIDADES.URGENTE.days) return PRIORIDADES.URGENTE;
  if (diffDays <= PRIORIDADES.MEDIA.days) return PRIORIDADES.MEDIA;
  if (diffDays <= PRIORIDADES.BAIXA.days) return PRIORIDADES.BAIXA;
  return PRIORIDADES.NENHUMA;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  // O backend retorna ISO string completo, formatamos para DD/MM/AAAA.
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const TaskCard: React.FC<{
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}> = ({ task, onEdit, onDelete }) => {
  const priority = getPriority(task);
  const title = `${task.cliente} ${
    task.filho && task.filho.toLowerCase() !== "n/a" ? `(${task.filho})` : ""
  }`;

  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
      {/* Indicador de Prioridade Lateral */}
      <div
        className="absolute top-0 left-0 w-1 h-full"
        style={{ backgroundColor: priority.color }}
      ></div>

      <div className="pl-3">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-700">
          <strong>Serviço:</strong> {task.servico}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Status:</strong>{" "}
          <span style={{ fontWeight: "bold", color: priority.color }}>
            {task.status}
          </span>
        </p>

        <div className="mt-3 text-sm text-gray-700 space-y-1">
          {task.minFotos != null && task.minFotos > 0 && (
            <p>
              <strong>Mínimo de Fotos:</strong> {task.minFotos}
            </p>
          )}
          {task.armazenadoHD && (
            <p>
              <strong>Armazenado em:</strong> {task.armazenadoHD}
            </p>
          )}
          {task.observacao && (
            <p>
              <strong>Observação:</strong> {task.observacao}
            </p>
          )}
        </div>

        <div className="flex justify-between mt-3 text-xs text-gray-600">
          <span>
            <strong>Ensaio:</strong> {formatDate(task.dataEnsaio)}
          </span>
          <span>
            <strong>Entrega:</strong> {formatDate(task.dataEntrega)}
          </span>
        </div>

        <div className="mt-3">
          <span
            style={{ backgroundColor: priority.color }}
            className="text-white px-2 py-1 rounded-full text-xs font-semibold"
          >
            {priority.label}
          </span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
        <button
          onClick={() => onEdit(task)}
          className="text-gray-600 hover:text-gray-800 transition-colors"
          aria-label={`Editar tarefa de ${task.cliente}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-3.109 5.656a1 1 0 001.414 1.414L15 9.414V16a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2h4.586l.707-.707A1 1 0 009.414 5H4a4 4 0 00-4 4v7a4 4 0 004 4h9a4 4 0 004-4V8.414l-1.707-1.707a1 1 0 00-1.414 0l-5 5z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-600 hover:text-red-800 transition-colors"
          aria-label={`Excluir tarefa de ${task.cliente}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 7a1 1 0 012 0v6a1 1 0 11-2 0V7zm6 0a1 1 0 10-2 0v6a1 1 0 102 0V7z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const TaskModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: TaskFormData & { id?: string }) => void;
  taskToEdit: (Task & { id: string }) | null;
}> = ({ isOpen, onClose, onSave, taskToEdit }) => {
  const initialFormData: TaskFormData = {
    cliente: "",
    filho: "",
    servico: SERVICOS[0] as TaskServiceType,
    dataEnsaio: "",
    dataEntrega: "",
    status: STATUS_OPTIONS[0],
    armazenadoHD: "",
    minFotos: undefined,
    observacao: "",
  };
  const [formData, setFormData] = useState<TaskFormData>(initialFormData);
  const [id, setId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setId(taskToEdit.id);
        setFormData({
          ...taskToEdit,
          // Formata as datas para o campo input type="date" (YYYY-MM-DD)
          dataEnsaio: new Date(taskToEdit.dataEnsaio)
            .toISOString()
            .split("T")[0],
          dataEntrega: new Date(taskToEdit.dataEntrega)
            .toISOString()
            .split("T")[0],
          armazenadoHD: taskToEdit.armazenadoHD || "",
          minFotos: taskToEdit.minFotos,
          observacao: taskToEdit.observacao || "",
        });
      } else {
        setId(undefined);
        setFormData(initialFormData);
      }
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id });
    onClose(); // Fecha após salvar/atualizar
  };

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
          {id ? "Editar Tarefa" : "Nova Tarefa"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Cliente"
            id="cliente"
            name="cliente"
            value={formData.cliente}
            onChange={handleChange}
            required
          />
          <Input
            label="Filho (Opcional)"
            id="filho"
            name="filho"
            value={formData.filho}
            onChange={handleChange}
          />

          <div>
            <label
              htmlFor="servico"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Serviço
            </label>
            <select
              id="servico"
              name="servico"
              value={formData.servico}
              onChange={handleChange}
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            >
              {SERVICOS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data do Ensaio"
              id="dataEnsaio"
              name="dataEnsaio"
              type="date"
              value={formData.dataEnsaio}
              onChange={handleChange}
              required
            />
            <Input
              label="Data para Entrega"
              id="dataEntrega"
              name="dataEntrega"
              type="date"
              value={formData.dataEntrega}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Quantidade Mínima de Fotos"
              id="minFotos"
              name="minFotos"
              type="number"
              value={formData.minFotos || ""}
              onChange={handleChange}
              placeholder="Ex: 30"
            />
            <Input
              label="Armazenado no HD"
              id="armazenadoHD"
              name="armazenadoHD"
              value={formData.armazenadoHD || ""}
              onChange={handleChange}
              placeholder="Ex: HD Externo 01"
            />
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
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
              placeholder="Adicione observações sobre a tarefa..."
            />
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PostProductionPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<
    (Task & { id: string }) | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    servico: "",
    mes: "",
    prioridade: "",
  });

  const fetchTasks = useCallback(
    async (currentFilters: Omit<typeof filters, "prioridade">) => {
      setIsLoading(true);
      setError("");
      try {
        const params = {
          status: currentFilters.status || undefined,
          servico: currentFilters.servico || undefined,
          mes: currentFilters.mes || undefined,
        };
        const data = await getTasks(params);
        setTasks(data);
      } catch (err) {
        setError("Falha ao carregar tarefas.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchTasks({ status: "", servico: "", mes: "" });
  }, [fetchTasks]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    fetchTasks(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      status: "",
      servico: "",
      mes: "",
      prioridade: "",
    };
    setFilters(clearedFilters);
    fetchTasks(clearedFilters);
  };

  const openModalForNew = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (task: Task & { id: string }) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: TaskFormData & { id?: string }) => {
    try {
      const payload = {
        ...taskData,
        minFotos:
          (taskData.minFotos as any) === "" || taskData.minFotos == null
            ? undefined
            : Number(taskData.minFotos),
      };
      if (payload.id) {
        await updateTask(payload.id, payload);
      } else {
        await addTask(payload);
      }
      fetchTasks(filters);
    } catch (error) {
      console.error("Failed to save task", error);
      setError("Falha ao salvar a tarefa. Tente novamente.");
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      try {
        await deleteTask(id);
        fetchTasks(filters);
      } catch (err) {
        setError("Falha ao excluir a tarefa. Tente novamente.");
      }
    }
  };

  const filteredTasks = useMemo(() => {
    if (!filters.prioridade) {
      return tasks;
    }
    return tasks.filter(
      (task) => getPriority(task).label === filters.prioridade
    );
  }, [tasks, filters.prioridade]);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6 border-b pb-4 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Gestão de Pós-produção
        </h1>
        <Button
          onClick={openModalForNew}
          className="!w-auto bg-green-600 hover:bg-green-700"
        >
          + Nova Tarefa
        </Button>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6 p-4 border rounded-md bg-gray-50 items-center">
        <h2 className="text-lg font-semibold text-gray-800 col-span-full xl:col-span-6 mb-0">
          Filtros
        </h2>

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="w-full text-base border-gray-300 focus:outline-none focus:ring-gray-700 focus:border-gray-700 sm:text-sm rounded-md"
        >
          <option value="">Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          name="servico"
          value={filters.servico}
          onChange={handleFilterChange}
          className="w-full text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
        >
          <option value="">Serviço</option>
          {SERVICOS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          name="mes"
          value={filters.mes}
          onChange={handleFilterChange}
          className="w-full text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
        >
          <option value="">Mês de Entrega</option>
          {MESES.map((m, i) => (
            <option key={i} value={i}>
              {m}
            </option>
          ))}
        </select>

        <select
          name="prioridade"
          value={filters.prioridade}
          onChange={handleFilterChange}
          className="w-full text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
        >
          <option value="">Prioridade</option>
          {priorityOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <button
          onClick={handleApplyFilters}
          className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
        >
          Filtrar
        </button>
        <button
          onClick={handleClearFilters}
          className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors text-sm font-medium"
        >
          Limpar
        </button>
      </div>

      {!isLoading && filteredTasks.length > 0 && (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-md font-semibold text-gray-800">
            {filteredTasks.length} tarefa(s) encontrada(s) com os filtros
            atuais.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-10">Carregando tarefas...</div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task as Task & { id: string }}
              onEdit={openModalForEdit}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-md">
          <p className="text-gray-600">
            {tasks.length === 0
              ? "Nenhuma tarefa cadastrada."
              : "Nenhuma tarefa encontrada com os filtros selecionados."}
          </p>
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={editingTask}
      />
    </div>
  );
};

export default PostProductionPage;
