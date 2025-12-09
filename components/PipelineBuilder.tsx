
import React, { useState } from 'react';
import { Settings, Play, Save, Plus, ArrowRight, CheckCircle2, AlertOctagon, Loader2, Sparkles, ScanLine } from 'lucide-react';

const PipelineBuilder: React.FC = () => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'success'>('idle');

  // 流程三：产线编排逻辑
  const handlePublish = () => {
    setIsPublishing(true);
    // Simulate hot-reload
    setTimeout(() => {
      setIsPublishing(false);
      setPublishStatus('success');
      setTimeout(() => setPublishStatus('idle'), 3000);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      
      {/* Header */}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shadow-sm shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center">
            流水线管理
            <span className="ml-3 text-xs font-normal text-slate-400 border border-slate-200 rounded px-2 py-0.5 bg-slate-50">基础资源 / 路网生产 v3</span>
          </h1>
        </div>
        <div className="flex space-x-3">
           <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm text-sm font-medium">
             <Settings size={16} className="mr-2" />
             配置
           </button>
           <button 
             onClick={handlePublish}
             disabled={isPublishing || publishStatus === 'success'}
             className={`flex items-center px-4 py-2 text-white rounded-lg shadow-sm text-sm font-medium transition-all ${
               publishStatus === 'success' ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
             }`}
           >
             {isPublishing ? <Loader2 size={16} className="mr-2 animate-spin" /> : 
              publishStatus === 'success' ? <CheckCircle2 size={16} className="mr-2" /> : 
              <Save size={16} className="mr-2" />}
             {isPublishing ? 'Worker 热加载中...' : 
              publishStatus === 'success' ? '发布成功' : '保存并发布'}
           </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden bg-slate-100 grid-pattern">
         
         {/* Toolbar */}
         <div className="absolute top-6 left-6 flex flex-col space-y-3">
            <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:bg-blue-50 transition-colors group">
              <div className="w-10 h-10 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 mb-1 group-hover:scale-110 transition-transform">
                <span className="font-bold text-xs">IN</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 text-center block">输入</span>
            </div>
            {/* New Foundation Model Node */}
            <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:bg-violet-50 transition-colors group">
              <div className="w-10 h-10 rounded bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white mb-1 group-hover:scale-110 transition-transform shadow-sm">
                <Sparkles size={18} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 text-center block">SAM Zero</span>
            </div>
            <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:bg-blue-50 transition-colors group">
              <div className="w-10 h-10 rounded bg-purple-100 flex items-center justify-center text-purple-600 mb-1 group-hover:scale-110 transition-transform">
                <span className="font-bold text-xs">AI</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 text-center block">传统模型</span>
            </div>
            <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:bg-blue-50 transition-colors group">
              <div className="w-10 h-10 rounded bg-orange-100 flex items-center justify-center text-orange-600 mb-1 group-hover:scale-110 transition-transform">
                <span className="font-bold text-xs">FX</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 text-center block">算法</span>
            </div>
         </div>

         {/* Graph Simulation */}
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center space-x-12 transform scale-100">
               
               {/* Node 1: Input */}
               <div className="w-64 bg-white rounded-xl shadow-lg border border-slate-200 relative group">
                  <div className="h-2 bg-indigo-500 rounded-t-xl"></div>
                  <div className="p-4">
                     <h4 className="font-bold text-slate-900 text-sm mb-1">数据源输入</h4>
                     <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                        Type: GeoJSON/Raster
                     </div>
                  </div>
                  {/* Connector Dot */}
                  <div className="absolute right-0 top-1/2 translate-x-1/2 w-4 h-4 bg-slate-300 rounded-full border-2 border-white z-10 hover:bg-blue-500 transition-colors"></div>
               </div>

               {/* Connection Line */}
               <div className="w-16 h-0.5 bg-slate-300 relative">
                  <div className="absolute right-0 -mt-1 text-slate-300"><ArrowRight size={12}/></div>
               </div>

               {/* Node 2: Zero-Shot Extract (New) */}
               <div className="w-64 bg-white rounded-xl shadow-lg border border-violet-200 relative ring-2 ring-violet-100">
                  <div className="h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-t-xl"></div>
                  <div className="p-4">
                     <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-slate-900 text-sm">SAM 零样本提取</h4>
                        <Sparkles size={14} className="text-fuchsia-500" />
                     </div>
                     <div className="space-y-2">
                        <div className="text-xs bg-violet-50 p-2 rounded border border-violet-100">
                           <span className="text-violet-700 font-bold block mb-1">Prompt:</span>
                           "Extract all blue roof tents"
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500">
                           <span>Model: SAM-Huge</span>
                           <span className="text-violet-600 font-medium">Confidence > 0.8</span>
                        </div>
                     </div>
                  </div>
                  <div className="absolute left-0 top-1/2 -translate-x-1/2 w-4 h-4 bg-violet-500 rounded-full border-2 border-white z-10"></div>
                  <div className="absolute right-0 top-1/2 translate-x-1/2 w-4 h-4 bg-slate-300 rounded-full border-2 border-white z-10 hover:bg-blue-500"></div>
               </div>

               {/* Connection Line */}
               <div className="w-16 h-0.5 bg-slate-300 relative">
                  <div className="absolute right-0 -mt-1 text-slate-300"><ArrowRight size={12}/></div>
               </div>

               {/* Node 3: SAM-Track (New Video Node Example) */}
               <div className="w-64 bg-white rounded-xl shadow-lg border border-slate-200 relative">
                  <div className="h-2 bg-blue-500 rounded-t-xl"></div>
                  <div className="p-4">
                     <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 text-sm mb-2">时空追踪 (SAM-Track)</h4>
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded">Video</span>
                     </div>
                     <div className="flex items-center text-xs text-slate-600 bg-slate-50 p-1.5 rounded mb-2">
                        <ScanLine size={12} className="mr-1"/> ID Consistency Check
                     </div>
                     <p className="text-[10px] text-slate-400">Context Window: 5 frames</p>
                  </div>
                  <div className="absolute left-0 top-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white z-10"></div>
                  <div className="absolute right-0 top-1/2 translate-x-1/2 w-4 h-4 bg-slate-300 rounded-full border-2 border-white z-10 hover:bg-blue-500"></div>
               </div>

               {/* Connection Line */}
               <div className="w-16 h-0.5 bg-slate-300 relative">
                  <div className="absolute right-0 -mt-1 text-slate-300"><ArrowRight size={12}/></div>
               </div>

               {/* Node 4: Output */}
               <div className="w-64 bg-white rounded-xl shadow-lg border border-slate-200 relative">
                  <div className="h-2 bg-emerald-500 rounded-t-xl"></div>
                  <div className="p-4">
                     <h4 className="font-bold text-slate-900 text-sm mb-1">生产库</h4>
                     <div className="text-xs text-slate-500 bg-emerald-50 text-emerald-700 p-2 rounded border border-emerald-100 font-medium">
                        Target: Temporary_Shelters
                     </div>
                  </div>
                  <div className="absolute left-0 top-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white z-10"></div>
               </div>

            </div>
         </div>
         
         {/* Floating Action Button */}
         <div className="absolute bottom-8 right-8">
            <button className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl hover:scale-105 transition-transform">
               <Plus size={24} />
            </button>
         </div>

      </div>
    </div>
  );
};

export default PipelineBuilder;
