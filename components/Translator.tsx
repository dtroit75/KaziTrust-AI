
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { Language, TranslationResult } from '../types';
import TTSButton from './TTSButton';

const Translator: React.FC = () => {
  const [text, setText] = useState('');
  const [lang, setLang] = useState<Language>(Language.KISWAHILI);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await geminiService.translateLegalese(text, lang);
      setResult({
        original: text,
        ...res
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const citations = result?.citations || [];

  return (
    <div className="space-y-10 pb-12">
      <div className="civic-card p-10">
        <div className="max-w-3xl mb-10">
          <h2 className="text-3xl font-extrabold mb-3 text-white">Language Gateway</h2>
          <p className="text-slate-400 text-lg leading-relaxed">Break down complex "legalese" into understandable Swahili or Sheng context.</p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2 block ml-1">Original Legal Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste contract sections or court findings here..."
              className="w-full h-56 bg-slate-950 border border-slate-800 rounded-2xl p-6 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-800 resize-none text-[16px]"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <select 
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="w-full h-full px-6 py-4 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none cursor-pointer focus:border-blue-500 appearance-none font-semibold text-[15px]"
              >
                <option value={Language.KISWAHILI}>Target: Swahili (Sanifu)</option>
                <option value={Language.SHENG}>Target: Sheng (Nairobi Context)</option>
                <option value={Language.ENGLISH}>Simplify (Plain English)</option>
              </select>
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">▼</span>
            </div>
            <button
              onClick={handleTranslate}
              disabled={loading}
              className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50 active:scale-95 text-[16px]"
            >
              {loading ? 'Translating Context...' : 'Translate Context'}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="civic-card overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="p-10 bg-blue-600/5 border-b border-blue-600/20 flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">Simplified Interpretation</span>
              <p className="text-white text-2xl leading-relaxed font-bold">{result.translated}</p>
            </div>
            <TTSButton text={result.translated} />
          </div>
          
          <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h4 className="text-[11px] font-black text-slate-500 mb-4 uppercase tracking-[0.2em]">Detailed Explanation (Maelezo)</h4>
              <p className="text-slate-300 text-[17px] leading-relaxed mb-6">{result.explanation}</p>
              <TTSButton text={result.explanation} size="sm" />
            </div>

            {citations.length > 0 && (
              <div className="pt-10 lg:pt-0 lg:pl-12 border-t lg:border-t-0 lg:border-l border-slate-800">
                <h4 className="text-[11px] font-black text-slate-500 mb-6 uppercase tracking-[0.2em]">Legal References</h4>
                <div className="space-y-3">
                  {citations.map((cite, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-blue-500 text-xl">📖</span>
                      <span className="text-slate-200 font-bold text-sm">{cite}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Translator;
