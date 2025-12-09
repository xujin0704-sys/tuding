
import React, { useState } from 'react';
import { Terminal, RefreshCcw, Search, Download, AlertTriangle, CheckCircle2, Info, XCircle, Filter } from 'lucide-react';

const SYS_LOGS = [
  { id: 1, time: '2025-01-15 10:46:12', level: 'ERROR', component: 'AI_Service', message: 'Model [Road_Ext_v2] inference timeout after 5000ms. GPU memory usage at 98%.', traceId: 'tr_8f7a9c' },
  { id: 2, time: '2025-01-15 10:46:15', level: 'INFO', component: 'AI_Service', message: 'Retry attempt 1/3 successful. Inference completed in 1200ms.', traceId: 'tr_8f7a9c' },
  { id: 3, time: '2025-01-15 10:45:05', level: 'WARN', component: 'DB_Pool', message: 'Connection pool usage high (85%). Waiting for available connection...', traceId: 'tr_1b2c3d' },
  { id: 4, time: '2025-01-15 10:45:00', level: 'INFO', component: 'Scheduler', message: 'Cron job [DataSync_Daily] started.', traceId: 'tr_sched_01' },
  { id: 5, time: '2025-01-15 10:50:00', level: 'INFO', component: 'Auth', message: 'User session expired for [u_102]. Redirecting to login.', traceId: 'tr_auth_99' },
  { id: 6, time: '2025-01-15 10:55:23', level: 'ERROR', component: 'Pipeline_Road', message: 'Failed to export geojson: Topology validation error at node [n_1120].', traceId: 'tr_pipe_55' },
];

const SystemSysLog: React.FC = () => {
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = SYS_LOGS.filter(log => {
      const matchLevel = filterLevel === 'ALL' || log.level === filterLevel;
      const matchSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.traceId.toLowerCase().includes(searchTerm.toLowerCase());
      return matchLevel && matchSearch;
  });

  const getLevelStyle = (level: string) => {
      switch (level) {
          case 'ERROR': return 'text-rose-500 font-bold';
          case 'WARN': return 'text-amber-500 font-bold';
          default: return 'text-blue-400 font-bold';
      }
  };

  const getLevelIcon = (level: string) => {
      switch (level) {
          case 'ERROR': return <XCircle size={14} className="text-rose-500 mr-2" />;
          case 'WARN': return <AlertTriangle size={14} className="text-amber-500 mr-2" />;
          default: return <Info size={14} className="text-blue-400 mr-2" />;
      }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 animate-in fade-in">
       {/* Header */}
       <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex justify-between items-center shrink-0">
          <div>
             <h1 className="text-lg font-bold text-white flex items-center font-mono">
                <Terminal className="mr-3 text-green-500" size={20} />
                系统日志 (System Logs)
             </h1>
             <p className="text-xs text-slate-500 mt-1">Backend service events, errors, and health checks.</p>
          </div>
          <div className="flex space-x-3">
             <button className="flex items-center px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white shadow-sm text-xs font-medium transition-colors">
                <Download size={14} className="mr-1.5" /> Export
             </button>
             <button className="flex items-center px-3 py-1.5 bg-blue-600 border border-blue-500 rounded-lg text-white hover:bg-blue-500 shadow-sm text-xs font-medium transition-colors">
                <RefreshCcw size={14} className="mr-1.5" /> Live Tail
             </button>
          </div>
       </div>

       {/* Toolbar */}
       <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center space-x-4">
           <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
               {['ALL', 'INFO', 'WARN', 'ERROR'].map(level => (
                   <button
                        key={level}
                        onClick={() => setFilterLevel(level)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                            filterLevel === level 
                            ? (level === 'ERROR' ? 'bg-rose-900/50 text-rose-400' : level === 'WARN' ? 'bg-amber-900/50 text-amber-400' : 'bg-slate-600 text-white')
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                   >
                       {level}
                   </button>
               ))}
           </div>
           
           <div className="h-4 w-px bg-slate-700"></div>

           <div className="relative flex-1 max-w-md">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
               <input 
                  type="text" 
                  placeholder="Search logs by message, component or trace ID..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
               />
           </div>
       </div>

       {/* Log Console */}
       <div className="flex-1 overflow-y-auto p-4 font-mono text-xs bg-slate-900 custom-scrollbar">
          <div className="space-y-1">
             {filteredLogs.map(log => (
                <div key={log.id} className="group flex items-start p-2 rounded hover:bg-slate-800 border border-transparent hover:border-slate-700/50 transition-all cursor-default">
                   <div className="flex items-center w-40 shrink-0 text-slate-500 mr-2 select-none">
                       {log.time.split(' ')[1]} <span className="mx-2 text-slate-700">|</span>
                   </div>
                   
                   <div className={`w-20 shrink-0 flex items-center ${getLevelStyle(log.level)}`}>
                       {getLevelIcon(log.level)}
                       {log.level}
                   </div>

                   <div className="w-32 shrink-0 text-purple-400 font-bold mr-4 truncate" title={log.component}>
                       [{log.component}]
                   </div>

                   <div className="flex-1 text-slate-300 break-all leading-relaxed">
                       {log.message}
                   </div>

                   <div className="w-24 shrink-0 text-right text-slate-600 text-[10px] select-all group-hover:text-slate-500">
                       {log.traceId}
                   </div>
                </div>
             ))}
             
             {filteredLogs.length === 0 && (
                 <div className="py-8 text-center text-slate-600 italic">
                     No logs found matching filter criteria.
                 </div>
             )}
             
             <div className="pl-2 pt-2 animate-pulse text-blue-500 font-bold">
                 _
             </div>
          </div>
       </div>
       
       <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
           <span>Displaying {filteredLogs.length} events</span>
           <span>Server Time: {new Date().toUTCString()}</span>
       </div>
    </div>
  );
};

export default SystemSysLog;
