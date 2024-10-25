import React from 'react'

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    handlePageChange: (pageNumber: number) => void;
}


export default function Pagination({ currentPage, totalPages, handlePageChange }: PaginationProps) {


    return (
        <div className="flex flex-col items-center m-28 relative z-10">
            <div className="flex flex-wrap justify-center gap-2">
                <button
                    className={`text-white font-bold px-4 py-2 rounded-l-md transition-colors duration-200 ${currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-[#2BD17E]"
                        }`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`px-4 py-2 mx-1 rounded-md transition-colors duration-200 ${currentPage === index + 1
                            ? "bg-[#2BD17E] text-white"
                            : "bg-[#092C39] text-white hover:bg-[#2BD17E] hover:text-white"
                            }`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    className={`text-white font-bold px-4 py-2 rounded-r-md transition-colors duration-200 ${currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-[#2BD17E]"
                        }`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    )
}
