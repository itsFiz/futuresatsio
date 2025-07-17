export interface DipBuyParams {
  totalInvestment: number;
  dipThreshold: number;
  currency: string;
}

export interface DipBuyPlan {
  totalInvestment: number;
  dipThreshold: number;
  currency: string;
  dipBuys: DipBuy[];
  summary: DipBuySummary;
}

export interface DipBuy {
  dipNumber: number;
  triggerPrice: number;
  investmentAmount: number;
  btcPurchased: number;
  percentageOfTotal: number;
}

export interface DipBuySummary {
  totalDips: number;
  averageDipSize: number;
  totalBTCPurchased: number;
  averagePurchasePrice: number;
  strategy: string;
}

export class DipBuyPlanner {
  async plan(params: DipBuyParams): Promise<any> {
    const {
      totalInvestment,
      dipThreshold = 20,
      currency = "USD"
    } = params;

    if (totalInvestment <= 0) {
      throw new Error("Total investment must be positive");
    }

    if (dipThreshold <= 0 || dipThreshold >= 100) {
      throw new Error("Dip threshold must be between 0 and 100");
    }

    // Simulate different dip scenarios
    const dipBuys: DipBuy[] = [];
    let remainingInvestment = totalInvestment;
    
    // Define dip levels (example: 20%, 30%, 40%, 50% drops)
    const dipLevels = [dipThreshold, dipThreshold + 10, dipThreshold + 20, dipThreshold + 30];
    const basePrice = 50000; // Placeholder current BTC price
    
    dipLevels.forEach((dipLevel, index) => {
      if (remainingInvestment <= 0) return;
      
      // Calculate investment amount for this dip level
      // More aggressive buying at deeper dips
      const dipMultiplier = 1 + (index * 0.5); // Increase allocation for deeper dips
      const maxAllocation = Math.min(remainingInvestment * 0.4, remainingInvestment);
      const investmentAmount = Math.min(maxAllocation * dipMultiplier, remainingInvestment);
      
      if (investmentAmount > 0) {
        const triggerPrice = basePrice * (1 - dipLevel / 100);
        const btcPurchased = investmentAmount / triggerPrice;
        const percentageOfTotal = (investmentAmount / totalInvestment) * 100;
        
        dipBuys.push({
          dipNumber: index + 1,
          triggerPrice,
          investmentAmount,
          btcPurchased,
          percentageOfTotal
        });
        
        remainingInvestment -= investmentAmount;
      }
    });
    
    // Calculate summary
    const totalDips = dipBuys.length;
    const totalBTCPurchased = dipBuys.reduce((sum, dip) => sum + dip.btcPurchased, 0);
    const averageDipSize = dipBuys.reduce((sum, dip) => sum + dip.investmentAmount, 0) / totalDips;
    const averagePurchasePrice = dipBuys.reduce((sum, dip) => sum + (dip.triggerPrice * dip.btcPurchased), 0) / totalBTCPurchased;
    
    let strategy = "";
    if (dipThreshold <= 15) {
      strategy = "Conservative - Small dips only";
    } else if (dipThreshold <= 25) {
      strategy = "Moderate - Balanced approach";
    } else {
      strategy = "Aggressive - Deep dips focus";
    }
    
    const summary: DipBuySummary = {
      totalDips,
      averageDipSize,
      totalBTCPurchased,
      averagePurchasePrice,
      strategy
    };
    
    const plan: DipBuyPlan = {
      totalInvestment,
      dipThreshold,
      currency,
      dipBuys,
      summary
    };
    
    // Format response
    let responseText = `Dip Buy Strategy Plan:\n\n`;
    responseText += `Total Investment: ${totalInvestment.toLocaleString()} ${currency}\n`;
    responseText += `Dip Threshold: ${dipThreshold}%\n`;
    responseText += `Strategy: ${strategy}\n\n`;
    
    responseText += `Dip Buy Breakdown:\n`;
    dipBuys.forEach((dip, index) => {
      responseText += `${index + 1}. ${dipLevels[index]}% dip at ${dip.triggerPrice.toLocaleString()} ${currency}\n`;
      responseText += `   Investment: ${dip.investmentAmount.toLocaleString()} ${currency} (${dip.percentageOfTotal.toFixed(1)}%)\n`;
      responseText += `   BTC to buy: ${dip.btcPurchased.toFixed(8)}\n\n`;
    });
    
    responseText += `Summary:\n`;
    responseText += `Total Dips: ${totalDips}\n`;
    responseText += `Average Dip Size: ${averageDipSize.toLocaleString()} ${currency}\n`;
    responseText += `Total BTC to Purchase: ${totalBTCPurchased.toFixed(8)}\n`;
    responseText += `Average Purchase Price: ${averagePurchasePrice.toLocaleString()} ${currency}\n`;
    responseText += `Remaining Investment: ${remainingInvestment.toLocaleString()} ${currency}`;
    
    return {
      content: [
        {
          type: "text",
          text: responseText
        }
      ]
    };
  }
} 