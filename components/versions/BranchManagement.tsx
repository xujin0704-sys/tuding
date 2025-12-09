
import React, { useState } from 'react';
import { 
  GitBranch, 
  GitMerge, 
  Plus, 
  Search, 
  MoreHorizontal, 
  AlertCircle, 
  Check, 
  X,
  FileCode,
  ArrowRight,
  GitPullRequest,
  GitCompare,
  ArrowLeft,
  Map as MapIcon,
  Maximize2
} from 'lucide-react';

const BRANCHES = [
  { id: 'main', type: 'Protected', author: 'System', lastCommit: '2 hours ago', status: 'Active' },
  { id: 'feature/olympic-stadium', type: 'Feature', author: 'Zhang San', lastCommit: '5 mins ago', status: 'Active' },
  { id: 'feature/q4-road-update', type: 'Feature', author: 'Li Si', lastCommit: '1 day ago', status: 'Stale' },
  { id: 'hotfix/poi-offset-fix', type: 'Hotfix', author: 'Wang Wu', lastCommit: '30 mins ago', status: 'Merging' },
];

const BranchManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'requests' | 'compare'>('list');
  const [comparingBranch, setComparingBranch] = useState<typeof BRANCHES[0] | null>(null);

  const handleCompare = (branch: typeof BRANCHES[0]) => {
    setComparingBranch(branch);
    setActiveTab('compare');
  };

  const handleBackToList = () => {
    setComparingBranch(null);
    setActiveTab('list');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden animate-in fade-in">
       {/* Header */}
       <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0">
          <div>
             <h1 className="text-xl font-bold text-slate-900 flex items-center">
                <GitBranch className="mr-3 text-purple-600" />
                分支管理 (Branch Management)
             </h1>
             <p className="text-xs text-slate-500 mt-1">支持多团队并行作业与数据隔离。</p>
          </div>
          <div className="flex space-x-3">
             <div className="bg-slate-100 p-1 rounded-lg flex">
                <button 
                   onClick={() => setActiveTab('list')}
                   className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'list' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                   分支列表
                </button>
                <button 
                   onClick={() => setActiveTab('requests')}
                   className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'requests' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                   合并请求 (2)
                </button>
             </div>
             <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-sm text-sm font-medium transition-colors">
                <Plus size={16} className="mr-2" /> 新建分支
             </button>
          </div>
       </div>

       {/* Content */}
       <div className="flex-1 overflow-hidden">
          {activeTab === 'list' && (
             <div className="p-6 h-full overflow-y-auto">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input type="text" placeholder="搜索分支..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
                    </div>
                    </div>
                    <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                        <tr>
                            <th className="px-6 py-3">分支名称</th>
                            <th className="px-6 py-3">类型</th>
                            <th className="px-6 py-3">创建人</th>
                            <th className="px-6 py-3">最后提交</th>
                            <th className="px-6 py-3">状态</th>
                            <th className="px-6 py-3 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {BRANCHES.map(branch => (
                            <tr key={branch.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-mono font-medium text-slate-700 flex items-center">
                                <GitBranch size={14} className="mr-2 text-slate-400" />
                                {branch.id}
                                </td>
                                <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium border ${
                                    branch.type === 'Protected' ? 'bg-slate-100 border-slate-200 text-slate-600' :
                                    branch.type === 'Hotfix' ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-blue-50 border-blue-200 text-blue-600'
                                }`}>
                                    {branch.type}
                                </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{branch.author}</td>
                                <td className="px-6 py-4 text-slate-500">{branch.lastCommit}</td>
                                <td className="px-6 py-4">
                                <span className={`flex items-center text-xs font-bold ${branch.status === 'Active' ? 'text-green-600' : branch.status === 'Merging' ? 'text-purple-600' : 'text-slate-400'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${branch.status === 'Active' ? 'bg-green-500' : branch.status === 'Merging' ? 'bg-purple-500' : 'bg-slate-300'}`}></span>
                                    {branch.status}
                                </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                    <button 
                                        onClick={() => handleCompare(branch)}
                                        className="p-1.5 hover:bg-purple-50 hover:text-purple-600 rounded text-slate-400 transition-colors"
                                        title="Compare"
                                    >
                                        <GitCompare size={16} />
                                    </button>
                                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
             </div>
          )}

          {activeTab === 'requests' && (
             <div className="p-6 h-full overflow-y-auto space-y-6">
                {/* Request Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <div className="flex items-center space-x-3 mb-1">
                            <span className="text-lg font-bold text-slate-800">Merge feature/olympic-stadium into main</span>
                            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold">#MR-102</span>
                         </div>
                         <div className="flex items-center text-sm text-slate-500 space-x-2">
                            <span>Requested by <span className="font-medium text-slate-700">Zhang San</span></span>
                            <span>•</span>
                            <span>1 hour ago</span>
                         </div>
                      </div>
                      <div className="flex space-x-2">
                         <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 text-slate-700">Reject</button>
                         <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm">Approve & Merge</button>
                      </div>
                   </div>

                   {/* AI Conflict Detection */}
                   <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center mb-2">
                         <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-2">
                            <AlertCircle size={12} />
                         </div>
                         <span className="text-sm font-bold text-slate-700">AI 冲突预判 (Conflict Detection)</span>
                      </div>
                      <div className="text-sm text-slate-600 ml-7">
                         <p className="mb-2">检测到 <span className="font-bold text-rose-500">2 处</span> 潜在冲突：</p>
                         <ul className="list-disc pl-4 space-y-1 text-xs">
                            <li>Road ID <code className="bg-white px-1 border rounded">R_9921</code> 几何被另一个分支 <code className="bg-white px-1 border rounded">feature/q4</code> 修改。</li>
                            <li>POI ID <code className="bg-white px-1 border rounded">P_1102</code> 属性 'Name' 存在并发更新。</li>
                         </ul>
                      </div>
                   </div>

                   {/* Diff Summary */}
                   <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div className="p-3 bg-green-50 text-green-700 rounded border border-green-100">
                         <span className="block font-bold text-xl">+124</span> New Features
                      </div>
                      <div className="p-3 bg-amber-50 text-amber-700 rounded border border-amber-100">
                         <span className="block font-bold text-xl">~45</span> Modified
                      </div>
                      <div className="p-3 bg-rose-50 text-rose-700 rounded border border-rose-100">
                         <span className="block font-bold text-xl">-12</span> Deleted
                      </div>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'compare' && comparingBranch && (
              <div className="flex flex-col h-full animate-in slide-in-from-right duration-300 bg-slate-50">
                  {/* Compare Header */}
                  <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
                      <div className="flex items-center">
                          <button 
                            onClick={handleBackToList}
                            className="mr-3 p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
                          >
                              <ArrowLeft size={18} />
                          </button>
                          <div className="flex items-center space-x-2 text-sm text-slate-700">
                              <span className="font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">main</span>
                              <ArrowRight size={14} className="text-slate-400" />
                              <span className="font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-mono border border-purple-100">{comparingBranch.id}</span>
                          </div>
                      </div>
                      <div className="flex items-center space-x-3 text-xs">
                          <div className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded border border-green-100">
                              <span className="font-bold mr-1">12</span> Commits Ahead
                          </div>
                          <div className="flex items-center px-3 py-1 bg-amber-50 text-amber-700 rounded border border-amber-100">
                              <span className="font-bold mr-1">3</span> Commits Behind
                          </div>
                          <button className="bg-purple-600 text-white px-3 py-1.5 rounded font-medium shadow-sm hover:bg-purple-700 transition-colors flex items-center">
                              <GitPullRequest size={14} className="mr-1.5"/>
                              Create Merge Request
                          </button>
                      </div>
                  </div>

                  {/* Compare Content */}
                  <div className="flex-1 p-6 overflow-hidden flex flex-col">
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                          <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                                  <MapIcon size={14} className="mr-2"/>
                                  Spatial Difference
                              </h3>
                              <div className="flex space-x-4 text-[10px]">
                                  <span className="flex items-center"><div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div> Added (15)</span>
                                  <span className="flex items-center"><div className="w-2 h-2 bg-amber-500 rounded-full mr-1.5"></div> Modified (8)</span>
                                  <span className="flex items-center"><div className="w-2 h-2 bg-rose-500 rounded-full mr-1.5"></div> Deleted (2)</span>
                              </div>
                          </div>
                          
                          <div className="flex-1 relative bg-slate-200 overflow-hidden">
                              <div className="absolute inset-0 flex">
                                  {/* Left: Base */}
                                  <div className="w-1/2 border-r border-white/50 relative overflow-hidden bg-slate-300 grayscale">
                                      <div className="absolute top-4 left-4 bg-black/60 text-white px-2 py-1 rounded text-xs z-10 backdrop-blur-sm">Base: main</div>
                                      <div className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/116.4,39.9,12,0/800x600?access_token=pk.xxx')] bg-cover opacity-60"></div>
                                  </div>
                                  {/* Right: Compare */}
                                  <div className="w-1/2 relative overflow-hidden bg-slate-100">
                                      <div className="absolute top-4 right-4 bg-purple-600/90 text-white px-2 py-1 rounded text-xs z-10 backdrop-blur-sm">Compare: {comparingBranch.id}</div>
                                      <div className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/116.4,39.9,12,0/800x600?access_token=pk.xxx')] bg-cover"></div>
                                      
                                      {/* Mock Visual Diff Elements */}
                                      <div className="absolute top-1/3 left-1/4 w-32 h-2 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] transform rotate-12 opacity-80"></div>
                                      <div className="absolute bottom-1/3 right-1/3 w-20 h-20 border-2 border-amber-500 rounded-full animate-pulse opacity-80 bg-amber-500/10"></div>
                                      <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-ping"></div>
                                  </div>
                              </div>
                              
                              {/* Split Handle */}
                              <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white cursor-col-resize hover:bg-blue-400 z-10 flex items-center justify-center group shadow-lg">
                                  <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors border border-slate-100">
                                      <Maximize2 size={14} className="rotate-45"/>
                                  </div>
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

export default BranchManagement;
