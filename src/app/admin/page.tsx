"use client";
import { useEffect, useState } from "react";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  BarChart3
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalSubmissions: number;
  pendingSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    timestamp: string;
    status?: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch this data from your API
    // For now, we'll simulate the data
    setTimeout(() => {
      setStats({
        totalUsers: 1247,
        totalSubmissions: 89,
        pendingSubmissions: 12,
        approvedSubmissions: 67,
        rejectedSubmissions: 10,
        recentActivity: [
          {
            id: "1",
            type: "submission",
            title: "New model submission: BTC Momentum Tracker",
            timestamp: "2024-01-15T10:30:00Z",
            status: "PENDING"
          },
          {
            id: "2",
            type: "user",
            title: "New user registration: john.doe@example.com",
            timestamp: "2024-01-15T09:15:00Z"
          },
          {
            id: "3",
            type: "submission",
            title: "Model approved: Halving Cycle Predictor",
            timestamp: "2024-01-15T08:45:00Z",
            status: "APPROVED"
          },
          {
            id: "4",
            type: "submission",
            title: "Model rejected: Simple Moving Average",
            timestamp: "2024-01-15T07:20:00Z",
            status: "REJECTED"
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "PENDING":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-blue-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "text-green-400";
      case "REJECTED":
        return "text-red-400";
      case "PENDING":
        return "text-yellow-400";
      default:
        return "text-blue-400";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here&apos;s what&apos;s happening with your platform.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats?.totalUsers.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Submissions</p>
              <p className="text-2xl font-bold text-white">{stats?.totalSubmissions}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Pending Reviews</p>
              <p className="text-2xl font-bold text-white">{stats?.pendingSubmissions}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Approval Rate</p>
              <p className="text-2xl font-bold text-white">
                {stats ? Math.round((stats.approvedSubmissions / stats.totalSubmissions) * 100) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
          <button className="text-slate-400 hover:text-white text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {stats?.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                  {activity.type === "submission" ? (
                    <FileText className="w-5 h-5 text-slate-300" />
                  ) : (
                    <Users className="w-5 h-5 text-slate-300" />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{activity.title}</p>
                  <p className="text-slate-400 text-sm">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {activity.status && (
                  <>
                    {getStatusIcon(activity.status)}
                    <span className={`text-sm font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </>
                )}
                <button className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-slate-300" />
                <span className="text-white">Review Pending Submissions</span>
              </div>
            </button>
            <button className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-slate-300" />
                <span className="text-white">Manage Users</span>
              </div>
            </button>
            <button className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-slate-300" />
                <span className="text-white">View Analytics</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">API Status</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm">Operational</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Database</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">BTC Data Feed</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 