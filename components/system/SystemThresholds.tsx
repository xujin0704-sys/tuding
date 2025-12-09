
import React, { useState } from 'react';
import { Sliders, Save, AlertCircle, CheckCircle2, Clock, Zap } from 'lucide-react';

const SystemThresholds: React.FC = () => {
  const [autoPassScore, setAutoPassScore] = useState(0.95);
  const [taskTimeout, setTaskTimeout] = useState(2.0);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50 animate-in fade-in">
       <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
             <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                   <Sliders className="mr-3 text-indigo-600" />
                   阈值配置 (Thresholds)
                </h1>
                <p className="text-slate-500 mt-1">配置全局自动化置信度与任务流转超时策略。</p>
             </div>
             <button 
                onClick={handleSave}
                className={`flex items-center px-4 py-2 rounded-lg shadow-sm text-sm font-medium transition-all ${
                    isSaved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
             >
                {isSaved ? <CheckCircle2 size={16} className="mr-2" /> : <Save size={16} className="mr-2" />}
                {isSaved ? '已保存' : '保存全局配置'}
             </button>
          </div>

          <div className="space-y-6">
             {/* Confidence Threshold Card */}
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                   <div className="flex items-start">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg mr-4">
                         <Zap size={24} />
                      </div>
                      <div>
                         <h3 className="text-lg font-bold text-slate-800">自动通过置信度 (Auto_Pass_Score)</h3>
                         <p className="text-sm text-slate-500 mt-1">AI 评分高于此阈值的要素将直接入库，低于此分将转入人工审核队列。</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className="text-3xl font-mono font-bold text-indigo-600">{autoPassScore.toFixed(2)}</span>
                      <span className="text-xs text-slate-400 block mt-1">Confidence Score</span>
                   </div>
                </div>
                <div className="p-8 bg-slate-50/50">
                   <input 
                      type="range" 
                      min="0.5" 
                      max="1.0" 
                      step="0.01" 
                      value={autoPassScore}
                      onChange={(e) => setAutoPassScore(parseFloat(e.target.value))}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mb-4" 
                   />
                   <div className="flex justify-between items-center text-xs font-medium">
                      <div className="flex items-center text-slate-500">
                         0.50 <span className="mx-2 px-2 py-0.5 bg-slate-200 rounded text-slate-600">人工审核 (Manual)</span>
                      </div>
                      <div className="flex items-center text-indigo-600">
                         <span className="mx-2 px-2 py-0.5 bg-indigo-100 rounded">自动入库 (Auto)</span> 1.00
                      </div>
                   </div>
                   
                   {/* Visual Feedback Bar */}
                   <div className="mt-6 h-12 w-full bg-white border border-slate-200 rounded-lg flex overflow-hidden relative">
                      <div 
                        className="bg-amber-50 flex items-center justify-center text-amber-700 text-xs font-bold border-r border-amber-100 transition-all duration-300"
                        style={{ width: `${((autoPassScore - 0.5) / 0.5) * 100}%` }}
                      >
                         人工审核区间
                      </div>
                      <div className="flex-1 bg-green-50 flex items-center justify-center text-green-700 text-xs font-bold transition-all duration-300">
                         自动通过区间
                      </div>
                      {/* Indicator Line */}
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-indigo-600 z-10 transition-all duration-300 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                        style={{ left: `${((autoPassScore - 0.5) / 0.5) * 100}%` }}
                      >
                         <div className="absolute -top-1 -translate-x-1/2 w-3 h-3 bg-indigo-600 rounded-full"></div>
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Task Timeout Card */}
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                   <div className="flex items-start">
                      <div className="p-2 bg-orange-50 text-orange-600 rounded-lg mr-4">
                         <Clock size={24} />
                      </div>
                      <div>
                         <h3 className="text-lg font-bold text-slate-800">任务自动释放超时 (Task Timeout)</h3>
                         <p className="text-sm text-slate-500 mt-1">作业员领取任务后未提交，超过此时长自动释放回公共任务池。</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className="text-3xl font-mono font-bold text-orange-600">{taskTimeout.toFixed(1)}</span>
                      <span className="text-xs text-slate-400 block mt-1">Hours</span>
                   </div>
                </div>
                <div className="p-8 bg-slate-50/50">
                   <input 
                      type="range" 
                      min="0.5" 
                      max="24.0" 
                      step="0.5" 
                      value={taskTimeout}
                      onChange={(e) => setTaskTimeout(parseFloat(e.target.value))}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600 mb-4" 
                   />
                   <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                      <span>0.5 H</span>
                      <span>24.0 H</span>
                   </div>

                   <div className="mt-4 flex items-start p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
                      <AlertCircle size={14} className="mr-2 mt-0.5 shrink-0" />
                      <p>建议设置在 2-4 小时之间，以防止复杂任务被过早释放，同时避免任务被长期锁定。</p>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default SystemThresholds;
