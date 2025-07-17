"use client";
import { Settings, Save, Globe, Shield, Database, Bell } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Configure platform settings and preferences.</p>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">General</h3>
              <p className="text-slate-400 text-sm">Platform configuration</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Site Name
              </label>
              <input
                type="text"
                defaultValue="FutureSats.io"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Default Currency
              </label>
              <select className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="BTC">BTC</option>
              </select>
            </div>
            
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Maintenance Mode
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="maintenance"
                  className="w-4 h-4 text-orange-500 bg-slate-700 border-slate-600 rounded focus:ring-orange-500"
                />
                <label htmlFor="maintenance" className="text-slate-300 text-sm">
                  Enable maintenance mode
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Security</h3>
              <p className="text-slate-400 text-sm">Authentication & permissions</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                defaultValue="30"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Password Policy
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="uppercase"
                    defaultChecked
                    className="w-4 h-4 text-orange-500 bg-slate-700 border-slate-600 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="uppercase" className="text-slate-300 text-sm">
                    Require uppercase letters
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="numbers"
                    defaultChecked
                    className="w-4 h-4 text-orange-500 bg-slate-700 border-slate-600 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="numbers" className="text-slate-300 text-sm">
                    Require numbers
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="special"
                    className="w-4 h-4 text-orange-500 bg-slate-700 border-slate-600 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="special" className="text-slate-300 text-sm">
                    Require special characters
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Database Settings */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Database</h3>
              <p className="text-slate-400 text-sm">Data management</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Backup Frequency
              </label>
              <select className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Data Retention (days)
              </label>
              <input
                type="number"
                defaultValue="90"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <button className="w-full px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 text-white rounded-lg transition-colors">
              Export Database
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <p className="text-slate-400 text-sm">Alert preferences</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">New Submissions</p>
                <p className="text-slate-400 text-sm">Email notifications for new model submissions</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-orange-500 bg-slate-700 border-slate-600 rounded focus:ring-orange-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">System Alerts</p>
                <p className="text-slate-400 text-sm">Critical system notifications</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-orange-500 bg-slate-700 border-slate-600 rounded focus:ring-orange-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Weekly Reports</p>
                <p className="text-slate-400 text-sm">Platform usage summaries</p>
              </div>
              <input
                type="checkbox"
                className="w-4 h-4 text-orange-500 bg-slate-700 border-slate-600 rounded focus:ring-orange-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all duration-200">
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-8 text-center">
        <Settings className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Advanced Settings Coming Soon</h3>
        <p className="text-slate-400">More configuration options and advanced features are being developed.</p>
      </div>
    </div>
  );
} 