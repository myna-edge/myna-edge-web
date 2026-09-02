import { Link, Outlet, useLocation } from "react-router-dom";
import { AppNav } from "./AppNav";
import { MobileHeader } from "./MobileHeader";
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
    <div className={`shell${isIssueDetail ? " shell--issue" : ""}`}>
      <header className="app-bar">
        <div className="shell-inner">
          <div className="app-bar-desktop">
            <div className="app-bar-side app-bar-side-start">
              <BrandLink />
            </div>
            <div className="app-bar-center">
              <AppNav />
            </div>
            <div className="app-bar-side app-bar-side-end">
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
    </div>
  );
}
