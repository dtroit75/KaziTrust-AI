
import React from 'react';

interface DashboardProps {
  onNavigate: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const updates = [
    { title: "Minimum Wage Adjustment 2024", date: "Jan 12, 2024", tag: "Wage", url: "https://www.labour.go.ke/", status: "Critical" },
    { title: "NHIF to SHIF Transition Guide", date: "Feb 05, 2024", tag: "Health", url: "https://sha.go.ke/", status: "New" },
    { title: "Domestic Worker Protection Bill", date: "Mar 10, 2024", tag: "Policy", url: "http://kenyalaw.org/", status: "Update" }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
        <div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">KaziTrust Hub</h2>
          <p className="text-slate-400 font-medium mt-2 text-lg">Secure, up-to-date legal support for domestic workers in Nairobi.</p>
        </div>
        <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          Last Update: Today, 09:45 AM
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { id: 'search', title: 'Rights Explorer', desc: 'Verify legal minimums for pay, leave, and fair termination.', icon: '⚖️', theme: 'emerald' },
          { id: 'translate', title: 'Law Translator', desc: 'Convert technical legal documents into Kiswahili or Sheng.', icon: '🗣️', theme: 'blue' },
          { id: 'video', title: 'Media Analyzer', desc: 'Scan contracts for potential legal risks and red flags.', icon: '📄', theme: 'purple' },
        ].map((card) => (
          <button 
            key={card.id}
            onClick={() => onNavigate(card.id as any)}
            className="civic-card p-8 text-left hover:border-emerald-500/50 transition-all duration-300 group flex flex-col h-full"
          >
            <div className={`w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-emerald-600/10 transition-colors`}>
              {card.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors">{card.title}</h3>
            <p className="text-slate-400 text-[15px] leading-relaxed flex-grow">{card.desc}</p>
            <div className="mt-6 flex items-center text-xs font-bold uppercase tracking-wider text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
              Launch Tool →
            </div>
          </button>
        ))}
      </div>

      <div className="glass-civic rounded-[2rem] p-10 md:p-14 border-emerald-500/20 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">Immediate Support</span>
          <h3 className="text-4xl font-black mb-6 leading-tight">Professional Legal <br/><span className="text-emerald-500">Counseling via KaziTrust</span></h3>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed">
            Discuss workplace disputes, contract questions, or rights violations in confidence. KaziTrust is trained on the latest Employment Act.
          </p>
          <button 
            onClick={() => onNavigate('chat')}
            className="bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 active:scale-95 text-lg"
          >
            Speak with KaziTrust
          </button>
        </div>
        <div className="absolute top-1/2 -right-10 -translate-y-1/2 opacity-[0.03] rotate-12 pointer-events-none">
            <span className="text-[25rem]">🛡️</span>
        </div>
      </div>

      <section className="civic-card p-10">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-emerald-500">📅</span> Official Legal Gazette
          </h3>
          <button className="text-xs font-bold text-slate-500 hover:text-emerald-400 uppercase tracking-widest transition-colors">View Archives</button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {updates.map((item, i) => (
            <a 
              key={i} 
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 transition-all group gap-4"
            >
              <div className="flex items-center gap-6">
                <div className={`w-2 h-10 rounded-full ${item.status === 'Critical' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                <div>
                  <p className="font-bold text-lg text-slate-100 group-hover:text-emerald-400 transition-colors">{item.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-slate-500">{item.date}</p>
                    <span className="text-slate-700">•</span>
                    <p className="text-xs text-slate-500 font-medium">{item.tag}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  item.status === 'Critical' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {item.status}
                </span>
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-emerald-400 group-hover:bg-emerald-400/10 transition-all">
                  →
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
