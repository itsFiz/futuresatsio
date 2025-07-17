"use client";
import { useEffect, useState } from "react";
import { AlertCircle, Eye, X } from "lucide-react";

interface Submission {
  id: string;
  modelName: string;
  authorName: string;
  email: string;
  xHandle?: string;
  description: string;
  thesis: string;
  startingPrice: number;
  cagrValues: number[];
  methodology: string;
  expectedOutcome: string;
  status: string;
  createdAt: string;
  reviewedAt?: string;
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/submissions?page=${page}&status=${filterStatus}`)
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or error fetching submissions");
        return res.json();
      })
      .then((data) => {
        setSubmissions(data.submissions);
        setPages(data.pagination.pages);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [page, filterStatus]);

  const handleViewDetails = (submission: Submission) => {
    setSelectedSubmission(submission);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedSubmission(null);
  };

  if (error) return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center space-x-2 text-red-400 mb-4">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Model Submissions</h1>
        <p className="text-slate-400">Review and manage model submissions from users.</p>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center space-x-4">
          <label className="text-slate-300 font-medium">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className="bg-slate-700/50 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Submissions</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="UNDER_REVIEW">Under Review</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-8">
          <div className="text-white text-lg">Loading submissions...</div>
        </div>
      ) : (
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-200">
              <thead>
                <tr className="bg-slate-900/60">
                  <th className="px-6 py-3 text-left font-medium">Model Name</th>
                  <th className="px-6 py-3 text-left font-medium">Author</th>
                  <th className="px-6 py-3 text-left font-medium">Email</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Created</th>
                  <th className="px-6 py-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      No submissions found
                    </td>
                  </tr>
                ) : (
                  submissions.map((s) => (
                    <tr key={s.id} className="border-t border-slate-700/30 hover:bg-slate-700/20">
                      <td className="px-6 py-4 font-semibold max-w-xs truncate">{s.modelName}</td>
                      <td className="px-6 py-4 max-w-xs truncate">{s.authorName}</td>
                      <td className="px-6 py-4 max-w-xs truncate">{s.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          s.status === 'APPROVED' ? 'bg-green-900/50 text-green-400' :
                          s.status === 'REJECTED' ? 'bg-red-900/50 text-red-400' :
                          s.status === 'PENDING' ? 'bg-yellow-900/50 text-yellow-400' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{new Date(s.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleViewDetails(s)}
                          className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors text-slate-400 hover:text-white"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
        <div className="flex justify-between items-center">
          <button
            className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-slate-300 font-medium">Page {page} of {pages}</span>
          <button
            className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Submission Details Modal */}
      {showDetails && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Submission Details</h2>
                <button
                  onClick={closeDetails}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Model Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-1">Model Name</label>
                    <p className="text-white font-medium">{selectedSubmission.modelName}</p>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-1">Status</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedSubmission.status === 'APPROVED' ? 'bg-green-900/50 text-green-400' :
                      selectedSubmission.status === 'REJECTED' ? 'bg-red-900/50 text-red-400' :
                      selectedSubmission.status === 'PENDING' ? 'bg-yellow-900/50 text-yellow-400' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {selectedSubmission.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-1">Starting Price</label>
                    <p className="text-white">${selectedSubmission.startingPrice ? selectedSubmission.startingPrice.toLocaleString() : 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Author Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Author Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-1">Author Name</label>
                    <p className="text-white">{selectedSubmission.authorName}</p>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-1">Email</label>
                    <p className="text-white">{selectedSubmission.email}</p>
                  </div>
                  {selectedSubmission.xHandle && (
                    <div>
                      <label className="block text-slate-400 text-sm font-medium mb-1">X (Twitter) Handle</label>
                      <p className="text-white">@{selectedSubmission.xHandle}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Model Details */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Model Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">Description</label>
                    <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                      <p className="text-white whitespace-pre-wrap">{selectedSubmission.description || 'No description provided'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">Bitcoin Thesis</label>
                    <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                      <p className="text-white whitespace-pre-wrap">{selectedSubmission.thesis || 'No thesis provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CAGR Values */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">CAGR Values (30 Years)</h3>
                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                  {selectedSubmission.cagrValues && selectedSubmission.cagrValues.length > 0 ? (
                    <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
                      {selectedSubmission.cagrValues.map((cagr, index) => (
                        <div key={index} className="text-center">
                          <div className="text-xs text-slate-400 mb-1">Year {index + 1}</div>
                          <div className="text-white font-medium">{cagr || 0}%</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-center">No CAGR values available</p>
                  )}
                </div>
              </div>

              {/* Methodology & Expected Outcome */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Methodology & Expected Outcome</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">Methodology</label>
                    <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                      <p className="text-white whitespace-pre-wrap">{selectedSubmission.methodology || 'No methodology provided'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">Expected Outcome</label>
                    <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                      <p className="text-white whitespace-pre-wrap">{selectedSubmission.expectedOutcome || 'No expected outcome provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-1">Submitted</label>
                    <p className="text-white">{new Date(selectedSubmission.createdAt).toLocaleString()}</p>
                  </div>
                  {selectedSubmission.reviewedAt && (
                    <div>
                      <label className="block text-slate-400 text-sm font-medium mb-1">Reviewed</label>
                      <p className="text-white">{new Date(selectedSubmission.reviewedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700/50">
                <button
                  onClick={closeDetails}
                  className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
                {selectedSubmission.status === 'PENDING' && (
                  <>
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                      Approve
                    </button>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 