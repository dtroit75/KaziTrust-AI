
import React, { useState, useRef, useEffect } from 'react';
import { geminiService, decodeAudioData, createWavBlob } from '../services/geminiService';

interface TTSButtonProps {
  text: string;
  size?: 'sm' | 'md';
}

type AudioState = 'idle' | 'loading' | 'playing' | 'paused';

const TTSButton: React.FC<TTSButtonProps> = ({ text, size = 'md' }) => {
  const [state, setState] = useState<AudioState>('idle');
  const [isDownloading, setIsDownloading] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const audioDataRef = useRef<Uint8Array | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    return () => {
      if (sourceNodeRef.current) {
        try { sourceNodeRef.current.stop(); } catch (e) {}
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const handleToggle = async () => {
    if (state === 'idle') {
      await startAudio();
    } else if (state === 'playing') {
      await pauseAudio();
    } else if (state === 'paused') {
      await resumeAudio();
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownloading) return;
    
    setIsDownloading(true);
    try {
      if (!audioDataRef.current) {
        const audioData = await geminiService.fetchSpeech(text);
        if (!audioData) throw new Error("Audio fetch failed");
        audioDataRef.current = audioData;
      }

      const blob = createWavBlob(audioDataRef.current);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kazitrust-legal-summary-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download Failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const startAudio = async () => {
    setState('loading');
    try {
      if (!audioDataRef.current) {
        const audioData = await geminiService.fetchSpeech(text);
        if (!audioData) {
          setState('idle');
          return;
        }
        audioDataRef.current = audioData;
      }

      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      if (!audioBufferRef.current) {
        const buffer = await decodeAudioData(audioDataRef.current, audioCtxRef.current, 24000, 1);
        audioBufferRef.current = buffer;
      }

      playBuffer();
    } catch (error) {
      console.error('TTS Failed:', error);
      setState('idle');
    }
  };

  const playBuffer = () => {
    if (!audioCtxRef.current || !audioBufferRef.current) return;

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    const source = audioCtxRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.connect(audioCtxRef.current.destination);
    
    source.onended = () => {
      setState('idle');
    };

    source.start();
    sourceNodeRef.current = source;
    setState('playing');
  };

  const pauseAudio = async () => {
    if (audioCtxRef.current && state === 'playing') {
      await audioCtxRef.current.suspend();
      setState('paused');
    }
  };

  const resumeAudio = async () => {
    if (audioCtxRef.current && state === 'paused') {
      await audioCtxRef.current.resume();
      setState('playing');
    }
  };

  const getIcon = () => {
    if (state === 'loading') return <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>;
    if (state === 'playing') return '⏸️';
    if (state === 'paused') return '▶️';
    return '🔊';
  };

  const getLabel = () => {
    if (state === 'loading') return 'Tayari...';
    if (state === 'playing') return 'Wacha';
    if (state === 'paused') return 'Endelea';
    return 'Sikiliza';
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleToggle}
        disabled={state === 'loading'}
        className={`flex items-center gap-3 rounded-l-xl font-bold transition-all ${
          size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm'
        } ${
          state === 'playing' || state === 'paused'
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
          : 'bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95 shadow-lg shadow-emerald-900/20'
        }`}
        aria-label={getLabel()}
      >
        <span className="text-base flex items-center justify-center w-5 h-5">{getIcon()}</span>
        <span>{getLabel()}</span>
      </button>
      
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className={`flex items-center justify-center rounded-r-xl border-l border-white/10 transition-all ${
          size === 'sm' ? 'p-1.5' : 'p-2.5'
        } ${
          state === 'playing' || state === 'paused'
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          : 'bg-emerald-700 text-white hover:bg-emerald-600'
        }`}
        title="Pakua Sauti (Download Audio)"
        aria-label="Download Audio"
      >
        {isDownloading ? (
          <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default TTSButton;
