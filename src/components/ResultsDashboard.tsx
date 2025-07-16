"use client";

import { useState, useEffect } from "react";
import { BarChart3, Download, PieChart, TrendingUp, Bitcoin } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend } from "recharts";
import { downloadRetirementBlueprint } from "@/lib/pdfExport";

interface ChartData {
  year: number;
  btcAccumulated: number;
  portfolioValue: number;
  totalInvested: number;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

interface ResultsDashboardProps {
  currency: string;
  convert: (amount: number, to: string) => number;
  format: (amount: number, to: string) => string;
  currencyLoading: boolean;
}

export default function ResultsDashboard({ currency, convert, format, currencyLoading }: ResultsDashboardProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [pieData, setPieData] = useState<PieData[]>([]);


  // Generate sample data for demonstration
  useEffect(() => {
    const generateData = () => {
      const data: ChartData[] = [];
      let btcAccumulated = 1.0;
      let totalInvested = 0;
      let monthlyDCA = 5000;
      
      for (let year = 2025; year <= 2055; year++) {
        const yearlyDCA = monthlyDCA * 12;
        const btcPrice = Math.pow(1.2, year - 2025) * 50000; // 20% CAGR
        const btcGained = yearlyDCA / btcPrice;
        
        btcAccumulated += btcGained;
        totalInvested += yearlyDCA;
        monthlyDCA += 150; // Growth rate
        
        // Add dip buys for specific years
        if (year === 2039) {
          const dipBTC = 1000000 / 150000;
          btcAccumulated += dipBTC;
          totalInvested += 1000000;
        }
        if (year === 2043) {
          const dipBTC = 1500000 / 200000;
          btcAccumulated += dipBTC;
          totalInvested += 1500000;
        }
        if (year === 2047) {
          const dipBTC = 2000000 / 250000;
          btcAccumulated += dipBTC;
          totalInvested += 2000000;
        }
        
        data.push({
          year,
          btcAccumulated: parseFloat(btcAccumulated.toFixed(4)),
          portfolioValue: Math.round(btcAccumulated * btcPrice),
          totalInvested: Math.round(totalInvested),
        });
      }
      
      setChartData(data);
      
      // Generate pie chart data
      const finalYear = data[data.length - 1];
      setPieData([
        { name: 'DCA Investment', value: finalYear.totalInvested - 4500000, color: '#3B82F6' },
        { name: 'Dip Buys', value: 4500000, color: '#EF4444' },
        { name: 'Starting BTC', value: 50000, color: '#F59E0B' },
      ]);
    };
    
    generateData();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold">Year: {label}</p>
          {payload[0] && payload[0].value !== undefined && (
            <p className="text-orange-400">BTC: {Number(payload[0].value).toFixed(4)}</p>
          )}
          {payload[1] && payload[1].value !== undefined && (
            <p className="text-green-400">Value: {currencyLoading ? '...' : format(convert(Number(payload[1].value), currency), currency)}</p>
          )}
          {payload[2] && payload[2].value !== undefined && (
            <p className="text-blue-400">Invested: {currencyLoading ? '...' : format(convert(Number(payload[2].value), currency), currency)}</p>
          )}
        </div>
      );
    }
    return null;
  };

  const finalResult = chartData.length > 0 ? chartData[chartData.length - 1] : null;

  return (
    <div className="space-y-8">
      {/* Summary Cards - Bento Layout */}
      <div className="w-full overflow-x-auto">
        <div className="flex flex-row gap-4 min-w-[2000px]">
          {/* Card 1: Total BTC */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 flex-1 min-w-[400px] flex flex-col items-center justify-center">
            <p className="text-slate-400 text-base md:text-lg text-center mb-2 whitespace-nowrap">Total BTC</p>
            <p className="font-bold text-orange-500 text-center whitespace-nowrap truncate text-2xl lg:text-3xl w-full">
              {finalResult?.btcAccumulated.toFixed(2)} BTC
            </p>
            <Bitcoin className="w-12 h-12 text-orange-500 ml-4" />
          </div>
          {/* Card 2: Portfolio Value */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 flex-1 min-w-[400px] flex flex-col items-center justify-center">
            <p className="text-slate-400 text-sm text-center mb-2 whitespace-nowrap">Portfolio Value</p>
            <p className="text-green-500 text-center whitespace-nowrap w-full" style={{ fontWeight: 400, fontSize: '14px', lineHeight: 1.2 }}>
              {currencyLoading ? '...' : format(convert(finalResult?.portfolioValue ?? 0, currency), currency)}
            </p>
            <TrendingUp className="w-8 h-8 text-green-500 mt-2" />
          </div>
          {/* Card 3: Total Invested */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 flex-1 min-w-[400px] flex flex-col items-center justify-center">
            <p className="text-slate-400 text-sm text-center mb-2 whitespace-nowrap">Total Invested</p>
            <p className="text-blue-500 text-center whitespace-nowrap w-full" style={{ fontWeight: 400, fontSize: '14px', lineHeight: 1.2 }}>
              {currencyLoading ? '...' : format(convert(finalResult?.totalInvested ?? 0, currency), currency)}
            </p>
            <BarChart3 className="w-8 h-8 text-blue-500 mt-2" />
          </div>
          {/* Card 4: ROI Multiplier */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 flex-1 min-w-[400px] flex flex-col items-center justify-center">
            <p className="text-slate-400 text-sm text-center mb-2 whitespace-nowrap">ROI Multiplier</p>
            <p className="font-bold text-purple-500 text-center whitespace-nowrap truncate text-lg lg:text-xl w-full">
              {finalResult ? (finalResult.portfolioValue / finalResult.totalInvested).toFixed(1) : 0}x
            </p>
            <PieChart className="w-8 h-8 text-purple-500 mt-2" />
          </div>
        </div>
      </div>

      {/* BTC Accumulation Chart */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">BTC Accumulation Over Time</h3>
          <button 
            onClick={() => {
              const plan = {
                name: "My 2055 BTC Retirement",
                targetYear: 2055,
                startingBTC: 1.0,
                monthlyDCA: 5000,
                dcaGrowthRate: 150,
                btcCAGR: 20,
                finalBTC: finalResult?.btcAccumulated,
                finalValue: finalResult?.portfolioValue,
                totalInvested: finalResult?.totalInvested,
                roiMultiplier: finalResult ? finalResult.portfolioValue / finalResult.totalInvested : 0,
              };
              const dipBuys = [
                { year: 2039, amount: 1000000, btcPrice: 150000 },
                { year: 2043, amount: 1500000, btcPrice: 200000 },
                { year: 2047, amount: 2000000, btcPrice: 250000 },
              ];
              downloadRetirementBlueprint(plan, dipBuys, chartData);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData.length > 0 ? chartData.map(row => ({
              ...row,
              portfolioValue: currencyLoading ? 0 : convert(row.portfolioValue, currency),
              totalInvested: currencyLoading ? 0 : convert(row.totalInvested, currency),
            })) : []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="year" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                yAxisId="left"
              />
              <YAxis 
                orientation="right" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                yAxisId="right"
              />
                             <Tooltip content={<CustomTooltip />} />
               <Legend />
              <Line 
                type="monotone" 
                dataKey="btcAccumulated" 
                stroke="#F59E0B" 
                strokeWidth={3}
                yAxisId="left"
                name="BTC Accumulated"
              />
                             <Line 
                 type="monotone" 
                 dataKey="portfolioValue" 
                 stroke="#10B981" 
                 strokeWidth={3}
                 yAxisId="right"
                 name="Portfolio Value"
               />
               <Line 
                 type="monotone" 
                 dataKey="totalInvested" 
                 stroke="#3B82F6" 
                 strokeWidth={2}
                 yAxisId="right"
                 name="Total Invested"
               />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Investment Allocation Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-6">Capital Allocation</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieData.map(d => ({ ...d, value: currencyLoading ? 0 : convert(d.value, currency) }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [currencyLoading ? '...' : format(value, currency), 'Amount']}
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strategy Breakdown */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-6">Strategy Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-white">DCA Investment</span>
              </div>
              <span className="text-blue-400 font-semibold">
                {currencyLoading ? '...' : format(convert((finalResult?.totalInvested || 0) - 4500000, currency), currency)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-white">Strategic Dip Buys</span>
              </div>
              <span className="text-red-400 font-semibold">
                {currencyLoading ? '...' : format(convert(4500000, currency), currency)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-white">Starting BTC Value</span>
              </div>
              <span className="text-orange-400 font-semibold">
                {currencyLoading ? '...' : format(convert(50000, currency), currency)}
              </span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <h4 className="text-green-400 font-semibold mb-2">🎯 Goal Achievement</h4>
            <p className="text-slate-300 text-sm">
              You're on track to reach {finalResult?.btcAccumulated.toFixed(1)} BTC by 2055, 
              exceeding the 5 BTC retirement goal!
            </p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-bold text-white mb-6">Performance Metrics</h3>
        <div className="flex flex-col md:flex-row justify-between items-stretch gap-6 min-h-[120px]">
          <div className="flex-1 flex flex-col justify-center items-center min-w-0">
            <div className="text-4xl md:text-5xl font-extrabold text-green-500 mb-2 break-words">
              {finalResult ? ((finalResult.portfolioValue / finalResult.totalInvested - 1) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-slate-400 text-base md:text-lg">Total Return</div>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center min-w-0">
            <div className="text-4xl md:text-5xl font-extrabold text-blue-500 mb-2 break-words">
              {finalResult ? (finalResult.portfolioValue / finalResult.totalInvested).toFixed(1) : 0}x
            </div>
            <div className="text-slate-400 text-base md:text-lg">Portfolio Multiplier</div>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center min-w-0">
            <div className="text-4xl md:text-5xl font-extrabold text-purple-500 mb-2 break-words">
              {finalResult ? (finalResult.btcAccumulated / 5 * 100).toFixed(0) : 0}%
            </div>
            <div className="text-slate-400 text-base md:text-lg">Goal Progress (5 BTC)</div>
          </div>
        </div>
      </div>




    </div>
  );
} 