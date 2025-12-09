
import React from 'react';
import { 
  Cpu, 
  Activity, 
  Server, 
  Zap, 
  BarChart2, 
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const QUOTAS = [
  { pipeline: '路网生产产线', gpu: 'A100 * 4', priority: 'High', usage: 85, queue: 120 },
  { pipeline: 'POI 智能处理', gpu: 'T4 * 8', priority: 'Medium', usage: 60, queue: 4500 },
  { pipeline: '行政区划更新', gpu: 'V100 * 2', priority: 'Low', usage: 10, queue: 0 },
  { pipeline: '紧急热修通道', gpu: 'A100 * 2', priority: 'Critical', usage: 0, queue: 0 },
];

const NODES = [
  { id: 'gpu-node-01', status: 'Healthy', temp: 65, vram: 78, tasks: 4 },
  { id: 'gpu-node-02', status: 'Healthy', temp: 68, vram: 82, tasks: 4 },
  { id: 'gpu-node-03', status: 'Warning', temp: 82, vram: 95, tasks: 6 },
  { id: 'gpu-node-04', status: 'Healthy', temp: 62, vram: 40, tasks: 2 },
];

const SystemCompute: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50 animate-in fade-in">
       <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
             <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                   <Cpu className="mr-3 text-blue-600" />
                   算力与资源调度 (Compute & AI Infra)
                </h1>
                <p className="text-slate-500 mt-1">管理 GPU 算力配额与 AI 模型服务监控。</p>
             </div>
             <div className="flex space-x-2">
                <span className="flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                   <Activity size={14} className="mr-1.5" /> Cluster Healthy
                </span>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Left: Quota Management */}
             <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                   <Zap size={20} className="mr-2 text-yellow-500" />
                   产线算力配额 (Resource Quota)
                </h2>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                         <tr>
                            <th className="px-4 py-3 rounded-l-lg">产线名称</th>
                            <th className="px-4 py-3">GPU 配置</th>
                            <th className="px-4 py-3">优先级</th>
                            <th className="px-4 py-3">实时负载</th>
                            <th className="px-4 py-3 text-right rounded-r-lg">任务队列</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-sm">
                         {QUOTAS.map(q => (
                            <tr key={q.pipeline} className="hover:bg-slate-50">
                               <td className="px-4 py-4 font-bold text-slate-700">{q.pipeline}</td>
                               <td className="px-4 py-4 font-mono text-slate-600 bg-slate-50 rounded m-1 inline-block text-xs">{q.gpu}</td>
                               <td className="px-4 py-4">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                     q.priority === 'Critical' ? 'bg-rose-100 text-rose-700' :
                                     q.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                                     q.priority === 'Medium' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'
                                  }`}>
                                     {q.priority}
                                  </span>
                               </td>
                               <td className="px-4 py-4">
                                  <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                                     <div className={`h-full rounded-full ${q.usage > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{width: `${q.usage}%`}}></div>
                                  </div>
                                  <span className="text-[10px] text-slate-400 mt-1 block">{q.usage}% Usage</span>
                               </td>
                               <td className="px-4 py-4 text-right font-mono text-slate-700">{q.queue}</td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>

             {/* Right: Model Ops */}
             <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6 text-slate-300">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center">
                   <Server size={20} className="mr-2 text-blue-400" />
                   推理节点监控 (Model Serving)
                </h2>
                <div className="space-y-4">
                   {NODES.map(node => (
                      <div key={node.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-mono font-bold text-blue-300">{node.id}</span>
                            {node.status === 'Warning' ? (
                               <span className="text-[10px] bg-rose-900/50 text-rose-400 px-1.5 py-0.5 rounded border border-rose-800 flex items-center">
                                  <AlertTriangle size={10} className="mr-1"/> Warning
                               </span>
                            ) : (
                               <span className="text-[10px] bg-emerald-900/50 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800">Healthy</span>
                            )}
                         </div>
                         <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center p-2 bg-slate-900 rounded">
                               <div className="text-slate-500 mb-1">Temp</div>
                               <div className={`font-bold ${node.temp > 80 ? 'text-rose-400' : 'text-slate-300'}`}>{node.temp}°C</div>
                            </div>
                            <div className="text-center p-2 bg-slate-900 rounded">
                               <div className="text-slate-500 mb-1">VRAM</div>
                               <div className={`font-bold ${node.vram > 90 ? 'text-rose-400' : 'text-slate-300'}`}>{node.vram}%</div>
                            </div>
                            <div className="text-center p-2 bg-slate-900 rounded">
                               <div className="text-slate-500 mb-1">Tasks</div>
                               <div className="font-bold text-slate-300">{node.tasks}</div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-700">
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Auto-Scaling Policy</span>
                      <span className="text-blue-400 font-bold cursor-pointer hover:underline">Edit</span>
                   </div>
                   <p className="text-[10px] text-slate-500 mt-1 bg-slate-800 p-2 rounded">
                      IF Queue > 5000 THEN Scale Up +2 Nodes (Max 10)
                   </p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default SystemCompute;
