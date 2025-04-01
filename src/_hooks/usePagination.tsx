import { useState } from "react";

export const usePagination = (totalItems: number, pageSize: number = 100) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const totalPages = Math.ceil(totalItems / pageSize);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
  };
};
