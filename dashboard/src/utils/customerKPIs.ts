import type { BankingRecord } from './dataLoader';

// Risk category interface
export interface RiskCategory {
  label: string;
  color: string;
}

// Net position interface
export interface NetPosition {
  value: number;
  type: string;
}

// Enriched customer with all calculated KPIs
export interface EnrichedCustomer extends BankingRecord {
  lifetimeFees: number;
  annualFeeRevenue: number;
  feeRevenue

Rate: number;
  feeOptimization: number;
  loanDepositSpread: number;
  revenuePerProduct: number;
  tenureYears: number;
  clv: number;
  productCount: number;
  crossSellOpportunity: number;
  walletShare: number;
  loyaltyScore: number;
  riskCategory: RiskCategory;
  riskAdjustedRevenue: number;
  debtToIncome: number;
  netPosition: NetPosition;
  liquidityRatio: number;
  assetBackingRatio: number;
}

// Portfolio averages for comparison
export interface PortfolioAverages {
  avgCLV: number;
  avgRisk: number;
  avgFees: number;
  avgProductCount: number;
  avgWalletShare: number;
  avgDebtToIncome: number;
  avgLiquidityRatio: number;
  avgTenure: number;
}

// ========== PRIORITY 1: PROFITABILITY & EFFICIENCY KPIs ==========

// 1. Customer Lifetime Fees
export function calculateCustomerLifetimeFees(customer: BankingRecord): number {
  return customer['Total Fees'] || 0;
}

// 2. Annual Fee Revenue
export function calculateAnnualFeeRevenue(customer: BankingRecord): number {
  const engagementDays = customer['Engagement Days'] || 1;
  const totalFees = customer['Total Fees'] || 0;
  return (totalFees / engagementDays) * 365;
}

// 3. Fee Revenue Rate
export function calculateFeeRevenueRate(customer: BankingRecord): number {
  const feeStructure = customer['Fee Structure'];
  if (feeStructure === 'High') return 5;
  if (feeStructure === 'Mid') return 3;
  if (feeStructure === 'Low') return 1;
  return 0;
}

// 4. Fee Optimization Potential
export function calculateFeeOptimization(customer: BankingRecord): number {
  const currentFees = customer['Total Fees'] || 0;
  const totalLoan = customer['Total Loan'] || 0;
  const totalDeposit = customer['Total Deposit'] || 0;
  const potentialRevenue = (totalLoan + totalDeposit) * 0.05; // 5% if High tier
  return Math.max(0, potentialRevenue - currentFees);
}

// 5. Loan-Deposit Spread
export function calculateLoanDepositSpread(customer: BankingRecord): number {
  const totalLoan = customer['Total Loan'] || 0;
  const totalDeposit = customer['Total Deposit'] || 0;
  const loanRevenue = totalLoan * 0.045; // 4.5% lending rate
  const depositCost = totalDeposit * 0.015; // 1.5% deposit cost
  return loanRevenue - depositCost;
}

// 6. Revenue per Product
export function calculateRevenuePerProduct(customer: BankingRecord): number {
  const productCount = calculateProductCount(customer);
  const totalFees = customer['Total Fees'] || 0;
  return productCount > 0 ? totalFees / productCount : 0;
}

// ========== PRIORITY 2: CUSTOMER VALUE & ENGAGEMENT KPIs ==========

// 7. Customer Tenure
export function calculateCustomerTenure(customer: BankingRecord): number {
  const engagementDays = customer['Engagement Days'] || 0;
  return engagementDays / 365;
}

// 8. Customer Lifetime Value (CLV)
export function calculateCLV(customer: BankingRecord): number {
  const tenureYears = calculateCustomerTenure(customer);
  const avgAnnualDeposit = tenureYears > 0 ? (customer['Total Deposit'] || 0) / tenureYears : 0;
  const depositValue = avgAnnualDeposit * 5; // 5-year projection
  const totalFees = customer['Total Fees'] || 0;
  const loanValue = (customer['Total Loan'] || 0) * 0.03; // 3% loan contribution
  return depositValue + totalFees + loanValue;
}

// 9. Product Count
export function calculateProductCount(customer: BankingRecord): number {
  let count = 0;
  if ((customer['Bank Loans'] || 0) > 0) count++;
  if ((customer['Bank Deposits'] || 0) > 0) count++;
  if ((customer['Checking Accounts'] || 0) > 0) count++;
  if ((customer['Saving Accounts'] || 0) > 0) count++;
  if ((customer['Foreign Currency Account'] || 0) > 0) count++;
  if ((customer['Business Lending'] || 0) > 0) count++;
  count += customer['Amount of Credit Cards'] || 0;
  return count;
}

// 10. Cross-Sell Opportunity
export function calculateCrossSellOpportunity(customer: BankingRecord): number {
  const maxProducts = 7;
  const currentProducts = calculateProductCount(customer);
  return ((maxProducts - currentProducts) / maxProducts) * 100;
}

// 11. Wallet Share
export function calculateWalletShare(customer: BankingRecord): number {
  const totalDeposit = customer['Total Deposit'] || 0;
  const estimatedIncome = customer['Estimated Income'] || 1;
  return Math.min((totalDeposit / estimatedIncome) * 100, 999);
}

// 12. Loyalty Score
export function calculateLoyaltyScore(customer: BankingRecord): number {
  const loyalty = customer['Loyalty Classification'];
  if (loyalty === 'Platinum') return 4;
  if (loyalty === 'Gold') return 3;
  if (loyalty === 'Silver') return 2;
  if (loyalty === 'Jade') return 1;
  return 0;
}

// ========== PRIORITY 3: ADVANCED RISK METRICS ==========

// 13. Risk Score & Category
export function getRiskCategory(riskScore: number): RiskCategory {
  if (riskScore <= 25) {
    return { label: 'Low Risk', color: 'green' };
  } else if (riskScore <= 50) {
    return { label: 'Moderate Risk', color: 'yellow' };
  } else if (riskScore <= 75) {
    return { label: 'High Risk', color: 'red' };
  } else {
    return { label: 'Critical Risk', color: 'red' };
  }
}

// 14. Risk-Adjusted Revenue
export function calculateRiskAdjustedRevenue(customer: BankingRecord): number {
  const totalFees = customer['Total Fees'] || 0;
  const riskWeighting = customer['Risk Weighting'] || 1;
  return totalFees / (riskWeighting / 100);
}

// 15. Debt-to-Income Ratio
export function calculateDebtToIncome(customer: BankingRecord): number {
  const totalLoan = customer['Total Loan'] || 0;
  const estimatedIncome = customer['Estimated Income'] || 1;
  return (totalLoan / estimatedIncome) * 100;
}

// ========== PRIORITY 4: PORTFOLIO HEALTH INDICATORS ==========

// 16. Net Position
export function calculateNetPosition(customer: BankingRecord): NetPosition {
  const totalDeposit = customer['Total Deposit'] || 0;
  const totalLoan = customer['Total Loan'] || 0;
  const value = totalDeposit - totalLoan;
  const type = value >= 0 ? 'Net Depositor' : 'Net Borrower';
  return { value, type };
}

// 17. Liquidity Ratio
export function calculateLiquidityRatio(customer: BankingRecord): number {
  const totalDeposit = customer['Total Deposit'] || 0;
  const totalLoan = customer['Total Loan'] || 1;
  return totalLoan > 0 ? totalDeposit / totalLoan : 999;
}

// 18. Asset Backing Ratio
export function calculateAssetBackingRatio(customer: BankingRecord): number {
  const propertiesValue = (customer['Properties Owned'] || 0) * 500000; // Assume $500K per property
  const superSavings = customer['Superannuation Savings'] || 0;
  const totalAssets = propertiesValue + superSavings;
  const totalLoan = customer['Total Loan'] || 1;
  return totalLoan > 0 ? (totalAssets / totalLoan) * 100 : 100;
}

// ========== ENRICHMENT FUNCTION ==========

// Master enrichment function
export function enrichCustomerData(customer: BankingRecord): EnrichedCustomer {
  return {
    ...customer,
    lifetimeFees: calculateCustomerLifetimeFees(customer),
    annualFeeRevenue: calculateAnnualFeeRevenue(customer),
    feeRevenueRate: calculateFeeRevenueRate(customer),
    feeOptimization: calculateFeeOptimization(customer),
    loanDepositSpread: calculateLoanDepositSpread(customer),
    revenuePerProduct: calculateRevenuePerProduct(customer),
    tenureYears: calculateCustomerTenure(customer),
    clv: calculateCLV(customer),
    productCount: calculateProductCount(customer),
    crossSellOpportunity: calculateCrossSellOpportunity(customer),
    walletShare: calculateWalletShare(customer),
    loyaltyScore: calculateLoyaltyScore(customer),
    riskCategory: getRiskCategory(customer['Risk Weighting'] || 0),
    riskAdjustedRevenue: calculateRiskAdjustedRevenue(customer),
    debtToIncome: calculateDebtToIncome(customer),
    netPosition: calculateNetPosition(customer),
    liquidityRatio: calculateLiquidityRatio(customer),
    assetBackingRatio: calculateAssetBackingRatio(customer),
  };
}

// ========== PORTFOLIO AVERAGES ==========

// Calculate portfolio averages for comparison
export function calculatePortfolioAverages(customers: BankingRecord[]): PortfolioAverages {
  if (customers.length === 0) {
    return {
      avgCLV: 0,
      avgRisk: 0,
      avgFees: 0,
      avgProductCount: 0,
      avgWalletShare: 0,
      avgDebtToIncome: 0,
      avgLiquidityRatio: 0,
      avgTenure: 0,
    };
  }

  const enrichedCustomers = customers.map(enrichCustomerData);

  return {
    avgCLV: enrichedCustomers.reduce((sum, c) => sum + c.clv, 0) / customers.length,
    avgRisk: enrichedCustomers.reduce((sum, c) => sum + (c['Risk Weighting'] || 0), 0) / customers.length,
    avgFees: enrichedCustomers.reduce((sum, c) => sum + c.lifetimeFees, 0) / customers.length,
    avgProductCount: enrichedCustomers.reduce((sum, c) => sum + c.productCount, 0) / customers.length,
    avgWalletShare: enrichedCustomers.reduce((sum, c) => sum + c.walletShare, 0) / customers.length,
    avgDebtToIncome: enrichedCustomers.reduce((sum, c) => sum + c.debtToIncome, 0) / customers.length,
    avgLiquidityRatio: enrichedCustomers.reduce((sum, c) => sum + (c.liquidityRatio < 100 ? c.liquidityRatio : 0), 0) / customers.length,
    avgTenure: enrichedCustomers.reduce((sum, c) => sum + c.tenureYears, 0) / customers.length,
  };
}
