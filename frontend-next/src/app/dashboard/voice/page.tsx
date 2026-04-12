'use client';

import { useState, useEffect, useRef } from 'react';
import {
  PhoneIcon,
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  PauseIcon,
  Volume2Icon,
  Loader2Icon,
  PhoneCallIcon,
  MicIcon,
  WifiIcon,
} from 'lucide-react';
import { API_BASE_URL, apiFetch } from '@/lib/api';

// ─── Types ──────────────────────────────────────────────────

interface VoiceConfig {
  elevenlabs: { configured: boolean; voice_id?: string; model?: string };
  twilio: { configured: boolean; phone_number?: string };
  browser_fallback: boolean;
}

interface CallSchedule {
  id: string;
  phone: string;
  schedule: string;
  contentType: 'market_update' | 'portfolio_review' | 'custom';
  language: 'en' | 'ar';
  active: boolean;
  nextCall: string;
  lastCall?: string;
  totalCalls: number;
}

type CallStatus = 'idle' | 'analyzing' | 'generating_voice' | 'calling' | 'playing' | 'completed' | 'error';

export default function VoiceAgentPage() {
  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig | null>(null);
  const [schedules, setSchedules] = useState<CallSchedule[]>([]);
  const [callLogs, setCallLogs] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId] = useState('dashboard_user');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [asset, setAsset] = useState('AAPL');
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [callMessage, setCallMessage] = useState('');
  const [script, setScript] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [config, schedulesRes, logsRes] = await Promise.all([
        apiFetch<VoiceConfig>('/voice/config'),
        apiFetch(`/calls/schedule/${userId}`).catch(() => ({ schedules: [] })),
        apiFetch(`/calls/logs/${userId}`).catch(() => ({ logs: [] })),
      ]);
      setVoiceConfig(config);

      const backendSchedules = (schedulesRes.schedules || []).map((s: any, idx: number) => ({
        id: s.schedule_id || String(idx),
        phone: s.phone_number || '',
        schedule: `${s.frequency || 'daily'} - ${s.call_type || 'market_update'}`,
        contentType: (s.call_type || 'market_update') as CallSchedule['contentType'],
        language: 'en' as const,
        active: true,
        nextCall: s.next_call_at || '',
        lastCall: s.last_call_at,
        totalCalls: s.total_calls || 0,
      }));
      setSchedules(backendSchedules);
      setCallLogs(logsRes.logs || []);
    } catch (err) {
      console.error('Failed to load voice config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLiveCall = async () => {
    if (!asset.trim()) {
      setCallMessage('Please enter a stock symbol');
      return;
    }

    setCallStatus('analyzing');
    setCallMessage(`Analyzing ${asset.toUpperCase()}...`);
    setScript('');

    try {
      if (phoneNumber.trim() && voiceConfig?.twilio.configured) {
        setCallStatus('calling');
        setCallMessage(`Calling ${phoneNumber}...`);

        const result = await apiFetch('/voice/live-call', {
          method: 'POST',
          body: JSON.stringify({
            user_id: userId,
            phone_number: phoneNumber.trim(),
            asset: asset.toUpperCase().trim(),
          }),
        });

        if (result.mode === 'phone_call') {
          setCallStatus('completed');
          setCallMessage(`Calling ${phoneNumber} now. Check your phone.`);
          setScript(result.script || '');
        } else {
          setScript(result.script || '');
          if (result.audio_base64) {
            await playBase64Audio(result.audio_base64);
          } else if (result.script) {
            await playBrowserTTS(result.script);
          }
          setCallStatus('completed');
          setCallMessage(result.message || 'Playing in browser');
        }
      } else {
        setCallStatus('generating_voice');
        setCallMessage('Generating AI voice update...');

        const response = await fetch(`${API_BASE_URL}/voice/generate-audio`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            asset: asset.toUpperCase().trim(),
          }),
        });

        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('audio/mpeg')) {
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          setScript(response.headers.get('X-Voice-Script') || '');
          setCallStatus('playing');
          setCallMessage('Playing AI voice update...');
          await playAudioUrl(audioUrl);
          setCallStatus('completed');
          setCallMessage('Voice update delivered.');
        } else {
          const data = await response.json();
          setScript(data.script || '');
          setCallStatus('playing');
          setCallMessage('Speaking via browser...');
          await playBrowserTTS(data.script);
          setCallStatus('completed');
          setCallMessage(data.message || 'Update delivered via browser voice');
        }
      }

      loadAll();
    } catch (err: any) {
      console.error('Live call failed:', err);
      setCallStatus('error');
      setCallMessage(`Error: ${err.message || 'Call failed'}`);
    }
  };

  const playAudioUrl = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      setIsPlaying(true);
      audio.onended = () => { setIsPlaying(false); resolve(); };
      audio.onerror = () => { setIsPlaying(false); reject(new Error('Audio playback failed')); };
      audio.play().catch(reject);
    });
  };

  const playBase64Audio = (base64: string): Promise<void> => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    return playAudioUrl(url);
  };

  const playBrowserTTS = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        synthRef.current = utterance;
        setIsPlaying(true);
        utterance.onend = () => { setIsPlaying(false); resolve(); };
        utterance.onerror = () => { setIsPlaying(false); resolve(); };
        window.speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCallStatus('idle');
    setCallMessage('');
  };

  const toggleSchedule = (id: string) => {
    setSchedules(prev => prev.map(s => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  const deleteSchedule = async (id: string) => {
    if (!confirm('Delete this schedule?')) return;
    try {
      await apiFetch(`/calls/schedule/${userId}/${id}`, { method: 'DELETE' });
      await loadAll();
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
      setSchedules(prev => prev.filter(s => s.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-xl font-bold uppercase">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold uppercase">Voice Agent</h1>
        <p className="mt-1 text-sm text-gray-600">
          Get AI-powered voice market updates — via phone call or browser audio
        </p>
      </div>

      {/* Live Call Panel */}
      <div className="border-4 border-black bg-white p-6">
        <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
          <PhoneCallIcon className="w-6 h-6" />
          <div>
            <h2 className="text-xl font-bold uppercase">Live Market Call</h2>
            <p className="text-sm text-gray-600">Enter a stock symbol and get a live AI voice update</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Asset Input */}
          <div>
            <label className="block text-xs font-bold uppercase mb-2">Stock Symbol *</label>
            <input
              type="text"
              value={asset}
              onChange={(e) => setAsset(e.target.value.toUpperCase())}
              placeholder="AAPL"
              className="w-full px-4 py-3 border-4 border-black text-lg font-bold font-mono uppercase tracking-wider focus:outline-none"
            />
          </div>

          {/* Phone Number Input */}
          <div>
            <label className="block text-xs font-bold uppercase mb-2">
              Phone Number{' '}
              <span className="text-gray-500 normal-case font-normal">(optional — leave empty for browser audio)</span>
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 555 123 4567"
              className="w-full px-4 py-3 border-4 border-black focus:outline-none"
            />
          </div>

          {/* Call Button */}
          <div className="flex items-end">
            {callStatus === 'idle' || callStatus === 'completed' || callStatus === 'error' ? (
              <button
                onClick={handleLiveCall}
                className="w-full px-6 py-3 bg-black text-white font-bold uppercase border-4 border-black hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2 text-lg"
              >
                {phoneNumber.trim() ? (
                  <>
                    <PhoneIcon className="w-5 h-5" />
                    Call Me Now
                  </>
                ) : (
                  <>
                    <Volume2Icon className="w-5 h-5" />
                    Play Update
                  </>
                )}
              </button>
            ) : isPlaying ? (
              <button
                onClick={stopPlayback}
                className="w-full px-6 py-3 bg-black text-white font-bold uppercase border-4 border-black hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2 text-lg"
              >
                <PauseIcon className="w-5 h-5" />
                Stop
              </button>
            ) : (
              <button
                disabled
                className="w-full px-6 py-3 bg-gray-200 text-black font-bold uppercase border-4 border-black flex items-center justify-center gap-2 text-lg opacity-70 cursor-wait"
              >
                <Loader2Icon className="w-5 h-5 animate-spin" />
                {callStatus === 'analyzing' && 'Analyzing...'}
                {callStatus === 'generating_voice' && 'Generating Voice...'}
                {callStatus === 'calling' && 'Calling...'}
                {callStatus === 'playing' && 'Speaking...'}
              </button>
            )}
          </div>
        </div>

        {/* Status Bar */}
        {callMessage && (
          <div className="border-2 border-black px-4 py-3 text-sm font-bold uppercase bg-gray-50">
            {callStatus !== 'idle' && callStatus !== 'completed' && callStatus !== 'error' && (
              <Loader2Icon className="w-4 h-4 inline animate-spin mr-2" />
            )}
            {callMessage}
          </div>
        )}

        {/* Voice Config Status */}
        <div className="flex flex-wrap gap-3 mt-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 border-2 border-black text-xs font-bold uppercase">
            <MicIcon className="w-3 h-3" />
            ElevenLabs: {voiceConfig?.elevenlabs.configured ? 'Connected' : 'Not configured'}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 border-2 border-black text-xs font-bold uppercase">
            <PhoneIcon className="w-3 h-3" />
            Twilio: {voiceConfig?.twilio.configured ? 'Connected' : 'Not configured'}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 border-2 border-black text-xs font-bold uppercase">
            <WifiIcon className="w-3 h-3" />
            Browser Audio: Always available
          </span>
        </div>
      </div>

      {/* Voice Script Output */}
      {script && (
        <div className="border-4 border-black bg-white p-6">
          <div className="flex items-center justify-between mb-4 border-b-4 border-black pb-3">
            <h3 className="text-lg font-bold uppercase">AI Voice Script</h3>
            <button
              onClick={() => playBrowserTTS(script)}
              className="flex items-center gap-1 px-3 py-2 border-2 border-black font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors"
            >
              <PlayIcon className="w-4 h-4" />
              Replay
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed max-h-64 overflow-y-auto">
            {script}
          </pre>
        </div>
      )}

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border-4 border-black bg-white p-6">
          <div className="flex items-center gap-3 mb-3">
            <Volume2Icon className="w-6 h-6" />
            <h3 className="font-bold uppercase">ElevenLabs AI Voice</h3>
          </div>
          <p className="text-sm text-gray-600">
            Natural-sounding voice powered by ElevenLabs. Speaks your market update like a real analyst.
          </p>
        </div>

        <div className="border-4 border-black bg-white p-6">
          <div className="flex items-center gap-3 mb-3">
            <PhoneIcon className="w-6 h-6" />
            <h3 className="font-bold uppercase">Real Phone Calls</h3>
          </div>
          <p className="text-sm text-gray-600">
            Enter your phone number and get called with your stock update. Powered by Twilio.
          </p>
        </div>

        <div className="border-4 border-black bg-white p-6">
          <div className="flex items-center gap-3 mb-3">
            <CalendarIcon className="w-6 h-6" />
            <h3 className="font-bold uppercase">Scheduled Calls</h3>
          </div>
          <p className="text-sm text-gray-600">
            Set up recurring daily, weekly, or custom-schedule voice briefings.
          </p>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="border-4 border-black bg-white p-6">
        <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-3">
          <h2 className="text-xl font-bold uppercase">Scheduled Calls</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white font-bold uppercase border-4 border-black hover:bg-white hover:text-black transition-colors text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Schedule Call
          </button>
        </div>
        {schedules.length === 0 ? (
          <p className="text-gray-500 text-center py-8 font-bold uppercase text-sm">
            No scheduled calls yet. Create one to receive regular market briefings.
          </p>
        ) : (
          <div className="space-y-4">
            {schedules.map((s) => (
              <ScheduleCard key={s.id} schedule={s} onToggle={toggleSchedule} onDelete={deleteSchedule} />
            ))}
          </div>
        )}
      </div>

      {/* Call History */}
      {callLogs.length > 0 && (
        <div className="border-4 border-black bg-white p-6">
          <h2 className="text-xl font-bold uppercase mb-6 border-b-4 border-black pb-3">Call History</h2>
          <div className="space-y-3">
            {callLogs.map((log: any, idx: number) => (
              <div key={idx} className="border-2 border-black p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold uppercase text-sm">
                      {log.direction === 'outbound' ? 'Outbound' : 'Inbound'} — {log.call_type || 'Call'}
                    </p>
                    <p className="text-sm text-gray-600">{log.phone_number}</p>
                    {log.message && <p className="text-sm text-gray-500 mt-1">{log.message}</p>}
                  </div>
                  <span className="text-xs font-bold">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateScheduleModal
          onClose={() => setShowCreateModal(false)}
          onSave={async (schedule) => {
            try {
              const firstCallAt = new Date(schedule.nextCall || Date.now() + 3600000).toISOString();
              await apiFetch('/calls/schedule', {
                method: 'POST',
                body: JSON.stringify({
                  user_id: userId,
                  phone_number: schedule.phone,
                  first_call_at: firstCallAt,
                  call_type: schedule.contentType,
                  frequency: 'daily',
                  timezone: 'UTC',
                }),
              });
              setShowCreateModal(false);
              await loadAll();
            } catch (err: any) {
              alert('Failed to create schedule: ' + err.message);
              setSchedules((prev) => [...prev, { ...schedule, id: Date.now().toString(), totalCalls: 0 }]);
              setShowCreateModal(false);
            }
          }}
        />
      )}
    </div>
  );
}

function ScheduleCard({
  schedule,
  onToggle,
  onDelete,
}: {
  schedule: CallSchedule;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="border-4 border-black p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <PhoneIcon className="w-5 h-5" />
            <h3 className="font-bold">{schedule.phone}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">{schedule.schedule}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-bold uppercase text-xs">Content:</span>
              <span className="ml-2 capitalize">{schedule.contentType.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="font-bold uppercase text-xs">Language:</span>
              <span className="ml-2 uppercase">{schedule.language}</span>
            </div>
            <div>
              <span className="font-bold uppercase text-xs">Next Call:</span>
              <span className="ml-2">
                {new Date(schedule.nextCall).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="font-bold uppercase text-xs">Total Calls:</span>
              <span className="ml-2">{schedule.totalCalls}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(schedule.id)}
            className={`px-3 py-2 border-2 border-black font-bold uppercase text-xs hover:bg-black hover:text-white transition-colors ${
              schedule.active ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            {schedule.active ? 'Active' : 'Paused'}
          </button>
          <button
            onClick={() => onDelete(schedule.id)}
            className="px-3 py-2 border-2 border-black font-bold uppercase text-xs hover:bg-black hover:text-white transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateScheduleModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (schedule: Omit<CallSchedule, 'id' | 'totalCalls'>) => void;
}) {
  const [formData, setFormData] = useState({
    phone: '',
    schedule: '',
    contentType: 'market_update' as CallSchedule['contentType'],
    language: 'en' as CallSchedule['language'],
    active: true,
    nextCall: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-black w-full max-w-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold uppercase mb-6 border-b-4 border-black pb-3">Schedule Voice Call</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-3 border-4 border-black font-bold focus:outline-none"
                placeholder="+971501234567"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-2">Schedule (Natural Language)</label>
              <input
                type="text"
                value={formData.schedule}
                onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                className="w-full px-3 py-3 border-4 border-black focus:outline-none"
                placeholder="e.g., Every Tuesday at 9 AM Dubai time"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Examples: "Daily at 8 AM", "Every Monday and Friday at 5 PM", "Weekdays at 9:30 AM"
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-2">Content Type</label>
              <select
                value={formData.contentType}
                onChange={(e) => setFormData(prev => ({ ...prev, contentType: e.target.value as CallSchedule['contentType'] }))}
                className="w-full px-3 py-3 border-4 border-black font-bold focus:outline-none bg-white"
              >
                <option value="market_update">Market Update</option>
                <option value="portfolio_review">Portfolio Review</option>
                <option value="custom">Custom Content</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-2">Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value as CallSchedule['language'] }))}
                className="w-full px-3 py-3 border-4 border-black font-bold focus:outline-none bg-white"
              >
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                className="w-4 h-4 border-2 border-black accent-black"
              />
              <label className="text-sm font-bold uppercase">Activate schedule immediately</label>
            </div>

            <div className="flex gap-3 pt-4 border-t-4 border-black">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border-4 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-black text-white border-4 border-black font-bold uppercase hover:bg-white hover:text-black transition-colors"
              >
                Schedule Call
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
