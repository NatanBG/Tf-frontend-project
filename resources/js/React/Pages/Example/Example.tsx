import { useEffect, useState } from "react";
import loginApi from "@app/js/services/api/loginApi";
import productListApi from "@app/js/services/api/productListApi";
import ProductList from "@app/js/React/components/ProductList/ProductList";
import Counter from "@app/js/React/components/Counter/Counter";
import { ProductModel } from "@app/js/app.types";
import ProductCreateForm from "@app/js/React/components/ProductCreateForm/ProductCreateForm";

export default function Example() {

    const [productList, setProductList] = useState<ProductModel[] | "error">();

    const [page, setPage] = useState<"Counter" | "List Products">("Counter");

    useEffect(() => {
        if (page === "Counter") {
            return;
        }

        listApi();

    }, [page]);

    const listApi = async () => {
        const resp = await productListApi(10);
        if ("error" in resp) return setProductList("error");
        setProductList(resp.rows);
    };

    const createProductHandler = () => {
        listApi();
    }

    const deleteProductHandler = () => {
        listApi();
    }/** */

    const PageContent: React.JSX.Element =
        page === "Counter" ? (
            <div className="row g-4 justify-content-center align-items-center min-vh-50">
                <div className="col-auto d-flex justify-content-center align-items-center">
                    <Counter />
                </div>
            </div>
        ) : (
            <div className="row g-4">
                <ProductCreateForm onCreate={createProductHandler} />
                <ProductList products={productList} onDelete={deleteProductHandler} />
            </div>
        );

    console.log(PageContent);


    return (
        <div className="row g-4">
            <ul className="nav nav-tabs mb-4 justify-content-center">
                {["Counter", "List Products"].map((item) => {
                    const classList = ["nav-link"];

                    if (page === item) {
                        classList.push("active");
                    }
                    return (
                        <li key={item} className="nav-item">
                            <button
                                className={classList.join(" ")}
                                onClick={() => setPage(item as typeof page)}
                            >
                                {item}
                            </button>
                        </li>
                    );
                })}
            </ul>
            {PageContent}
        </div>
    );
}
