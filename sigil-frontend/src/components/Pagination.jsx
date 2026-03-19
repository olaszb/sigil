import { ArrowLeft, ArrowRight } from "lucide-react";
import { scrollToId } from "../util/helper";

const Pagination = ({ pagination, getEvents }) => {
    const { current_page, last_page } = pagination;

    const getPageNumbers = () => {
        const pages = [];
        const gap = 1;

        for (let i = 1; i <= last_page; i++){
            if (i === 1 || i === last_page || (i >= current_page - gap && i <= current_page + gap)) {
                pages.push(i);
            }else if(i === current_page - gap - 1 || i === current_page + gap + 1) {
                pages.push("...");
            }
        }
        return pages.filter((item, index) => item !== "..." || pages[index-1] !== "...");
    }

    const handlePageChange = (pageNum) => {
        getEvents(pageNum);
        setTimeout(() => scrollToId("title"), 100);
    }

    const activeStyles = "border-main-accent text-main-accent bg-main-accent/5 shadow-[0_0_10px_rgba(154,0,0,0.2)]";
    const hoverEffect = "relative overflow-hidden border-parchment/10 hover:border-main-accent before:content-[''] before:absolute before:inset-0 before:bg-main-accent before:translate-y-[100%] before:transition-transform before:duration-400 before:ease-in-out hover:before:translate-y-0 hover:text-primary-bg";
    return (
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 mb-10 mt-8 px-4 text-parchment">
                <button disabled={pagination.current_page === 1}
                        onClick={() => handlePageChange(pagination.current_page - 1)} 
                        className=
                        {`px-3 py-1 border border-parchment/10 hover:border-main-accent disabled:opacity-20 disabled:hover:border-parchment/10 transition-all duration-300
                        ${pagination.current_page !== 1 
                        ? hoverEffect
                        : ''}`}
                        >
                        <span className="relative z-10 flex items-center gap-1"><ArrowLeft size={16}/> <span className="hidden sm:inline">Previous</span></span>
                </button>
                <div className="flex flex-wrap justify-center gap-1">
                    {getPageNumbers().map((pageNum, index) => (
                        pageNum === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2 py-1 text-parchment/30">...</span>
                        ) : (
                            <button 
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-3 py-1 border transition-all duration-300 ${current_page === pageNum ? activeStyles : hoverEffect}`}
                            >
                                <span className="relative z-10">{pageNum}</span>
                            </button>
                        )
                    ))}
                </div>

                <button disabled={pagination.current_page === pagination.last_page} 
                        onClick={() => handlePageChange(pagination.current_page + 1)} 
                        className=
                        {`px-3 py-1 border border-parchment/10 hover:border-main-accent disabled:opacity-20 disabled:hover:border-parchment/10 transition-all duration-300
                        ${pagination.current_page !== pagination.last_page 
                        ? hoverEffect
                        : ''}`}>
                    <span className="relative z-10 flex items-center gap-1"><span className="hidden sm:inline">Next</span><ArrowRight size={16}/></span>
                </button>
            </div>
    );
}

export default Pagination;