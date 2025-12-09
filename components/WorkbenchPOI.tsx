import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bot, 
  Check, 
  X, 
  MousePointer2, 
  Merge,
  MapPin,
  Wrench,
  ChevronDown,
  Layers,
  AlertTriangle,
  Loader2,
  FileText,
  FileImage,
  Video,
  ArrowLeft
} from 'lucide-react';
import { TASKS, PIPELINES, SOURCE_FILES, MOCK_FEATURES } from '../constants';
import { PipelineType, Feature } from '../types';

interface WorkbenchPOIProps {
  currentPipeline: PipelineType; // Should be 'poi'
  selectedTaskId: number | null;
  onSelectTask: (taskId: number | null) => void;
  onPipelineChange: (pipeline: PipelineType) => void;
  onBack?: () => void;
}

const WorkbenchPOI: React.FC<WorkbenchPOIProps> = ({ currentPipeline, selectedTaskId, onSelectTask, onPipelineChange, onBack }) => {
  const [activeTab, setActiveTab] = useState<'attributes' | 'evidence'>('attributes');
  const [feature, setFeature] = useState<Feature | null>(null);
  const [isProcessingQA, setIsProcessingQA] = useState(false);
  const [qaError, setQaError] = useState<string | null>(null);
  
  const pipelineConfig = PIPELINES.find(p => p.id === 'poi');
  const visibleTasks = TASKS.filter(t => t.type === 'poi');
  const selectedTask = visibleTasks.find(t => t.id === selectedTaskId);
  
  const linkedSource = selectedTask && selectedTask.sourceId 
    ? SOURCE_FILES.find(f => f.id === selectedTask.sourceId) 
    : null;

  useEffect(() => {
    if (selectedTaskId && MOCK_FEATURES[selectedTaskId]) {
      setFeature(MOCK_FEATURES[selectedTaskId][0]); 
      setQaError(null);
    } else {
      setFeature(null);
    }
  }, [selectedTaskId]);

  const handleFeatureAction = (action: 'accept' | 'reject') => {
    if (!feature) return;

    if (action === 'accept') {
      setIsProcessingQA(true);
      setTimeout(() => {
        setIsProcessingQA(false);
        setFeature(prev => prev ? ({ ...prev, status: 'validated', aiConfidence: 1.0 }) : null);
        setQaError(null);
      }, 800);
    } else {
      setFeature(prev => prev ? ({ ...prev, status: 'rejected' }) : null);
      onSelectTask(null); 
    }
  };

  const handlePropertyChange = (key: string, value: string) => {
    setFeature(prev => prev ? ({ 
      ...prev, 
      properties: { ...prev.properties, [key]: value },
      status: 'human_reviewing'
    }) : null);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      
      {/* POI Toolbar */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shadow-[0_2px_8px_rgba(0,0,0,0.02)] shrink-0">
        <div className="flex items-center space-x-4">
           {/* Back Button */}
           {onBack && selectedTaskId && (
               <button 
                 onClick={onBack} 
                 className="mr-2 p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group"
                 title="返回任务列表"
               >
                 <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
               </button>
           )}

           <div className="relative group">
             <button className="flex items-center space-x-2 font-bold text-gray-700 hover:text-blue-600 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
               <Layers size={16} className="text-blue-500" />
               <span className="text-sm">{pipelineConfig?.name}</span>
               <ChevronDown size={14} className="text-gray-400" />
             </button>
             <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="py-1">
                  {PIPELINES.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => onPipelineChange(p.id as PipelineType)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${p.id === 'poi' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
             </div>
           </div>
           
           <div className="h-5 w-px bg-gray-200 mx-2"></div>
           
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
             <input 
               type="text" 
               placeholder="搜索 POI 名称或品牌..." 
               className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 w-56 focus:outline-none focus:bg-white transition-all"
             />
           </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-2">
            今日入库: <span className="text-gray-800">1,240</span>
          </span>
          <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
             <div className="h-full bg-blue-500 w-[75%]"></div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Map Area */}
        <div className="flex-1 relative bg-[#eef0f3] overflow-hidden group">
          <div className="absolute inset-0 opacity-100" style={{ 
              backgroundColor: '#f2efe9', 
              backgroundImage: `
                linear-gradient(#e5e7eb 1px, transparent 1px),
                linear-gradient(90deg, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px'
          }}>
             <div className="absolute top-1/2 left-1/2 w-full h-32 bg-[#aad3df] -rotate-12 transform -translate-y-20 border-t border-b border-[#9ec7d3]"></div>
          </div>
          
          <div className="absolute bottom-1 right-1 bg-white/80 px-1.5 py-0.5 text-[10px] text-gray-500 pointer-events-none z-10">
             © OpenStreetMap contributors
          </div>

          <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
            <button className="p-2 bg-white rounded-lg shadow-md border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">
              <MousePointer2 size={18} />
            </button>
            <button className="p-2 bg-white rounded-lg shadow-md border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">
              <span className="font-bold text-sm">+</span>
            </button>
            <button className="p-2 bg-white rounded-lg shadow-md border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">
              <span className="font-bold text-sm">-</span>
            </button>
          </div>

          <div className="absolute inset-0">
             {visibleTasks.map(task => {
               const isSelected = selectedTaskId === task.id;
               return (
                 <div
                   key={task.id}
                   onClick={(e) => {
                     e.stopPropagation();
                     onSelectTask(task.id);
                   }}
                   className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20`}
                   style={{ left: `${task.coords.x}%`, top: `${task.coords.y}%` }}
                 >
                   {isSelected && (
                     <div className="absolute inset-0 -m-4 border-2 border-blue-500 rounded-full opacity-100 animate-ping"></div>
                   )}
                   <div className={`relative w-4 h-4 rounded-full border-2 border-white ${task.status === 'review' ? 'bg-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.2)]' : 'bg-blue-600'} ${isSelected ? 'scale-125' : 'hover:scale-110'}`}></div>
                   
                   <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white shadow-md border border-gray-200 text-gray-700 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                       {task.title}
                       <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
                   </div>
                 </div>
               );
             })}
          </div>
          
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur border border-gray-200 text-gray-600 text-[10px] font-mono shadow-sm px-2 py-1 rounded">
            lat: 39.9042 | lng: 116.4074 | z: 18 (POI Mode)
          </div>
        </div>

        {/* POI Context Panel */}
        <div className={`w-[400px] bg-white border-l border-gray-200 flex flex-col shadow-xl absolute right-0 top-0 bottom-0 z-30 transition-transform duration-300 ${selectedTaskId ? 'translate-x-0' : 'translate-x-full'}`}>
           
           {selectedTask && feature ? (
             <>
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                   <div className={`flex items-center space-x-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-100`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>POI 待审</span>
                  </div>
                  <button onClick={() => onSelectTask(null)} className="text-gray-400 hover:text-gray-600">
                     <X size={16} />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{selectedTask.title}</h3>
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700 mr-2">{(feature.aiConfidence * 100).toFixed(0)}% 置信度</span>
                  • <span className="ml-1">来源: {linkedSource?.name || '未知'}</span>
                </div>
              </div>

              <div className="flex border-b border-gray-200 px-5">
                <button onClick={() => setActiveTab('attributes')} className={`mr-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'attributes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>属性信息</button>
                <button onClick={() => setActiveTab('evidence')} className={`mr-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'evidence' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>溯源证据</button>
              </div>

              <div className="flex-1 overflow-y-auto bg-gray-50 p-5">
                {activeTab === 'attributes' && (
                  <div className="space-y-6">
                    <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center mb-2">
                         <Bot className="text-blue-600 mr-2" size={16} />
                         <span className="font-bold text-blue-900 text-xs uppercase tracking-wide">AI 识别理由</span>
                      </div>
                      <p className="text-sm text-gray-700">{selectedTask.reason}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">POI 专属工具</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all text-gray-600 text-xs font-medium shadow-sm">
                          <Merge size={16} className="mr-2" /> 多源合并
                        </button>
                        <button className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all text-gray-600 text-xs font-medium shadow-sm">
                          <MapPin size={16} className="mr-2" /> 坐标微调
                        </button>
                        <button className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all text-gray-600 text-xs font-medium shadow-sm col-span-2">
                          <Wrench size={16} className="mr-2" /> 品牌库匹配
                        </button>
                      </div>
                    </div>

                    <div>
                       <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">核心属性</h4>
                       <div className="space-y-3">
                          {Object.entries(feature.properties).map(([key, val]) => (
                             <div key={key}>
                               <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">{key}</label>
                               <input 
                                 type="text" 
                                 value={val} 
                                 onChange={(e) => handlePropertyChange(key, e.target.value)}
                                 className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:border-blue-500 outline-none" 
                               />
                             </div>
                          ))}
                       </div>
                    </div>
                  </div>
                )}
                 {activeTab === 'evidence' && linkedSource && (
                  <div className="space-y-4">
                     <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-start mb-3">
                           <div className="p-2 bg-gray-100 rounded mr-3">
                              {linkedSource.type === 'image' ? <FileImage size={20} className="text-purple-500"/> : 
                               linkedSource.type === 'text' ? <FileText size={20} className="text-blue-500"/> :
                               <Video size={20} className="text-red-500"/>}
                           </div>
                           <div className="overflow-hidden">
                              <div className="text-sm font-bold text-gray-900 truncate">{linkedSource.name}</div>
                              <div className="text-xs text-gray-500">{linkedSource.date}</div>
                           </div>
                        </div>
                        <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs font-mono mb-2 relative overflow-hidden group border border-gray-200">
                           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid.png')]"></div>
                           <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-amber-400 shadow-[0_0_0_9999px_rgba(255,255,255,0.7)]"></div>
                           <div className="absolute bottom-2 left-2 bg-amber-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">Detected</div>
                        </div>
                     </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 bg-white grid grid-cols-2 gap-3">
                 <button onClick={() => handleFeatureAction('reject')} className="py-2.5 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-sm">驳回</button>
                 <button onClick={() => handleFeatureAction('accept')} disabled={isProcessingQA} className="flex items-center justify-center py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm shadow-md">{isProcessingQA ? <Loader2 size={16} className="animate-spin" /> : '通过'}</button>
              </div>
             </>
           ) : null}
        </div>

      </div>
    </div>
  );
};

export default WorkbenchPOI;