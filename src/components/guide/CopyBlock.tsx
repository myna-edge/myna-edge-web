import { useCopy } from "../../hooks/useCopy";

type CopyBlockProps = {
  title: string;
  code: string;
};

export function CopyBlock({ title, code }: CopyBlockProps) {
  const { copied, onCopy } = useCopy();

  return (
    <section className="card">
      <div className="card-head">
        <h2 className="card-title">{title}</h2>
        <button type="button" className="btn btn-ghost" onClick={() => onCopy(title, code)}>
          {copied === title ? "已复制" : "复制"}
        </button>
      </div>
      <pre className="code-block">{code}</pre>
    </section>
  );
}

