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
  // ─── State ──────────────────────────────────────────────────
  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig | null>(null);
  const [schedules, setSchedules] = useState<CallSchedule[]>([]);
  const [callLogs, setCallLogs] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId] = useState('dashboard_user');

  // Live call state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [asset, setAsset] = useState('AAPL');
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [callMessage, setCallMessage] = useState('');
  const [script, setScript] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // ─── Load config + data ─────────────────────────────────────
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

  // ─── Live Call Handler ──────────────────────────────────────
  const handleLiveCall = async () => {
    if (!asset.trim()) {
      setCallMessage('Please enter a stock symbol');
      return;
    }

    setCallStatus('analyzing');
    setCallMessage(`Analyzing ${asset.toUpperCase()}...`);
    setScript('');

    try {
      // If phone number provided and Twilio configured → real phone call
      // Otherwise → browser audio playback
      if (phoneNumber.trim() && voiceConfig?.twilio.configured) {
        // Real phone call via Twilio
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
          setCallMessage(`📞 Calling ${phoneNumber} now! Check your phone.`);
          setScript(result.script || '');
        } else {
          // Fallback to browser
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
        // Browser playback mode
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
          // Got real ElevenLabs audio
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          setScript(response.headers.get('X-Voice-Script') || '');
          setCallStatus('playing');
          setCallMessage('🔊 Playing AI voice update...');
          await playAudioUrl(audioUrl);
          setCallStatus('completed');
          setCallMessage('Voice update delivered!');
        } else {
          // JSON response – use browser TTS
          const data = await response.json();
          setScript(data.script || '');
          setCallStatus('playing');
          setCallMessage('🔊 Speaking via browser...');
          await playBrowserTTS(data.script);
          setCallStatus('completed');
          setCallMessage(data.message || 'Update delivered via browser voice');
        }
      }

      // Refresh logs
      loadAll();
    } catch (err: any) {
      console.error('Live call failed:', err);
      setCallStatus('error');
      setCallMessage(`Error: ${err.message || 'Call failed'}`);
    }
  };

  // ─── Audio Playback Helpers ─────────────────────────────────
  const playAudioUrl = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        resolve();
      };
      audio.onerror = () => {
        setIsPlaying(false);
        reject(new Error('Audio playback failed'));
      };
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
        utterance.onend = () => {
          setIsPlaying(false);
          resolve();
        };
        utterance.onerror = () => {
          setIsPlaying(false);
          resolve();
        };
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

  // ─── Schedule Handlers ─────────────────────────────────────
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

  // ─── Render ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2Icon className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading voice agent...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Voice Agent</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Get AI-powered voice market updates — via phone call or browser audio
        </p>
      </div>

      {/* ══════════ LIVE CALL PANEL ══════════ */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-600 rounded-full">
            <PhoneCallIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Live Market Call</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter a stock symbol and get a live AI voice update
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Asset Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stock Symbol *
            </label>
            <input
              type="text"
              value={asset}
              onChange={(e) => setAsset(e.target.value.toUpperCase())}
              placeholder="AAPL"
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-lg font-bold
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         dark:bg-gray-700 dark:text-white uppercase tracking-wider"
            />
          </div>

          {/* Phone Number Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number{' '}
              <span className="text-xs text-gray-500">(optional — leave empty for browser audio)</span>
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 555 123 4567"
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Call Button */}
          <div className="flex items-end">
            {callStatus === 'idle' || callStatus === 'completed' || callStatus === 'error' ? (
              <button
                onClick={handleLiveCall}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg
                           transition-all duration-200 flex items-center justify-center gap-2 text-lg
                           shadow-lg hover:shadow-xl active:scale-95"
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
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg
                           flex items-center justify-center gap-2 text-lg"
              >
                <PauseIcon className="w-5 h-5" />
                Stop
              </button>
            ) : (
              <button
                disabled
                className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg
                           flex items-center justify-center gap-2 text-lg opacity-80 cursor-wait"
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
          <div
            className={`rounded-lg px-4 py-3 text-sm font-medium ${
              callStatus === 'error'
                ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                : callStatus === 'completed'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
            }`}
          >
            {callStatus !== 'idle' && callStatus !== 'completed' && callStatus !== 'error' && (
              <Loader2Icon className="w-4 h-4 inline animate-spin mr-2" />
            )}
            {callMessage}
          </div>
        )}

        {/* Voice Config Badges */}
        <div className="flex gap-3 mt-4">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
              voiceConfig?.elevenlabs.configured
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
            }`}
          >
            <MicIcon className="w-3 h-3" />
            ElevenLabs: {voiceConfig?.elevenlabs.configured ? 'Connected' : 'Not configured'}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
              voiceConfig?.twilio.configured
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
            }`}
          >
            <PhoneIcon className="w-3 h-3" />
            Twilio: {voiceConfig?.twilio.configured ? 'Connected' : 'Not configured'}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            <WifiIcon className="w-3 h-3" />
            Browser Audio: Always available
          </span>
        </div>
      </div>

      {/* Voice Script Output */}
      {script && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Voice Script</h3>
            <button
              onClick={() => playBrowserTTS(script)}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-lg hover:bg-blue-200 text-sm"
            >
              <PlayIcon className="w-4 h-4" />
              Replay
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed max-h-64 overflow-y-auto">
            {script}
          </pre>
        </div>
      )}

      {/* ══════════ FEATURE HIGHLIGHTS ══════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Volume2Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">ElevenLabs AI Voice</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Natural-sounding voice powered by ElevenLabs. Speaks your market update like a real analyst.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <PhoneIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Real Phone Calls</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter your phone number and get called with your stock update. Powered by Twilio.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <CalendarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Scheduled Calls</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Set up recurring daily, weekly, or custom-schedule voice briefings.
          </p>
        </div>
      </div>

      {/* ══════════ SCHEDULE SECTION ══════════ */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Scheduled Calls</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="w-4 h-4" />
            Schedule Call
          </button>
        </div>
        {schedules.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
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

      {/* ══════════ CALL HISTORY ══════════ */}
      {callLogs.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Call History</h2>
          <div className="space-y-3">
            {callLogs.map((log: any, idx: number) => (
              <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {log.direction === 'outbound' ? '📞 Outbound' : '📲 Inbound'} — {log.call_type || 'Call'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{log.phone_number}</p>
                    {log.message && <p className="text-sm text-gray-500 mt-1">{log.message}</p>}
                  </div>
                  <span className="text-xs text-gray-500">{log.timestamp}</span>
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
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <PhoneIcon className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900 dark:text-white">{schedule.phone}</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{schedule.schedule}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Content:</span>
              <span className="ml-2 text-gray-900 dark:text-white capitalize">{schedule.contentType.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Language:</span>
              <span className="ml-2 text-gray-900 dark:text-white uppercase">{schedule.language}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Next Call:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {new Date(schedule.nextCall).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Total Calls:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{schedule.totalCalls}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(schedule.id)}
            className={`p-2 rounded-lg ${
              schedule.active
                ? 'bg-green-100 dark:bg-green-900 text-green-600'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600'
            }`}
          >
            {schedule.active ? <CheckCircleIcon className="w-5 h-5" /> : <XCircleIcon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => onDelete(schedule.id)}
            className="p-2 bg-red-100 dark:bg-red-900 text-red-600 rounded-lg hover:bg-red-200 dark:hover:bg-red-800"
          >
            <XCircleIcon className="w-5 h-5" />
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Schedule Voice Call</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="+971501234567"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Schedule (Natural Language)
              </label>
              <input
                type="text"
                value={formData.schedule}
                onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Every Tuesday at 9 AM Dubai time"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Examples: "Daily at 8 AM", "Every Monday and Friday at 5 PM", "Weekdays at 9:30 AM"
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content Type
              </label>
              <select
                value={formData.contentType}
                onChange={(e) => setFormData(prev => ({ ...prev, contentType: e.target.value as CallSchedule['contentType'] }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="market_update">Market Update</option>
                <option value="portfolio_review">Portfolio Review</option>
                <option value="custom">Custom Content</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value as CallSchedule['language'] }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Activate schedule immediately
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
