import { useEffect, useState } from "react";
import { ProductModel } from "@app/js/app.types";
import { formatDate, formatPrice } from "@app/js/services/helpers";
import productDeleteApi from "@app/js/services/api/productDeleteApi";
import { ProductListProps } from "./ProductList.types";

export default function ProductList({ products, onDelete }: ProductListProps) {

    const [data, setData] = useState<ProductModel[] | "error" | undefined>(products);

    useEffect(() => {
        setData(products)
    }, [products]);

    const deleteProductHandler = (id: number) => {
        return async (event: React.MouseEvent<HTMLButtonElement>) => {
            const data = await productDeleteApi(id);

            if (data !== null) {
                return;
            }

            onDelete?.();
        }
    }

    if (!data) {
        return (
            <div className="alert alert-light border d-flex align-items-center gap-2">
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Carregando produtos...
            </div>
        );
    }

    if (data === "error") {
        return <div className="alert alert-warning">Erro na API.</div>;
    }

    return (
        <div className="col-12 col-lg-8">
            {data.length === 0 ? (
                <div className="alert alert-warning">Nenhum produto encontrado.</div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 g-4">
                    {data.map((product) => {
                        const id = product.id;
                        return (
                            <div key={id} className="col">
                                <div className="card h-100 border-0 shadow-sm rounded-4">
                                    <div className="card-body d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h6 className="card-title mb-0 fw-semibold">{product.name}</h6>
                                            <span className="badge text-bg-light border">
                                                {formatPrice(product.price_times_thousand)}
                                            </span>
                                        </div>

                                        <p className="card-text text-muted small mt-2 mb-0">
                                            <i className="fa-regular fa-clock me-1" aria-hidden="true"></i>
                                            Cadastrado em {formatDate(product.created_at)}
                                        </p>
                                    </div>

                                    <div className="card-footer bg-white border-0 pt-0">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="badge rounded-pill text-bg-primary">#{product.id}</span>
                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={deleteProductHandler(id)}>
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
