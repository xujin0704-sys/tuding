
import React, { useState } from 'react';
import { BookOpen, RotateCcw, ListTree, Plus, Edit3, Trash2, Tag, Database, ArrowRight, X, Key, Type } from 'lucide-react';

const INITIAL_MAPPINGS = [
   { id: 'm1', type: 'Road Level', code: 'ROAD_L1', map: 'Urban_Expressway (4201)', status: 'Active' },
   { id: 'm2', type: 'Road Level', code: 'ROAD_L2', map: 'Arterial_Road (4202)', status: 'Active' },
   { id: 'm3', type: 'POI Type', code: 'POI_DINING', map: 'Catering_Service (1100)', status: 'Active' },
   { id: 'm4', type: 'Admin Level', code: 'ADM_DIST', map: 'District (3)', status: 'Active' },
   { id: 'm5', type: 'Hydro Type', code: 'HYDRO_RIVER', map: 'River_System (6100)', status: 'Inactive' },
];

const INITIAL_ENUMS = [
   { 
      id: 'e1',
      name: '道路等级 (RoadClass)', 
      key: 'ROAD_CLASS',
      values: ['高速', '国道', '省道', '主干道', '次干道', '支路', '乡村道路']
   },
   { 
      id: 'e2',
      name: 'POI 状态 (POIStatus)', 
      key: 'POI_STATUS',
      values: ['营业中', '暂停营业', '筹建中', '关闭', '搬迁']
   },
   {
      id: 'e3',
      name: '案件优先级 (CasePriority)',
      key: 'CASE_PRIORITY',
      values: ['P0 (Critical)', 'P1 (High)', 'P2 (Normal)', 'P3 (Low)']
   }
];

const SystemDictionary: React.FC = () => {
  const [mappings, setMappings] = useState(INITIAL_MAPPINGS);
  const [enums, setEnums] = useState(INITIAL_ENUMS);
  
  // Mapping Modal State
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [newMap, setNewMap] = useState({ type: '', code: '', map: '' });

  // Enum Modal State
  const [isEnumModalOpen, setIsEnumModalOpen] = useState(false);
  const [newEnum, setNewEnum] = useState({ name: '', key: '' });

  // Enum Value Modal State
  const [isValModalOpen, setIsValModalOpen] = useState(false);
  const [activeEnumId, setActiveEnumId] = useState<string | null>(null);
  const [newVal, setNewVal] = useState('');

  const handleAddMapping = () => {
      if (!newMap.type || !newMap.code) return;
      const m = { ...newMap, id: `m-${Date.now()}`, status: 'Active' };
      setMappings([...mappings, m]);
      setIsMapModalOpen(false);
      setNewMap({ type: '', code: '', map: '' });
  };

  const handleAddEnumGroup = () => {
      if (!newEnum.name || !newEnum.key) return;
      setEnums([...enums, { id: `e-${Date.now()}`, name: newEnum.name, key: newEnum.key, values: [] }]);
      setIsEnumModalOpen(false);
      setNewEnum({ name: '', key: '' });
  };

  const handleAddEnumValue = () => {
      if (!newVal || !activeEnumId) return;
      setEnums(prev => prev.map(e => e.id === activeEnumId ? { ...e, values: [...e.values, newVal] } : e));
      setIsValModalOpen(false);
      setNewVal('');
      setActiveEnumId(null);
  };

  const openValModal = (id: string) => {
      setActiveEnumId(id);
      setIsValModalOpen(true);
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50 animate-in fade-in relative">
       <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
             <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                   <BookOpen className="mr-3 text-purple-600" />
                   字典与标准 (Dictionary & Standards)
                </h1>
                <p className="text-slate-500 mt-1">管理国标映射、枚举值与数据字典。</p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             
             {/* Left: Standard Mapping */}
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                   <div>
                      <h3 className="text-lg font-bold text-slate-800 flex items-center">
                         <Database size={20} className="mr-2 text-blue-500" />
                         标准映射表
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Internal to National Std (GB/T 13923)</p>
                   </div>
                   <button className="text-xs text-slate-500 hover:text-blue-600 font-medium flex items-center bg-white px-2 py-1 rounded border border-slate-200 transition-colors shadow-sm">
                      <RotateCcw size={12} className="mr-1" /> 重置默认
                   </button>
                </div>
                
                <div className="flex-1 overflow-hidden">
                   <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 font-bold text-slate-500 border-b border-slate-200 text-xs uppercase">
                         <tr>
                            <th className="px-6 py-3">分类域 (DOMAIN)</th>
                            <th className="px-6 py-3">映射关系</th>
                            <th className="px-6 py-3 text-right">状态</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {mappings.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50 group transition-colors">
                               <td className="px-6 py-3">
                                  <div className="font-bold text-slate-700">{row.type}</div>
                                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{row.code}</div>
                               </td>
                               <td className="px-6 py-3">
                                  <div className="flex items-center text-xs">
                                     <span className="text-slate-500 mr-2">Map to</span>
                                     <ArrowRight size={12} className="text-slate-300 mr-2"/>
                                     <span className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                        {row.map}
                                     </span>
                                  </div>
                               </td>
                               <td className="px-6 py-3 text-right">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                     row.status === 'Active' 
                                     ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                     : 'bg-slate-100 text-slate-500 border-slate-200'
                                  }`}>
                                     {row.status}
                                  </span>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                   <button 
                     onClick={() => setIsMapModalOpen(true)}
                     className="w-full py-2 border border-dashed border-slate-300 text-slate-500 rounded-lg text-xs font-medium hover:border-blue-400 hover:text-blue-600 hover:bg-white transition-all flex items-center justify-center"
                   >
                      <Plus size={14} className="mr-1" /> 添加映射规则
                   </button>
                </div>
             </div>

             {/* Right: Enumerations */}
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                   <div>
                      <h3 className="text-lg font-bold text-slate-800 flex items-center">
                         <ListTree size={20} className="mr-2 text-indigo-500" />
                         枚举值管理
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">下拉选项与数据字典 (Enumerations)</p>
                   </div>
                   <button 
                     onClick={() => setIsEnumModalOpen(true)}
                     className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-colors"
                   >
                      <Plus size={18} />
                   </button>
                </div>
                
                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                   {enums.map((enumItem) => (
                      <div key={enumItem.id} className="border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all group bg-white">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                               <div className="font-bold text-slate-800 text-sm">{enumItem.name}</div>
                               <div className="text-[10px] text-slate-400 font-mono mt-0.5">{enumItem.key}</div>
                            </div>
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit3 size={14}/></button>
                               <button 
                                 onClick={() => { if(confirm('Confirm delete?')) setEnums(prev => prev.filter(e => e.id !== enumItem.id)); }}
                                 className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                               >
                                   <Trash2 size={14}/>
                               </button>
                            </div>
                         </div>
                         <div className="flex flex-wrap gap-2">
                            {enumItem.values.map((val, vIdx) => (
                               <span key={vIdx} className="px-2.5 py-1 bg-slate-50 text-slate-600 text-xs rounded-md border border-slate-100 flex items-center group/tag hover:border-indigo-200 hover:text-indigo-700 transition-colors cursor-default">
                                  <Tag size={10} className="mr-1.5 text-slate-300 group-hover/tag:text-indigo-400" />
                                  {val}
                               </span>
                            ))}
                            <button 
                                onClick={() => openValModal(enumItem.id)}
                                className="px-3 py-1 bg-white border border-dashed border-slate-300 text-slate-400 text-xs rounded-md hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center"
                            >
                               <Plus size={12} className="mr-1"/> Add
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

          </div>
       </div>

       {/* Add Mapping Modal */}
       {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-[400px] overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">添加映射规则</h3>
                    <button onClick={() => setIsMapModalOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">分类域 (Domain)</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none" 
                            placeholder="e.g. Road Level"
                            value={newMap.type}
                            onChange={e => setNewMap({...newMap, type: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">内部编码 (Code)</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none font-mono" 
                            placeholder="e.g. ROAD_L3"
                            value={newMap.code}
                            onChange={e => setNewMap({...newMap, code: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">国标映射 (Standard)</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none" 
                            placeholder="e.g. Secondary_Road (4203)"
                            value={newMap.map}
                            onChange={e => setNewMap({...newMap, map: e.target.value})}
                        />
                    </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
                    <button onClick={() => setIsMapModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-100">取消</button>
                    <button onClick={handleAddMapping} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 shadow-sm">添加</button>
                </div>
            </div>
        </div>
      )}

      {/* Add Enum Group Modal */}
      {isEnumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-[400px] overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">新建枚举字典</h3>
                    <button onClick={() => setIsEnumModalOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">字典名称 (Display Name)</label>
                        <div className="relative">
                            <Type size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none" 
                                placeholder="例如: 建筑结构类型"
                                value={newEnum.name}
                                onChange={e => setNewEnum({...newEnum, name: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">系统键名 (System Key)</label>
                        <div className="relative">
                            <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none font-mono" 
                                placeholder="e.g. BUILDING_STRUCTURE"
                                value={newEnum.key}
                                onChange={e => setNewEnum({...newEnum, key: e.target.value.toUpperCase()})}
                            />
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
                    <button onClick={() => setIsEnumModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-100">取消</button>
                    <button onClick={handleAddEnumGroup} className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 shadow-sm">创建字典</button>
                </div>
            </div>
        </div>
      )}

      {/* Add Enum Value Modal */}
      {isValModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-[350px] overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">添加选项值</h3>
                    <button onClick={() => setIsValModalOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                </div>
                <div className="p-6">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">新选项 (Value)</label>
                    <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-indigo-500 outline-none" 
                        placeholder="输入值..."
                        value={newVal}
                        onChange={e => setNewVal(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddEnumValue()}
                        autoFocus
                    />
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
                    <button onClick={() => setIsValModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-100">取消</button>
                    <button onClick={handleAddEnumValue} className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 shadow-sm">确定添加</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SystemDictionary;
