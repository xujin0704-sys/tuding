
import React from 'react';
import { 
  Coins, 
  TrendingUp, 
  CreditCard, 
  Users, 
  Cpu, 
  PieChart
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart as RePieChart, Pie, Cell, CartesianGrid } from 'recharts';

const COST_DATA = [
  { month: 'Jan', compute: 4500, human: 8200 },
  { month: 'Feb', compute: 5200, human: 7800 },
  { month: 'Mar', compute: 4800, human: 9000 },
  { month: 'Apr', compute: 6100, human: 8500 },
  { month: 'May', compute: 5500, human: 11000 },
  { month: 'Jun', compute: 7000, human: 9500 },
];

const UNIT_COSTS = [
  { item: 'A100 GPU Instance', price: '$4.25 / hr' },
  { item: 'T4 GPU Instance', price: '$0.85 / hr' },
  { item: 'Senior Annotator', price: '$35.00 / hr' },
  { item: 'Junior Annotator', price: '$15.00 / hr' },
  { item: 'Data Storage (S3)', price: '$0.023 / GB' },
];

const SystemCost: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50 animate-in fade-in">
       <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
             <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                   <Coins className="mr-3 text-blue-600" />
                   成本核算与 FinOps (Cost Management)
                </h1>
                <p className="text-slate-500 mt-1">可视化生产成本，核算单要素经济模型。</p>
             </div>
          </div>

          {/* Top KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-xs text-slate-500 uppercase font-bold mb-1">本月总支出</p>
                   <h3 className="text-3xl font-bold text-slate-900">$16,500</h3>
                   <div className="flex items-center text-xs text-rose-500 mt-2 font-medium">
                      <TrendingUp size={14} className="mr-1" /> +12% vs last month
                   </div>
                </div>
                <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                   <CreditCard size={24} />
                </div>
             </div>
             
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-xs text-slate-500 uppercase font-bold mb-1">单要素平均成本</p>
                   <h3 className="text-3xl font-bold text-slate-900">$0.45</h3>
                   <div className="text-xs text-slate-400 mt-2">Target: $0.40</div>
                </div>
                <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
                   <PieChart size={24} />
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-xs text-slate-500 uppercase font-bold mb-1">算力/人力比</p>
                   <h3 className="text-3xl font-bold text-slate-900">0.73</h3>
                   <div className="text-xs text-emerald-600 mt-2 font-medium">
                      Automation Increasing
                   </div>
                </div>
                <div className="p-4 bg-orange-50 text-orange-600 rounded-xl">
                   <Cpu size={24} />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Chart */}
             <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6">成本趋势 (Compute vs Human)</h3>
                <div className="h-72">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={COST_DATA} margin={{top: 20, right: 30, left: 0, bottom: 0}}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                         <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                         <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                         <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                         <Legend />
                         <Bar dataKey="compute" name="算力成本" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} barSize={32} />
                         <Bar dataKey="human" name="人力成本" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={32} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>

             {/* Billing Rules */}
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-bold text-slate-800">计费单价配置</h3>
                   <button className="text-xs text-blue-600 font-bold hover:underline">编辑</button>
                </div>
                <div className="space-y-4">
                   {UNIT_COSTS.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                         <span className="text-sm font-medium text-slate-700">{item.item}</span>
                         <span className="text-sm font-mono font-bold text-slate-900">{item.price}</span>
                      </div>
                   ))}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
                   Last updated by Admin on 2025-01-01
                </div>
             </div>

          </div>
       </div>
    </div>
  );
};

export default SystemCost;
