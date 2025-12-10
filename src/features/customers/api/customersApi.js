// src/features/customers/api/customersApi.js

import { apiClient } from "@/shared/lib/apiClient";

const defaultCustomer = {
  id: null,
  nombre: "Cliente Desconocido",
  correo: "",
  telefono: null,
  direccion: null,
  tickets: [],
  ordenes: [],
};

/**
 * Get all customers with optional filters
 */
export const getAllCustomers = async (filters = {}) => {
  try {
    const { data } = await apiClient.get(`/customers`, { params: filters });
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return [];
  }
};

export const getCustomerById = async (customerId) => {
  if (!customerId) return null;
  try {
    const { data } = await apiClient.get(`/customers/${customerId}`);

    // Backend may return customer with nested tickets and orders
    const customer = {
      ...defaultCustomer,
      ...(data || {}),
      tickets: data?.tickets || data?.ticketsHistoricos || [],
      ordenes: data?.ordenes || data?.orders || [],
    };

    return customer;
  } catch (error) {
    console.error(`Failed to fetch customer ${customerId}:`, error);
    return null;
  }
};

export const updateCustomer = async (customerId, customerData) => {
  if (!customerId) throw new Error("Customer ID is required");
  try {
    const { data } = await apiClient.patch(`/customers/${customerId}`, customerData);
    return data;
  } catch (error) {
    console.error(`Failed to update customer ${customerId}:`, error);
    throw error;
  }
};

/**
 * Optional helper to fetch tickets by customer id if customer endpoint does not include them
 */
export const getTicketsByCustomer = async (customerId, filters = {}) => {
  if (!customerId) return [];
  try {
    const params = { clienteId: customerId, ...filters };
    const { data } = await apiClient.get(`/tickets`, { params });
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  } catch (error) {
    console.error(`Failed to fetch tickets for customer ${customerId}:`, error);
    return [];
  }
};
