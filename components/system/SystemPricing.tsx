
import React, { useState } from 'react';
import { Tag, Edit2, Cpu, Users, Plus, Save, DollarSign, X } from 'lucide-react';

const INITIAL_COMPUTE_PRICING = [
  { id: 'c1', name: 'NVIDIA A100 (80GB)', type: 'GPU', price: 4.25, unit: 'Hour' },
  { id: 'c2', name: 'NVIDIA T4 (16GB)', type: 'GPU', price: 0.85, unit: 'Hour' },
  { id: 'c3', name: 'High-Mem CPU (64 Core)', type: 'CPU', price: 1.20, unit: 'Hour' },
  { id: 'c4', name: 'S3 Standard Storage', type: 'Storage', price: 0.023, unit: 'GB/Month' },
];

const INITIAL_LABOR_PRICING = [
  { id: 'l1', level: 'L3 Senior Annotator', skill: 'Complex Logic, QA', price: 35.00, unit: 'Hour' },
  { id: 'l2', level: 'L2 Mid-Level', skill: 'Road, Admin', price: 20.00, unit: 'Hour' },
  { id: 'l3', level: 'L1 Junior', skill: 'Simple POI', price: 12.00, unit: 'Hour' },
  { id: 'l4', level: 'Vendor Team A', skill: 'Bulk Processing', price: 8.50, unit: 'Hour' },
];

const SystemPricing: React.FC = () => {
  const [compute, setCompute] = useState(INITIAL_COMPUTE_PRICING);
  const [labor, setLabor] = useState(INITIAL_LABOR_PRICING);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addType, setAddType] = useState<'compute' | 'labor'>('compute');
  
  const [newCompute, setNewCompute] = useState({ name: '', type: 'GPU', price: 0, unit: 'Hour' });
  const [newLabor, setNewLabor] = useState({ level: '', skill: '', price: 0, unit: 'Hour' });

  const handleAddItem = () => {
      if (addType === 'compute') {
          if (!newCompute.name) return;
          setCompute([...compute, { ...newCompute, id: `c-${Date.now()}` }]);
      } else {
          if (!newLabor.level) return;
          setLabor([...labor, { ...newLabor, id: `l-${Date.now()}` }]);
      }
      setIsModalOpen(false);
      // Reset forms
      setNewCompute({ name: '', type: 'GPU', price: 0, unit: 'Hour' });
      setNewLabor({ level: '', skill: '', price: 0, unit: 'Hour' });
  };

  const openAddModal = (type: 'compute' | 'labor') => {
      setAddType(type);
      setIsModalOpen(true);
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50 animate-in fade-in relative">
       <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
             <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                   <Tag className="mr-3 text-blue-600" />
                   计费策略配置 (Billing Rules)
                </h1>
                <p className="text-slate-500 mt-1">配置算力资源单价与人力工时成本，用于自动化财务核算。</p>
             </div>
             <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm text-sm font-medium transition-colors">
                <Save size={16} className="mr-2" /> 保存策略
             </button>
          </div>

          <div className="grid grid-cols-1 gap-8">
             
             {/* Compute Pricing */}
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                   <h3 className="text-lg font-bold text-slate-800 flex items-center">
                      <Cpu size={20} className="mr-2 text-indigo-500"/>
                      算力资源单价 (Compute)
                   </h3>
                   <button 
                     onClick={() => openAddModal('compute')}
                     className="text-xs flex items-center text-blue-600 hover:text-blue-700 font-medium bg-white px-2 py-1 rounded border border-blue-200 hover:bg-blue-50 transition-colors"
                   >
                      <Plus size={14} className="mr-1"/> 添加实例类型
                   </button>
                </div>
                <div className="p-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {compute.map((item) => (
                         <div key={item.id} className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all group relative bg-white shadow-sm hover:shadow-md">
                            <div className="flex justify-between items-start mb-2">
                               <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wide">
                                  {item.type}
                               </div>
                               <button className="text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Edit2 size={14} />
                               </button>
                            </div>
                            <div className="font-bold text-slate-800 text-sm mb-3">{item.name}</div>
                            <div className="flex items-baseline">
                               <span className="text-2xl font-bold text-slate-900">${item.price.toFixed(3)}</span>
                               <span className="text-xs text-slate-500 ml-1">/ {item.unit}</span>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Labor Pricing */}
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                   <h3 className="text-lg font-bold text-slate-800 flex items-center">
                      <Users size={20} className="mr-2 text-emerald-500"/>
                      人力工时单价 (Labor)
                   </h3>
                   <button 
                     onClick={() => openAddModal('labor')}
                     className="text-xs flex items-center text-blue-600 hover:text-blue-700 font-medium bg-white px-2 py-1 rounded border border-blue-200 hover:bg-blue-50 transition-colors"
                   >
                      <Plus size={14} className="mr-1"/> 添加职级
                   </button>
                </div>
                <table className="w-full text-left">
                   <thead className="bg-white text-xs font-bold text-slate-500 uppercase border-b border-slate-100">
                      <tr>
                         <th className="px-6 py-3">职级 / 团队</th>
                         <th className="px-6 py-3">技能标签</th>
                         <th className="px-6 py-3">时薪 (Hourly Rate)</th>
                         <th className="px-6 py-3 text-right">操作</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 text-sm">
                      {labor.map((item) => (
                         <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-700">{item.level}</td>
                            <td className="px-6 py-4 text-slate-500 text-xs">
                               <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">{item.skill}</span>
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex items-center text-emerald-700 font-mono font-bold bg-emerald-50 w-fit px-3 py-1 rounded-lg border border-emerald-100">
                                  <DollarSign size={12} className="mr-0.5" />
                                  {item.price.toFixed(2)}
                                  <span className="text-emerald-500 text-xs font-normal ml-1">/ hr</span>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded hover:bg-slate-100 transition-colors">
                                  <Edit2 size={16} />
                               </button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>

          </div>
       </div>

       {/* Add Pricing Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-[500px] overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">
                        {addType === 'compute' ? '新增算力资源' : '新增人力职级'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                </div>
                <div className="p-6 space-y-4">
                    {addType === 'compute' ? (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">实例名称</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none" 
                                    placeholder="e.g. RTX 4090 Server"
                                    value={newCompute.name}
                                    onChange={e => setNewCompute({...newCompute, name: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">类型</label>
                                    <select 
                                        className="w-full px-3 py-2 border border-slate-200 rounded text-sm bg-white"
                                        value={newCompute.type}
                                        onChange={e => setNewCompute({...newCompute, type: e.target.value})}
                                    >
                                        <option>GPU</option>
                                        <option>CPU</option>
                                        <option>Storage</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">单价 ($)</label>
                                    <input 
                                        type="number" 
                                        className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none" 
                                        value={newCompute.price}
                                        onChange={e => setNewCompute({...newCompute, price: parseFloat(e.target.value)})}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">职级/团队名称</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none" 
                                    placeholder="e.g. L4 Expert"
                                    value={newLabor.level}
                                    onChange={e => setNewLabor({...newLabor, level: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">技能描述</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none" 
                                    placeholder="e.g. Audit, Training"
                                    value={newLabor.skill}
                                    onChange={e => setNewLabor({...newLabor, skill: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">时薪 ($)</label>
                                <input 
                                    type="number" 
                                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none" 
                                    value={newLabor.price}
                                    onChange={e => setNewLabor({...newLabor, price: parseFloat(e.target.value)})}
                                />
                            </div>
                        </>
                    )}
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-100">取消</button>
                    <button onClick={handleAddItem} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 shadow-sm">添加</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SystemPricing;
