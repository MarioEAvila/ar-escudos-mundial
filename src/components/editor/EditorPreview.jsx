import "./EditorPreview.css";

function EditorPreview({
  media,
  filterStyle,
  rotation,
  flipX,
  flipY,
  vignette,
  textOverlay,
  stickerOverlay,
  onDownload,
  onRotate,
  onFlipX,
  onFlipY,
  onToggleVignette,
  onAddText,
  onSelectSticker,
}) {
  const transformStyle = `
    rotate(${rotation}deg)
    scaleX(${flipX ? -1 : 1})
    scaleY(${flipY ? -1 : 1})
  `;

  const isVideo = media?.mediaType === "video";

  return (
    <section className="editor-preview">
      <div className={`editor-preview__stage ${vignette ? "has-vignette" : ""}`}>
        {media ? (
          <div className="editor-preview__canvas">
            {isVideo ? (
              <video
                id="edited-video-preview"
                src={media.previewUrl}
                controls
                playsInline
                style={{
                  filter: filterStyle,
                  transform: transformStyle,
                }}
              />
            ) : (
              <img
                id="edited-image-preview"
                src={media.previewUrl}
                alt="Vista previa editada"
                style={{
                  filter: filterStyle,
                  transform: transformStyle,
                }}
              />
            )}

            {textOverlay?.text && (
              <div className="editor-preview__text-overlay">
                {textOverlay.text}
              </div>
            )}

            {stickerOverlay && (
              <div className="editor-preview__sticker-overlay">
                {stickerOverlay}
              </div>
            )}
          </div>
        ) : (
          <div className="editor-preview__empty">
            <h3>Vista previa</h3>
            <p>Sube una imagen o video para comenzar a editar.</p>
          </div>
        )}
      </div>

      <div className="editor-preview__actions">
        <button disabled={!media} onClick={onRotate}>Rotar</button>
        <button disabled={!media} onClick={onFlipX}>Voltear H</button>
        <button disabled={!media} onClick={onFlipY}>Voltear V</button>
        <button disabled={!media} onClick={onToggleVignette}>Viñeta</button>
        <button disabled={!media} onClick={onAddText}>Texto</button>

        <select
          className="editor-preview__sticker-select"
          disabled={!media}
          onChange={(e) => onSelectSticker(e.target.value)}
          defaultValue=""
        >
          <option value="">Stickers</option>
          <option value="⚽">⚽ Balón</option>
          <option value="🏆">🏆 Copa</option>
          <option value="🔥">🔥 Fuego</option>
          <option value="🇲🇽">🇲🇽 México</option>
          <option value="💚">💚 Verde FC</option>
          <option value="⭐">⭐ Estrella</option>
        </select>

        <button
          className="editor-preview__download"
          disabled={!media}
          onClick={onDownload}
        >
          Descargar
        </button>
      </div>
    </section>
  );
}

export default EditorPreview;