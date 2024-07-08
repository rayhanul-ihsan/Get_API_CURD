"use client";

import { useState } from "react";

const ActionPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [limit, setLimit] = useState(10);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageSelect = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(event.target.value));
    setCurrentPage(1);
  };
  return (
    <div className="flex justify-between items-center mt-4">
      <div className="flex items-center">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Next
        </button>
      </div>
      <div className="flex items-center">
        <label htmlFor="page-select" className="mr-2">
          Page:
        </label>
        <select
          id="page-select"
          value={currentPage}
          onChange={(e) => handlePageSelect(Number(e.target.value))}
          className="border border-gray-300 rounded-md p-2"
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center">
        <label htmlFor="limit-select" className="mr-2">
          Limit:
        </label>
        <select
          id="limit-select"
          value={limit}
          onChange={handleLimitChange}
          className="border border-gray-300 rounded-md p-2"
        >
          {[10, 20, 30, 50].map((limitOption) => (
            <option key={limitOption} value={limitOption}>
              {limitOption}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ActionPage;
