
import React from 'react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Home Dashboard', icon: '🏠' },
    { id: 'search', label: 'Rights Explorer', icon: '⚖️' },
    { id: 'translate', label: 'Law Translator', icon: '🗣️' },
    { id: 'video', label: 'Media Analysis', icon: '📄' },
    { id: 'chat', label: 'AI Counselor', icon: '🤖' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-950 text-white hidden lg:flex flex-col z-50 border-r border-slate-800">
      <div className="p-8">
        <h1 className="text-2xl font-extrabold text-emerald-500 tracking-tight flex items-center gap-2">
          KaziTrust <span className="text-white/50 font-light">AI</span>
        </h1>
        <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Nairobi Hub</span>
        </div>
      </div>
      
      <nav className="flex-1 mt-4 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentView === item.id 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <span className={`text-xl transition-transform ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110 opacity-70'}`}>
              {item.icon}
            </span>
            <span className="font-semibold text-[15px]">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 m-4 bg-slate-900 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src="https://picsum.photos/40/40?grayscale" className="rounded-lg border border-slate-700" alt="Profile" />
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">Worker ID: #2901</p>
            <p className="text-[10px] text-slate-500 font-medium">Nairobi, Kenya</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
