import { useState } from "react";
import "./LoginForm.css";

function LoginForm({ onSubmit, loading, error }) {
  const [formData, setFormData] = useState({
    email: "",
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
        <label htmlFor="login-email">Correo electronico</label>
        <input
          id="login-email"
          name="email"
          type="email"
          placeholder="Ej. mario@correo.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="login-form__group">
        <label htmlFor="login-password">Contrasena</label>
        <input
          id="login-password"
          name="password"
          type="password"
          placeholder="Ingresa tu contrasena"
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
