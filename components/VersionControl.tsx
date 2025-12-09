
import React from 'react';
import { GitBranch, GitCommit, User, Clock, CheckCircle2, RotateCcw, UploadCloud } from 'lucide-react';
import { VERSIONS } from '../constants';

const VersionControl: React.FC = () => {
  return (
    <div className="flex-1 p-8 bg-slate-50 overflow-y-auto">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">数据版本管理</h1>
          <p className="text-slate-500">管理数据快照、回滚与发布记录。</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm text-sm font-medium">
          <UploadCloud size={16} className="mr-2" />
          创建快照
        </button>
      </header>

      <div className="relative pl-8 border-l-2 border-slate-200 space-y-12">
        {VERSIONS.map((version, index) => (
          <div key={version.id} className="relative">
            {/* Timeline Dot */}
            <div className={`absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 border-slate-50 ${
              index === 0 ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-300'
            }`}></div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                   <div className="flex items-center space-x-3 mb-2">
                     <span className="text-lg font-bold text-slate-900">{version.id}</span>
                     <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                       version.status === 'Live' ? 'bg-green-100 text-green-700' :
                       version.status === 'Ready' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                     }`}>
                       {version.status}
                     </span>
                   </div>
                   <p className="text-slate-700 font-medium">{version.message}</p>
                </div>
                {index > 0 && (
                   <button className="flex items-center text-slate-500 hover:text-slate-800 text-sm font-medium px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50">
                     <RotateCcw size={14} className="mr-2" />
                     回滚
                   </button>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-4">
                <div className="flex space-x-6 text-sm text-slate-500">
                   <div className="flex items-center">
                     <User size={14} className="mr-2" /> {version.author}
                   </div>
                   <div className="flex items-center">
                     <Clock size={14} className="mr-2" /> {version.date}
                   </div>
                   <div className="flex items-center">
                     <GitCommit size={14} className="mr-2" /> {Math.random().toString(16).substring(2, 8)}
                   </div>
                </div>
                
                <div className="flex items-center">
                   <span className="text-xs font-bold text-slate-400 uppercase mr-2">QA 得分</span>
                   <div className="flex items-center text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">
                     <CheckCircle2 size={14} className="mr-1" />
                     {version.qaScore}%
                   </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VersionControl;
