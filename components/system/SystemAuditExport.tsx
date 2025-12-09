
import React, { useState } from 'react';
import { Fingerprint, Eye, FileUp, ShieldCheck, UserCheck, AlertOctagon, Download } from 'lucide-react';

const SystemAuditExport: React.FC = () => {
  const [watermark, setWatermark] = useState(true);
  const [approvalThreshold, setApprovalThreshold] = useState(1000);

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50 animate-in fade-in">
       <div className="max-w-2xl mx-auto space-y-8">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
             <Fingerprint className="mr-3 text-blue-600" />
             水印与导出审计 (Audit & Watermark)
          </h1>

          {/* Watermark Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
             <div className="flex justify-between items-center mb-6 relative z-10">
                <div>
                   <h3 className="text-lg font-bold text-slate-800">屏幕防泄密水印</h3>
                   <div className="text-xs text-slate-500 mt-1">强制开启作业台明/暗水印 (显示操作员 ID)</div>
                </div>
                <button 
                   onClick={() => setWatermark(!watermark)}
                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${watermark ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                   <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${watermark ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
             </div>
             
             {/* Watermark Preview */}
             <div className="h-48 bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden flex items-center justify-center group select-none transition-colors duration-500">
                <span className="text-slate-400 text-sm font-medium flex items-center z-10 bg-white/80 backdrop-blur px-3 py-1 rounded shadow-sm border border-slate-100">
                    <Eye size={16} className="mr-2"/> 效果预览区域
                </span>
                {watermark && (
                   <div className="absolute inset-0 pointer-events-none flex flex-wrap content-start p-4 opacity-15 overflow-hidden">
                      {Array.from({length: 24}).map((_, i) => (
                         <div key={i} className="w-1/4 h-1/4 flex items-center justify-center transform -rotate-12 text-sm font-bold text-slate-900">
                            User_89757
                         </div>
                      ))}
                   </div>
                )}
                {!watermark && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50 backdrop-blur-[1px]">
                        <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-400 shadow-sm">
                            Watermark Off
                        </div>
                    </div>
                )}
             </div>
          </div>

          {/* Export Approval Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
             <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                <FileUp size={20} className="mr-2 text-indigo-500" />
                导出审批流 (Export Workflow)
             </h3>
             <div className="p-8 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-8">
                   <div className="text-center w-1/3 relative">
                       <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-500 shadow-sm">
                           <FileUp size={18} />
                       </div>
                       <span className="text-xs font-bold text-slate-600">发起导出</span>
                       <div className="absolute top-5 left-[60%] w-[80%] h-0.5 bg-slate-300 -z-10"></div>
                   </div>
                   
                   <div className="text-center w-1/3 relative">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm border-2 z-10 relative bg-white ${approvalThreshold < 5000 ? 'border-indigo-500 text-indigo-600' : 'border-slate-200 text-slate-400'}`}>
                           <UserCheck size={20} />
                       </div>
                       <span className={`text-xs font-bold ${approvalThreshold < 5000 ? 'text-indigo-600' : 'text-slate-400'}`}>主管审批</span>
                       {approvalThreshold < 5000 && (
                           <div className="absolute -top-2 right-0 bg-indigo-600 text-white text-[9px] px-1.5 rounded-full">Required</div>
                       )}
                       <div className="absolute top-5 left-[60%] w-[80%] h-0.5 bg-slate-300 -z-10"></div>
                   </div>

                   <div className="text-center w-1/3">
                       <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-500 shadow-sm">
                           <Download size={18} />
                       </div>
                       <span className="text-xs font-bold text-slate-600">下载文件</span>
                   </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-inner">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                        <span className="text-sm text-slate-700 font-medium">单次导出超过</span>
                        <div className="relative group">
                            <input 
                                type="number" 
                                value={approvalThreshold}
                                onChange={(e) => setApprovalThreshold(parseInt(e.target.value))}
                                className="w-32 px-3 py-2 border border-slate-300 rounded-lg text-xl font-bold text-center focus:border-indigo-500 outline-none text-indigo-600 shadow-sm group-hover:border-indigo-300 transition-colors" 
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">条</span>
                        </div>
                        <span className="text-sm text-slate-700 font-medium">需触发审批流</span>
                    </div>
                    
                    <div className="px-6">
                        <input 
                            type="range" 
                            min="0" 
                            max="5000" 
                            step="100" 
                            value={approvalThreshold}
                            onChange={(e) => setApprovalThreshold(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono uppercase tracking-wider">
                            <span>0 (Strict Audit)</span>
                            <span>5000 (Relaxed)</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-center text-xs bg-white p-2 rounded border border-slate-100 shadow-sm w-fit mx-auto">
                    {approvalThreshold >= 5000 ? (
                        <span className="flex items-center text-slate-500"><AlertOctagon size={14} className="mr-2"/> 当前策略：宽松模式 (仅记录日志)</span>
                    ) : approvalThreshold <= 100 ? (
                        <span className="flex items-center text-rose-600"><ShieldCheck size={14} className="mr-2"/> 当前策略：严格风控模式</span>
                    ) : (
                        <span className="flex items-center text-indigo-600"><ShieldCheck size={14} className="mr-2"/> 当前策略：标准合规模式</span>
                    )}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default SystemAuditExport;
