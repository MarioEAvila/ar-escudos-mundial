import AppShell from "../components/layout/AppShell";
import EmptyPanel from "../components/common/EmptyPanel";
import LoadingPanel from "../components/common/LoadingPanel";
import { useNewsFeed } from "../hooks/useNewsFeed";
import "./NewsPage.css";

function NewsPage({ currentUser, onOpenAR }) {
  const { articles, isLoading, error } = useNewsFeed();
  const [featuredArticle, ...latestArticles] = articles;

  return (
    <AppShell user={currentUser} activeSection="news" onOpenAR={onOpenAR}>
      <section className="page-hero">
        <p>Actualidad futbolera</p>
        <h1>Noticias</h1>
        <span>Noticias actuales de futbol y seguimiento del Mundial 2026.</span>
      </section>

      <div className="news-page__feed">
        {isLoading ? (
          <LoadingPanel text="Buscando noticias..." />
        ) : error ? (
          <EmptyPanel text={error} />
        ) : articles.length > 0 ? (
          <>
            {featuredArticle ? (
              <article className="news-featured">
                <div className="news-featured__body">
                  <p className="news-featured__eyebrow">Portada futbolera</p>
                  <h2>{featuredArticle.title}</h2>
                  <p className="news-featured__meta">
                    {featuredArticle.sourceName || "Fuente"} ·{" "}
                    {featuredArticle.publishedLabel || "Actual"}
                  </p>
                  <p>
                    {featuredArticle.summary || "Sin resumen disponible para esta noticia."}
                  </p>
                  <a href={featuredArticle.url} target="_blank" rel="noreferrer">
                    Abrir noticia
                  </a>
                </div>

                {featuredArticle.imageUrl ? (
                  <div className="news-featured__image">
                    <img src={featuredArticle.imageUrl} alt={featuredArticle.title} />
                  </div>
                ) : null}
              </article>
            ) : null}

            <div className="news-page__list">
              {latestArticles.map((article) => (
                <article key={article.id || article.url} className="news-card">
                  {article.imageUrl ? (
                    <div className="news-card__image">
                      <img src={article.imageUrl} alt={article.title} />
                    </div>
                  ) : null}

                  <div className="news-card__body">
                    <p className="news-card__tag">Futbol</p>
                    <p className="news-card__meta">
                      {article.sourceName || "Fuente"} · {article.publishedLabel || "Actual"}
                    </p>
                    <h2>{article.title}</h2>
                    <p>{article.summary || "Sin resumen disponible."}</p>
                    <a href={article.url} target="_blank" rel="noreferrer">
                      Leer nota
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <EmptyPanel text="No hay noticias de futbol disponibles por ahora." />
        )}
      </div>
    </AppShell>
  );
}

export default NewsPage;
