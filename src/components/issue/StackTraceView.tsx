import { useEffect, useMemo, useState } from "react";
import { groupStackFrames, parseStack, type StackFrame } from "./parseStack";

type StackTraceViewProps = {
  stack: string;
  copied?: boolean;
  onCopy?: () => void;
};

function FrameRow({ frame }: { frame: StackFrame }) {
  return (
    <li className={`stack-frame${frame.inApp ? " is-in-app" : " is-lib"}`}>
      {frame.functionName ? <span className="stack-fn mono">{frame.functionName}</span> : null}
      {frame.location ? (
        <span className="stack-loc mono">{frame.location}</span>
      ) : (
        <span className="stack-loc mono">{frame.raw.trim()}</span>
      )}
    </li>
  );
}

export function StackTraceView({ stack, copied, onCopy }: StackTraceViewProps) {
  const parsed = useMemo(() => parseStack(stack), [stack]);
  const groups = useMemo(() => groupStackFrames(parsed.frames), [parsed.frames]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setExpanded({});
  }, [stack]);

  function toggleGroup(startIndex: number) {
    setExpanded((prev) => ({ ...prev, [startIndex]: !prev[startIndex] }));
  }

  return (
    <div className="stack-trace">
      <div className="stack-trace-head">
        <span className="stack-trace-label">Stack Trace</span>
        {onCopy ? (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onCopy}>
            {copied ? "已复制" : "复制"}
          </button>
        ) : null}
      </div>

      <div className="stack-trace-body">
        {parsed.headline ? (
          <div className="stack-headline mono">{parsed.headline}</div>
        ) : null}

        {parsed.frames.length > 0 ? (
          <ol className="stack-frames">
            {groups.map((group) => {
              if (group.kind === "frame") {
                return <FrameRow key={`${group.index}-${group.frame.raw}`} frame={group.frame} />;
              }

              const open = Boolean(expanded[group.startIndex]);
              return (
                <li key={`collapse-${group.startIndex}`} className="stack-collapse">
                  <button
                    type="button"
                    className="stack-collapse-toggle"
                    aria-expanded={open}
                    onClick={() => toggleGroup(group.startIndex)}
                  >
                    {open
                      ? `收起 ${group.frames.length} 帧第三方代码`
                      : `展开 ${group.frames.length} 帧第三方代码`}
                  </button>
                  {open ? (
                    <ol className="stack-frames stack-frames-nested">
                      {group.frames.map((frame, offset) => (
                        <FrameRow
                          key={`${group.startIndex + offset}-${frame.raw}`}
                          frame={frame}
                        />
                      ))}
                    </ol>
                  ) : null}
                </li>
              );
            })}
          </ol>
        ) : (
          <pre className="code-block code-block-tall">{stack}</pre>
        )}
      </div>
    </div>
  );
}
