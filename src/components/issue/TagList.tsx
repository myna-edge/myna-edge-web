import { truncate } from "../../api";
import type { Tag } from "./issueMeta";

export function TagList({ tags }: { tags: Tag[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="tag-list">
      {tags.map((tag) => (
        <span key={`${tag.key}-${tag.value}`} className="tag">
          <span className="tag-key">{tag.key}</span>
          <span className="tag-value">{truncate(tag.value, 48)}</span>
        </span>
      ))}
    </div>
  );
}
