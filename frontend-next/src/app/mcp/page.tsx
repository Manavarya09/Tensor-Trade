'use client';

import Link from 'next/link';
import { Server, Database, Brain, Activity, ArrowRight, Terminal, Network, Shield, Cpu, Zap } from 'lucide-react';

export default function MCPPage() {
  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b-4 border-black z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-4">
               <div className="w-10 h-10 bg-black border-2 border-black flex items-center justify-center">
                 <Server className="text-white w-6 h-6" />
               </div>
              <span className="text-2xl font-black uppercase tracking-tighter">
                Tensor<span className="text-orange-600">MCP</span>
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <button className="text-sm font-bold uppercase border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-all">
                  Back to Home
                </button>
              </Link>
              <Link href="/auth/signup">
                <button className="text-sm font-bold uppercase bg-orange-600 text-white border-2 border-black px-4 py-2 hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Deploy Server
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 border-b-4 border-black bg-[url('/grid.svg')] bg-fixed">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <div className="inline-block bg-black text-white px-4 py-1 text-sm font-bold uppercase mb-6 tracking-widest border-2 border-orange-600">
                        Model Context Protocol
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black uppercase mb-8 leading-[0.9] tracking-tighter">
                        Universal<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600" style={{ WebkitTextStroke: '2px black' }}>Intelligence</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-bold mb-12 max-w-xl uppercase tracking-wide border-l-4 border-orange-600 pl-6 text-gray-800">
                        The backbone of TensorTrade's autonomous multi-agent system. Enabling LLMs to access real-time market data, execute trades, and manage risk securely.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/api-docs">
                            <button className="text-xl font-black uppercase bg-black text-white border-4 border-black px-8 py-4 hover:bg-white hover:text-black transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
                                Read Protocol
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Visual Representation */}
                <div className="border-4 border-black bg-white p-6 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
                        <span className="font-bold uppercase text-lg">System Architecture</span>
                        <Activity className="animate-pulse text-green-600 w-6 h-6" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 border-2 border-black p-4 bg-gray-50">
                            <div className="w-12 h-12 bg-black flex items-center justify-center shrink-0">
                                <Brain className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black uppercase text-lg">LLM Council</h3>
                                <p className="text-xs font-bold uppercase text-gray-500">Decision Engine (5 Agents)</p>
                            </div>
                            <ArrowRight className="ml-auto w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex items-center justify-center">
                             <div className="h-8 w-1 bg-black"></div>
                        </div>
                        <div className="border-4 border-orange-600 p-4 bg-orange-50 text-center relative">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white px-2 text-xs font-bold uppercase">MCP Interface</div>
                            <h3 className="font-black uppercase text-2xl">Context Protocol</h3>
                        </div>
                        <div className="flex items-center justify-center">
                             <div className="h-8 w-1 bg-black"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="border-2 border-black p-4 bg-gray-50 text-center">
                                <Database className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                                <h4 className="font-bold uppercase text-sm">Market Data</h4>
                             </div>
                             <div className="border-2 border-black p-4 bg-gray-50 text-center">
                                <Zap className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                                <h4 className="font-bold uppercase text-sm">Execution</h4>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl md:text-7xl font-black text-center mb-16 uppercase">
                Active Agents
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    {
                        title: "Market Watcher",
                        role: "Analysis",
                        desc: "5-agent LLM debate council analyzing macro, fundamental, flow, technical, and skeptic perspectives.",
                        icon: <Network className="w-8 h-8" />
                    },
                    {
                        title: "Behavior Monitor",
                        role: "Psychology",
                        desc: "Detects over 10 types of trading biases and emotional patterns in real-time execution.",
                        icon: <Brain className="w-8 h-8" />
                    },
                    {
                        title: "Risk Manager",
                        role: "Safety",
                        desc: "Real-time VaR calculation, drawdown monitoring, and position sizing optimization.",
                        icon: <Shield className="w-8 h-8" />
                    },
                    {
                        title: "Compliance Agent",
                        role: "Regulatory",
                        desc: "Ensures all trades meet SEC/FINRA regulations and internal compliance rules.",
                        icon: <ScaleIcon className="w-8 h-8" />
                    },
                    {
                        title: "Sentiment Engine",
                        role: "Data",
                        desc: "Processes millions of news articles and social signals to gauge market sentiment.",
                        icon: <Activity className="w-8 h-8" />
                    },
                    {
                        title: "Self Improvement",
                        role: "Optimization",
                        desc: "Recursive learning loop that analyzes past performance to update agent parameters.",
                        icon: <Cpu className="w-8 h-8" />
                    }
                ].map((agent, index) => (
                    <div key={index} className="border-4 border-black p-8 hover:bg-black hover:text-white transition-colors group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="bg-orange-600 p-3 border-2 border-black group-hover:border-white">
                                <div className="text-white">{agent.icon}</div>
                            </div>
                            <span className="text-xs font-bold uppercase border-2 border-black px-2 py-1 group-hover:border-white group-hover:text-white">{agent.role}</span>
                        </div>
                        <h3 className="text-2xl font-black uppercase mb-4">{agent.title}</h3>
                        <p className="font-bold text-gray-600 uppercase text-sm group-hover:text-gray-300">
                            {agent.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Integration Code */}
      <section className="py-20 border-t-4 border-black bg-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-5xl font-black uppercase mb-8">Seamless Integration</h2>
                    <p className="text-xl font-bold text-gray-600 uppercase mb-8">
                        Connect any LLM to the TensorTrade ecosystem using our standardized MCP SDK.
                    </p>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-4 text-lg font-bold uppercase">
                            <div className="w-4 h-4 bg-orange-600 border border-black"></div>
                            Standardized Context Window
                        </li>
                        <li className="flex items-center gap-4 text-lg font-bold uppercase">
                            <div className="w-4 h-4 bg-orange-600 border border-black"></div>
                            Tool Definition Schema
                        </li>
                        <li className="flex items-center gap-4 text-lg font-bold uppercase">
                            <div className="w-4 h-4 bg-orange-600 border border-black"></div>
                            Secure Auth Handshake
                        </li>
                    </ul>
                    <button className="text-lg font-black uppercase bg-black text-white px-8 py-4 border-4 border-black hover:bg-white hover:text-black transition-all">
                        Get SDK
                    </button>
                </div>
                <div className="border-4 border-black bg-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-gray-400 font-mono text-xs ml-2">config.json</span>
                    </div>
                    <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`{
  "mcp_version": "2.0.0",
  "agent_config": {
    "name": "MarketWatcher",
    "capabilities": ["read_price", "analyze_sentiment"],
    "permissions": ["execution_read_only"],
    "model": "gpt-4-turbo"
  },
  "context_sources": [
    "economic_calendar",
    "order_book_l2",
    "social_sentiment"
  ]
}`}
                    </pre>
                </div>
            </div>
        </div>
      </section>

       {/* Footer */}
       <footer className="border-t-4 border-black py-16 px-4 bg-white">
        <div className="max-w-[1600px] mx-auto text-center">
            <p className="font-black uppercase text-sm text-gray-400">&copy; 2026 TensorTrade Inc. MCP Protocol v2.0</p>
        </div>
      </footer>
    </div>
  );
}

// Icon component helper
function ScaleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  )
}
