"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/site/shared/ui/pagination/pagination";

type AdminPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** @default false */
  showWhenSinglePage?: boolean;
};

function buildPageItems(currentPage: number, lastPage: number) {
  // Compact pagination: always show first + last + current±1
  const pages = new Set<number>([
    1,
    lastPage,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);
  return [...pages].filter((p) => p >= 1 && p <= lastPage).sort((a, b) => a - b);
}

export function AdminPagination({
  page,
  totalPages,
  onPageChange,
  showWhenSinglePage = false,
}: AdminPaginationProps) {
  if (totalPages <= 1 && !showWhenSinglePage) return null;

  const safeTotalPages = Math.max(1, totalPages);

  const items = buildPageItems(page, safeTotalPages);
  const middle = items.filter((p) => p !== 1 && p !== safeTotalPages);
  const hasLeftGap = middle.length > 0 && middle[0] > 2;
  const hasRightGap =
    middle.length > 0 && middle[middle.length - 1] < safeTotalPages - 1;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink isActive={page === 1} onClick={() => onPageChange(1)}>
            1
          </PaginationLink>
        </PaginationItem>

        {hasLeftGap ? (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        ) : null}

        {middle.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink isActive={p === page} onClick={() => onPageChange(p)}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {safeTotalPages > 1 ? (
          <>
            {hasRightGap ? (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            ) : null}
            <PaginationItem>
              <PaginationLink
                isActive={page === safeTotalPages}
                onClick={() => onPageChange(safeTotalPages)}
              >
                {safeTotalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        ) : null}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(safeTotalPages, page + 1))}
            disabled={page >= safeTotalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

