
import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Shield, 
  Map as MapIcon, 
  Layers, 
  EyeOff, 
  Filter,
  CheckCircle2,
  XCircle,
  Edit2,
  BadgeCheck,
  Briefcase,
  X
} from 'lucide-react';

const INITIAL_USERS = [
  { 
    id: 'u1', 
    name: '王强', 
    role: '作业员', 
    dept: '数据生产一部', 
    email: 'wangq@tuding.ai', 
    status: 'Active', 
    skills: ['路网专家', '3D点云'],
    scope: { 
        grids: ['110108 (海淀)', '110105 (朝阳)'], 
        layers: ['Road', 'POI', 'Background'],
        masking: ['Phone', 'Internal_Notes']
    } 
  },
  { 
    id: 'u2', 
    name: '李娜', 
    role: '质检专家', 
    dept: '质量管理部', 
    email: 'lin@tuding.ai', 
    status: 'Active', 
    skills: ['全要素质检'],
    scope: { 
        grids: ['* (Global)'], 
        layers: ['All'],
        masking: []
    } 
  },
  { 
    id: 'u3', 
    name: '张伟', 
    role: '项目经理', 
    dept: '交付中心', 
    email: 'zhangw@tuding.ai', 
    status: 'Active', 
    skills: [],
    scope: { 
        grids: ['* (Global)'], 
        layers: ['All'],
        masking: []
    } 
  },
  { 
    id: 'u4', 
    name: 'Vendor_A01', 
    role: '外包作业员', 
    dept: '外包团队A', 
    email: 'va01@vendor.com', 
    status: 'Active', 
    skills: ['POI 采集'],
    scope: { 
        grids: ['110108 (海淀)'], 
        layers: ['POI'],
        masking: ['Phone', 'Address_Detail', 'Owner_Name']
    } 
  },
];

const SystemUsers: React.FC = () => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [selectedUserId, setSelectedUserId] = useState<string | null>('u1');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '作业员', dept: '' });

  const selectedUser = users.find(u => u.id === selectedUserId) || null;

  const filteredUsers = users.filter(u => 
    u.name.includes(searchTerm) || 
    u.email.includes(searchTerm) || 
    u.role.includes(searchTerm)
  );

  const handleAddSkill = () => {
    if (!selectedUser) return;
    const skill = window.prompt("请输入新技能标签 (e.g. 路网专家):");
    if (skill) {
      setUsers(prev => prev.map(u => 
        u.id === selectedUserId 
        ? { ...u, skills: [...u.skills, skill] }
        : u
      ));
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!selectedUser) return;
    setUsers(prev => prev.map(u => 
      u.id === selectedUserId 
      ? { ...u, skills: u.skills.filter(s => s !== skillToRemove) }
      : u
    ));
  };

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email) return;
    const u = {
        id: `u-${Date.now()}`,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        dept: newUser.dept || '待分配',
        status: 'Active',
        skills: [],
        scope: { grids: [], layers: ['All'], masking: [] }
    };
    setUsers([...users, u]);
    setIsAddModalOpen(false);
    setNewUser({ name: '', email: '', role: '作业员', dept: '' });
    setSelectedUserId(u.id);
  };

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden animate-in fade-in relative">
      {/* Left: User List */}
      <div className="w-96 bg-white border-r border-slate-200 flex flex-col z-10">
        <div className="p-6 border-b border-slate-100">
           <h1 className="text-xl font-bold text-slate-900 flex items-center">
              <Users className="mr-3 text-blue-600" />
              用户与组织
           </h1>
           <p className="text-xs text-slate-500 mt-1">管理用户账号、技能标签及数据访问边界。</p>
           
           <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="搜索姓名、邮箱或工号..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
              />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
           {filteredUsers.map(user => (
              <div 
                 key={user.id}
                 onClick={() => setSelectedUserId(user.id)}
                 className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${
                    selectedUserId === user.id 
                    ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-100' 
                    : 'bg-white border-slate-200 hover:border-blue-200'
                 }`}
              >
                 <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                       <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 mr-3 border border-white shadow-sm">
                          {user.name.charAt(0)}
                       </div>
                       <div>
                          <div className="text-sm font-bold text-slate-800">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                       </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                       user.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                       {user.status}
                    </span>
                 </div>
                 <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pl-12">
                    <div className="flex items-center">
                        <Briefcase size={12} className="mr-1 text-slate-400"/>
                        <span>{user.role}</span>
                    </div>
                    <div className="flex gap-1">
                        {user.skills.slice(0, 2).map(skill => (
                            <span key={skill} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600">{skill}</span>
                        ))}
                        {user.skills.length > 2 && <span className="text-[10px] text-slate-400">+{user.skills.length - 2}</span>}
                    </div>
                 </div>
              </div>
           ))}
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50">
           <button 
             onClick={() => setIsAddModalOpen(true)}
             className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm text-sm font-medium transition-colors"
           >
              <Plus size={16} className="mr-2" /> 新增用户
           </button>
        </div>
      </div>

      {/* Right: User Details & Scoping */}
      <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
         {selectedUser ? (
            <div className="max-w-4xl mx-auto space-y-6">
               {/* Identity Card */}
               <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <div className="flex justify-between items-start mb-6">
                     <h2 className="text-lg font-bold text-slate-800 flex items-center">
                        <Shield className="mr-2 text-indigo-500" />
                        身份与技能 (Identity & Skills)
                     </h2>
                     <button className="text-slate-400 hover:text-blue-600 p-2 hover:bg-slate-50 rounded transition-colors">
                        <Edit2 size={16} />
                     </button>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">所属角色 (Role)</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" defaultValue={selectedUser.role}>
                           <option>作业员</option>
                           <option>质检专家</option>
                           <option>项目经理</option>
                           <option>外包作业员</option>
                           <option>算法工程师</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">所属部门</label>
                        <input type="text" defaultValue={selectedUser.dept} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
                     </div>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">技能组 (Skill Tags)</label>
                      <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg min-h-[50px]">
                          {selectedUser.skills.map(skill => (
                              <span key={skill} className="px-2 py-1 bg-white border border-indigo-100 text-indigo-700 text-xs rounded-md shadow-sm flex items-center">
                                  <BadgeCheck size={12} className="mr-1 text-indigo-500"/>
                                  {skill}
                                  <button onClick={() => handleRemoveSkill(skill)} className="ml-2 text-indigo-300 hover:text-indigo-600"><XCircle size={12}/></button>
                              </span>
                          ))}
                          <button 
                            onClick={handleAddSkill}
                            className="px-2 py-1 bg-white border border-dashed border-slate-300 text-slate-400 text-xs rounded-md hover:text-blue-600 hover:border-blue-300 flex items-center transition-colors"
                          >
                              <Plus size={12} className="mr-1"/> Add Tag
                          </button>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2">
                          * 技能标签用于分诊台自动派单逻辑 (e.g. 只有具备 "路网专家" 技能的作业员才能领取复杂立交桥任务).
                      </p>
                  </div>
               </div>

               {/* Data Scoping Card */}
               <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center">
                        <Filter className="mr-2 text-purple-500" />
                        数据空间权限 (Data Scoping)
                    </h2>
                    <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100 font-bold">
                        Policy Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-6">定义该用户可访问的地理范围、数据图层及字段可见性。</p>

                  <div className="space-y-6">
                     {/* Grid Isolation */}
                     <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-center mb-3">
                           <h3 className="text-sm font-bold text-slate-700 flex items-center">
                              <MapIcon size={16} className="mr-2 text-slate-500" />
                              网格级隔离 (Grid Fence)
                           </h3>
                           <span className="text-xs text-slate-400">限制用户只能在特定 geographic bounds 内作业</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {selectedUser.scope.grids[0].startsWith('*') ? (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200 flex items-center w-fit">
                                 <CheckCircle2 size={12} className="mr-1" /> 全域访问 (Global Access)
                              </span>
                           ) : (
                              selectedUser.scope.grids.map(grid => (
                                 <span key={grid} className="px-3 py-1 bg-white text-slate-600 rounded-full text-xs border border-slate-200 flex items-center shadow-sm">
                                    <MapIcon size={12} className="mr-1 text-slate-400" /> {grid}
                                    <button className="ml-2 hover:text-rose-500"><XCircle size={12} /></button>
                                 </span>
                              ))
                           )}
                           <button className="px-3 py-1 bg-white border border-dashed border-slate-300 text-slate-400 rounded-full text-xs hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center">
                              <Plus size={12} className="mr-1"/> 添加网格
                           </button>
                        </div>
                     </div>

                     {/* Layer Isolation */}
                     <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-center mb-3">
                           <h3 className="text-sm font-bold text-slate-700 flex items-center">
                              <Layers size={16} className="mr-2 text-slate-500" />
                              图层级隔离 (Layer Access)
                           </h3>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                           {['Road', 'POI', 'Admin', 'Hydro', 'Military (Restricted)', 'Underground'].map(layer => {
                              const isRestricted = layer.includes('Restricted');
                              const hasAccess = selectedUser.scope.layers.includes('All') || selectedUser.scope.layers.some(l => layer.includes(l));
                              return (
                                 <label key={layer} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                                    hasAccess 
                                    ? 'bg-white border-blue-200 shadow-sm' 
                                    : 'bg-slate-100 border-transparent opacity-60'
                                 }`}>
                                    <input type="checkbox" checked={hasAccess} className="mr-3 accent-blue-600" readOnly />
                                    <span className={`text-xs font-medium ${isRestricted ? 'text-rose-600' : 'text-slate-700'}`}>{layer}</span>
                                 </label>
                              );
                           })}
                        </div>
                     </div>

                     {/* Field Masking */}
                     <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-center mb-3">
                           <h3 className="text-sm font-bold text-slate-700 flex items-center">
                              <EyeOff size={16} className="mr-2 text-slate-500" />
                              敏感字段脱敏 (Field Masking)
                           </h3>
                           <span className="text-xs text-slate-400">开启后对应字段将显示为 ******</span>
                        </div>
                        <div className="space-y-2">
                           <div className="flex items-center justify-between p-3 bg-white rounded border border-slate-100 shadow-sm">
                              <span className="text-xs font-bold text-slate-600">联系人电话 (Phone)</span>
                              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                 <input type="checkbox" checked={selectedUser.scope.masking.includes('Phone')} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-green-400"/>
                                 <label className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${selectedUser.scope.masking.includes('Phone') ? 'bg-green-400' : 'bg-gray-300'}`}></label>
                              </div>
                           </div>
                           <div className="flex items-center justify-between p-3 bg-white rounded border border-slate-100 shadow-sm">
                              <span className="text-xs font-bold text-slate-600">内部备注 (Internal Notes)</span>
                              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                 <input type="checkbox" checked={selectedUser.scope.masking.includes('Internal_Notes')} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-green-400"/>
                                 <label className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${selectedUser.scope.masking.includes('Internal_Notes') ? 'bg-green-400' : 'bg-gray-300'}`}></label>
                              </div>
                           </div>
                           <div className="flex items-center justify-between p-3 bg-white rounded border border-slate-100 shadow-sm">
                              <span className="text-xs font-bold text-slate-600">所有者姓名 (Owner Name)</span>
                              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                 <input type="checkbox" checked={selectedUser.scope.masking.includes('Owner_Name')} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-green-400"/>
                                 <label className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${selectedUser.scope.masking.includes('Owner_Name') ? 'bg-green-400' : 'bg-gray-300'}`}></label>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
               <Users size={48} className="mb-4 opacity-20" />
               <p className="text-sm">请在左侧选择一个用户以配置权限</p>
            </div>
         )}
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-[500px] overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">添加新用户</h3>
                    <button onClick={() => setIsAddModalOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">姓名</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none" 
                            placeholder="请输入真实姓名"
                            value={newUser.name}
                            onChange={e => setNewUser({...newUser, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">邮箱 / 账号</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none" 
                            placeholder="user@tuding.ai"
                            value={newUser.email}
                            onChange={e => setNewUser({...newUser, email: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">角色</label>
                            <select 
                                className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none bg-white"
                                value={newUser.role}
                                onChange={e => setNewUser({...newUser, role: e.target.value})}
                            >
                                <option>作业员</option>
                                <option>质检专家</option>
                                <option>项目经理</option>
                                <option>外包作业员</option>
                                <option>算法工程师</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">部门</label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none"
                                placeholder="例如: 生产一部"
                                value={newUser.dept}
                                onChange={e => setNewUser({...newUser, dept: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
                    <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-100">取消</button>
                    <button onClick={handleCreateUser} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">创建用户</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SystemUsers;
