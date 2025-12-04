// src/features/admin/templates/api.js
import { apiClient } from "@/shared/lib/apiClient";

export const getTemplates = async (
  filters = {},
  sort = { key: "nombre", order: "asc" }
) => {
  const params = new URLSearchParams();
  if (sort.key) params.append("sortBy", sort.key);
  if (sort.order) params.append("sortOrder", sort.order);

  const endpoint = `/templates?${params.toString()}`;
  const { data } = await apiClient.get(endpoint);
  return Array.isArray(data) ? data : [];
};

export const getTemplateById = async (id) => {
  const { data } = await apiClient.get(`/templates/${id}`);
  return data;
};

export const createTemplate = async (templateData) => {
  const { data } = await apiClient.post("/templates", templateData);
  return data;
};

export const updateTemplate = async ({ id, ...templateData }) => {
  const { data } = await apiClient.patch(`/templates/${id}`, templateData);
  return data;
};

export const deleteTemplate = async (id) => {
  await apiClient.delete(`/templates/${id}`);
};
