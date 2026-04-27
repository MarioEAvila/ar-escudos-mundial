import { useMemo, useState } from "react";
import "./MediaEditorPage.css";
import HomeSidebar from "../components/layout/HomeSidebar";
import HomeTopbar from "../components/home/HomeTopbar";
import MediaUploader from "../components/editor/MediaUploader";
import EditorPreview from "../components/editor/EditorPreview";
import FilterPanel, { filters } from "../components/editor/FilterPanel";
import ffmpegService from "../services/ffmpegService";

const defaultAdjustments = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  sepia: 0,
  grayscale: 0,
  blur: 0,
  hue: 0,
};

function MediaEditorPage({
  currentUser,
  onOpenAR,
  onGoHome,
  onOpenProfile,
  onOpenEditor,
  onOpenMinigame,
}) {
  const [media, setMedia] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [adjustments, setAdjustments] = useState(defaultAdjustments);

  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [vignette, setVignette] = useState(false);
  const [textOverlay, setTextOverlay] = useState({ text: "" });
  const [stickerOverlay, setStickerOverlay] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const filterStyle = useMemo(() => {
    return `
      brightness(${adjustments.brightness}%)
      contrast(${adjustments.contrast}%)
      saturate(${adjustments.saturate}%)
      sepia(${adjustments.sepia}%)
      grayscale(${adjustments.grayscale}%)
      blur(${adjustments.blur}px)
      hue-rotate(${adjustments.hue}deg)
    `;
  }, [adjustments]);

  const handleMediaUpload = (mediaData) => {
    setMedia(mediaData);
    setRotation(0);
    setFlipX(false);
    setFlipY(false);
    setVignette(false);
    setTextOverlay({ text: "" });
    setStickerOverlay("");
    setSelectedFilter(filters[0]);
    setAdjustments(defaultAdjustments);
  };

  const handleSelectFilter = (filter) => {
    setSelectedFilter(filter);
    setAdjustments(filter.values);
  };

  const handleAdjustmentChange = (key, value) => {
    setAdjustments((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setSelectedFilter(filters[0]);
    setAdjustments(defaultAdjustments);
    setRotation(0);
    setFlipX(false);
    setFlipY(false);
    setVignette(false);
    setTextOverlay({ text: "" });
    setStickerOverlay("");
  };

  const handleAddText = () => {
    const text = window.prompt("Escribe el texto que quieres agregar:");
    if (!text || !text.trim()) return;
    setTextOverlay({ text: text.trim() });
  };

  const getBaseFileName = () => {
    if (!media?.name) return "mundial-fc-edit";
    return media.name.replace(/\.[^/.]+$/, "");
  };

  const drawVignette = (ctx, canvas) => {
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      Math.min(canvas.width, canvas.height) * 0.25,
      canvas.width / 2,
      canvas.height / 2,
      Math.max(canvas.width, canvas.height) * 0.68
    );

    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(0,0,0,0.62)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const drawTextOverlay = (ctx, canvas) => {
    if (!textOverlay.text) return;

    const fontSize = Math.max(42, Math.floor(canvas.width * 0.06));
    const text = textOverlay.text.toUpperCase();

    ctx.save();
    ctx.font = `${fontSize}px Impact, Arial Black, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const x = canvas.width / 2;
    const y = canvas.height * 0.82;

    ctx.lineWidth = Math.max(4, canvas.width * 0.005);
    ctx.strokeStyle = "rgba(0,0,0,0.85)";
    ctx.fillStyle = "#ffffff";

    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);

    ctx.restore();
  };

  const drawStickerOverlay = (ctx, canvas) => {
    if (!stickerOverlay) return;

    const size = Math.max(70, Math.floor(canvas.width * 0.1));

    ctx.save();
    ctx.font = `${size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowColor = "rgba(0,0,0,0.75)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;

    ctx.fillText(stickerOverlay, canvas.width * 0.86, canvas.height * 0.16);

    ctx.restore();
  };

  const drawMediaToCanvas = (source, canvas, ctx) => {
    const sourceWidth = source.videoWidth || source.naturalWidth;
    const sourceHeight = source.videoHeight || source.naturalHeight;

    const isSideways = rotation % 180 !== 0;

    canvas.width = isSideways ? sourceHeight : sourceWidth;
    canvas.height = isSideways ? sourceWidth : sourceHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);

    ctx.filter = filterStyle;

    ctx.drawImage(
      source,
      -sourceWidth / 2,
      -sourceHeight / 2,
      sourceWidth,
      sourceHeight
    );

    ctx.restore();

    if (vignette) drawVignette(ctx, canvas);
    drawTextOverlay(ctx, canvas);
    drawStickerOverlay(ctx, canvas);
  };

  const downloadImage = () => {
    if (!media) return;

    const img = new Image();
    img.src = media.previewUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      drawMediaToCanvas(img, canvas, ctx);

      let downloadType = "image/png";
      let extension = "png";

      if (media.type === "image/jpeg" || media.type === "image/jpg") {
        downloadType = "image/jpeg";
        extension = "jpg";
      }

      if (media.type === "image/webp") {
        downloadType = "image/webp";
        extension = "webp";
      }

      const link = document.createElement("a");
      link.download = `${getBaseFileName()}-${selectedFilter.id}.${extension}`;

      if (downloadType === "image/jpeg") {
        link.href = canvas.toDataURL(downloadType, 0.92);
      } else {
        link.href = canvas.toDataURL(downloadType);
      }

      link.click();
    };
  };

  const downloadVideo = async () => {
    if (!media?.file) return;

    try {
      setIsExporting(true);
      setExportProgress(0);

      const baseFileName = getBaseFileName();

      const blob = await ffmpegService.exportVideoToMp4({
        file: media.file,
        adjustments,
        rotation,
        flipX,
        flipY,
        vignette,
        baseFileName,
        onProgress: setExportProgress,
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.download = `${baseFileName}-${selectedFilter.id}.mp4`;
      link.href = url;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert(
        "No se pudo exportar el video. Prueba con un video más corto o de menor resolución."
      );
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleDownload = () => {
    if (!media) return;

    if (media.mediaType === "video") {
      downloadVideo();
      return;
    }

    downloadImage();
  };

  return (
    <main className="media-editor-page">
      <div className="media-editor-page__grid">
        <div className="media-editor-page__left">
          <HomeSidebar
            user={currentUser}
            onOpenAR={onOpenAR}
            onGoHome={onGoHome}
            onOpenProfile={onOpenProfile}
            onOpenEditor={onOpenEditor}
            onOpenMinigame={onOpenMinigame}
            activeSection="editor"
          />
        </div>

        <section className="media-editor-page__center">
          <HomeTopbar
            onGoHome={onGoHome}
            onOpenProfile={onOpenProfile}
            onOpenEditor={onOpenEditor}
          />

          <header className="media-editor-hero">
            <div>
              <p>Herramienta creativa</p>
              <h1>Editor Multimedia</h1>
              <span>
                Edita imágenes y videos con filtros estilo Mundial FC.
              </span>
            </div>
          </header>

          <div className="media-editor-workspace">
            <MediaUploader onMediaUpload={handleMediaUpload} />

            <EditorPreview
              media={media}
              filterStyle={filterStyle}
              rotation={rotation}
              flipX={flipX}
              flipY={flipY}
              vignette={vignette}
              textOverlay={textOverlay}
              stickerOverlay={stickerOverlay}
              onDownload={handleDownload}
              onRotate={() => setRotation((prev) => (prev + 90) % 360)}
              onFlipX={() => setFlipX((prev) => !prev)}
              onFlipY={() => setFlipY((prev) => !prev)}
              onToggleVignette={() => setVignette((prev) => !prev)}
              onAddText={handleAddText}
              onSelectSticker={setStickerOverlay}
            />
          </div>

          {isExporting && (
            <div className="media-editor-exporting">
              Exportando video con FFmpeg... {exportProgress}%
            </div>
          )}
        </section>

        <aside className="media-editor-page__right">
          <FilterPanel
            selectedFilter={selectedFilter}
            onSelectFilter={handleSelectFilter}
            adjustments={adjustments}
            onAdjustmentChange={handleAdjustmentChange}
            onReset={handleReset}
          />

          <section className="media-editor-info">
            <h2>Formatos soportados</h2>

            <div>
              <strong>Imágenes</strong>
              <p>JPG, JPEG, PNG, WEBP</p>
            </div>

            <div>
              <strong>Videos</strong>
              <p>MP4, WEBM, MOV</p>
            </div>

            <div>
              <strong>Exportación video</strong>
              <p>
                Los videos se exportan como MP4 con filtros, rotación, volteo y
                viñeta.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

export default MediaEditorPage;