export type SortKey = "price" | "rating";
export type SortDirection = "asc" | "desc";

export const VALID_SORT_KEYS: SortKey[] = ["price", "rating"];

export function isSortKey(value: string | null): value is SortKey {
  return VALID_SORT_KEYS.includes(value as SortKey);
}
