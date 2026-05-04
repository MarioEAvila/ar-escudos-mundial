import "./FilterPanel.css";

const filters = [
  {
    id: "original",
    name: "Original",
    values: {
      brightness: 100,
      contrast: 100,
      saturate: 100,
      sepia: 0,
      grayscale: 0,
      blur: 0,
      hue: 0,
    },
  },
  {
    id: "vibrante",
    name: "Vibrante",
    values: {
      brightness: 108,
      contrast: 115,
      saturate: 145,
      sepia: 0,
      grayscale: 0,
      blur: 0,
      hue: 0,
    },
  },
  {
    id: "dramatico",
    name: "Dramático",
    values: {
      brightness: 90,
      contrast: 138,
      saturate: 115,
      sepia: 8,
      grayscale: 0,
      blur: 0,
      hue: 0,
    },
  },
  {
    id: "calido",
    name: "Cálido",
    values: {
      brightness: 106,
      contrast: 108,
      saturate: 125,
      sepia: 28,
      grayscale: 0,
      blur: 0,
      hue: -8,
    },
  },
  {
    id: "frio",
    name: "Frío",
    values: {
      brightness: 103,
      contrast: 110,
      saturate: 115,
      sepia: 0,
      grayscale: 0,
      blur: 0,
      hue: 185,
    },
  },
  {
    id: "bn",
    name: "Blanco y Negro",
    values: {
      brightness: 100,
      contrast: 120,
      saturate: 90,
      sepia: 0,
      grayscale: 100,
      blur: 0,
      hue: 0,
    },
  },
  {
    id: "cine",
    name: "Cine",
    values: {
      brightness: 92,
      contrast: 128,
      saturate: 85,
      sepia: 10,
      grayscale: 0,
      blur: 0,
      hue: -5,
    },
  },
  {
    id: "retro",
    name: "Retro",
    values: {
      brightness: 105,
      contrast: 110,
      saturate: 95,
      sepia: 45,
      grayscale: 0,
      blur: 0,
      hue: -12,
    },
  },
  {
    id: "verde-fc",
    name: "Verde FC",
    values: {
      brightness: 105,
      contrast: 116,
      saturate: 145,
      sepia: 0,
      grayscale: 0,
      blur: 0,
      hue: 55,
    },
  },
  {
    id: "estadio",
    name: "Estadio",
    values: {
      brightness: 112,
      contrast: 120,
      saturate: 135,
      sepia: 5,
      grayscale: 0,
      blur: 0,
      hue: 8,
    },
  },
  {
    id: "nocturno",
    name: "Nocturno",
    values: {
      brightness: 82,
      contrast: 135,
      saturate: 105,
      sepia: 0,
      grayscale: 0,
      blur: 0,
      hue: 210,
    },
  },
  {
    id: "campeon",
    name: "Campeón",
    values: {
      brightness: 112,
      contrast: 125,
      saturate: 130,
      sepia: 20,
      grayscale: 0,
      blur: 0,
      hue: 0,
    },
  },
];

function FilterPanel({
  selectedFilter,
  onSelectFilter,
  adjustments,
  onAdjustmentChange,
  onReset,
}) {
  const buildPreviewFilter = (values) => {
    return `
      brightness(${values.brightness}%)
      contrast(${values.contrast}%)
      saturate(${values.saturate}%)
      sepia(${values.sepia}%)
      grayscale(${values.grayscale}%)
      blur(${values.blur}px)
      hue-rotate(${values.hue}deg)
    `;
  };

  return (
    <aside className="filter-panel">
      <div className="filter-panel__header">
        <h2>Filtros</h2>
        <p>Elige un estilo y ajusta la intensidad visual.</p>
      </div>

      <div className="filter-panel__grid">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`filter-panel__item ${
              selectedFilter.id === filter.id ? "active" : ""
            }`}
            onClick={() => onSelectFilter(filter)}
          >
            <div
              className="filter-panel__preview"
              style={{ filter: buildPreviewFilter(filter.values) }}
            />
            <span>{filter.name}</span>
          </button>
        ))}
      </div>

      <div className="filter-panel__adjustments">
        <div className="filter-panel__adjustments-header">
          <h3>Ajustes</h3>
          <button type="button" onClick={onReset}>
            Restablecer
          </button>
        </div>

        <div className="filter-panel__control">
          <div>
            <span>Brillo</span>
            <strong>{adjustments.brightness}%</strong>
          </div>
          <input
            type="range"
            min="50"
            max="150"
            value={adjustments.brightness}
            onChange={(e) =>
              onAdjustmentChange("brightness", Number(e.target.value))
            }
          />
        </div>

        <div className="filter-panel__control">
          <div>
            <span>Contraste</span>
            <strong>{adjustments.contrast}%</strong>
          </div>
          <input
            type="range"
            min="50"
            max="180"
            value={adjustments.contrast}
            onChange={(e) =>
              onAdjustmentChange("contrast", Number(e.target.value))
            }
          />
        </div>

        <div className="filter-panel__control">
          <div>
            <span>Saturación</span>
            <strong>{adjustments.saturate}%</strong>
          </div>
          <input
            type="range"
            min="0"
            max="220"
            value={adjustments.saturate}
            onChange={(e) =>
              onAdjustmentChange("saturate", Number(e.target.value))
            }
          />
        </div>

        <div className="filter-panel__control">
          <div>
            <span>Sepia</span>
            <strong>{adjustments.sepia}%</strong>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={adjustments.sepia}
            onChange={(e) =>
              onAdjustmentChange("sepia", Number(e.target.value))
            }
          />
        </div>

        <div className="filter-panel__control">
          <div>
            <span>Blanco y negro</span>
            <strong>{adjustments.grayscale}%</strong>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={adjustments.grayscale}
            onChange={(e) =>
              onAdjustmentChange("grayscale", Number(e.target.value))
            }
          />
        </div>

        <div className="filter-panel__control">
          <div>
            <span>Desenfoque</span>
            <strong>{adjustments.blur}px</strong>
          </div>
          <input
            type="range"
            min="0"
            max="8"
            value={adjustments.blur}
            onChange={(e) =>
              onAdjustmentChange("blur", Number(e.target.value))
            }
          />
        </div>

        <div className="filter-panel__control">
          <div>
            <span>Tono</span>
            <strong>{adjustments.hue}°</strong>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={adjustments.hue}
            onChange={(e) => onAdjustmentChange("hue", Number(e.target.value))}
          />
        </div>
      </div>
    </aside>
  );
}

export default FilterPanel;
