# FutureSats MCP Server

A Model Context Protocol (MCP) server for Bitcoin retirement planning and analysis, built for the FutureSats.io platform.

## Overview

This MCP server provides AI assistants with tools to:
- Get real-time Bitcoin price data
- Analyze historical Bitcoin performance
- Simulate Bitcoin retirement scenarios
- Plan strategic dip-buying strategies
- Generate market analysis and insights

## Features

### 🪙 Bitcoin Data Tools
- **Current Price**: Get live Bitcoin prices in multiple currencies
- **Historical Data**: Access historical price data for analysis
- **Market Analysis**: Real-time market insights and trends

### 📊 Retirement Planning
- **Simulation Engine**: Project Bitcoin accumulation over time
- **DCA Calculator**: Dollar-cost averaging projections
- **Compound Growth**: Calculate long-term Bitcoin growth scenarios

### 📈 Strategic Planning
- **Dip Buy Planner**: Plan purchases during market corrections
- **Risk Management**: Optimize investment timing and amounts
- **Portfolio Analysis**: Track performance and projections

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

## Development

```bash
# Run in development mode
npm run dev

# Run tests
npm test
```

## Usage

### Connecting to an MCP Client

1. **Claude Desktop**: Add the server to your MCP configuration
2. **Other MCP Clients**: Follow the client-specific setup instructions

### Example Configuration

```json
{
  "mcpServers": {
    "futuresats": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```

## Available Tools

### `get_bitcoin_price`
Get current Bitcoin price and market data.

**Parameters:**
- `currency` (string, optional): Currency code (default: "USD")

**Example:**
```
Get the current Bitcoin price in MYR
```

### `get_bitcoin_historical_data`
Retrieve historical Bitcoin price data for analysis.

**Parameters:**
- `days` (number, optional): Number of days (default: 30)
- `currency` (string, optional): Currency code (default: "USD")

**Example:**
```
Get Bitcoin price data for the last 90 days in EUR
```

### `simulate_retirement`
Simulate a Bitcoin retirement planning scenario.

**Parameters:**
- `targetYear` (number, required): Target retirement year
- `startingBTC` (number, required): Starting Bitcoin amount
- `monthlyDCA` (number, required): Monthly dollar cost average amount
- `btcCAGR` (number, optional): Expected Bitcoin CAGR (default: 15)
- `currency` (string, optional): Currency for calculations (default: "USD")

**Example:**
```
Simulate retirement planning with $1000 monthly DCA, starting with 0.1 BTC, targeting 2035
```

### `plan_dip_buys`
Plan strategic Bitcoin purchases during market dips.

**Parameters:**
- `totalInvestment` (number, required): Total amount to invest
- `dipThreshold` (number, optional): Percentage drop to trigger dip buy (default: 20)
- `currency` (string, optional): Currency for calculations (default: "USD")

**Example:**
```
Plan dip buying strategy with $50,000 total investment, triggering at 25% drops
```

### `get_market_analysis`
Get comprehensive market analysis and insights.

**Parameters:**
- `currency` (string, optional): Currency for analysis (default: "USD")

**Example:**
```
Analyze current Bitcoin market conditions and provide recommendations
```

## API Integration

The server integrates with:
- **CoinGecko API**: Real-time cryptocurrency data
- **FutureSats Platform**: Retirement planning algorithms
- **Market Analysis**: Technical indicators and trends

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- **Documentation**: [FutureSats.io](https://futuresats.io)
- **Issues**: GitHub Issues
- **Discord**: [FutureSats Community](https://discord.gg/futuresats)

## Roadmap

- [ ] Real-time price alerts
- [ ] Advanced technical analysis
- [ ] Portfolio rebalancing tools
- [ ] Tax optimization strategies
- [ ] Multi-asset support
- [ ] Integration with exchanges
- [ ] Automated trading signals

---

Built with ❤️ by the FutureSats team 