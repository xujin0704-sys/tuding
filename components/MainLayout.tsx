
import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';
import Sidebar from './Sidebar';
import { ViewState } from '../types';

interface MainLayoutProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  children: React.ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ currentView, onNavigate, children, className = '' }) => {
  return (
    <div className={`flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden selection:bg-blue-100 selection:text-blue-900 ${className}`}>
      <Sidebar 
        currentView={currentView}
        onNavigate={onNavigate}
      />
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 relative">
        {/* Global Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-10 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <div className="flex items-center flex-1">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="全局搜索资料、任务或指标..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent border rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:bg-white transition-all placeholder:text-gray-400 outline-none" 
                />
              </div>
          </div>
          <div className="flex items-center space-x-5">
              <button className="text-gray-500 hover:text-gray-700 relative p-1 hover:bg-gray-100 rounded-full transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-4 w-px bg-gray-200"></div>
              <button className="flex items-center text-gray-500 hover:text-gray-800 text-sm font-medium hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors">
                <HelpCircle size={18} className="mr-1.5" />
                帮助与支持
              </button>
          </div>
        </header>

        {/* Main Content Area */}
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
