/**
 * Agent Actions Panel Component
 * Quick actions for specific AI agents
 */

'use client';

import React, { useState } from 'react';
import { Brain, TrendingUp, Shield, AlertTriangle, FileText } from 'lucide-react';

const API_BASE_URL = typeof window !== 'undefined' 
    ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')
    : '';

interface AgentActionsPanelProps {
    userId: string;
    asset: string;
    onAnalysisComplete?: (data: any) => void;
}

export function AgentActionsPanel({ userId, asset, onAnalysisComplete }: Agent ActionsPanelProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeAgent, setActiveAgent] = useState<string | null>(null);

    const runSpecificAgent = async (agentType: string) => {
        if (!asset) {
            alert('Please enter an asset symbol first');
            return;
        }

        setIsProcessing(true);
        setActiveAgent(agentType);

        try {
            const response = await fetch(`${API_BASE_URL}/analyze-asset?asset=${asset}&user_id=${userId}`, {
                method: 'POST',
            });

            if (response.ok) {
                const data = await response.json();
                alert(`${agentType} analysis complete!`);
                if (onAnalysisComplete) {
                    onAnalysisComplete(data);
                }
            } else {
                throw new Error('Analysis failed');
            }
        } catch (error: any) {
            alert(`Error running ${agentType}: ${error.message}`);
        } finally {
            setIsProcessing(false);
            setActiveAgent(null);
        }
    };

    const agents = [
        {
            id: 'council',
            name: '5-Agent LLM Council',
            icon: <Brain size={20} />,
            description: 'Multi-perspective market analysis',
            color: '#00ff00'
        },
        {
            id: 'risk',
            name: 'Risk Manager',
            icon: <Shield size={20} />,
            description: 'VaR, drawdown & risk assessment',
            color: '#ff9500'
        },
        {
            id: 'behavior',
            name: 'Behavior Monitor',
            icon: <AlertTriangle size={20} />,
            description: 'Detect psychological patterns',
            color: '#ff0000'
        },
        {
            id: 'sentiment',
            name: 'Sentiment Analyzer',
            icon: <TrendingUp size={20} />,
            description: 'Real-time market sentiment',
            color: '#00aaff'
        },
        {
            id: 'compliance',
            name: 'Compliance Check',
            icon: <FileText size={20} />,
            description: 'SEC & Shariah compliance',
            color: '#aa00ff'
        }
    ];

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">AGENT ACTIONS</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {agents.map((agent) => (
                    <div
                        key={agent.id}
                        style={{
                            border: `1px solid ${activeAgent === agent.id ? agent.color : 'var(--text-color)'}`,
                            padding: '15px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            opacity: isProcessing && activeAgent !== agent.id ? 0.5 : 1
                        }}
                        onClick={() => !isProcessing && runSpecificAgent(agent.name)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <div style={{ color: agent.color }}>
                                {agent.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', fontWeight: 600 }}>
                                    {agent.name}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-color)', marginTop: '4px' }}>
                                    {agent.description}
                                </div>
                            </div>
                            {activeAgent === agent.id && (
                                <div style={{ fontSize: '12px', color: agent.color, fontWeight: 700 }}>
                                    [RUNNING...]
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <div style={{ 
                    marginTop: '15px', 
                    padding: '12px', 
                    border: '1px solid var(--accent-color)',
                    fontSize: '12px',
                    lineHeight: 1.5
                }}>
                    <div style={{ fontWeight: 600, marginBottom: '8px' }}>💡 TIP:</div>
                    Click any agent above to run a targeted analysis. For comprehensive analysis, use the "GENERATE REPORT" button in the main panel.
                </div>
            </div>
        </div>
    );
}
