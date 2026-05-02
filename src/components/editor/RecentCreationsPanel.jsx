import "./RecentCreationsPanel.css";

function RecentCreationsPanel({ items, onSelectItem, onDeleteItem }) {
  if (!items.length) {
    return (
      <section className="recent-creations-panel">
        <div className="recent-creations-empty">
          <h3>Sin creaciones recientes</h3>
          <p>Cuando descargues una edición, aparecerá aquí.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="recent-creations-panel">
      <div className="recent-creations-panel__header">
        <div>
          <h3>Creaciones recientes</h3>
          <p>Consulta, reutiliza o elimina tus ediciones anteriores.</p>
        </div>
      </div>

      <div className="recent-creations-grid">
        {items.map((item) => (
          <article key={item.id} className="recent-creation-card">
            <button
              className="recent-creation-card__delete"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDeleteItem(item.id);
              }}
              title="Eliminar creación"
            >
              ✕
            </button>

            <button
              className="recent-creation-card__button"
              type="button"
              onClick={() => onSelectItem(item)}
            >
              <div className="recent-creation-card__preview">
                {item.mediaType === "image" && item.previewUrl ? (
                  <img src={item.previewUrl} alt={item.name} />
                ) : (
                  <div className="recent-creation-card__video">🎬</div>
                )}

                <div className="recent-creation-card__overlay">
                  <span>
                    {item.mediaType === "image"
                      ? "Volver a editar"
                      : "Ver registro"}
                  </span>
                </div>
              </div>

              <div className="recent-creation-card__body">
                <strong>{item.name}</strong>
                <p>Filtro: {item.filterName || "Sin filtro"}</p>
                <small>
                  {new Date(item.createdAt).toLocaleDateString("es-MX")}
                </small>
              </div>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RecentCreationsPanel;