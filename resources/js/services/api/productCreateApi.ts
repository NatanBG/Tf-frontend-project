import { ProductModel } from "@app/js/app.types";
import { baseAxios } from "../axiosApi";
import catchError from "../catchError";

export default async function productCreateApi(name: string, price: string) {
    try {
        // Converte vírgula para ponto e remove espaços
        const priceNumber = parseFloat(price.replace(',', '.').trim());
        
        const { data } = await baseAxios.post<ProductModel>(`api/products`, {
            name: name,
            price: isNaN(priceNumber) ? 0 : priceNumber
        });
        return data;
    } catch (error) {
        return catchError(error);
    }
}
