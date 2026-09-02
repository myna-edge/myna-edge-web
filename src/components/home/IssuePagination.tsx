type Props = {
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function IssuePagination({ total, page, totalPages, onPageChange }: Props) {
  if (total <= 0) return null;

  return (
    <nav className="pagination" aria-label="分页">
      <span className="page-info muted">
        {total} 条 · 第 {page}/{totalPages} 页
      </span>
      <div className="pagination-actions">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          上一页
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          下一页
        </button>
      </div>
    </nav>
  );
}
