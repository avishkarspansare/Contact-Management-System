import axios from "axios";

// Base URL for the Spring Boot backend. Adjust if your backend runs
// on a different port or host.
<<<<<<< HEAD
const API_BASE_URL = 
  "http://localhost:8080/api/contacts";
  // process.env.REACT_APP_API_BASE_URL;
=======
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api/contacts";
>>>>>>> 14cdaac30026e5a1de02c60386f83a415250116c

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Thin wrapper around the Contact REST API.
 * Every method returns response.data directly so components
 * don't have to unwrap axios responses themselves.
 */
export const contactApi = {
  getAll: async () => {
    const response = await apiClient.get("");
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  },

  create: async (contactData) => {
    const response = await apiClient.post("", contactData);
    return response.data;
  },

  update: async (id, contactData) => {
    const response = await apiClient.put(`/${id}`, contactData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  },

  search: async (term) => {
    const response = await apiClient.get("/search", { params: { term } });
    return response.data;
  },

  getByCategory: async (category) => {
    const response = await apiClient.get(`/category/${category}`);
    return response.data;
  },
};

export default apiClient;
