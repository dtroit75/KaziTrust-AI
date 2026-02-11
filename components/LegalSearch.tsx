
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { GroundingSource, Language } from '../types';
import TTSButton from './TTSButton';

const LegalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [lang, setLang] = useState<Language>(Language.ENGLISH);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; sources: GroundingSource[] } | null>(null);

  const suggestions = [
    "Minimum wage for house help in Nairobi",
    "Termination without notice laws",
    "Annual leave allowance",
    "Unpaid salary dispute process",
    "Mandatory NHIF contributions"
  ];

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = customQuery || query;
    if (!finalQuery.trim()) return;
    
    setQuery(finalQuery);
    setLoading(true);
    try {
      const res = await geminiService.searchLaborLaws(finalQuery, lang);
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-12">
      <div className="civic-card p-10">
        <div className="max-w-3xl mb-10">
          <h2 className="text-3xl font-extrabold mb-3 text-white">Rights Explorer</h2>
          <p className="text-slate-400 text-lg leading-relaxed">Search the verified Kenyan Labor Database. Get clear answers grounded in current legislation in your preferred language.</p>
        </div>
        
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors">🔍</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about wages, leave, or disputes..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-6 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-700 text-[16px]"
              />
            </div>
            
            <div className="relative min-w-[200px]">
              <select 
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="w-full h-full px-6 py-4 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none cursor-pointer focus:border-emerald-500 appearance-none font-semibold text-[15px]"
              >
                <option value={Language.ENGLISH}>Response: English</option>
                <option value={Language.KISWAHILI}>Response: Kiswahili</option>
                <option value={Language.SHENG}>Response: Sheng</option>
              </select>
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">▼</span>
            </div>

            <button 
              disabled={loading}
              className="bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 disabled:opacity-50 active:scale-95 text-[16px]"
            >
              {loading ? 'Consulting Laws...' : 'Search'}
            </button>
          </form>

          <div className="pt-6">
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Common Labor Queries</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSearch(undefined, s)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-sm text-slate-400 hover:text-white transition-all font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="civic-card overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
          <div className="p-10 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start gap-6 bg-slate-900/30">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">Verification Result ({lang})</span>
              <h3 className="text-2xl font-extrabold text-white">Legal Guidance</h3>
            </div>
            <TTSButton text={result.text} />
          </div>

          <div className="p-10">
            <div className="prose-legal whitespace-pre-wrap mb-12">
              {result.text}
            </div>

            {result.sources.length > 0 && (
              <div className="pt-10 border-t border-slate-800">
                <h4 className="text-[11px] font-black text-slate-500 mb-6 uppercase tracking-[0.2em]">Referenced Official Sources</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.sources.map((source, i) => (
                    <a 
                      key={i} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 transition-all group"
                    >
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">🔗</div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-sm font-bold text-slate-200 truncate group-hover:text-emerald-400 transition-colors">{source.title}</span>
                        <span className="block text-[10px] text-slate-600 truncate mt-0.5">{source.uri}</span>
                      </div>
                    </a>
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

export default LegalSearch;
