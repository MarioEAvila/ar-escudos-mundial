import { useMemo, useState } from "react";
import { filters } from "../components/editor/FilterPanel";
import ffmpegService from "../services/ffmpegService";

const RECENT_CREATIONS_KEY = "mundial_fc_recent_creations";

const defaultAdjustments = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  sepia: 0,
  grayscale: 0,
  blur: 0,
  hue: 0,
};

function getStoredRecentCreations() {
  const data = localStorage.getItem(RECENT_CREATIONS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveStoredRecentCreations(creations) {
  localStorage.setItem(RECENT_CREATIONS_KEY, JSON.stringify(creations));
}

function getMimeFromExtension(extension) {
  if (extension === "jpg" || extension === "jpeg") return "image/jpeg";
  if (extension === "webp") return "image/webp";
  if (extension === "mp4") return "video/mp4";
  if (extension === "webm") return "video/webm";
  if (extension === "mov") return "video/quicktime";
  return "image/png";
}

function createMediaFromGalleryItem(item) {
  return {
    id: item.id,
    sourceType: "gallery",
    mediaType: item.mediaType,
    name: `${item.id}.${item.extension}`,
    title: item.title,
    teamId: item.teamId,
    teamName: item.teamName,
    flag: item.flag,
    previewUrl: item.src,
    src: item.src,
    type: item.type,
    extension: item.extension,
    file: null,
  };
}

function createMediaFromRecentItem(item) {
  return {
    id: item.id,
    sourceType: "recent",
    mediaType: item.mediaType,
    name: item.name,
    title: item.title || item.name,
    teamId: item.teamId || "",
    teamName: item.teamName || "",
    flag: item.flag || "",
    previewUrl: item.previewUrl || item.src || "",
    src: item.previewUrl || item.src || "",
    type: getMimeFromExtension(item.extension),
    extension: item.extension,
    file: null,
  };
}

async function getFileFromMedia(media) {
  if (media.file) return media.file;

  if (!media.src && !media.previewUrl) {
    throw new Error("No hay archivo disponible para exportar.");
  }

  const response = await fetch(media.src || media.previewUrl);
  const blob = await response.blob();

  return new File([blob], media.name, {
    type: media.type || blob.type,
  });
}

export function useMediaEditor() {
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

  const [recentCreations, setRecentCreations] = useState(
    getStoredRecentCreations
  );

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

  const resetTools = () => {
    setRotation(0);
    setFlipX(false);
    setFlipY(false);
    setVignette(false);
    setTextOverlay({ text: "" });
    setStickerOverlay("");
    setSelectedFilter(filters[0]);
    setAdjustments(defaultAdjustments);
  };

  const handleMediaUpload = (mediaData) => {
    setMedia({
      ...mediaData,
      sourceType: "upload",
      title: mediaData.name,
      src: mediaData.previewUrl,
    });

    resetTools();
  };

  const handleSelectGalleryItem = (item) => {
    setMedia(createMediaFromGalleryItem(item));
    resetTools();
  };

  const handleSelectRecentCreation = (item) => {
    if (item.mediaType === "video" && !item.previewUrl) {
      alert(
        "Los videos recientes solo guardan registro. Para volver a editarlos, vuelve a subir el archivo original."
      );
      return;
    }

    setMedia(createMediaFromRecentItem(item));
    resetTools();
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
    resetTools();
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

  const addRecentCreation = (creation) => {
    const updated = [creation, ...recentCreations].slice(0, 12);

    setRecentCreations(updated);
    saveStoredRecentCreations(updated);
  };

  const deleteRecentCreation = (creationId) => {
    const confirmDelete = window.confirm(
      "¿Quieres eliminar esta creación reciente?"
    );

    if (!confirmDelete) return;

    const updated = recentCreations.filter(
      (creation) => creation.id !== creationId
    );

    setRecentCreations(updated);
    saveStoredRecentCreations(updated);
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

      const fileName = `${getBaseFileName()}-${selectedFilter.id}.${extension}`;
      const href =
        downloadType === "image/jpeg"
          ? canvas.toDataURL(downloadType, 0.92)
          : canvas.toDataURL(downloadType);

      const link = document.createElement("a");
      link.download = fileName;
      link.href = href;
      link.click();

      addRecentCreation({
        id: crypto.randomUUID(),
        sourceType: "recent",
        mediaType: "image",
        name: fileName,
        title: fileName,
        previewUrl: href,
        extension,
        filterId: selectedFilter.id,
        filterName: selectedFilter.name,
        createdAt: new Date().toISOString(),
      });
    };

    img.src = media.previewUrl || media.src;
  };

  const downloadVideo = async () => {
    if (!media) return;

    try {
      setIsExporting(true);
      setExportProgress(0);

      const baseFileName = getBaseFileName();
      const file = await getFileFromMedia(media);

      const blob = await ffmpegService.exportVideoToMp4({
        file,
        adjustments,
        rotation,
        flipX,
        flipY,
        vignette,
        baseFileName,
        onProgress: setExportProgress,
      });

      const url = URL.createObjectURL(blob);
      const fileName = `${baseFileName}-${selectedFilter.id}.mp4`;

      const link = document.createElement("a");
      link.download = fileName;
      link.href = url;
      link.click();

      URL.revokeObjectURL(url);

      addRecentCreation({
        id: crypto.randomUUID(),
        sourceType: "recent",
        mediaType: "video",
        name: fileName,
        title: fileName,
        previewUrl: "",
        extension: "mp4",
        filterId: selectedFilter.id,
        filterName: selectedFilter.name,
        createdAt: new Date().toISOString(),
      });
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

  return {
    media,
    selectedFilter,
    adjustments,
    rotation,
    flipX,
    flipY,
    vignette,
    textOverlay,
    stickerOverlay,
    isExporting,
    exportProgress,
    recentCreations,
    filterStyle,

    handleMediaUpload,
    handleSelectGalleryItem,
    handleSelectRecentCreation,
    handleSelectFilter,
    handleAdjustmentChange,
    handleReset,
    handleAddText,
    handleDownload,
    deleteRecentCreation,

    setRotation,
    setFlipX,
    setFlipY,
    setVignette,
    setStickerOverlay,
  };
}