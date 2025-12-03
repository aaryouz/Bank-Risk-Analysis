import React from 'react';
import Badge from './Badge';
import type { EnrichedCustomer } from '../utils/customerKPIs';

interface CustomerProfileCardProps {
  customer: EnrichedCustomer;
}

const CustomerProfileCard: React.FC<CustomerProfileCardProps> = ({ customer }) => {
  // Get initials from name
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Get loyalty color
  const getLoyaltyColor = (loyalty: string) => {
    if (loyalty === 'Platinum') return 'purple';
    if (loyalty === 'Gold') return 'yellow';
    if (loyalty === 'Silver') return 'gray';
    return 'green'; // Jade
  };

  // Get fee structure color
  const getFeeColor = (fee: string) => {
    if (fee === 'High') return 'red';
    if (fee === 'Mid') return 'yellow';
    return 'green'; // Low
  };

  // Format joined date
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const initials = getInitials(customer.Name);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-2xl font-bold">
            {initials}
          </div>
        </div>

        {/* Customer Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900 truncate">{customer.Name}</h2>
          <p className="text-sm text-gray-600 mt-1">ID: {customer['Client ID']}</p>

          <div className="mt-3 space-y-2">
            <div className="flex items-center text-sm text-gray-700">
              <span className="font-medium w-24">Age:</span>
              <span>{customer.Age} years</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <span className="font-medium w-24">Nationality:</span>
              <span>{customer.Nationality}</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <span className="font-medium w-24">Occupation:</span>
              <span className="truncate">{customer.Occupation}</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <span className="font-medium w-24">Joined:</span>
              <span>{formatDate(customer['Joined Bank'])}</span>
              <span className="ml-2 text-gray-500">
                ({customer.tenureYears.toFixed(1)} years)
              </span>
            </div>
          </div>

          {/* Badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge
              label={customer['Loyalty Classification']}
              color={getLoyaltyColor(customer['Loyalty Classification'])}
              size="sm"
            />
            <Badge
              label={`${customer['Fee Structure']} Fee`}
              color={getFeeColor(customer['Fee Structure'])}
              size="sm"
            />
            <Badge
              label={customer.riskCategory.label}
              color={customer.riskCategory.color as any}
              size="sm"
            />
            {customer.tenureYears < 0.25 && (
              <Badge label="New Customer" color="blue" size="sm" />
            )}
            {customer.productCount === 0 && (
              <Badge label="Dormant" color="red" size="sm" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfileCard;
