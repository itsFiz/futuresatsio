export interface SimulationParams {
  targetYear: number;
  startingBTC: number;
  monthlyDCA: number;
  btcCAGR: number;
  currency: string;
}

export interface SimulationResult {
  totalBTC: number;
  totalValue: number;
  totalInvested: number;
  profit: number;
  profitPercentage: number;
  monthlyBreakdown: MonthlyBreakdown[];
}

export interface MonthlyBreakdown {
  year: number;
  month: number;
  btcPrice: number;
  dcaAmount: number;
  btcPurchased: number;
  totalBTC: number;
  totalValue: number;
}

export class RetirementSimulator {
  async simulate(params: SimulationParams): Promise<any> {
    const {
      targetYear,
      startingBTC,
      monthlyDCA,
      btcCAGR = 15,
      currency = "USD"
    } = params;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    if (targetYear <= currentYear) {
      throw new Error("Target year must be in the future");
    }

    // Calculate monthly growth rate
    const monthlyGrowthRate = Math.pow(1 + btcCAGR / 100, 1 / 12) - 1;
    
    // Start with current Bitcoin price (placeholder - in real implementation, fetch from API)
    let currentBTCPrice = 50000; // Placeholder price
    
    const monthlyBreakdown: MonthlyBreakdown[] = [];
    let totalBTC = startingBTC;
    let totalInvested = 0;
    
    // Simulate month by month
    for (let year = currentYear; year <= targetYear; year++) {
      const startMonth = year === currentYear ? currentMonth : 1;
      const endMonth = year === targetYear ? 12 : 12;
      
      for (let month = startMonth; month <= endMonth; month++) {
        // Calculate BTC price for this month
        const monthsFromStart = (year - currentYear) * 12 + (month - currentMonth);
        const btcPrice = currentBTCPrice * Math.pow(1 + monthlyGrowthRate, monthsFromStart);
        
        // Calculate DCA for this month
        const dcaAmount = monthlyDCA;
        const btcPurchased = dcaAmount / btcPrice;
        
        // Update totals
        totalBTC += btcPurchased;
        totalInvested += dcaAmount;
        
        monthlyBreakdown.push({
          year,
          month,
          btcPrice,
          dcaAmount,
          btcPurchased,
          totalBTC,
          totalValue: totalBTC * btcPrice
        });
      }
    }
    
    const finalPrice = monthlyBreakdown[monthlyBreakdown.length - 1].btcPrice;
    const totalValue = totalBTC * finalPrice;
    const profit = totalValue - totalInvested;
    const profitPercentage = (profit / totalInvested) * 100;
    
    const result: SimulationResult = {
      totalBTC,
      totalValue,
      totalInvested,
      profit,
      profitPercentage,
      monthlyBreakdown
    };
    
    return {
      content: [
        {
          type: "text",
          text: `Bitcoin Retirement Simulation Results:\n\n` +
                `Target Year: ${targetYear}\n` +
                `Starting BTC: ${startingBTC.toFixed(8)}\n` +
                `Monthly DCA: ${monthlyDCA.toLocaleString()} ${currency}\n` +
                `BTC CAGR: ${btcCAGR}%\n\n` +
                `Final Results:\n` +
                `Total BTC Accumulated: ${totalBTC.toFixed(8)}\n` +
                `Total Invested: ${totalInvested.toLocaleString()} ${currency}\n` +
                `Final Value: ${totalValue.toLocaleString()} ${currency}\n` +
                `Total Profit: ${profit.toLocaleString()} ${currency}\n` +
                `Profit Percentage: ${profitPercentage.toFixed(2)}%\n\n` +
                `Monthly Breakdown: ${monthlyBreakdown.length} months simulated`
        }
      ]
    };
  }
} 