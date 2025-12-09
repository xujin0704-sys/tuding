
import React, { useState } from 'react';
import { Server, AlertTriangle, Activity, Thermometer, Database, Cpu, HardDrive, Edit3, CloudLightning } from 'lucide-react';

const NODES = [
  { id: 'gpu-node-01', status: 'Healthy', temp: 65, vram: 78, tasks: 4, model: 'Road_Ext_v2' },
  { id: 'gpu-node-02', status: 'Healthy', temp: 68, vram: 82, tasks: 4, model: 'Road_Ext_v2' },
  { id: 'gpu-node-03', status: 'Warning', temp: 82, vram: 96, tasks: 6, model: 'POI_Detect_v3' },
  { id: 'gpu-node-04', status: 'Healthy', temp: 62, vram: 40, tasks: 2, model: 'POI_Detect_v3' },
  { id: 'gpu-node-05', status: 'Healthy', temp: 60, vram: 30, tasks: 1, model: 'Admin_Seg_v1' },
  { id: 'gpu-node-06', status: 'Offline', temp: 0, vram: 0, tasks: 0, model: '-' },
];

const SystemComputeMonitor: React.FC = () => {
  const [scaleRule, setScaleRule] = useState({ queueThreshold: 5000, scaleCount: 2 });

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-900 animate-in fade-in text-slate-300">
       <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
             <div>
                <h1 className="text-2xl font-bold text-white flex items-center">
                   <Server className="mr-3 text-blue-500" />
                   模型服务监控 (Model Serving Ops)
                </h1>
                <p className="text-slate-400 text-sm mt-1">实时监控推理节点健康度与自动扩缩容策略。</p>
             </div>
             <div className="flex space-x-3">
                <div className="flex items-center px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
                   <Activity size={16} className="text-emerald-400 mr-2" />
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Total QPS</span>
                      <span className="text-sm font-bold text-white">12,450</span>
                   </div>
                </div>
                <div className="flex items-center px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
                   <Database size={16} className="text-blue-400 mr-2" />
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Active Nodes</span>
                      <span className="text-sm font-bold text-white">5 / 6</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Node Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {NODES.map(node => (
                <div key={node.id} className={`p-5 rounded-xl border ${node.status === 'Offline' ? 'bg-slate-800/50 border-slate-700/50 opacity-60' : 'bg-slate-800 border-slate-700 hover:border-slate-600'} shadow-lg relative overflow-hidden group transition-all`}>
                   <div className="flex justify-between items-center mb-4 relative z-10">
                      <div className="flex items-center">
                         <div className={`w-2 h-2 rounded-full mr-2 ${node.status === 'Healthy' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : node.status === 'Warning' ? 'bg-amber-500 animate-pulse' : 'bg-slate-500'}`}></div>
                         <span className="text-sm font-mono font-bold text-white tracking-tight">
                            {node.id}
                         </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700/50">
                         {node.model}
                      </span>
                   </div>
                   
                   {node.status !== 'Offline' && (
                       <div className="space-y-4 relative z-10">
                          {/* Metrics */}
                          <div className="grid grid-cols-3 gap-2">
                             <div className="bg-slate-900/50 rounded p-2 text-center border border-slate-700/30">
                                <div className="text-[10px] text-slate-500 mb-1 flex items-center justify-center"><Thermometer size={10} className="mr-1"/> Temp</div>
                                <div className={`text-sm font-bold ${node.temp > 80 ? 'text-rose-400' : 'text-slate-200'}`}>{node.temp}°C</div>
                             </div>
                             <div className="bg-slate-900/50 rounded p-2 text-center border border-slate-700/30">
                                <div className="text-[10px] text-slate-500 mb-1 flex items-center justify-center"><HardDrive size={10} className="mr-1"/> VRAM</div>
                                <div className={`text-sm font-bold ${node.vram > 90 ? 'text-rose-400' : 'text-slate-200'}`}>{node.vram}%</div>
                             </div>
                             <div className="bg-slate-900/50 rounded p-2 text-center border border-slate-700/30">
                                <div className="text-[10px] text-slate-500 mb-1 flex items-center justify-center"><Cpu size={10} className="mr-1"/> Tasks</div>
                                <div className="text-sm font-bold text-slate-200">{node.tasks}</div>
                             </div>
                          </div>
                          
                          {/* Load Bar */}
                          <div>
                             <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                <span>Compute Load</span>
                                <span>{Math.round((node.vram + node.temp)/2)}%</span>
                             </div>
                             <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                <div 
                                   className={`h-full rounded-full transition-all duration-1000 ${node.vram > 90 ? 'bg-gradient-to-r from-rose-500 to-rose-400' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`} 
                                   style={{width: `${Math.round((node.vram + node.temp)/2)}%`}}
                                ></div>
                             </div>
                          </div>
                       </div>
                   )}
                   
                   {/* Background Glow for High Load */}
                   {node.vram > 85 && (
                       <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
                   )}
                </div>
             ))}
          </div>

          {/* Auto-Scaling Policy Config */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
                <CloudLightning size={120} />
             </div>
             
             <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                   <h3 className="text-lg font-bold text-white flex items-center">
                      <CloudLightning className="mr-2 text-yellow-400" size={20} />
                      弹性扩缩容策略 (Auto-Scaling Policy)
                   </h3>
                   <p className="text-xs text-slate-400 mt-1">基于任务积压情况动态调整云端算力资源。</p>
                </div>
                <button className="text-xs flex items-center bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded transition-colors">
                   <Edit3 size={12} className="mr-1.5"/> 修改策略
                </button>
             </div>

             <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700 relative z-10">
                <div className="flex items-center space-x-4 font-mono text-sm">
                   <span className="text-purple-400 font-bold">IF</span>
                   <span className="text-slate-300">Task_Queue_Size</span>
                   <span className="text-yellow-400">&gt;</span>
                   <div className="bg-slate-800 px-2 py-1 rounded border border-slate-600 text-white font-bold min-w-[60px] text-center">
                      {scaleRule.queueThreshold}
                   </div>
                   <span className="text-purple-400 font-bold">THEN</span>
                   <span className="text-emerald-400 font-bold">SCALE UP</span>
                   <span className="text-slate-300">by</span>
                   <div className="bg-slate-800 px-2 py-1 rounded border border-slate-600 text-white font-bold min-w-[40px] text-center">
                      {scaleRule.scaleCount}
                   </div>
                   <span className="text-slate-300">Instances</span>
                </div>
                
                <div className="mt-4 flex items-center text-xs text-slate-500">
                   <Activity size={12} className="mr-1.5"/>
                   <span>当前状态: 队列深度 1,420 (未触发)</span>
                   <span className="mx-2">|</span>
                   <span>冷却时间: 5m 20s</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default SystemComputeMonitor;
