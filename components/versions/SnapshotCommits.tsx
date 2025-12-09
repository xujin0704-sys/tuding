
import React, { useState } from 'react';
import { 
  GitCommit, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Map as MapIcon, 
  ArrowRight,
  Maximize2
} from 'lucide-react';

const COMMITS = [
  { id: 'c82a1b9', msg: 'Update road network in Haidian North', author: 'Li Si', time: '10:42 AM', stats: { add: 120, mod: 45, del: 2 } },
  { id: 'b71x9z2', msg: 'Fix POI name encoding issue', author: 'Auto Bot', time: '09:15 AM', stats: { add: 0, mod: 1500, del: 0 } },
  { id: 'a55f3c1', msg: 'Merge feature/olympic into main', author: 'Zhang San', time: 'Yesterday', stats: { add: 540, mod: 120, del: 50 } },
];

const SnapshotCommits: React.FC = () => {
  const [selectedCommit, setSelectedCommit] = useState(COMMITS[0]);

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden animate-in fade-in">
       {/* Left Sidebar: Commits List */}
       <div className="w-96 bg-white border-r border-slate-200 flex flex-col z-10">
          <div className="p-4 border-b border-slate-100">
             <h2 className="text-lg font-bold text-slate-900 mb-1">快照库 (Snapshots)</h2>
             <p className="text-xs text-slate-500">原子化变更记录仓库</p>
             
             <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input type="text" placeholder="搜索 Commit ID 或信息..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
             {COMMITS.map(commit => (
                <div 
                   key={commit.id}
                   onClick={() => setSelectedCommit(commit)}
                   className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${selectedCommit.id === commit.id ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}
                >
                   <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{commit.id}</span>
                      <span className="text-[10px] text-slate-400">{commit.time}</span>
                   </div>
                   <h4 className="text-sm font-bold text-slate-800 mb-2 line-clamp-2">{commit.msg}</h4>
                   <div className="flex justify-between items-center text-xs text-slate-500">
                      <div className="flex items-center">
                         <User size={12} className="mr-1" /> {commit.author}
                      </div>
                      <div className="flex space-x-2 font-mono text-[10px]">
                         <span className="text-green-600">+{commit.stats.add}</span>
                         <span className="text-amber-600">~{commit.stats.mod}</span>
                         <span className="text-rose-600">-{commit.stats.del}</span>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* Right: Commit Details & Visual Diff */}
       <div className="flex-1 flex flex-col overflow-hidden bg-slate-100">
          <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
             <div className="flex items-center space-x-2 text-sm text-slate-600">
                <GitCommit size={16} />
                <span className="font-bold">{selectedCommit.id}</span>
                <span className="text-slate-300">|</span>
                <span>提交详情</span>
             </div>
             <button className="text-xs text-blue-600 font-bold hover:underline">下载变更包 (Diff Patch)</button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
                <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                      <MapIcon size={14} className="mr-2"/>
                      Visual Diff (Before / After)
                   </h3>
                   <div className="flex space-x-2">
                      <span className="flex items-center text-[10px]"><div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div> Added</span>
                      <span className="flex items-center text-[10px]"><div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div> Removed</span>
                   </div>
                </div>
                
                <div className="flex-1 relative bg-slate-200">
                   {/* Mock Diff View */}
                   <div className="absolute inset-0 flex">
                      <div className="w-1/2 border-r border-white/50 relative overflow-hidden bg-slate-300 grayscale">
                         <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-xs">Before</div>
                         <div className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/116.3,39.9,13,0/600x600?access_token=pk.xxx')] bg-cover opacity-50"></div>
                      </div>
                      <div className="w-1/2 relative overflow-hidden bg-slate-100">
                         <div className="absolute top-4 left-4 bg-blue-600 text-white px-2 py-1 rounded text-xs">After</div>
                         <div className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/116.3,39.9,13,0/600x600?access_token=pk.xxx')] bg-cover"></div>
                         {/* Diff Highlights */}
                         <div className="absolute top-1/3 left-1/4 w-20 h-1 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] transform rotate-12"></div>
                         <div className="absolute top-1/2 left-1/2 w-32 h-1 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                         <div className="absolute top-1/4 right-1/3 w-4 h-4 border-2 border-red-500 rounded-full animate-ping"></div>
                      </div>
                   </div>
                   
                   {/* Slider Handle Mock */}
                   <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white cursor-ew-resize hover:bg-blue-400 z-10 flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-slate-400">
                         <Maximize2 size={12} className="rotate-45"/>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default SnapshotCommits;
