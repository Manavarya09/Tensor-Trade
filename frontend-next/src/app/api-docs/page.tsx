'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Code2, Book, Zap, Shield, TrendingUp, ArrowLeft, Terminal, Copy } from 'lucide-react';

export default function APIDocsPage() {
  const [activeEndpoint, setActiveEndpoint] = useState('market-data');

  const endpoints = [
    {
      id: 'market-data',
      name: 'Market Data',
      method: 'GET',
      path: '/api/v1/market/quote',
      description: 'Get real-time market quotes for stocks',
      params: [
        { name: 'symbol', type: 'string', required: true, description: 'Stock ticker symbol (e.g., AAPL)' },
        { name: 'interval', type: 'string', required: false, description: '1m, 5m, 15m, 1h, 1d' },
      ],
      response: `{
  "symbol": "AAPL",
  "price": 175.43,
  "change": 2.3,
  "volume": "54.2M",
  "timestamp": "2026-02-14T14:30:00Z"
}`
    },
    {
      id: 'portfolio',
      name: 'Portfolio Analysis',
      method: 'POST',
      path: '/api/v1/portfolio/analyze',
      description: 'AI-powered portfolio analysis and recommendations',
      params: [
        { name: 'holdings', type: 'array', required: true, description: 'Array of stock holdings' },
        { name: 'includeShariah', type: 'boolean', required: false, description: 'Filter by Shariah compliance' },
      ],
      response: `{
  "totalValue": 125430.50,
  "riskScore": 6.5,
  "recommendations": [...],
  "compliance": "100% Halal"
}`
    },
    {
      id: 'trading-signals',
      name: 'Trading Signals',
      method: 'GET',
      path: '/api/v1/signals/ai',
      description: 'Get AI-generated trading signals',
      params: [
        { name: 'symbols', type: 'array', required: true, description: 'List of symbols to analyze' },
        { name: 'timeframe', type: 'string', required: false, description: 'Analysis timeframe' },
      ],
      response: `{
  "signals": [
    {
      "symbol": "NVDA",
      "action": "BUY",
      "confidence": 87,
      "reasoning": "Strong momentum..."
    }
  ]
}`
    },
    {
      id: 'shariah',
      name: 'Shariah Screening',
      method: 'GET',
      path: '/api/v1/shariah/compliance',
      description: 'Check Shariah compliance for stocks',
      params: [
        { name: 'symbol', type: 'string', required: true, description: 'Stock symbol' },
      ],
      response: `{
  "symbol": "AAPL",
  "compliant": true,
  "debtRatio": 15,
  "halalRevenue": 100,
  "rating": "Excellent"
}`
    },
  ];

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Real-Time Data',
      description: 'Live market data with WebSocket support for instant updates'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime SLA'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'AI-Powered',
      description: 'Advanced machine learning models for market analysis'
    },
    {
      icon: <Book className="w-8 h-8" />,
      title: 'Well Documented',
      description: 'Comprehensive docs, SDKs, and code examples'
    },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$49/mo',
      requests: '10,000 requests/month',
      features: ['Basic market data', 'Email support', 'API documentation', 'Rate limit: 10 req/sec']
    },
    {
      name: 'Professional',
      price: '$199/mo',
      requests: '100,000 requests/month',
      features: ['All market data', 'Priority support', 'WebSocket access', 'Rate limit: 50 req/sec'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      requests: 'Unlimited requests',
      features: ['Custom solutions', '24/7 support', 'Dedicated servers', 'Custom rate limits']
    },
  ];

  const currentEndpoint = endpoints.find(e => e.id === activeEndpoint);

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b-4 border-black z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-4">
               <div className="w-10 h-10 bg-black border-2 border-black flex items-center justify-center">
                 <Terminal className="text-white w-6 h-6" />
               </div>
              <span className="text-2xl font-black uppercase tracking-tighter">
                Tensor<span className="text-orange-600">API</span>
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
                  Get API Key
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[url('/grid.svg')] bg-fixed">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="mb-16">
            <div className="inline-block bg-black text-white px-4 py-1 text-sm font-bold uppercase mb-4">
                Developer Resources
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase mb-4 leading-none">
              API Documentation
            </h1>
            <p className="text-xl font-bold text-gray-600 uppercase max-w-2xl border-l-4 border-orange-600 pl-4">
              Integrate the world's most advanced AI trading engine directly into your applications.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="text-orange-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-black uppercase mb-2">{feature.title}</h3>
                <p className="text-sm font-bold text-gray-600 uppercase">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* API Explorer */}
          <div className="grid lg:grid-cols-12 gap-8 mb-16">
            {/* Endpoints List */}
            <div className="lg:col-span-4">
                <div className="border-4 border-black bg-white">
                    <div className="bg-black text-white p-4 border-b-4 border-black">
                         <h3 className="text-xl font-black uppercase">Endpoints</h3>
                    </div>
                    <div className="p-4 space-y-2">
                        {endpoints.map((endpoint) => (
                        <button
                            key={endpoint.id}
                            onClick={() => setActiveEndpoint(endpoint.id)}
                            className={`w-full text-left p-3 border-2 border-black font-bold uppercase transition-all ${
                            activeEndpoint === endpoint.id
                                ? 'bg-orange-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]'
                                : 'bg-white text-black hover:bg-gray-100'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                            <span>{endpoint.name}</span>
                            <span className={`px-2 py-0.5 text-xs border border-black ${
                                endpoint.method === 'GET' ? 'bg-green-200' : 'bg-blue-200'
                            }`}>
                                {endpoint.method}
                            </span>
                            </div>
                        </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Endpoint Details */}
            <div className="lg:col-span-8">
              <div className="border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] h-full">
              {currentEndpoint && (
                <div>
                  <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-4">
                    <h3 className="text-3xl font-black uppercase">{currentEndpoint.name}</h3>
                    <span className={`px-4 py-1 font-bold text-lg border-2 border-black ${
                      currentEndpoint.method === 'GET' ? 'bg-green-400' : 'bg-blue-400'
                    }`}>
                      {currentEndpoint.method}
                    </span>
                  </div>
                  
                  <p className="text-lg font-bold text-gray-700 uppercase mb-8">{currentEndpoint.description}</p>

                  <div className="bg-gray-100 border-2 border-black p-4 mb-8 flex items-center justify-between">
                    <code className="text-black font-bold">{currentEndpoint.path}</code>
                    <button className="text-gray-500 hover:text-black"><Copy className="w-5 h-5" /></button>
                  </div>

                  <h4 className="text-xl font-black uppercase mb-4 bg-black text-white inline-block px-2">Parameters</h4>
                  <div className="space-y-4 mb-8">
                    {currentEndpoint.params.map((param, index) => (
                      <div key={index} className="border-2 border-black p-4 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <code className="text-orange-600 font-bold text-lg">{param.name}</code>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold bg-gray-200 px-2 py-1 border border-black uppercase">{param.type}</span>
                            {param.required && (
                              <span className="text-xs font-bold bg-red-500 text-white px-2 py-1 border border-black uppercase">
                                Required
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm font-bold text-gray-600 uppercase">{param.description}</p>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-xl font-black uppercase mb-4 bg-black text-white inline-block px-2">Example Response</h4>
                  <div className="bg-black border-4 border-gray-800 p-6 overflow-x-auto text-green-400 font-mono text-sm shadow-[inset_0px_0px_20px_rgba(0,255,0,0.1)]">
                    <pre>
                      <code>{currentEndpoint.response}</code>
                    </pre>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-16">
            <h2 className="text-4xl font-black uppercase text-center mb-12">API Pricing Models</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`border-4 border-black p-8 flex flex-col justify-between ${
                    plan.popular
                      ? 'bg-orange-600 text-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-black uppercase">{plan.name}</h3>
                        {plan.popular && (
                            <span className="bg-white text-black text-xs font-bold px-2 py-1 border border-black uppercase">
                            Popular
                            </span>
                        )}
                    </div>
                    <div className={`text-4xl font-black mb-2 ${plan.popular ? 'text-black' : 'text-orange-600'}`}>{plan.price}</div>
                    <div className={`text-sm font-bold uppercase mb-8 pb-8 border-b-4 ${plan.popular ? 'border-black text-white' : 'border-gray-200 text-gray-500'}`}>{plan.requests}</div>
                    <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm font-bold uppercase">
                            <div className={`w-2 h-2 mr-2 ${plan.popular ? 'bg-black' : 'bg-orange-600'}`}></div>
                            {feature}
                        </li>
                        ))}
                    </ul>
                  </div>
                  <button className={`w-full py-4 text-lg font-black uppercase border-4 border-black transition-all ${
                      plan.popular
                      ? 'bg-black text-white hover:bg-white hover:text-black'
                      : 'bg-white text-black hover:bg-black hover:text-white'
                  }`}>
                    Select Plan
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Start */}
          <div className="border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-3xl font-black uppercase mb-8 border-b-4 border-black pb-4">Quick Start Guide</h3>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-xl shrink-0">1</div>
                <div>
                    <h4 className="text-xl font-black uppercase mb-2">Get your API key</h4>
                    <p className="font-bold text-gray-600 uppercase text-sm">Sign up for an account to receive your unique API key</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-xl shrink-0">2</div>
                <div className="w-full">
                    <h4 className="text-xl font-black uppercase mb-2">Make your first request</h4>
                    <div className="bg-gray-100 border-2 border-black p-4 mt-2 overflow-x-auto">
                    <pre className="text-sm font-mono">
                        <code>{`curl -X GET "https://api.tensortrade.com/v1/market/quote?symbol=AAPL" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
                    </pre>
                    </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-xl shrink-0">3</div>
                 <div>
                    <h4 className="text-xl font-black uppercase mb-2">Explore the docs</h4>
                    <p className="font-bold text-gray-600 uppercase text-sm">Check out our comprehensive guides and SDKs</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
