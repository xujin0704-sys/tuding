
import React, { useState } from 'react';
import { Zap, Layers, PlayCircle, CheckCircle2, ArrowRight, User } from 'lucide-react';

const HotfixExpress: React.FC = () => {
  const [hotfixStep, setHotfixStep] = useState(1);

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50 animate-in fade-in">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center">
              <Zap className="mr-3 text-rose-600" />
              热修通道 (Hotfix Express)
            </h1>
            <p className="text-slate-500 mt-1">针对线上严重问题的快速修复与发布流程。</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Steps */}
            <div className="col-span-1 space-y-4">
                {[
                    { step: 1, label: '创建 Patch', desc: '选择已修复的任务 (P0)', icon: Layers },
                    { step: 2, label: '微观仿真 (Micro-Sim)', desc: '局部区域路由/检索测试', icon: PlayCircle },
                    { step: 3, label: '增量发布', desc: '推送到线上引擎', icon: Zap },
                ].map(s => (
                    <div 
                        key={s.step}
                        className={`p-4 rounded-xl border transition-all ${hotfixStep === s.step ? 'bg-white border-rose-200 shadow-md ring-1 ring-rose-100' : 'bg-slate-50 border-slate-200 opacity-60'}`}
                    >
                        <div className="flex items-center mb-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${hotfixStep === s.step ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                {s.step}
                            </div>
                            <span className={`font-bold ${hotfixStep === s.step ? 'text-slate-800' : 'text-slate-500'}`}>{s.label}</span>
                        </div>
                        <div className="text-xs text-slate-500 ml-9">{s.desc}</div>
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-[400px]">
                {hotfixStep === 1 && (
                    <div className="flex-1 flex flex-col justify-center items-center space-y-4">
                        <Layers size={48} className="text-rose-100" />
                        <h3 className="text-lg font-bold text-slate-700">选择待发布修复任务</h3>
                        <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-lg p-4 cursor-pointer hover:border-blue-400 transition-colors">
                            <div className="flex justify-between mb-2">
                                <span className="font-bold text-sm">Task-991: 修复京藏高速入口方向</span>
                                <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-bold">P0</span>
                            </div>
                            <div className="text-xs text-slate-500 flex items-center">
                                <User size={12} className="mr-1"/> 王强 • <CheckCircle2 size={12} className="ml-2 mr-1 text-green-500"/> Validated
                            </div>
                        </div>
                        <button 
                            onClick={() => setHotfixStep(2)}
                            className="mt-4 px-6 py-2 bg-rose-600 text-white rounded-lg font-bold shadow-lg hover:bg-rose-700 transition-colors flex items-center"
                        >
                            生成 Patch 包 <ArrowRight size={16} className="ml-2"/>
                        </button>
                    </div>
                )}

                {hotfixStep === 2 && (
                    <div className="flex-1 flex flex-col justify-center items-center space-y-6">
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-rose-500 rounded-full border-t-transparent animate-spin"></div>
                            <PlayCircle size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-rose-600" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-slate-700">正在运行微观仿真...</h3>
                            <p className="text-xs text-slate-500 mt-2">Target: Region [116.3, 39.9] +/- 5km</p>
                            <p className="text-xs text-slate-500">Test Cases: 120 Routing Requests</p>
                        </div>
                        <button 
                            onClick={() => setHotfixStep(3)}
                            className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm"
                        >
                            模拟通过 (Demo)
                        </button>
                    </div>
                )}

                {hotfixStep === 3 && (
                    <div className="flex-1 flex flex-col justify-center items-center space-y-6">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle2 size={40} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-slate-900">Patch Ready</h3>
                            <p className="text-sm text-slate-500 mt-2">v2025.01-Patch-01 已就绪</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg text-xs text-slate-600 w-full max-w-sm">
                            <div className="flex justify-between mb-1"><span>Diff Size:</span> <span className="font-mono font-bold">24KB</span></div>
                            <div className="flex justify-between"><span>Impact:</span> <span className="font-mono font-bold">1 Tile Update</span></div>
                        </div>
                        <button 
                            onClick={() => { alert('已发布!'); setHotfixStep(1); }}
                            className="px-8 py-3 bg-rose-600 text-white rounded-lg font-bold shadow-xl hover:bg-rose-700 hover:scale-105 transition-all flex items-center"
                        >
                            <Zap size={18} className="mr-2"/> 立即发布上线
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default HotfixExpress;