import { useId, useMemo } from "react";
import { Check, Copy } from "lucide-react";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import javascript from "highlight.js/lib/languages/javascript";
import xml from "highlight.js/lib/languages/xml";
import { useCopy } from "../../hooks/useCopy";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("bash", bash);

export type CodeLanguage = "javascript" | "html" | "bash";

type CodeBlockProps = {
  code: string;
  language?: CodeLanguage;
  className?: string;
  /** Show an IDE-style copy control on the code surface. */
  copyable?: boolean;
};

export function CodeBlock({
  code,
  language,
  className = "",
  copyable = false,
}: CodeBlockProps) {
  const copyKey = useId();
  const { copied, onCopy } = useCopy();
  const isCopied = copied === copyKey;

  const highlighted = useMemo(() => {
    if (!language) return null;
    try {
      return hljs.highlight(code, { language }).value;
    } catch {
      return null;
    }
  }, [code, language]);

  const classes = ["code-block", language ? "code-block--hljs" : "", className]
    .filter(Boolean)
    .join(" ");

  const pre = highlighted ? (
    <pre className={classes}>
      <code
        className={`hljs language-${language}`}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </pre>
  ) : (
    <pre className={classes}>{code}</pre>
  );

  if (!copyable) return pre;

  return (
    <div className="code-block-wrap">
      <button
        type="button"
        className={`code-block-copy${isCopied ? " is-copied" : ""}`}
        aria-label={isCopied ? "已复制" : "复制代码"}
        onClick={() => onCopy(copyKey, code)}
      >
        {isCopied ? (
          <Check size={14} strokeWidth={2} aria-hidden />
        ) : (
          <Copy size={14} strokeWidth={2} aria-hidden />
        )}
        <span>{isCopied ? "已复制" : "复制"}</span>
      </button>
      {pre}
    </div>
  );
}
