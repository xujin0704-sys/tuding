
import React, { useState } from 'react';
import { FlaskConical, GitMerge, CheckCircle2, SplitSquareHorizontal, ArrowRight, ThumbsUp, X } from 'lucide-react';

const DeliveryEvaluation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'merge' | 'sim' | 'qa'>('merge');

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in">
       {/* Header */}
       <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center">
             <h1 className="text-xl font-bold text-slate-900 flex items-center mr-6">
                <FlaskConical className="mr-3 text-purple-600" />
                评测中心 (Evaluation)
             </h1>
             <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('merge')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center ${activeTab === 'merge' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <GitMerge size={14} className="mr-1.5" /> 冲突与合并
                </button>
                <button 
                    onClick={() => setActiveTab('sim')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center ${activeTab === 'sim' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <SplitSquareHorizontal size={14} className="mr-1.5" /> 集成仿真
                </button>
                <button 
                    onClick={() => setActiveTab('qa')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center ${activeTab === 'qa' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <CheckCircle2 size={14} className="mr-1.5" /> 单元质检
                </button>
             </div>
          </div>
       </div>

       {/* Content */}
       <div className="flex-1 overflow-hidden p-6">
          {activeTab === 'merge' && (
              <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-slate-700">冲突解决 (Conflict Resolution) - ID: CF-9021</h3>
                      <div className="text-xs text-slate-500">检测到 1 处几何冲突</div>
                  </div>
                  
                  {/* 3-Pane Diff View */}
                  <div className="flex-1 flex gap-1 border border-slate-300 rounded-xl overflow-hidden shadow-sm">
                      {/* Left: Branch A */}
                      <div className="flex-1 bg-slate-100 flex flex-col">
                          <div className="bg-slate-200 px-3 py-2 text-xs font-bold text-slate-600 border-b border-slate-300 flex justify-between">
                              <span>Branch A (Remote)</span>
                              <span className="text-rose-600">Deleted Road</span>
                          </div>
                          <div className="flex-1 relative bg-white">
                              {/* Mock Map */}
                              <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/116.4,39.9,15,0/400x600?access_token=pk.xxx')] bg-cover opacity-50 grayscale"></div>
                              <div className="absolute top-1/2 left-1/2 w-32 h-1 bg-rose-500 -translate-x-1/2 -translate-y-1/2 rotate-45 opacity-30"></div>
                          </div>
                          <div className="p-3 bg-white border-t border-slate-200 flex justify-center">
                              <button className="px-4 py-1.5 bg-white border border-slate-300 rounded text-xs font-bold text-slate-600 hover:bg-slate-50">Accept Left</button>
                          </div>
                      </div>

                      {/* Center: Base */}
                      <div className="flex-1 bg-slate-100 flex flex-col border-x border-slate-300 relative">
                          <div className="bg-slate-200 px-3 py-2 text-xs font-bold text-slate-600 border-b border-slate-300 text-center">
                              Base (Original)
                          </div>
                          <div className="flex-1 relative bg-white">
                              <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/116.4,39.9,15,0/400x600?access_token=pk.xxx')] bg-cover opacity-80"></div>
                              <div className="absolute top-1/2 left-1/2 w-32 h-1 bg-slate-800 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                          </div>
                      </div>

                      {/* Right: Branch B */}
                      <div className="flex-1 bg-slate-100 flex flex-col">
                          <div className="bg-slate-200 px-3 py-2 text-xs font-bold text-slate-600 border-b border-slate-300 flex justify-between">
                              <span>Branch B (Local)</span>
                              <span className="text-blue-600">Renamed & Shifted</span>
                          </div>
                          <div className="flex-1 relative bg-white">
                              <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/116.4,39.9,15,0/400x600?access_token=pk.xxx')] bg-cover opacity-50 grayscale"></div>
                              <div className="absolute top-1/2 left-1/2 w-32 h-1 bg-blue-500 -translate-x-1/4 -translate-y-1/3 rotate-45"></div>
                          </div>
                          <div className="p-3 bg-white border-t border-slate-200 flex justify-center">
                              <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 shadow-sm">Accept Right</button>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'sim' && (
              <div className="h-full flex items-center justify-center">
                  <div className="text-center p-8 bg-white border border-slate-200 rounded-xl shadow-sm max-w-lg">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                          <SplitSquareHorizontal size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">集成仿真 (Integration Sim)</h3>
                      <p className="text-slate-500 text-sm mb-6">Running Golden Set Regression (10,000 cases)...</p>
                      <div className="w-full bg-slate-100 h-2 rounded-full mb-2 overflow-hidden">
                          <div className="h-full bg-blue-500 w-2/3 rounded-full"></div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400">
                          <span>Progress: 66%</span>
                          <span>ETA: 5 mins</span>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'qa' && (
              <div className="h-full bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="font-bold text-slate-800 mb-4">单元质检报告</h3>
                  <p className="text-sm text-slate-500">No active QA tasks.</p>
              </div>
          )}
       </div>
    </div>
  );
};

export default DeliveryEvaluation;