import React, { useMemo } from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Settings, 
  Cpu, 
  Database, 
  GitBranch, 
  FlaskConical, 
  Factory, 
  MonitorCheck, 
  Activity, 
  Map as MapIcon, 
  ChevronDown, 
  ChevronRight, 
  ListTodo, 
  CheckCircle2, 
  PlayCircle, 
  ShieldAlert, 
  FileText, 
  Briefcase, 
  ListTree, 
  ShieldCheck, 
  Users, 
  Coins
} from 'lucide-react';
import { ViewState } from '../types';
import { MenuItem } from '../navigation';

// Map of icon strings to Lucide components
const getIcon = (iconName?: string) => {
  switch(iconName) {
    case 'LayoutDashboard': return LayoutDashboard;
    case 'Activity': return Activity;
    case 'Database': return Database;
    case 'BrainCircuit': return Cpu;
    case 'Cpu': return Cpu;
    case 'Workflow': return Factory;
    case 'Map': return MapIcon;
    case 'TestTube': return FlaskConical;
    case 'FlaskConical': return FlaskConical;
    case 'GitBranch': return GitBranch;
    case 'Settings': return Settings;
    case 'Inbox': return Inbox;
    case 'ListTodo': return ListTodo;
    case 'CheckCircle2': return CheckCircle2;
    case 'PlayCircle': return PlayCircle;
    case 'ShieldAlert': return ShieldAlert;
    case 'FileText': return FileText;
    case 'Briefcase': return Briefcase;
    case 'ListTree': return ListTree;
    case 'ShieldCheck': return ShieldCheck;
    case 'Users': return Users;
    case 'Coins': return Coins;
    default: return MonitorCheck;
  }
};

interface SidebarItemProps {
  item: MenuItem;
  depth?: number;
  currentView: ViewState;
  isCollapsed: boolean;
  expandedGroups: Record<string, boolean>;
  onToggleGroup: (id: string) => void;
  onNavigate: (view: ViewState) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  item, 
  depth = 0, 
  currentView, 
  isCollapsed, 
  expandedGroups, 
  onToggleGroup, 
  onNavigate 
}) => {
  const Icon = getIcon(item.icon);
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedGroups[item.id];
  const isActive = currentView === item.id;

  // Check if any deep child is active to highlight parent group
  const isChildActive = useMemo(() => {
      const checkChildren = (items?: MenuItem[]): boolean => {
          if (!items) return false;
          return items.some(child => child.id === currentView || checkChildren(child.children));
      };
      return checkChildren(item.children);
  }, [item, currentView]);

  const indentClass = depth === 0 ? 'px-3' : depth === 1 ? 'pl-9' : 'pl-12';

  const handleClick = () => {
    if (isCollapsed && hasChildren) {
       // If collapsed and clicking a group, expand sidebar first (handled by parent usually, but here we just toggle logic)
       // Note: In a full implementation, this might trigger the sidebar to open or show a floating menu.
       // For now, we assume simple toggle behavior or navigate.
       if (!expandedGroups[item.id]) onToggleGroup(item.id);
       return;
    }
    
    if (hasChildren) {
      onToggleGroup(item.id);
    } else {
      onNavigate(item.id as ViewState);
    }
  };

  return (
    <div className="mb-1">
      <button 
        title={isCollapsed ? item.label : undefined}
        onClick={handleClick}
        className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : `justify-between ${indentClass}`} py-2 text-sm font-medium rounded-lg transition-all duration-200
          ${isActive && !hasChildren 
            ? 'bg-gray-100 text-gray-900 shadow-sm ring-1 ring-gray-200' 
            : ''}
          ${!isActive && !hasChildren 
            ? 'text-gray-500 hover:bg-gray-50 hover:text-gray-900' 
            : ''}
          ${hasChildren && isChildActive ? 'text-gray-800' : ''}
          ${hasChildren && !isChildActive ? 'text-gray-500 hover:text-gray-700' : ''}
          ${depth > 0 ? 'text-xs' : ''}
        `}
      >
        <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
          {Icon && item.icon && <Icon size={depth === 0 ? 18 : 16} className={`${isCollapsed ? '' : 'mr-3'} ${isActive && !hasChildren ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />}
          {!item.icon && depth > 0 && <span className={`w-1.5 h-1.5 rounded-full ${isCollapsed ? '' : 'mr-3'} ${isActive ? 'bg-blue-600' : 'bg-gray-300'}`}></span>}
          {!isCollapsed && item.label}
        </div>
        {!isCollapsed && hasChildren && (
          <div className="text-gray-400">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
        )}
      </button>

      {hasChildren && isExpanded && !isCollapsed && (
        <div className="mt-1 space-y-0.5 relative">
           {/* Indent line */}
           <div className="absolute top-1 bottom-1 w-px bg-gray-200" style={{ left: depth === 0 ? '1.2rem' : depth === 1 ? '2.5rem' : '3.5rem' }}></div>
           {item.children?.map(child => (
             <SidebarItem 
                key={child.id} 
                item={child} 
                depth={depth + 1} 
                currentView={currentView}
                isCollapsed={isCollapsed}
                expandedGroups={expandedGroups}
                onToggleGroup={onToggleGroup}
                onNavigate={onNavigate}
             />
           ))}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;