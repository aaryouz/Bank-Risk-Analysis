import React from 'react';
import Badge from './Badge';
import type { EnrichedCustomer } from '../utils/customerKPIs';
import { formatCurrency } from '../utils/dataLoader';

interface CustomerTableProps {
  customers: EnrichedCustomer[];
  onCustomerSelect: (customer: EnrichedCustomer) => void;
  sortBy: 'revenue' | 'clv' | 'risk' | 'name';
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: 'revenue' | 'clv' | 'risk' | 'name') => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onCustomerSelect,
  sortBy,
  sortDirection,
  onSortChange,
}) => {
  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) {
      return (
        <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    if (sortDirection === 'desc') {
      return (
        <svg className="w-4 h-4 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSortChange('name')}
              >
                <div className="flex items-center gap-2">
                  Name
                  <SortIcon field="name" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Client ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSortChange('revenue')}
              >
                <div className="flex items-center gap-2">
                  Lifetime Fees
                  <SortIcon field="revenue" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSortChange('clv')}
              >
                <div className="flex items-center gap-2">
                  CLV
                  <SortIcon field="clv" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSortChange('risk')}
              >
                <div className="flex items-center gap-2">
                  Risk
                  <SortIcon field="risk" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Products
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  <p className="text-lg">No customers found</p>
                  <p className="text-sm mt-2">Try adjusting your search or filters</p>
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer['Client ID']}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onCustomerSelect(customer)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.Name}</div>
                    <div className="text-sm text-gray-500">{customer.Nationality}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer['Client ID']}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatCurrency(customer.lifetimeFees)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(customer.clv)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-gray-900">
                        {customer['Risk Weighting'].toFixed(1)}/100
                      </span>
                      <Badge
                        label={customer.riskCategory.label}
                        color={customer.riskCategory.color as any}
                        size="sm"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.productCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCustomerSelect(customer);
                      }}
                      className="text-[#1e3a5f] hover:text-[#2a4a6f] font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;
