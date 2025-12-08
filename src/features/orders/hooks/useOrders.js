// src/features/orders/hooks/useOrders.js
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/ordersApi";

/**
 * A hook to fetch and manage a list of orders.
 * @returns {{orders: Array, isLoading: boolean, error: string|null}}
 */
export const useOrders = (filters = {}) => {
  const query = useQuery({
    queryKey: ["orders", filters],
    queryFn: () => getOrders(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    orders: query.data || [],
    isLoading: query.isLoading,
    error: query.error ? query.error.message : null,
    pagination: query.data?.pagination || null,
    refetch: query.refetch,
  };
};
