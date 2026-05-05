import { useState } from "react";
import "./CreatePostBox.css";

function CreatePostBox({ currentUser, onCreatePost }) {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []).slice(0, 8);
    if (!files.length) return;

    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      )
    ).then((loadedImages) => {
      setImages(loadedImages.filter(Boolean));
    });
  };

  const handleSubmit = async () => {
    const trimmedText = text.trim();

    if (!trimmedText && images.length === 0) return;

    setIsSubmitting(true);

    try {
      await onCreatePost({
        text: trimmedText,
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
