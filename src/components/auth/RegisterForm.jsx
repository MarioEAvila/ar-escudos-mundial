import { useState } from "react";
import "./RegisterForm.css";

function RegisterForm({ onSubmit, loading, error }) {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    username: "",
    profilePhoto: "",
    birthday: "",
    password: "",
    confirmPassword: "",
  });

  const [localError, setLocalError] = useState("");

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "profilePhotoFile" && files?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profilePhoto: reader.result,
        }));
      };
      reader.readAsDataURL(files[0]);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLocalError("");

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Las contrasenas no coinciden.");
      return;
    }

    onSubmit({
      name: formData.name,
      lastName: formData.lastName,
      email: formData.email,
      username: formData.username,
      profilePhoto: formData.profilePhoto,
      birthday: formData.birthday,
      password: formData.password,
    });
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <div className="register-form__grid">
        <div className="register-form__group">
          <label htmlFor="register-name">Nombre</label>
          <input
            id="register-name"
            name="name"
            type="text"
            placeholder="Tu nombre"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="register-form__group">
          <label htmlFor="register-lastName">Apellido</label>
          <input
            id="register-lastName"
            name="lastName"
            type="text"
            placeholder="Tu apellido"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="register-form__group">
        <label htmlFor="register-email">Correo electronico</label>
        <input
          id="register-email"
          name="email"
          type="email"
          placeholder="tu@correo.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="register-form__group">
        <label htmlFor="register-username">Nombre de usuario</label>
        <input
          id="register-username"
          name="username"
          type="text"
          placeholder="Ej. fan_mundial2026"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="register-form__group">
        <label htmlFor="register-profilePhotoFile">Foto de perfil</label>
        <input
          id="register-profilePhotoFile"
          name="profilePhotoFile"
          type="file"
          accept="image/*"
          onChange={handleChange}
        />
      </div>

      {formData.profilePhoto && (
        <div className="register-form__preview">
          <img src={formData.profilePhoto} alt="Vista previa del perfil" />
        </div>
      )}

      <div className="register-form__group">
        <label htmlFor="register-birthday">Cumpleanos</label>
        <input
          id="register-birthday"
          name="birthday"
          type="date"
          value={formData.birthday}
          onChange={handleChange}
          required
        />
      </div>

      <div className="register-form__grid">
        <div className="register-form__group">
          <label htmlFor="register-password">Contrasena</label>
          <input
            id="register-password"
            name="password"
            type="password"
            placeholder="Crea tu contrasena"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="register-form__group">
          <label htmlFor="register-confirmPassword">Confirmar contrasena</label>
          <input
            id="register-confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Repite tu contrasena"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {(localError || error) && (
        <p className="register-form__error">{localError || error}</p>
      )}

      <button className="register-form__submit" type="submit" disabled={loading}>
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}

export default RegisterForm;
