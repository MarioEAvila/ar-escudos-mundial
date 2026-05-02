import { useState } from "react";
import "./MediaEditorPage.css";
import HomeSidebar from "../components/layout/HomeSidebar";
import HomeTopbar from "../components/home/HomeTopbar";
import MediaUploader from "../components/editor/MediaUploader";
import EditorPreview from "../components/editor/EditorPreview";
import FilterPanel from "../components/editor/FilterPanel";
import EditorLibraryTabs from "../components/editor/EditorLibraryTabs";
import GalleryPanel from "../components/editor/GalleryPanel";
import RecentCreationsPanel from "../components/editor/RecentCreationsPanel";
import { useMediaEditor } from "../hooks/useMediaEditor";

function MediaEditorPage({
  currentUser,
  onOpenAR,
  onGoHome,
  onOpenProfile,
  onOpenEditor,
  onOpenMinigame,
}) {
  const [activeLibraryTab, setActiveLibraryTab] = useState("gallery");

  const editor = useMediaEditor();

  const renderLibraryContent = () => {
    if (activeLibraryTab === "gallery") {
      return <GalleryPanel onSelectItem={editor.handleSelectGalleryItem} />;
    }

    if (activeLibraryTab === "recent") {
      return (
        <RecentCreationsPanel
          items={editor.recentCreations}
          onSelectItem={editor.handleSelectRecentCreation}
          onDeleteItem={editor.deleteRecentCreation}
        />
      );
    }

    return null;
  };

  return (
    <main className="media-editor-page">
      <div className="media-editor-page__grid">
        <div className="media-editor-page__left">
          <HomeSidebar
            user={currentUser}
            onOpenAR={onOpenAR}
            onGoHome={onGoHome}
            onOpenProfile={onOpenProfile}
            onOpenEditor={onOpenEditor}
            onOpenMinigame={onOpenMinigame}
            activeSection="editor"
          />
        </div>

        <section className="media-editor-page__center">
          <HomeTopbar
            onGoHome={onGoHome}
            onOpenProfile={onOpenProfile}
            onOpenEditor={onOpenEditor}
          />

          <header className="media-editor-hero">
            <div>
              <p>Herramienta creativa</p>

              <h1>Editor Multimedia</h1>

              <span>
                Sube archivos propios, usa la galería Mundial FC o reutiliza tus
                creaciones recientes.
              </span>
            </div>
          </header>

          <div className="media-editor-workspace">
            <MediaUploader onMediaUpload={editor.handleMediaUpload} />

            <EditorPreview
              media={editor.media}
              filterStyle={editor.filterStyle}
              rotation={editor.rotation}
              flipX={editor.flipX}
              flipY={editor.flipY}
              vignette={editor.vignette}
              textOverlay={editor.textOverlay}
              stickerOverlay={editor.stickerOverlay}
              onDownload={editor.handleDownload}
              onRotate={() => editor.setRotation((prev) => (prev + 90) % 360)}
              onFlipX={() => editor.setFlipX((prev) => !prev)}
              onFlipY={() => editor.setFlipY((prev) => !prev)}
              onToggleVignette={() => editor.setVignette((prev) => !prev)}
              onAddText={editor.handleAddText}
              onSelectSticker={editor.setStickerOverlay}
            />
          </div>

          <section className="media-editor-library-section">
            <EditorLibraryTabs
              activeTab={activeLibraryTab}
              onChangeTab={setActiveLibraryTab}
            />

            {renderLibraryContent()}
          </section>

          {editor.isExporting && (
            <div className="media-editor-exporting">
              Exportando video con FFmpeg... {editor.exportProgress}%
            </div>
          )}
        </section>

        <aside className="media-editor-page__right">
          <FilterPanel
            selectedFilter={editor.selectedFilter}
            onSelectFilter={editor.handleSelectFilter}
            adjustments={editor.adjustments}
            onAdjustmentChange={editor.handleAdjustmentChange}
            onReset={editor.handleReset}
          />

          <section className="media-editor-info">
            <h2>Estado del editor</h2>

            <div>
              <strong>Archivo activo</strong>
              <p>{editor.media?.title || editor.media?.name || "Ninguno"}</p>
            </div>

            <div>
              <strong>Origen</strong>
              <p>
                {editor.media?.sourceType === "gallery"
                  ? "Galería Mundial FC"
                  : editor.media?.sourceType === "recent"
                  ? "Creación reciente"
                  : editor.media?.sourceType === "upload"
                  ? "Archivo subido"
                  : "Sin archivo"}
              </p>
            </div>

            <div>
              <strong>Exportación</strong>
              <p>
                Imágenes mantienen su formato. Videos se exportan como MP4 con
                filtros, rotación, volteo y viñeta.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

export default MediaEditorPage;