import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  totalPages: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
  currentPage: number,
}
const PageNavigationComponent = ({totalPages, setCurrentPage, currentPage }: Props) => {

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };
  if (totalPages === -1 || currentPage === -1){
    return (
      <div>loading...</div>
    )
  }
  return (
    <div className="flex items-center justify-center gap-1 p-4">
      {/* Prev Button */}
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={`group flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200
          ${currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:scale-105"
          }
        `}
      >
        <ChevronLeft
          size={16}
          className={`transition-transform duration-200 ${currentPage === 1 ? "" : "group-hover:-translate-x-1"
            }`}
        />
        Prev
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {getVisiblePages().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="px-3 py-2 text-gray-500 select-none"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = currentPage === pageNum;

          return (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              aria-label={`Page ${pageNum}`}
              aria-current={isActive ? "page" : undefined}
              className={`relative min-w-[2.5rem] px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300
                ${isActive
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:scale-110"
                }
                before:absolute before:inset-0 before:rounded-lg before:bg-blue-400 before:opacity-0 before:transition-opacity before:duration-300
                hover:before:opacity-10
              `}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={`group flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200
          ${currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:scale-105"
          }
        `}
      >
        Next
        <ChevronRight
          size={16}
          className={`transition-transform duration-200 ${currentPage === totalPages ? "" : "group-hover:translate-x-1"
            }`}
        />
      </button>
    </div>
  );
};

export default PageNavigationComponent;