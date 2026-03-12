import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { SortDirection, SortKey } from "@/modules/products/types";
import type { DummyJsonProduct } from "@/shared/api/products";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TablePagination,
} from "@/shared/ui/table";
import { Checkbox } from "@/shared/ui/checkbox";
import { ProductRow } from "./ProductRow";

interface SortableHeaderProps {
  label: string;
  sortKey: SortKey;
  activeSortKey: SortKey | null;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
}

function SortableHeader({
  label,
  sortKey,
  activeSortKey,
  sortDirection,
  onSort,
}: SortableHeaderProps) {
  const isActive = activeSortKey === sortKey;
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-1 font-cairo text-base font-bold text-products-col-header transition-colors hover:text-gray-500"
    >
      {label}
      {isActive &&
        (sortDirection === "asc" ? (
          <ArrowUp size={12} />
        ) : (
          <ArrowDown size={12} />
        ))}
    </button>
  );
}

interface ProductsTableProps {
  products: DummyJsonProduct[];
  sortKey: SortKey | null;
  sortDirection: SortDirection;
  onSortChange: (key: SortKey) => void;
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
}

export const ProductsTable = ({
  products,
  sortKey,
  sortDirection,
  onSortChange,
  totalCount,
  page,
  pageSize,
  onPageChange,
}: ProductsTableProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    setSelectedIds(new Set());
  }, [page]);

  const handleToggleSelectAllOnPage = () => {
    setSelectedIds((prev) => {
      const idsOnPage = products.map((product) => product.id);
      const allSelected =
        idsOnPage.length > 0 && idsOnPage.every((id) => prev.has(id));

      const next = new Set(prev);
      if (allSelected) {
        idsOnPage.forEach((id) => next.delete(id));
      } else {
        idsOnPage.forEach((id) => next.add(id));
      }

      return next;
    });
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!products?.length) {
    return (
      <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Нет товаров для отображения.
      </div>
    );
  }

  const pageIds = products.map((product) => product.id);
  const allOnPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));

  return (
    <div className="overflow-hidden rounded-lg border border-products-border">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-products-border hover:bg-transparent">
            <TableHead className="w-[40px] py-3 pl-4 pr-2">
              <Checkbox
                checked={allOnPageSelected}
                onChange={() => handleToggleSelectAllOnPage()}
                aria-label="Выбрать все товары на странице"
                withIcon={false}
              />
            </TableHead>
            <TableHead style={{ width: 68 }} className="px-2 py-3" />
            <TableHead className="w-[220px] py-3 pl-2 pr-6">
              <span className="font-cairo text-base font-bold text-products-col-header">
                Наименование
              </span>
            </TableHead>
            <TableHead className="w-[150px] px-4 py-3 text-center">
              <span className="font-cairo text-base font-bold text-products-col-header">
                Вендор
              </span>
            </TableHead>
            <TableHead className="w-[150px] px-4 py-3 text-center">
              <span className="font-cairo text-base font-bold text-products-col-header">
                Артикул
              </span>
            </TableHead>
            <TableHead className="w-[150px] px-4 py-3 text-center">
              <div className="flex justify-center">
                <SortableHeader
                  label="Оценка"
                  sortKey="rating"
                  activeSortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={onSortChange}
                />
              </div>
            </TableHead>
            <TableHead className="w-[150px] px-4 py-3 text-center">
              <div className="flex justify-center">
                <SortableHeader
                  label="Цена, ₽"
                  sortKey="price"
                  activeSortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={onSortChange}
                />
              </div>
            </TableHead>
            <TableHead className="w-[150px] px-4 py-3" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              selected={selectedIds.has(product.id)}
              onToggleSelect={toggleSelect}
            />
          ))}
        </TableBody>
      </Table>

      <TablePagination
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  );
};
