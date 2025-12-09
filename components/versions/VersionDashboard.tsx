
import React, { useState } from 'react';
import { 
  GitCommit, 
  GitBranch, 
  Clock, 
  CheckCircle2, 
  Server, 
  Activity, 
  ShieldCheck, 
  Zap,
  TrendingUp,
  ListFilter,
  FileCode,
  Box,
  ChevronRight,
  ArrowRight,
  Layers,
  Flag,
  FlaskConical,
  Ban,
  Archive,
  Radio,
  History,
  Calendar
} from 'lucide-react';

const VersionDashboard: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onlineVersion = {
    id: 'v2025.12.01-Release',
    deployTime: '4 天 12 小时',
    model: 'v2.1',
    status: 'Online',
    health: '99.9%'
  };

  const timeline = [
    { 
      id: 'v2025.12.01-Release', 
      type: 'Release', 
      date: '2025-12-01 10:00', 
      author: 'System', 
      desc: 'Q4 Full Release - 包含海淀北部路网全量更新与 POI 修正。', 
      status: 'online',
      commits: 128,
      pipelines: ['Road', 'POI', 'Admin'],
      qaScore: 99
    },
    { 
      id: 'v2025.12.01-RC2', 
      type: 'Snapshot', 
      date: '2025-11-30 14:00', 
      author: 'Jane Doe', 
      desc: 'Pre-release fix for POI index - 修复了索引构建时的内存溢出问题。', 
      status: 'staging',
      commits: 12,
      pipelines: ['POI'],
      qaScore: 95
    },
    { 
      id: 'v2025.12.01-RC1', 
      type: 'Snapshot', 
      date: '2025-11-29 09:30', 
      author: 'Auto CI', 
      desc: 'Integration test passed - 自动化集成测试通过，生成候选版本。', 
      status: 'archived',
      commits: 45,
      pipelines: ['Road', 'Admin'],
      qaScore: 92
    },
    { 
      id: 'v2025.11.15-Hotfix', 
      type: 'Hotfix', 
      date: '2025-11-15 18:20', 
      author: 'John Smith', 
      desc: 'Emergency fix for routing crash - 紧急修复路由服务在特定几何下的崩溃 bug。', 
      status: 'deprecated',
      commits: 1,
      pipelines: ['Road'],
      qaScore: 100
    },
  ];

  // Calculate summary stats for the overview
  const stats = {
    total: timeline.length,
    releases: timeline.filter(t => t.type === 'Release').length,
    staging: timeline.filter(t => t.status === 'staging').length
  };

  const latestRelease = timeline.find(t => t.type === 'Release');
  const latestStaging = timeline.find(t => t.status === 'staging');
  const latestUpdate = timeline[0]?.date || 'N/A';

  const productionVersions = timeline.filter(v => v.status === 'online');
  const stagingVersions = timeline.filter(v => v.status === 'staging');
  const historyVersions = timeline.filter(v => ['deprecated', 'archived'].includes(v.status));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 shadow-sm">
            <CheckCircle2 size={12} className="mr-1.5" />
            Online
          </span>
        );
      case 'staging':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
            <FlaskConical size={12} className="mr-1.5" />
            Staging
          </span>
        );
      case 'deprecated':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <Ban size={12} className="mr-1.5" />
            Deprecated
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <Archive size={12} className="mr-1.5" />
            Archived
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end">
           <div>
              <h1 className="text-2xl font-bold text-slate-900">版本全景 (Version Dashboard)</h1>
              <p className="text-slate-500 mt-1">版本控制塔：实时监控线上状态与演进脉络。</p>
           </div>
           <div className="flex space-x-2">
              <span className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-200 shadow-sm">
                 <Activity size={14} className="mr-1.5" />
                 System Healthy
              </span>
           </div>
        </div>

        {/* Key Metrics Summary Area */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {/* Total Versions */}
           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                 <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">总版本数</p>
                 <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</h3>
              </div>
              <div className="p-3 bg-slate-50 text-slate-600 rounded-lg">
                 <Layers size={20} />
              </div>
           </div>

           {/* Online Version */}
           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="overflow-hidden mr-2">
                 <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">当前线上版本</p>
                 <h3 className="text-lg font-bold text-slate-900 mt-1 truncate" title={onlineVersion.id}>{onlineVersion.id}</h3>
                 <span className="text-[10px] text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded inline-block mt-1">Production</span>
              </div>
              <div className="p-3 bg-green-50 text-green-600 rounded-lg shrink-0">
                 <CheckCircle2 size={20} />
              </div>
           </div>

           {/* Staging Versions */}
           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                 <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">预发布版本 (RC)</p>
                 <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.staging}</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                 <FlaskConical size={20} />
              </div>
           </div>

           {/* Last Update */}
           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                 <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">最近更新时间</p>
                 <h3 className="text-lg font-bold text-slate-900 mt-1">{latestUpdate}</h3>
                 <span className="text-[10px] text-slate-400">Latest Activity</span>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                 <Clock size={20} />
              </div>
           </div>
        </div>

        {/* Online Status Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-50 to-transparent rounded-bl-full pointer-events-none"></div>
           
           <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center">
                 <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mr-4 shadow-inner">
                    <Server size={24} />
                 </div>
                 <div>
                    <div className="text-sm text-slate-500 font-medium mb-1">当前线上环境详情 (Production Environment)</div>
                    <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{onlineVersion.id}</div>
                 </div>
              </div>
              <div className="text-right">
                 <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">服务时长</div>
                 <div className="text-xl font-medium text-slate-700 font-mono">{onlineVersion.deployTime}</div>
              </div>
           </div>

           <div className="grid grid-cols-4 gap-6 mt-8 pt-6 border-t border-slate-50">
              <div>
                 <div className="text-xs text-slate-400 mb-1">关联模型</div>
                 <div className="font-bold text-slate-700 flex items-center">
                    <Zap size={14} className="mr-1 text-blue-500"/> {onlineVersion.model}
                 </div>
              </div>
              <div>
                 <div className="text-xs text-slate-400 mb-1">健康度</div>
                 <div className="font-bold text-green-600 flex items-center">
                    <CheckCircle2 size={14} className="mr-1"/> {onlineVersion.health}
                 </div>
              </div>
              <div>
                 <div className="text-xs text-slate-400 mb-1">配置指纹</div>
                 <div className="font-mono text-slate-600 text-xs bg-slate-100 px-2 py-1 rounded w-fit">
                    SHA: a1b2c3d4
                 </div>
              </div>
              <div>
                 <div className="text-xs text-slate-400 mb-1">部署人</div>
                 <div className="font-bold text-slate-700 flex items-center">
                    <ShieldCheck size={14} className="mr-1 text-purple-500"/> Operations
                 </div>
              </div>
           </div>
        </div>

        {/* Release Channels Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Live Channel */}
            <div className="bg-white rounded-xl border border-green-200 shadow-sm flex flex-col overflow-hidden">
                <div className="px-4 py-3 border-b border-green-100 bg-green-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-green-800 text-sm flex items-center">
                        <Radio size={16} className="mr-2"/> Live Channel
                    </h3>
                    <span className="text-xs bg-white text-green-700 px-2 py-0.5 rounded border border-green-200 font-bold shadow-sm">{productionVersions.length}</span>
                </div>
                <div className="p-4 space-y-3 bg-green-50/10 flex-1">
                    {productionVersions.length > 0 ? productionVersions.map(v => (
                        <div key={v.id} className="bg-white border border-green-100 p-3 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-slate-800 text-sm">{v.id}</span>
                                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">ACTIVE</span>
                            </div>
                            <div className="flex items-center text-xs text-slate-500 mb-1">
                                <Clock size={12} className="mr-1"/> {v.date}
                            </div>
                            <div className="text-xs text-slate-600 line-clamp-2">{v.desc}</div>
                        </div>
                    )) : <div className="text-xs text-slate-400 text-center py-4">No active version</div>}
                </div>
            </div>

            {/* Staging Channel */}
            <div className="bg-white rounded-xl border border-blue-200 shadow-sm flex flex-col overflow-hidden">
                <div className="px-4 py-3 border-b border-blue-100 bg-blue-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-blue-800 text-sm flex items-center">
                        <FlaskConical size={16} className="mr-2"/> Staging Channel
                    </h3>
                    <span className="text-xs bg-white text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-bold shadow-sm">{stagingVersions.length}</span>
                </div>
                <div className="p-4 space-y-3 bg-blue-50/10 flex-1">
                    {stagingVersions.length > 0 ? stagingVersions.map(v => (
                        <div key={v.id} className="bg-white border border-blue-100 p-3 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-slate-800 text-sm">{v.id}</span>
                                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">TESTING</span>
                            </div>
                            <div className="flex items-center text-xs text-slate-500 mb-1">
                                <Clock size={12} className="mr-1"/> {v.date}
                            </div>
                            <div className="text-xs text-slate-600 line-clamp-2">{v.desc}</div>
                        </div>
                    )) : <div className="text-xs text-slate-400 text-center py-4">No staging version</div>}
                </div>
            </div>

            {/* History Channel */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700 text-sm flex items-center">
                        <History size={16} className="mr-2"/> Version History
                    </h3>
                    <span className="text-xs bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-bold shadow-sm">{historyVersions.length}</span>
                </div>
                <div className="p-4 space-y-3 bg-slate-50/30 flex-1">
                    {historyVersions.length > 0 ? historyVersions.map(v => (
                        <div key={v.id} className="bg-white border border-slate-200 p-3 rounded-lg hover:border-slate-300 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-medium text-slate-600 text-sm">{v.id}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${v.status === 'deprecated' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {v.status.toUpperCase()}
                                </span>
                            </div>
                            <div className="flex items-center text-xs text-slate-400">
                                <Clock size={12} className="mr-1"/> {v.date}
                            </div>
                        </div>
                    )) : <div className="text-xs text-slate-400 text-center py-4">No history</div>}
                </div>
            </div>

        </div>

        {/* Version Overview Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           {/* Header & Stats Cards */}
           <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center">
                 <ListFilter size={18} className="mr-2 text-slate-500"/>
                 版本列表总览 (Overview)
              </h3>
              <button className="text-xs text-blue-600 font-medium hover:underline">查看全部历史</button>
           </div>

           {/* Table */}
           <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                 <tr>
                    <th className="px-6 py-3">Version ID</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">QA Score</th>
                    <th className="px-6 py-3">Commits</th>
                    <th className="px-6 py-3">Pipelines</th>
                    <th className="px-6 py-3">Last Update</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                 {timeline.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-3 font-mono font-medium text-slate-700">{v.id}</td>
                       <td className="px-6 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                             v.type === 'Release' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                             v.type === 'Hotfix' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                             'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>
                             {v.type}
                          </span>
                       </td>
                       <td className="px-6 py-3">
                          {getStatusBadge(v.status)}
                       </td>
                       <td className="px-6 py-3">
                          <div className="flex items-center">
                             <div className={`text-sm font-bold ${
                                v.qaScore >= 95 ? 'text-green-600' : 
                                v.qaScore >= 90 ? 'text-blue-600' : 'text-amber-600'
                             }`}>
                                {v.qaScore}
                             </div>
                             <span className="text-[10px] text-slate-400 ml-1">/100</span>
                          </div>
                       </td>
                       <td className="px-6 py-3 text-slate-700 font-mono text-xs">
                          {v.commits} changes
                       </td>
                       <td className="px-6 py-3">
                          <div className="flex -space-x-1 overflow-hidden">
                             {v.pipelines.slice(0, 3).map((pipe, i) => (
                                <div key={i} className="inline-block px-2 py-0.5 text-[10px] font-bold text-white bg-slate-400 rounded-full border border-white" title={pipe}>
                                   {pipe.charAt(0).toUpperCase()}
                                </div>
                             ))}
                             {v.pipelines.length > 3 && (
                                <div className="inline-block px-1.5 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-100 rounded-full border border-white">
                                   +{v.pipelines.length - 3}
                                </div>
                             )}
                          </div>
                       </td>
                       <td className="px-6 py-3 text-slate-500 font-mono text-xs">{v.date}</td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>

        {/* Evolution Timeline */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
           <h3 className="text-lg font-bold text-slate-800 mb-8 flex items-center">
              <GitCommit size={20} className="mr-2 text-slate-400"/>
              时空演进时间轴
           </h3>
           
           <div className="relative pl-4 space-y-12 before:absolute before:top-2 before:bottom-2 before:left-[27px] before:w-0.5 before:bg-slate-200">
              {timeline.map((node, idx) => {
                 const isSelected = selectedNodeId === node.id;
                 return (
                 <div key={node.id} className="relative pl-10 group">
                    {/* Node Dot */}
                    <div className={`absolute left-[19px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 transition-all duration-300 
                       ${node.status === 'online' ? 'bg-green-500 ring-4 ring-green-100' : 
                         node.status === 'staging' ? 'bg-blue-500 ring-4 ring-blue-100' : 
                         node.type === 'Hotfix' ? 'bg-rose-500' : 'bg-slate-300'}
                       ${isSelected ? 'scale-125 ring-offset-2' : 'group-hover:scale-125'}
                    `}></div>

                    <div 
                        onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                        className={`flex flex-col rounded-lg border transition-all cursor-pointer overflow-hidden ${
                            isSelected 
                            ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500' 
                            : 'bg-slate-50 border-slate-200 hover:border-blue-300 hover:shadow-md'
                        }`}
                    >
                       {/* Summary Row */}
                       <div className="p-4 flex items-start justify-between">
                           <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                 <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                                    node.type === 'Release' ? 'bg-green-100 text-green-700' :
                                    node.type === 'Hotfix' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'
                                 }`}>
                                    {node.type}
                                 </span>
                                 <span className="font-bold text-slate-900 font-mono">{node.id}</span>
                                 
                                 {/* Timeline Status Badges */}
                                 {node.status === 'online' && (
                                    <span className="text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded ml-2 flex items-center shadow-sm">
                                        <CheckCircle2 size={10} className="mr-1"/> LIVE
                                    </span>
                                 )}
                                 {node.status === 'staging' && (
                                    <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded ml-2 flex items-center shadow-sm">
                                        <FlaskConical size={10} className="mr-1"/> STAGING
                                    </span>
                                 )}
                                 {node.status === 'deprecated' && (
                                    <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded ml-2 flex items-center shadow-sm">
                                        <Ban size={10} className="mr-1"/> DEPRECATED
                                    </span>
                                 )}
                                 {node.status === 'archived' && (
                                    <span className="text-[10px] bg-slate-500 text-white px-1.5 py-0.5 rounded ml-2 flex items-center shadow-sm">
                                        <Archive size={10} className="mr-1"/> ARCHIVED
                                    </span>
                                 )}
                              </div>
                              <p className="text-sm text-slate-600">{node.desc}</p>
                           </div>
                           <div className="text-right pl-6">
                              <div className="flex items-center text-xs text-slate-500 justify-end mb-1">
                                 <Clock size={12} className="mr-1"/> {node.date}
                              </div>
                              <div className="text-xs text-slate-400">by {node.author}</div>
                           </div>
                       </div>

                       {/* Expanded Details */}
                       {isSelected && (
                           <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 fade-in duration-200">
                                <div className="border-t border-slate-100 pt-4 mt-2 grid grid-cols-3 gap-4">
                                    <div className="p-3 bg-slate-50 rounded border border-slate-100">
                                        <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Code Changes</div>
                                        <div className="flex items-center text-sm font-bold text-slate-700">
                                            <FileCode size={14} className="mr-2 text-blue-500"/>
                                            +{node.commits} commits
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded border border-slate-100">
                                        <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Affected Pipelines</div>
                                        <div className="flex items-center text-sm font-bold text-slate-700">
                                            <Box size={14} className="mr-2 text-purple-500"/>
                                            {node.pipelines.length} pipelines
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded border border-slate-100">
                                        <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">QA Score</div>
                                        <div className="flex items-center text-sm font-bold text-emerald-600">
                                            <CheckCircle2 size={14} className="mr-2"/>
                                            {node.qaScore}/100
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button className="text-xs text-blue-600 font-bold hover:underline flex items-center bg-blue-50 px-3 py-1.5 rounded-full transition-colors hover:bg-blue-100">
                                        查看完整变更日志 <ArrowRight size={12} className="ml-1"/>
                                    </button>
                                </div>
                           </div>
                       )}
                    </div>
                 </div>
              )})}
           </div>
        </div>

      </div>
    </div>
  );
};

export default VersionDashboard;
