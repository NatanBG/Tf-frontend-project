import { ListApi, ProductModel } from "@app/js/app.types";
import { baseAxios } from "../axiosApi";
import catchError from "../catchError";



export default async function productListApi(limit = 15, orderBy = "id,desc", page = 1, search = "") {

    try {
        // Se houver busca, busca TODOS os produtos primeiro
        if (search) {
            const queryAll = new URLSearchParams({
                "orderBy": orderBy,
                "limit": "100",  // Busca até 100 produtos
                "offset": "0"
            });

            const { data } = await baseAxios.get<ListApi<ProductModel>>(`api/products?${queryAll}`);

            // Filtra os produtos pela busca
            const filteredRows = data.rows.filter(product => 
                product.name.toLowerCase().includes(search.toLowerCase())
            );

            // Pagina os resultados filtrados
            const totalFiltered = filteredRows.length;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedRows = filteredRows.slice(startIndex, endIndex);

            return {
                rows: paginatedRows,
                count: totalFiltered,
                limit: limit,
                next: endIndex < totalFiltered ? endIndex : null
            };
        }

        // Se NÃO houver busca, busca normalmente com paginação
        const offset = (page - 1) * limit;
        const query = new URLSearchParams({
            "orderBy": orderBy,
            "limit": limit.toString(),
            "offset": offset.toString()
        });

        const { data } = await baseAxios.get<ListApi<ProductModel>>(`api/products?${query}`);
        return data;

    } catch (error) {
        return catchError(error);
    }
}
