
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { VideoAnalysisResult } from '../types';
import TTSButton from './TTSButton';

const VideoAnalyzer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VideoAnalysisResult | null>(null);
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processFile(file);
  };

  const processFile = async (file: File) => {
    setFileName(file.name);
    setLoading(true);
    setPreviewUrl(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = (reader.result as string).split(',')[1];
      try {
        const res = await geminiService.analyzeMedia(base64Data, file.type);
        setResult(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const keyPoints = result?.keyPoints || [];
  const warnings = result?.warnings || [];

  return (
    <div className="space-y-10 pb-12">
      <div 
        onClick={triggerUpload}
        className={`civic-card p-12 text-center relative overflow-hidden bg-slate-900/40 border-dashed border-2 cursor-pointer transition-all ${
          loading ? 'opacity-50 pointer-events-none' : 'hover:border-purple-500/50 hover:bg-slate-900/60'
        }`}
      >
        <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
            <span className="text-[15rem]">📑</span>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,video/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="w-24 h-24 bg-purple-600/10 text-purple-400 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8 relative z-10 border border-purple-500/20">
          {previewUrl && fileName.match(/\.(jpg|jpeg|png|gif)$/i) ? (
            <img src={previewUrl} className="w-full h-full object-cover rounded-2xl" alt="Preview" />
          ) : '📄'}
        </div>

        <h2 className="text-3xl font-extrabold mb-4 text-white relative z-10">KaziTrust Media Audit</h2>
        <p className="text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed relative z-10 text-lg">
          Click to upload or drag a photo of your contract. We will scan for illegal clauses and risky terms instantly.
        </p>

        <div className="relative inline-block z-10 group">
          <div className={`px-12 py-5 bg-purple-600 text-white rounded-xl font-bold shadow-2xl shadow-purple-900/30 group-hover:bg-purple-500 transition-all group-active:scale-95 flex items-center gap-4 text-lg`}>
             <span>{loading ? '⌛' : '📤'}</span>
             <span>{loading ? 'Analyzing Content...' : 'Choose Media for Review'}</span>
          </div>
        </div>
        {fileName && <p className="mt-6 text-sm text-purple-400 font-bold uppercase tracking-widest">Selected: {fileName}</p>}
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-10 duration-700">
          <div className="lg:col-span-7 civic-card p-10">
            <div className="flex justify-between items-start mb-10">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Contract Analysis</span>
                <h3 className="text-2xl font-extrabold text-white">Review Summary</h3>
              </div>
              <TTSButton text={result.summary} />
            </div>
            
            <p className="text-slate-300 text-lg leading-relaxed mb-10 prose-legal">
              {result.summary}
            </p>

            <h4 className="text-[11px] font-black text-slate-500 mb-6 uppercase tracking-[0.2em]">Validated Key Terms</h4>
            <div className="space-y-3">
              {keyPoints.map((point, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-xl bg-slate-950 border border-slate-800 items-start group">
                  <span className="text-emerald-500 font-black mt-1">✓</span>
                  <span className="text-slate-300 text-[15px] font-medium leading-snug">{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="civic-card p-10 bg-rose-950/20 border-rose-500/20">
              <h3 className="text-xl font-black text-rose-500 mb-8 flex items-center gap-3">
                <span className="text-2xl">⚠️</span> Audit Red Flags
              </h3>
              <div className="space-y-6">
                {warnings.map((warning, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex gap-4">
                      <span className="text-xl mt-0.5">🛑</span>
                      <p className="text-slate-200 text-[15px] font-medium leading-relaxed">{warning}</p>
                    </div>
                    <div className="pl-10">
                      <TTSButton text={warning} size="sm" />
                    </div>
                    {i < warnings.length - 1 && <div className="h-px bg-rose-500/10"></div>}
                  </div>
                ))}
                {warnings.length === 0 && (
                  <div className="text-center py-12 opacity-50 bg-slate-900/50 rounded-2xl border border-dashed border-slate-700">
                    <span className="text-5xl block mb-4">🛡️</span>
                    <p className="text-emerald-400 font-black uppercase text-[11px] tracking-widest">Compliance Check Passed</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950/50 border border-slate-800">
              <p className="text-[11px] text-slate-500 uppercase font-black tracking-widest leading-loose">
                Confidentiality: KaziTrust audits are strictly private. Your media is processed securely to protect worker-employer confidentiality.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoAnalyzer;
