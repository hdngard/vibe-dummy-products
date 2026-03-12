import { Plus, MoreHorizontal } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { DummyJsonProduct } from "@/shared/api/products";
import { TableCell, TableRow } from "@/shared/ui/table";
import { Checkbox } from "@/shared/ui/checkbox";
import { formatPrice, formatCategory } from "@/modules/products/utils";

const RATING_LOW_THRESHOLD = 4;

interface ProductRowProps {
  product: DummyJsonProduct;
  selected: boolean;
  onToggleSelect: (id: number) => void;
}

export const ProductRow = ({
  product,
  selected,
  onToggleSelect,
}: ProductRowProps) => {
  const ratingValue = product.rating;
  const isLowRating = ratingValue < RATING_LOW_THRESHOLD;

  return (
    <TableRow
      className={cn(
        "border-b border-products-border hover:bg-gray-50/60 cursor-default",
        "border-l-[3px]",
        selected
          ? "border-l-products-selected bg-products-selected/[0.07]"
          : "border-l-transparent",
      )}
    >
      <TableCell className="w-[40px] py-3 pl-4 pr-2">
        <Checkbox
          checked={selected}
          onChange={() => onToggleSelect(product.id)}
          aria-label={`Выбрать ${product.title}`}
          withIcon={false}
        />
      </TableCell>

      <TableCell style={{ width: 68 }} className="px-2 py-2">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt=""
            className="h-12 w-12 rounded-lg border border-products-thumb-border object-cover"
          />
        ) : (
          <div
            className="h-12 w-12 rounded-lg border border-products-thumb-border bg-[#c4c4c4]"
            aria-hidden
          />
        )}
      </TableCell>

      <TableCell className="w-[220px] py-3 pl-2 pr-6">
        <p className="truncate font-cairo text-base font-bold text-products-text-primary">
          {product.title}
        </p>
        <p className="mt-0.5 font-cairo text-sm font-normal text-products-text-muted">
          {formatCategory(product.category)}
        </p>
      </TableCell>

      <TableCell className="w-[150px] px-4 py-3 text-center">
        <span className="font-open-sans text-base font-bold text-black">
          {product.brand}
        </span>
      </TableCell>

      <TableCell className="w-[150px] px-4 py-3 text-center">
        <span className="font-open-sans text-base font-normal text-black">
          {product.sku}
        </span>
      </TableCell>

      <TableCell className="w-[150px] px-4 py-3 text-center">
        <span
          className={cn(
            "font-open-sans text-base font-normal",
            isLowRating ? "text-destructive" : "text-black",
          )}
        >
          {ratingValue.toFixed(1)}
        </span>
        <span className="font-open-sans text-base font-normal text-black">
          /5
        </span>
      </TableCell>

      <TableCell className="w-[150px] px-4 py-3 text-center">
        <span className="font-roboto-mono text-base font-normal text-products-price">
          {formatPrice(product.price)}
        </span>
      </TableCell>

      <TableCell className="w-[150px] px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Добавить в корзину"
            className="flex h-8 items-center justify-center gap-1 rounded-full bg-primary px-4 text-white transition-colors hover:bg-primary/90"
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label="Дополнительные действия"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-products-action-border text-products-text-muted transition-colors hover:bg-gray-50"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};
