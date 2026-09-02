import { useCallback, useState } from "react";
import { copyText } from "../lib/copy";

export function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);

  const onCopy = useCallback(async (label: string, text: string) => {
    const ok = await copyText(text);
    if (!ok) return;
    setCopied(label);
    window.setTimeout(() => setCopied((v) => (v === label ? null : v)), 1500);
  }, []);

  return { copied, onCopy };
}
