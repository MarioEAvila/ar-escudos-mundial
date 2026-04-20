import "./AuthSwitch.css";

function AuthSwitch({ isRegisterMode, onSwitch }) {
  return (
    <div className="auth-switch">
      <button
        type="button"
        className={`auth-switch__button ${!isRegisterMode ? "active" : ""}`}
        onClick={() => onSwitch(false)}
      >
        Iniciar sesión
      </button>

      <button
        type="button"
        className={`auth-switch__button ${isRegisterMode ? "active" : ""}`}
        onClick={() => onSwitch(true)}
      >
        Registrarse
      </button>
    </div>
  );
}

export default AuthSwitch;