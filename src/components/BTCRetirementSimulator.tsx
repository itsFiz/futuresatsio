"use client";

import { useState, useEffect } from "react";
import { Bitcoin, TrendingUp, DollarSign, Calendar, Calculator, Info, ChevronDown, X } from "lucide-react";
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
  {
    name: "Model 8",
    cagr: [40.0, 39.0, 38.0, 37.0, 36.0, 35.0, 34.0, 33.0, 32.0, 31.0, 30.0, 29.0, 28.0, 27.0, 26.0, 25.0, 24.0, 23.0, 22.0, 21.0, 20.0, 19.0, 18.0, 17.0, 16.0, 15.0, 14.0, 13.0, 12.0, 10.0],
    startPrice: 0, // Placeholder, will use current price
    desc: "Most aggressive CAGR with current live Bitcoin price (highest volatility, not recommended for long-term planning)"
  },
  {
    name: "Model 9",
    cagr: [25.0, 24.2, 23.4, 22.6, 21.9, 21.1, 20.4, 19.7, 19.0, 18.3, 17.7, 17.0, 16.4, 15.8, 15.2, 14.6, 14.0, 13.5, 12.9, 12.4, 11.9, 11.4, 10.9, 10.4, 9.9, 9.4, 9.0, 8.5, 8.1, 7.7],
    startPrice: 0, // Will use current price
    desc: "Moderate CAGR with current live Bitcoin price (less volatile than Model 8)"
  },
  {
    name: "Model 10",
    cagr: [20.0, 19.4, 18.8, 18.2, 17.6, 17.1, 16.5, 16.0, 15.4, 14.9, 14.4, 13.9, 13.4, 12.9, 12.4, 11.9, 11.4, 10.9, 10.4, 9.9, 9.4, 8.9, 8.4, 7.9, 7.4, 6.9, 6.4, 5.9, 5.4, 4.9],
    startPrice: 0, // Will use current price
    desc: "Conservative CAGR with current live Bitcoin price (most conservative real-time model)"
  },
];

const MODEL_DETAILS = `\
Models are categorized into three groups:\n\n1st category (Models 1-4):\nThese are CAGR (Compound Annual Growth Rate) models that start from different initial percentages and decrease smoothly over 30 years, ranging from the most aggressive (Model 1) to the least aggressive (Model 4).\nPrice calculations for these models begin with Bitcoin's True Market Mean, currently at $64,934. This true market mean can be seen as bitcoin's current fair value, as bitcoin spends half the time above and half the time below this mean. We use this true market mean instead of the current Bitcoin price to reduce the impact of price volatility and produce more realistic results. This approach also provides a good average of Bitcoin's 4-year bull and bear cycles, which I've found works well for these models.\n\n2nd category (Models 5-7):\nBased on the Power Law model, these models feature roughly similar CAGR percentages but with a slightly faster decreasing slope. The starting Bitcoin prices for each model, determined at the end of the last year, are: Model 5: $100,000, Model 6: $68,000, Model 7: $36,000. The default Model 6 is a nice mix.\n\n3rd category (Models 8-10):\nThese models use the current live Bitcoin price as the starting point. Model 8 has the most aggressive CAGR (starts at 40%), Model 9 offers moderate CAGR (starts at 25%), and Model 10 provides the most conservative CAGR (starts at 20%). These models are more volatile due to using real-time pricing but provide options for different risk tolerances.\n\nSee the info icon for more details on each model.`;

// Enhanced model details with categories and aggressiveness levels
const MODEL_CATEGORIES = [
  {
    name: "True Market Mean Models",
    description: "Start from Bitcoin's True Market Mean ($64,934) - fair value that smooths out volatility",
    models: [
      { index: 0, name: "Apex", aggressiveness: "Most Aggressive", color: "text-red-400", bgColor: "bg-red-400/10", borderColor: "border-red-400/30" },
      { index: 1, name: "Cipher", aggressiveness: "Aggressive", color: "text-orange-400", bgColor: "bg-orange-400/10", borderColor: "border-orange-400/30" },
      { index: 2, name: "Vector", aggressiveness: "Moderate", color: "text-yellow-400", bgColor: "bg-yellow-400/10", borderColor: "border-yellow-400/30" },
      { index: 3, name: "Matrix", aggressiveness: "Conservative", color: "text-green-400", bgColor: "bg-green-400/10", borderColor: "border-green-400/30" }
    ]
  },
  {
    name: "Power Law Models", 
    description: "Based on Power Law theory with different starting prices and steeper CAGR decline",
    models: [
      { index: 4, name: "Neural", aggressiveness: "Most Aggressive", color: "text-red-400", bgColor: "bg-red-400/10", borderColor: "border-red-400/30", startPrice: "$100,000" },
      { index: 5, name: "Synth", aggressiveness: "Balanced (Default)", color: "text-blue-400", bgColor: "bg-blue-400/10", borderColor: "border-blue-400/30", startPrice: "$68,000" },
      { index: 6, name: "Core", aggressiveness: "Conservative", color: "text-green-400", bgColor: "bg-green-400/10", borderColor: "border-green-400/30", startPrice: "$36,000" }
    ]
  },
  {
    name: "Current Price Models",
    description: "Uses the current live Bitcoin price as the starting point. Models 9-10 have more conservative CAGR values.",
    models: [
      { index: 7, name: "Flux", aggressiveness: "Aggressive (Live)", color: "text-red-400", bgColor: "bg-pink-400/10", borderColor: "border-pink-400/30", isCurrentPrice: true },
      { index: 8, name: "Pulse", aggressiveness: "Moderate (Live)", color: "text-yellow-400", bgColor: "bg-yellow-400/10", borderColor: "border-yellow-400/30", isCurrentPrice: true },
      { index: 9, name: "Wave", aggressiveness: "Conservative (Live)", color: "text-green-400", bgColor: "bg-green-400/10", borderColor: "border-green-400/30", isCurrentPrice: true }
    ]
  },
  {
    name: "Community Models",
    description: "User-submitted models with unique thesis and approaches to Bitcoin price modeling.",
    models: [
      { index: 10, name: "Submit Your Model", aggressiveness: "Community", color: "text-purple-400", bgColor: "bg-purple-400/10", borderColor: "border-purple-400/30", isSubmitButton: true }
    ]
  }
];

const COMPARISON_DETAILS = `\
How the 2 categories compare:\n\nBoth categories include models across the aggressive and conservative spectrum. However, the comparison between the two depends on expectations regarding the pace of Bitcoin price appreciation.\n\nFor example:\n• Models 1 and 5 are comparable and represent the most aggressive options. Model 1 starts slower, while Model 5 starts faster; however, both are similar in the middle stages, and Model 1 ends up much higher in later years.\n• Models 2 and 6 are also comparable; Model 2 starts slower while Model 6 starts faster, both peaking similarly in the middle stages, with Model 2 ending higher as its CAGR remains on the higher side.\n• Models 4 and 7 are the most conservative, with differences in how quickly the price increases.\n\nThe default Model 6, which utilizes a more conservative median line of the Power Law, offers a balanced mix. It presents reasonable but not excessive prices in the initial years, when Bitcoin is still early in the adoption curve. Additionally, it features a faster decrease with diminishing returns in later years, ensuring that the results remain conservative for retirement planning purposes.`;

const WITHDRAWAL_MODELS = [
  { value: 'default', label: 'Default', desc: 'Decreasing slope from 10%→3% for first 20 years' },
  { value: 'fixed', label: 'Fixed', desc: 'Set a fixed withdrawal % for all years' },
  { value: 'custom', label: 'Custom Slope', desc: 'Set your own max/min % and duration for slope' },
  { value: 'none', label: 'No Withdrawal', desc: 'No withdrawals' },
];

const CAGR_EXPLANATION = `\
Decreasing CAGR (Compound Annual Growth Rate) Model

Better to use CAGR than yearly returns to smooth volatility in calculations.

For example: a 24% CAGR over 4 years is the same as +100% for 3 years and -70% in the 4th year.

CAGR provides a consistent, smoothed growth rate that accounts for the compound effect of volatility over time, making long-term projections more realistic and easier to understand.`;

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
  state?: SimulationParams;
  setState?: (s: SimulationParams) => void;
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
  const setParams = (val: SimulationParams) => {
    setParamsInternal(val);
    if (setState) {
      setState(val);
    }
  };
  useEffect(() => {
    if (state) setParamsInternal(state);
  }, [state]);

  const [selectedModel, setSelectedModel] = useState(5); // Default to Model 6 (index 5)
  const [showModelModal, setShowModelModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [cagrMode, setCagrMode] = useState<'model' | 'fixed' | 'customSlope'>('model');
  const [withdrawalModel, setWithdrawalModel] = useState('default');
  const [fixedWithdrawal, setFixedWithdrawal] = useState(5); // %
  const [customSlope, setCustomSlope] = useState({ max: 10, min: 3, years: 20 });
  const [showWithdrawalInfo, setShowWithdrawalInfo] = useState(false);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const [showCAGRInfo, setShowCAGRInfo] = useState(false);
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

  const handleInputChange = (field: keyof SimulationParams, value: number) => {
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
    // Use current price for Models 8, 9, 10 (indices 7, 8, 9), otherwise use model's startPrice
    // Models 1-4 (indices 0-3) use True Market Mean ($64,934)
    // Models 5-7 (indices 4-6) use their specific startPrice values
    const modelStartPriceInCurrency = ((selectedModel >= 7 && selectedModel <= 9) && btcData)
      ? convertUSDToSelectedCurrency(btcData.currentPrice)
      : convertUSDToSelectedCurrency(model.startPrice);
    let totalBTC = params.startingBTC;
    let totalInvested = 0;
    let currentDCA = params.monthlyDCA;
    let prevPortfolioValue = params.startingBTC * modelStartPriceInCurrency;
    let prevBTCPrice = modelStartPriceInCurrency;
    const projection = [];
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatDate = (day: number, month: number, year: number) => `${pad(day)}/${pad(month)}/${year}`;
    const startDay = 1;
    const startMonth = params.startMonth; // 1-12
    const retirementYear = params.targetYear;
    const withdrawalStartYear = params.withdrawalStartYear;
    const retirementDate = formatDate(startDay, startMonth, retirementYear);
    const withdrawalStartDate = formatDate(startDay, startMonth, withdrawalStartYear);
    const withdrawalStartIdx = params.withdrawalStartYear - params.currentYear;
    for (let i = 0, year = params.currentYear; year <= params.targetYear; year++, i++) {
      const cagr = (cagrMode === 'customSlope' ? params.btcCAGR : model.cagr[i]) ?? model.cagr[model.cagr.length - 1];
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
      const withdrawalPct = getWithdrawalPct(i, withdrawalStartIdx);
      let withdrawalAmount = 0;
      if (withdrawalPct > 0) {
        withdrawalAmount = portfolioValue * (withdrawalPct / 100);
      }
      // Remaining principal and BTC after withdrawal
      const remainingPrincipal = portfolioValue - withdrawalAmount;
      const remainingBTC = totalBTC - (withdrawalAmount / btcPrice);
      // Save for next year
      prevPortfolioValue = remainingPrincipal;
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
              {cagrModels.map((m: CAGRModel) => (
                <div key={m.name} className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                  <span className="font-semibold text-orange-400">{m.name}:</span> <span className="text-slate-300">{m.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparisonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-900 rounded-xl p-8 max-w-4xl w-full border border-slate-700 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-slate-400 hover:text-orange-400"
              onClick={() => setShowComparisonModal(false)}
              title="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">Model Categories Comparison</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* True Market Mean Models */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-orange-400 mb-4">True Market Mean Models</h3>
                <div className="space-y-3">
                  <div className="text-slate-300 text-sm mb-4">
                    Start from Bitcoin&apos;s True Market Mean ($64,934) - fair value that smooths out volatility and provides a good average of Bitcoin&apos;s 4-year bull and bear cycles.
                  </div>
                  <div className="space-y-2">
                    {MODEL_CATEGORIES[0].models.map((model) => (
                      <div key={model.name} className={`p-3 rounded-lg border ${model.borderColor} ${model.bgColor}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`font-bold ${model.color}`}>{model.name}</div>
                            <div className="text-slate-300 text-sm">{model.aggressiveness}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-slate-400 text-sm">Start: $64,934</div>
                            <div className="text-slate-400 text-xs">1 BTC</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Power Law Models */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Power Law Models</h3>
                <div className="space-y-3">
                  <div className="text-slate-300 text-sm mb-4">
                    Based on Power Law theory with different starting prices and steeper CAGR decline. Features faster decrease with diminishing returns in later years.
                  </div>
                  <div className="space-y-2">
                    {MODEL_CATEGORIES[1].models.map((model) => (
                      <div key={model.name} className={`p-3 rounded-lg border ${model.borderColor} ${model.bgColor}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`font-bold ${model.color}`}>{model.name}</div>
                            <div className="text-slate-300 text-sm">{model.aggressiveness}</div>
                          </div>
                                                     <div className="text-right">
                             <div className="text-slate-400 text-sm">Start: {'startPrice' in model ? model.startPrice : '$64,934'}</div>
                             <div className="text-slate-400 text-xs">1 BTC</div>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Details */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">How Categories Compare</h3>
              <pre className="text-slate-300 whitespace-pre-wrap text-sm">{COMPARISON_DETAILS}</pre>
            </div>

            {/* Quick Reference Table */}
            <div className="mt-6 bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Quick Reference</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left py-2 px-3 text-slate-300">Category</th>
                      <th className="text-left py-2 px-3 text-slate-300">Models</th>
                      <th className="text-left py-2 px-3 text-slate-300">Start Price (1 BTC)</th>
                      <th className="text-left py-2 px-3 text-slate-300">CAGR Slope</th>
                      <th className="text-left py-2 px-3 text-slate-300">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-700/30">
                      <td className="py-2 px-3 text-orange-400 font-semibold">True Market Mean</td>
                      <td className="py-2 px-3 text-slate-300">1-4</td>
                      <td className="py-2 px-3 text-slate-300">$64,934</td>
                      <td className="py-2 px-3 text-slate-300">Smooth, slow drop</td>
                      <td className="py-2 px-3 text-slate-300">Cycle-averaged, fair-value</td>
                    </tr>
                    <tr className="border-b border-slate-700/30">
                      <td className="py-2 px-3 text-blue-400 font-semibold">Power Law</td>
                      <td className="py-2 px-3 text-slate-300">5-7</td>
                      <td className="py-2 px-3 text-slate-300">$100k, $68k, $36k</td>
                      <td className="py-2 px-3 text-slate-300">Steeper drop</td>
                      <td className="py-2 px-3 text-slate-300">Trend-based, conservative</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
                  checked={cagrMode === 'fixed'}
                  onChange={() => setCagrMode('fixed')}
                />
                <span className="text-slate-300 font-semibold">Fixed CAGR</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  className="accent-orange-500"
                  checked={cagrMode === 'customSlope'}
                  onChange={() => setCagrMode('customSlope')}
                />
                <span className="text-slate-300 font-semibold">Custom Slope</span>
              </label>
              <span className="relative group">
                <Info 
                  className="w-4 h-4 text-slate-400 hover:text-orange-400 cursor-pointer transition-colors" 
                  onMouseEnter={() => setShowCAGRInfo(true)} 
                  onMouseLeave={() => setShowCAGRInfo(false)}
                />
                {showCAGRInfo && (
                  <div className="absolute z-20 left-1/2 -translate-x-1/2 mt-2 w-80 bg-slate-900 text-slate-100 text-xs rounded-lg shadow-lg p-3 border border-slate-700">
                    <pre className="whitespace-pre-wrap">{CAGR_EXPLANATION}</pre>
                  </div>
                )}
              </span>
            </div>
            {cagrMode === 'model' && (
              <div className="space-y-4">
                {/* Model Categories */}
                <div className="space-y-3">
                  {MODEL_CATEGORIES.map((category, categoryIndex) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-slate-200 font-semibold text-sm">{category.name}</h4>
                          <p className="text-slate-400 text-xs">{category.description}</p>
                        </div>
                        {categoryIndex === 0 && (
                          <button
                            onClick={() => setShowComparisonModal(true)}
                            className="text-xs text-orange-400 hover:text-orange-300 transition-colors underline"
                          >
                            Compare Categories
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {category.models.map((model) => (
                          <button
                            key={model.name}
                            onClick={() => {
                              if ('isSubmitButton' in model && model.isSubmitButton) {
                                window.location.href = '/submit-model';
                              } else {
                                setSelectedModel(model.index);
                              }
                            }}
                            className={`relative p-3 rounded-lg border transition-all duration-200 ${
                              'isSubmitButton' in model && model.isSubmitButton
                                ? 'bg-purple-500/20 border-purple-400/50 hover:bg-purple-500/30 hover:border-purple-400/70'
                                : selectedModel === model.index
                                ? `${model.bgColor} ${model.borderColor} border-2 ring-2 ring-orange-500/50`
                                : 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50'
                            }`}
                          >
                            <div className="text-center space-y-1">
                              <div className={`font-bold text-sm ${model.color}`}>
                                {model.name}
                              </div>
                              <div className="text-xs text-slate-300">
                                {model.aggressiveness}
                              </div>
                              {'startPrice' in model && model.startPrice && (
                                <div className="text-xs text-slate-400">
                                  {model.startPrice}
                                </div>
                              )}
                              {selectedModel === model.index && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Current Model Info */}
                <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">
                        Selected: {cagrModels[selectedModel]?.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {cagrModels[selectedModel]?.desc}
                      </div>
                      {/* Show warning for current price models */}
                      {(selectedModel >= 7 && selectedModel <= 9) && (
                        <div className="mt-2 text-xs text-pink-400 font-semibold flex items-center gap-1">
                          <Info className="w-4 h-4 inline-block mr-1" />
                          This model uses the current live Bitcoin price. Results may be volatile and are not recommended for long-term planning.
                        </div>
                      )}
                    </div>
                    <span className="relative group">
                      <Info 
                        className="w-4 h-4 text-slate-400 hover:text-orange-400 cursor-pointer transition-colors" 
                        onMouseEnter={() => setShowModelInfo(true)} 
                        onMouseLeave={() => setShowModelInfo(false)}
                      />
                      {showModelInfo && (
                        <div className="absolute z-20 left-1/2 -translate-x-1/2 mt-2 w-80 bg-slate-900 text-slate-100 text-xs rounded-lg shadow-lg p-3 border border-slate-700">
                          {selectedModel >= 0 && selectedModel <= 3 ? (
                            <>
                              <div className="font-semibold text-orange-400 mb-2">True Market Mean Models (1-4)</div>
                              <div className="space-y-2">
                                <div>
                                  <span className="font-semibold text-slate-300">Start Price:</span> $64,934 (True Market Mean)
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-300">Rationale:</span> Bitcoin&apos;s fair value that smooths out volatility. Bitcoin spends half the time above and half below this mean.
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-300">CAGR Pattern:</span> Smooth decrease from initial percentage over 30 years
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-300">Best For:</span> Long-term retirement planning with stable projections
                                </div>
                                <div className="mt-3 pt-2 border-t border-slate-600">
                                  <div className="text-xs text-slate-400">
                                    <span className="font-semibold">Why CAGR?</span> CAGR smooths volatility - a 24% CAGR over 4 years equals +100% for 3 years and -70% in year 4.
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : selectedModel >= 4 && selectedModel <= 6 ? (
                            <>
                              <div className="font-semibold text-blue-400 mb-2">Power Law Models (5-7)</div>
                              <div className="space-y-2">
                                <div>
                                  <span className="font-semibold text-slate-300">Start Price:</span> $100k, $68k, $36k (Model specific)
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-300">Rationale:</span> Based on Power Law theory with steeper CAGR decline
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-300">CAGR Pattern:</span> Faster decrease with diminishing returns in later years
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-300">Best For:</span> Trend-based, conservative retirement planning
                                </div>
                                <div className="mt-3 pt-2 border-t border-slate-600">
                                  <div className="text-xs text-slate-400">
                                    <span className="font-semibold">Why CAGR?</span> CAGR smooths volatility - a 24% CAGR over 4 years equals +100% for 3 years and -70% in year 4.
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : selectedModel >= 7 && selectedModel <= 9 ? (
                            <>
                              <div className="font-semibold text-pink-400 mb-2">Current Price Models (8-10)</div>
                              <div className="space-y-2">
                                <div>
                                  <span className="font-semibold text-slate-300">Start Price:</span> Current live Bitcoin price
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-300">Rationale:</span> Uses real-time pricing for immediate market conditions
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-300">CAGR Pattern:</span> Various conservative to aggressive slopes
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-300">Best For:</span> Short-term planning (not recommended for long-term)
                                </div>
                                <div className="mt-3 pt-2 border-t border-slate-600">
                                  <div className="text-xs text-slate-400">
                                    <span className="font-semibold">Why CAGR?</span> CAGR smooths volatility - a 24% CAGR over 4 years equals +100% for 3 years and -70% in year 4.
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="text-slate-300">Select a model to see details</div>
                          )}
                        </div>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {cagrMode === 'fixed' && (
              <div className="flex items-center space-x-2 mt-2">
                <label className="text-slate-300 font-semibold">Fixed CAGR (%)</label>
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
            {cagrMode === 'customSlope' && (
              <div className="flex items-center space-x-2 mt-2">
                <label className="text-slate-300 font-semibold">Custom Slope</label>
                <div className="flex flex-wrap gap-2 items-center">
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
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Projection Summary</h3>
          {cagrMode === 'model' && (
            <div className="flex items-center space-x-2">
              <div className="text-xs text-slate-400">Model:</div>
              <div className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/50 border border-slate-600">
                {(() => {
                  const category = MODEL_CATEGORIES.find(cat => 
                    cat.models.some(model => model.index === selectedModel)
                  );
                  const model = category?.models.find(m => m.index === selectedModel);
                  return `${model?.name} (${category?.name === 'True Market Mean Models' ? 'TMM' : 'PL'})`;
                })()}
              </div>
            </div>
          )}
        </div>
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
                    This shows bitcoin&apos;s Compound Annual Growth Rate (CAGR) vs other assets over various 
                    timeframes. For example this is showing that bitcoin has returned 155% on average, every year, for the past 5 
                    years, while gold has returned 7% on average each year over the same period.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Why it matters:</h3>
                  <p className="text-sm leading-relaxed">
                    As with the historical bitcoin price table, we see bitcoin&apos;s extreme outperformance vs other 
                    assets here as well. These CAGR numbers solidify bitcoin&apos;s status as the best performing financial asset in 
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