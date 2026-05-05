import apiClient from "../lib/apiClient";

async function getProfile(username) {
  const response = await apiClient.get(`/profiles/${username}`);
  return response.data;
}

export default {
  getProfile,
};
