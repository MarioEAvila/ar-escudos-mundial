import apiClient from "../lib/apiClient";

async function getNews() {
  const response = await apiClient.get("/news");
  return response.data;
}

export default {
  getNews,
};
