// src/features/customers/hooks/useCustomer.js
import { useQuery } from "@tanstack/react-query";
import { getCustomerById, getTicketsByCustomer, getAllCustomers } from "../api/customersApi";

export const useCustomers = (filters = {}) => {
  return useQuery({
    queryKey: ["customers", filters],
    queryFn: () => getAllCustomers(filters),
  });
};

export const useCustomer = (customerId) => {
  return useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => getCustomerById(customerId),
    enabled: !!customerId,
  });
};

export const useCustomerTickets = (customerId) => {
  return useQuery({
    queryKey: ["customer", customerId, "tickets"],
    queryFn: () => getTicketsByCustomer(customerId),
    enabled: !!customerId,
  });
};
