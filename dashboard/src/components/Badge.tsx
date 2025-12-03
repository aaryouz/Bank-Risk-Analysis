import React from 'react';

interface BadgeProps {
  label: string;
  color: 'green' | 'yellow' | 'red' | 'blue' | 'purple' | 'gray';
  size?: 'sm' | 'md' | 'lg';
}

const Badge: React.FC<BadgeProps> = ({ label, color, size = 'md' }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-800 border-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    red: 'bg-red-100 text-red-800 border-red-300',
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    purple: 'bg-purple-100 text-purple-800 border-purple-300',
    gray: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${colorClasses[color]} ${sizeClasses[size]}`}
    >
      {label}
    </span>
  );
};

export default Badge;
