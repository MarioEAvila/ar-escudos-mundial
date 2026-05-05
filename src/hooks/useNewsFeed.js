import { useCallback, useEffect, useState } from "react";
import newsService from "../services/newsService";

export function useNewsFeed() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await newsService.getNews();
      setArticles(response.articles || []);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    articles,
    isLoading,
    error,
    refresh,
  };
}
