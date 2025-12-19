
import React from 'react';
import { AppView } from '../types';
import { Home, LayoutDashboard, User, ShieldCheck } from 'lucide-react';

interface LayoutProps {
  view: AppView;
  setView: (view: AppView) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ view, setView, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
              K
            </div>
            <div>
              <h1 className="font-bold text-slate-800 leading-tight">KALKI JAM JAM</h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Smart Resort System</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => setView('MOBILE')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'MOBILE' ? 'bg-green-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Guest App
            </button>
            <button 
              onClick={() => setView('ADMIN')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'ADMIN' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Staff Portal
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center">
              <User size={16} className="text-slate-600" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        {children}
      </main>

      {/* Bottom Nav for Mobile View */}
      {view === 'MOBILE' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 px-6 z-50">
          <button className="flex flex-col items-center gap-1 text-green-600">
            <Home size={24} />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <LayoutDashboard size={24} />
            <span className="text-[10px] font-medium">Wallet</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <ShieldCheck size={24} />
            <span className="text-[10px] font-medium">Concierge</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Layout;
