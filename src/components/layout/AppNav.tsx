import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./navItems";

export function AppNav() {
  return (
    <nav className="nav-links" aria-label="主导航">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} end={"end" in item ? item.end : false}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
