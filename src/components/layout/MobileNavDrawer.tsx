import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useMobileNav } from "./MobileNavContext";
import { NAV_ITEMS } from "./navItems";

/** Fixed overlay drawer — must render outside `.app-bar` (backdrop-filter traps fixed). */
export function MobileNavDrawer() {
  const { open, panelId, closeNav } = useMobileNav();

  if (!open) return null;

  return (
    <div className="mobile-nav-layer" role="presentation">
      <button type="button" className="menu-backdrop" aria-label="关闭菜单" onClick={closeNav} />
      <div
        id={panelId}
        className="menu-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="导航菜单"
      >
        <div className="menu-drawer-head">
          <span className="menu-drawer-title">菜单</span>
          <button type="button" className="menu-btn" aria-label="关闭菜单" onClick={closeNav}>
            <X size={20} strokeWidth={2} aria-hidden />
          </button>
        </div>
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
  );
}
