import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './Pagination.scss';


const Pagination = ({ currentPage, itemsPerPage, totalItems, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxVisiblePages = 10; // Set the maximum number of visible page numbers

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);
  
    if (totalPages <= maxVisiblePages) {
      // Display all pages if total pages are less than or equal to maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Display a range of pages centered around the current page
      let startPage = Math.max(1, currentPage - halfMaxVisiblePages);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
      if (endPage - startPage < maxVisiblePages - 1) {
        // Adjust startPage when close to the end
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
  
      // Ensure the current page is included in the displayed pages
      if (currentPage + halfMaxVisiblePages > endPage) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      } else if (currentPage - halfMaxVisiblePages < startPage) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      }
  
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
  
    return pageNumbers;
  };
  
  return (
    <nav aria-label="Page navigation">
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(1)} aria-label="First">
            <span aria-hidden="true">&lt;&lt;</span>
          </button>
        </li>
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage - 1)} aria-label="Previous">
            <span aria-hidden="true">&lt;</span>
          </button>
        </li>
        {renderPageNumbers().map((pageNumber) => (
          <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(pageNumber)}>
              {pageNumber}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage + 1)} aria-label="Next">
            <span aria-hidden="true">&gt;</span>
          </button>
        </li>
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(totalPages)} aria-label="Last">
            <span aria-hidden="true">&gt;&gt;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
