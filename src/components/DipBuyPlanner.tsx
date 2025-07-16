"use client";

import { useState, useEffect } from "react";
import { TrendingDown, DollarSign, Calendar, Plus, Trash2 } from "lucide-react";

interface DipBuy {
  year: number;
  amount: number;
  btcPrice: number;
}

interface DipBuyPlannerProps {
  currency: string;
  convert: (amount: number, to: string) => number;
  format: (amount: number, to: string) => string;
  currencyLoading: boolean;
  state?: DipBuy[];
  setState?: (s: DipBuy[]) => void;
}

export default function DipBuyPlanner({ currency, convert, format, currencyLoading, state, setState }: DipBuyPlannerProps) {
  const currentYear = new Date().getFullYear();
  const defaultDipBuys: DipBuy[] = [
    { year: 2039, amount: 1000000, btcPrice: 150000 },
    { year: 2043, amount: 1500000, btcPrice: 200000 },
    { year: 2047, amount: 2000000, btcPrice: 250000 },
  ];
  const [dipBuys, setDipBuysInternal] = useState<DipBuy[]>(state || defaultDipBuys);
  const setDipBuys = (val: DipBuy[]) => {
    setDipBuysInternal(val);
    if (setState) {
      setState(val);
    }
  };
  useEffect(() => {
    if (state) {
      setDipBuysInternal(state);
    }
  }, [state]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newDipBuy, setNewDipBuy] = useState<DipBuy>({
    year: currentYear + 4,
    amount: 1000000,
    btcPrice: 100000,
  });

  const addDipBuy = () => {
    setDipBuys([...dipBuys, newDipBuy]);
    setNewDipBuy({
      year: currentYear + 4,
      amount: 1000000,
      btcPrice: 100000,
    });
    setShowAddForm(false);
  };

  const removeDipBuy = (index: number) => {
    setDipBuys(dipBuys.filter((_: DipBuy, i: number) => i !== index));
  };

  const calculateDipBTC = (amount: number, price: number) => {
    return amount / price;
  };

  const totalDipInvestment = dipBuys.reduce((sum: number, dip: DipBuy) => sum + dip.amount, 0);
  const totalDipBTC = dipBuys.reduce((sum: number, dip: DipBuy) => sum + calculateDipBTC(dip.amount, dip.btcPrice), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
            <TrendingDown className="w-6 h-6 text-red-500" />
            <span>Strategic Dip Buy Planner</span>
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Dip Buy</span>
          </button>
        </div>
        
        <p className="text-slate-300 mb-6">
          Plan strategic purchases during bear markets every 4 years (halving cycles). 
          These are typically the best times to accumulate large amounts of BTC.
        </p>

        {/* Add New Dip Buy Form */}
        {showAddForm && (
          <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-semibold text-white mb-4">Add New Dip Buy</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Year</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={newDipBuy.year}
                    onChange={(e) => setNewDipBuy({...newDipBuy, year: parseInt(e.target.value)})}
                    className="w-full pl-10 pr-4 py-3 bg-slate-600/50 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min={currentYear + 1}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Amount ({currency})</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={newDipBuy.amount}
                    onChange={(e) => setNewDipBuy({...newDipBuy, amount: parseInt(e.target.value)})}
                    className="w-full pl-10 pr-4 py-3 bg-slate-600/50 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">BTC Price ({currency})</label>
                <div className="relative">
                  <TrendingDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={newDipBuy.btcPrice}
                    onChange={(e) => setNewDipBuy({...newDipBuy, btcPrice: parseInt(e.target.value)})}
                    className="w-full pl-10 pr-4 py-3 bg-slate-600/50 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="0"
                  />
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={addDipBuy}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add Dip Buy
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dip Buys List */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-bold text-white mb-4">Planned Dip Buys</h3>
        
        {dipBuys.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <TrendingDown className="w-12 h-12 mx-auto mb-4 text-slate-600" />
            <p>No dip buys planned yet. Add your first strategic purchase!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {dipBuys.map((dip: DipBuy, index: number) => (
              <div key={index} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-slate-400 text-sm">Year</div>
                        <div className="text-white font-semibold">{dip.year}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">Investment ({currency})</div>
                        <div className="text-green-400 font-semibold">{currencyLoading ? '...' : format(convert(dip.amount, currency), currency)}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">BTC Price ({currency})</div>
                        <div className="text-orange-400 font-semibold">{currencyLoading ? '...' : format(convert(dip.btcPrice, currency), currency)}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">BTC Gained</div>
                        <div className="text-purple-400 font-semibold">
                          {calculateDipBTC(dip.amount, dip.btcPrice).toFixed(4)} BTC
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeDipBuy(index)}
                    className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-bold text-white mb-4">Dip Buy Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="text-slate-400 text-sm">Total Dip Buys</div>
            <div className="text-2xl font-bold text-white">{dipBuys.length}</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="text-slate-400 text-sm">Total Investment</div>
            <div className="text-2xl font-bold text-green-500">{currencyLoading ? '...' : format(convert(totalDipInvestment, currency), currency)}</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="text-slate-400 text-sm">Total BTC Gained</div>
            <div className="text-2xl font-bold text-orange-500">{totalDipBTC.toFixed(4)} BTC</div>
          </div>
        </div>
      </div>

      {/* Strategy Tips */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-bold text-white mb-4">💡 Dip Buy Strategy Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-orange-400 mb-2">Timing</h4>
            <ul className="text-slate-300 space-y-1 text-sm">
              <li>• Plan for bear markets every 4 years (halving cycles)</li>
              <li>• 2039, 2043, 2047 are projected bear market years</li>
              <li>• Buy during fear, not during euphoria</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-green-400 mb-2">Amount Strategy</h4>
            <ul className="text-slate-300 space-y-1 text-sm">
              <li>• Increase amounts over time as income grows</li>
              <li>• Use 10-20% of liquid savings for each dip</li>
              <li>• Consider business exits or windfalls for large purchases</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 