import { ProductModel } from "@app/js/app.types";

export type ProductListProps = {
    products: ProductModel[] | "error" | undefined;
    onDelete?: () => void;
}