import type { Customer, CustomerFormData } from "../types";

const API_BASE_URL = "/api/customers";

interface GetCustomersParams {
  month?: string;
}

export const getCustomers = async (
  params: GetCustomersParams = {}
): Promise<Customer[]> => {
  const query = new URLSearchParams();
  if (params.month) query.append("month", params.month);

  try {
    const response = await fetch(`${API_BASE_URL}?${query.toString()}`);
    if (!response.ok) {
      throw new Error(`Error fetching customers: ${response.statusText}`);
    }
    const data: Customer[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch customers from API", error);
    return []; // Return empty array on failure
  }
};

export const getCustomerById = async (id: string): Promise<Customer> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Error fetching customer: ${response.statusText}`);
  }
  return response.json();
};

export const addCustomer = async (
  customerData: CustomerFormData
): Promise<Customer> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Propagate the specific error message from the backend
      throw new Error(
        errorData.message || `Error adding customer: ${response.statusText}`
      );
    }

    const newCustomer: Customer = await response.json();
    return newCustomer;
  } catch (error) {
    console.error("Failed to add customer via API", error);
    throw error; // Re-throw the error to be handled by the form component
  }
};

export const updateCustomer = async (
  id: string,
  customerData: CustomerFormData
): Promise<Customer> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customerData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Error updating customer: ${response.statusText}`
    );
  }

  return response.json();
};

export const deleteCustomer = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Error deleting customer: ${response.statusText}`);
  }
};
