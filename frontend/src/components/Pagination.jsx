import React from 'react';

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    if (pageNumbers.length <= 1) return null;

    return (
        <nav className="flex justify-center mt-6">
        <ul className="flex gap-2">
            {pageNumbers.map((number) => (
            <li key={number}>
                <button
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded-md border ${
                    currentPage === number
                    ? "bg-[#0056D2] text-white border-[#0056D2]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
                >
                {number}
                </button>
            </li>
            ))}
        </ul>
        </nav>
    );
};

export default Pagination;