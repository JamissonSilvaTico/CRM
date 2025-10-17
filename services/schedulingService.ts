import type { Scheduling, SchedulingFormData } from "../types";

const API_BASE_URL = "/api/schedules";

interface GetSchedulesParams {
  month?: string;
  year?: string;
  sessionType?: string;
  indicacao?: string;
}

export const getSchedules = async (
  params: GetSchedulesParams = {}
): Promise<Scheduling[]> => {
  const query = new URLSearchParams();
  if (params.month) query.append("month", params.month);
  if (params.year) query.append("year", params.year);
  if (params.sessionType) query.append("sessionType", params.sessionType);
  if (params.indicacao) query.append("indicacao", params.indicacao);

  try {
    const response = await fetch(`${API_BASE_URL}?${query.toString()}`);
    if (!response.ok) {
      throw new Error(`Error fetching schedules: ${response.statusText}`);
    }
    const data: Scheduling[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch schedules from API", error);
    return [];
  }
};

export const getScheduleById = async (id: string): Promise<Scheduling> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Error fetching schedule: ${response.statusText}`);
  }
  return response.json();
};

export const addSchedule = async (
  scheduleData: SchedulingFormData
): Promise<Scheduling> => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(scheduleData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Error adding schedule: ${response.statusText}`
    );
  }
  return response.json();
};

export const updateSchedule = async (
  id: string,
  scheduleData: Partial<SchedulingFormData>
): Promise<Scheduling> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(scheduleData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Error updating schedule: ${response.statusText}`
    );
  }
  return response.json();
};

export const deleteSchedule = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Error deleting schedule: ${response.statusText}`);
  }
};
