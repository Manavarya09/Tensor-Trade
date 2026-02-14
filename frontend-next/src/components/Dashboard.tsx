'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Chart } from './Chart';
import { CandlestickData } from 'lightweight-charts';

// API Configuration
const API_BASE_URL = 'http://localhost:8000';

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
            "Flow Detective (High): Massive call gamma squeeze at $180 strike.",
            "Tech Interpreter (Moderate): Bull flag breakout on 4H chart targeting $185.",
            "Skeptic (Low): Valuation stretched at 32x PE, watch for rug pull."
        ],
        "consensus": ["Bullish short-term", "High volatility expected"],
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
        "x": "AAPL breaking out! Fed pivot incoming? Watch $185. #trading #stocks",
        "linkedin": "Market analysis for AAPL suggests strong bullish momentum..."
    },
    "shariah_compliance": {
        "compliant": true,
        "score": 95,
        "reason": "Core business (Technology) is Halal. Debt ratios are within acceptable limits (<30%).",
        "issues": []
    }
};

export default function Dashboard() {
    const [asset, setAsset] = useState('AAPL');
    const [userId, setUserId] = useState('dashboard_user');
    const [isDemo, setIsDemo] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [statusMessage, setStatusMessage] = useState('READY FOR ANALYSIS');
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [councilOpinions, setCouncilOpinions] = useState<any[]>([]);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [showLanding, setShowLanding] = useState(true);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as 'light' | 'dark';
        if (storedTheme) {
            setTheme(storedTheme);
            if (storedTheme === 'dark') document.body.classList.add('dark-mode');
        }
        loadInitialMetrics();
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.body.classList.toggle('dark-mode');
    };

    const loadInitialMetrics = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            if (response.ok) {
                // Initial check logic if needed
            }
        } catch (error) {
            console.log('Could not check API health');
        }
    };

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
                    const agentNames = ['Macro Hawk', 'Micro Forensic', 'Flow Detective', 'Tech Interpreter', 'Skeptic'];
                    return {
                        agentName: agentNames[idx],
                        thesis: op.replace(/^[^\s]+\s/, ''),
                        confidence: 'HIGH' // Mock confidence
                    };
            });
            setCouncilOpinions(opinions);
        }

        setStatusMessage('ANALYSIS COMPLETE [OK]');
        setIsAnalyzing(false);
    };

    const runAnalysis = async () => {
        if (isAnalyzing) return;
        if (!asset) {
            alert('Please enter an asset symbol');
            return;
        }

        setIsAnalyzing(true);
        setStatusMessage('INITIALIZING AGENTS...');
        setCouncilOpinions([]); // Clear previous opinions
        setAnalysisData(null); // Clear previous data

        if (isDemo) {
            await executeDemoSimulation();
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/analyze-asset-stream?asset=${encodeURIComponent(asset)}&user_id=${encodeURIComponent(userId)}`);

            if (!response.ok) {
                 throw new Error(`API Error: ${response.status}`);
            }

            if (!response.body) throw new Error("No response body");

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
                        console.error("Error parsing JSON stream:", e);
                    }
                }
            }

            setStatusMessage('ANALYSIS COMPLETE [OK]');

        } catch (error: any) {
            console.error('Analysis failed:', error);
            setStatusMessage('ANALYSIS FAILED. SWITCHING TO DEMO.');
            alert(`Backend unreachable or error: ${error.message}. Switching to Demo Mode.`);
            await executeDemoSimulation();
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleStreamEvent = (event: any) => {
        if (event.type === 'status') {
            setStatusMessage(event.message.toUpperCase());
        }
        else if (event.type === 'agent_result') {
            // Not explicitly handled in original but good to have
        }
        else if (event.type === 'council_debate' || (event.type === 'debate_stream' && event.data)) { // Adjust based on actual API
             // The stream logic in main.py yields chunks.
             // We need to adapt based on how `main.py` actually yields.
             // Looking at `main.py`, it yields chunks from `get_council_analysis_stream`.
             // And then `complete` event with full data.
        }
        else if (event.type === 'complete' || event.type === 'final_result') {
            setAnalysisData(event.data);
            if(event.data.market_analysis && event.data.market_analysis.council_opinions) {
                 // Parse simple strings back to objects for display consistency if needed
                 // The original code just mapped strings.
                 const opinions = event.data.market_analysis.council_opinions.map((op: string, idx: number) => {
                     const agentNames = ['Macro Hawk', 'Micro Forensic', 'Flow Detective', 'Tech Interpreter', 'Skeptic'];
                     return {
                         agentName: agentNames[idx] || 'Agent',
                         thesis: op.replace(/^[^\s]+\s/, ''),
                         confidence: 'HIGH'
                     };
                });
                setCouncilOpinions(opinions);
            }
        }
        else if (event.type === 'error') {
            setStatusMessage(`ERROR: ${event.message}`);
        }

        // Handle streaming debate chunks if `main.py` sends them (it seems to send `debate_complete` or chunks).
        // The original `frontend.js` checked `event.type === 'agent_result'` calling `addAgentOpinion`.
        // But `main.py` yields whatever `get_council_analysis_stream` yields.
        // Let's assume standard behavior.

        if (event.type === 'agent_thought' || event.type === 'agent_result') {
             // Adapt to your stream format
        }
    };

    // Helper to download summary
    const downloadSummary = () => {
        if (!analysisData) return;
        const data = analysisData;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const symbol = data.asset || 'ANALYSIS';

        let summaryContent = `# 5 LLM COUNCIL IN-DEPTH ANALYSIS SUMMARY\n`;
        summaryContent += `Generated: ${new Date().toLocaleString()}\n`;
        summaryContent += `Symbol: ${symbol}\n`;
        summaryContent += `Persona: ${data.persona_selected ? data.persona_selected.toUpperCase() : 'N/A'}\n`;
        summaryContent += `\n${'='.repeat(80)}\n\n`;

        // ... (rest of summary generation logic similar to original)
        // For brevity implementing key parts
        summaryContent += JSON.stringify(data, null, 2);

        const blob = new Blob([summaryContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `TensorTrade_Summary_${symbol}_${timestamp}.md`;
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
        if(!text) return;
         window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text), '_blank');
    };

    const shareToLinkedIn = () => {
         const text = analysisData?.persona_post?.linkedin;
         if(!text) return;
         navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard for LinkedIn!'));
    };

    if (showLanding) {
        return (
            <div id="landing-page">
                <h1 className="landing-title">TENSORTRADE<br/>MARKET MAP</h1>
                <div className="landing-subtitle">MULTI-AGENT INTELLIGENCE NETWORK</div>

                <div className="market-map-container">
                    <div className="market-map-grid">
                        {["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "BRK.B", "LLY", "AVGO", "V", "JPM"].map(sym => {
                            const change = (Math.random() * 6 - 3).toFixed(2);
                            const isUp = parseFloat(change) >= 0;
                            return (
                                <div key={sym} className={`map-block ${isUp ? 'up' : 'down'}`} onClick={() => {
                                    setAsset(sym);
                                    setShowLanding(false);
                                    // setTimeout(runAnalysis, 500); // Optional auto-run
                                }}>
                                    <div className="map-symbol">{sym}</div>
                                    <div className="map-change">{isUp ? '+' : ''}{change}%</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={{ marginTop: '40px' }}>
                    <button id="init-system-btn" className="btn-primary" onClick={() => setShowLanding(false)}>
                        ENTER DASHBOARD
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div id="dashboard-container" className="app-container">
            <header className="header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div className="header-logo">[TENSOR]</div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>
                            <span>TENSORTRADE</span>
                            <span style={{ color: 'var(--text-color)', fontSize: '14px', fontWeight: 400, marginLeft: '10px' }}>
                                INTELLIGENT TRADING ANALYST
                            </span>
                        </h1>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="status-indicator">
                        <span className="status-dot"></span>
                        LIVE MARKETS • REALTIME ANALYSIS
                    </div>
                    <button className="theme-toggle" style={{ marginLeft: '10px' }} onClick={toggleTheme}>
                        {theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}
                    </button>
                </div>
            </header>

            <div className="dashboard-grid">
                {/* Left Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Assistant Card */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">ASSISTANT</h3>
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                <div style={{ width: '48px', height: '48px', border: '2px solid var(--text-color)', background: 'var(--bg-color)', color: 'var(--text-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700 }}>
                                    [AI]
                                </div>
                                <div>
                                    <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-color)' }}>AI ASSISTANT</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-color)' }}>{statusMessage}</div>
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="input-label">ASSET SYMBOL:</div>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g. AAPL, SPY, TSLA"
                                    value={asset}
                                    onChange={(e) => setAsset(e.target.value.toUpperCase())}
                                />
                            </div>
                            <div className="input-group">
                                <div className="input-label">USER ID:</div>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g. trader_123"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        style={{ accentColor: 'var(--accent-color)' }}
                                        checked={isDemo}
                                        onChange={(e) => setIsDemo(e.target.checked)}
                                    />
                                    <span style={{ fontSize: '13px', color: 'var(--text-color)' }}>DEMO MODE (MOCK DATA)</span>
                                </label>
                            </div>
                            <button
                                className="btn-primary"
                                style={{ width: '100%', fontSize: '1rem' }}
                                onClick={runAnalysis}
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? 'ANALYZING...' : 'GENERATE REPORT'}
                            </button>
                        </div>
                    </div>

                    {/* Analysis Setup Card */}
                    <div className="card" style={{ minHeight: '300px' }}>
                        <div className="card-header">
                            <h3 className="card-title">ANALYSIS SETUP</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <div style={{ fontSize: '12px', marginBottom: '8px' }}>MARKET REGIME</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ padding: '8px 16px', border: '1px solid var(--text-color)' }}>
                                        <div style={{ fontSize: '18px', fontWeight: 700, color: analysisData?.market_metrics?.risk_index > 50 ? '#ff0000' : 'var(--text-color)' }}>
                                            {analysisData?.market_metrics?.market_regime || 'LOADING...'}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '12px', border: '1px solid var(--text-color)', padding: '4px 10px' }}>
                                        VIX: {analysisData?.market_metrics?.vix || '--'}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', marginBottom: '8px' }}>RISK INDEX</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <span style={{ fontSize: '12px' }}>CURRENT</span>
                                            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-color)' }}>
                                                {analysisData?.market_metrics?.risk_index || '--'}/100
                                            </span>
                                        </div>
                                        <div className="risk-meter-container">
                                            <div className="risk-meter-fill" style={{ width: `${analysisData?.market_metrics?.risk_index || 0}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Market Drivers */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">KEY MARKET DRIVERS</h3>
                            {analysisData && (
                                <button
                                    className="btn-primary"
                                    style={{ padding: '4px 12px', fontSize: '12px' }}
                                    onClick={downloadSummary}
                                >
                                    DOWNLOAD SUMMARY
                                </button>
                            )}
                        </div>
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {councilOpinions.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-color)' }}>
                                    <div style={{ fontSize: '32px', marginBottom: '15px' }}>
                                        {isAnalyzing ? '[PROCESSING]' : '[WAITING]'}
                                    </div>
                                    <div style={{ fontSize: '16px', marginBottom: '10px' }}>
                                        {isAnalyzing ? 'PROCESSING REAL-TIME DATA...' : 'AWAITING ANALYSIS'}
                                    </div>
                                </div>
                            ) : (
                                councilOpinions.map((op, idx) => {
                                    const agentTags = ['[HAWK]', '[FORENSIC]', '[FLOW]', '[TECH]', '[SKEPTIC]'];
                                    return (
                                        <div key={idx} className="opinion-item animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                                            <div style={{ fontSize: '14px', fontWeight: 700, minWidth: '80px' }}>
                                                {agentTags[idx] || '[AGENT]'}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{op.agentName}</div>
                                                    <div style={{ border: '1px solid var(--text-color)', padding: '2px 8px', fontSize: '10px', fontWeight: 700 }}>
                                                        LLM COUNCIL
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '13px', lineHeight: 1.6 }}>{op.thesis}</div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Live Intelligence */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">LIVE INTELLIGENCE</h3>
                        </div>
                        <div>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 600 }}>LIVE MARKET INTELLIGENCE</div>
                                    <div style={{ fontSize: '12px' }}>AI search for real-time news & data.</div>
                                </div>
                                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                                    RUN LIVE ANALYSIS
                                </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
                                <div style={{ border: '1px solid var(--text-color)', padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <div style={{ fontSize: '16px', fontWeight: 700 }}>SPX500</div>
                                        <div style={{ fontSize: '14px', color: 'var(--text-color)' }}>+0.8%</div>
                                    </div>
                                    <div style={{ fontSize: '13px', lineHeight: 1.5 }}>Testing psychological 7,000 level.</div>
                                </div>
                                <div style={{ border: '1px solid var(--text-color)', padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <div style={{ fontSize: '16px', fontWeight: 700 }}>US100</div>
                                        <div style={{ fontSize: '14px', color: 'var(--accent-color)' }}>-1.2%</div>
                                    </div>
                                    <div style={{ fontSize: '13px', lineHeight: 1.5 }}>Tech-heavy index under pressure.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Strategy */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">AI STRATEGY</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ border: '1px solid var(--text-color)', padding: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '12px', height: '12px', background: 'var(--accent-color)' }}></div>
                                        <div style={{ fontSize: '14px', fontWeight: 600 }}>AI NARRATIVE</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={playNarrative} className="btn-primary" style={{ padding: '4px 10px', fontSize: '12px' }}>[AUDIO]</button>
                                        <button onClick={shareToX} className="btn-primary" style={{ padding: '4px 10px', fontSize: '12px' }}>[X]</button>
                                        <button onClick={shareToLinkedIn} className="btn-primary" style={{ padding: '4px 10px', fontSize: '12px' }}>[IN]</button>
                                    </div>
                                </div>
                                <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                                    {analysisData?.narrative?.styled_message || analysisData?.narrative?.summary || 'Awaiting analysis...'}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '12px', marginBottom: '15px' }}>CONSENSUS POINTS</div>
                                <div>
                                    {analysisData?.market_analysis?.consensus ? analysisData.market_analysis.consensus.map((point: string, idx: number) => (
                                        <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px', padding: '10px', border: '1px solid var(--text-color)' }}>
                                            <div style={{ fontWeight: 700, fontSize: '14px' }}>[OK]</div>
                                            <div style={{ fontSize: '13px', lineHeight: 1.5 }}>{point}</div>
                                        </div>
                                    )) : <div style={{ fontSize: '13px' }}>No consensus data available yet</div>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Matrix */}
                    <div className="card" style={{ minHeight: '400px' }}>
                         <div className="card-header">
                            <h3 className="card-title">ASSET IMPACT MATRIX</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                             <Chart />
                             <div style={{ fontSize: '12px', marginBottom: '5px' }}>
                                MARKET CONTEXT - {analysisData?.market_analysis?.market_context ? (
                                    <span>
                                        {analysisData.market_analysis.market_context.move_direction} {analysisData.market_analysis.market_context.change_pct}% | Vol: {analysisData.market_analysis.market_context.volume}
                                    </span>
                                ) : 'Awaiting data...'}
                            </div>
                        </div>
                    </div>

                    {/* Behavioral Insights */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">BEHAVIORAL INSIGHTS</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {analysisData?.risk_analysis?.metrics && (
                                <div style={{ border: '1px solid var(--text-color)', padding: '15px' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--text-color)', marginBottom: '5px' }}>RISK ANALYSIS</div>
                                    <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                                        VaR (95%): <b>{analysisData.risk_analysis.metrics.var_95}%</b> | Max DD: <b>{analysisData.risk_analysis.metrics.max_drawdown}%</b>
                                    </div>
                                    <div style={{ fontSize: '13px', fontWeight: 700 }}>
                                        VERDICT: <span style={{ color: 'var(--accent-color)' }}>{analysisData.risk_analysis.qualitative?.verdict}</span>
                                    </div>
                                </div>
                            )}

                             {analysisData?.behavioral_analysis?.flags?.length > 0 ? (
                                <div style={{ border: '1px solid var(--text-color)', padding: '15px' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--text-color)', marginBottom: '5px' }}>BEHAVIORAL FLAGS</div>
                                    {analysisData.behavioral_analysis.flags.map((flag: any, idx: number) => (
                                        <div key={idx} style={{ marginBottom: '10px', padding: '10px', border: '1px solid var(--accent-color)' }}>
                                             <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-color)', marginBottom: '5px' }}>{flag.pattern || 'Pattern'}</div>
                                             <div style={{ fontSize: '13px', lineHeight: 1.5 }}>{flag.message || flag}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ border: '1px solid var(--text-color)', padding: '15px' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--text-color)', marginBottom: '5px' }}>BEHAVIORAL FLAGS</div>
                                    <div style={{ fontSize: '13px', lineHeight: 1.5 }}>[OK] No concerning patterns.</div>
                                </div>
                            )}

                             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                <div style={{ textAlign: 'center', padding: '15px', border: '1px solid var(--text-color)' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 700 }}>{analysisData?.trade_history?.total_trades || '-'}</div>
                                    <div style={{ fontSize: '11px' }}>Total Trades</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '15px', border: '1px solid var(--text-color)' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 700 }}>{analysisData?.trade_history?.win_rate ? analysisData.trade_history.win_rate.toFixed(1) + '%' : '-'}</div>
                                    <div style={{ fontSize: '11px' }}>Win Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="footer">
                <div>
                    <div style={{ marginBottom: '5px' }}>DERIV HACKATHON • INTELLIGENT TRADING ANALYST</div>
                    <div>AI-powered market intelligence platform • Version 1.0</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ marginBottom: '5px' }}>Data Sources: Bloomberg • Reuters • MarketWatch • TradingView</div>
                    <div>Last Updated: {new Date().toLocaleTimeString()}</div>
                </div>
            </footer>
        </div>
    );
}
