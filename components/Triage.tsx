
import React from 'react';
import { FileText, FileImage, Smartphone, ArrowRight, Server, FileDigit } from 'lucide-react';
import { INGESTION_LOGS } from '../constants';

const Triage: React.FC = () => {
  return (
    <div className="flex-1 p-8 bg-slate-50 overflow-y-auto">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">数据分流中心</h1>
          <p className="text-slate-500">监控原始数据接入与 AI 路由决策。</p>
        </div>
        <div className="flex items-center space-x-2">
           <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-slate-700">路由运行中</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-180px)]">
        
        {/* Left: Input Queue */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">实时接入流</h3>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Live</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
             {INGESTION_LOGS.map((log) => (
               <div key={log.id} className="flex items-center p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all">
                 <div className="w-10 h-10 rounded bg-indigo-50 flex items-center justify-center text-indigo-600 mr-4">
                    {log.source.includes('.pdf') ? <FileText size={20} /> : 
                     log.source.includes('.tiff') ? <FileImage size={20} /> :
                     <Smartphone size={20} />}
                 </div>
                 <div className="flex-1">
                   <h4 className="text-sm font-medium text-slate-900">{log.source}</h4>
                   <p className="text-xs text-slate-500">接收时间 {log.time}</p>
                 </div>
                 <div className="text-right">
                    <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">待处理</span>
                 </div>
               </div>
             ))}
             {/* Fake historical items */}
             {[1,2,3,4,5].map(i => (
                <div key={`fake-${i}`} className="flex items-center p-3 opacity-60">
                 <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-400 mr-4">
                    <FileDigit size={20} />
                 </div>
                 <div className="flex-1">
                   <h4 className="text-sm font-medium text-slate-900">Archive_Batch_00{i}.zip</h4>
                   <p className="text-xs text-slate-500">已处理 (1小时前)</p>
                 </div>
                 <div className="text-right">
                    <span className="text-xs text-green-600 font-medium">完成</span>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Right: AI Router Visualization */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg flex flex-col relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"></div>
           <div className="p-4 border-b border-slate-800 flex justify-between items-center z-10 bg-slate-900">
            <h3 className="font-semibold text-white">AI 神经路由网络</h3>
            <Server className="text-slate-500" size={18} />
          </div>
          
          <div className="flex-1 flex flex-col justify-center px-8 relative">
             {/* Background tech lines */}
             <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none"></div>

             <div className="space-y-8 relative z-10">
                {INGESTION_LOGS.slice(0, 3).map((log, idx) => (
                   <div key={log.id} className="flex items-center animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
                      <div className="w-1/3 text-slate-300 text-xs truncate text-right pr-4 font-mono">
                        {log.source}
                      </div>
                      
                      <div className="w-1/3 flex items-center justify-center relative">
                         {/* Connection Line */}
                         <div className="absolute h-px bg-slate-700 w-full top-1/2 -z-10"></div>
                         {/* AI Process Node */}
                         <div className="w-8 h-8 rounded-full bg-blue-900 border border-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                         </div>
                      </div>

                      <div className="w-1/3 pl-4">
                         <div className="flex items-center text-green-400 text-xs font-mono mb-1">
                            <ArrowRight size={12} className="mr-1" />
                            {log.action}
                         </div>
                         <div className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 inline-block">
                            {log.target}
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Triage;
