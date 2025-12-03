import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import KPICard from './KPICard';
import CustomerProfileCard from './CustomerProfileCard';
import ComparisonIndicator from './ComparisonIndicator';
import type { EnrichedCustomer, PortfolioAverages } from '../utils/customerKPIs';
import { formatCurrency, formatNumber } from '../utils/dataLoader';

interface CustomerDetailPanelProps {
  customer: EnrichedCustomer;
  portfolioAverages: PortfolioAverages;
  onClose: () => void;
}

const CustomerDetailPanel: React.FC<CustomerDetailPanelProps> = ({ customer, portfolioAverages, onClose }) => {
  // Revenue Composition Data
  const revenueData = [
    { name: 'Lifetime Fees', value: customer.lifetimeFees },
    { name: 'Spread Revenue', value: Math.max(0, customer.loanDepositSpread) },
    { name: 'Fee Optimization', value: customer.feeOptimization },
  ].filter(d => d.value > 0);

  // Product Portfolio Data
  const productData = [
    { name: 'Bank Loans', value: customer['Bank Loans'] || 0 },
    { name: 'Business Lending', value: customer['Business Lending'] || 0 },
    { name: 'Bank Deposits', value: customer['Bank Deposits'] || 0 },
    { name: 'Checking', value: customer['Checking Accounts'] || 0 },
    { name: 'Savings', value: customer['Saving Accounts'] || 0 },
    { name: 'FX Account', value: customer['Foreign Currency Account'] || 0 },
    { name: 'Credit Cards', value: (customer['Credit Card Balance'] || 0) },
  ].filter(d => d.value > 0);

  // Comparison Radar Data
  const compareData = [{
    metric: 'CLV',
    customer: Math.min((customer.clv / portfolioAverages.avgCLV) * 100, 150),
    average: 100,
  }, {
    metric: 'Fees',
    customer: Math.min((customer.lifetimeFees / portfolioAverages.avgFees) * 100, 150),
    average: 100,
  }, {
    metric: 'Products',
    customer: Math.min((customer.productCount / portfolioAverages.avgProductCount) * 100, 150),
    average: 100,
  }, {
    metric: 'Wallet Share',
    customer: Math.min((customer.walletShare / portfolioAverages.avgWalletShare) * 100, 150),
    average: 100,
  }, {
    metric: 'Tenure',
    customer: Math.min((customer.tenureYears / portfolioAverages.avgTenure) * 100, 150),
    average: 100,
  }];

  const COLORS = ['#1e3a5f', '#2a4a6f', '#3d5a7f', '#506a8f', '#637a9f'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-7xl mx-auto bg-gray-100 rounded-lg shadow-xl">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#1e3a5f]">Customer 360 Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Profile Card */}
            <CustomerProfileCard customer={customer} />

            {/* KPI Grid - Priority 1: Profitability & Efficiency */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Profitability & Efficiency</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <KPICard
                  title="Lifetime Fees"
                  value={formatCurrency(customer.lifetimeFees)}
                  icon="💰"
                  color="#1e3a5f"
                />
                <KPICard
                  title="Annual Revenue"
                  value={formatCurrency(customer.annualFeeRevenue)}
                  icon="📈"
                  color="#1e3a5f"
                />
                <KPICard
                  title="Fee Rate"
                  value={`${customer.feeRevenueRate}%`}
                  icon="💵"
                  color="#1e3a5f"
                />
                <KPICard
                  title="Fee Optimization"
                  value={formatCurrency(customer.feeOptimization)}
                  icon="⬆️"
                  color="#1e3a5f"
                />
                <KPICard
                  title="Loan-Deposit Spread"
                  value={formatCurrency(customer.loanDepositSpread)}
                  icon="📊"
                  color="#1e3a5f"
                />
                <KPICard
                  title="Revenue per Product"
                  value={formatCurrency(customer.revenuePerProduct)}
                  icon="🎯"
                  color="#1e3a5f"
                />
              </div>
            </div>

            {/* KPI Grid - Priority 2: Customer Value & Engagement */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Customer Value & Engagement</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <KPICard
                    title="Customer Tenure"
                    value={`${customer.tenureYears.toFixed(1)}Y`}
                    icon="⏱️"
                    color="#1e3a5f"
                  />
                  <ComparisonIndicator
                    value={customer.tenureYears}
                    average={portfolioAverages.avgTenure}
                    higherIsBetter={true}
                  />
                </div>
                <div>
                  <KPICard
                    title="CLV"
                    value={formatCurrency(customer.clv)}
                    icon="💎"
                    color="#1e3a5f"
                  />
                  <ComparisonIndicator
                    value={customer.clv}
                    average={portfolioAverages.avgCLV}
                    higherIsBetter={true}
                  />
                </div>
                <KPICard
                  title="Products"
                  value={`${customer.productCount}/7`}
                  icon="📦"
                  color="#1e3a5f"
                />
                <KPICard
                  title="Cross-Sell"
                  value={`${customer.crossSellOpportunity.toFixed(0)}%`}
                  icon="🎁"
                  color="#1e3a5f"
                />
                <KPICard
                  title="Wallet Share"
                  value={`${Math.min(customer.walletShare, 100).toFixed(1)}%`}
                  icon="👛"
                  color="#1e3a5f"
                />
                <KPICard
                  title="Loyalty Score"
                  value={`${customer.loyaltyScore}/4`}
                  icon="⭐"
                  color="#1e3a5f"
                />
              </div>
            </div>

            {/* KPI Grid - Priority 3 & 4: Risk & Health */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Risk & Portfolio Health</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <KPICard
                    title="Risk Score"
                    value={`${customer['Risk Weighting'].toFixed(1)}/100`}
                    icon="⚠️"
                    color={customer.riskCategory.color === 'green' ? '#10b981' : customer.riskCategory.color === 'yellow' ? '#f59e0b' : '#ef4444'}
                  />
                  <ComparisonIndicator
                    value={customer['Risk Weighting']}
                    average={portfolioAverages.avgRisk}
                    higherIsBetter={false}
                  />
                </div>
                <KPICard
                  title="Risk-Adj Revenue"
                  value={formatCurrency(customer.riskAdjustedRevenue)}
                  icon="⚖️"
                  color="#1e3a5f"
                />
                <KPICard
                  title="Debt-to-Income"
                  value={`${customer.debtToIncome.toFixed(1)}%`}
                  icon="📉"
                  color="#1e3a5f"
                />
                <KPICard
                  title="Net Position"
                  value={formatCurrency(Math.abs(customer.netPosition.value))}
                  icon={customer.netPosition.type === 'Net Depositor' ? '🟢' : '🔴'}
                  color={customer.netPosition.type === 'Net Depositor' ? '#10b981' : '#ef4444'}
                />
                <KPICard
                  title="Liquidity Ratio"
                  value={customer.liquidityRatio > 100 ? 'N/A' : `${customer.liquidityRatio.toFixed(2)}x`}
                  icon="💧"
                  color="#1e3a5f"
                />
                <KPICard
                  title="Asset Backing"
                  value={`${Math.min(customer.assetBackingRatio, 999).toFixed(0)}%`}
                  icon="🏠"
                  color="#1e3a5f"
                />
              </div>
            </div>

            {/* Visualizations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Revenue Composition */}
              {revenueData.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h4 className="text-sm font-bold text-gray-700 mb-3">Revenue Composition</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={revenueData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {revenueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Product Portfolio */}
              {productData.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h4 className="text-sm font-bold text-gray-700 mb-3">Product Portfolio</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={productData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                      <Bar dataKey="value" fill="#1e3a5f" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Comparison Radar */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-bold text-gray-700 mb-3">vs. Portfolio Average</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={compareData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 150]} tick={{ fontSize: 10 }} />
                    <Radar name="This Customer" dataKey="customer" stroke="#1e3a5f" fill="#1e3a5f" fillOpacity={0.6} />
                    <Radar name="Portfolio Avg" dataKey="average" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Risk Gauge visualization is omitted for simplicity - can be added later */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailPanel;
