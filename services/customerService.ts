import type { Customer, CustomerFormData } from '../types';

const API_BASE_URL = '/api/customers';

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await fetch(API_BASE_URL);
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

export const addCustomer = async (customerData: CustomerFormData): Promise<Customer> => {
  try {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        // Propagate the specific error message from the backend
        throw new Error(errorData.message || `Error adding customer: ${response.statusText}`);
    }

    const newCustomer: Customer = await response.json();
    return newCustomer;
  } catch (error) {
    console.error("Failed to add customer via API", error);
    throw error; // Re-throw the error to be handled by the form component
  }
};
