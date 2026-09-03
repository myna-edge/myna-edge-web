import { Link, Outlet, useLocation } from "react-router-dom";
import { AppNav } from "./AppNav";
import { MobileHeader } from "./MobileHeader";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { MobileNavProvider } from "./MobileNavContext";
import { ScrollToTop } from "./ScrollToTop";
import { ThemeToggle } from "./ThemeToggle";

function BrandLink() {
  return (
    <Link to="/" className="app-bar-brand">
      <img src="/myna.png" alt="" className="app-bar-logo" width={28} height={28} />
      <span className="app-bar-name">Myna</span>
    </Link>
  );
}

export function AppShell() {
  const { pathname } = useLocation();
  const isIssueDetail = /^\/issues\/\d+/.test(pathname);

  return (
    <MobileNavProvider>
      <div className={`shell${isIssueDetail ? " shell--issue" : ""}`}>
        <header className="app-bar">
          <div className="shell-inner">
            <div className="app-bar-desktop">
              <div className="app-bar-start">
                <BrandLink />
                <AppNav />
              </div>
              <div className="app-bar-end">
                <ThemeToggle />
              </div>
            </div>
          </div>
          <MobileHeader />
        </header>
        <main className={`shell-main${isIssueDetail ? " shell-main--issue" : ""}`}>
          <Outlet />
        </main>
        <ScrollToTop />
        <MobileNavDrawer />
      </div>
    </MobileNavProvider>
  );
}
