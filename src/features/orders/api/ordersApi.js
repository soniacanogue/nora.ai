// src/features/orders/api/ordersApi.js
import { mockOrdenes } from "@/data/mockOrders";
import { mockClientes } from "@/data/mockClients";
import { mockTickets } from "@/data/mockTickets";

/**
 * Simulates an API call to get a list of orders.
 * @param {object} params - Filtering and pagination parameters.
 * @returns {Promise<Array>}
 */
export const getOrders = async (params = {}) => {
  console.log("Fetching MOCKED order list with params:", params);
  await new Promise((resolve) => setTimeout(resolve, 300));
  mockOrdenes.map((order) => {
    const cliente = mockClientes.find((c) => c.id === order.clienteId);
    order.cliente = cliente || { nombre: "Cliente Desconocido", correo: "" };
  });
  // Filtering logic would go here based on params
  return Promise.resolve(mockOrdenes);
};

/**
 * Simulates an API call to get an order by its ID.
 * Enriches the order with full client and ticket details.
 * @param {string} orderId - The ID of the order to find.
 * @returns {Promise<object|null>}
 */
export const getOrderById = async (orderId) => {
  console.log(`Fetching MOCKED order data for ID: ${orderId}...`);
  await new Promise((resolve) => setTimeout(resolve, 500));

  const order = mockOrdenes.find((o) => o.id === orderId);
  if (!order) {
    return Promise.resolve(null);
  }

  const cliente = mockClientes.find((c) => c.id === order.clienteId);
  const relatedTickets = mockTickets.filter((t) => t.ordenId === orderId);

  const enrichedOrder = {
    ...order,
    cliente: cliente || { nombre: "Cliente Desconocido", correo: "" },
    tickets: relatedTickets,
  };

  return Promise.resolve(enrichedOrder);
};
