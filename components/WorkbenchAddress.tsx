import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bot, 
  Check, 
  X, 
  MousePointer2, 
  Link,
  BookType,
  ListTree,
  ChevronDown,
  Layers,
  Loader2,
  FileText,
  ArrowLeft
} from 'lucide-react';
import { TASKS, PIPELINES, SOURCE_FILES, MOCK_FEATURES } from '../constants';
import { PipelineType, Feature } from '../types';

interface WorkbenchAddressProps {
  currentPipeline: PipelineType; // Should be 'address'
  selectedTaskId: number | null;
  onSelectTask: (taskId: number | null) => void;
  onPipelineChange: (pipeline: PipelineType) => void;
  onBack?: () => void;
}

const WorkbenchAddress: React.FC<WorkbenchAddressProps> = ({ currentPipeline, selectedTaskId, onSelectTask, onPipelineChange, onBack }) => {
  const [activeTab, setActiveTab] = useState<'attributes' | 'evidence'>('attributes');
  const [feature, setFeature] = useState<Feature | null>(null);
  const [isProcessingQA, setIsProcessingQA] = useState(false);
  
  const pipelineConfig = PIPELINES.find(p => p.id === 'address');
  const visibleTasks = TASKS.filter(t => t.type === 'address');
  const selectedTask = visibleTasks.find(t => t.id === selectedTaskId);
  
  const linkedSource = selectedTask && selectedTask.sourceId 
    ? SOURCE_FILES.find(f => f.id === selectedTask.sourceId) 
    : null;

  useEffect(() => {
    if (selectedTaskId && MOCK_FEATURES[selectedTaskId]) {
      setFeature(MOCK_FEATURES[selectedTaskId][0]); 
    } else {
      setFeature(null);
    }
  }, [selectedTaskId]);

  const handleFeatureAction = (action: 'accept' | 'reject') => {
    if (action === 'accept') {
      setIsProcessingQA(true);
      setTimeout(() => {
        setIsProcessingQA(false);
        setFeature(prev => prev ? ({ ...prev, status: 'validated', aiConfidence: 1.0 }) : null);
      }, 800);
    } else {
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
      
      {/* Address Toolbar */}
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
             <button className="flex items-center space-x-2 font-bold text-gray-700 hover:text-purple-600 transition-colors bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
               <Layers size={16} className="text-purple-500" />
               <span className="text-sm">{pipelineConfig?.name}</span>
               <ChevronDown size={14} className="text-gray-400" />
             </button>
             <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="py-1">
                  {PIPELINES.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => onPipelineChange(p.id as PipelineType)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${p.id === 'address' ? 'text-purple-600 font-medium' : 'text-gray-600'}`}
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
               placeholder="输入标准地址编码或关键字..." 
               className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 focus:ring-1 focus:ring-purple-500 w-64 focus:outline-none focus:bg-white transition-all"
             />
           </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Map Area */}
        <div className="flex-1 relative bg-[#eef0f3] overflow-hidden group">
          <div className="absolute inset-0 opacity-100" style={{ 
              backgroundColor: '#f2efe9', 
              backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
              backgroundSize: '100px 100px'
          }}></div>
          
          <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
            <button className="p-2 bg-white rounded-lg shadow-md border border-gray-200 text-gray-600 hover:text-purple-600 transition-colors"><MousePointer2 size={18} /></button>
          </div>

          <div className="absolute inset-0">
             {visibleTasks.map(task => {
               const isSelected = selectedTaskId === task.id;
               return (
                 <div
                   key={task.id}
                   onClick={(e) => { e.stopPropagation(); onSelectTask(task.id); }}
                   className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20`}
                   style={{ left: `${task.coords.x}%`, top: `${task.coords.y}%` }}
                 >
                   {isSelected && <div className="absolute inset-0 -m-4 border-2 border-purple-500 rounded-full opacity-100 animate-ping"></div>}
                   <div className={`relative w-4 h-4 rounded-full border-2 border-white bg-purple-600 ${isSelected ? 'scale-125' : 'hover:scale-110'}`}></div>
                   <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white shadow-md border border-gray-200 text-gray-700 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">{task.title}</div>
                 </div>
               );
             })}
          </div>
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur border border-gray-200 text-gray-600 text-[10px] font-mono shadow-sm px-2 py-1 rounded">
            Address Mode (Standardization)
          </div>
        </div>

        {/* Address Context Panel */}
        <div className={`w-[400px] bg-white border-l border-gray-200 flex flex-col shadow-xl absolute right-0 top-0 bottom-0 z-30 transition-transform duration-300 ${selectedTaskId ? 'translate-x-0' : 'translate-x-full'}`}>
           
           {selectedTask && feature ? (
             <>
              <div className="p-5 border-b border-gray-100 bg-purple-50/20">
                <div className="flex items-center justify-between mb-2">
                   <div className={`flex items-center space-x-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-purple-50 text-purple-700 border border-purple-100`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                    <span>地址标准化任务</span>
                  </div>
                  <button onClick={() => onSelectTask(null)} className="text-gray-400 hover:text-gray-600">
                     <X size={16} />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{selectedTask.title}</h3>
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">NLP 匹配度: {(feature.aiConfidence * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="flex border-b border-gray-200 px-5">
                <button onClick={() => setActiveTab('attributes')} className={`mr-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'attributes' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>地址要素</button>
                <button onClick={() => setActiveTab('evidence')} className={`mr-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'evidence' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>原始文档</button>
              </div>

              <div className="flex-1 overflow-y-auto bg-gray-50 p-5">
                {activeTab === 'attributes' && (
                  <div className="space-y-6">
                     <div className="bg-white border border-purple-100 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center mb-2">
                         <Bot className="text-purple-600 mr-2" size={16} />
                         <span className="font-bold text-purple-900 text-xs uppercase tracking-wide">AI 解析建议</span>
                      </div>
                      <p className="text-sm text-gray-700">{selectedTask.reason}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">地址治理工具</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-400 hover:text-purple-600 transition-all text-gray-600 text-xs font-medium shadow-sm">
                          <BookType size={16} className="mr-2" /> 格式标准化
                        </button>
                        <button className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-400 hover:text-purple-600 transition-all text-gray-600 text-xs font-medium shadow-sm">
                          <ListTree size={16} className="mr-2" /> 关联父节点
                        </button>
                        <button className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-400 hover:text-purple-600 transition-all text-gray-600 text-xs font-medium shadow-sm col-span-2">
                          <Link size={16} className="mr-2" /> 空间位置挂接
                        </button>
                      </div>
                    </div>

                    <div>
                       <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">地址段信息</h4>
                       <div className="space-y-3">
                          {Object.entries(feature.properties).map(([key, val]) => (
                             <div key={key}>
                               <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">{key}</label>
                               <input 
                                 type="text" 
                                 value={val} 
                                 onChange={(e) => handlePropertyChange(key, e.target.value)}
                                 className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:border-purple-500 outline-none" 
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
                              <FileText size={20} className="text-purple-500"/>
                           </div>
                           <div className="overflow-hidden">
                              <div className="text-sm font-bold text-gray-900 truncate">{linkedSource.name}</div>
                              <div className="text-xs text-gray-500">{linkedSource.date}</div>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 bg-white grid grid-cols-2 gap-3">
                 <button onClick={() => handleFeatureAction('reject')} className="py-2.5 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-sm">标记无效</button>
                 <button onClick={() => handleFeatureAction('accept')} disabled={isProcessingQA} className="flex items-center justify-center py-2.5 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-sm shadow-md">{isProcessingQA ? <Loader2 size={16} className="animate-spin" /> : '确认入库'}</button>
              </div>
             </>
           ) : null}
        </div>

      </div>
    </div>
  );
};

export default WorkbenchAddress;