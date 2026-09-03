import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useMobileNav } from "./MobileNavContext";

export function MobileHeader() {
  const { open, panelId, toggleNav } = useMobileNav();

  return (
    <div className="app-bar-mobile">
      <div className="shell-inner">
        <div className="app-bar-mobile-row">
          <Link to="/" className="app-bar-brand">
            <img src="/myna.png" alt="" className="app-bar-logo" width={28} height={28} />
            <span className="app-bar-name">Myna</span>
          </Link>
          <button
            type="button"
            className="menu-btn"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={toggleNav}
          >
            {open ? <X size={20} strokeWidth={2} aria-hidden /> : <Menu size={20} strokeWidth={2} aria-hidden />}
          </button>
        </div>
      </div>
    </div>
  );
}
