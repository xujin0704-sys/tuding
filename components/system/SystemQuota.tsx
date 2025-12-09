
import React from 'react';
import { Zap, TrendingUp, AlertCircle, Settings2, Lock } from 'lucide-react';

const QUOTAS = [
  { pipeline: '紧急热修通道 (Hotfix)', gpu: 'A100 * 2', priority: 'Critical', usage: 5, queue: 0, limit: 100, reserved: true },
  { pipeline: '路网生产产线 (Road)', gpu: 'A100 * 4', priority: 'High', usage: 88, queue: 142, limit: 400, reserved: false },
  { pipeline: 'POI 智能处理 (POI)', gpu: 'T4 * 8', priority: 'Medium', usage: 92, queue: 4500, limit: 800, reserved: false },
  { pipeline: '行政区划更新 (Admin)', gpu: 'V100 * 2', priority: 'Low', usage: 15, queue: 0, limit: 200, reserved: false },
];

const SystemQuota: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50 animate-in fade-in">
       <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
             <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                   <Zap className="mr-3 text-yellow-500" />
                   算力配额管理 (Resource Quota)
                </h1>
                <p className="text-slate-500 mt-1">配置产线优先级与 GPU 资源池隔离策略，防止单一任务挤占资源。</p>
             </div>
             <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 shadow-sm text-sm font-medium transition-colors">
                <Settings2 size={16} className="mr-2" /> 全局策略配置
             </button>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">配额分配表</h3>
                <div className="flex items-center space-x-4 text-xs">
                    <span className="flex items-center"><div className="w-2 h-2 bg-rose-500 rounded-full mr-2"></div> Critical (Preempt)</span>
                    <span className="flex items-center"><div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div> High</span>
                    <span className="flex items-center"><div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div> Normal</span>
                </div>
             </div>
             <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                   <tr>
                      <th className="px-6 py-4">产线名称</th>
                      <th className="px-6 py-4">GPU 资源池</th>
                      <th className="px-6 py-4">调度优先级</th>
                      <th className="px-6 py-4 w-1/4">实时负载 (Real-time Load)</th>
                      <th className="px-6 py-4 text-right">积压队列</th>
                      <th className="px-6 py-4 text-right">操作</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                   {QUOTAS.map(q => (
                      <tr key={q.pipeline} className={`hover:bg-slate-50 transition-colors ${q.reserved ? 'bg-yellow-50/30' : ''}`}>
                         <td className="px-6 py-4">
                            <div className="font-bold text-slate-700 flex items-center">
                               {q.pipeline}
                               {q.reserved && <span title="资源预留" className="ml-2"><Lock size={12} className="text-yellow-600" /></span>}
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200 font-mono text-xs text-slate-700 font-bold">
                               {q.gpu}
                            </span>
                         </td>
                         <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                               q.priority === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                               q.priority === 'High' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                               q.priority === 'Medium' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}>
                               {q.priority}
                            </span>
                            {q.priority === 'Critical' && <span className="ml-2 text-[10px] text-rose-600 font-medium">抢占模式</span>}
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center justify-between text-xs mb-1">
                               <span className="text-slate-500">{q.usage}%</span>
                               {q.usage > 90 && <AlertCircle size={12} className="text-rose-500"/>}
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                               <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                     q.usage > 90 ? 'bg-rose-500' : 
                                     q.usage > 70 ? 'bg-orange-500' : 'bg-emerald-500'
                                  }`} 
                                  style={{width: `${q.usage}%`}}
                               ></div>
                            </div>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="font-mono text-slate-700 font-bold">{q.queue.toLocaleString()}</div>
                            {q.queue > 1000 && <div className="text-[10px] text-rose-500 flex items-center justify-end"><TrendingUp size={10} className="mr-1"/> Surging</div>}
                         </td>
                         <td className="px-6 py-4 text-right">
                            <button className="text-blue-600 hover:text-blue-800 text-xs font-bold hover:underline">
                               调整配额
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>

          {/* Policy Tips */}
          <div className="grid grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-bold text-blue-800 mb-2">抢占式调度 (Preemption)</h4>
                  <p className="text-xs text-blue-600 leading-relaxed">
                      "紧急热修通道" 拥有最高优先级。当其有任务进入队列时，系统将自动暂停低优先级产线（如行政区划）的任务，释放 GPU 资源。
                  </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <h4 className="text-sm font-bold text-orange-800 mb-2">资源隔离 (Isolation)</h4>
                  <p className="text-xs text-orange-700 leading-relaxed">
                      "路网产线" 独占 4 张 A100，确保在处理高分辨率卫星影像时显存不被其他小任务挤占，保障 SLA。
                  </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <h4 className="text-sm font-bold text-purple-800 mb-2">弹性伸缩 (Auto-Scale)</h4>
                  <p className="text-xs text-purple-700 leading-relaxed">
                      对于 "POI 产线"，启用 T4 实例组的弹性伸缩。当队列积压超过阈值时，自动申请 Spot 实例进行加速。
                  </p>
              </div>
          </div>
       </div>
    </div>
  );
};

export default SystemQuota;
