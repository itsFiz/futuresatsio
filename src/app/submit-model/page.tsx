"use client";

import { useState } from "react";
import { ArrowLeft, Send, Info, AlertCircle } from "lucide-react";
import Link from "next/link";

interface ModelSubmission {
  modelName: string;
  authorName: string;
  email: string;
  xHandle: string;
  description: string;
  thesis: string;
  startingPrice: number;
  cagrValues: number[];
  methodology: string;
  expectedOutcome: string;
  agreeToTerms: boolean;
}

export default function SubmitModelPage() {
  const [formData, setFormData] = useState<ModelSubmission>({
    modelName: "",
    authorName: "",
    email: "",
    xHandle: "",
    description: "",
    thesis: "",
    startingPrice: 64934,
    cagrValues: Array(30).fill(20),
    methodology: "",
    expectedOutcome: "",
    agreeToTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ModelSubmission, value: ModelSubmission[keyof ModelSubmission]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleCAGRChange = (index: number, value: number) => {
    const newCAGR = [...formData.cagrValues];
    newCAGR[index] = value;
    setFormData(prev => ({ ...prev, cagrValues: newCAGR }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.modelName.trim()) newErrors.modelName = "Model name is required";
    if (!formData.authorName.trim()) newErrors.authorName = "Author name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.thesis.trim()) newErrors.thesis = "Thesis is required";
    if (formData.startingPrice <= 0) newErrors.startingPrice = "Starting price must be positive";
    if (!formData.methodology.trim()) newErrors.methodology = "Methodology is required";
    if (!formData.expectedOutcome.trim()) newErrors.expectedOutcome = "Expected outcome is required";
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the data to your backend
      console.log("Model submission:", formData);
      
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ submit: "Failed to submit model. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-slate-700/50 shadow-xl text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Model Submitted!</h2>
          <p className="text-slate-300 mb-6">
            Thank you for submitting your Bitcoin price model. Our team will review it and get back to you within 7-10 business days.
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Simulator</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-slate-400 hover:text-orange-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Simulator</span>
            </Link>
            <div className="h-6 w-px bg-slate-600"></div>
            <h1 className="text-2xl font-bold text-white">Submit Your Bitcoin Model</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Info Card */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-700/50 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Share Your Bitcoin Thesis</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Submit your unique Bitcoin price model and thesis. If selected, your model will be featured on the site with full credit. 
                We&apos;re looking for innovative approaches to Bitcoin price modeling that can help the community with retirement planning.
              </p>
            </div>
          </div>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-6">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Model Name *
                </label>
                <input
                  type="text"
                  value={formData.modelName}
                  onChange={(e) => handleInputChange('modelName', e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.modelName ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="e.g., Halving Cycle Model"
                />
                {errors.modelName && (
                  <p className="text-red-400 text-sm mt-1">{errors.modelName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => handleInputChange('authorName', e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.authorName ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Your full name"
                />
                {errors.authorName && (
                  <p className="text-red-400 text-sm mt-1">{errors.authorName}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.email ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Twitter/X Handle (optional)
                </label>
                <input
                  type="text"
                  value={formData.xHandle}
                  onChange={(e) => handleInputChange('xHandle', e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.xHandle ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="@elonmusk"
                />
                {errors.xHandle && (
                  <p className="text-red-400 text-sm mt-1">{errors.xHandle}</p>
                )}
              </div>
            </div>
          </div>

          {/* Model Details */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-6">Model Details</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Model Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
                    errors.description ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Brief description of your model (max 200 characters)"
                  maxLength={200}
                />
                {errors.description && (
                  <p className="text-red-400 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Your Bitcoin Thesis *
                </label>
                <textarea
                  value={formData.thesis}
                  onChange={(e) => handleInputChange('thesis', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
                    errors.thesis ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Explain your thesis on Bitcoin's price trajectory and why your model makes sense..."
                />
                {errors.thesis && (
                  <p className="text-red-400 text-sm mt-1">{errors.thesis}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Starting Bitcoin Price (USD) *
                </label>
                <input
                  type="number"
                  value={formData.startingPrice}
                  onChange={(e) => handleInputChange('startingPrice', parseFloat(e.target.value))}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.startingPrice ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="64934"
                  min="1"
                />
                {errors.startingPrice && (
                  <p className="text-red-400 text-sm mt-1">{errors.startingPrice}</p>
                )}
              </div>
            </div>
          </div>

          {/* CAGR Values */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-6">CAGR Values (30 Years)</h3>
            <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
              {formData.cagrValues.map((value, index) => (
                <div key={index}>
                  <label className="block text-xs text-slate-400 mb-1">Year {index + 1}</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleCAGRChange(index, parseFloat(e.target.value))}
                    className="w-full px-2 py-2 bg-slate-700/50 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-sm mt-4">
              Enter the Compound Annual Growth Rate (CAGR) percentage for each year. These values will determine your model&apos;s price trajectory.
            </p>
          </div>

          {/* Methodology & Expected Outcome */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-6">Methodology & Expected Outcome</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Methodology *
                </label>
                <textarea
                  value={formData.methodology}
                  onChange={(e) => handleInputChange('methodology', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
                    errors.methodology ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Explain the methodology behind your CAGR calculations..."
                />
                {errors.methodology && (
                  <p className="text-red-400 text-sm mt-1">{errors.methodology}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Expected Outcome *
                </label>
                <textarea
                  value={formData.expectedOutcome}
                  onChange={(e) => handleInputChange('expectedOutcome', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
                    errors.expectedOutcome ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="What outcomes do you expect from your model? How will it help with retirement planning?"
                />
                {errors.expectedOutcome && (
                  <p className="text-red-400 text-sm mt-1">{errors.expectedOutcome}</p>
                )}
              </div>
            </div>
          </div>

          {/* Terms & Submit */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className="mt-1 accent-orange-500"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-slate-300">
                  I agree to the terms and conditions. I understand that if my model is selected, it will be featured on the site with full credit given to me. I also understand that the model may be modified for consistency with the platform&apos;s format.
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-400 text-sm">{errors.agreeToTerms}</p>
              )}

              {errors.submit && (
                <div className="flex items-center space-x-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.submit}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:from-orange-500/50 disabled:to-amber-600/50 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Model</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 