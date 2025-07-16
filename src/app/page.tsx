"use client";

import { useState, useEffect } from "react";
import { Bitcoin, Calculator, TrendingUp, BarChart3, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import BTCRetirementSimulator from "@/components/BTCRetirementSimulator";
import ResultsDashboard from "@/components/ResultsDashboard";
import DipBuyPlanner from "@/components/DipBuyPlanner";
import CurrencySelector from "@/components/CurrencySelector";
import { useCurrency } from "@/lib/useCurrency";

// Import types from components
interface SimulationParams {
  targetYear: number;
  startingBTC: number;
  monthlyDCA: number;
  dcaGrowthRate: number;
  btcCAGR: number;
  currentYear: number;
  startMonth: number;
  withdrawalStartYear: number;
}

interface DipBuy {
  year: number;
  amount: number;
  btcPrice: number;
}

// Placeholder for WithdrawalPlanner
// function WithdrawalPlanner() {
//   return (
//     <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
//       <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
//         <DollarSign className="w-6 h-6 text-green-400" />
//         <span>Withdrawal Planner (Optional)</span>
//       </h3>
//       <p className="text-slate-300 mb-4">Plan your withdrawals here. (Feature coming soon!)</p>
//     </div>
//   );
// }

const steps = [
  { label: "Simulator", icon: Calculator, free: true },
  { label: "Dip Buy Planner", icon: TrendingUp, pro: true },
  // Removed Withdrawal Planner step
  { label: "Results", icon: BarChart3, pro: true },
];

export default function Home() {
  const isProUser = false; // Hardcoded for now
  const [step, setStep] = useState(0);
  const [currency, setCurrency] = useState("MYR");
  const [error, setError] = useState<string | null>(null);

  // State for each step
  const [simulatorState, setSimulatorState] = useState<SimulationParams | undefined>(undefined); // Will be set by child
  const [dipBuyState, setDipBuyState] = useState<DipBuy[] | undefined>(undefined);
  // Removed withdrawalState

  // Error boundary effect
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(event.error.message);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const { convert, format, loading: currencyLoading, rates } = useCurrency(currency);
  const safeConvert = convert || ((amount: number) => amount);
  const safeFormat = format || ((amount: number) => amount.toLocaleString());

  // Stepper UI
  function Stepper() {
    return (
      <div className="flex justify-center mb-8">
        {steps.map((s, i) => {
          const isActive = i === step;
          const isCompleted = i < step;
          const isLocked = s.pro && !isProUser;
          return (
            <div key={s.label} className="flex items-center">
              <div className={`flex flex-col items-center ${isActive ? 'text-orange-500' : isLocked ? 'text-slate-500' : 'text-slate-300'}`}> 
                <div className={`rounded-full w-10 h-10 flex items-center justify-center border-2 ${isActive ? 'border-orange-500' : isLocked ? 'border-slate-500' : 'border-slate-300'} bg-slate-900`}> 
                  {isCompleted ? <CheckCircle className="w-6 h-6 text-green-400" /> : <s.icon className="w-6 h-6" />} 
                </div>
                <span className="mt-2 text-xs font-semibold">{s.label}</span>
                {s.free && <span className="text-xs text-green-400 mt-1">Free</span>}
                {isLocked && <span className="text-xs text-orange-400 mt-1">Pro</span>}
              </div>
              {i < steps.length - 1 && <div className="w-8 h-1 bg-slate-700 mx-2 rounded" />}
            </div>
          );
        })}
      </div>
    );
  }

  // Step content logic
  let stepContent = null;
  if (step === 0) {
    stepContent = (
      <BTCRetirementSimulator
        currency={currency}
        convert={safeConvert}
        format={safeFormat}
        currencyLoading={currencyLoading}
        rates={rates}
        state={simulatorState}
        setState={setSimulatorState}
      />
    );
  } else if (step === 1) {
    if (!isProUser) {
      stepContent = (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 text-center">
          <h3 className="text-xl font-bold text-orange-500 mb-2">Pro Feature</h3>
          <p className="text-slate-300 mb-2">Dip Buy Planner is available for Pro users only.</p>
          <p className="text-slate-400 mb-4">(Coming Soon!)</p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg">Upgrade to Pro</button>
        </div>
      );
    } else {
      stepContent = (
        <DipBuyPlanner
          currency={currency}
          convert={safeConvert}
          format={safeFormat}
          currencyLoading={currencyLoading}
          state={dipBuyState}
          setState={setDipBuyState}
        />
      );
    }
  } else if (step === 2) {
    if (!isProUser) {
      stepContent = (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 text-center">
          <h3 className="text-xl font-bold text-orange-500 mb-2">Pro Feature</h3>
          <p className="text-slate-300 mb-2">Results are available for Pro users only.</p>
          <p className="text-slate-400 mb-4">(Coming Soon!)</p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg">Upgrade to Pro</button>
        </div>
      );
    } else {
      stepContent = (
        <ResultsDashboard
          currency={currency}
          convert={safeConvert}
          format={safeFormat}
          currencyLoading={currencyLoading}
        />
      );
    }
  }

  // Navigation logic
  const canGoBack = step > 0;
  const canGoNext = step < steps.length - 1 && (step !== 1 || isProUser) && (step !== 2 || isProUser);
  // Removed canSkip logic

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Bitcoin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">FutureSats.io</h1>
              <span className="text-slate-400 text-sm">BTC Retirement Planner</span>
            </div>
            <div className="flex items-center space-x-4">
              <CurrencySelector value={currency} onChange={setCurrency} />
              {currencyLoading && <span className="text-orange-400 text-sm">Loading rates...</span>}
              <button className="text-slate-300 hover:text-white transition-colors">
                Sign In
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                Get Pro
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Stepper />
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8">
            <h3 className="text-red-400 font-semibold mb-2">Error</h3>
            <p className="text-red-300 text-sm">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-red-400 hover:text-red-300 text-sm"
            >
              Dismiss
            </button>
          </div>
        )}
        <div className="space-y-8">
          {stepContent}
        </div>
        <div className="flex justify-between mt-8">
          <button
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${canGoBack ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            onClick={() => canGoBack && setStep(step - 1)}
            disabled={!canGoBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
          <div className="flex space-x-2">
            {canGoNext && (
              <button
                className="flex items-center px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
                onClick={() => setStep(step + 1)}
              >
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-400">
            <p>&copy; 2025 FutureSats.io - Built by Fiz @ F12.GG</p>
            <p className="text-sm mt-2">
              Plan your Bitcoin retirement with confidence
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
