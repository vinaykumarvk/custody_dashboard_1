import React from 'react';
import { formatDate, formatNumber, formatCurrency, getStatusColor } from '../utils';

const DataTable = ({ 
  data = [], 
  columns = [],
  noDataMessage = "No data available",
  onRowClick
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4 text-muted">
        {noDataMessage}
      </div>
    );
  }
  
  const handleRowClick = (row) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} style={column.width ? { width: column.width } : {}}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              onClick={() => handleRowClick(row)}
              className={onRowClick ? 'clickable-row' : ''}
              title={onRowClick ? 'Click for details' : ''}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {renderCell(row, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const renderCell = (row, column) => {
  const value = row[column.field];
  
  // If the column has a custom render function, use it
  if (column.render) {
    return column.render(value, row);
  }
  
  // Format based on type
  switch (column.type) {
    case 'date':
      return formatDate(value, column.format);
    case 'number':
      return formatNumber(value, column.decimals);
    case 'currency':
      return formatCurrency(value, column.currency);
    case 'status':
      return (
        <span className={`status status-${value?.toLowerCase()}`} style={{ 
          backgroundColor: `${getStatusColor(value)}20`,  // 20 is hex for 12% opacity
          color: getStatusColor(value) 
        }}>
          {value}
        </span>
      );
    default:
      return value;
  }
};

export default DataTable;