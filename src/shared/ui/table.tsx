import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/shared/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full table-fixed caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

interface TablePaginationProps {
  /** Общее количество записей */
  totalCount: number;
  /** Текущая страница (1-based) */
  page: number;
  /** Количество записей на странице */
  pageSize: number;
  /** Обработчик смены страницы: (newPage: number) => void */
  onPageChange?: (page: number) => void;
  className?: string;
}

/** Формирует массив элементов пагинации: номера страниц и "..." */
function getPaginationItems(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const items: (number | "ellipsis")[] = [];
  const showLeft = page > 3;
  const showRight = page < totalPages - 2;

  items.push(1);
  if (showLeft) {
    items.push("ellipsis");
  }
  const start = showLeft ? Math.max(2, page - 1) : 2;
  const end = showRight ? Math.min(totalPages - 1, page + 1) : totalPages - 1;
  for (let i = start; i <= end; i++) {
    if (i !== 1 && i !== totalPages) {
      items.push(i);
    }
  }
  if (showRight) {
    items.push("ellipsis");
  }
  if (totalPages > 1) {
    items.push(totalPages);
  }
  return items;
}

function TablePagination({
  totalCount,
  page,
  pageSize,
  onPageChange,
  className,
}: TablePaginationProps) {
  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;
  const paginationItems = getPaginationItems(page, totalPages);

  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-products-border px-6 py-4",
        className
      )}
    >
      <span className="font-roboto text-lg font-normal text-[#333333]">
        Показано {from}-{to} из {totalCount}
      </span>
      {onPageChange && totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={!canPrev}
            aria-label="Предыдущая страница"
            className="flex h-8 w-8 items-center justify-center text-products-pagination-muted transition-colors hover:text-gray-500 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          {paginationItems.map((item, index) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="flex h-8 w-8 items-center justify-center font-cairo text-sm text-products-pagination-muted"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                aria-label={`Страница ${item}`}
                aria-current={page === item ? "page" : undefined}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md font-cairo text-sm transition-colors",
                  page === item
                    ? "bg-primary font-medium text-white"
                    : "text-products-pagination-muted hover:bg-gray-100"
                )}
              >
                {item}
              </button>
            )
          )}
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={!canNext}
            aria-label="Следующая страница"
            className="flex h-8 w-8 items-center justify-center text-products-pagination-muted transition-colors hover:text-gray-500 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export {
  Table, TableBody, TableCaption, TableCell, TableFooter,
  TableHead, TableHeader, TablePagination, TableRow
}

