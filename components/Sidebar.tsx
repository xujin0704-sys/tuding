import React, { useState } from 'react';
import { 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ViewState } from '../types';
import { MENU_CONFIG } from '../navigation';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'workbenches': true,
    'wb-map-group': true,
    'wb-address-group': true,
    'evaluation': true,
    'sys-org': true
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 group relative`}>
      
      {/* Floating Collapse Button on Border */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 transform -translate-y-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-400 shadow-sm z-50 transition-all hover:scale-110"
        title={isCollapsed ? "展开菜单" : "收起菜单"}
      >
         {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Area */}
      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'px-6'} border-b border-gray-100 bg-white transition-all shrink-0`}>
        <div className="flex items-center overflow-hidden whitespace-nowrap">
          <div className={`w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-200 shrink-0 transition-all duration-300 ${isCollapsed ? '' : 'mr-3'}`}>
            {/* 图钉 (Pushpin) Custom SVG Logo */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white transform -rotate-45">
              <path d="M12 17v5" />
              <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
            </svg>
          </div>
          
          <div className={`transition-all duration-300 origin-left overflow-hidden ${isCollapsed ? 'w-0 opacity-0 scale-x-0' : 'w-auto opacity-100 scale-x-100'}`}>
            <span className="font-bold text-gray-900 text-lg tracking-tight block leading-none">图钉AI</span>
            <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">TUDING AI</span>
          </div>
        </div>
      </div>

      {/* Navigation - Level 1 Categories Loop */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8 scrollbar-thin scrollbar-thumb-gray-200">
        {MENU_CONFIG.map((category, idx) => (
          <div key={idx}>
            {/* Category Header (Level 1) */}
            {!isCollapsed ? (
              <div className="px-3 mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest transition-opacity duration-300">
                {category.category}
              </div>
            ) : (
              <div className="mb-3 flex justify-center">
                 <div className="h-px w-8 bg-gray-200"></div>
              </div>
            )}
            
            {/* Items (Level 2+) handled by SidebarItem */}
            <div className="space-y-0.5">
              {category.items.map(item => (
                <SidebarItem 
                  key={item.id} 
                  item={item} 
                  currentView={currentView}
                  isCollapsed={isCollapsed}
                  expandedGroups={expandedGroups}
                  onToggleGroup={toggleGroup}
                  onNavigate={(view) => {
                    if (isCollapsed) setIsCollapsed(false); // Auto expand on navigate if needed
                    onNavigate(view);
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-2">
        {/* User Profile Snippet */}
        <div className={`flex items-center rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer border border-transparent hover:border-gray-200 ${isCollapsed ? 'justify-center p-1' : 'p-2'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 border border-white shadow-sm shrink-0">
            JD
          </div>
          {!isCollapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-bold text-gray-700 truncate">Jane Doe</p>
              <p className="text-xs text-gray-500 truncate">首席架构师</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;