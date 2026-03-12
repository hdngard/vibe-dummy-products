import {
  fetchProducts,
  searchProducts,
  type DummyJsonProduct,
} from "@/shared/api/products";
import type { SortDirection, SortKey } from "@/modules/products/types";
import { useQuery } from "@tanstack/react-query";

export interface UseProductsParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sortKey?: SortKey | null;
  sortDirection?: SortDirection;
}

export interface UseProductsResult {
  products: DummyJsonProduct[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const useProducts = (params: UseProductsParams = {}): UseProductsResult => {
  const {
    search = "",
    page = 1,
    pageSize = 20,
    sortKey = null,
    sortDirection = "asc",
  } = params;

  const trimmedQuery = search.trim();
  const isSearchActive = trimmedQuery.length > 0;

  const skip = (page - 1) * pageSize;
  const queryParams = {
    skip,
    limit: pageSize,
    ...(sortKey ? { sortBy: sortKey, order: sortDirection } : {}),
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: isSearchActive
      ? ["products", "search", trimmedQuery, { page, pageSize, sortKey, sortDirection }]
      : ["products", "list", { page, pageSize, sortKey, sortDirection }],
    queryFn: () =>
      isSearchActive
        ? searchProducts(trimmedQuery, queryParams)
        : fetchProducts(queryParams),
    staleTime: 1000 * 60,
  });

  return {
    products: data?.products ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError,
    error: error ?? null,
  };
};
