function SectionCard({ title, children, action = null }) {
  return (
    <section className="content-panel">
      <div className="content-panel__header">
        <h3>{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

export default SectionCard;
