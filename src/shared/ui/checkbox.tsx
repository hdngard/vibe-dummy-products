import { cn } from "@/shared/lib/utils";

interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  id?: string;
  "aria-label"?: string;
  tabIndex?: number;
  size?: "sm" | "md";
  className?: string;
  withIcon?: boolean;
}

export const Checkbox = ({
  checked,
  onChange,
  id,
  "aria-label": ariaLabel,
  tabIndex = 0,
  size = "md",
  className,
  withIcon = true,
}: CheckboxProps) => {
  return (
    <label
      className={cn(
        "relative flex shrink-0 cursor-pointer items-center justify-center",
        className,
      )}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "flex shrink-0 items-center justify-center rounded-[4px] border transition-colors",
          size === "sm" ? "h-4 w-4" : "h-[22px] w-[22px]",
          checked
            ? "border-products-selected bg-products-selected"
            : "border-products-pagination-muted bg-transparent",
        )}
      >
        {checked && withIcon && (
          <svg
            width={size === "sm" ? "9" : "11"}
            height={size === "sm" ? "7" : "8"}
            viewBox="0 0 11 8"
            fill="none"
            aria-hidden
          >
            <path
              d="M1 3.5L4 6.5L10 1"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </label>
  );
};
