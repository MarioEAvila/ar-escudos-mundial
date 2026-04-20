export default function ManualModal({ content, onClose }) {
  return (
    <>
      <h2 className="modal-title">{content.title}</h2>

      <div className="manual">
        <ol>
          {content.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>

        <div className="manual-notes">
          {content.notes.map((n, i) => (
            <p key={i}>{n}</p>
          ))}
        </div>
      </div>

      <button className="modal-close" onClick={onClose}>
        Cerrar
      </button>
    </>
  );
}