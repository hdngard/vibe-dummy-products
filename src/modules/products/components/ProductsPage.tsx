import { AddProductDialog } from "@/modules/products/components/AddProductDialog";
import { ProductsTable } from "@/modules/products/components/ProductsTable";
import { useProducts } from "@/modules/products/hooks/useProducts";
import { isSortKey } from "@/modules/products/types";
import type { SortDirection, SortKey } from "@/modules/products/types";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { useTimedState } from "@/shared/hooks/useTimedState";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";

import { useAuth } from "@/shared/auth/AuthContext";

import AddCircleIcon from "@/shared/assets/icon-add-circle.svg?react";
import RefreshIcon from "@/shared/assets/icon-refresh.svg?react";

interface ToastState {
  message: string;
}

const PAGE_SIZE = 20;

export const ProductsPage = () => {
  const { logout } = useAuth();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);

  const [searchParams, setSearchParams] = useSearchParams();
  const rawSortBy = searchParams.get("sortBy");
  const sortKey: SortKey = isSortKey(rawSortBy) ? rawSortBy : "price";
  const sortDirection: SortDirection = searchParams.get("order") === "desc" ? "desc" : "asc";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const { products, total, isLoading, isError, error } = useProducts({
    search: debouncedSearch,
    page,
    pageSize: PAGE_SIZE,
    sortKey,
    sortDirection,
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [toast, setToast] = useTimedState<ToastState>(3000);

  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const handleSortChange = (key: SortKey) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (key === sortKey) {
        next.set("order", sortDirection === "asc" ? "desc" : "asc");
      } else {
        next.set("sortBy", key);
        next.set("order", "asc");
      }
      next.delete("page");
      return next;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newPage <= 1) {
        next.delete("page");
      } else {
        next.set("page", String(newPage));
      }
      return next;
    });
  };

  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("page");
      return next;
    });
  }, [debouncedSearch, setSearchParams]);

  const handleAddProduct = (_payload: {
    title: string;
    price: number;
    brand: string;
    sku?: string;
  }) => {
    setToast({ message: "Товар успешно добавлен" });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5 flex flex-col gap-[30px]">
      <header className="flex items-center gap-8 rounded-[10px] bg-white px-7 py-[28px]">
        <h1 className="shrink-0 font-cairo text-2xl font-bold text-products-nav-title">
          Товары
        </h1>

        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-products-search-placeholder pointer-events-none"
          />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Найти"
            className="h-12 w-full rounded-lg border-none bg-products-search-bg pl-11 pr-4 text-sm text-foreground shadow-none placeholder:text-products-search-placeholder focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={logout}
          className="shrink-0 rounded-lg font-cairo text-sm font-semibold"
        >
          Выйти
        </Button>
      </header>

      <div className="flex flex-col gap-10 rounded-[12px] bg-white px-7 py-10">
        <div className="flex items-center justify-between">
          <h2
            className="font-cairo text-xl font-black text-products-section-title"
          >
            Все позиции
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              aria-label="Обновить список"
              className="flex h-9 w-9 items-center justify-center rounded-md text-products-icon-muted transition-colors hover:bg-gray-100"
            >
              <RefreshIcon width={18} height={18} />
            </button>

            <Button
              type="button"
              onClick={() => setIsAddDialogOpen(true)}
              className="gap-1.5 rounded-lg font-cairo text-sm font-semibold"
            >
              <AddCircleIcon
                width={18}
                height={18}
                className="text-white"
              />
              Добавить
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="rounded-md border border-border bg-card px-4 py-6 text-sm text-muted-foreground shadow-sm">
            Загружаем список товаров…
          </div>
        )}

        {isError && !isLoading && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            Не удалось загрузить список товаров.
            {error?.message ? ` ${error.message}` : ""}
          </div>
        )}

        {!isLoading && !isError && (
          <ProductsTable
            products={products}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            totalCount={total}
            page={page}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <AddProductDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddProduct}
      />

      {toast &&
        createPortal(
          <div className="fixed bottom-4 right-4 z-50 animate-toast-in rounded-md bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
            {toast.message}
          </div>,
          document.body,
        )}
    </div>
  );
};
