export type StackFrame = {
  raw: string;
  functionName: string | null;
  location: string | null;
  inApp: boolean;
};

export type ParsedStack = {
  headline: string;
  frames: StackFrame[];
};

export type StackGroup =
  | { kind: "frame"; frame: StackFrame; index: number }
  | { kind: "collapsed"; frames: StackFrame[]; startIndex: number };

/** Mark app frames vs library frames (node_modules / anonymous). */
export function isInApp(path: string): boolean {
  const lower = path.toLowerCase();
  if (lower.includes("node_modules")) return false;
  if (lower.includes("<anonymous>")) return false;
  return true;
}

function pushFrame(frames: StackFrame[], raw: string, functionName: string | null, file: string) {
  frames.push({
    raw,
    functionName,
    location: file,
    inApp: isInApp(file),
  });
}

export function parseStack(stack: string): ParsedStack {
  const lines = stack.split("\n");
  const headline = lines[0]?.trim() ?? "";
  const frames: StackFrame[] = [];

  for (let i = 1; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();
    if (!trimmed) continue;

    if (!trimmed.startsWith("at ")) {
      frames.push({
        raw,
        functionName: null,
        location: trimmed,
        inApp: isInApp(trimmed),
      });
      continue;
    }

    const body = trimmed.slice(3).replace(/^async\s+/, "");

    const fnParen = body.match(/^(.+?)\s+\((.+?):(\d+):(\d+)\)$/);
    if (fnParen) {
      pushFrame(frames, raw, fnParen[1], `${fnParen[2]}:${fnParen[3]}:${fnParen[4]}`);
      continue;
    }

    const locOnly = body.match(/^(.+?):(\d+):(\d+)$/);
    if (locOnly) {
      pushFrame(frames, raw, null, `${locOnly[1]}:${locOnly[2]}:${locOnly[3]}`);
      continue;
    }

    frames.push({
      raw,
      functionName: body,
      location: null,
      inApp: true,
    });
  }

  return { headline, frames };
}

/** Collapse consecutive library frames into groups (Sentry-style). */
export function groupStackFrames(frames: StackFrame[]): StackGroup[] {
  const groups: StackGroup[] = [];
  let i = 0;
  while (i < frames.length) {
    const frame = frames[i];
    if (frame.inApp) {
      groups.push({ kind: "frame", frame, index: i });
      i += 1;
      continue;
    }
    const start = i;
    const batch: StackFrame[] = [];
    while (i < frames.length && !frames[i].inApp) {
      batch.push(frames[i]);
      i += 1;
    }
    if (batch.length === 1) {
      groups.push({ kind: "frame", frame: batch[0], index: start });
    } else {
      groups.push({ kind: "collapsed", frames: batch, startIndex: start });
    }
  }
  return groups;
}
