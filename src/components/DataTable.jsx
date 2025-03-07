import React, { useState } from 'react';
import { formatDate, formatNumber, formatCurrency } from '../utils';

const DataTable = ({ 
  data = [], 
  columns = [], 
  onRowClick = null,
  emptyMessage = "No data available",
  pageSize = 5
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle sort direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and direction
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Apply sorting
  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    // Handle different data types
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return 1;
    if (bValue === null) return -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? comparison : -comparison;
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    // Date comparison
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    // Convert to dates if string dates
    if (aValue && bValue && !isNaN(new Date(aValue)) && !isNaN(new Date(bValue))) {
      const dateA = new Date(aValue);
      const dateB = new Date(bValue);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);
  
  // Format cell value based on column type
  const formatCellValue = (row, column) => {
    const value = row[column.field];
    
    if (value === null || value === undefined) {
      return '-';
    }
    
    if (column.type === 'date') {
      return formatDate(value, column.format || 'medium');
    }
    
    if (column.type === 'number') {
      return formatNumber(value, column.decimals || false);
    }
    
    if (column.type === 'currency') {
      return formatCurrency(value, column.currency || 'USD');
    }
    
    if (column.type === 'status') {
      const statusClasses = {
        'Completed': 'success',
        'Pending': 'warning',
        'Cancelled': 'danger',
        'Active': 'success',
        'Inactive': 'secondary',
        'In Progress': 'info',
        'Overdue': 'danger',
        'Announced': 'info'
      };
      
      const badgeClass = statusClasses[value] || 'primary';
      return <span className={`badge bg-${badgeClass}`}>{value}</span>;
    }
    
    if (column.type === 'custom' && typeof column.render === 'function') {
      return column.render(row);
    }
    
    return value;
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="datatable-container">
      {data.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-muted">{emptyMessage}</p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th 
                      key={column.field} 
                      style={{ width: column.width || 'auto', cursor: 'pointer' }}
                      onClick={() => handleSort(column.field)}
                    >
                      {column.header}
                      {sortField === column.field && (
                        <span className="ms-1">
                          {sortDirection === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <tr 
                    key={row.id || index}
                    className={onRowClick ? 'cursor-pointer' : ''}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {columns.map((column) => (
                      <td key={`${index}-${column.field}`}>
                        {formatCellValue(row, column)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center my-3">
              <div>
                <span className="text-muted">
                  Showing {startIndex + 1} to {Math.min(startIndex + pageSize, data.length)} of {data.length} entries
                </span>
              </div>
              <nav aria-label="Table navigation">
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show 5 page numbers centered around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  })}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DataTable;