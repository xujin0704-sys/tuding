
import React from 'react';
import { 
  Activity, 
  TrendingUp, 
  Loader2, 
  AlertTriangle,
  FileCode,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  EVAL_HISTORY_TREND, 
  QA_ISSUES 
} from '../../constants';

const EvalDashboard: React.FC = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-300 h-full overflow-y-auto">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">候选版本健康度</span>
                    <Activity size={18} className="text-blue-500" />
                </div>
                <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-slate-900">88</span>
                    <span className="text-sm text-slate-400 ml-1">/ 100</span>
                </div>
                <div className="mt-2 text-xs text-rose-600 flex items-center font-medium bg-rose-50 px-2 py-1 rounded w-fit">
                    <TrendingUp size={12} className="mr-1 rotate-180" />
                    较上版本 -7% (Regression)
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">代码覆盖率</span>
                    <FileCode size={18} className="text-purple-500" />
                </div>
                <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-slate-900">78.4%</span>
                    <span className="text-sm text-slate-400 ml-1">Coverage</span>
                </div>
                <div className="mt-2 text-xs text-emerald-600 flex items-center font-medium bg-emerald-50 px-2 py-1 rounded w-fit">
                    <TrendingUp size={12} className="mr-1" />
                    +1.2% (Improved)
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">当前任务</span>
                    <Loader2 size={18} className="text-blue-500 animate-spin" />
                </div>
                <div className="text-sm font-bold text-slate-800 mb-1">Full Regression Suite</div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '68%'}}></div>
                </div>
                <div className="text-xs text-slate-500">Routing Simulation: 45% complete</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                        <AlertTriangle size={14} className="mr-1.5 text-rose-500" />
                        阻断发布问题
                    </span>
                    <button className="text-xs text-blue-600 hover:underline">Top 2</button>
                </div>
                <div className="space-y-2">
                    {QA_ISSUES.filter(i => i.severity === 'Critical' || i.severity === 'High').slice(0, 2).map(issue => (
                        <div key={issue.id} className="flex flex-col p-2 bg-rose-50/50 rounded border border-rose-100">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold text-rose-700">[{issue.type}]</span>
                                <span className="text-[10px] text-slate-400 font-mono">{issue.id}</span>
                            </div>
                            <span className="text-xs text-slate-700 truncate" title={issue.desc}>{issue.desc}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-6">版本质量评分趋势</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={EVAL_HISTORY_TREND}>
                            <defs>
                                <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="version" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis domain={[60, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                            <Area type="monotone" dataKey="quality" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorQuality)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-6">回归率 (Regression Rate) 监控</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={EVAL_HISTORY_TREND}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="version" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                            <Bar dataKey="regression" radius={[4, 4, 0, 0]}>
                                {EVAL_HISTORY_TREND.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.regression > 5 ? '#f43f5e' : '#10b981'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Multi-dimensional Trend Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-800 flex items-center">
                    <Layers size={16} className="mr-2 text-indigo-500" />
                    多维质量趋势 (Multi-dimensional Quality Trend)
                </h3>
                <div className="flex space-x-4 text-xs text-slate-500">
                    <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span> Accuracy</div>
                    <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-purple-500 mr-1"></span> Performance</div>
                </div>
            </div>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={EVAL_HISTORY_TREND}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="version" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis domain={[60, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                        <Legend iconType="circle" />
                        <Line type="monotone" dataKey="accuracy" name="Accuracy (准确率)" stroke="#3b82f6" strokeWidth={2} dot={{r: 3}} activeDot={{r: 5}} />
                        <Line type="monotone" dataKey="performance" name="Performance (性能分)" stroke="#8b5cf6" strokeWidth={2} dot={{r: 3}} activeDot={{r: 5}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};

export default EvalDashboard;
