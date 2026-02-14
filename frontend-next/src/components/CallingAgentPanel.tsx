/**
 * Calling Agent Panel Component
 * Allows users to schedule and trigger AI calling agent
 */

'use client';

import React, { useState } from 'react';
import { Phone, Calendar, Clock, MessageSquare } from 'lucide-react';

const API_BASE_URL = typeof window !== 'undefined' 
    ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')
    : '';

interface CallingAgentPanelProps {
    userId: string;
    asset: string;
}

export function CallingAgentPanel({ userId, asset }: CallingAgentPanelProps) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [callLogs, setCallLogs] = useState<any[]>([]);

    const triggerImmediateCall = async () => {
        if (!phoneNumber) {
            alert('Please enter a phone number');
            return;
        }

        setIsProcessing(true);
        setStatusMessage('Initiating call...');

        try {
            const response = await fetch(`${API_BASE_URL}/calls/outbound`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    phone_number: phoneNumber,
                    message: message || `Market update for ${asset}`,
                    call_type: 'market_update',
                    asset: asset
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setStatusMessage('Call initiated successfully!');
                alert(`Call initiated! ${data.message}`);
                loadCallLogs();
            } else {
                throw new Error('Failed to initiate call');
            }
        } catch (error: any) {
            setStatusMessage('Failed to initiate call');
            alert(`Error: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const scheduleCall = async () => {
        if (!phoneNumber || !scheduleTime) {
            alert('Please enter phone number and schedule time');
            return;
        }

        setIsProcessing(true);
        setStatusMessage('Scheduling call...');

        try {
            const response = await fetch(`${API_BASE_URL}/calls/schedule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    phone_number: phoneNumber,
                    first_call_at: scheduleTime,
                    call_type: 'daily_summary',
                    frequency: 'daily',
                    asset: asset,
                    timezone: 'UTC'
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setStatusMessage('Call scheduled successfully!');
                alert(`Call scheduled! ${data.message}`);
            } else {
                throw new Error('Failed to schedule call');
            }
        } catch (error: any) {
            setStatusMessage('Failed to schedule call');
            alert(`Error: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const loadCallLogs = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/calls/logs/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setCallLogs(data.logs || []);
            }
        } catch (error) {
            console.error('Failed to load call logs:', error);
        }
    };

    React.useEffect(() => {
        loadCallLogs();
    }, []);

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">
                    <Phone size={18} style={{ display: 'inline', marginRight: '8px' }} />
                    AI CALLING AGENT
                </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Immediate Call Section */}
                <div style={{ border: '1px solid var(--text-color)', padding: '15px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone size={16} />
                        IMMEDIATE CALL
                    </div>

                    <div className="input-group">
                        <div className="input-label">PHONE NUMBER:</div>
                        <input
                            type="tel"
                            className="input-field"
                            placeholder="+1 (555) 123-4567"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <div className="input-label">MESSAGE (OPTIONAL):</div>
                        <textarea
                            className="input-field"
                            placeholder="Custom message for the call agent..."
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>

                    <button
                        className="btn-primary"
                        style={{ width: '100%' }}
                        onClick={triggerImmediateCall}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'PROCESSING...' : 'TRIGGER CALL NOW'}
                    </button>
                </div>

                {/* Schedule Call Section */}
                <div style={{ border: '1px solid var(--text-color)', padding: '15px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={16} />
                        SCHEDULE RECURRING CALLS
                    </div>

                    <div className="input-group">
                        <div className="input-label">FIRST CALL DATE/TIME:</div>
                        <input
                            type="datetime-local"
                            className="input-field"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                        />
                    </div>

                    <button
                        className="btn-primary"
                        style={{ width: '100%' }}
                        onClick={scheduleCall}
                        disabled={isProcessing}
                    >
                        SCHEDULE DAILY CALLS
                    </button>
                </div>

                {/* Status Message */}
                {statusMessage && (
                    <div style={{ 
                        padding: '10px 15px', 
                        border: '1px solid var(--accent-color)', 
                        backgroundColor: 'rgba(0, 255, 0, 0.1)',
                        fontSize: '13px'
                    }}>
                        {statusMessage}
                    </div>
                )}

                {/* Call Logs */}
                {callLogs.length > 0 && (
                    <div style={{ border: '1px solid var(--text-color)', padding: '15px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '15px' }}>
                            <MessageSquare size={16} style={{ display: 'inline', marginRight: '8px' }} />
                            RECENT CALLS
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                            {callLogs.slice(0, 5).map((log, idx) => (
                                <div key={idx} style={{ 
                                    padding: '10px', 
                                    border: '1px solid var(--text-color)', 
                                    fontSize: '12px' 
                                }}>
                                    <div style={{ fontWeight: 600 }}>
                                        {log.call_type || 'Call'} - {log.direction || 'outbound'}
                                    </div>
                                    <div style={{ color: 'var(--text-color)', marginTop: '4px' }}>
                                        {new Date(log.timestamp || Date.now()).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
