import { PaginationProps } from "./Pagination.types";

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    
    if (totalPages <= 1) {
        return null;
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page: number) => {
        onPageChange(page);
    };

    // Gerar array de páginas para exibir
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // Se tiver poucas páginas, mostra todas
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Lógica para páginas com reticências
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav aria-label="Navegação de páginas">
            <ul className="pagination justify-content-center mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                        className="page-link" 
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        aria-label="Anterior"
                    >
                        <span aria-hidden="true">&laquo;</span>
                    </button>
                </li>

                {pageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <li key={`ellipsis-${index}`} className="page-item disabled">
                                <span className="page-link">...</span>
                            </li>
                        );
                    }

                    return (
                        <li 
                            key={page} 
                            className={`page-item ${currentPage === page ? 'active' : ''}`}
                        >
                            <button 
                                className="page-link" 
                                onClick={() => handlePageClick(page as number)}
                            >
                                {page}
                            </button>
                        </li>
                    );
                })}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                        className="page-link" 
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        aria-label="Próxima"
                    >
                        <span aria-hidden="true">&raquo;</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
}
