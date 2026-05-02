import { useMemo, useState } from "react";
import "./GalleryPanel.css";
import { mediaGalleryItems } from "../../data/mediaGalleryData";

function GalleryPanel({ onSelectItem }) {
  const [filterTeam, setFilterTeam] = useState("all");

  const teams = useMemo(() => {
    const unique = new Map();

    mediaGalleryItems.forEach((item) => {
      unique.set(item.teamId, {
        teamId: item.teamId,
        teamName: item.teamName,
        flag: item.flag,
      });
    });

    return Array.from(unique.values());
  }, []);

  const filteredItems = useMemo(() => {
    if (filterTeam === "all") return mediaGalleryItems;

    return mediaGalleryItems.filter((item) => item.teamId === filterTeam);
  }, [filterTeam]);

  const playPreviewVideo = (event) => {
    const video = event.currentTarget.querySelector("video");

    if (!video) return;

    video.currentTime = 0;
    video.muted = true;

    video.play().catch((error) => {
      console.log("No se pudo reproducir el preview del video:", error);
    });
  };

  const stopPreviewVideo = (event) => {
    const video = event.currentTarget.querySelector("video");

    if (!video) return;

    video.pause();
    video.currentTime = 0;
  };

  return (
    <section className="gallery-panel">
      <div className="gallery-panel__header">
        <div>
          <h3>Galería Mundial FC</h3>
          <p>Elige una imagen o video para editarlo en el área principal.</p>
        </div>

        <select
          value={filterTeam}
          onChange={(e) => setFilterTeam(e.target.value)}
        >
          <option value="all">Todas las selecciones</option>
          {teams.map((team) => (
            <option key={team.teamId} value={team.teamId}>
              {team.flag} {team.teamName}
            </option>
          ))}
        </select>
      </div>

      <div className="gallery-panel__grid">
        {filteredItems.map((item) => (
          <article key={item.id} className="gallery-card">
            <button
              className="gallery-card__media-button"
              onClick={() => onSelectItem(item)}
              title="Usar en editor"
            >
              <div
                className="gallery-card__preview"
                onMouseEnter={playPreviewVideo}
                onMouseLeave={stopPreviewVideo}
              >
                {item.mediaType === "image" ? (
                  <img src={item.src} alt={item.title} />
                ) : (
                  <video
                    src={item.src}
                    muted
                    loop
                    playsInline
                    preload="auto"
                  />
                )}

                <div className="gallery-card__overlay">
                  <span>Usar en editor</span>
                </div>
              </div>

              <div className="gallery-card__body">
                <strong>{item.title}</strong>
              </div>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default GalleryPanel;