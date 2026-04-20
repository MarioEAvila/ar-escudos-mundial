import "./SelectionStrip.css";

function SelectionStrip({ selections }) {
  return (
    <div className="selection-strip">
      {selections.map((selection) => (
        <div
          key={selection.id}
          className="selection-strip__item"
          style={{ "--selection-accent": selection.color }}
        >
          <div className="selection-strip__flag">{selection.flag}</div>
          <div>
            <strong>{selection.name}</strong>
            <p>{selection.rank}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SelectionStrip;