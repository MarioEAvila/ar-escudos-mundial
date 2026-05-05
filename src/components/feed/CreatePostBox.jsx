import { useState } from "react";
import "./CreatePostBox.css";

function readFileAsDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result || "");
    reader.readAsDataURL(file);
  });
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

async function compressImage(file) {
  const source = await readFileAsDataUrl(file);
  if (!source) return "";

  const image = await loadImage(source);
  const maxSize = 1600;
  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) return source;

  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

function CreatePostBox({ currentUser, onCreatePost }) {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const loadedImages = await Promise.all(files.slice(0, 8).map(compressImage));

    setImages((currentImages) => {
      const mergedImages = [...currentImages, ...loadedImages.filter(Boolean)];
      return mergedImages.slice(0, 8);
    });

    event.target.value = "";
  };

  const handleSubmit = async () => {
    const trimmedText = text.trim();

    if (!trimmedText && images.length === 0) return;

    setIsSubmitting(true);

    try {
      await onCreatePost({
        text: trimmedText,
        image: images[0] || "",
        images,
      });
      setText("");
      setImages([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-box">
      <div className="create-post-box__top">
        <div className="create-post-box__avatar">
          {currentUser?.profilePhoto ? (
            <img src={currentUser.profilePhoto} alt="Perfil" />
          ) : (
            <span>
              {currentUser?.name?.[0]}
              {currentUser?.lastName?.[0]}
            </span>
          )}
        </div>

        <textarea
          placeholder={`¿Que esta pasando, ${currentUser?.username}?`}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </div>

      {images.length > 0 && (
        <div className="create-post-box__preview">
          {images.map((image, index) => (
            <img key={`${index}-${image.slice(0, 20)}`} src={image} alt={`Vista previa ${index + 1}`} />
          ))}
        </div>
      )}

      <div className="create-post-box__actions">
        <label className="create-post-box__file-button">
          Imagenes
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </label>

        <button
          className="create-post-box__publish"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publicando..." : "Publicar"}
        </button>
      </div>
    </div>
  );
}

export default CreatePostBox;
