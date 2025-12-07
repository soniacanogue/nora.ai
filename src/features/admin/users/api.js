const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// TODO: UC-16 - User Management
// Backend endpoints are implemented:
// GET /users - List all users
// POST /users - Create new user
// GET /users/:id - Get user by ID
// PATCH /users/:id - Update user
// DELETE /users/:id - Delete user
// GET /users/profile - Get current user profile
// PATCH /users/profile - Update current user profile

/**
 * Get all users
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Array>} List of users
 */
export const getUsers = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE_URL}/users?${params}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  
  return response.json();
};

/**
 * Get a single user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object>} User object
 */
export const getUser = async (id) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  
  return response.json();
};

/**
 * Create a new user
 * @param {Object} data - User data
 * @returns {Promise<Object>} Created user
 */
export const createUser = async (data) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  
  return response.json();
};

/**
 * Update a user
 * @param {string} id - User ID
 * @param {Object} data - Updated user data
 * @returns {Promise<Object>} Updated user
 */
export const updateUser = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update user');
  }
  
  return response.json();
};

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise<void>}
 */
export const deleteUser = async (id) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
};

/**
 * Get current user profile
 * @returns {Promise<Object>} User profile
 */
export const getUserProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  
  return response.json();
};

/**
 * Update current user profile
 * @param {Object} data - Updated profile data
 * @returns {Promise<Object>} Updated profile
 */
export const updateUserProfile = async (data) => {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update user profile');
  }
  
  return response.json();
};
