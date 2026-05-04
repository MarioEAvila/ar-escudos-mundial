import { useState } from "react";
import "./CreatePostBox.css";

function CreatePostBox({ currentUser, onCreatePost }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const trimmedText = text.trim();

    if (!trimmedText && !image) return;

    onCreatePost({
      text: trimmedText,
      image,
    });

    setText("");
    setImage("");
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
          placeholder={`¿Qué está pasando, ${currentUser?.username}?`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {image && (
        <div className="create-post-box__preview">
          <img src={image} alt="Vista previa" />
        </div>
      )}

      <div className="create-post-box__actions">
        <label className="create-post-box__file-button">
          Imagen
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        <button className="create-post-box__publish" onClick={handleSubmit}>
          Publicar
        </button>
      </div>
    </div>
  );
}

export default CreatePostBox;
