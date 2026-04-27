import "./MediaUploader.css";

function MediaUploader({ onMediaUpload }) {
  const getExtension = (fileName) => {
    return fileName.split(".").pop()?.toLowerCase() || "png";
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert("Solo se permiten imágenes o videos.");
      return;
    }

    if (file.type === "image/gif") {
      alert("GIF animado se agregará después.");
      return;
    }

    const mediaData = {
      file,
      previewUrl: isVideo ? URL.createObjectURL(file) : "",
      name: file.name,
      type: file.type,
      extension: getExtension(file.name),
      mediaType: isVideo ? "video" : "image",
    };

    if (isVideo) {
      onMediaUpload(mediaData);
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      onMediaUpload({
        ...mediaData,
        previewUrl: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <label className="media-uploader">
      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,video/mp4,video/webm,video/quicktime"
        onChange={handleFileChange}
      />

      <div className="media-uploader__icon">⬆</div>

      <h3>Subir archivo</h3>

      <p>JPG, PNG, WEBP, MP4, WEBM</p>
      <span>Video recomendado: menor a 60s</span>
    </label>
  );
}

export default MediaUploader;