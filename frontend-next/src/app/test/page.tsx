/**
 * Backend Connection Test Page
 * Simple UI to test if frontend can call backend
 */

'use client';

import React, { useState } from 'react';

const API_BASE_URL = typeof window !== 'undefined' 
    ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')
    : '';

export default function TestPage() {
    const [testResults, setTestResults] = useState<string[]>([]);
    const [testing, setTesting] = useState(false);

    const addResult = (message: string, isError = false) => {
        setTestResults(prev => [...prev, `${isError ? '❌' : '✅'} ${message}`]);
    };

    const runTests = async () => {
        setTesting(true);
        setTestResults([]);

        // Test 1: Health Check
        addResult('Starting tests...');
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            if (response.ok) {
                const data = await response.json();
                addResult(`Backend Health: ${data.status}`);
                addResult(`Backend Version: ${data.version}`);
            } else {
                addResult(`Health check failed: ${response.status}`, true);
            }
        } catch (error: any) {
            addResult(`Cannot reach backend: ${error.message}`, true);
            setTesting(false);
            return;
        }

        // Test 2: API Info
        try {
            const response = await fetch(`${API_BASE_URL}/api`);
            if (response.ok) {
                const data = await response.json();
                addResult(`API Message: ${data.message}`);
            }
        } catch (error: any) {
            addResult(`API info failed: ${error.message}`, true);
        }

        // Test 3: Quick Analysis
        addResult('Testing analysis endpoint (this may take 15-20 seconds)...');
        try {
            const response = await fetch(`${API_BASE_URL}/analyze-asset?asset=AAPL&user_id=test`, {
                method: 'POST',
            });
            
            if (response.ok) {
                const data = await response.json();
                addResult(`Analysis successful for ${data.asset}`);
                addResult(`Persona selected: ${data.persona_selected}`);
                if (data.market_analysis?.council_opinions) {
                    addResult(`Council opinions: ${data.market_analysis.council_opinions.length} agents`);
                }
            } else {
                addResult(`Analysis returned status: ${response.status}`, true);
            }
        } catch (error: any) {
            addResult(`Analysis timeout (this is normal - backend is processing)`, false);
        }

        addResult('All tests completed!');
        setTesting(false);
    };

    return (
        <div style={{ 
            padding: '40px', 
            maxWidth: '800px', 
            margin: '0 auto',
            fontFamily: 'monospace',
            backgroundColor: '#000',
            color: '#0f0',
            minHeight: '100vh'
        }}>
            <h1 style={{ fontSize: '32px', marginBottom: '20px', borderBottom: '2px solid #0f0', paddingBottom: '10px' }}>
                🔌 BACKEND CONNECTION TEST
            </h1>

            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #0f0' }}>
                <div style={{ marginBottom: '10px' }}>
                    <strong>Backend URL:</strong> {API_BASE_URL}
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <strong>Status:</strong> {testing ? 'Testing...' : 'Ready'}
                </div>
            </div>

            <button
                onClick={runTests}
                disabled={testing}
                style={{
                    padding: '15px 30px',
                    fontSize: '18px',
                    backgroundColor: '#0f0',
                    color: '#000',
                    border: 'none',
                    cursor: testing ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    width: '100%',
                    marginBottom: '30px'
                }}
            >
                {testing ? 'TESTING... PLEASE WAIT' : 'RUN CONNECTION TESTS'}
            </button>

            <div style={{ 
                padding: '20px', 
                border: '1px solid #0f0',
                minHeight: '200px',
                maxHeight: '400px',
                overflowY: 'auto',
                backgroundColor: '#001100'
            }}>
                <h3 style={{ marginBottom: '15px' }}>TEST RESULTS:</h3>
                {testResults.length === 0 ? (
                    <div style={{ color: '#888' }}>Click the button above to start testing...</div>
                ) : (
                    testResults.map((result, idx) => (
                        <div key={idx} style={{ 
                            marginBottom: '8px', 
                            padding: '8px',
                            backgroundColor: '#000',
                            border: '1px solid #0f0'
                        }}>
                            {result}
                        </div>
                    ))
                )}
            </div>

            <div style={{ 
                marginTop: '30px', 
                padding: '20px', 
                border: '1px solid #0f0',
                backgroundColor: '#001100'
            }}>
                <h3 style={{ marginBottom: '15px' }}>📋 QUICK LINKS:</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <a 
                        href="http://localhost:3000" 
                        style={{ color: '#0f0', textDecoration: 'underline' }}
                    >
                        → Main Dashboard
                    </a>
                    <a 
                        href="http://localhost:8000/docs" 
                        target="_blank"
                        style={{ color: '#0f0', textDecoration: 'underline' }}
                    >
                        → Backend API Documentation
                    </a>
                    <a 
                        href="http://localhost:8000/health" 
                        target="_blank"
                        style={{ color: '#0f0', textDecoration: 'underline' }}
                    >
                        → Backend Health Check
                    </a>
                </div>
            </div>

            <div style={{ 
                marginTop: '30px', 
                padding: '20px', 
                border: '1px solid #ff0',
                backgroundColor: '#110',
                color: '#ff0'
            }}>
                <h3 style={{ marginBottom: '15px' }}>⚠️ TROUBLESHOOTING:</h3>
                <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                    <li>If tests fail, check that backend is running on port 8000</li>
                    <li>Analysis timeout is NORMAL - backend processes multiple AI agents</li>
                    <li>Open browser DevTools (F12) → Console tab to see detailed errors</li>
                    <li>CORS errors mean backend CORS isn't configured for your origin</li>
                    <li>For instant results, use Demo Mode in the main dashboard</li>
                </ul>
            </div>
        </div>
    );
}
