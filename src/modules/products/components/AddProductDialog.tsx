import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    title: string;
    price: number;
    brand: string;
    sku?: string;
  }) => void;
}

const addProductSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Наименование обязательно"),
  price: z
    .string()
    .trim()
    .min(1, "Цена обязательна")
    .refine((value) => {
      const priceNumber = Number(value.replace(",", "."));
      return !Number.isNaN(priceNumber);
    }, "Введите корректное число")
    .refine((value) => {
      const priceNumber = Number(value.replace(",", "."));
      return priceNumber > 0;
    }, "Цена должна быть больше 0"),
  brand: z
    .string()
    .trim()
    .min(1, "Вендор обязателен"),
  sku: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
});

type AddProductFormValues = z.infer<typeof addProductSchema>;

export const AddProductDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: AddProductDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddProductFormValues>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      title: "",
      price: "",
      brand: "",
      sku: "",
    },
  });

  const handleFormSubmit: SubmitHandler<AddProductFormValues> = (values) => {
    const priceNumber = Number(values.price.replace(",", "."));

    onSubmit({
      title: values.title,
      price: priceNumber,
      brand: values.brand,
      sku: values.sku || undefined,
    });

    reset();
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-slate-900">
            Добавить товар
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          <div className="space-y-1">
            <Label htmlFor="title" className="text-xs">
              Наименование
            </Label>
            <Input
              id="title"
              type="text"
              {...register("title")}
              className={errors.title ? "border-destructive focus-visible:ring-destructive" : undefined}
              placeholder="Название товара"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="price" className="text-xs">
              Цена
            </Label>
            <Input
              id="price"
              type="text"
              inputMode="decimal"
              {...register("price")}
              className={errors.price ? "border-destructive focus-visible:ring-destructive" : undefined}
              placeholder="Например, 1999"
            />
            {errors.price && (
              <p className="text-xs text-destructive">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="brand" className="text-xs">
              Вендор
            </Label>
            <Input
              id="brand"
              type="text"
              {...register("brand")}
              className={errors.brand ? "border-destructive focus-visible:ring-destructive" : undefined}
              placeholder="Бренд / производитель"
            />
            {errors.brand && (
              <p className="text-xs text-destructive">{errors.brand.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="sku" className="text-xs">
              Артикул (опционально)
            </Label>
            <Input
              id="sku"
              type="text"
              {...register("sku")}
              placeholder="Например, SKU-001"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit">
              Сохранить
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
