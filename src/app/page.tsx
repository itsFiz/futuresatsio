"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bitcoin, Calculator, TrendingUp, BarChart3, CheckCircle, ArrowRight, ArrowLeft, Menu, X } from "lucide-react";
import Link from "next/link";
import BTCRetirementSimulator from "@/components/BTCRetirementSimulator";
import ResultsDashboard from "@/components/ResultsDashboard";
import DipBuyPlanner from "@/components/DipBuyPlanner";
import CurrencySelector from "@/components/CurrencySelector";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { useCurrency } from "@/lib/useCurrency";
import { useSession, signOut } from "next-auth/react";

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
  { label: "Withdrawal & Retirement Simulator", icon: Calculator, free: true },
  { label: "Bearish Halving Dip Buy Planner", icon: TrendingUp, pro: true },
  // Removed Withdrawal Planner step
  { label: "Comprehensive Dashboard Results", icon: BarChart3, pro: true },
];

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isProUser = false; // Hardcoded for now
  const [step, setStep] = useState(0);
  const [currency, setCurrency] = useState("MYR");
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State for each step
  const [simulatorState, setSimulatorState] = useState<SimulationParams | undefined>(undefined); // Will be set by child
  const [dipBuyState, setDipBuyState] = useState<DipBuy[] | undefined>(undefined);
  // Removed withdrawalState

  // Admin redirection effect
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      router.push("/admin");
    }
  }, [status, session, router]);

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
      <div className="flex justify-center mb-8 overflow-x-auto pb-2">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-max">
          {steps.map((s, i) => {
            const isActive = i === step;
            const isCompleted = i < step;
            const isLocked = s.pro && !isProUser;
            return (
              <div key={s.label} className="flex items-center">
                <div className={`flex flex-col items-center ${isActive ? 'text-orange-500' : isLocked ? 'text-slate-500' : 'text-slate-300'}`}> 
                  <div className={`rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border-2 ${isActive ? 'border-orange-500' : isLocked ? 'border-slate-500' : 'border-slate-300'} bg-slate-900`}> 
                    {isCompleted ? <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-400" /> : <s.icon className="w-4 h-4 sm:w-6 sm:h-6" />} 
                  </div>
                  <span className="mt-1 sm:mt-2 text-xs font-semibold hidden sm:block">{s.label}</span>
                  <span className="mt-1 sm:mt-2 text-xs font-semibold sm:hidden">{s.label.split(' ')[0]}</span>
                  {s.free && <span className="text-xs text-green-400 mt-1">Free</span>}
                  {isLocked && <span className="text-xs text-orange-400 mt-1">Pro</span>}
                </div>
                {i < steps.length - 1 && <div className="w-4 sm:w-8 h-1 bg-slate-700 mx-1 sm:mx-2 rounded" />}
              </div>
            );
          })}
        </div>
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
          <Link href="/pricing" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg inline-block">Upgrade to Pro</Link>
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
          <Link href="/pricing" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg inline-block">Upgrade to Pro</Link>
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
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Bitcoin className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">FutureSats.io</h1>
                <span className="text-slate-400 text-sm">BTC Retirement Planner</span>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-white">FutureSats</h1>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {currencyLoading && <span className="text-orange-400 text-sm">Loading rates...</span>}
              {status === "authenticated" && session?.user ? (
                <>
                  <span className="text-slate-200 text-sm font-medium">
                    {session.user.name || session.user.email}
                  </span>
                  {session.user.role === "ADMIN" && (
                    <Link 
                      href="/admin" 
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth/signin" className="text-slate-300 hover:text-white transition-colors">
                  Sign In
                </Link>
              )}
              <Link href="/pricing" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                Get Pro
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {currencyLoading && <span className="text-orange-400 text-xs">Loading...</span>}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-300 hover:text-white transition-colors p-2"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-sm">
              <div className="px-4 py-4 space-y-3">
                {status === "authenticated" && session?.user ? (
                  <>
                    <div className="text-slate-200 text-sm font-medium">
                      {session.user.name || session.user.email}
                    </div>
                    {session.user.role === "ADMIN" && (
                      <Link 
                        href="/admin" 
                        className="block bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-colors text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link href="/auth/signin" className="block text-slate-300 hover:text-white transition-colors py-2">
                    Sign In
                  </Link>
                )}
                <Link href="/pricing" className="block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-center">
                  Get Pro
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
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
        <div className="space-y-6 sm:space-y-8">
          {stepContent}
        </div>
        <div className="flex justify-between mt-6 sm:mt-8">
          <button
            className={`flex items-center px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${canGoBack ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            onClick={() => canGoBack && setStep(step - 1)}
            disabled={!canGoBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
          <div className="flex space-x-2">
            {canGoNext && (
              <button
                className="flex items-center px-3 sm:px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 text-sm sm:text-base"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-slate-400">
            <p className="text-sm sm:text-base">&copy; 2025 FutureSats.io - Built by <a href="https://x.com/criedfizcken" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-400">@criedfizcken</a> @ <a href="https://f12.gg" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-400">F12.GG</a></p>  
            <p className="text-xs text-slate-500 mt-1">Inspired by <a href="https://bitcoincompounding.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-400">bitcoincompounding.com</a> - <a href="https://x.com/bitcoinhornet" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-400">@bitcoinhornet</a></p>
            <p className="text-sm mt-2">
              Plan your Bitcoin retirement with confidence
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Currency Selector */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[10000] sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0">
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}
