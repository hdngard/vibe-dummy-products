import { apiClient } from "./apiClient";

export interface DummyJsonProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  brand: string;
  category: string;
  stock: number;
  thumbnail: string;
  sku: string;
}

export interface ProductsResponse {
  products: DummyJsonProduct[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductsQueryParams {
  skip?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export const fetchProducts = (
  params: ProductsQueryParams = {},
): Promise<ProductsResponse> =>
  apiClient.get<ProductsResponse>("/products", { params });

export const searchProducts = (
  query: string,
  params: ProductsQueryParams = {},
): Promise<ProductsResponse> => {
  if (!query) {
    return fetchProducts(params);
  }

  return apiClient.get<ProductsResponse>("/products/search", {
    params: { q: query, ...params },
  });
};
