'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchIcon, DownloadIcon, Share2Icon, Volume2Icon } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface AgentOpinion {
  agentName: string;
  thesis: string;
  confidence: string;
  supportingPoints?: string[];
}

const DEMO_DATA = {
    "asset": "AAPL",
    "persona_selected": "Coach",
    "market_metrics": {
        "vix": 18.5,
        "market_regime": "BULLISH VOLATILE",
        "risk_index": 65,
        "risk_level": "ELEVATED",
        "regime_color": "#ff0000"
    },
    "market_analysis": {
        "council_opinions": [
            "Macro Hawk (High): Fed pivot priced in, yield curve steepening favors growth.",
            "Micro Forensic (Moderate): Margins compressing but services revenue +12% YoY.",
            "Flow Detective (High): Massive call gamma squeeze at AED 661 strike.",
            "Tech Interpreter (Moderate): Bull flag breakout on 4H chart targeting AED 679.",
            "Skeptic (Low): Valuation stretched at 32x PE, watch for rug pull."
        ],
        "consensus": ["Bullish short-term", "High volatility expected"],
        "disagreements": ["Valuation concerns vs Momentum", "Fed rate cut timing"],
        "market_context": {
            "price": 178.45,
            "move_direction": "UP",
            "change_pct": "2.3",
            "volume": 85000000
        }
    },
    "narrative": {
        "styled_message": "Listen up. The market is handing you a gift with this volatility, but don't get greedy. Technicals scream breakout, but that risk index at 65 means chop is incoming. Stick to the plan or get wrecked.",
        "persona_selected": "Coach"
    },
    "behavioral_analysis": {
        "flags": [
            { "pattern": "FOMO", "message": "Chasing breakout candles" },
            { "pattern": "Overtrading", "message": "15 trades in 2 hours" }
        ]
    },
    "trade_history": {
        "total_trades": 42,
        "win_rate": 58.5,
        "total_pnl": 1250.50
    },
    "economic_calendar": {
        "summary": "CPI data released lower than expected, fueling rate cut bets.",
        "economic_events": ["CPI YoY 2.9% vs 3.1% exp", "FOMC Meeting Minutes"]
    },
    "persona_post": {
        "x": "AAPL breaking out! Fed pivot incoming? Watch AED 679. #trading #stocks",
        "linkedin": "Market analysis for AAPL suggests strong bullish momentum..."
    },
    "shariah_compliance": {
        "compliant": true,
        "score": 95,
        "reason": "Core business (Technology) is Halal. Debt ratios are within acceptable limits (<30%).",
        "issues": []
    }
};

export default function AnalyzePage() {
  const searchParams = useSearchParams();
  const [asset, setAsset] = useState(searchParams.get('asset') || '');
  const [userId, setUserId] = useState('user_123');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Ready to analyze');
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [agentOpinions, setAgentOpinions] = useState<AgentOpinion[]>([]);
  const [includeOptions, setIncludeOptions] = useState({
    debate: true,
    behavioral: true,
    shariah: true,
    calendar: true,
  });

  useEffect(() => {
    const urlAsset = searchParams.get('asset');
    if (urlAsset && !isAnalyzing && !analysisData) {
      setAsset(urlAsset.toUpperCase());
      const timer = setTimeout(() => {
        runAnalysisForAsset(urlAsset.toUpperCase());
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const executeDemoSimulation = async () => {
    console.log("Running in DEMO MODE");
    setStatusMessage('DEMO: SIMULATING ANALYSIS...');

    const steps = [
        "Fetching market data...",
        "Running Macro Hawk...",
        "Running Micro Forensic...",
        "Running Flow Detective...",
        "Running Tech Interpreter...",
        "Running Skeptic...",
        "Synthesizing Narrative..."
    ];

    for (const step of steps) {
        setStatusMessage(step.toUpperCase());
        await new Promise(r => setTimeout(r, 800));
    }

    const demoData = JSON.parse(JSON.stringify(DEMO_DATA));
    demoData.asset = asset;
    setAnalysisData(demoData);

    if (demoData.market_analysis && demoData.market_analysis.council_opinions) {
        const opinions = demoData.market_analysis.council_opinions.map((op: string, idx: number) => {
                const agentNames = ['Macro Hawk', 'Micro Forensic', 'Flow Detective', 'Tech Interpreter', 'Skeptic'];
                return {
                    agentName: agentNames[idx] || 'Agent',
                    thesis: op.replace(/^[^\s]+\s/, ''),
                    confidence: 'HIGH',
                    supportingPoints: []
                };
        });
        setAgentOpinions(opinions);
    }

    setStatusMessage('Analysis complete');
    setIsAnalyzing(false);
  };

  const runAnalysisForAsset = async (assetSymbol: string) => {
    if (!assetSymbol) {
      alert('Please enter an asset symbol');
      return;
    }

    setIsAnalyzing(true);
    setStatusMessage('Initializing agents...');
    setAgentOpinions([]);
    setAnalysisData(null);

    try {
      setStatusMessage('Calling analysis endpoint...');

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);

      const response = await fetch(
        `${API_BASE_URL}/analyze-asset?asset=${encodeURIComponent(assetSymbol)}&user_id=${encodeURIComponent(userId)}`,
        {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      setAnalysisData(result);
      setStatusMessage('Analysis complete');
    } catch (error: any) {
      console.error('Analysis failed:', error);
      if (error?.name === 'AbortError') {
        setStatusMessage('Analysis timed out. Switching to Demo Mode...');
      } else {
        setStatusMessage('Analysis failed. Switching to Demo Mode...');
      }
      alert(`Analysis failed: ${error.message}. Switching to Demo Mode.`);
      await executeDemoSimulation();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runAnalysis = async () => {
    await runAnalysisForAsset(asset);
  };

  const downloadReport = () => {
    if (!analysisData) return;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const symbol = analysisData.asset || asset;
    let content = `# TensorTrade Analysis Report\n\n`;
    content += `**Asset:** ${symbol}\n`;
    content += `**Generated:** ${new Date().toLocaleString()}\n`;
    content += `**User:** ${userId}\n\n---\n\n`;
    content += JSON.stringify(analysisData, null, 2);
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TensorTrade_${symbol}_${timestamp}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const playNarrative = () => {
    if (!analysisData?.narrative) return;
    const text = analysisData.narrative.styled_message || analysisData.narrative.summary;
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const shareToX = () => {
    const text = analysisData?.persona_post?.x || analysisData?.narrative?.styled_message;
    if (!text) return;
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text), '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold uppercase">Analyze Asset</h1>
        <p className="mt-1 text-sm text-gray-600">
          Get multi-agent AI analysis with behavioral insights and Shariah compliance
        </p>
      </div>

      {/* Analysis Input */}
      <div className="border-4 border-black bg-white p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase mb-2">Asset Symbol</label>
            <input
              type="text"
              value={asset}
              onChange={(e) => setAsset(e.target.value.toUpperCase())}
              placeholder="e.g., AAPL, TSLA, BTC-USD"
              className="w-full px-4 py-3 border-4 border-black font-bold text-lg font-mono placeholder-gray-400 focus:outline-none disabled:opacity-50"
              disabled={isAnalyzing}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-2">User ID (Optional)</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="user_123"
              className="w-full px-4 py-3 border-4 border-black font-bold placeholder-gray-400 focus:outline-none disabled:opacity-50"
              disabled={isAnalyzing}
            />
          </div>
        </div>

        {/* Include Options */}
        <div className="mt-6">
          <label className="block text-xs font-bold uppercase mb-3">Analysis Components</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(includeOptions).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setIncludeOptions(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="w-4 h-4 border-2 border-black accent-black"
                  disabled={isAnalyzing}
                />
                <span className="text-sm font-bold uppercase">{key}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="mt-6 p-4 border-2 border-black bg-gray-50">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 border-2 border-black ${isAnalyzing ? 'bg-black animate-pulse' : 'bg-black'}`}></div>
            <span className="text-sm font-bold uppercase">{statusMessage}</span>
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={runAnalysis}
          disabled={isAnalyzing || !asset}
          className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 bg-black text-white font-bold uppercase text-lg border-4 border-black hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SearchIcon className="w-5 h-5" />
          {isAnalyzing ? 'Analyzing...' : 'Generate Analysis'}
        </button>
      </div>

      {/* Results */}
      {analysisData && (
        <>
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={downloadReport}
              className="flex items-center gap-2 px-4 py-2 border-4 border-black font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors"
            >
              <DownloadIcon className="w-4 h-4" />
              Download Report
            </button>
            <button
              onClick={playNarrative}
              className="flex items-center gap-2 px-4 py-2 border-4 border-black font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors"
            >
              <Volume2Icon className="w-4 h-4" />
              Play Audio
            </button>
            <button
              onClick={shareToX}
              className="flex items-center gap-2 px-4 py-2 border-4 border-black font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors"
            >
              <Share2Icon className="w-4 h-4" />
              Share
            </button>
          </div>

          {/* Market Context */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border-4 border-black bg-white p-6">
              <p className="text-xs font-bold uppercase text-gray-500">Current Price</p>
              <p className="text-2xl font-bold mt-2">
                AED {analysisData.market_analysis?.market_context?.price?.toFixed(2) || '--'}
              </p>
            </div>
            <div className="border-4 border-black bg-white p-6">
              <p className="text-xs font-bold uppercase text-gray-500">Change</p>
              <p className="text-2xl font-bold mt-2">
                {analysisData.market_analysis?.market_context?.move_direction === 'UP' ? '+' : '-'}
                {analysisData.market_analysis?.market_context?.change_pct || '0'}%
              </p>
            </div>
            <div className="border-4 border-black bg-white p-6">
              <p className="text-xs font-bold uppercase text-gray-500">Volume</p>
              <p className="text-2xl font-bold mt-2">
                {analysisData.market_analysis?.market_context?.volume?.toLocaleString() || '--'}
              </p>
            </div>
            <div className="border-4 border-black bg-white p-6">
              <p className="text-xs font-bold uppercase text-gray-500">Risk Index</p>
              <p className="text-2xl font-bold mt-2">
                {analysisData.market_metrics?.risk_index || '--'}/100
              </p>
            </div>
          </div>

          {/* 5-Agent Debate */}
          <div className="border-4 border-black bg-white p-6">
            <h2 className="text-xl font-bold uppercase mb-6 border-b-4 border-black pb-3">
              5-Agent Debate Council
            </h2>
            <div className="space-y-4">
              {agentOpinions.map((opinion, idx) => (
                <div key={idx} className="border-l-4 border-black bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold uppercase">{opinion.agentName}</h3>
                    <span className="px-2 py-1 border-2 border-black text-xs font-bold uppercase">
                      {opinion.confidence}
                    </span>
                  </div>
                  <p className="text-sm">{opinion.thesis}</p>
                  {opinion.supportingPoints && opinion.supportingPoints.length > 0 && (
                    <ul className="mt-2 ml-4 list-disc text-sm text-gray-700">
                      {opinion.supportingPoints.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Consensus & Disagreements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-4 border-black bg-white p-6">
              <h3 className="text-lg font-bold uppercase mb-4 border-b-4 border-black pb-3">
                Consensus Points
              </h3>
              <ul className="space-y-2">
                {analysisData.market_analysis?.consensus?.map((point: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold mt-0.5">+</span>
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-4 border-black bg-white p-6">
              <h3 className="text-lg font-bold uppercase mb-4 border-b-4 border-black pb-3">
                Disagreements
              </h3>
              <ul className="space-y-2">
                {analysisData.market_analysis?.disagreements?.map((point: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold mt-0.5">!</span>
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Shariah Compliance */}
          {analysisData.shariah_compliance && (
            <div className="border-4 border-black bg-white p-6">
              <h2 className="text-xl font-bold uppercase mb-6 border-b-4 border-black pb-3">
                Shariah Compliance
              </h2>
              <div className="flex items-center gap-6">
                <div className="text-6xl font-bold">
                  {analysisData.shariah_compliance.compliant ? '✓' : '✗'}
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold uppercase">
                    {analysisData.shariah_compliance.compliant ? 'Halal' : 'Haram'}
                  </p>
                  <p className="text-sm font-bold uppercase mt-1">
                    Score: {analysisData.shariah_compliance.score}/100
                  </p>
                  <p className="text-sm mt-2">
                    {analysisData.shariah_compliance.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Narrative */}
          <div className="border-4 border-black bg-white p-6">
            <h2 className="text-xl font-bold uppercase mb-4 border-b-4 border-black pb-3">
              AI Narrative
            </h2>
            <p className="leading-relaxed text-lg">
              {analysisData.narrative?.styled_message || analysisData.narrative?.summary || 'No narrative available'}
            </p>
          </div>

          {/* Behavioral Analysis */}
          {analysisData.behavioral_analysis?.flags && analysisData.behavioral_analysis.flags.length > 0 && (
            <div className="border-4 border-black bg-white p-6">
              <h2 className="text-xl font-bold uppercase mb-6 border-b-4 border-black pb-3">
                Behavioral Insights
              </h2>
              <div className="space-y-3">
                {analysisData.behavioral_analysis.flags.map((flag: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-4 border-2 border-black">
                    <span className="font-bold text-lg">!</span>
                    <div>
                      <p className="font-bold uppercase text-sm">
                        {flag.pattern || 'Pattern Detected'}
                      </p>
                      <p className="text-sm mt-1">
                        {flag.message || flag}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!analysisData && !isAnalyzing && (
        <div className="border-4 border-black bg-white p-16 text-center">
          <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold uppercase mb-2">Ready to Analyze</h3>
          <p className="text-gray-600 text-sm">
            Enter an asset symbol above and click "Generate Analysis" to get started
          </p>
        </div>
      )}
    </div>
  );
}
