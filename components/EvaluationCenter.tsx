
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard,
  ListTodo,
  CheckCircle2,
  PlayCircle,
  ShieldAlert,
  FileText,
} from 'lucide-react';

// Import sub-components
import EvalDashboard from './evaluation/EvalDashboard';
import EvalTaskList from './evaluation/EvalTaskList';
import EvalStaticQA from './evaluation/EvalStaticQA';
import EvalSimulation from './evaluation/EvalSimulation';
import EvalAdversarial from './evaluation/EvalAdversarial';
import EvalDecision from './evaluation/EvalDecision';

type SubView = 'dashboard' | 'tasks' | 'static-qa' | 'simulation' | 'adversarial' | 'decision';

const EvaluationCenter: React.FC = () => {
  const [currentView, setCurrentView] = useState<SubView>('dashboard');
  
  // -- Internal Navigation Configuration --
  const MENU_ITEMS = [
    { id: 'dashboard', label: '评测概览', icon: LayoutDashboard },
    { id: 'tasks', label: '任务管理', icon: ListTodo },
    { id: 'static-qa', label: '静态与逻辑质检', icon: CheckCircle2 },
    { id: 'simulation', label: '服务仿真沙箱', icon: PlayCircle },
    { id: 'adversarial', label: '对抗性验证', icon: ShieldAlert },
    { id: 'decision', label: '报告与决策', icon: FileText },
  ];

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
      {/* Secondary Sidebar (Navigation) */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.01)]">
        <div className="p-6 border-b border-slate-100">
           <h2 className="text-lg font-bold text-slate-800 flex items-center">
             <ShieldCheck className="mr-2 text-blue-600" />
             评测中心
           </h2>
           <p className="text-xs text-slate-500 mt-1">Evaluation & QA Lab</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
           {MENU_ITEMS.map(item => (
             <button
                key={item.id}
                onClick={() => setCurrentView(item.id as SubView)}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    currentView === item.id 
                    ? 'bg-blue-50 text-blue-700 font-bold shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
             >
                <item.icon size={18} className={`mr-3 ${currentView === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                {item.label}
             </button>
           ))}
        </nav>
        {/* Footer Stats */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Cluster Load</span>
                <span>42%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[42%]"></div>
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
          {currentView === 'dashboard' && <EvalDashboard />}
          {currentView === 'tasks' && <EvalTaskList />}
          {currentView === 'static-qa' && <EvalStaticQA />}
          {currentView === 'simulation' && <EvalSimulation />}
          {currentView === 'adversarial' && <EvalAdversarial />}
          {currentView === 'decision' && <EvalDecision />}
      </div>
    </div>
  );
};

export default EvaluationCenter;
