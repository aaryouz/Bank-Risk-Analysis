import React from 'react';

interface ComparisonIndicatorProps {
  value: number;
  average: number;
  higherIsBetter?: boolean;
  formatValue?: (val: number) => string;
}

const ComparisonIndicator: React.FC<ComparisonIndicatorProps> = ({
  value,
  average,
  higherIsBetter = true,
  formatValue = (val) => val.toFixed(1),
}) => {
  if (average === 0 || !isFinite(value) || !isFinite(average)) {
    return null;
  }

  const percentDiff = ((value - average) / average) * 100;
  const isPositive = percentDiff > 0;
  const isBetter = higherIsBetter ? isPositive : !isPositive;

  // Don't show indicator if difference is less than 1%
  if (Math.abs(percentDiff) < 1) {
    return <span className="text-xs text-gray-500 ml-2">≈ avg</span>;
  }

  const color = isBetter ? 'text-green-600' : 'text-red-600';
  const arrow = isPositive ? '↑' : '↓';

  return (
    <span className={`text-xs font-medium ml-2 ${color}`}>
      {arrow} {Math.abs(percentDiff).toFixed(0)}%
    </span>
  );
};

export default ComparisonIndicator;
