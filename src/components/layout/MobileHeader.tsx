import { Menu, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "./navItems";
import { ThemeToggle } from "./ThemeToggle";

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const panelId = useId();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className={`app-bar-mobile${open ? " is-open" : ""}`}>
      <div className="shell-inner">
        <div className="app-bar-mobile-row">
          <Link to="/" className="app-bar-brand">
            <img src="/myna.png" alt="" className="app-bar-logo" width={28} height={28} />
            <span className="app-bar-name">Myna</span>
          </Link>
          <button
            type="button"
            className="menu-btn app-bar-mobile-menu"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} strokeWidth={2} aria-hidden /> : <Menu size={20} strokeWidth={2} aria-hidden />}
          </button>
          <ThemeToggle />
        </div>
      </div>

      {open ? (
        <>
          <button
            type="button"
            className="menu-backdrop"
            aria-label="关闭菜单"
            onClick={() => setOpen(false)}
          />
          <div id={panelId} className="menu-panel" role="dialog" aria-modal="true" aria-label="导航菜单">
            <div className="shell-inner">
              <nav className="menu-nav" aria-label="主导航">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={"end" in item ? item.end : false}
                    className={({ isActive }) => `menu-link${isActive ? " is-active" : ""}`}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
