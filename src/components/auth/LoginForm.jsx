import { useState } from "react";
import "./LoginForm.css";

function LoginForm({ onSubmit, loading, error }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-form__group">
        <label htmlFor="login-username">Nombre de usuario</label>
        <input
          id="login-username"
          name="username"
          type="text"
          placeholder="Ej. mario2026"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="login-form__group">
        <label htmlFor="login-password">Contraseña</label>
        <input
          id="login-password"
          name="password"
          type="password"
          placeholder="Ingresa tu contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {error && <p className="login-form__error">{error}</p>}

      <button className="login-form__submit" type="submit" disabled={loading}>
        {loading ? "Entrando..." : "Entrar al portal"}
      </button>
    </form>
  );
}

export default LoginForm;