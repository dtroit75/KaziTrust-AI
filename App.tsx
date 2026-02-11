
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LegalSearch from './components/LegalSearch';
import Translator from './components/Translator';
import VideoAnalyzer from './components/VideoAnalyzer';
import ChatBot from './components/ChatBot';

type View = 'dashboard' | 'search' | 'translate' | 'video' | 'chat';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentView} />;
      case 'search': return <LegalSearch />;
      case 'translate': return <Translator />;
      case 'video': return <VideoAnalyzer />;
      case 'chat': return <ChatBot />;
      default: return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1 lg:ml-64 p-6 md:p-12 lg:p-16">
        <div className="max-w-6xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
