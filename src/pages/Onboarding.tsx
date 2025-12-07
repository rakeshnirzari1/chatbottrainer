import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, DollarSign, Activity, Clock, RotateCcw, Plus, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/AuthModal';
import { Logo } from '../components/Logo';
import { crawlWebsite, CrawlProgress } from '../lib/crawler';
import { calculatePrice, formatPrice } from '../lib/pricing';
import { saveOnboardingState, loadOnboardingState } from '../lib/storage';

type Step = 'input' | 'crawling' | 'selection';

export function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('input');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [crawlLogs, setCrawlLogs] = useState<string[]>([]);
  const [discoveredUrls, setDiscoveredUrls] = useState<string[]>([]);
  const [crawlStats, setCrawlStats] = useState({ discovered: 0, visited: 0, queued: 0, eta: 0 });
  const [isCrawling, setIsCrawling] = useState(false);
  const [allUrls, setAllUrls] = useState<string[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const urlsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = loadOnboardingState();
    if (saved && saved.allUrls.length > 0) {
      setWebsiteUrl(saved.websiteUrl);
      setAllUrls(saved.allUrls);
      setSelectedUrls(new Set(saved.selectedUrls));
      setStep('selection');
    }
  }, []);

  useEffect(() => {
    if (step === 'selection') {
      saveOnboardingState({
        websiteUrl,
        selectedUrls: Array.from(selectedUrls),
        allUrls
      });
    }
  }, [step, websiteUrl, selectedUrls, allUrls]);

  useEffect(() => {
    // Only auto-scroll on desktop to avoid jarring mobile experience
    const isMobile = window.innerWidth < 768;
    if (!isMobile && logEndRef.current && crawlLogs.length > 0) {
      setTimeout(() => {
        const logContainer = document.querySelector('.crawl-activity-container');
        if (logContainer) {
          logContainer.scrollTop = logContainer.scrollHeight;
        }
      }, 100);
    }
  }, [crawlLogs]);

  useEffect(() => {
    // Only auto-scroll on desktop to avoid jarring mobile experience
    const isMobile = window.innerWidth < 768;
    if (!isMobile && urlsEndRef.current && discoveredUrls.length > 0) {
      setTimeout(() => {
        const urlsContainer = document.getElementById('urls-container');
        if (urlsContainer) {
          urlsContainer.scrollTop = urlsContainer.scrollHeight;
        }
      }, 100);
    }
  }, [discoveredUrls]);

  const handleReset = () => {
    setStep('input');
    setWebsiteUrl('');
    setAllUrls([]);
    setSelectedUrls(new Set());
    setCrawlLogs([]);
    setDiscoveredUrls([]);
    setCrawlStats({ discovered: 0, visited: 0, queued: 0, eta: 0 });
  };

  const handleStartCrawl = async () => {
    if (!websiteUrl) return;

    let url = websiteUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    setStep('crawling');
    setIsCrawling(true);
    setCrawlLogs([]);
    setDiscoveredUrls([]);
    setCrawlStats({ discovered: 0, visited: 0, queued: 0, eta: 0 });

    try {
      const urls = await crawlWebsite(url, (progress: CrawlProgress) => {
        if (progress.type === 'log' && progress.message) {
          setCrawlLogs(prev => [...prev, progress.message!]);
        }

        if (progress.type === 'urls' && progress.urls) {
          setDiscoveredUrls(progress.urls);
        }

        if (progress.type === 'progress') {
          setCrawlStats({
            discovered: progress.discovered || 0,
            visited: progress.visited || 0,
            queued: progress.queued || 0,
            eta: progress.eta || 0
          });
        }
      });

      setAllUrls(urls);
      setSelectedUrls(new Set(urls));
      setIsCrawling(false);
      setStep('selection');
    } catch (error) {
      alert('Failed to crawl website. Please check the URL and try again.');
      setStep('input');
      setIsCrawling(false);
    }
  };

  const handleToggleUrl = (url: string) => {
    const newSelected = new Set(selectedUrls);
    if (newSelected.has(url)) {
      newSelected.delete(url);
    } else {
      newSelected.add(url);
    }
    setSelectedUrls(newSelected);
  };

  const handleToggleAll = () => {
    if (selectedUrls.size === allUrls.length) {
      setSelectedUrls(new Set());
    } else {
      setSelectedUrls(new Set(allUrls));
    }
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;

    let url = manualUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      new URL(url);

      if (allUrls.includes(url)) {
        alert('This URL is already in the list');
        return;
      }

      const newUrls = [...allUrls, url];
      setAllUrls(newUrls);
      setSelectedUrls(new Set([...selectedUrls, url]));
      setManualUrl('');
      setShowManualInput(false);
    } catch (error) {
      alert('Please enter a valid URL');
    }
  };

  const handleRemoveUrl = (urlToRemove: string) => {
    const newUrls = allUrls.filter(url => url !== urlToRemove);
    setAllUrls(newUrls);
    const newSelected = new Set(selectedUrls);
    newSelected.delete(urlToRemove);
    setSelectedUrls(newSelected);
  };

  const handleProceedToPayment = () => {
    if (selectedUrls.size === 0) {
      alert('Please select at least one URL');
      return;
    }

    const price = calculatePrice(selectedUrls.size);
    if (price === -1) {
      alert('Please select up to 1000 URLs or contact us for custom pricing');
      return;
    }

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    navigate('/checkout', {
      state: {
        websiteUrl,
        selectedUrls: Array.from(selectedUrls),
        totalUrls: selectedUrls.size,
        price
      }
    });
  };

  const price = calculatePrice(selectedUrls.size);
  const canProceed = price !== -1;

  if (step === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <nav className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
          <Logo />
          <button
            onClick={() => navigate('/')}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 font-medium transition"
          >
            Back to Home
          </button>
        </nav>

        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
              Let's Get Started
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 text-center">
              Enter your website URL and we'll create your free demo chatbot
            </p>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base sm:text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
                onKeyPress={(e) => e.key === 'Enter' && handleStartCrawl()}
              />

              <button
                onClick={handleStartCrawl}
                disabled={!websiteUrl}
                className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Let's Go
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'crawling') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <nav className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
          <Logo />
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 font-medium transition"
          >
            <RotateCcw size={18} />
            <span className="hidden sm:inline">Try Another URL</span>
            <span className="sm:hidden">Reset</span>
          </button>
        </nav>

        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="relative">
                  <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 animate-spin" />
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Crawling Your Website
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Discovering and analyzing pages in real-time...
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-sm text-gray-600 mb-1">Discovered</div>
                <div className="text-3xl font-bold text-blue-600">
                  {discoveredUrls.length}
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-sm text-gray-600 mb-1">In Queue</div>
                <div className="text-3xl font-bold text-orange-600">
                  {crawlStats.queued}
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Est. Time</div>
                  <div className="text-3xl font-bold text-green-600">
                    {crawlStats.eta > 0 ? `${crawlStats.eta}s` : '-'}
                  </div>
                </div>
                <Clock className="text-green-500" size={24} />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="text-blue-600" size={20} />
                  Crawl Activity
                </h3>
                <div className="bg-gray-900 rounded-lg p-4 h-64 md:h-96 overflow-y-auto font-mono text-sm crawl-activity-container">
                  {crawlLogs.map((log, index) => (
                    <div
                      key={index}
                      className="text-green-400 mb-1 animate-in fade-in slide-in-from-bottom-2"
                    >
                      <span className="text-gray-500">&gt;</span> {log}
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={20} />
                  Discovered URLs ({discoveredUrls.length})
                </h3>
                <div className="h-64 md:h-96 overflow-y-auto space-y-2" id="urls-container">
                  {discoveredUrls.slice(-50).map((url, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm animate-in fade-in"
                    >
                      <CheckCircle className="text-green-500 flex-shrink-0" size={14} />
                      <span className="text-gray-700 truncate">{url}</span>
                    </div>
                  ))}
                  <div ref={urlsEndRef} />
                </div>
              </div>
            </div>

            {!isCrawling && discoveredUrls.length > 0 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setStep('selection')}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition"
                >
                  Continue to Selection
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <nav className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
        <Logo />
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          <RotateCcw size={18} />
          <span className="hidden sm:inline">Try Another URL</span>
          <span className="sm:hidden">Reset</span>
        </button>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Select Pages to Train
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Choose which pages to include in your free demo chatbot
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 min-w-0">
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="flex flex-col gap-4 mb-6">
                  <div className="text-2xl font-bold text-gray-900">
                    {allUrls.length} URLs Total
                  </div>
                  <div className="flex flex-col xs:flex-row gap-2 w-full">
                    <button
                      onClick={() => setShowManualInput(!showManualInput)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex-1 text-sm sm:text-base"
                    >
                      <Plus size={18} />
                      <span className="hidden sm:inline">Add URL</span>
                      <span className="sm:hidden">Add</span>
                    </button>
                    <button
                      onClick={handleToggleAll}
                      className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition flex-1 text-sm sm:text-base"
                    >
                      {selectedUrls.size === allUrls.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                </div>

                {showManualInput && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add URL Manually
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={manualUrl}
                        onChange={(e) => setManualUrl(e.target.value)}
                        placeholder="https://example.com/page"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddManualUrl()}
                      />
                      <button
                        onClick={handleAddManualUrl}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowManualInput(false);
                          setManualUrl('');
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      You can add URLs from any domain. They will be included in the final price calculation.
                    </p>
                  </div>
                )}

                <div className="max-h-[600px] overflow-y-auto space-y-2">
                  {allUrls.map((url) => (
                    <div
                      key={url}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition min-w-0"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUrls.has(url)}
                        onChange={() => handleToggleUrl(url)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                      />
                      <span className="text-xs sm:text-sm text-gray-700 truncate flex-1 break-words">{url}</span>
                      <button
                        onClick={() => handleRemoveUrl(url)}
                        className="text-red-500 hover:text-red-700 transition p-1 flex-shrink-0"
                        title="Remove URL"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 min-w-0">
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100 lg:sticky lg:top-6 overflow-hidden">
                <div className="flex items-center gap-2 mb-6">
                  <DollarSign className="text-blue-600 flex-shrink-0" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">Pricing</h3>
                </div>

                <div className="mb-6">
                  <div className="text-gray-600 mb-2 text-sm">Selected URLs</div>
                  <div className="text-4xl font-bold text-gray-900">{selectedUrls.size}</div>
                </div>

                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="text-gray-600 text-sm mb-1">Estimated Price</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {canProceed ? formatPrice(price) : 'Custom'}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Get your free demo first, then upgrade when ready
                  </p>
                </div>

                {!canProceed && (
                  <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-xs sm:text-sm text-orange-800">
                      Please select up to 1000 URLs or contact us for custom pricing
                    </p>
                  </div>
                )}

                <button
                  onClick={handleProceedToPayment}
                  disabled={selectedUrls.size === 0 || !canProceed}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Get Free Demo Chatbot
                </button>

                <div className="mt-6 pt-6 border-t border-gray-200 text-xs text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span>1-10 URLs</span>
                    <span className="font-semibold">$100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>11-50 URLs</span>
                    <span className="font-semibold">$200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>51-200 URLs</span>
                    <span className="font-semibold">$500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>201-500 URLs</span>
                    <span className="font-semibold">$900</span>
                  </div>
                  <div className="flex justify-between">
                    <span>501-1000 URLs</span>
                    <span className="font-semibold">$1,200</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="signup"
      />
    </div>
  );
}
