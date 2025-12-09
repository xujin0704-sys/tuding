
import React from 'react';
import { Coins, TrendingUp, CreditCard, PieChart, Cpu, Users, BarChart3, Wallet } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const TREND_DATA = [
  { month: 'Jan', compute: 4500, human: 8200 },
  { month: 'Feb', compute: 5200, human: 7800 },
  { month: 'Mar', compute: 4800, human: 9000 },
  { month: 'Apr', compute: 6100, human: 8500 },
  { month: 'May', compute: 5500, human: 11000 },
  { month: 'Jun', compute: 7000, human: 9500 },
];

const PIPELINE_BILL = [
  { id: 'p1', name: '路网数据产线', computeCost: 5000, humanCost: 8000, output: 1200, unit: 'km', unitCost: 10.83 },
  { id: 'p2', name: 'POI 兴趣点产线', computeCost: 1200, humanCost: 2500, output: 8500, unit: '个', unitCost: 0.43 },
  { id: 'p3', name: '行政区划更新', computeCost: 300, humanCost: 1500, output: 45, unit: 'Polygon', unitCost: 40.00 },
  { id: 'p4', name: '地址标准化', computeCost: 800, humanCost: 400, output: 50000, unit: 'Rows', unitCost: 0.024 },
];

const SystemCostBill: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50 animate-in fade-in">
       <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
             <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                   <Coins className="mr-3 text-blue-600" />
                   成本账单 (Cost Dashboard)
                </h1>
                <p className="text-slate-500 mt-1">全链路成本可视化，精确核算单要素生产成本 (Unit Economics)。</p>
             </div>
             <div className="text-sm text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center">
                <Wallet size={14} className="mr-2 text-slate-400"/>
                账单周期: <span className="font-bold text-slate-900 ml-1">2025-06</span>
             </div>
          </div>

          {/* Top KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                   <p className="text-xs text-slate-500 uppercase font-bold">本月总支出</p>
                   <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><CreditCard size={16} /></div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">$16,500</h3>
                <div className="flex items-center text-xs text-rose-500 mt-2 font-medium">
                   <TrendingUp size={12} className="mr-1" /> +12% vs last month
                </div>
             </div>
             
             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                   <p className="text-xs text-slate-500 uppercase font-bold">POI 单要素成本</p>
                   <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><PieChart size={16} /></div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">$0.43</h3>
                <div className="text-xs text-emerald-600 mt-2 font-medium">Target: $0.40</div>
             </div>

             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                   <p className="text-xs text-slate-500 uppercase font-bold">算力占比</p>
                   <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><Cpu size={16} /></div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">30.5%</h3>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                   <div className="bg-indigo-500 h-full rounded-full" style={{width: '30.5%'}}></div>
                </div>
             </div>

             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                   <p className="text-xs text-slate-500 uppercase font-bold">人力占比</p>
                   <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg"><Users size={16} /></div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">69.5%</h3>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                   <div className="bg-orange-500 h-full rounded-full" style={{width: '69.5%'}}></div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Chart: Trend */}
             <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                   <BarChart3 size={20} className="mr-2 text-slate-400"/>
                   成本趋势 (Cost Trend)
                </h3>
                <div className="h-80">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={TREND_DATA} margin={{top: 20, right: 30, left: 0, bottom: 0}}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                         <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                         <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                         <Tooltip 
                            cursor={{fill: '#f8fafc'}} 
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} 
                         />
                         <Legend wrapperStyle={{paddingTop: '20px'}}/>
                         <Bar dataKey="compute" name="算力成本 (Compute)" stackId="a" fill="#6366f1" radius={[0, 0, 4, 4]} barSize={32} />
                         <Bar dataKey="human" name="人力成本 (Human)" stackId="a" fill="#f97316" radius={[4, 4, 0, 0]} barSize={32} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>

             {/* Chart: Pipeline Composition */}
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-6">产线成本分布</h3>
                <div className="flex-1 flex flex-col justify-center space-y-6">
                   {PIPELINE_BILL.map((p) => {
                      const total = p.computeCost + p.humanCost;
                      const percent = Math.round((total / 16500) * 100);
                      return (
                         <div key={p.id}>
                            <div className="flex justify-between items-center mb-1">
                               <span className="text-sm font-medium text-slate-700">{p.name}</span>
                               <span className="text-sm font-bold text-slate-900">${total.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 mb-1 overflow-hidden">
                               <div className="h-full bg-blue-500 rounded-full" style={{width: `${percent}%`}}></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-400">
                               <span>{percent}% of total</span>
                               <span className="font-mono">Unit: ${p.unitCost} / {p.unit}</span>
                            </div>
                         </div>
                      )
                   })}
                </div>
             </div>

          </div>

          {/* Detailed Breakdown Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">产线成本明细 (Pipeline Breakdown)</h3>
                <button className="text-xs text-blue-600 font-bold hover:underline">导出报表</button>
             </div>
             <table className="w-full text-left">
                <thead className="bg-white text-xs font-bold text-slate-500 uppercase border-b border-slate-100">
                   <tr>
                      <th className="px-6 py-4">产线名称</th>
                      <th className="px-6 py-4 text-right">算力消耗 (Compute)</th>
                      <th className="px-6 py-4 text-right">人力消耗 (Labor)</th>
                      <th className="px-6 py-4 text-right">总成本 (Total)</th>
                      <th className="px-6 py-4 text-right">产出量 (Output)</th>
                      <th className="px-6 py-4 text-right">单要素成本 (Unit Cost)</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                   {PIPELINE_BILL.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-6 py-4 font-bold text-slate-700">{p.name}</td>
                         <td className="px-6 py-4 text-right font-mono text-indigo-600">${p.computeCost.toLocaleString()}</td>
                         <td className="px-6 py-4 text-right font-mono text-orange-600">${p.humanCost.toLocaleString()}</td>
                         <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">${(p.computeCost + p.humanCost).toLocaleString()}</td>
                         <td className="px-6 py-4 text-right text-slate-600">
                            {p.output.toLocaleString()} <span className="text-xs text-slate-400 ml-1">{p.unit}</span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="inline-block bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-700 border border-slate-200">
                               ${p.unitCost} <span className="text-[10px] font-normal text-slate-500">/ {p.unit}</span>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t border-slate-200">
                   <tr>
                      <td className="px-6 py-4 font-bold text-slate-800">Total</td>
                      <td className="px-6 py-4 text-right font-bold text-indigo-700">$7,300</td>
                      <td className="px-6 py-4 text-right font-bold text-orange-700">$12,400</td>
                      <td className="px-6 py-4 text-right font-bold text-xl text-slate-900">$19,700</td>
                      <td colSpan={2}></td>
                   </tr>
                </tfoot>
             </table>
          </div>
       </div>
    </div>
  );
};

export default SystemCostBill;
