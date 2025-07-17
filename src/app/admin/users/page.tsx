"use client";
import { Users, Search, Filter } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-slate-400">Manage user accounts and permissions.</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 text-white rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-semibold text-white">All Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-200">
            <thead>
              <tr className="bg-slate-900/60">
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Joined</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-700/30 hover:bg-slate-700/20">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">J</span>
                    </div>
                    <span className="font-medium">John Doe</span>
                  </div>
                </td>
                <td className="px-6 py-4">john.doe@example.com</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded-full text-xs">USER</span>
                </td>
                <td className="px-6 py-4">Jan 15, 2024</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-900/50 text-green-400 rounded-full text-xs">Active</span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-orange-400 hover:text-orange-300 text-sm">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-8 text-center">
        <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">User Management Coming Soon</h3>
        <p className="text-slate-400">Advanced user management features are being developed.</p>
      </div>
    </div>
  );
} 