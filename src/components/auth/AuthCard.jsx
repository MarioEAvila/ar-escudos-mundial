import "./AuthCard.css";

function AuthCard({ title, subtitle, children }) {
  return (
    <div className="auth-card">
      <div className="auth-card__topline">
        <span className="auth-card__status-dot" />
        <span className="auth-card__topline-text">Acceso de usuario</span>
      </div>

      <div className="auth-card__header">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      <div className="auth-card__body">{children}</div>
    </div>
  );
}

export default AuthCard;