// src/features/customers/hooks/useCustomer.js
import { useQuery } from "@tanstack/react-query";
import { getCustomerById, getTicketsByCustomer } from "../api/customersApi";

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
