'use client';

import { useState } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { API_BASE_URL, apiFetch } from '@/lib/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI trading assistant. Type a stock symbol (e.g. AAPL) to get instant analysis, or ask me anything about the market.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Check if user typed a stock symbol (1-6 uppercase letters or contains hyphen)
    const symbolMatch = userText.match(/^([A-Z]{1,6}(?:-[A-Z]{1,4})?)$/i);
    const symbol = symbolMatch ? symbolMatch[1].toUpperCase() : null;

    try {
      if (symbol) {
        // User typed a stock symbol — call backend analysis
        const thinkingMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: `Analyzing ${symbol}... Running 12 AI agents (this takes 20-30 seconds)...`,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, thinkingMsg]);

        const result = await apiFetch(`/analyze-asset?asset=${symbol}&user_id=assistant_user`, {
          method: 'POST',
        });

        // Format the response into a readable message
        let responseText = `**${result.asset} Analysis Complete**\n\n`;

        if (result.market_analysis?.market_context) {
          const mc = result.market_analysis.market_context;
          responseText += `Price: $${mc.price} (${mc.move_direction} ${mc.change_pct}%)\n`;
        }

        if (result.market_metrics) {
          responseText += `Risk: ${result.market_metrics.risk_level} (${result.market_metrics.risk_index}/100)\n`;
          responseText += `Regime: ${result.market_metrics.market_regime}\n\n`;
        }

        if (result.market_analysis?.council_opinions?.length) {
          responseText += `**Council Opinions:**\n`;
          result.market_analysis.council_opinions.forEach((op: string) => {
            responseText += `• ${op}\n`;
          });
          responseText += '\n';
        }

        if (result.narrative?.styled_message) {
          responseText += `**AI Narrative:** ${result.narrative.styled_message}\n\n`;
        }

        if (result.shariah_compliance?.compliant !== undefined) {
          responseText += `Shariah: ${result.shariah_compliance.compliant ? '✅ Halal' : '❌ Not compliant'} (${result.shariah_compliance.score}/100)\n`;
        }

        // Remove the "thinking" message and add the real response
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== thinkingMsg.id);
          return [...filtered, {
            id: (Date.now() + 2).toString(),
            text: responseText,
            sender: 'ai' as const,
            timestamp: new Date()
          }];
        });

      } else if (userText.toLowerCase().includes('health') || userText.toLowerCase().includes('status')) {
        // Health check
        const health = await apiFetch('/health');
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `Backend Status: ${health.status}\nVersion: ${health.version}\nAPI Keys: ${JSON.stringify(health.environment?.api_keys || {})}`,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);

      } else if (userText.toLowerCase().includes('help')) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `**Available Commands:**\n• Type a stock symbol (AAPL, TSLA, MSFT) for full AI analysis\n• "health" or "status" to check backend\n• "metrics" for self-improvement data\n• Any other question and I'll do my best!`,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);

      } else if (userText.toLowerCase().includes('metric')) {
        const metrics = await apiFetch('/self-improvement/metrics');
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `**Self-Improvement Metrics:**\n${JSON.stringify(metrics, null, 2)}`,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);

      } else {
        // General response
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `I can analyze any stock for you! Just type a symbol like AAPL, TSLA, or NVDA.\n\nOr type "help" to see all commands.`,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error: any) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error connecting to backend: ${error.message}\n\nMake sure the backend is running at ${API_BASE_URL}`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
      >
        <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isMinimized ? 'w-80' : 'w-96'
      }`}
    >
      <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-white" />
            <h3 className="text-white font-semibold">AI Assistant</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white/80 hover:text-white transition"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-white/20 text-gray-100'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isLoading ? "Processing..." : "Type AAPL, TSLA, or ask..."}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:shadow-lg transition-all"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
