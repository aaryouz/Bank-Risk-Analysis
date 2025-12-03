import React, { useEffect, useState, useMemo } from 'react';
import KPICard from '../components/KPICard';
import SearchInput from '../components/SearchInput';
import CustomerTable from '../components/CustomerTable';
import CustomerDetailPanel from '../components/CustomerDetailPanel';
import { loadCleanedBanking, filterData, filterByRevenue, filterByRisk, formatCurrency, formatNumber } from '../utils/dataLoader';
import { enrichCustomerData, calculatePortfolioAverages } from '../utils/customerKPIs';
import type { BankingRecord, FilterState } from '../utils/dataLoader';
import type { EnrichedCustomer } from '../utils/customerKPIs';

const Customer360: React.FC = () => {
  const [rawData, setRawData] = useState<BankingRecord[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<EnrichedCustomer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'revenue' | 'clv' | 'risk' | 'name'>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [limitTo, setLimitTo] = useState(50);
  const [filters, setFilters] = useState<FilterState>({
    gender: 'All',
    relationship: 'All',
    advisor: 'All',
    timePeriod: 'All',
    revenueFilter: 'All',
    riskFilter: 'All',
  });

  // Load data
  useEffect(() => {
    loadCleanedBanking().then(data => {
      setRawData(data.filter(d => d['Client ID']));
    });
  }, []);

  // Apply all filters
  const filteredData = useMemo(() => {
    // Start with raw data
    let data = [...rawData];

    // Apply revenue filter FIRST (needs full dataset for percentile calculation)
    if (filters.revenueFilter && filters.revenueFilter !== 'All') {
      data = filterByRevenue(data, filters.revenueFilter);
    }

    // Apply risk filter SECOND (on full or revenue-filtered dataset)
    if (filters.riskFilter && filters.riskFilter !== 'All') {
      data = filterByRisk(data, filters.riskFilter);
    }

    // Apply standard filters (gender, relationship, advisor, time period)
    data = filterData(data, filters);

    // Apply search filter LAST
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      data = data.filter(d =>
        d.Name.toLowerCase().includes(search) ||
        d['Client ID'].toLowerCase().includes(search)
      );
    }

    return data;
  }, [rawData, filters.gender, filters.relationship, filters.advisor, filters.timePeriod, filters.revenueFilter, filters.riskFilter, searchTerm]);

  // Enrich customer data with KPIs
  const enrichedCustomers = useMemo(() => {
    return filteredData.map(enrichCustomerData);
  }, [filteredData]);

  // Sort customers
  const sortedCustomers = useMemo(() => {
    const sorted = [...enrichedCustomers];

    switch (sortBy) {
      case 'revenue':
        sorted.sort((a, b) => sortDirection === 'desc'
          ? b.lifetimeFees - a.lifetimeFees
          : a.lifetimeFees - b.lifetimeFees);
        break;
      case 'clv':
        sorted.sort((a, b) => sortDirection === 'desc'
          ? b.clv - a.clv
          : a.clv - b.clv);
        break;
      case 'risk':
        sorted.sort((a, b) => sortDirection === 'desc'
          ? b['Risk Weighting'] - a['Risk Weighting']
          : a['Risk Weighting'] - b['Risk Weighting']);
        break;
      case 'name':
        sorted.sort((a, b) => sortDirection === 'desc'
          ? b.Name.localeCompare(a.Name)
          : a.Name.localeCompare(b.Name));
        break;
    }

    return sorted;
  }, [enrichedCustomers, sortBy, sortDirection]);

  // Limit results
  const displayedCustomers = useMemo(() => {
    return sortedCustomers.slice(0, limitTo);
  }, [sortedCustomers, limitTo]);

  // Calculate portfolio averages for comparison
  const portfolioAverages = useMemo(() => {
    return calculatePortfolioAverages(filteredData);
  }, [filteredData]);

  // Quick metrics
  const quickMetrics = useMemo(() => {
    if (filteredData.length === 0) {
      return { totalCustomers: 0, avgCLV: 0, totalRevenue: 0, avgRisk: 0 };
    }

    const enriched = filteredData.map(enrichCustomerData);
    return {
      totalCustomers: filteredData.length,
      avgCLV: enriched.reduce((sum, c) => sum + c.clv, 0) / filteredData.length,
      totalRevenue: enriched.reduce((sum, c) => sum + c.lifetimeFees, 0),
      avgRisk: filteredData.reduce((sum, c) => sum + (c['Risk Weighting'] || 0), 0) / filteredData.length,
    };
  }, [filteredData]);

  const handleCustomerSelect = (customer: EnrichedCustomer) => {
    setSelectedCustomer(customer);
  };

  const handleClosePanel = () => {
    setSelectedCustomer(null);
  };

  const handleSortChange = (field: 'revenue' | 'clv' | 'risk' | 'name') => {
    if (sortBy === field) {
      // Toggle direction if clicking the same field
      setSortDirection(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      // Set new field and reset to descending
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  const handleResetFilters = () => {
    setFilters({
      gender: 'All',
      relationship: 'All',
      advisor: 'All',
      timePeriod: 'All',
      revenueFilter: 'All',
      riskFilter: 'All',
    });
    setSearchTerm('');
    setSortBy('revenue');
    setSortDirection('desc');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Customer 360 - Revenue Intelligence</h1>
        <p className="text-gray-600 mt-1">Individual customer profitability analysis</p>
      </div>

      {/* Search and Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        {/* Row 1: Search and Display Controls */}
        <div className="flex flex-wrap gap-4 items-center mb-4 pb-4 border-b border-gray-200">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by name or ID..."
          />

          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium text-gray-600">Display:</span>
            <select
              value={limitTo}
              onChange={(e) => setLimitTo(Number(e.target.value))}
              className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
            >
              <option value={20}>Top 20</option>
              <option value={50}>Top 50</option>
              <option value={100}>Top 100</option>
              <option value={sortedCustomers.length}>All ({sortedCustomers.length})</option>
            </select>
          </div>

          <button
            onClick={handleResetFilters}
            className="ml-auto px-4 py-2 text-sm bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded transition-colors font-medium"
          >
            Reset All Filters
          </button>
        </div>

        {/* Row 2: Revenue & Risk Filters (Primary) */}
        <div className="flex flex-wrap gap-4 items-center mb-3 pb-3 border-b border-gray-200">
          <div className="font-medium text-sm text-gray-700">Primary Filters:</div>

          <div className="flex gap-2 items-center bg-blue-50 px-3 py-2 rounded border border-blue-200">
            <span className="text-sm font-medium text-blue-900">💰 Revenue Level:</span>
            <select
              value={filters.revenueFilter || 'All'}
              onChange={(e) => setFilters(f => ({ ...f, revenueFilter: e.target.value as 'All' | 'High' | 'Low' }))}
              className="px-2 py-1 text-sm border border-blue-300 rounded bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Customers</option>
              <option value="High">High Revenue (Top 25%)</option>
              <option value="Low">Low Revenue (Bottom 25%)</option>
            </select>
          </div>

          <div className="flex gap-2 items-center bg-orange-50 px-3 py-2 rounded border border-orange-200">
            <span className="text-sm font-medium text-orange-900">⚠️ Risk Level:</span>
            <select
              value={filters.riskFilter || 'All'}
              onChange={(e) => setFilters(f => ({ ...f, riskFilter: e.target.value as 'All' | 'High' | 'Low' }))}
              className="px-2 py-1 text-sm border border-orange-300 rounded bg-white focus:ring-2 focus:ring-orange-500"
            >
              <option value="All">All Risk Levels</option>
              <option value="High">High Risk (Score &gt; 60)</option>
              <option value="Low">Low Risk (Score &lt; 30)</option>
            </select>
          </div>

          {(filters.revenueFilter !== 'All' || filters.riskFilter !== 'All') && (
            <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
              Showing: {filteredData.length} customers
            </div>
          )}
        </div>

        {/* Row 3: Secondary Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="font-medium text-sm text-gray-700">Additional Filters:</div>

          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600">Gender:</span>
            <select
              value={filters.gender}
              onChange={(e) => setFilters(f => ({ ...f, gender: e.target.value as FilterState['gender'] }))}
              className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#1e3a5f]"
            >
              <option>All</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600">Relationship:</span>
            <select
              value={filters.relationship}
              onChange={(e) => setFilters(f => ({ ...f, relationship: e.target.value }))}
              className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#1e3a5f]"
            >
              <option value="All">All</option>
              <option value="1">Retail</option>
              <option value="2">Institutional</option>
              <option value="3">Private Bank</option>
              <option value="4">Commercial</option>
            </select>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600">Tenure:</span>
            <select
              value={filters.timePeriod}
              onChange={(e) => setFilters(f => ({ ...f, timePeriod: e.target.value }))}
              className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#1e3a5f]"
            >
              <option value="All">All</option>
              <option value="< 5 Years">&lt; 5 Years</option>
              <option value="< 10 Years">&lt; 10 Years</option>
              <option value="< 20 Years">&lt; 20 Years</option>
              <option value="> 20 Years">&gt; 20 Years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Total Customers"
          value={formatNumber(quickMetrics.totalCustomers)}
          icon="👥"
          color="#1e3a5f"
        />
        <KPICard
          title="Avg CLV"
          value={formatCurrency(quickMetrics.avgCLV)}
          icon="💎"
          color="#1e3a5f"
        />
        <KPICard
          title="Total Revenue"
          value={formatCurrency(quickMetrics.totalRevenue)}
          icon="💰"
          color="#1e3a5f"
        />
        <KPICard
          title="Avg Risk"
          value={`${quickMetrics.avgRisk.toFixed(1)}/100`}
          icon="⚠️"
          color="#1e3a5f"
        />
      </div>

      {/* Customer Table */}
      <CustomerTable
        customers={displayedCustomers}
        onCustomerSelect={handleCustomerSelect}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {/* Detail Panel */}
      {selectedCustomer && (
        <CustomerDetailPanel
          customer={selectedCustomer}
          portfolioAverages={portfolioAverages}
          onClose={handleClosePanel}
        />
      )}
    </div>
  );
};

export default Customer360;
