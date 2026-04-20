import "./ARHeroCard.css";

function ARHeroCard({ onOpenAR }) {
  return (
    <section className="ar-hero-card">
      <div className="ar-hero-card__content">
        <p className="ar-hero-card__eyebrow">Experiencia principal</p>
        <h2>MODO AR</h2>
        <p>
          Escanea escudos, detecta selecciones y desbloquea contenido especial
          dentro de Mundial FC.
        </p>
        <button onClick={onOpenAR}>Entrar al modo AR</button>
      </div>
    </section>
  );
}

export default ARHeroCard;