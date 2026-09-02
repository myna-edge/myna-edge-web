import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const SHOW_AFTER = 320;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SHOW_AFTER);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!mounted || !visible) return null;

  return createPortal(
    <button
      type="button"
      className="scroll-top"
      aria-label="回到顶部"
      title="回到顶部"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUp size={18} strokeWidth={2} aria-hidden />
    </button>,
    document.body,
  );
}
