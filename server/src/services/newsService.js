import axios from "axios";
import { env } from "../config/env.js";
import { cache } from "../lib/cache.js";

const NEWS_CACHE_KEY = "news:football:v5";
const NEWS_CACHE_TTL_SECONDS = 60 * 30;
const NEWS_ARTICLES_LIMIT = 3;

export async function getNewsArticles() {
  const cached = cache.get(NEWS_CACHE_KEY);
  if (cached) return cached;

  if (!env.theNewsApiKey) {
    return [];
  }

  const searches = [
    "futbol",
    "mundial 2026",
    "football",
  ];

  let articles = [];

  for (const search of searches) {
    const response = await axios.get(`${env.theNewsApiBaseUrl}/all`, {
      params: {
        api_token: env.theNewsApiKey,
        language: "es",
        search,
        categories: "sports",
        limit: NEWS_ARTICLES_LIMIT,
      },
    });

    const seenUrls = new Set();
    articles = (response.data.data || [])
      .sort((left, right) => new Date(right.published_at) - new Date(left.published_at))
      .filter((item) => {
        if (!item.url || seenUrls.has(item.url)) return false;
        seenUrls.add(item.url);
        return true;
      })
      .map((item) => ({
        id: item.uuid,
        title: item.title,
        summary: item.description || item.snippet || "",
        url: item.url,
        sourceName: item.source,
        publishedLabel: new Date(item.published_at).toLocaleString("es-MX"),
        imageUrl: item.image_url
          ? `/api/news/image?url=${encodeURIComponent(item.image_url)}`
          : "",
      }));

    if (articles.length > 0) {
      break;
    }
  }

  if (articles.length > 0) {
    cache.set(NEWS_CACHE_KEY, articles, NEWS_CACHE_TTL_SECONDS);
  }

  return articles;
}
