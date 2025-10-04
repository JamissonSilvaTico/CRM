import type { Task, TaskFormData } from "../types";

const API_BASE_URL = "/api/tasks";

interface GetTasksParams {
  status?: string;
  servico?: string;
  mes?: string;
}

export const getTasks = async (
  params: GetTasksParams = {}
): Promise<Task[]> => {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  if (params.servico) query.append("servico", params.servico);
  if (params.mes) query.append("mes", params.mes); // Mês é 0-based no backend (0-11)

  try {
    const response = await fetch(`${API_BASE_URL}?${query.toString()}`);
    if (!response.ok) {
      throw new Error(`Error fetching tasks: ${response.statusText}`);
    }
    const data: Task[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch tasks from API", error);
    // Em caso de falha, retorna array vazio para não quebrar a UI
    return [];
  }
};

export const addTask = async (taskData: TaskFormData): Promise<Task> => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Error adding task: ${response.statusText}`
    );
  }
  return response.json();
};

export const updateTask = async (
  id: string,
  taskData: Partial<TaskFormData>
): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Error updating task: ${response.statusText}`
    );
  }
  return response.json();
};

export const deleteTask = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Error deleting task: ${response.statusText}`);
  }
};
