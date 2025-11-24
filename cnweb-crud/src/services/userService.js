import axios from 'axios';

const API_URL = "https://jsonplaceholder.typicode.com/users";

// Fetch all users (GET)
export const getAllUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    throw error;
  }
};

// Create a new user (POST)
export const createUser = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);
    return response.data;
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error;
  }
};

// Update an existing user (PUT)
export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error in updateUser:", error);
    throw error;
  }
};

// Delete a user (DELETE)
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in deleteUser:", error);
    throw error;
  }
};
