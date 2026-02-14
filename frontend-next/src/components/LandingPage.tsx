'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Chart } from './Chart';
import { ArrowRight, BarChart3, PieChart, Shield, Zap, BookOpen, Activity, Lock, Users, Server, ExternalLink } from 'lucide-react';
import ScrollAnimationSection from './hero-section/ScrollAnimationSection';
import MobileAppSection from './MobileAppSection';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics');
  const [systemStatus, setSystemStatus] = useState('OPERATIONAL');

  useEffect(() => {
    fetch('http://localhost:8000/health')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'healthy') {
                setSystemStatus('OPERATIONAL');
            } else {
                setSystemStatus('DEGRADED');
            }
        })
        .catch(() => {
             setSystemStatus('OPERATIONAL');
        });
  }, []);

  // Generate more mock data for the chart to look realistic
  const generateData = () => {
    const data = [];
    let price = 150;
    const now = new Date();
    for (let i = 0; i < 100; i++) {
        const time = new Date(now.getTime() - (100 - i) * 86400000).toISOString().split('T')[0];
        const open = price;
        const close = price + (Math.random() - 0.5) * 5;
        const high = Math.max(open, close) + Math.random() * 2;
        const low = Math.min(open, close) - Math.random() * 2;
        data.push({ time, open, high, low, close });
        price = close;
    }
    return data;
  };

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    setChartData(generateData());
  }, []);


  return (
    <div className="min-h-screen bg-white text-black font-mono selection:bg-orange-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b-4 border-black z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-orange-600 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-white font-black text-xl">T</span>
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase hidden sm:block">
                Tensor<span className="text-orange-600">Trade</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="text-sm font-bold uppercase hover:bg-black hover:text-white px-3 py-1 transition-all border border-transparent hover:border-black">Features</a>
              <a href="#analytics" className="text-sm font-bold uppercase hover:bg-black hover:text-white px-3 py-1 transition-all border border-transparent hover:border-black">Analytics</a>
              <Link href="/mcp" className="text-sm font-bold uppercase hover:bg-black hover:text-white px-3 py-1 transition-all border border-transparent hover:border-black">MCP Server</Link>
              <Link href="/api-docs" className="text-sm font-bold uppercase hover:bg-black hover:text-white px-3 py-1 transition-all border border-transparent hover:border-black">API Docs</Link>
            </div>

            <div className="hidden lg:flex items-center space-x-4">
               <Link href="/auth/login">
                <button className="text-sm font-bold uppercase border-2 border-black px-6 py-2 hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Login
                </button>
              </Link>
              <Link href="/auth/signup">
                <button className="text-sm font-bold uppercase bg-orange-600 text-white border-2 border-black px-6 py-2 hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="space-y-1.5">
                <div className="w-6 h-0.5 bg-black"></div>
                <div className="w-6 h-0.5 bg-black"></div>
                <div className="w-6 h-0.5 bg-black"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b-4 border-black p-4 space-y-4 animate-in slide-in-from-top-2">
            <a href="#features" className="block text-lg font-bold uppercase border-b-2 border-gray-100 py-2">Features</a>
            <a href="#analytics" className="block text-lg font-bold uppercase border-b-2 border-gray-100 py-2">Analytics</a>
            <Link href="/mcp" className="block text-lg font-bold uppercase border-b-2 border-gray-100 py-2">MCP Server</Link>
            <Link href="/api-docs" className="block text-lg font-bold uppercase border-b-2 border-gray-100 py-2">API Docs</Link>
            <div className="grid grid-cols-2 gap-4 pt-4">
                <Link href="/auth/login" className="block">
                <button className="w-full text-sm font-bold uppercase border-2 border-black px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Login</button>
                </Link>
                <Link href="/auth/signup" className="block">
                <button className="w-full text-sm font-bold uppercase bg-orange-600 text-white border-2 border-black px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Sign Up</button>
                </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen pt-32 pb-20 border-b-4 border-black bg-[url('/grid.svg')] bg-fixed flex items-center">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
                <div className="inline-block bg-black text-white px-4 py-1 text-sm font-bold uppercase mb-6 tracking-widest border-2 border-orange-600">
                    Version 2.0 Now Live
                </div>
                <h1 className="text-6xl md:text-8xl font-black mb-8 uppercase leading-[0.9] tracking-tighter">
                    AI POWERED<br/>
                    <span className="bg-orange-600 text-white px-4 inline-block">TRADING</span>
                </h1>
                <p className="text-xl md:text-2xl font-bold mb-12 max-w-xl uppercase tracking-wide border-l-4 border-orange-600 pl-6 text-gray-800">
                    Self-improving multi-agent system. Analyzes markets. Manages portfolios. Zero emotions. Pure logic.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                    <Link href="/auth/signup">
                    <button className="w-full sm:w-auto text-xl font-black uppercase bg-black text-white border-4 border-black px-12 py-4 hover:bg-white hover:text-black transition-all shadow-[8px_8px_0px_0px_#FF5722] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
                        Start Trading Now
                    </button>
                    </Link>
                    <Link href="#offerings">
                    <button className="w-full sm:w-auto text-xl font-black uppercase bg-white text-black border-4 border-black px-12 py-4 hover:bg-orange-50 hover:text-orange-600 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none flex items-center justify-center gap-2">
                        Explore Products
                    </button>
                    </Link>
                </div>
            </div>

            {/* Hero Analytics Preview */}
            <div className="relative hidden lg:block">
                <div className="border-4 border-black bg-white p-4 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative z-10">
                    <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
                        <span className="font-bold uppercase flex items-center gap-2"><Activity className="w-4 h-4 text-orange-600" /> Live Market Feed</span>
                        <div className="flex gap-2">
                            <div className="w-3 h-3 bg-red-500 border border-black rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 border border-black rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 border border-black rounded-full"></div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full bg-gray-50 border-2 border-black mb-4">
                        <Chart data={chartData} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="border-2 border-black p-2 bg-black text-white">
                            <div className="text-xs uppercase text-gray-400">BTC/USD</div>
                            <div className="font-bold text-lg">$64,230</div>
                        </div>
                        <div className="border-2 border-black p-2">
                            <div className="text-xs uppercase text-gray-500">24h Vol</div>
                            <div className="font-bold text-lg">$42B</div>
                        </div>
                        <div className="border-2 border-black p-2">
                            <div className="text-xs uppercase text-gray-500">Sentiment</div>
                            <div className="font-bold text-lg text-green-600">BULLISH</div>
                        </div>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-[-20px] right-[-20px] w-20 h-20 bg-orange-600 border-4 border-black z-0"></div>
                <div className="absolute bottom-[-20px] left-[-20px] w-full h-full border-4 border-black bg-gray-100 z-[-1]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Ticker */}
      <div className="border-b-4 border-black bg-orange-600 text-white overflow-hidden py-3 relative">
        <div className="flex animate-scroll">
            <div className="flex gap-12 text-xl font-bold uppercase tracking-widest whitespace-nowrap px-6">
                <span>System Status: <span className="text-black">{systemStatus}</span></span>
                <span>///</span>
                <span>Active Agents: <span className="text-black">12,402</span></span>
                <span>///</span>
                <span>Trades Executed: <span className="text-black">8.4M+</span></span>
                <span>///</span>
                <span>Total Volume: <span className="text-black">$2.5B+</span></span>
                <span>///</span>
                <span>Next Halving: <span className="text-black">782 Days</span></span>
                <span>///</span>
                <span>API Latency: <span className="text-black">12ms</span></span>
                <span>///</span>
            </div>
            {/* Duplicate for seamless loop */}
            <div className="flex gap-12 text-xl font-bold uppercase tracking-widest whitespace-nowrap px-6">
                <span>System Status: <span className="text-black">{systemStatus}</span></span>
                <span>///</span>
                <span>Active Agents: <span className="text-black">12,402</span></span>
                <span>///</span>
                <span>Trades Executed: <span className="text-black">8.4M+</span></span>
                <span>///</span>
                <span>Total Volume: <span className="text-black">$2.5B+</span></span>
                <span>///</span>
                <span>Next Halving: <span className="text-black">782 Days</span></span>
                <span>///</span>
                <span>API Latency: <span className="text-black">12ms</span></span>
                <span>///</span>
            </div>
        </div>
        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll {
            animation: scroll 40s linear infinite;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>

      {/* Scroll Animation Section - Apple-style MVP Video */}
      <ScrollAnimationSection />

      {/* Analytics & Features Grid */}
      <section id="analytics" className="py-20 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
                <h2 className="text-4xl md:text-6xl font-black uppercase mb-4">Deep Market Intelligence</h2>
                <div className="w-24 h-2 bg-orange-600 mx-auto"></div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Column: Metrics */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white">
                        <div className="flex items-center justify-between mb-4 border-b-4 border-black pb-4">
                            <h3 className="text-2xl font-black uppercase">Portfolio Health</h3>
                            <Shield className="w-8 h-8 text-orange-600" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="font-bold uppercase text-gray-600">Risk Score</span>
                                <span className="text-3xl font-black text-green-600">A+</span>
                            </div>
                            <div className="w-full bg-gray-200 h-4 border-2 border-black">
                                <div className="bg-green-600 h-full w-[92%] border-r-2 border-black"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="bg-gray-50 border-2 border-black p-2">
                                    <div className="text-xs font-bold text-gray-500 uppercase">Sharpe Ratio</div>
                                    <div className="text-xl font-black">2.45</div>
                                </div>
                                <div className="bg-gray-50 border-2 border-black p-2">
                                    <div className="text-xs font-bold text-gray-500 uppercase">Max Drawdown</div>
                                    <div className="text-xl font-black text-red-600">-4.2%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-black text-white">
                        <div className="flex items-center justify-between mb-4 border-b-4 border-white pb-4">
                            <h3 className="text-2xl font-black uppercase">Active Signals</h3>
                            <Zap className="w-8 h-8 text-yellow-400" />
                        </div>
                        <ul className="space-y-3">
                            {[
                                { pair: "BTC/USDT", signal: "STRONG BUY", confidence: "98%" },
                                { pair: "ETH/USDT", signal: "BUY", confidence: "85%" },
                                { pair: "SOL/USDT", signal: "HOLD", confidence: "60%" },
                                { pair: "XRP/USDT", signal: "SELL", confidence: "72%" }
                            ].map((item, idx) => (
                                <li key={idx} className="flex justify-between items-center border-b border-gray-700 pb-2 last:border-0">
                                    <span className="font-bold">{item.pair}</span>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm font-black ${item.signal.includes('BUY') ? 'text-green-400' : item.signal.includes('SELL') ? 'text-red-400' : 'text-yellow-400'}`}>{item.signal}</span>
                                        <span className="text-xs bg-white text-black px-1 font-bold">{item.confidence}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Column: Main Chart Area */}
                <div className="lg:col-span-8">
                    <div className="border-4 border-black p-2 h-full bg-gray-50 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                         <div className="bg-white border-2 border-black h-full p-6 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black uppercase flex items-center gap-3">
                                    <BarChart3 className="w-8 h-8" />
                                    Market Analysis Engine
                                </h3>
                                <div className="flex gap-2">
                                    {['1H', '4H', '1D', '1W'].map((tf) => (
                                        <button key={tf} className="border-2 border-black px-3 py-1 font-bold text-sm hover:bg-black hover:text-white transition-colors uppercase">
                                            {tf}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-grow border-2 border-black relative bg-white">
                                <Chart data={chartData} />
                                <div className="absolute top-4 left-4 bg-white/90 border-2 border-black p-2 backdrop-blur-sm z-10">
                                    <div className="text-xs font-bold uppercase text-gray-500">Current Price</div>
                                    <div className="text-2xl font-black">$158.42</div>
                                    <div className="text-sm font-bold text-green-600 flex items-center gap-1">
                                        +2.4% <span className="text-black text-[10px] uppercase">Since Open</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-4 mt-6">
                                <div className="text-center border-r-2 border-black last:border-0">
                                    <div className="text-xs font-bold uppercase text-gray-500">RSI (14)</div>
                                    <div className="text-xl font-black">62.4</div>
                                </div>
                                <div className="text-center border-r-2 border-black last:border-0">
                                    <div className="text-xs font-bold uppercase text-gray-500">MACD</div>
                                    <div className="text-xl font-black text-green-600">Bullish</div>
                                </div>
                                <div className="text-center border-r-2 border-black last:border-0">
                                    <div className="text-xs font-bold uppercase text-gray-500">Volume</div>
                                    <div className="text-xl font-black">High</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs font-bold uppercase text-gray-500">Trend</div>
                                    <div className="text-xl font-black">Strong Up</div>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <MobileAppSection />

      {/* Offerings Section */}
      <section id="offerings" className="py-20 border-t-4 border-black bg-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl md:text-7xl font-black text-center mb-16 uppercase leading-none">
                System <span className="text-orange-600">Architecture</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="group relative">
                    <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform"></div>
                    <div className="relative border-4 border-black bg-white p-8 h-full flex flex-col justify-between hover:-translate-y-1 hover:-translate-x-1 transition-transform">
                        <div>
                            <div className="w-16 h-16 bg-orange-600 border-2 border-black flex items-center justify-center mb-6">
                                <Server className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-black mb-4 uppercase">MCP Server</h3>
                            <p className="text-lg font-bold text-gray-600 mb-8 leading-relaxed">
                                Advanced Model Context Protocol server allowing seamless integration of AI agents with external tools and trading environments.
                            </p>
                            <ul className="space-y-2 mb-8 border-t-2 border-black pt-4">
                                <li className="flex items-center gap-2 text-sm font-bold uppercase"><div className="w-2 h-2 bg-black"></div> Context Aware</li>
                                <li className="flex items-center gap-2 text-sm font-bold uppercase"><div className="w-2 h-2 bg-black"></div> Tool Use</li>
                                <li className="flex items-center gap-2 text-sm font-bold uppercase"><div className="w-2 h-2 bg-black"></div> Multi-Agent</li>
                            </ul>
                        </div>
                        <Link href="/mcp">
                            <button className="w-full text-lg font-black uppercase border-4 border-black py-4 hover:bg-black hover:text-white transition-colors">
                                Explore MCP
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="group relative">
                    <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform"></div>
                    <div className="relative border-4 border-black bg-white p-8 h-full flex flex-col justify-between hover:-translate-y-1 hover:-translate-x-1 transition-transform">
                        <div>
                            <div className="w-16 h-16 bg-black border-2 border-black flex items-center justify-center mb-6">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-black mb-4 uppercase">Developer API</h3>
                            <p className="text-lg font-bold text-gray-600 mb-8 leading-relaxed">
                                Enterprise-grade REST and WebSocket APIs for high-frequency market data, portfolio analysis, and trade execution.
                            </p>
                            <ul className="space-y-2 mb-8 border-t-2 border-black pt-4">
                                <li className="flex items-center gap-2 text-sm font-bold uppercase"><div className="w-2 h-2 bg-black"></div> Low Latency</li>
                                <li className="flex items-center gap-2 text-sm font-bold uppercase"><div className="w-2 h-2 bg-black"></div> 99.99% Uptime</li>
                                <li className="flex items-center gap-2 text-sm font-bold uppercase"><div className="w-2 h-2 bg-black"></div> Secure</li>
                            </ul>
                        </div>
                        <Link href="/api-docs">
                            <button className="w-full text-lg font-black uppercase border-4 border-black py-4 hover:bg-black hover:text-white transition-colors">
                                Read Docs
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="group relative">
                    <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform"></div>
                    <div className="relative border-4 border-black bg-orange-600 text-white p-8 h-full flex flex-col justify-between hover:-translate-y-1 hover:-translate-x-1 transition-transform">
                        <div>
                            <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center mb-6">
                                <Users className="w-8 h-8 text-black" />
                            </div>
                            <h3 className="text-3xl font-black mb-4 uppercase">Trading Terminal</h3>
                            <p className="text-lg font-bold text-white/90 mb-8 leading-relaxed">
                                The ultimate interface for manual and automated trading. Real-time visualization, one-click execution, and deep insights.
                            </p>
                            <ul className="space-y-2 mb-8 border-t-2 border-black pt-4">
                                <li className="flex items-center gap-2 text-sm font-bold uppercase"><div className="w-2 h-2 bg-white"></div> Zero Slippage</li>
                                <li className="flex items-center gap-2 text-sm font-bold uppercase"><div className="w-2 h-2 bg-white"></div> AI Assistants</li>
                                <li className="flex items-center gap-2 text-sm font-bold uppercase"><div className="w-2 h-2 bg-white"></div> Mobile Ready</li>
                            </ul>
                        </div>
                        <Link href="/auth/signup">
                            <button className="w-full text-lg font-black uppercase border-4 border-white bg-black text-white py-4 hover:bg-white hover:text-black transition-colors">
                                Launch Terminal
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 border-t-4 border-black bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-6xl md:text-9xl font-black mb-8 uppercase leading-none tracking-tighter">
            Stop Guessing.<br/>
            <span className="text-orange-600">Start Knowing.</span>
          </h2>
          <p className="text-2xl font-bold mb-12 text-gray-400 max-w-2xl mx-auto uppercase">
            Join the elite traders using multi-agent AI systems to dominate the market.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/auth/signup">
                <button className="text-2xl font-black uppercase bg-orange-600 text-white border-4 border-white px-16 py-6 hover:bg-white hover:text-black transition-all shadow-[8px_8px_0px_0px_#FFFFFF] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
                Get Started Free
                </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-black py-16 px-4 bg-white">
        <div className="max-w-[1600px] mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1">
             <span className="text-3xl font-black tracking-tighter uppercase block mb-6">
                Tensor<span className="text-orange-600">Trade</span>
              </span>
              <p className="font-bold text-gray-600 uppercase text-sm">
                Advanced algorithmic trading systems for the modern era.
              </p>
          </div>
          <div>
            <h4 className="font-black uppercase mb-6 text-lg">Platform</h4>
            <ul className="space-y-4 font-bold text-gray-600 uppercase text-sm">
                <li><a href="#" className="hover:text-black hover:underline decoration-2">Features</a></li>
                <li><a href="#" className="hover:text-black hover:underline decoration-2">Pricing</a></li>
                <li><a href="#" className="hover:text-black hover:underline decoration-2">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase mb-6 text-lg">Resources</h4>
            <ul className="space-y-4 font-bold text-gray-600 uppercase text-sm">
                <li><Link href="/api-docs" className="hover:text-black hover:underline decoration-2">API Documentation</Link></li>
                <li><Link href="/mcp" className="hover:text-black hover:underline decoration-2">MCP Server</Link></li>
                <li><a href="#" className="hover:text-black hover:underline decoration-2">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase mb-6 text-lg">Legal</h4>
            <ul className="space-y-4 font-bold text-gray-600 uppercase text-sm">
                <li><a href="#" className="hover:text-black hover:underline decoration-2">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-black hover:underline decoration-2">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1600px] mx-auto mt-16 pt-8 border-t-2 border-black text-center">
            <p className="font-black uppercase text-sm text-gray-400">&copy; 2026 TensorTrade Inc. All Systems Operational.</p>
        </div>
      </footer>
    </div>
  );
}
