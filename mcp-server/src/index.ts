#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { BitcoinDataService } from "./services/bitcoin-data.js";
import { RetirementSimulator } from "./services/retirement-simulator.js";
import { DipBuyPlanner } from "./services/dip-buy-planner.js";

class FutureSatsMCPServer {
  private server: Server;
  private bitcoinData: BitcoinDataService;
  private retirementSimulator: RetirementSimulator;
  private dipBuyPlanner: DipBuyPlanner;

  constructor() {
    this.server = new Server(
      {
        name: "futuresats-mcp-server",
        version: "1.0.0",
      }
    );

    this.bitcoinData = new BitcoinDataService();
    this.retirementSimulator = new RetirementSimulator();
    this.dipBuyPlanner = new DipBuyPlanner();

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "get_bitcoin_price",
            description: "Get current Bitcoin price in various currencies",
            inputSchema: {
              type: "object",
              properties: {
                currency: {
                  type: "string",
                  description: "Currency code (e.g., USD, EUR, MYR)",
                  default: "USD"
                }
              }
            }
          },
          {
            name: "get_bitcoin_historical_data",
            description: "Get historical Bitcoin price data for analysis",
            inputSchema: {
              type: "object",
              properties: {
                days: {
                  type: "number",
                  description: "Number of days of historical data",
                  default: 30
                },
                currency: {
                  type: "string",
                  description: "Currency code",
                  default: "USD"
                }
              }
            }
          },
          {
            name: "simulate_retirement",
            description: "Simulate Bitcoin retirement planning scenario",
            inputSchema: {
              type: "object",
              properties: {
                targetYear: {
                  type: "number",
                  description: "Target retirement year"
                },
                startingBTC: {
                  type: "number",
                  description: "Starting Bitcoin amount"
                },
                monthlyDCA: {
                  type: "number",
                  description: "Monthly dollar cost average amount"
                },
                btcCAGR: {
                  type: "number",
                  description: "Expected Bitcoin CAGR percentage",
                  default: 15
                },
                currency: {
                  type: "string",
                  description: "Currency for calculations",
                  default: "USD"
                }
              },
              required: ["targetYear", "startingBTC", "monthlyDCA"]
            }
          },
          {
            name: "plan_dip_buys",
            description: "Plan strategic Bitcoin purchases during market dips",
            inputSchema: {
              type: "object",
              properties: {
                totalInvestment: {
                  type: "number",
                  description: "Total amount to invest"
                },
                dipThreshold: {
                  type: "number",
                  description: "Percentage drop to trigger dip buy",
                  default: 20
                },
                currency: {
                  type: "string",
                  description: "Currency for calculations",
                  default: "USD"
                }
              },
              required: ["totalInvestment"]
            }
          },
          {
            name: "get_market_analysis",
            description: "Get current market analysis and insights",
            inputSchema: {
              type: "object",
              properties: {
                currency: {
                  type: "string",
                  description: "Currency for analysis",
                  default: "USD"
                }
              }
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      const safeArgs = args as Record<string, any> || {};

      try {
        switch (name) {
          case "get_bitcoin_price":
            return await this.bitcoinData.getCurrentPrice(safeArgs.currency || "USD");

          case "get_bitcoin_historical_data":
            return await this.bitcoinData.getHistoricalData(
              safeArgs.days || 30,
              safeArgs.currency || "USD"
            );

          case "simulate_retirement":
            return await this.retirementSimulator.simulate({
              targetYear: safeArgs.targetYear,
              startingBTC: safeArgs.startingBTC,
              monthlyDCA: safeArgs.monthlyDCA,
              btcCAGR: safeArgs.btcCAGR || 15,
              currency: safeArgs.currency || "USD"
            });

          case "plan_dip_buys":
            return await this.dipBuyPlanner.plan({
              totalInvestment: safeArgs.totalInvestment,
              dipThreshold: safeArgs.dipThreshold || 20,
              currency: safeArgs.currency || "USD"
            });

          case "get_market_analysis":
            return await this.bitcoinData.getMarketAnalysis(safeArgs.currency || "USD");

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error executing tool ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("FutureSats MCP Server started");
  }
}

// Start the server
const server = new FutureSatsMCPServer();
server.run().catch(console.error); 