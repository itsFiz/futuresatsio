"use client";

import { useState, useEffect } from 'react';
import { X, Download, Smartphone, Share2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
      return;
    }

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    
    console.log('PWA Install Prompt Debug:', {
      userAgent,
      isIOSDevice,
      isAndroidDevice,
      isStandalone: window.matchMedia('(display-mode: standalone)').matches
    });
    
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    // Show prompt for mobile devices after a delay
    if ((isIOSDevice || isAndroidDevice) && !window.matchMedia('(display-mode: standalone)').matches) {
      const delay = isIOSDevice ? 2000 : 5000; // iOS gets faster prompt
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, delay);
      return () => clearTimeout(timer);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []); // Remove isIOS and isStandalone from dependencies

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    }
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FutureSats.io - BTC Retirement Planner',
          text: 'Plan your Bitcoin retirement with our advanced BTC accumulation simulator',
          url: window.location.href,
        });
      } catch {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-24 sm:bottom-4 left-4 right-4 z-[10001] bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Download className="w-5 h-5 text-orange-400" />
          <h3 className="text-white font-semibold text-sm">Add to Home Screen</h3>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-slate-300 text-xs mb-3">
        Install FutureSats for quick access and offline use
      </p>

      {isIOS ? (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <Share2 className="w-4 h-4" />
            <span>1. Tap the Share button</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <Download className="w-4 h-4" />
            <span>2. Select &ldquo;Add to Home Screen&rdquo;</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <Smartphone className="w-4 h-4" />
            <span>3. Tap &ldquo;Add&rdquo; to install</span>
          </div>
        </div>
      ) : isAndroid && deferredPrompt ? (
        <button
          onClick={handleInstallClick}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
        >
          Install App
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <Share2 className="w-4 h-4" />
            <span>Tap the menu button (⋮) in your browser</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <Download className="w-4 h-4" />
            <span>Select &ldquo;Add to Home Screen&rdquo; or &ldquo;Install App&rdquo;</span>
          </div>
        </div>
      )}

      <button
        onClick={handleShareClick}
        className="w-full mt-3 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
      >
        Share App
      </button>
    </div>
  );
} 