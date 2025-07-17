"use client";
import { BarChart3, TrendingUp, Users, FileText, Eye, Download } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-slate-400">Track platform performance and user engagement.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Page Views</p>
              <p className="text-2xl font-bold text-white">45.2K</p>
              <p className="text-green-400 text-sm">+12.5% from last month</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Active Users</p>
              <p className="text-2xl font-bold text-white">2.8K</p>
              <p className="text-green-400 text-sm">+8.3% from last month</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Simulations Run</p>
              <p className="text-2xl font-bold text-white">12.4K</p>
              <p className="text-green-400 text-sm">+15.2% from last month</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Model Submissions</p>
              <p className="text-2xl font-bold text-white">89</p>
              <p className="text-orange-400 text-sm">+5 new this week</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">User Growth</h3>
            <button className="flex items-center space-x-2 text-slate-400 hover:text-white text-sm">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">Chart visualization coming soon</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Platform Usage</h3>
            <button className="flex items-center space-x-2 text-slate-400 hover:text-white text-sm">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">Chart visualization coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Content */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Top Performing Content</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
            <div>
              <p className="text-white font-medium">BTC Retirement Simulator</p>
              <p className="text-slate-400 text-sm">Main simulation tool</p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">8.2K views</p>
              <p className="text-green-400 text-sm">+23%</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
            <div>
              <p className="text-white font-medium">Dip Buy Planner</p>
              <p className="text-slate-400 text-sm">Strategic buying tool</p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">5.7K views</p>
              <p className="text-green-400 text-sm">+18%</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
            <div>
              <p className="text-white font-medium">Pricing Page</p>
              <p className="text-slate-400 text-sm">Subscription plans</p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">3.1K views</p>
              <p className="text-orange-400 text-sm">+5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-8 text-center">
        <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Advanced Analytics Coming Soon</h3>
        <p className="text-slate-400">Detailed charts, user behavior analysis, and custom reports are being developed.</p>
      </div>
    </div>
  );
} 