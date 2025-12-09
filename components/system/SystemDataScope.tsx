
import React from 'react';
import { Filter, Map as MapIcon, Layers, CheckCircle2, EyeOff, Search, Users } from 'lucide-react';

const USERS_SCOPE = [
  { id: 'u1', name: '王强', role: '作业员', grids: ['110108', '110105'], layers: ['Road', 'POI'], mask: ['Phone'] },
  { id: 'u2', name: '李娜', role: '质检专家', grids: ['*'], layers: ['All'], mask: [] },
  { id: 'u3', name: 'Vendor_A', role: '外包作业员', grids: ['110108'], layers: ['POI'], mask: ['Phone', 'Address'] },
  { id: 'u4', name: 'Vendor_B', role: '外包作业员', grids: ['110105'], layers: ['Road'], mask: ['Internal'] },
];

const SystemDataScope: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50 animate-in fade-in">
       <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-end mb-4">
             <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                   <Filter className="mr-3 text-blue-600" />
                   数据空间权限审计 (Data Scope Audit)
                </h1>
                <p className="text-slate-500 mt-1">全局查看所有用户的数据访问边界与脱敏策略。</p>
             </div>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="搜索用户..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
             </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-500 uppercase mb-1">网格隔离用户</div>
                  <div className="text-2xl font-bold text-slate-900">32</div>
                  <div className="text-xs text-slate-400 mt-1">Restricted to specific grids</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-500 uppercase mb-1">图层受限用户</div>
                  <div className="text-2xl font-bold text-slate-900">15</div>
                  <div className="text-xs text-slate-400 mt-1">Cannot view all layers</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-500 uppercase mb-1">脱敏策略生效</div>
                  <div className="text-2xl font-bold text-slate-900">48</div>
                  <div className="text-xs text-slate-400 mt-1">Users with field masking</div>
              </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                   <tr>
                      <th className="px-6 py-4">用户</th>
                      <th className="px-6 py-4">角色</th>
                      <th className="px-6 py-4">网格权限 (Grid Fence)</th>
                      <th className="px-6 py-4">图层权限 (Layer Access)</th>
                      <th className="px-6 py-4">字段脱敏 (Masking)</th>
                      <th className="px-6 py-4 text-right">操作</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                   {USERS_SCOPE.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                         <td className="px-6 py-4 font-bold text-slate-800 flex items-center">
                             <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] mr-2 text-slate-600">
                                 {user.name.charAt(0)}
                             </div>
                             {user.name}
                         </td>
                         <td className="px-6 py-4 text-slate-500">{user.role}</td>
                         <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                               {user.grids.includes('*') ? (
                                  <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold border border-green-100 flex items-center w-fit">
                                     <CheckCircle2 size={12} className="mr-1" /> Global
                                  </span>
                               ) : (
                                  user.grids.map(g => (
                                     <span key={g} className="px-2 py-1 bg-white text-slate-600 rounded text-xs border border-slate-200 flex items-center">
                                        <MapIcon size={12} className="mr-1 text-slate-400" /> {g}
                                     </span>
                                  ))
                               )}
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                               {user.layers.includes('All') ? (
                                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold border border-blue-100 flex items-center w-fit">
                                     <Layers size={12} className="mr-1" /> All Layers
                                  </span>
                               ) : (
                                  user.layers.map(l => (
                                     <span key={l} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium border border-slate-200">
                                        {l}
                                     </span>
                                  ))
                               )}
                            </div>
                         </td>
                         <td className="px-6 py-4">
                             {user.mask.length > 0 ? (
                                 <div className="flex flex-wrap gap-1">
                                     {user.mask.map(m => (
                                         <span key={m} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] flex items-center border border-gray-200">
                                             <EyeOff size={10} className="mr-1"/> {m}
                                         </span>
                                     ))}
                                 </div>
                             ) : (
                                 <span className="text-xs text-slate-400">-</span>
                             )}
                         </td>
                         <td className="px-6 py-4 text-right">
                            <button className="text-blue-600 hover:text-blue-800 text-xs font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">编辑配置</button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

export default SystemDataScope;
