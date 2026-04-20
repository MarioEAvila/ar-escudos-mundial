import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import AuthCard from "../components/auth/AuthCard";
import AuthSwitch from "../components/auth/AuthSwitch";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import "./AuthPage.css";

function AuthPage() {
  const { login, register } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (data) => {
    try {
      setLoading(true);
      setMessage("");
      login(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data) => {
    try {
      setLoading(true);
      setMessage("");
      register(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-page__overlay" />

      <section className="auth-page__content">
        <div className="auth-page__intro">
          <p className="auth-page__eyebrow">WORLD CUP 2026 EXPERIENCE</p>
          <h1 className="auth-page__brand">Mundial FC</h1>
          <h2 className="auth-page__headline">
            Escanea. Desbloquea. Compite.
          </h2>

          <p className="auth-page__description">
            Vive una experiencia interactiva inspirada en el Mundial 2026.
            Accede al modo AR, desbloquea selecciones, responde trivias y guarda
            tu progreso como parte de tu recorrido dentro de Mundial FC.
          </p>

          <div className="auth-page__features">
            <div className="auth-page__feature-card">
              <span className="auth-page__feature-label">Modo principal</span>
              <strong>MODO AR</strong>
            </div>

            <div className="auth-page__feature-card">
              <span className="auth-page__feature-label">Progreso</span>
              <strong>SELECCIONES DESBLOQUEADAS</strong>
            </div>

            <div className="auth-page__feature-card">
              <span className="auth-page__feature-label">Competencia</span>
              <strong>TRIVIA MUNDIAL</strong>
            </div>
          </div>
        </div>

        <div className="auth-page__panel">
          <AuthCard
            title={isRegisterMode ? "Registro de usuario" : "Inicio de sesión"}
            subtitle={
              isRegisterMode
                ? "Crea tu cuenta para comenzar tu recorrido en Mundial FC."
                : "Entra a tu perfil y continúa tu experiencia del Mundial 2026."
            }
          >
            <AuthSwitch
              isRegisterMode={isRegisterMode}
              onSwitch={(mode) => {
                setMessage("");
                setIsRegisterMode(mode);
              }}
            />

            <div
              className={`auth-page__form-wrapper ${
                isRegisterMode ? "register-active" : "login-active"
              }`}
            >
              <div className="auth-page__form-track">
                <div className="auth-page__form-panel">
                  <LoginForm
                    onSubmit={handleLogin}
                    loading={loading}
                    error={!isRegisterMode ? message : ""}
                  />
                </div>

                <div className="auth-page__form-panel">
                  <RegisterForm
                    onSubmit={handleRegister}
                    loading={loading}
                    error={isRegisterMode ? message : ""}
                  />
                </div>
              </div>
            </div>
          </AuthCard>
        </div>
      </section>
    </main>
  );
}

export default AuthPage;