

import React, { useState } from 'react';
import { 
  Activity, 
  ArrowRight, 
  AlertTriangle, 
  Clock, 
  MoreHorizontal, 
  ChevronRight,
  Zap,
  Users,
  Database,
  Cpu,
  Layers,
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BrainCircuit,
  X,
  FileText
} from 'lucide-react';
import { VERSION_MONITORS, FLOW_NODES } from '../constants';
import { VersionMonitor, PipelineMonitorStatus, FlowNode } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const MonitoringDashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'commander' | 'xray'>('commander');
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const activeVersion = VERSION_MONITORS.find(v => v.versionId === selectedVersionId);
  const activePipeline = activeVersion?.pipelines.find(p => p.id === selectedPipelineId);
  const selectedNode = FLOW_NODES.find(n => n.id === selectedNodeId);

  const handlePipelineClick = (versionId: string, pipelineId: string) => {
    setSelectedVersionId(versionId);
    setSelectedPipelineId(pipelineId);
    setViewMode('xray');
  };

  const mockTrendData = [
    { time: '10:00', value: 85 },
    { time: '11:00', value: 88 },
    { time: '12:00', value: 82 },
    { time: '13:00', value: 90 },
    { time: '14:00', value: 65 }, // dip
    { time: '15:00', value: 70 },
    { time: '16:00', value: 85 },
  ];

  const getStatusColor = (status: 'success' | 'warning' | 'error' | 'idle') => {
    switch(status) {
      case 'success': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'error': return 'bg-rose-500';
      default: return 'bg-slate-300';
    }
  };

  const getStatusBg = (status: 'success' | 'warning' | 'error' | 'idle') => {
     switch(status) {
      case 'success': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'warning': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'error': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  // --- Render Sub-components ---

  const renderCommanderView = () => (
    <div className="flex-1 overflow-y-auto p-8 animate-in fade-in duration-300">
       
       {/* Timeline / Header Area */}
       <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">活跃版本全景</h2>
          <div className="space-y-6">
             {VERSION_MONITORS.map(version => (
               <div key={version.versionId} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Version Header */}
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                     <div className="flex items-center">
                        <div className={`w-2 h-10 rounded-full mr-4 ${version.riskLevel === 'high' ? 'bg-rose-500' : version.riskLevel === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                        <div>
                           <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-bold text-slate-900">{version.name}</h3>
                              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-bold uppercase tracking-wide">{version.type}</span>
                              <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-600 rounded font-mono">{version.versionId}</span>
                           </div>
                           <div className="flex items-center space-x-4 mt-1 text-sm text-slate-500">
                              <span className="flex items-center"><Activity size={14} className="mr-1"/> 总体进度: <span className="font-bold text-slate-700 ml-1">{version.overallProgress}%</span></span>
                              <span className="flex items-center"><Clock size={14} className="mr-1"/> 预计完成: <span className="font-bold text-slate-700 ml-1">{version.eta}</span></span>
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center space-x-3">
                        {version.riskLevel === 'high' && (
                           <div className="flex items-center text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                              <AlertTriangle size={16} className="mr-2" />
                              <span className="text-xs font-bold">风险等级：高</span>
                           </div>
                        )}
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                           <MoreHorizontal size={20} />
                        </button>
                     </div>
                  </div>

                  {/* Pipelines Swimlane */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     {version.pipelines.map(pipeline => (
                        <div 
                           key={pipeline.id} 
                           onClick={() => handlePipelineClick(version.versionId, pipeline.id)}
                           className={`relative border rounded-xl p-4 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md group ${pipeline.status === 'error' ? 'border-rose-200 bg-rose-50/30' : 'border-slate-200 bg-white hover:border-blue-300'}`}
                        >
                           <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center">
                                 <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(pipeline.status)}`}></div>
                                 <span className="font-bold text-slate-700 text-sm">{pipeline.name}</span>
                              </div>
                              <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                           </div>
                           
                           <div className="space-y-3">
                              <div className="flex justify-between text-xs text-slate-500">
                                 <span>当前阶段</span>
                                 <span className="font-medium text-slate-800">{pipeline.stage}</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                 <div className={`h-full rounded-full ${getStatusColor(pipeline.status)}`} style={{ width: `${pipeline.progress}%` }}></div>
                              </div>
                              <div className="flex justify-between items-center pt-1">
                                 {pipeline.status === 'warning' || pipeline.status === 'error' ? (
                                    <span className="text-[10px] font-bold text-rose-600 flex items-center bg-rose-100 px-1.5 py-0.5 rounded">
                                       <AlertTriangle size={10} className="mr-1" />
                                       积压: {pipeline.queueSize}
                                    </span>
                                 ) : (
                                    <span className="text-[10px] text-slate-400">排队: {pipeline.queueSize}</span>
                                 )}
                                 <span className="text-[10px] font-mono text-slate-500">{pipeline.throughput}</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
             ))}
          </div>
       </div>

       {/* Heatmap Section */}
       <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6">产线健康热力图</h2>
          <div className="overflow-x-auto">
             <table className="w-full">
                <thead>
                   <tr>
                      <th className="text-left text-xs font-bold text-slate-400 uppercase pb-4">产线 / 版本</th>
                      {VERSION_MONITORS.map(v => (
                         <th key={v.versionId} className="text-center text-xs font-bold text-slate-500 pb-4">{v.versionId}</th>
                      ))}
                   </tr>
                </thead>
                <tbody>
                   {['road', 'poi', 'admin', 'hydro'].map(pipeId => (
                      <tr key={pipeId} className="border-t border-slate-50">
                         <td className="py-4 text-sm font-bold text-slate-700 capitalize flex items-center">
                            {pipeId}
                         </td>
                         {VERSION_MONITORS.map(v => {
                            const p = v.pipelines.find(pi => pi.id === pipeId);
                            return (
                               <td key={v.versionId} className="py-4 text-center">
                                  {p ? (
                                     <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${getStatusBg(p.status)} font-bold text-xs cursor-pointer hover:scale-110 transition-transform`} title={`Queue: ${p.queueSize}`}>
                                        {p.progress}%
                                     </div>
                                  ) : (
                                     <span className="text-slate-300">-</span>
                                  )}
                               </td>
                            );
                         })}
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );

  const renderXRayView = () => (
    <div className="flex-1 flex flex-col h-full bg-slate-900 overflow-hidden relative text-slate-200 animate-in slide-in-from-right duration-300">
       
       {/* X-Ray Header */}
       <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 bg-slate-950">
          <div className="flex items-center">
             <button 
               onClick={() => setViewMode('commander')}
               className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors mr-3"
             >
               <ArrowLeft size={20} />
             </button>
             <div>
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-0.5">
                   <span>监控</span>
                   <ChevronRight size={12} />
                   <span>{activeVersion?.name}</span>
                </div>
                <h2 className="text-lg font-bold text-white flex items-center">
                   {activePipeline?.name}
                   <span className="ml-3 text-xs bg-blue-900/50 text-blue-300 border border-blue-800 px-2 py-0.5 rounded font-mono">流转透视模式</span>
                </h2>
             </div>
          </div>
          
          <div className="flex space-x-6 text-sm">
             <div>
                <span className="text-slate-500 block text-xs uppercase font-bold mb-0.5">实时吞吐</span>
                <span className="font-mono font-bold text-emerald-400">{activePipeline?.throughput}</span>
             </div>
             <div>
                <span className="text-slate-500 block text-xs uppercase font-bold mb-0.5">预计完成</span>
                <span className="font-bold text-white">{activeVersion?.eta}</span>
             </div>
             <div>
                <span className="text-slate-500 block text-xs uppercase font-bold mb-0.5">活跃风险</span>
                <span className="font-bold text-rose-400 flex items-center">
                   {activePipeline?.status === 'warning' ? '1 项警告' : activePipeline?.status === 'error' ? '1 项严重错误' : '无'}
                </span>
             </div>
          </div>
       </div>

       <div className="flex-1 flex overflow-hidden">
          
          {/* Main Flow Canvas */}
          <div className="flex-1 relative overflow-hidden" onClick={() => setSelectedNodeId(null)}>
             {/* Tech Grid Background */}
             <div className="absolute inset-0 opacity-10" style={{ 
                 backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
             }}></div>

             {/* Dynamic Flow Visualization */}
             <div className="absolute inset-0 flex items-center justify-center">
                {/* 
                   IMPORTANT: The SVG and the Nodes must share the same coordinate system.
                   We place them both inside a fixed-size centered container.
                */}
                <div className="relative w-[1150px] h-[400px]">
                   <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible" style={{ zIndex: 0 }}>
                       <defs>
                          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
                          </marker>
                          <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                          </marker>
                          <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#f43f5e" />
                          </marker>
                       </defs>
                       
                       {/* N1 -> N2 */}
                       <path d="M 194 200 L 250 200" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowhead)" />
                       
                       {/* N2 -> N3 (Green Path) */}
                       <path d="M 394 200 C 472 200, 472 130, 550 130" stroke="#10b981" strokeWidth="4" fill="none" className="animate-pulse" style={{animationDuration: '3s'}} markerEnd="url(#arrowhead-green)" />
                       
                       {/* N2 -> N4 (Red Path) */}
                       <path d="M 394 200 C 472 200, 472 270, 550 270" stroke="#f43f5e" strokeWidth="2" fill="none" markerEnd="url(#arrowhead-red)" />
                       
                       {/* N3 -> N5 (Join to Validation) */}
                       <path d="M 694 130 C 747 130, 747 200, 800 200" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowhead)" />
                       
                       {/* N4 -> N5 (Join to Validation) */}
                       <path d="M 694 270 C 747 270, 747 200, 800 200" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowhead)" />

                       {/* N5 Output (Passed) */}
                       <path d="M 944 200 L 1000 200" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead-green)" />

                       {/* N5 -> N4 (Failed / Loopback) */}
                       <path d="M 872 254 Q 780 320, 694 270" stroke="#f43f5e" strokeWidth="2" fill="none" strokeDasharray="5,5" markerEnd="url(#arrowhead-red)" />
                   </svg>

                   {FLOW_NODES.map(node => (
                      <div 
                        key={node.id}
                        onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
                        className={`absolute w-36 p-3 rounded-xl border cursor-pointer transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] flex flex-col items-center justify-center z-10
                           ${selectedNodeId === node.id 
                              ? 'bg-slate-800 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                              : 'bg-slate-900 border-slate-700 hover:border-slate-500'}
                        `}
                        style={{ left: node.x, top: node.y - 54 }}
                     >  
                        <div className={`p-2 rounded-lg mb-2 ${
                           node.type === 'source' ? 'bg-indigo-900/50 text-indigo-400' :
                           node.type === 'process' ? 'bg-blue-900/50 text-blue-400' :
                           node.type === 'path_green' ? 'bg-emerald-900/50 text-emerald-400' :
                           node.type === 'path_red' ? 'bg-rose-900/50 text-rose-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                           {node.type === 'source' ? <Database size={20} /> :
                            node.type === 'process' ? <BrainCircuit size={20} /> :
                            node.type === 'path_green' ? <Zap size={20} /> :
                            node.type === 'path_red' ? <Users size={20} /> : <Database size={20} />}
                        </div>
                        <div className="text-xs font-bold text-center text-slate-300 leading-tight">{node.label.replace(/\(.*\)/, '')}</div>
                        <div className="mt-2 text-[10px] font-mono text-slate-500">{node.value.toLocaleString()} items</div>

                        {/* Badges */}
                        {node.backlog && node.backlog > 1000 && (
                           <div className="absolute -top-3 -right-3 bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg border border-rose-400 animate-bounce">
                              {node.backlog.toLocaleString()} 积压
                           </div>
                        )}
                        {node.loss && (
                           <div className="absolute -bottom-2 -right-2 bg-slate-800 text-slate-400 text-[9px] px-1.5 py-0.5 rounded border border-slate-700">
                              -{node.loss} loss
                           </div>
                        )}
                     </div>
                   ))}
                </div>
             </div>
             
             {/* Predictive Insight Overlay */}
             <div className="absolute bottom-8 left-8 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl p-4 max-w-sm animate-in slide-in-from-bottom-5">
                <div className="flex items-center text-blue-400 mb-2">
                   <Zap size={16} className="mr-2" />
                   <h3 className="text-sm font-bold">AI 调度建议</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                   检测到 <span className="text-rose-400 font-bold">人工审核节点</span> 存在严重积压 (Queue > 10k)。建议：
                </p>
                <div className="space-y-2">
                   <button className="w-full text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded text-xs text-slate-300 transition-colors flex items-center">
                      <ArrowRight size={12} className="mr-2 text-blue-400"/>
                      从 [行政区产线] 调度 3 名空闲作业员
                   </button>
                   <button className="w-full text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded text-xs text-slate-300 transition-colors flex items-center">
                      <ArrowRight size={12} className="mr-2 text-blue-400"/>
                      临时提高 AI 置信度阈值 (0.8 → 0.9)
                   </button>
                </div>
             </div>

          </div>

          {/* Right Detail Panel */}
          <div className={`w-80 bg-slate-900 border-l border-slate-800 flex flex-col transition-all duration-300 ${selectedNode ? 'translate-x-0' : 'translate-x-full absolute right-0 top-0 bottom-0'}`}>
             {selectedNode ? (
                <>
                   <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                      <div>
                         <h3 className="font-bold text-slate-200">{selectedNode.label.replace(/\(.*\)/, '')}</h3>
                         <div className="text-xs text-slate-500 uppercase mt-1">节点详情视图</div>
                      </div>
                      <button onClick={() => setSelectedNodeId(null)} className="text-slate-500 hover:text-slate-300">
                         <X size={20} />
                      </button>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto p-5 space-y-6">
                      
                      {/* Node Details (New) */}
                      {selectedNode.details && (
                        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center">
                                <FileText size={12} className="mr-2"/>
                                流程详情
                            </h4>
                            <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                                {selectedNode.details}
                            </div>
                        </div>
                      )}

                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-3">
                         <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                            <div className="text-xs text-slate-500 mb-1">运行状态</div>
                            <div className={`text-sm font-bold capitalize ${selectedNode.status === 'normal' ? 'text-emerald-400' : 'text-rose-400'}`}>{selectedNode.status === 'normal' ? '正常' : '异常'}</div>
                         </div>
                         <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                            <div className="text-xs text-slate-500 mb-1">吞吐量</div>
                            <div className="text-sm font-bold text-slate-200">{selectedNode.value} /hr</div>
                         </div>
                      </div>

                      {/* Meta Info */}
                      {selectedNode.meta && (
                         <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center">
                               <Cpu size={12} className="mr-2"/> 
                               资源统计
                            </h4>
                            <div className="space-y-3">
                               {Object.entries(selectedNode.meta).map(([key, val]) => (
                                  <div key={key} className="flex justify-between items-center text-xs">
                                     <span className="text-slate-500 capitalize">{key}</span>
                                     <span className="font-mono text-slate-300">{val}</span>
                                  </div>
                               ))}
                            </div>
                         </div>
                      )}

                      {/* Chart: Trend */}
                      <div>
                         <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center">
                            <TrendingUp size={12} className="mr-2"/> 
                            处理效率趋势
                         </h4>
                         <div className="h-40 w-full bg-slate-800/50 rounded-lg border border-slate-700 p-2">
                            <ResponsiveContainer width="100%" height="100%">
                               <AreaChart data={mockTrendData}>
                                  <defs>
                                     <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                     </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                  <Tooltip 
                                     contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}}
                                     itemStyle={{color: '#93c5fd'}}
                                  />
                                  <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVal)" />
                               </AreaChart>
                            </ResponsiveContainer>
                         </div>
                      </div>

                   </div>
                </>
             ) : (
                <div className="flex items-center justify-center h-full text-slate-600 text-sm p-8 text-center">
                   请选择一个节点以查看详细指标。
                </div>
             )}
          </div>
       </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Header - Always visible unless X-Ray takes over full screen, but usually kept for context */}
      <div className={`h-16 border-b flex items-center justify-between px-6 z-10 shadow-sm shrink-0 transition-colors ${viewMode === 'xray' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
          <h1 className={`text-xl font-bold flex items-center ${viewMode === 'xray' ? 'text-white' : 'text-slate-900'}`}>
            <Activity className={`mr-3 ${viewMode === 'xray' ? 'text-blue-400' : 'text-blue-600'}`} />
            生产实时监测
          </h1>
          {viewMode === 'commander' && <p className="text-xs text-slate-500 mt-0.5">多版本、多产线实时流转监控大盘。</p>}
        </div>
        
        {viewMode === 'commander' && (
           <div className="flex items-center space-x-2">
              <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-slate-600">实时更新中</span>
           </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden relative">
         {viewMode === 'commander' ? renderCommanderView() : renderXRayView()}
      </div>
    </div>
  );
};

export default MonitoringDashboard;
