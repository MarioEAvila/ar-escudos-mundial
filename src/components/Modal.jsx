import "./modal.css";

function Modal({ title, text, close }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{title}</h2>
        <p>{text}</p>
        <button onClick={close}>Cerrar</button>
      </div>
    </div>
  );
}

export default Modal;