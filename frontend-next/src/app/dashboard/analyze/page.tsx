'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchIcon, TrendingUpIcon, TrendingDownIcon, AlertCircleIcon, CheckCircleIcon, DownloadIcon, Share2Icon, Volume2Icon } from 'lucide-react';
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

  // Auto-run analysis if asset was provided via URL
  useEffect(() => {
    const urlAsset = searchParams.get('asset');
    if (urlAsset && !isAnalyzing && !analysisData) {
      setAsset(urlAsset.toUpperCase());
      // Small delay to let state settle
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

    // Populate opinions for display
    if (demoData.market_analysis && demoData.market_analysis.council_opinions) {
        const opinions = demoData.market_analysis.council_opinions.map((op: string, idx: number) => {
                const agentNames = ['🦅 Macro Hawk', '🔬 Micro Forensic', '💧 Flow Detective', '📊 Tech Interpreter', '🤔 Skeptic'];
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
      const response = await fetch(
        `${API_BASE_URL}/analyze-asset-stream?asset=${encodeURIComponent(assetSymbol)}&user_id=${encodeURIComponent(userId)}`
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line);
            handleStreamEvent(event);
          } catch (e) {
            console.error('Error parsing JSON stream:', e);
          }
        }
      }

      setStatusMessage('Analysis complete');
    } catch (error: any) {
      console.error('Analysis failed:', error);
      setStatusMessage('Analysis failed. Switching to Demo Mode.');
      alert(`Analysis failed: ${error.message}. Switching to Demo Mode.`);
      await executeDemoSimulation();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runAnalysis = async () => {
    await runAnalysisForAsset(asset);
  };

  const handleStreamEvent = (event: any) => {
    if (event.type === 'status') {
      setStatusMessage(event.message);
    } else if (event.type === 'agent_result') {
      const newOpinion: AgentOpinion = {
        agentName: event.agent || event.data?.agent_name || 'Agent',
        thesis: event.data?.thesis || '',
        confidence: event.data?.confidence || 'MEDIUM',
        supportingPoints: event.data?.supporting_points || [],
      };
      setAgentOpinions(prev => [...prev, newOpinion]);
    } else if (event.type === 'complete' || event.type === 'debate_complete') {
      setAnalysisData(event.data);
      
      // Parse agent opinions if not already set
      if (event.data?.market_analysis?.council_opinions && agentOpinions.length === 0) {
        const opinions = event.data.market_analysis.council_opinions.map((op: string, idx: number) => {
          const agentNames = ['🦅 Macro Hawk', '🔬 Micro Forensic', '💧 Flow Detective', '📊 Tech Interpreter', '🤔 Skeptic'];
          return {
            agentName: agentNames[idx] || 'Agent',
            thesis: op.replace(/^[^\s]+\s/, ''),
            confidence: 'HIGH',
          };
        });
        setAgentOpinions(opinions);
      }
    } else if (event.type === 'error') {
      setStatusMessage(`Error: ${event.message}`);
    }
  };

  const downloadReport = () => {
    if (!analysisData) return;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const symbol = analysisData.asset || asset;
    
    let content = `# TensorTrade Analysis Report\n\n`;
    content += `**Asset:** ${symbol}\n`;
    content += `**Generated:** ${new Date().toLocaleString()}\n`;
    content += `**User:** ${userId}\n\n`;
    content += `---\n\n`;
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analyze Asset</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Get multi-agent AI analysis with behavioral insights and Shariah compliance
        </p>
      </div>

      {/* Analysis Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Asset Symbol
            </label>
            <input
              type="text"
              value={asset}
              onChange={(e) => setAsset(e.target.value.toUpperCase())}
              placeholder="e.g., AAPL, TSLA, BTC-USD"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg font-mono"
              disabled={isAnalyzing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              User ID (Optional)
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="user_123"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isAnalyzing}
            />
          </div>
        </div>

        {/* Include Options */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Analysis Components
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(includeOptions).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setIncludeOptions(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  disabled={isAnalyzing}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{key}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isAnalyzing ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {statusMessage}
            </span>
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={runAnalysis}
          disabled={isAnalyzing || !asset}
          className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
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
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <DownloadIcon className="w-4 h-4" />
              Download Report
            </button>
            <button
              onClick={playNarrative}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <Volume2Icon className="w-4 h-4" />
              Play Audio
            </button>
            <button
              onClick={shareToX}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <Share2Icon className="w-4 h-4" />
              Share
            </button>
          </div>

          {/* Market Context */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Price</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                AED {analysisData.market_analysis?.market_context?.price?.toFixed(2) || '--'}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">Change</p>
              <p className={`text-2xl font-bold mt-1 ${
                analysisData.market_analysis?.market_context?.move_direction === 'UP' ? 'text-green-600' : 'text-red-600'
              }`}>
                {analysisData.market_analysis?.market_context?.move_direction === 'UP' ? '+' : '-'}
                {analysisData.market_analysis?.market_context?.change_pct || '0'}%
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">Volume</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {analysisData.market_analysis?.market_context?.volume?.toLocaleString() || '--'}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">Risk Index</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {analysisData.market_metrics?.risk_index || '--'}/100
              </p>
            </div>
          </div>

          {/* 5-Agent Debate */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              5-Agent Debate Council
            </h2>
            <div className="space-y-4">
              {agentOpinions.map((opinion, idx) => {
                const agentColors = [
                  'border-blue-500',
                  'border-green-500',
                  'border-purple-500',
                  'border-yellow-500',
                  'border-red-500',
                ];
                return (
                  <div
                    key={idx}
                    className={`border-l-4 ${agentColors[idx]} bg-gray-50 dark:bg-gray-700 p-4 rounded-r-lg`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {opinion.agentName}
                      </h3>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-xs font-semibold rounded">
                        {opinion.confidence}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{opinion.thesis}</p>
                    {opinion.supportingPoints && opinion.supportingPoints.length > 0 && (
                      <ul className="mt-2 ml-4 list-disc text-sm text-gray-600 dark:text-gray-400">
                        {opinion.supportingPoints.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Consensus & Disagreements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                Consensus Points
              </h3>
              <ul className="space-y-2">
                {analysisData.market_analysis?.consensus?.map((point: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertCircleIcon className="w-5 h-5 text-yellow-600" />
                Disagreements
              </h3>
              <ul className="space-y-2">
                {analysisData.market_analysis?.disagreements?.map((point: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">⚠</span>
                    <span className="text-gray-700 dark:text-gray-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Shariah Compliance */}
          {analysisData.shariah_compliance && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Shariah Compliance
              </h2>
              <div className="flex items-center gap-6">
                <div className={`text-6xl ${analysisData.shariah_compliance.compliant ? 'text-green-600' : 'text-red-600'}`}>
                  {analysisData.shariah_compliance.compliant ? '✓' : '✗'}
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analysisData.shariah_compliance.compliant ? 'Halal' : 'Haram'}
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                    Score: {analysisData.shariah_compliance.score}/100
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                    {analysisData.shariah_compliance.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Narrative */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              AI Narrative
            </h2>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg">
              {analysisData.narrative?.styled_message || analysisData.narrative?.summary || 'No narrative available'}
            </p>
          </div>

          {/* Behavioral Analysis */}
          {analysisData.behavioral_analysis?.flags && analysisData.behavioral_analysis.flags.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Behavioral Insights
              </h2>
              <div className="space-y-3">
                {analysisData.behavioral_analysis.flags.map((flag: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <AlertCircleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {flag.pattern || 'Pattern Detected'}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <SearchIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Ready to Analyze
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Enter an asset symbol above and click "Generate Analysis" to get started
          </p>
        </div>
      )}
    </div>
  );
}
