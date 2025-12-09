
import React from 'react';
import { Settings, Sliders, Database, Save, RotateCcw, BookOpen, ListTree } from 'lucide-react';

interface SystemSettingsProps {
  view: 'thresholds' | 'dictionary';
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ view }) => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50 animate-in fade-in">
       <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
             <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                   <Settings className="mr-3 text-blue-600" />
                   {view === 'thresholds' ? '阈值配置 (Thresholds)' : '字典与标准 (Dictionary & Standards)'}
                </h1>
                <p className="text-slate-500 mt-1">
                   {view === 'thresholds' 
                      ? '配置全局置信度与任务超时策略。' 
                      : '管理国标映射、枚举值与数据字典。'}
                </p>
             </div>
             <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm text-sm font-medium transition-colors">
                <Save size={16} className="mr-2" /> 保存配置
             </button>
          </div>

          {/* View: Thresholds */}
          {view === 'thresholds' && (
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                   <Sliders size={20} className="mr-2 text-indigo-500" />
                   自动化与任务控制
                </h3>
                <div className="space-y-8">
                   <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex justify-between mb-4">
                         <div>
                            <label className="text-sm font-bold text-slate-800">自动通过置信度 (Auto_Pass_Score)</label>
                            <p className="text-xs text-slate-500 mt-1">AI 评分高于此阈值的要素将直接入库，低于此分将转入人工审核队列。</p>
                         </div>
                         <span className="text-xl font-mono font-bold text-blue-600">0.95</span>
                      </div>
                      <input type="range" min="0.5" max="1.0" step="0.01" defaultValue={0.95} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                      <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                         <span>0.50 (Loose)</span>
                         <span>1.00 (Strict)</span>
                      </div>
                   </div>
                   
                   <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex justify-between mb-4">
                         <div>
                            <label className="text-sm font-bold text-slate-800">任务自动释放超时 (Task Timeout)</label>
                            <p className="text-xs text-slate-500 mt-1">作业员领取任务后未提交，超过此时长自动释放回公共任务池。</p>
                         </div>
                         <span className="text-xl font-mono font-bold text-blue-600">2.0 Hours</span>
                      </div>
                      <input type="range" min="0.5" max="24" step="0.5" defaultValue={2} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                      <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                         <span>0.5 H</span>
                         <span>24 H</span>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* View: Dictionary */}
          {view === 'dictionary' && (
             <div className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center">
                         <BookOpen size={20} className="mr-2 text-purple-500" />
                         标准映射表 (Standard Mapping)
                      </h3>
                      <button className="text-xs text-blue-600 font-bold hover:underline flex items-center">
                         <RotateCcw size={12} className="mr-1" /> 重置为国标默认
                      </button>
                   </div>
                   
                   <div className="overflow-hidden border border-slate-200 rounded-lg">
                      <table className="w-full text-left text-sm">
                         <thead className="bg-slate-50 font-bold text-slate-500 border-b border-slate-200">
                            <tr>
                               <th className="px-4 py-3">分类域 (Domain)</th>
                               <th className="px-4 py-3">平台内部编码</th>
                               <th className="px-4 py-3">国标映射 (GB/T 13923-2017)</th>
                               <th className="px-4 py-3 text-right">状态</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                            {[
                               { type: 'Road Level', code: 'ROAD_L1', map: 'Urban_Expressway (4201)', status: 'Active' },
                               { type: 'Road Level', code: 'ROAD_L2', map: 'Arterial_Road (4202)', status: 'Active' },
                               { type: 'POI Type', code: 'POI_DINING', map: 'Catering_Service (1100)', status: 'Active' },
                               { type: 'Admin Level', code: 'ADM_DIST', map: 'District (3)', status: 'Active' },
                            ].map((row, i) => (
                               <tr key={i} className="hover:bg-slate-50">
                                  <td className="px-4 py-3 font-medium text-slate-700">{row.type}</td>
                                  <td className="px-4 py-3 font-mono text-slate-600">{row.code}</td>
                                  <td className="px-4 py-3 text-slate-600">{row.map}</td>
                                  <td className="px-4 py-3 text-right">
                                     <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-bold border border-green-200">
                                        {row.status}
                                     </span>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                   <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                      <ListTree size={20} className="mr-2 text-indigo-500" />
                      枚举值管理 (Enumerations)
                   </h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer group">
                         <div className="font-bold text-slate-700 mb-2 group-hover:text-blue-600">道路等级 (RoadClass)</div>
                         <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">高速</span>
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">国道</span>
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">主干道</span>
                            <span className="px-2 py-1 bg-slate-50 text-slate-400 text-xs rounded border border-dashed border-slate-300">+ Add</span>
                         </div>
                      </div>
                      <div className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer group">
                         <div className="font-bold text-slate-700 mb-2 group-hover:text-blue-600">POI 状态 (POIStatus)</div>
                         <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">营业中</span>
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">暂停营业</span>
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">关闭</span>
                            <span className="px-2 py-1 bg-slate-50 text-slate-400 text-xs rounded border border-dashed border-slate-300">+ Add</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          )}
       </div>
    </div>
  );
};

export default SystemSettings;
