import axios from "axios";
import { env } from "../config/env.js";
import { cache } from "../lib/cache.js";

export async function getNewsArticles() {
  const cached = cache.get("news:football");
  if (cached) return cached;

  if (!env.theNewsApiKey) {
    return [];
  }

  const response = await axios.get(`${env.theNewsApiBaseUrl}/all`, {
    params: {
      api_token: env.theNewsApiKey,
      language: "es",
      search: "futbol OR mundial 2026",
      categories: "sports",
      limit: 12,
    },
  });

  const articles = (response.data.data || []).map((item) => ({
    id: item.uuid,
    title: item.title,
    summary: item.description,
    url: item.url,
    sourceName: item.source,
    publishedLabel: new Date(item.published_at).toLocaleString("es-MX"),
    imageUrl: item.image_url || "",
  }));

  cache.set("news:football", articles, 60 * 10);
  return articles;
}
