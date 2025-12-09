
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Users, 
  Check, 
  Edit2, 
  Trash2,
  Lock,
  X
} from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  isSystem?: boolean;
}

const INITIAL_ROLES: Role[] = [
  { id: 'admin', name: '超级管理员 (Admin)', description: '拥有系统所有权限，包括系统配置与用户管理。', usersCount: 2, isSystem: true },
  { id: 'pm', name: '产线经理 (PM)', description: '负责任务分配、进度监控与产线管理。', usersCount: 5 },
  { id: 'qa', name: '质检专家 (QA)', description: '负责数据验收、质量评测与标准制定。', usersCount: 8 },
  { id: 'worker', name: '作业员 (Worker)', description: '仅具有分配任务的作业与提交权限。', usersCount: 45 },
  { id: 'algo', name: '算法工程师 (Algo)', description: '管理模型仓库与训练任务。', usersCount: 6 },
  { id: 'auditor', name: '审计员 (Auditor)', description: '只读权限，查看日志与合规报表。', usersCount: 3 },
];

const PERMISSIONS = [
  {
    module: '资源管理 (Resources)',
    items: [
      { id: 'res_view', label: '查看资料集市' },
      { id: 'res_upload', label: '上传数据' },
      { id: 'res_delete', label: '删除数据' },
      { id: 'res_model_manage', label: '模型管理' },
    ]
  },
  {
    module: '生产作业 (Production)',
    items: [
      { id: 'prod_task_view', label: '查看任务' },
      { id: 'prod_task_assign', label: '分配任务 (Dispatch)' },
      { id: 'prod_work', label: '执行标注 (Workbench)' },
      { id: 'prod_pipeline_edit', label: '编排产线' },
    ]
  },
  {
    module: '质量交付 (Quality)',
    items: [
      { id: 'qa_audit', label: '执行质检 (Review)' },
      { id: 'qa_report', label: '查看评测报告' },
      { id: 'qa_release', label: '版本发布' },
    ]
  },
  {
    module: '系统设置 (System)',
    items: [
      { id: 'sys_user', label: '用户管理' },
      { id: 'sys_role', label: '角色管理' },
      { id: 'sys_log', label: '日志查看' },
      { id: 'sys_config', label: '全局配置' },
    ]
  },
];

const SystemRoles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('admin');
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({
    'admin': PERMISSIONS.flatMap(m => m.items.map(i => i.id)),
    'worker': ['prod_task_view', 'prod_work'],
    'qa': ['prod_task_view', 'qa_audit', 'qa_report'],
    'pm': ['res_view', 'prod_task_view', 'prod_task_assign', 'prod_pipeline_edit', 'qa_report'],
    'auditor': ['sys_log', 'qa_report', 'res_view']
  });

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', description: '' });

  const activeRole = roles.find(r => r.id === selectedRoleId);

  const togglePermission = (permId: string) => {
    if (activeRole?.isSystem) return; // Prevent editing system admin
    
    setRolePermissions(prev => {
      const current = prev[selectedRoleId] || [];
      const isSelected = current.includes(permId);
      return {
        ...prev,
        [selectedRoleId]: isSelected 
          ? current.filter(id => id !== permId)
          : [...current, permId]
      };
    });
  };

  const handleSelectAll = (modulePerms: {id: string}[]) => {
    if (activeRole?.isSystem) return;
    
    setRolePermissions(prev => {
      const current = prev[selectedRoleId] || [];
      const allIds = modulePerms.map(i => i.id);
      const allSelected = allIds.every(id => current.includes(id));
      
      return {
        ...prev,
        [selectedRoleId]: allSelected
          ? current.filter(id => !allIds.includes(id))
          : Array.from(new Set([...current, ...allIds]))
      };
    });
  };

  const handleCreateRole = () => {
    if (!newRole.name) return;
    const r: Role = {
        id: `role-${Date.now()}`,
        name: newRole.name,
        description: newRole.description,
        usersCount: 0,
        isSystem: false
    };
    setRoles([...roles, r]);
    setRolePermissions(prev => ({ ...prev, [r.id]: [] }));
    setIsAddModalOpen(false);
    setNewRole({ name: '', description: '' });
    setSelectedRoleId(r.id);
  };

  const handleDeleteRole = (id: string) => {
      if(confirm('确定要删除此角色吗？')) {
          setRoles(prev => prev.filter(r => r.id !== id));
          if(selectedRoleId === id) setSelectedRoleId(roles[0].id);
      }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden animate-in fade-in relative">
       <div className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center shrink-0">
          <div>
             <h1 className="text-xl font-bold text-slate-900 flex items-center">
                <ShieldCheck className="mr-3 text-blue-600" />
                角色权限管理 (RBAC)
             </h1>
             <p className="text-xs text-slate-500 mt-1">配置系统角色与功能访问控制策略。</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm text-sm font-medium transition-colors"
          >
             <Plus size={16} className="mr-2" /> 新增角色
          </button>
       </div>

       <div className="flex flex-1 overflow-hidden">
          {/* Left: Role List */}
          <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
             <div className="p-4 border-b border-slate-100">
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                   <input type="text" placeholder="搜索角色..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
             </div>
             <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {roles.map(role => (
                   <div 
                      key={role.id}
                      onClick={() => setSelectedRoleId(role.id)}
                      className={`p-3 rounded-lg cursor-pointer border transition-all ${
                         selectedRoleId === role.id 
                         ? 'bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-100' 
                         : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                      }`}
                   >
                      <div className="flex justify-between items-start mb-1">
                         <span className={`font-bold text-sm ${selectedRoleId === role.id ? 'text-blue-800' : 'text-slate-700'}`}>{role.name}</span>
                         {role.isSystem && <span title="系统内置"><Lock size={12} className="text-slate-400" /></span>}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-2">{role.description}</p>
                      <div className="flex items-center text-[10px] text-slate-400">
                         <Users size={12} className="mr-1" /> {role.usersCount} 成员
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Right: Permissions Matrix */}
          <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
             {activeRole ? (
                <>
                   <div className="px-8 py-6 flex-1 overflow-y-auto">
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                               <h2 className="text-lg font-bold text-slate-900 flex items-center">
                                  {activeRole.name}
                                  {activeRole.isSystem && <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded border border-slate-200 font-medium">系统内置</span>}
                               </h2>
                               <p className="text-sm text-slate-500 mt-1">{activeRole.description}</p>
                            </div>
                            <div className="flex space-x-2">
                               <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                  <Edit2 size={16} />
                               </button>
                               {!activeRole.isSystem && (
                                  <button 
                                    onClick={() => handleDeleteRole(activeRole.id)}
                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  >
                                     <Trash2 size={16} />
                                  </button>
                               )}
                            </div>
                         </div>
                         
                         {/* Permissions Grid */}
                         <div className="space-y-6">
                            {PERMISSIONS.map((module, idx) => (
                               <div key={idx} className="border-t border-slate-100 pt-4 first:border-0 first:pt-0">
                                  <div className="flex items-center justify-between mb-3">
                                     <h3 className="font-bold text-sm text-slate-700">{module.module}</h3>
                                     <button 
                                        onClick={() => handleSelectAll(module.items)}
                                        disabled={activeRole.isSystem}
                                        className="text-xs text-blue-600 hover:underline disabled:text-slate-300 disabled:no-underline"
                                     >
                                        全选 / 取消
                                     </button>
                                  </div>
                                  <div className="grid grid-cols-4 gap-4">
                                     {module.items.map(perm => {
                                        const isChecked = (rolePermissions[selectedRoleId] || []).includes(perm.id);
                                        return (
                                           <label 
                                              key={perm.id} 
                                              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                                 isChecked 
                                                 ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                                 : 'bg-white border-slate-200 hover:border-blue-200'
                                              } ${activeRole.isSystem ? 'cursor-not-allowed opacity-80' : ''}`}
                                           >
                                              <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${
                                                 isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'
                                              }`}>
                                                 {isChecked && <Check size={10} />}
                                              </div>
                                              <input 
                                                 type="checkbox" 
                                                 className="hidden" 
                                                 checked={isChecked} 
                                                 onChange={() => togglePermission(perm.id)}
                                                 disabled={activeRole.isSystem}
                                              />
                                              <span className={`text-xs font-medium ${isChecked ? 'text-blue-800' : 'text-slate-600'}`}>{perm.label}</span>
                                           </label>
                                        );
                                     })}
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                   
                   <div className="px-8 py-4 border-t border-slate-200 bg-white flex justify-end space-x-3">
                      <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">取消</button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm" disabled={activeRole.isSystem}>
                         保存权限更改
                      </button>
                   </div>
                </>
             ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                   <ShieldCheck size={48} className="mb-4 opacity-20" />
                   <p className="text-sm">请在左侧选择一个角色进行配置</p>
                </div>
             )}
          </div>
       </div>

       {/* Add Role Modal */}
       {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-[500px] overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">添加新角色</h3>
                    <button onClick={() => setIsAddModalOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">角色名称</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none" 
                            placeholder="例如: 临时审核员"
                            value={newRole.name}
                            onChange={e => setNewRole({...newRole, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">描述</label>
                        <textarea 
                            className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none h-24 resize-none"
                            placeholder="简述该角色的职责与权限范围..."
                            value={newRole.description}
                            onChange={e => setNewRole({...newRole, description: e.target.value})}
                        />
                    </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
                    <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-100">取消</button>
                    <button onClick={handleCreateRole} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">创建角色</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SystemRoles;
