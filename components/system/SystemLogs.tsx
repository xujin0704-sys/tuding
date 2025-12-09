
import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  Info,
  Map as MapIcon,
  Play
} from 'lucide-react';

const LOGS = [
  { id: 'L-24010158', time: '2025-01-15 10:42:15', user: 'admin', module: '角色权限', action: 'Update Role', ip: '192.168.1.10', status: 'Success', detail: 'Updated role [Worker] permissions.' },
  { id: 'L-24010157', time: '2025-01-15 10:40:22', user: 'zhangsan', module: '任务中心', action: 'Create Task', ip: '192.168.1.105', status: 'Success', detail: 'Created task [Road_HD_01].' },
  { id: 'L-24010156', time: '2025-01-15 10:38:05', user: 'lisi', module: '数据接入', action: 'Upload File', ip: '192.168.1.112', status: 'Failed', detail: 'Upload failed: Connection timeout.' },
  { id: 'L-24010155', time: '2025-01-15 10:35:11', user: 'admin', module: '系统配置', action: 'Modify Config', ip: '192.168.1.10', status: 'Success', detail: 'Changed global confidence threshold to 0.85.' },
  { id: 'L-24010154', time: '2025-01-15 10:30:00', user: 'system', module: '自动调度', action: 'Auto Assign', ip: 'localhost', status: 'Success', detail: 'Assigned 50 tasks to User [wangwu].' },
  { id: 'L-24010153', time: '2025-01-15 10:25:48', user: 'wangwu', module: '作业台', action: 'Submit Feature', ip: '192.168.1.108', status: 'Success', detail: 'Submitted feature ID 10023. (Has Map Replay)', hasReplay: true },
  { id: 'L-24010152', time: '2025-01-15 10:15:30', user: 'admin', module: '用户管理', action: 'Reset Password', ip: '192.168.1.10', status: 'Success', detail: 'Reset password for user [test_01].' },
];

const SystemLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('all');

  const filteredLogs = LOGS.filter(log => {
      const matchSearch = log.user.includes(searchTerm) || log.action.includes(searchTerm) || log.detail.includes(searchTerm);
      const matchModule = filterModule === 'all' || log.module === filterModule;
      return matchSearch && matchModule;
  });

  const getStatusIcon = (status: string) => {
      if (status === 'Success') return <CheckCircle2 size={14} className="text-emerald-500" />;
      if (status === 'Failed') return <AlertCircle size={14} className="text-rose-500" />;
      return <Info size={14} className="text-blue-500" />;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden animate-in fade-in">
       <div className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center shrink-0">
          <div>
             <h1 className="text-xl font-bold text-slate-900 flex items-center">
                <FileText className="mr-3 text-blue-600" />
                操作日志
             </h1>
             <p className="text-xs text-slate-500 mt-1">审计与追踪系统内的关键操作记录。</p>
          </div>
          <div className="flex space-x-3">
             <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm text-sm font-medium transition-colors">
                <Download size={16} className="mr-2" /> 导出日志
             </button>
             <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm text-sm font-medium transition-colors">
                <RefreshCcw size={16} className="mr-2" /> 刷新
             </button>
          </div>
       </div>

       <div className="p-6 bg-white border-b border-slate-200 flex space-x-4 items-center">
          <div className="relative w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input 
                type="text" 
                placeholder="搜索用户、动作或详情..." 
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
                <option value="角色权限">角色权限</option>
                <option value="任务中心">任务中心</option>
                <option value="数据接入">数据接入</option>
                <option value="系统配置">系统配置</option>
                <option value="作业台">作业台</option>
             </select>
          </div>
          <div className="relative">
             <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input type="date" className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-600" />
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
                      <th className="px-6 py-4">动作</th>
                      <th className="px-6 py-4">状态</th>
                      <th className="px-6 py-4">IP 地址</th>
                      <th className="px-6 py-4 w-1/3">详情</th>
                      <th className="px-6 py-4 text-right">操作</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                   {filteredLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                         <td className="px-6 py-4 font-mono text-slate-500 text-xs">{log.time}</td>
                         <td className="px-6 py-4 font-medium text-slate-800">{log.user}</td>
                         <td className="px-6 py-4">
                            <span className="inline-block bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs border border-slate-200">
                               {log.module}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-slate-700">{log.action}</td>
                         <td className="px-6 py-4">
                            <div className="flex items-center space-x-1.5">
                               {getStatusIcon(log.status)}
                               <span className={`text-xs font-medium ${
                                  log.status === 'Success' ? 'text-emerald-700' : 'text-rose-700'
                               }`}>{log.status}</span>
                            </div>
                         </td>
                         <td className="px-6 py-4 text-slate-500 font-mono text-xs">{log.ip}</td>
                         <td className="px-6 py-4 text-slate-600 text-xs truncate max-w-xs" title={log.detail}>
                            {log.detail}
                         </td>
                         <td className="px-6 py-4 text-right">
                            {(log as any).hasReplay && (
                                <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded flex items-center ml-auto transition-colors" title="地图操作回放">
                                    <MapIcon size={14} className="mr-1"/>
                                    <Play size={10} />
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
  );
};

export default SystemLogs;
