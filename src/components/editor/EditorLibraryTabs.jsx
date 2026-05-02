import "./EditorLibraryTabs.css";

function EditorLibraryTabs({ activeTab, onChangeTab }) {
  return (
    <div className="editor-library-tabs">
      <button
        className={activeTab === "gallery" ? "active" : ""}
        onClick={() => onChangeTab("gallery")}
      >
        Galería Mundial FC
      </button>

      <button
        className={activeTab === "recent" ? "active" : ""}
        onClick={() => onChangeTab("recent")}
      >
        Creaciones recientes
      </button>
    </div>
  );
}

export default EditorLibraryTabs;