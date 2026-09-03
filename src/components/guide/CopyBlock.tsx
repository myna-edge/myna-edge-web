import type { ReactNode } from "react";
import { CodeBlock, type CodeLanguage } from "../ui/CodeBlock";

type CopyBlockProps = {
  title: string;
  code: string;
  language?: CodeLanguage;
  note?: ReactNode;
};

export function CopyBlock({ title, code, language, note }: CopyBlockProps) {
  return (
    <section className="card">
      <h2 className="card-title">{title}</h2>
      <CodeBlock code={code} language={language} copyable />
      {note ? <p className="card-note muted">{note}</p> : null}
    </section>
  );
}
