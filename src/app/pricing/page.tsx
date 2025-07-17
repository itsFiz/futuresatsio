"use client";

import { Bitcoin, Check, Star, ArrowLeft, Shield, Bell, BarChart3, Globe, Users, Target } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: 0,
    currency: "USD",
    period: "forever",
    description: "Perfect for getting started with Bitcoin retirement planning",
    features: [
      "Basic BTC Retirement Simulator",
      "Historical BTC price data",
      "Basic calculations",
      "Community support"
    ],
    popular: false,
    cta: "Get Started Free",
    href: "/"
  },
  {
    name: "Pro",
    price: 9.99,
    currency: "USD",
    period: "month",
    description: "Advanced features for serious Bitcoin retirement planning",
    features: [
      "Everything in Free",
      "Dip Buy Planner",
      "Advanced Results Dashboard",
      "PDF Export",
      "Priority support",
      "Early access to new features",
      "Price Alert Notifications",
      "Market Sentiment Analysis",
      "Custom Investment Strategies",
      "Portfolio Tracking",
      "Tax Loss Harvesting Tools",
      "DCA Schedule Reminders"
    ],
    popular: true,
    cta: "Start Pro Trial",
    href: "/auth/signup?plan=pro"
  },
  {
    name: "Enterprise",
    price: 29.99,
    currency: "USD",
    period: "month",
    description: "Complete Bitcoin retirement solution for institutions and teams",
    features: [
      "Everything in Pro",
      "Multi-User Team Management",
      "Advanced Analytics & Reporting",
      "API Access",
      "Custom Integrations",
      "Dedicated Account Manager",
      "White-label Solutions",
      "Advanced Risk Management",
      "Institutional-grade Security",
      "Compliance Reporting",
      "Custom Alerts & Webhooks",
      "Priority Feature Requests"
    ],
    popular: false,
    cta: "Contact Sales",
    href: "/auth/signup?plan=enterprise"
  }
];

export default function PricingPage() {

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Bitcoin className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">FutureSats.io</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-slate-300 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to App
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Start planning your Bitcoin retirement today. Choose the plan that fits your needs.
          </p>

        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          {plans.map((plan) => {
            // Simple USD pricing
            const displayPrice = plan.price === 0 ? "Free Forever" : `$${plan.price.toFixed(2)}/${plan.period}`;
            
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 border transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? "border-orange-500 bg-slate-800/50 shadow-lg shadow-orange-500/20"
                    : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{displayPrice}</span>
                  </div>
                  <p className="text-slate-300">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-slate-700 hover:bg-slate-600 text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Coming Soon Features */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            🚀 Coming Soon
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center mb-3">
                <Bell className="w-6 h-6 text-orange-400 mr-3" />
                <h3 className="text-xl font-semibold text-white">Smart Alerts</h3>
              </div>
              <p className="text-slate-300">
                Get notified when Bitcoin hits your target prices, market sentiment changes, or optimal DCA opportunities arise.
              </p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center mb-3">
                <BarChart3 className="w-6 h-6 text-orange-400 mr-3" />
                <h3 className="text-xl font-semibold text-white">AI Market Analysis</h3>
              </div>
              <p className="text-slate-300">
                Advanced AI-powered market analysis, trend predictions, and optimal entry/exit timing recommendations.
              </p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center mb-3">
                <Target className="w-6 h-6 text-orange-400 mr-3" />
                <h3 className="text-xl font-semibold text-white">Goal Tracking</h3>
              </div>
              <p className="text-slate-300">
                Set retirement goals and track your progress with milestone celebrations and adjustment recommendations.
              </p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center mb-3">
                <Globe className="w-6 h-6 text-orange-400 mr-3" />
                <h3 className="text-xl font-semibold text-white">Global Market Data</h3>
              </div>
              <p className="text-slate-300">
                Real-time data from multiple exchanges, on-chain metrics, and global Bitcoin adoption indicators.
              </p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center mb-3">
                <Shield className="w-6 h-6 text-orange-400 mr-3" />
                <h3 className="text-xl font-semibold text-white">Security Features</h3>
              </div>
              <p className="text-slate-300">
                Hardware wallet integration, multi-signature support, and advanced security monitoring for your Bitcoin holdings.
              </p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center mb-3">
                <Users className="w-6 h-6 text-orange-400 mr-3" />
                <h3 className="text-xl font-semibold text-white">Community Features</h3>
              </div>
              <p className="text-slate-300">
                Connect with other Bitcoiners, share strategies, and participate in community challenges and events.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-slate-300">
                Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.
              </p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                Is there a free trial for Pro plans?
              </h3>
              <p className="text-slate-300">
                Yes! We offer a 7-day free trial for all Pro plans. No credit card required to start your trial.
              </p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-slate-300">
                We accept all major credit cards, debit cards, and PayPal. All payments are processed securely through Stripe.
              </p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                Can I upgrade or downgrade my plan?
              </h3>
              <p className="text-slate-300">
                Yes, you can change your plan at any time. Upgrades take effect immediately, downgrades take effect at the next billing cycle.
              </p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                When will the new features be available?
              </h3>
              <p className="text-slate-300">
                We&apos;re actively developing new features and will roll them out gradually. Pro users get early access to all new features as they become available.
              </p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                Do you offer custom pricing for teams?
              </h3>
              <p className="text-slate-300">
                Yes! For teams of 5+ users or custom requirements, please contact us for special pricing and dedicated support.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-400">
            <p>&copy; 2025 FutureSats.io - Built by <a href="https://x.com/criedfizcken" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-400">@criedfizcken</a> @ <a href="https://f12.gg" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-400">F12.GG</a></p>  
            <p className="text-xs text-slate-500 mt-1">Inspired by <a href="https://bitcoincompounding.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-400">bitcoincompounding.com</a> - <a href="https://x.com/bitcoinhornet" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-400">@bitcoinhornet</a></p>
            <p className="text-sm mt-2">
              Plan your Bitcoin retirement with confidence
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 