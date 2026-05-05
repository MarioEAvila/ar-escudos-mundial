import HomeSidebar from "./HomeSidebar";
import HomeTopbar from "../home/HomeTopbar";
import "./AppShell.css";

function AppShell({
  user,
  activeSection,
  onOpenAR,
  rightContent = null,
  children,
}) {
  const hasRightContent = Boolean(rightContent);

  return (
    <main className="app-shell">
      <div
        className={`app-shell__grid ${
          hasRightContent ? "app-shell__grid--with-right" : "app-shell__grid--no-right"
        }`}
      >
        <div className="app-shell__left">
          <HomeSidebar
            user={user}
            onOpenAR={onOpenAR}
            activeSection={activeSection}
          />
        </div>

        <section className="app-shell__center">
          <HomeTopbar />
          {children}
        </section>

        {hasRightContent && <aside className="app-shell__right">{rightContent}</aside>}
      </div>
    </main>
  );
}

export default AppShell;
