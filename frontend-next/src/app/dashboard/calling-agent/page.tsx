'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { API_BASE_URL, apiFetch } from '@/lib/api';

export default function CallingAgentPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [callHistory, setCallHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId] = useState('dashboard_user');

  // -- New schedule form state --
  const [showNewSchedule, setShowNewSchedule] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [newFrequency, setNewFrequency] = useState('daily');
  const [newCallType, setNewCallType] = useState('daily_summary');
  const [newAsset, setNewAsset] = useState('');
  const [newTimezone, setNewTimezone] = useState('UTC');

  // -- Immediate call state --
  const [immediatePhone, setImmediatePhone] = useState('');
  const [immediateMessage, setImmediateMessage] = useState('');
  const [immediateAsset, setImmediateAsset] = useState('AAPL');
  const [callInProgress, setCallInProgress] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [schedulesRes, logsRes] = await Promise.all([
        apiFetch(`/calls/schedule/${userId}`),
        apiFetch(`/calls/logs/${userId}`),
      ]);
      setSchedules(schedulesRes.schedules || []);
      setCallHistory(logsRes.logs || []);
    } catch (err: any) {
      console.error('Failed to load calling data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async () => {
    try {
      const firstCallAt = new Date(Date.now() + 60000).toISOString();
      await apiFetch('/calls/schedule', {
        method: 'POST',
        body: JSON.stringify({
          user_id: userId,
          phone_number: newPhone,
          first_call_at: firstCallAt,
          call_type: newCallType,
          frequency: newFrequency,
          asset: newAsset || undefined,
          timezone: newTimezone,
        }),
      });
      setShowNewSchedule(false);
      setNewPhone('');
      setNewAsset('');
      await loadData();
    } catch (err: any) {
      alert('Failed to create schedule: ' + err.message);
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Delete this schedule?')) return;
    try {
      await apiFetch(`/calls/schedule/${userId}/${scheduleId}`, { method: 'DELETE' });
      await loadData();
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const handleImmediateCall = async () => {
    if (!immediatePhone) { alert('Enter a phone number'); return; }
    setCallInProgress(true);
    try {
      const result = await apiFetch('/calls/outbound', {
        method: 'POST',
        body: JSON.stringify({
          user_id: userId,
          phone_number: immediatePhone,
          message: immediateMessage || `Market update for ${immediateAsset}`,
          call_type: 'market_update',
          asset: immediateAsset || undefined,
        }),
      });
      alert('Call triggered successfully!');
      setImmediatePhone('');
      setImmediateMessage('');
      await loadData();
    } catch (err: any) {
      alert('Call failed: ' + err.message);
    } finally {
      setCallInProgress(false);
    }
  };

  const aiCapabilities = [
    {
      title: 'Natural Conversation',
      description: 'Two-way dialogue with context awareness and memory of previous calls'
    },
    {
      title: 'Real-Time Analysis',
      description: 'Live market data analysis and instant answers to your questions'
    },
    {
      title: 'Smart Scheduling',
      description: 'Flexible scheduling with timezone support and conflict detection'
    },
    {
      title: 'Alert Integration',
      description: 'Urgent notifications for significant market events or portfolio changes'
    },
  ];

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-4 border-black p-6">
          <div>
            <h2 className="text-2xl font-bold uppercase">AI Calling Agent</h2>
            <p className="text-sm mt-1">SCHEDULE AUTOMATED MARKET UPDATES VIA VOICE CALLS</p>
            <p className="text-xs mt-1 text-gray-600">Connected to: {API_BASE_URL}</p>
          </div>
          <Button onClick={() => setShowNewSchedule(!showNewSchedule)}>
            {showNewSchedule ? 'CANCEL' : 'NEW SCHEDULE'}
          </Button>
        </div>

        {error && (
          <div className="border-4 border-red-600 p-4 bg-red-50 text-red-800 font-bold">
            BACKEND ERROR: {error}
          </div>
        )}

        {loading && (
          <div className="text-center p-8 font-bold">LOADING FROM BACKEND...</div>
        )}

        {/* New Schedule Form */}
        {showNewSchedule && (
          <Card className="p-6 border-8 border-black">
            <h3 className="text-xl font-bold uppercase mb-4 border-b-4 border-black pb-3">Create New Schedule</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase text-xs mb-2">Phone Number *</label>
                <input type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value)}
                  className="w-full px-4 py-3 border-4 border-black font-bold text-sm" placeholder="+1234567890" />
              </div>
              <div>
                <label className="block font-bold uppercase text-xs mb-2">Asset (optional)</label>
                <input type="text" value={newAsset} onChange={e => setNewAsset(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border-4 border-black font-bold text-sm" placeholder="AAPL" />
              </div>
              <div>
                <label className="block font-bold uppercase text-xs mb-2">Frequency</label>
                <select value={newFrequency} onChange={e => setNewFrequency(e.target.value)}
                  className="w-full px-4 py-3 border-4 border-black font-bold text-sm">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="once">One-time</option>
                </select>
              </div>
              <div>
                <label className="block font-bold uppercase text-xs mb-2">Call Type</label>
                <select value={newCallType} onChange={e => setNewCallType(e.target.value)}
                  className="w-full px-4 py-3 border-4 border-black font-bold text-sm">
                  <option value="daily_summary">Daily Summary</option>
                  <option value="market_update">Market Update</option>
                  <option value="portfolio_review">Portfolio Review</option>
                </select>
              </div>
              <div>
                <label className="block font-bold uppercase text-xs mb-2">Timezone</label>
                <select value={newTimezone} onChange={e => setNewTimezone(e.target.value)}
                  className="w-full px-4 py-3 border-4 border-black font-bold text-sm">
                  <option value="UTC">UTC</option>
                  <option value="US/Eastern">US Eastern</option>
                  <option value="US/Pacific">US Pacific</option>
                  <option value="Asia/Dubai">Dubai</option>
                  <option value="Europe/London">London</option>
                </select>
              </div>
            </div>
            <Button onClick={handleCreateSchedule} className="mt-4 w-full">CREATE SCHEDULE</Button>
          </Card>
        )}

        {/* Immediate Call */}
        <Card className="p-6 border-8 border-black">
          <h3 className="text-xl font-bold uppercase mb-4 border-b-4 border-black pb-3">Request Immediate Call</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold uppercase text-xs mb-2">Phone Number *</label>
              <input type="tel" value={immediatePhone} onChange={e => setImmediatePhone(e.target.value)}
                className="w-full px-4 py-3 border-4 border-black font-bold text-sm" placeholder="+1234567890" />
            </div>
            <div>
              <label className="block font-bold uppercase text-xs mb-2">Asset</label>
              <input type="text" value={immediateAsset} onChange={e => setImmediateAsset(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border-4 border-black font-bold text-sm" placeholder="AAPL" />
            </div>
            <div>
              <label className="block font-bold uppercase text-xs mb-2">Message (optional)</label>
              <input type="text" value={immediateMessage} onChange={e => setImmediateMessage(e.target.value)}
                className="w-full px-4 py-3 border-4 border-black font-bold text-sm" placeholder="Custom message..." />
            </div>
          </div>
          <Button onClick={handleImmediateCall} className="mt-4" disabled={callInProgress}>
            {callInProgress ? 'CALLING...' : 'TRIGGER CALL NOW'}
          </Button>
        </Card>

        {/* AI Capabilities */}
        <Card className="p-6 border-8 border-black">
          <h3 className="text-xl font-bold uppercase mb-6 border-b-4 border-black pb-3">Two-Way Calling Agent</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {aiCapabilities.map((capability, index) => (
              <div key={index} className="border-4 border-black p-4">
                <h4 className="font-bold uppercase mb-2">{capability.title}</h4>
                <p className="text-sm">{capability.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Active Schedules */}
        <div>
          <h3 className="text-xl font-bold uppercase mb-4">Your Call Schedules ({schedules.length})</h3>
          {schedules.length === 0 && !loading ? (
            <Card className="p-6 text-center">
              <p className="font-bold">No schedules yet. Create one above!</p>
            </Card>
          ) : (
          <div className="space-y-4">
            {schedules.map((schedule: any, idx: number) => (
              <Card key={schedule.schedule_id || idx} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold uppercase">
                        {schedule.call_type || 'Scheduled Call'}
                      </h4>
                      <span className="px-3 py-1 font-bold text-xs border-2 border-black bg-black text-white">
                        {schedule.frequency || 'ACTIVE'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                      <div>
                        <span className="font-bold">PHONE:</span> {schedule.phone_number}
                      </div>
                      <div>
                        <span className="font-bold">ASSET:</span> {schedule.asset || 'General'}
                      </div>
                      <div>
                        <span className="font-bold">TIMEZONE:</span> {schedule.timezone || 'UTC'}
                      </div>
                      <div>
                        <span className="font-bold">NEXT:</span> {schedule.next_call_at || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline"
                    onClick={() => handleDeleteSchedule(schedule.schedule_id)}>
                    DELETE
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          )}
        </div>

        {/* Call History */}
        <Card className="p-6">
          <h3 className="text-xl font-bold uppercase mb-6 border-b-4 border-black pb-3">
            Call History ({callHistory.length})
          </h3>
          {callHistory.length === 0 && !loading ? (
            <p className="text-center font-bold py-4">No call history yet.</p>
          ) : (
          <div className="space-y-4">
            {callHistory.map((call: any, index: number) => (
              <div key={index} className="border-4 border-black p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold uppercase">{call.call_type || call.type || 'Call'}</div>
                    <div className="text-sm mt-1">{call.direction || ''} — {call.phone_number || ''}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{call.timestamp || call.date || ''}</div>
                    <div className="text-xs">
                      {call.duration ? `Duration: ${call.duration}` : ''}
                    </div>
                  </div>
                </div>
                {call.message && (
                  <div className="border-t-2 border-black pt-3">
                    <div className="text-sm"><span className="font-bold">MESSAGE:</span> {call.message}</div>
                  </div>
                )}
                {call.response_summary && (
                  <div className="text-sm mt-1">
                    <span className="font-bold">RESPONSE:</span> {call.response_summary}
                  </div>
                )}
              </div>
            ))}
          </div>
          )}
        </Card>
      </div>
  );
}
