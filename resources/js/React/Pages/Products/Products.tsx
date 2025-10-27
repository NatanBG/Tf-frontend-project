
import ProductList from "@app/js/React/components/ProductList/ProductList";
import ProductCreateForm from "@app/js/React/components/ProductCreateForm/ProductCreateForm";
import Pagination from "@app/js/React/components/Pagination/Pagination";
import { useEffect, useState, useRef } from "react";
import { ProductModel } from "@app/js/app.types";
import productListApi from "@app/js/services/api/productListApi";

export default function Products() {

    const [productList, setProductList] = useState<ProductModel[] | "error">();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Limpa o timeout anterior se existir
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        // Define um novo timeout para executar a busca após 500ms
        debounceTimeout.current = setTimeout(() => {
            setCurrentPage(1); // Volta para primeira página ao buscar
            listApi(1, search);
        }, 500);

        // Cleanup: limpa o timeout quando o componente desmonta ou search muda
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [search]);

    useEffect(() => {
        listApi(currentPage, search);
    }, [currentPage]);

    const listApi = async (page = 1, searchTerm = "") => {
        const resp = await productListApi(10, "id,desc", page, searchTerm);
        if ("error" in resp) return setProductList("error");
        
        setProductList(resp.rows);
        
        // Calcula o total de páginas
        const total = Math.ceil(resp.count / resp.limit);
        setTotalPages(total);
    };

    const createProductHandler = () => {
        listApi(currentPage, search);
    }

    const deleteProductHandler = () => {
        listApi(currentPage, search);
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    return (
        <div className="row g-4">
            <ProductCreateForm onCreate={createProductHandler} />
            
            <div className="col-12">
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar produtos..."
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            <ProductList products={productList} onDelete={deleteProductHandler} />
            
            <div className="col-12">
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
