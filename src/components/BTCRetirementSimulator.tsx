"use client";

import { useState, useEffect } from "react";
import { Bitcoin, Target, TrendingUp, DollarSign, Calendar, Calculator, Info, ChevronDown, X } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { fetchBTCData, updateCAGRModels, type BTCMarketData, type CAGRModel } from "@/lib/btcData";

// CAGR models and starting prices
const INITIAL_CAGR_MODELS: CAGRModel[] = [
  {
    name: "Model 1",
    cagr: [45.0, 43.8, 42.5, 41.3, 40.2, 39.1, 38.0, 36.9, 35.9, 34.9, 33.9, 33.0, 32.1, 31.2, 30.3, 29.5, 28.7, 27.9, 27.1, 26.3, 25.6, 24.9, 24.2, 23.5, 22.9, 22.2, 21.6, 21.0, 20.4, 19.9],
    startPrice: 64934,
    desc: "Most aggressive, smooth decrease from 45%"
  },
  {
    name: "Model 2",
    cagr: [40.0, 39.0, 38.0, 37.0, 36.0, 35.1, 34.2, 33.3, 32.5, 31.6, 30.8, 30.0, 29.3, 28.5, 27.8, 27.1, 26.4, 25.7, 25.1, 24.4, 23.8, 23.2, 22.6, 22.0, 21.4, 20.9, 20.3, 19.8, 19.3, 18.8],
    startPrice: 64934,
    desc: "Less aggressive, smooth decrease from 40%"
  },
  {
    name: "Model 3",
    cagr: [35.0, 34.2, 33.4, 32.6, 31.9, 31.1, 30.4, 29.7, 29.0, 28.3, 27.7, 27.0, 26.4, 25.8, 25.2, 24.6, 24.0, 23.5, 22.9, 22.4, 21.9, 21.3, 20.9, 20.4, 19.9, 19.4, 19.0, 18.5, 18.1, 17.7],
    startPrice: 64934,
    desc: "Moderate, smooth decrease from 35%"
  },
  {
    name: "Model 4",
    cagr: [30.0, 29.4, 28.8, 28.2, 27.6, 27.1, 26.5, 26.0, 25.4, 24.9, 24.4, 23.9, 23.4, 22.9, 22.5, 22.0, 21.6, 21.1, 20.7, 20.3, 19.9, 19.4, 19.0, 18.6, 18.3, 17.9, 17.5, 17.2, 16.8, 16.5],
    startPrice: 64934,
    desc: "Least aggressive, smooth decrease from 30%"
  },
  {
    name: "Model 5",
    cagr: [48.4, 44.9, 42.1, 39.2, 37.1, 34.8, 32.4, 31.2, 29.5, 28.7, 27.9, 26.9, 25.6, 24.5, 23.4, 22.2, 21.0, 19.8, 18.6, 17.7, 15.9, 15.1, 14.4, 13.6, 12.9, 12.3, 11.7, 11.1, 10.5, 10.0],
    startPrice: 100000,
    desc: "Power Law, most aggressive, starts at $100k"
  },
  {
    name: "Model 6",
    cagr: [48.8, 42.6, 39.2, 39.6, 37.0, 34.9, 31.3, 31.3, 29.5, 27.0, 25.7, 25.7, 24.6, 23.7, 22.7, 21.6, 20.6, 19.6, 18.6, 17.7, 16.8, 15.9, 15.1, 14.4, 13.6, 12.9, 12.3, 11.7, 11.1, 10.5],
    startPrice: 68000,
    desc: "Power Law, balanced, starts at $68k (default)"
  },
  {
    name: "Model 7",
    cagr: [50.0, 41.7, 39.2, 39.6, 36.6, 34.9, 31.4, 31.4, 29.4, 27.1, 25.7, 25.7, 24.6, 23.7, 22.8, 21.7, 20.4, 19.6, 18.6, 18.6, 17.7, 15.7, 15.7, 14.4, 14.4, 13.6, 12.9, 12.3, 11.1, 10.5],
    startPrice: 36000,
    desc: "Power Law, least aggressive, starts at $36k"
  },
];

const MODEL_DETAILS = `\
Models are categorized into two groups:\n\n1st category (Models 1-4):\nThese are CAGR (Compound Annual Growth Rate) models that start from different initial percentages and decrease smoothly over 30 years, ranging from the most aggressive (Model 1) to the least aggressive (Model 4).\nPrice calculations for these models begin with Bitcoin’s True Market Mean, currently at $64,934. This true market mean can be seen as bitcoin's current fair value, as bitcoin spends half the time above and half the time below this mean. We use this true market mean instead of the current Bitcoin price to reduce the impact of price volatility and produce more realistic results. This approach also provides a good average of Bitcoin’s 4-year bull and bear cycles, which I've found works well for these models.\n\n2nd category (Models 5-7):\nBased on the Power Law model, these models feature roughly similar CAGR percentages but with a slightly faster decreasing slope. The starting Bitcoin prices for each model, determined at the end of the last year, are: Model 5: $100,000, Model 6: $68,000, Model 7: $36,000. The default Model 6 is a nice mix.\n\nSee the info icon for more details on each model.`;

const WITHDRAWAL_MODELS = [
  { value: 'default', label: 'Default', desc: 'Decreasing slope from 10%→3% for first 20 years' },
  { value: 'fixed', label: 'Fixed', desc: 'Set a fixed withdrawal % for all years' },
  { value: 'custom', label: 'Custom Slope', desc: 'Set your own max/min % and duration for slope' },
  { value: 'none', label: 'No Withdrawal', desc: 'No withdrawals' },
];

interface SimulationParams {
  targetYear: number;
  startingBTC: number;
  monthlyDCA: number;
  dcaGrowthRate: number;
  btcCAGR: number;
  currentYear: number;
  startMonth: number; // 1-12
  withdrawalStartYear: number; // year withdrawals begin
}

interface BTCRetirementSimulatorProps {
  currency: string;
  convert: (amount: number, to: string) => number;
  format: (amount: number, to: string) => string;
  currencyLoading: boolean;
  rates: Record<string, number>;
  state?: any;
  setState?: (s: any) => void;
}

// Helper function for responsive font size
const getResponsiveFontSize = (value: string) => {
  if (!value) return 'text-2xl';
  const len = value.length;
  if (len > 12) return 'text-base';
  if (len > 10) return 'text-lg';
  if (len > 8) return 'text-xl';
  if (len > 6) return 'text-2xl';
  return 'text-3xl';
};

export default function BTCRetirementSimulator({ currency, convert, format, currencyLoading, rates, state, setState }: BTCRetirementSimulatorProps) {
  // Helper function to convert USD to any currency
  const convertUSDToSelectedCurrency = (usdAmount: number) => {
    if (currency === 'USD') {
      return usdAmount;
    }
    // Convert USD to MYR first, then to target currency
    // Since convert() expects MYR input: 1 USD = 1/rates.USD MYR
    const usdRate = rates.USD || 0.21; // Fallback to 0.21 if rates not available
    const usdToMyrRate = 1 / usdRate;
    const amountInMyr = usdAmount * usdToMyrRate;
    return convert(amountInMyr, currency);
  };
  const currentYear = new Date().getFullYear();
  const defaultParams = {
    targetYear: 2055,
    startingBTC: 1.0,
    monthlyDCA: 5000,
    dcaGrowthRate: 150,
    btcCAGR: 20,
    currentYear,
    startMonth: 1,
    withdrawalStartYear: 2035,
  };
  const [params, setParamsInternal] = useState(state || defaultParams);
  // Keep parent in sync
  const setParams = (val: any) => {
    setParamsInternal(val);
    setState && setState(val);
  };
  useEffect(() => {
    if (state) setParamsInternal(state);
  }, [state]);

  const [selectedModel, setSelectedModel] = useState(5); // Default to Model 6 (index 5)
  const [showModelModal, setShowModelModal] = useState(false);
  const [cagrMode, setCagrMode] = useState<'model' | 'custom'>('model');
  const [withdrawalModel, setWithdrawalModel] = useState('default');
  const [fixedWithdrawal, setFixedWithdrawal] = useState(5); // %
  const [customSlope, setCustomSlope] = useState({ max: 10, min: 3, years: 20 });
  const [showWithdrawalInfo, setShowWithdrawalInfo] = useState(false);
  const [showCAGRModal, setShowCAGRModal] = useState(false);
  const [btcData, setBtcData] = useState<BTCMarketData | null>(null);
  const [cagrModels, setCagrModels] = useState<CAGRModel[]>(INITIAL_CAGR_MODELS);
  const [isLoadingBTCData, setIsLoadingBTCData] = useState(false);

  // Fetch Bitcoin data on component mount
  useEffect(() => {
    const loadBTCData = async () => {
      setIsLoadingBTCData(true);
      try {
        let data = await fetchBTCData();
        
        // If no data is available, try to initialize it
        if (!data) {
          console.log('No Bitcoin data found, initializing...');
          try {
            const response = await fetch('/api/btc-data', { method: 'POST' });
            if (response.ok) {
              const result = await response.json();
              data = result.data;
              console.log('Bitcoin data initialized successfully');
            }
          } catch (initError) {
            console.error('Failed to initialize Bitcoin data:', initError);
          }
        }
        
        setBtcData(data);
        if (data) {
          const updatedModels = updateCAGRModels(INITIAL_CAGR_MODELS, data);
          setCagrModels(updatedModels);
        }
      } catch (error) {
        console.error('Failed to load Bitcoin data:', error);
      } finally {
        setIsLoadingBTCData(false);
      }
    };

    loadBTCData();
  }, []);

  const handleInputChange = (field: keyof typeof params, value: number) => {
    setParams({ ...params, [field]: value });
  };

  const getWithdrawalPct = (yearIdx: number, startIdx: number) => {
    if (withdrawalModel === 'none') return 0;
    if (withdrawalModel === 'fixed') return fixedWithdrawal;
    if (withdrawalModel === 'custom') {
      if (yearIdx < startIdx) return 0;
      const slope = (customSlope.max - customSlope.min) / Math.max(1, customSlope.years - 1);
      const n = yearIdx - startIdx;
      if (n < 0) return 0;
      if (n >= customSlope.years) return customSlope.min;
      return customSlope.max - slope * n;
    }
    // Default: 10%→3% over 20 years
    if (yearIdx < startIdx) return 0;
    const slope = (10 - 3) / 19;
    const n = yearIdx - startIdx;
    if (n < 0) return 0;
    if (n >= 20) return 3;
    return 10 - slope * n;
  };

  const calculateProjection = () => {
    const model = cagrModels[selectedModel];
    // Convert model start price to selected currency (model prices are in USD)
    const modelStartPriceInCurrency = convertUSDToSelectedCurrency(model.startPrice);
    let totalBTC = params.startingBTC;
    let totalInvested = 0;
    let currentDCA = params.monthlyDCA;
    let prevPortfolioValue = params.startingBTC * modelStartPriceInCurrency;
    let prevBTC = params.startingBTC;
    let prevPrincipal = prevPortfolioValue;
    let prevBTCPrice = modelStartPriceInCurrency;
    const projection = [];
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatDate = (day: number, month: number, year: number) => `${pad(day)}/${pad(month)}/${year}`;
    const startDay = 1;
    let startYear = params.currentYear;
    let startMonth = params.startMonth; // 1-12
    const retirementYear = params.targetYear;
    const withdrawalStartYear = params.withdrawalStartYear;
    const retirementDate = formatDate(startDay, startMonth, retirementYear);
    const withdrawalStartDate = formatDate(startDay, startMonth, withdrawalStartYear);
    const withdrawalStartIdx = params.withdrawalStartYear - params.currentYear;
    for (let i = 0, year = params.currentYear; year <= params.targetYear; year++, i++) {
      const cagr = (cagrMode === 'custom' ? params.btcCAGR : model.cagr[i]) ?? model.cagr[model.cagr.length - 1];
      const btcPrice = (i === 0)
        ? modelStartPriceInCurrency
        : prevBTCPrice * (1 + cagr / 100);
      const yearlyDCA = currentDCA * 12;
      const btcGained = yearlyDCA / btcPrice;
      totalBTC += btcGained;
      totalInvested += yearlyDCA;
      currentDCA += params.dcaGrowthRate;
      const rowStartDate = formatDate(startDay, startMonth, year);
      const rowEndDate = formatDate(28, startMonth, year);
      // Portfolio value before withdrawal
      const portfolioValue = totalBTC * btcPrice;
      // Portfolio return (gain from previous year)
      const portfolioReturn = i === 0 ? null : portfolioValue - prevPortfolioValue;
      // Withdrawal logic
      let withdrawalPct = getWithdrawalPct(i, withdrawalStartIdx);
      let withdrawalAmount = 0;
      if (withdrawalPct > 0) {
        withdrawalAmount = portfolioValue * (withdrawalPct / 100);
      }
      // Remaining principal and BTC after withdrawal
      const remainingPrincipal = portfolioValue - withdrawalAmount;
      const remainingBTC = totalBTC - (withdrawalAmount / btcPrice);
      // Save for next year
      prevPortfolioValue = remainingPrincipal;
      prevBTC = remainingBTC;
      prevPrincipal = remainingPrincipal;
      prevBTCPrice = btcPrice;
              // Push row
        projection.push({
          year,
          cagr,
          btcPrice: Math.round(btcPrice),
          withdrawalPct: withdrawalPct,
          portfolioReturn: portfolioReturn !== null ? portfolioReturn : portfolioValue - (params.startingBTC * modelStartPriceInCurrency),
        withdrawalAmount: withdrawalAmount,
        remainingPrincipal: remainingPrincipal,
        remainingBTC: remainingBTC,
        totalBTC: totalBTC,
        totalValue: remainingPrincipal,
        totalInvested: Math.round(totalInvested),
        yearlyDCA: Math.round(yearlyDCA),
        startDate: rowStartDate,
        endDate: rowEndDate,
        retirementDate: year === retirementYear ? retirementDate : '',
        withdrawalStartDate: year === withdrawalStartYear ? withdrawalStartDate : '',
      });
      totalBTC = remainingBTC;
    }
    return projection;
  };

  const projection = calculateProjection();
  const finalResult = projection.length > 0 ? projection[projection.length - 1] : null;

  return (
    <div className="space-y-8">
      {/* Bitcoin Data Status */}
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-slate-700/50 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Section - Status Info */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                <Bitcoin className="w-6 h-6 text-white" />
              </div>
              {isLoadingBTCData && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              )}
              {btcData && !isLoadingBTCData && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-white font-bold text-lg">Bitcoin Data Status</h4>
                {isLoadingBTCData ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                ) : btcData ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-green-400 font-semibold">LIVE</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-xs text-red-400 font-semibold">OFFLINE</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                {isLoadingBTCData ? (
                  <div className="text-sm text-yellow-400 font-medium">
                    🔄 Loading real-time data...
                  </div>
                ) : btcData ? (
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-400">Current Price:</span>
                        <span className="text-lg font-bold text-green-400">
                          {currencyLoading ? '...' : format(convertUSDToSelectedCurrency(btcData.currentPrice), currency)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-400">Market Cap:</span>
                        <span className="text-sm font-semibold text-blue-400">
                          {currencyLoading ? '...' : (() => {
                            const marketCapInSelectedCurrency = convertUSDToSelectedCurrency(btcData.marketCap);
                            const trillions = marketCapInSelectedCurrency / 1e12;
                            return `${currency === 'USD' ? '$' : currency === 'MYR' ? 'RM' : ''}${trillions.toFixed(2)}T`;
                          })()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-400">24h Volume:</span>
                        <span className="text-sm font-semibold text-purple-400">
                          {currencyLoading ? '...' : (() => {
                            const volumeInSelectedCurrency = convertUSDToSelectedCurrency(btcData.volume);
                            const billions = volumeInSelectedCurrency / 1e9;
                            return `${currency === 'USD' ? '$' : currency === 'MYR' ? 'RM' : ''}${billions.toFixed(2)}B`;
                          })()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500">Last Updated:</span>
                      <span className="text-xs text-slate-400">
                        {(() => {
                          const d = new Date(btcData.lastUpdated);
                          const day = String(d.getDate()).padStart(2, '0');
                          const month = String(d.getMonth() + 1).padStart(2, '0');
                          const year = d.getFullYear();
                          const hours = String(d.getHours()).padStart(2, '0');
                          const minutes = String(d.getMinutes()).padStart(2, '0');
                          const seconds = String(d.getSeconds()).padStart(2, '0');
                          return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
                        })()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-red-400 font-medium">
                    ⚠️ Using static data (real-time data unavailable)
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Section - Action Button */}
          <div className="flex items-center space-x-3">
            {btcData && (
              <div className="text-right">
                <div className="text-xs text-slate-500">Data Source</div>
                <div className="text-xs font-semibold text-orange-400">CoinGecko API</div>
              </div>
            )}
            
            <button
              onClick={async () => {
                setIsLoadingBTCData(true);
                try {
                  await fetch('/api/btc-data', { method: 'POST' });
                  const data = await fetchBTCData();
                  setBtcData(data);
                  if (data) {
                    const updatedModels = updateCAGRModels(INITIAL_CAGR_MODELS, data);
                    setCagrModels(updatedModels);
                  }
                } catch (error) {
                  console.error('Failed to update Bitcoin data:', error);
                } finally {
                  setIsLoadingBTCData(false);
                }
              }}
              disabled={isLoadingBTCData}
              className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:from-orange-500/50 disabled:to-amber-600/50 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg disabled:shadow-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative flex items-center space-x-2">
                {isLoadingBTCData ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-sm">Updating...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Refresh Data</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
        
        {/* Bottom Section - Additional Info */}
        {btcData && (
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-slate-400">Real-time pricing active</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-slate-400">Models updated with live data</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-slate-400">Auto-refresh every 24 hours</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CAGR Mode Radio Group */}
      {/* <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              className="accent-orange-500"
              checked={cagrMode === 'model'}
              onChange={() => setCagrMode('model')}
            />
            <span className="text-slate-300 font-semibold">CAGR Model</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              className="accent-orange-500"
              checked={cagrMode === 'custom'}
              onChange={() => setCagrMode('custom')}
            />
            <span className="text-slate-300 font-semibold">Custom CAGR</span>
          </label>
        </div>
      </div> */}
      {/* Model Modal */}
      {showModelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-900 rounded-xl p-8 max-w-lg w-full border border-slate-700 shadow-xl relative max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-slate-400 hover:text-orange-400"
              onClick={() => setShowModelModal(false)}
              title="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-white mb-4">Models Detailed Explanations</h2>
            <pre className="text-slate-300 whitespace-pre-wrap text-sm mb-4">{MODEL_DETAILS}</pre>
            <div className="space-y-2">
              {cagrModels.map((m: CAGRModel, i: number) => (
                <div key={m.name} className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                  <span className="font-semibold text-orange-400">{m.name}:</span> <span className="text-slate-300">{m.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Input Form */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Calculator className="w-6 h-6 text-orange-500" />
          <span>BTC Retirement Parameters</span>
        </h3>
        {/* Parameter Controls Row */}
        <div className="flex flex-col md:flex-row md:items-end md:space-x-6 space-y-4 md:space-y-0 mb-8">
          {/* CAGR Mode and Model/Custom */}
          <div className="flex-1 min-w-[220px]">
            <div className="flex items-center space-x-4 mb-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  className="accent-orange-500"
                  checked={cagrMode === 'model'}
                  onChange={() => setCagrMode('model')}
                />
                <span className="text-slate-300 font-semibold">CAGR Model</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  className="accent-orange-500"
                  checked={cagrMode === 'custom'}
                  onChange={() => setCagrMode('custom')}
                />
                <span className="text-slate-300 font-semibold">Custom CAGR</span>
              </label>
            </div>
            {cagrMode === 'model' && (
              <div className="flex items-center space-x-2">
                <label className="text-slate-300 font-semibold">Model:</label>
                <div className="relative w-40">
                  <select
                    className="appearance-none w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
                    value={selectedModel}
                    onChange={e => setSelectedModel(Number(e.target.value))}
                  >
                    {cagrModels.map((m: CAGRModel, i: number) => (
                      <option key={m.name} value={i}>{m.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <button
                  className="flex items-center text-slate-400 hover:text-orange-400 transition-colors"
                  onClick={() => setShowModelModal(true)}
                  title="Model Details"
                >
                  <Info className="w-5 h-5 ml-1" />
                </button>
              </div>
            )}
            {cagrMode === 'custom' && (
              <div className="flex items-center space-x-2 mt-2">
                <label className="text-slate-300 font-semibold">Custom CAGR (%)</label>
                <input
                  type="number"
                  value={params.btcCAGR}
                  onChange={(e) => handleInputChange('btcCAGR', parseFloat(e.target.value))}
                  className="w-24 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            )}
          </div>
          {/* Withdrawal Model */}
          <div className="flex-1 min-w-[220px]">
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
              Withdrawal Model
              <span className="ml-1 relative group">
                <Info className="w-4 h-4 text-slate-400 hover:text-orange-400 cursor-pointer" onMouseEnter={() => setShowWithdrawalInfo(true)} onMouseLeave={() => setShowWithdrawalInfo(false)} />
                {showWithdrawalInfo && (
                  <div className="absolute z-20 left-1/2 -translate-x-1/2 mt-2 w-64 bg-slate-900 text-slate-100 text-xs rounded-lg shadow-lg p-3 border border-slate-700">
                    {WITHDRAWAL_MODELS.map(m => (
                      <div key={m.value} className="mb-2 last:mb-0">
                        <span className="font-semibold text-orange-400">{m.label}:</span> <span>{m.desc}</span>
                      </div>
                    ))}
                  </div>
                )}
              </span>
            </label>
            <div className="relative w-40">
              <select
                className="appearance-none w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
                value={withdrawalModel}
                onChange={e => setWithdrawalModel(e.target.value)}
              >
                {WITHDRAWAL_MODELS.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {/* Fixed Withdrawal % input */}
            {withdrawalModel === 'fixed' && (
              <div className="mt-2 flex items-center space-x-2">
                <label className="text-slate-300 font-semibold">Fixed %</label>
                <input
                  type="number"
                  value={fixedWithdrawal}
                  onChange={e => setFixedWithdrawal(Number(e.target.value))}
                  className="w-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            )}
            {/* Custom Slope inputs */}
            {withdrawalModel === 'custom' && (
              <div className="mt-2 flex flex-wrap gap-2 items-center">
                <div>
                  <label className="text-slate-300 font-semibold">Max %</label>
                  <input
                    type="number"
                    value={customSlope.max}
                    onChange={e => setCustomSlope(s => ({ ...s, max: Number(e.target.value) }))}
                    className="w-16 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold">Min %</label>
                  <input
                    type="number"
                    value={customSlope.min}
                    onChange={e => setCustomSlope(s => ({ ...s, min: Number(e.target.value) }))}
                    className="w-16 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold">Years</label>
                  <input
                    type="number"
                    value={customSlope.years}
                    onChange={e => setCustomSlope(s => ({ ...s, years: Number(e.target.value) }))}
                    className="w-16 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="1"
                    max="100"
                    step="1"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Main Parameter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Target Year */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Target Retirement Year
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                value={params.targetYear}
                onChange={(e) => handleInputChange('targetYear', parseInt(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min={currentYear + 1}
                max={2100}
              />
            </div>
          </div>
          {/* Start Month */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-slate-400" /> Start Month
            </label>
            <div className="relative">
              <select
                value={params.startMonth}
                onChange={e => handleInputChange('startMonth', parseInt(e.target.value))}
                className="appearance-none w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i+1} value={i+1}>{new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}</option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          {/* Withdrawal Start Year */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-slate-400" /> Withdrawal Start Year
            </label>
            <div className="relative">
              <select
                value={params.withdrawalStartYear}
                onChange={e => handleInputChange('withdrawalStartYear', parseInt(e.target.value))}
                className="appearance-none w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
              >
                {Array.from({length: params.targetYear - params.currentYear + 1}, (_, i) => params.currentYear + i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          {/* Starting BTC */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Starting BTC Amount
            </label>
            <div className="relative">
              <Bitcoin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                step="0.01"
                value={params.startingBTC}
                onChange={(e) => handleInputChange('startingBTC', parseFloat(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          {/* Monthly DCA */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Monthly DCA ({currency})
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                value={params.monthlyDCA}
                onChange={(e) => handleInputChange('monthlyDCA', parseInt(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          {/* DCA Growth Rate */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              DCA Growth Rate (RM/month)
            </label>
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                value={params.dcaGrowthRate}
                onChange={(e) => handleInputChange('dcaGrowthRate', parseInt(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="bg-gradient-to-br from-slate-800/70 to-purple-900/60 rounded-2xl p-8 border border-slate-700/50 shadow-xl">
        <h3 className="text-2xl font-bold text-white mb-6">Projection Summary</h3>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-between items-stretch">
          {/* Retirement BTC Card */}
          <div className="flex-1 min-w-[180px] bg-slate-900/60 rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
            <div className="text-slate-300 text-base font-medium mb-2 text-center">Retirement BTC - {params.targetYear}</div>
            <div className={`font-extrabold text-orange-400 tracking-tight text-center ${getResponsiveFontSize(projection.find(row => row.year === params.targetYear)?.totalBTC.toFixed(2) || '0.00')}`}>{(() => {
              const retirementYearRow = projection.find(row => row.year === params.targetYear);
              return retirementYearRow ? retirementYearRow.totalBTC.toFixed(2) : '0.00';
            })()} <span className="text-lg font-bold">BTC</span></div>
          </div>
          {/* Year of Withdrawal BTC Card */}
          <div className="flex-1 min-w-[180px] bg-slate-900/60 rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
            <div className="text-slate-300 text-base font-medium mb-2 text-center">Year of Withdrawal BTC - {params.withdrawalStartYear}</div>
            <div className={`font-extrabold text-orange-400 tracking-tight text-center ${getResponsiveFontSize(projection.find(row => row.year === params.withdrawalStartYear)?.totalBTC.toFixed(2) || '0.00')}`}>{(() => {
              const withdrawalYearRow = projection.find(row => row.year === params.withdrawalStartYear);
              return withdrawalYearRow ? withdrawalYearRow.totalBTC.toFixed(2) : '0.00';
            })()} <span className="text-lg font-bold">BTC</span></div>
          </div>
          {/* Portfolio Value */}
          <div className="flex-1 min-w-[180px] bg-slate-900/60 rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
            <div className="text-slate-300 text-base font-medium mb-2 text-center">Portfolio Value</div>
            <div className={`font-extrabold text-green-400 text-center w-full px-2 break-words ${getResponsiveFontSize(currencyLoading ? '' : format(finalResult?.totalValue || 0, currency))}`}>
              {currencyLoading ? '...' : format(finalResult?.totalValue || 0, currency)}
            </div>
          </div>
          {/* Total Invested */}
          <div className="flex-1 min-w-[180px] bg-slate-900/60 rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
            <div className="text-slate-300 text-base font-medium mb-2 text-center">Total Invested</div>
            <div className={`font-extrabold text-blue-400 text-center w-full px-2 break-words ${getResponsiveFontSize(currencyLoading ? '' : format(convert(finalResult?.totalInvested || 0, currency), currency))}`}>
              {currencyLoading ? '...' : format(convert(finalResult?.totalInvested || 0, currency), currency)}
            </div>
          </div>
          {/* ROI Multiplier */}
          <div className="flex-1 min-w-[180px] bg-slate-900/60 rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
            <div className="text-slate-300 text-base font-medium mb-2 text-center">ROI Multiplier</div>
            <div className={`font-extrabold text-purple-400 tracking-tight text-center ${getResponsiveFontSize(finalResult ? (finalResult.totalValue / finalResult.totalInvested).toFixed(1) : '0.0')}`}>{finalResult ? (finalResult.totalValue / finalResult.totalInvested).toFixed(1) : '0.0'}<span className="text-lg font-bold">x</span></div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Modeled Price vs Remaining BTC */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <h4 className="text-white text-base font-semibold mb-2">Modeled Price vs Remaining BTC</h4>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={projection} margin={{ top: 10, right: 60, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="year" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <YAxis yAxisId="left" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} domain={[dataMin => Math.floor(dataMin), dataMax => Math.ceil(dataMax)]} tickFormatter={v => v.toLocaleString()} />
              <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} domain={[dataMin => Math.floor(dataMin * 100) / 100, dataMax => Math.ceil(dataMax * 100) / 100]} />
              <Tooltip formatter={(value, name) => [typeof value === 'number' ? value.toLocaleString() : value, name]} />
              <Legend />
              <ReferenceLine x={params.targetYear} stroke="#EC4899" strokeDasharray="4 2" label={{ value: `Retirement Year (${params.targetYear})`, fill: '#EC4899', fontWeight: 600, fontSize: 12, position: 'right' }} />
              <ReferenceLine x={params.withdrawalStartYear} stroke="#14B8A6" strokeDasharray="4 2" label={{ value: `Withdrawal Start (${params.withdrawalStartYear})`, fill: '#14B8A6', fontWeight: 600, fontSize: 12, position: 'right' }} />
              <Line yAxisId="left" type="monotone" dataKey="btcPrice" name="Modeled Price" stroke="#6366F1" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="remainingBTC" name="Remaining BTC" stroke="#F59E0B" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* CAGR over Years */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <h4 className="text-white text-base font-semibold mb-2">CAGR over Years</h4>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={projection} margin={{ top: 10, right: 60, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="year" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} domain={[dataMin => Math.floor(dataMin), dataMax => Math.ceil(dataMax)]} tickFormatter={v => v + '%'} />
              <Tooltip formatter={(value, name) => [typeof value === 'number' ? value.toFixed(1) + '%' : value, name]} />
              <Legend />
              <ReferenceLine x={params.targetYear} stroke="#EC4899" strokeDasharray="4 2" label={{ value: `Retirement Year (${params.targetYear})`, fill: '#EC4899', fontWeight: 600, fontSize: 12, position: 'right' }} />
              <ReferenceLine x={params.withdrawalStartYear} stroke="#14B8A6" strokeDasharray="4 2" label={{ value: `Withdrawal Start (${params.withdrawalStartYear})`, fill: '#14B8A6', fontWeight: 600, fontSize: 12, position: 'right' }} />
              <Line type="monotone" dataKey="cagr" name="CAGR" stroke="#6366F1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Withdrawal Percentage over Years */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <h4 className="text-white text-base font-semibold mb-2">Withdrawal Percentage over Years</h4>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={projection} margin={{ top: 10, right: 60, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="year" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} domain={[0, 10]} tickFormatter={v => v + '%'} />
              <Tooltip formatter={(value, name) => [typeof value === 'number' ? value.toFixed(1) + '%' : value, name]} />
              <Legend />
              <ReferenceLine x={params.targetYear} stroke="#EC4899" strokeDasharray="4 2" label={{ value: `Retirement Year (${params.targetYear})`, fill: '#EC4899', fontWeight: 600, fontSize: 12, position: 'right' }} />
              <ReferenceLine x={params.withdrawalStartYear} stroke="#14B8A6" strokeDasharray="4 2" label={{ value: `Withdrawal Start (${params.withdrawalStartYear})`, fill: '#14B8A6', fontWeight: 600, fontSize: 12, position: 'right' }} />
              <Line type="monotone" dataKey="withdrawalPct" name="Withdrawal %" stroke="#3B82F6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Portfolio Value vs Total Invested Over Time */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <h4 className="text-white text-base font-semibold mb-2">Portfolio Value vs Total Invested</h4>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={projection.map(row => ({
              ...row,
              portfolioValue: currencyLoading ? 0 : row.totalValue,
              totalInvested: currencyLoading ? 0 : convert(row.totalInvested, currency),
            }))} margin={{ top: 10, right: 60, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="year" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickFormatter={v => v.toLocaleString()} />
              <Tooltip formatter={(value, name) => [typeof value === 'number' ? format(value, currency) : value, name]} />
              <Legend />
              <ReferenceLine x={params.targetYear} stroke="#EC4899" strokeDasharray="4 2" label={{ value: `Retirement Year (${params.targetYear})`, fill: '#EC4899', fontWeight: 600, fontSize: 12, position: 'right' }} />
              <ReferenceLine x={params.withdrawalStartYear} stroke="#14B8A6" strokeDasharray="4 2" label={{ value: `Withdrawal Start (${params.withdrawalStartYear})`, fill: '#14B8A6', fontWeight: 600, fontSize: 12, position: 'right' }} />
              <Line type="monotone" dataKey="portfolioValue" name="Portfolio Value" stroke="#22C55E" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="totalInvested" name="Total Invested" stroke="#3B82F6" strokeWidth={2} dot={false} strokeDasharray="6 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Yearly Breakdown Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Yearly Breakdown</h3>
          <button
            onClick={() => setShowCAGRModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm"
            title="View Bitcoin CAGR vs Traditional Assets"
          >
            <Info className="w-4 h-4" />
            <span>Bitcoin Historical CAGR</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-3 px-4 text-slate-300">Year</th>
                <th className="text-right py-3 px-4 text-slate-300">CAGR</th>
                <th className="text-right py-3 px-4 text-slate-300">Modeled Price</th>
                <th className="text-right py-3 px-4 text-slate-300">Withdrawal %</th>
                <th className="text-right py-3 px-4 text-slate-300">Portfolio Return</th>
                <th className="text-right py-3 px-4 text-slate-300">Withdrawal Amount</th>
                <th className="text-right py-3 px-4 text-slate-300">Remaining Principal</th>
                <th className="text-right py-3 px-4 text-slate-300">Remaining BTC</th>
                <th className="text-right py-3 px-4 text-slate-300">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {projection.map((row) => {
                // Color logic
                const isRetirement = !!row.retirementDate;
                const isWithdrawal = !!row.withdrawalStartDate;
                const yearClass = isRetirement
                  ? 'text-pink-400 font-bold'
                  : isWithdrawal
                  ? 'text-teal-400 font-bold'
                  : 'text-white font-medium';
                const dateClass = (type: 'start' | 'end') =>
                  isRetirement
                    ? 'text-pink-400 font-bold'
                    : isWithdrawal
                    ? 'text-teal-400 font-bold'
                    : 'text-slate-300';
                return (
                  <tr key={row.year} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                    <td className={`py-3 px-4 ${yearClass}`}>{row.year}</td>
                    <td className="py-3 px-4 text-right text-slate-300">{row.cagr.toFixed(1)}%</td>
                    <td className="py-3 px-4 text-right text-slate-300">{currencyLoading ? '...' : format(row.btcPrice, currency)}</td>
                    <td className="py-3 px-4 text-right text-slate-300">{row.withdrawalPct ? row.withdrawalPct.toFixed(1) + '%' : '0.0%'}</td>
                    <td className="py-3 px-4 text-right text-green-400">{currencyLoading ? '...' : format(row.portfolioReturn, currency)}</td>
                    <td className="py-3 px-4 text-right text-orange-400">{currencyLoading ? '...' : format(row.withdrawalAmount, currency)}</td>
                    <td className="py-3 px-4 text-right text-blue-400">{currencyLoading ? '...' : format(row.remainingPrincipal, currency)}</td>
                    <td className="py-3 px-4 text-right text-purple-400">{row.remainingBTC.toFixed(8)}</td>
                    <td className="py-3 px-4 text-right text-slate-300">{currencyLoading ? '...' : format(row.totalValue, currency)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Legend */}
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 rounded bg-pink-400 inline-block"></span>
            <span className="text-slate-300 text-sm">Retirement Year</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 rounded bg-teal-400 inline-block"></span>
            <span className="text-slate-300 text-sm">Withdrawal Starting Year</span>
          </div>
        </div>
      </div>

      {/* CAGR Modal */}
      {showCAGRModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white">Bitcoin & Traditional Assets CAGR</h2>
              <button
                onClick={() => setShowCAGRModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Time Period</th>
                      <th className="text-center py-3 px-4 text-orange-400 font-semibold">Bitcoin</th>
                      <th className="text-center py-3 px-4 text-yellow-400 font-semibold">Gold</th>
                      <th className="text-center py-3 px-4 text-blue-400 font-semibold">S&P 500</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { period: "1 year:", bitcoin: "+110%", gold: "+10%", sp500: "+25%" },
                      { period: "2 year:", bitcoin: "+15%", gold: "+3%", sp500: "+8%" },
                      { period: "3 year:", bitcoin: "-3%", gold: "+4%", sp500: "+9%" },
                      { period: "4 year:", bitcoin: "+52%", gold: "+5%", sp500: "+11%" },
                      { period: "5 year:", bitcoin: "+68%", gold: "+9%", sp500: "+12%" },
                      { period: "6 year:", bitcoin: "+30%", gold: "+7%", sp500: "+11%" },
                      { period: "7 year:", bitcoin: "+73%", gold: "+7%", sp500: "+11%" },
                      { period: "8 year:", bitcoin: "+82%", gold: "+7%", sp500: "+13%" },
                      { period: "9 year:", bitcoin: "+82%", gold: "+6%", sp500: "+10%" },
                      { period: "10 year:", bitcoin: "+56%", gold: "+4%", sp500: "+11%" },
                      { period: "11 year:", bitcoin: "+97%", gold: "+2%", sp500: "+12%" },
                      { period: "12 year:", bitcoin: "+116%", gold: "+1%", sp500: "+11%" },
                      { period: "13 year:", bitcoin: "+131%", gold: "+3%", sp500: "+11%" },
                      { period: "14 year:", bitcoin: "+229%", gold: "+4%", sp500: "+11%" },
                    ].map((row, index) => (
                      <tr key={index} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                        <td className="py-3 px-4 text-slate-300 font-medium">{row.period}</td>
                        <td className={`py-3 px-4 text-center font-semibold ${row.bitcoin.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>
                          {row.bitcoin}
                        </td>
                        <td className="py-3 px-4 text-center text-green-400 font-semibold">{row.gold}</td>
                        <td className="py-3 px-4 text-center text-green-400 font-semibold">{row.sp500}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 space-y-4 text-slate-300">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">What is it:</h3>
                  <p className="text-sm leading-relaxed">
                    This shows bitcoin's Compound Annual Growth Rate (CAGR) vs other assets over various 
                    timeframes. For example this is showing that bitcoin has returned 155% on average, every year, for the past 5 
                    years, while gold has returned 7% on average each year over the same period.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Why it matters:</h3>
                  <p className="text-sm leading-relaxed">
                    As with the historical bitcoin price table, we see bitcoin's extreme outperformance vs other 
                    assets here as well. These CAGR numbers solidify bitcoin's status as the best performing financial asset in 
                    history.
                  </p>
                </div>
                
                <div className="text-xs text-slate-400 mt-4 pt-4 border-t border-slate-700">
                  <p>Data Source: Messari.io, bitcoincharts.com</p>
                  <p>Source: https://casebitcoin.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 