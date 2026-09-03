import { useEffect, useState, type TransitionEvent } from "react";
import { NavLink } from "react-router-dom";
import { useMobileNav } from "./MobileNavContext";
import { NAV_ITEMS } from "./navItems";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Menu panel sits under the real mobile app bar.
 * Open/close uses the same header button (position overlap is exact).
 */
export function MobileNavDrawer() {
  const { open, panelId } = useMobileNav();
  const [mounted, setMounted] = useState(open);
  const [entered, setEntered] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setEntered(true));
      });
      return () => window.cancelAnimationFrame(id);
    }
    setEntered(false);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  function onBodyTransitionEnd(e: TransitionEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== "opacity" && e.propertyName !== "transform") return;
    if (!open) setMounted(false);
  }

  if (!mounted) return null;

  return (
    <div className={`mobile-nav-layer${entered ? " is-open" : ""}`} role="presentation">
      <div
        id={panelId}
        className="menu-screen-body"
        role="dialog"
        aria-modal="true"
        aria-label="导航菜单"
        onTransitionEnd={onBodyTransitionEnd}
      >
        <div className="shell-inner menu-screen-inner">
          <nav className="menu-screen-nav" aria-label="主导航">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={"end" in item ? item.end : false}
                className={({ isActive }) => `menu-screen-link${isActive ? " is-active" : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="menu-screen-theme">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
