const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// TODO: UC-14 - Implement Knowledge Base CRUD operations
// Backend endpoints need to be implemented:
// GET /knowledge-base - List all documents
// POST /knowledge-base - Create new document
// GET /knowledge-base/:id - Get document by ID
// PATCH /knowledge-base/:id - Update document
// DELETE /knowledge-base/:id - Delete document

/**
 * Get all knowledge base documents
 * @param {Object} filters - Filter parameters (category, search, etc.)
 * @returns {Promise<Array>} List of knowledge base documents
 */
export const getKnowledgeBaseDocs = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE_URL}/knowledge-base?${params}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch knowledge base documents');
  }
  
  return response.json();
};

/**
 * Get a single knowledge base document by ID
 * @param {string} id - Document ID
 * @returns {Promise<Object>} Knowledge base document
 */
export const getKnowledgeBaseDoc = async (id) => {
  const response = await fetch(`${API_BASE_URL}/knowledge-base/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch knowledge base document');
  }
  
  return response.json();
};

/**
 * Create a new knowledge base document
 * @param {Object} data - Document data
 * @param {string} data.titulo - Document title
 * @param {string} data.contenido - Document content
 * @param {string} data.categoria - Document category (FAQ, POLITICA, PROCEDIMIENTO, etc.)
 * @param {Array<string>} data.etiquetas - Tags for the document
 * @returns {Promise<Object>} Created document
 */
export const createKnowledgeBaseDoc = async (data) => {
  const response = await fetch(`${API_BASE_URL}/knowledge-base`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create knowledge base document');
  }
  
  return response.json();
};

/**
 * Update a knowledge base document
 * @param {string} id - Document ID
 * @param {Object} data - Updated document data
 * @returns {Promise<Object>} Updated document
 */
export const updateKnowledgeBaseDoc = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/knowledge-base/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update knowledge base document');
  }
  
  return response.json();
};

/**
 * Delete a knowledge base document
 * @param {string} id - Document ID
 * @returns {Promise<void>}
 */
export const deleteKnowledgeBaseDoc = async (id) => {
  const response = await fetch(`${API_BASE_URL}/knowledge-base/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete knowledge base document');
  }
};

/**
 * Search knowledge base documents
 * @param {string} query - Search query
 * @returns {Promise<Array>} Matching documents
 */
export const searchKnowledgeBase = async (query) => {
  const response = await fetch(`${API_BASE_URL}/knowledge-base/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ query }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to search knowledge base');
  }
  
  return response.json();
};
