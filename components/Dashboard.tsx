
import React from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell
} from 'recharts';
import { 
  Activity, 
  Zap, 
  Cpu, 
  Heart, 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  AlertTriangle, 
  Database, 
  Filter, 
  Layers, 
  Bot, 
  User, 
  FileText,
  Workflow,
  CheckCircle2,
  MoreHorizontal
} from 'lucide-react';

// --- Mock Data ---

const METRICS = [
  { 
    id: 'throughput', 
    label: '实时产能 (Throughput)', 
    value: '12,450', 
    unit: 'EPS', 
    trend: '+15%', 
    trendDir: 'up', 
    icon: Zap,
    color: 'blue'
  },
  { 
    id: 'ai_pen', 
    label: 'AI 自动化渗透率', 
    value: '88.4', 
    unit: '%', 
    trend: 'Direct 65%', 
    trendDir: 'neutral', 
    icon: Cpu,
    color: 'purple'
  },
  { 
    id: 'health', 
    label: '交付质量健康度', 
    value: '99.8', 
    unit: '%', 
    trend: 'Healthy', 
    trendDir: 'up', 
    icon: Heart,
    color: 'emerald'
  },
  { 
    id: 'cost', 
    label: '算力成本效能', 
    value: '$0.02', 
    unit: '/Feature', 
    trend: '-5%', 
    trendDir: 'down_good', 
    icon: Coins,
    color: 'orange'
  },
];

const MATRIX_DATA = [
  {
    version: 'v2.4',
    name: 'Q4 全量更新',
    progress: 78,
    stages: [
      { id: 'ingest', name: '接入', status: 'normal', speed: '50MB/s', queue: 120 },
      { id: 'ai', name: 'AI处理', status: 'normal', speed: '2400 EPS', queue: 450 },
      { id: 'review', name: '人工审核', status: 'warning', speed: '120 EPS', queue: 5200 },
      { id: 'qa', name: 'QA评测', status: 'normal', speed: '800 EPS', queue: 20 },
      { id: 'ready', name: '就绪', status: 'success', count: '1.2M' }
    ]
  },
  {
    version: 'v2.4.1',
    name: '紧急热修 (Hotfix)',
    progress: 92,
    stages: [
      { id: 'ingest', name: '接入', status: 'idle', speed: '-', queue: 0 },
      { id: 'ai', name: 'AI处理', status: 'normal', speed: '600 EPS', queue: 0 },
      { id: 'review', name: '人工审核', status: 'normal', speed: '80 EPS', queue: 12 },
      { id: 'qa', name: 'QA评测', status: 'error', speed: '0 EPS', queue: 5 },
      { id: 'ready', name: '就绪', status: 'success', count: '450' }
    ]
  }
];

const RADAR_DATA = [
  { subject: '几何质量', A: 98, fullMark: 100 },
  { subject: '属性完整', A: 92, fullMark: 100 },
  { subject: '算路成功', A: 86, fullMark: 100 },
  { subject: '检索召回', A: 95, fullMark: 100 },
  { subject: '覆盖率', A: 99, fullMark: 100 },
];

const TRIAGE_FUNNEL = [
  { name: 'Total', value: 100, fill: '#94a3b8' },
  { name: 'Valid', value: 80, fill: '#60a5fa' },
  { name: 'Routed', value: 75, fill: '#3b82f6' },
];

const FEED_DATA = [
  { id: 1, time: '10:02', actor: 'AI Triage', type: 'ai', message: '自动识别《海淀区公告》含“道路施工”，已分发至路网产线。' },
  { id: 2, time: '09:55', actor: 'Model Ops', type: 'system', message: '模型 Road_Ext_v2 性能下降，自动切换回 v1.9 (Fallback)。' },
  { id: 3, time: '09:40', actor: 'User_A', type: 'human', message: '驳回了 50 条 AI 生成的水系数据 (Reason: 边界溢出)。' },
  { id: 4, time: '09:32', actor: 'System', type: 'system', message: 'v2.4 版本构建完成，开始自动化回归测试。' },
  { id: 5, time: '09:15', actor: 'AI Quality', type: 'ai', message: '检测到朝阳区 POI 数据密度异常降低 (-15%)。' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="flex-1 p-6 bg-slate-50 overflow-y-auto h-full font-sans">
      
      {/* Header */}
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Activity className="mr-3 text-blue-600" />
            数字化工厂中央指挥室
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-mono">DIGITAL FACTORY CENTRAL COMMAND</p>
        </div>
        <div className="flex items-center space-x-3">
           <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-bold text-slate-700">LIVE</span>
            <span className="text-xs text-slate-400 border-l pl-3 ml-2">{new Date().toLocaleString()}</span>
        </div>
      </header>

      {/* 1. North Star Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {METRICS.map(m => (
          <div key={m.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
             {/* Background Decoration */}
             <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-5 bg-${m.color}-500 group-hover:scale-125 transition-transform duration-500`}></div>
             
             <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{m.label}</div>
                <div className={`p-1.5 rounded-lg bg-${m.color}-50 text-${m.color}-600`}>
                   <m.icon size={18} />
                </div>
             </div>
             
             <div className="relative z-10">
                <div className="flex items-baseline space-x-1">
                   <span className="text-2xl font-bold text-slate-900">{m.value}</span>
                   <span className="text-xs font-medium text-slate-500">{m.unit}</span>
                </div>
                
                <div className="flex items-center mt-2">
                   {m.trendDir === 'up' && <TrendingUp size={12} className="text-emerald-500 mr-1" />}
                   {m.trendDir === 'down_good' && <TrendingDown size={12} className="text-emerald-500 mr-1" />}
                   {m.trendDir === 'down_bad' && <TrendingDown size={12} className="text-rose-500 mr-1" />}
                   <span className={`text-xs font-bold ${
                      m.trendDir === 'neutral' ? 'text-slate-500' : 
                      (m.trendDir === 'up' || m.trendDir === 'down_good') ? 'text-emerald-600' : 'text-rose-600'
                   }`}>
                      {m.trend}
                   </span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* 2. Pipeline Flow Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
         <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center">
               <Workflow size={18} className="mr-2 text-blue-600" />
               全版本产线流转矩阵 (Pipeline Flow Matrix)
            </h3>
            <div className="flex items-center space-x-4 text-xs text-slate-500">
               <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>Normal</span>
               <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>Backlog</span>
               <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5"></span>Critical</span>
            </div>
         </div>
         
         <div className="p-6 overflow-x-auto">
            <table className="w-full">
               <thead>
                  <tr>
                     <th className="text-left text-xs font-bold text-slate-400 uppercase pb-4 w-40">Active Version</th>
                     {MATRIX_DATA[0].stages.map(s => (
                        <th key={s.id} className="text-left text-xs font-bold text-slate-400 uppercase pb-4 px-2">
                           {s.name}
                        </th>
                     ))}
                     <th className="text-right text-xs font-bold text-slate-400 uppercase pb-4 w-40">总体进度 (Progress)</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {MATRIX_DATA.map((row) => (
                     <tr key={row.version} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 pr-6 align-middle">
                           <div className="font-bold text-slate-800 text-sm">{row.version}</div>
                           <div className="text-xs text-slate-500">{row.name}</div>
                        </td>
                        {row.stages.map((stage, idx) => {
                           const isCriticalBacklog = stage.id === 'review' && (stage.queue || 0) > 5000;
                           
                           return (
                           <td key={stage.id} className="py-4 px-2 align-middle relative">
                              {/* Connection Line */}
                              {idx < row.stages.length - 1 && (
                                 <div className="absolute top-1/2 right-0 w-full h-px bg-slate-100 -z-10 translate-y-[-50%]">
                                    <div className="absolute right-0 -top-[3px] text-slate-200">
                                       <ArrowRight size={10} />
                                    </div>
                                 </div>
                              )}
                              
                              <div className={`p-3 rounded-lg border transition-all duration-300 relative ${
                                 isCriticalBacklog ? 'bg-rose-50 border-rose-200 shadow-sm' :
                                 stage.status === 'warning' ? 'bg-amber-50 border-amber-200 shadow-sm' :
                                 stage.status === 'error' ? 'bg-rose-50 border-rose-200 shadow-sm' :
                                 stage.status === 'idle' ? 'bg-slate-50 border-slate-100 opacity-60' :
                                 'bg-white border-slate-200 shadow-sm group-hover:border-blue-200'
                              }`}>
                                 {/* Status Dot */}
                                 <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                                    isCriticalBacklog ? 'bg-rose-500' :
                                    stage.status === 'warning' ? 'bg-amber-500' :
                                    stage.status === 'error' ? 'bg-rose-500' :
                                    stage.status === 'idle' ? 'bg-slate-300' : 'bg-emerald-500'
                                 }`}></div>

                                 <div className="flex justify-between items-center mb-1">
                                    <span className={`text-[10px] font-bold uppercase ${isCriticalBacklog ? 'text-rose-700' : 'text-slate-500'}`}>{stage.id}</span>
                                    {stage.status !== 'idle' && <Activity size={10} className={`${isCriticalBacklog ? 'text-rose-400' : 'text-slate-400'}`} />}
                                 </div>
                                 
                                 {stage.id === 'ready' ? (
                                    <div className="font-bold text-emerald-600 text-sm">{stage.count}</div>
                                 ) : (
                                    <>
                                       <div className="text-xs font-mono font-bold text-slate-700 mb-0.5">
                                          {stage.speed}
                                       </div>
                                       {stage.queue !== undefined && stage.queue > 0 && (
                                          <div className={`text-[10px] flex items-center ${
                                             isCriticalBacklog ? 'text-rose-700 font-bold' :
                                             stage.status === 'warning' ? 'text-amber-700 font-bold' : 'text-slate-400'
                                          }`}>
                                             {(stage.status === 'warning' || isCriticalBacklog) && <AlertTriangle size={8} className="mr-1"/>}
                                             Queue: {stage.queue.toLocaleString()}
                                             {isCriticalBacklog && <span className="ml-1 text-[9px] opacity-80 font-normal">(ETA +4h)</span>}
                                          </div>
                                       )}
                                    </>
                                 )}
                              </div>
                           </td>
                        )})}
                        <td className="py-4 pl-6 align-middle text-right">
                           <div className="flex flex-col items-end">
                              <div className="flex items-center space-x-2 mb-1.5">
                                 <span className="text-sm font-bold text-slate-800">{row.progress}%</span>
                                 <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Complete</span>
                              </div>
                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                 <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]" 
                                    style={{width: `${row.progress}%`}}
                                 ></div>
                              </div>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* 3. Command Zones Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto">
         
         {/* Zone A: Supply Chain */}
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-slate-800 text-sm flex items-center">
                  <Database size={16} className="mr-2 text-indigo-600" />
                  供应链监控 (Supply Chain)
               </h3>
               <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">Today</span>
            </div>
            <div className="p-5 flex-1 flex flex-col">
               <div className="flex justify-between items-center mb-6">
                  <div className="text-center px-4 border-r border-slate-100 last:border-0 flex-1">
                     <div className="text-[10px] text-slate-400 uppercase font-bold">Image Ingest</div>
                     <div className="text-lg font-bold text-slate-800">5.2 TB</div>
                  </div>
                  <div className="text-center px-4 flex-1">
                     <div className="text-[10px] text-slate-400 uppercase font-bold">Doc Ingest</div>
                     <div className="text-lg font-bold text-slate-800">210 Files</div>
                  </div>
               </div>

               <div className="flex-1 flex flex-col justify-center">
                  <div className="text-xs font-bold text-slate-500 mb-2">智能分诊漏斗 (Triage Funnel)</div>
                  <div className="h-32 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={TRIAGE_FUNNEL} barSize={20}>
                           <XAxis type="number" hide />
                           <YAxis dataKey="name" type="category" width={50} tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                           <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                           <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                              {TRIAGE_FUNNEL.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                           </Bar>
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start space-x-2">
                  <Filter size={14} className="text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-600 leading-tight">
                     <span className="font-bold">Insight:</span> 20% 的影像因"云量过高"被自动过滤。建议检查 S3_Source_B 数据源质量。
                  </p>
               </div>
            </div>
         </div>

         {/* Zone B: QA Radar */}
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-slate-800 text-sm flex items-center">
                  <Layers size={16} className="mr-2 text-purple-600" />
                  评测与服务雷达 (QA Radar)
               </h3>
               <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold">v2.4-RC1</span>
            </div>
            <div className="p-2 flex-1 flex flex-col items-center justify-center relative">
               <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fill: '#64748b'}} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="v2.4-RC1" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                        <Tooltip />
                     </RadarChart>
                  </ResponsiveContainer>
               </div>
               <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="text-xs text-slate-500">
                     <div className="font-bold mb-1">最新仿真结果:</div>
                     <div className="flex items-center text-amber-600">
                        <AlertTriangle size={12} className="mr-1"/>
                        检测到 3 个严重回归 (Regression)
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="text-2xl font-bold text-slate-900">92.4</span>
                     <span className="text-xs text-slate-400 block">综合评分</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Zone C: Intelligence Feed */}
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-slate-800 text-sm flex items-center">
                  <Bot size={16} className="mr-2 text-emerald-600" />
                  动态情报流 (Live Intelligence)
               </h3>
               <button className="text-slate-400 hover:text-slate-600">
                  <MoreHorizontal size={16} />
               </button>
            </div>
            <div className="flex-1 overflow-y-auto p-0">
               <div className="divide-y divide-slate-50">
                  {FEED_DATA.map((feed) => (
                     <div key={feed.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                           feed.type === 'ai' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                           feed.type === 'human' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                           'bg-slate-100 border-slate-200 text-slate-500'
                        }`}>
                           {feed.type === 'ai' ? <Bot size={14} /> : 
                            feed.type === 'human' ? <User size={14} /> : 
                            <Activity size={14} />}
                        </div>
                        <div>
                           <div className="flex items-center mb-1">
                              <span className="text-xs font-bold text-slate-700 mr-2">{feed.actor}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{feed.time}</span>
                           </div>
                           <p className="text-xs text-slate-600 leading-snug">
                              {feed.message}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            <div className="p-3 border-t border-slate-100 bg-slate-50">
               <div className="relative">
                  <input 
                     type="text" 
                     placeholder="输入指令或查询 (Copilot)..." 
                     className="w-full pl-3 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 shadow-sm"
                  />
                  <ArrowRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-blue-500" />
               </div>
            </div>
         </div>

      </div>
    </div>
  );
};

export default Dashboard;
