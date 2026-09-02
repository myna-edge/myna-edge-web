import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export function PageIntro({ title, desc }: { title: string; desc: string }) {
  return (
    <header className="page-intro">
      <h1 className="page-intro-title">{title}</h1>
      <p className="page-intro-desc muted">{desc}</p>
    </header>
  );
}

export function IssueBreadcrumb({ id }: { id: number }) {
  return (
    <nav className="issue-crumb" aria-label="面包屑">
      <Link to="/issues">问题</Link>
      <ChevronRight size={14} aria-hidden />
      <span aria-current="page">#{id}</span>
    </nav>
  );
}
