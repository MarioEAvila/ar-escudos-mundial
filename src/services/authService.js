import apiClient from "../lib/apiClient";

async function registerUser(userData) {
  const response = await apiClient.post("/auth/register", userData);
  return response.data;
}

async function loginUser(credentials) {
  const response = await apiClient.post("/auth/login", credentials);
  return response.data;
}

async function getCurrentUser() {
  try {
    const response = await apiClient.get("/auth/me");
    return response.data;
  } catch {
    return null;
  }
}

async function logout() {
  await apiClient.post("/auth/logout");
}

async function updateCurrentUser(updatedUserData) {
  const response = await apiClient.patch("/auth/me", updatedUserData);
  return response.data;
}

const authService = {
  getCurrentUser,
  registerUser,
  loginUser,
  logout,
  updateCurrentUser,
};

export default authService;
