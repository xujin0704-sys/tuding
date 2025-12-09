
import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  RefreshCcw, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Map as MapIcon, 
  Play, 
  X,
  Clock,
  User,
  ArrowRight,
  Maximize2,
  Pause,
  SkipBack,
  SkipForward
} from 'lucide-react';

const LOGS = [
  { 
    id: 'L-24010158', 
    time: '2025-01-15 10:42:15', 
    user: '王强 (Worker)', 
    module: '路网作业台', 
    action: 'Modify Geometry', 
    target: 'Road_Link_9921',
    ip: '192.168.1.10', 
    status: 'Success', 
    detail: '调整了道路节点的几何位置，使其与卫星影像对齐。',
    hasReplay: true,
    changes: {
        attributes: [
            { field: 'Lane Count', old: '2', new: '3' },
            { field: 'Surface', old: 'Asphalt', new: 'Asphalt' },
            { field: 'Speed Limit', old: '40', new: '60' }
        ]
    }
  },
  { 
    id: 'L-24010157', 
    time: '2025-01-15 10:40:22', 
    user: '李娜 (QA)', 
    module: '质检中心', 
    action: 'Reject Task', 
    target: 'Task_POI_7782',
    ip: '192.168.1.105', 
    status: 'Success', 
    detail: '驳回 POI 新增任务，原因为名称不规范。',
    hasReplay: false,
    changes: {
        attributes: [
            { field: 'Status', old: 'Pending', new: 'Rejected' },
            { field: 'QA Comment', old: '', new: 'Name mismatch with signboard' }
        ]
    }
  },
  { 
    id: 'L-24010156', 
    time: '2025-01-15 10:38:05', 
    user: 'System Bot', 
    module: '数据接入', 
    action: 'Auto Ingest', 
    target: 'Batch_Upload_001',
    ip: '127.0.0.1', 
    status: 'Failed', 
    detail: 'Upload failed: Connection timeout during S3 transfer.',
    hasReplay: false,
    changes: null
  },
  { 
    id: 'L-24010153', 
    time: '2025-01-15 10:25:48', 
    user: '王强 (Worker)', 
    module: '路网作业台', 
    action: 'Split Link', 
    target: 'Road_Link_8821',
    ip: '192.168.1.108', 
    status: 'Success', 
    detail: '在交叉口位置打断道路线要素。', 
    hasReplay: true,
    changes: {
        attributes: [
            { field: 'Topology', old: 'Single Line', new: 'Split into 2 segments' }
        ]
    }
  },
];

const SystemOpLog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [selectedLog, setSelectedLog] = useState<typeof LOGS[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  const filteredLogs = LOGS.filter(log => {
      const matchSearch = log.user.includes(searchTerm) || log.action.includes(searchTerm) || log.target.includes(searchTerm);
      const matchModule = filterModule === 'all' || log.module === filterModule;
      return matchSearch && matchModule;
  });

  const getStatusIcon = (status: string) => {
      if (status === 'Success') return <CheckCircle2 size={14} className="text-emerald-500" />;
      if (status === 'Failed') return <AlertCircle size={14} className="text-rose-500" />;
      return <Info size={14} className="text-blue-500" />;
  };

  const togglePlayback = () => {
      setIsPlaying(!isPlaying);
      if (!isPlaying) {
          // Simulate playback
          const interval = setInterval(() => {
              setPlaybackProgress(prev => {
                  if (prev >= 100) {
                      clearInterval(interval);
                      setIsPlaying(false);
                      return 100;
                  }
                  return prev + 1;
              });
          }, 50);
      }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden animate-in fade-in relative">
       {/* Main List Area */}
       <div className="flex-1 flex flex-col min-h-0">
           <div className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center shrink-0">
              <div>
                 <h1 className="text-xl font-bold text-slate-900 flex items-center">
                    <FileText className="mr-3 text-blue-600" />
                    操作审计 (Operation Audit)
                 </h1>
                 <p className="text-xs text-slate-500 mt-1">追踪业务操作记录与数据变更历史。</p>
              </div>
              <div className="flex space-x-3">
                 <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm text-sm font-medium transition-colors">
                    <Download size={16} className="mr-2" /> 导出 CSV
                 </button>
                 <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm text-sm font-medium transition-colors">
                    <RefreshCcw size={16} className="mr-2" /> 刷新
                 </button>
              </div>
           </div>

           <div className="p-6 bg-white border-b border-slate-200 flex space-x-4 items-center shrink-0">
              <div className="relative w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input 
                    type="text" 
                    placeholder="搜索用户、对象ID或动作..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
                 />
              </div>
              <div className="relative">
                 <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <select 
                    value={filterModule}
                    onChange={(e) => setFilterModule(e.target.value)}
                    className="pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                 >
                    <option value="all">所有模块</option>
                    <option value="路网作业台">路网作业台</option>
                    <option value="质检中心">质检中心</option>
                    <option value="数据接入">数据接入</option>
                 </select>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                       <tr>
                          <th className="px-6 py-4">时间</th>
                          <th className="px-6 py-4">操作用户</th>
                          <th className="px-6 py-4">模块</th>
                          <th className="px-6 py-4">动作类型</th>
                          <th className="px-6 py-4">对象 ID</th>
                          <th className="px-6 py-4">状态</th>
                          <th className="px-6 py-4 text-right">操作</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                       {filteredLogs.map(log => (
                          <tr 
                            key={log.id} 
                            onClick={() => {
                                setSelectedLog(log);
                                setPlaybackProgress(0);
                                setIsPlaying(false);
                            }}
                            className={`cursor-pointer transition-colors ${selectedLog?.id === log.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                          >
                             <td className="px-6 py-4 font-mono text-slate-500 text-xs">{log.time}</td>
                             <td className="px-6 py-4 font-bold text-slate-800">{log.user}</td>
                             <td className="px-6 py-4"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs border border-slate-200">{log.module}</span></td>
                             <td className="px-6 py-4 text-slate-700">{log.action}</td>
                             <td className="px-6 py-4 font-mono text-slate-500 text-xs">{log.target}</td>
                             <td className="px-6 py-4">
                                <div className="flex items-center space-x-1.5">
                                   {getStatusIcon(log.status)}
                                   <span className={`text-xs font-medium ${
                                      log.status === 'Success' ? 'text-emerald-700' : 'text-rose-700'
                                   }`}>{log.status}</span>
                                </div>
                             </td>
                             <td className="px-6 py-4 text-right">
                                {log.hasReplay ? (
                                    <button className="text-blue-600 hover:bg-blue-100 p-1.5 rounded flex items-center ml-auto transition-colors" title="查看回放">
                                        <Play size={12} className="mr-1"/> 回放
                                    </button>
                                ) : (
                                    <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded flex items-center ml-auto transition-colors" title="查看详情">
                                        <Info size={14} />
                                    </button>
                                )}
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
                 {filteredLogs.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-sm">
                       暂无相关日志记录
                    </div>
                 )}
              </div>
           </div>
       </div>

       {/* Detail Drawer */}
       {selectedLog && (
           <div className="w-[480px] bg-white border-l border-slate-200 shadow-2xl absolute right-0 top-0 bottom-0 z-20 flex flex-col animate-in slide-in-from-right duration-300">
               <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                   <h3 className="font-bold text-slate-800 text-sm flex items-center">
                       {selectedLog.hasReplay ? <MapIcon size={16} className="mr-2 text-blue-600"/> : <Info size={16} className="mr-2 text-slate-500"/>}
                       日志详情 (Detail)
                   </h3>
                   <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200">
                       <X size={18} />
                   </button>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-6">
                   {/* Basic Info */}
                   <div className="space-y-3">
                       <div className="flex justify-between text-sm">
                           <span className="text-slate-500">Log ID</span>
                           <span className="font-mono font-medium text-slate-700">{selectedLog.id}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                           <span className="text-slate-500">User</span>
                           <span className="font-medium text-slate-800">{selectedLog.user}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                           <span className="text-slate-500">Action</span>
                           <span className="font-medium text-blue-600">{selectedLog.action}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                           <span className="text-slate-500">Target Object</span>
                           <span className="font-mono bg-slate-100 px-1.5 rounded text-slate-600">{selectedLog.target}</span>
                       </div>
                       <div className="pt-2 border-t border-slate-100">
                           <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-3 rounded border border-slate-100 leading-relaxed">
                               <span className="font-bold text-slate-700 block mb-1">Details:</span>
                               {selectedLog.detail}
                           </p>
                       </div>
                   </div>

                   {/* Map Replay Player */}
                   {selectedLog.hasReplay && (
                       <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                           <div className="h-48 bg-slate-100 relative">
                               {/* Mock Map Background */}
                               <div className="absolute inset-0 opacity-40 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/116.4074,39.9042,15,0/480x300?access_token=pk.xxx')] bg-cover"></div>
                               
                               {/* Animated Element */}
                               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                   <div 
                                     className="w-32 h-1 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all duration-100"
                                     style={{ 
                                         transform: `rotate(${playbackProgress * 0.45}deg) scale(${1 + playbackProgress/200})` 
                                     }}
                                   ></div>
                                   {playbackProgress > 0 && (
                                       <div 
                                         className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full"
                                         style={{ left: `${playbackProgress}%` }}
                                       ></div>
                                   )}
                               </div>

                               <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 font-mono bg-white/80 px-2 py-0.5 rounded">
                                   Replay Mode
                               </div>
                           </div>
                           
                           {/* Controls */}
                           <div className="p-3 bg-white border-t border-slate-200">
                               <div className="flex items-center justify-between mb-2">
                                   <div className="flex space-x-2">
                                       <button className="text-slate-400 hover:text-slate-600"><SkipBack size={14}/></button>
                                       <button onClick={togglePlayback} className="text-blue-600 hover:text-blue-700">
                                           {isPlaying ? <Pause size={14}/> : <Play size={14}/>}
                                       </button>
                                       <button className="text-slate-400 hover:text-slate-600"><SkipForward size={14}/></button>
                                   </div>
                                   <span className="text-[10px] text-slate-400 font-mono">00:0{Math.floor(playbackProgress/20)} / 00:05</span>
                               </div>
                               <div className="w-full bg-slate-100 rounded-full h-1.5 cursor-pointer">
                                   <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-75" style={{ width: `${playbackProgress}%` }}></div>
                               </div>
                           </div>
                       </div>
                   )}

                   {/* Attribute Diff */}
                   {selectedLog.changes && (
                       <div>
                           <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center">
                               <Maximize2 size={12} className="mr-1.5"/> 属性变更 (Attribute Diff)
                           </h4>
                           <div className="border border-slate-200 rounded-lg overflow-hidden">
                               <table className="w-full text-xs text-left">
                                   <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                       <tr>
                                           <th className="px-3 py-2 w-1/3">Field</th>
                                           <th className="px-3 py-2 w-1/3 border-l border-slate-200">Before</th>
                                           <th className="px-3 py-2 w-1/3 border-l border-slate-200">After</th>
                                       </tr>
                                   </thead>
                                   <tbody className="divide-y divide-slate-100">
                                       {selectedLog.changes.attributes.map((change, idx) => (
                                           <tr key={idx} className="hover:bg-slate-50">
                                               <td className="px-3 py-2 font-medium text-slate-700">{change.field}</td>
                                               <td className="px-3 py-2 text-rose-600 bg-rose-50/30 border-l border-slate-100 line-through decoration-rose-300 decoration-2">
                                                   {change.old || <span className="text-slate-300 italic">null</span>}
                                               </td>
                                               <td className="px-3 py-2 text-emerald-600 bg-emerald-50/30 border-l border-slate-100 font-medium">
                                                   {change.new}
                                               </td>
                                           </tr>
                                       ))}
                                   </tbody>
                               </table>
                           </div>
                       </div>
                   )}
               </div>
           </div>
       )}
    </div>
  );
};

export default SystemOpLog;
