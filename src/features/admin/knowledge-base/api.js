import { apiClient } from "@/shared/lib/apiClient";

const normalizeCategory = (value) => {
  if (!value) return "OTRO";
  return value.toString().trim().toUpperCase();
};

const normalizeDocument = (document = {}) => {
  const categoria = normalizeCategory(document.categoria || document.category);
  return {
    id: document.id,
    titulo: document.titulo || document.pregunta || document.nombre || "Sin título",
    contenido:
      document.contenido ||
      document.respuesta ||
      document.procedimiento ||
      document.descripcion ||
      "",
    categoria,
    etiquetas: document.etiquetas || document.tags || [],
    prioridad: document.prioridad || document.priority || null,
    creadoEn: document.creadoEn || document.createdAt || document.creado_el,
    actualizadoEn:
      document.actualizadoEn || document.updatedAt || document.actualizado_el,
  };
};

const serializeDocumentPayload = (payload = {}) => ({
  titulo: payload.titulo || payload.pregunta || "",
  contenido: payload.contenido || payload.respuesta || payload.procedimiento || "",
  categoria: normalizeCategory(payload.categoria),
  etiquetas: payload.etiquetas || [],
});

const adaptListResponse = (payload = {}) => {
  const items = payload.data || payload.documentos || payload.results || [];
  const pagination = payload.pagination || {
    pagina: 1,
    limite: items.length,
    total: items.length,
  };

  return {
    documents: items.map(normalizeDocument),
    pagination,
  };
};

const buildListQueryParams = (filters = {}) => {
  const params = new URLSearchParams();

  const categoryFilter = filters.categoria || filters.category;
  const searchFilter = filters.buscar || filters.search || filters.query;
  const limit = filters.limite || filters.limit;
  const page = filters.pagina || filters.page;

  if (categoryFilter) {
    params.set("categoria", normalizeCategory(categoryFilter));
  }

  if (searchFilter) {
    params.set("buscar", searchFilter.trim());
  }

  if (limit) {
    params.set("limite", limit);
  }

  if (page) {
    params.set("pagina", page);
  }

  return params.toString();
};

export const getKnowledgeBaseDocs = async (filters = {}) => {
  const queryString = buildListQueryParams(filters);
  const endpoint = `/knowledge-base${queryString ? `?${queryString}` : ""}`;
  const { data } = await apiClient.get(endpoint);
  return adaptListResponse(data);
};

export const getKnowledgeBaseDoc = async (id) => {
  if (!id) throw new Error("Document ID is required");
  const { data } = await apiClient.get(`/knowledge-base/${id}`);
  return normalizeDocument(data);
};

export const createKnowledgeBaseDoc = async (payload) => {
  const { data } = await apiClient.post(
    "/knowledge-base",
    serializeDocumentPayload(payload),
  );
  return normalizeDocument(data);
};

export const updateKnowledgeBaseDoc = async (id, payload) => {
  const { data } = await apiClient.patch(
    `/knowledge-base/${id}`,
    serializeDocumentPayload(payload),
  );
  return normalizeDocument(data);
};

export const deleteKnowledgeBaseDoc = async (id) => {
  await apiClient.delete(`/knowledge-base/${id}`);
};

export const searchKnowledgeBase = async (payload = {}) => {
  const body = {
    query: payload.query || payload.buscar || payload.search || "",
  };

  if (payload.categoria || payload.category) {
    body.categoria = normalizeCategory(payload.categoria || payload.category);
  }

  if (payload.limite || payload.limit) {
    body.limite = payload.limite || payload.limit;
  }

  const { data } = await apiClient.post("/knowledge-base/search", body);
  const results = data.resultados || data.data || [];
  return {
    resultados: results.map(normalizeDocument),
    total: data.total || results.length,
  };
};

export const getKnowledgeBaseCategories = async () => {
  const { data } = await apiClient.get("/knowledge-base/categories");
  if (Array.isArray(data)) {
    return data.map(normalizeCategory);
  }
  return [];
};
