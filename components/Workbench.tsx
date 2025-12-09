
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Bot, 
  Check, 
  X, 
  MousePointer2, 
  Spline,
  CornerUpRight,
  Wrench,
  FileImage,
  FileText, 
  Video,
  ChevronDown,
  ChevronRight,
  Layers,
  AlertTriangle,
  Loader2,
  PenTool,
  Scissors,
  Combine,
  Briefcase,
  Filter,
  MoreHorizontal,
  List,
  ExternalLink,
  Calendar,
  Clock,
  Maximize2,
  Map as MapIcon,
  Minimize2,
  ArrowLeft,
  Lightbulb,
  Target,
  ScanLine,
  Trash2,
  Undo,
  Save
} from 'lucide-react';
import { TASKS, PIPELINES, SOURCE_FILES, MOCK_FEATURES, AUTOMATION_JOBS } from '../constants';
import { PipelineType, Feature } from '../types';

interface WorkbenchProps {
  currentPipeline: PipelineType;
  selectedTaskId: number | null;
  onSelectTask: (taskId: number | null) => void;
  onPipelineChange: (pipeline: PipelineType) => void;
  onBack?: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface AdminPolygon {
  id: string;
  points: Point[];
  attributes: {
    name: string;
    code: string;
    level: string;
    type: string;
  };
}

const Workbench: React.FC<WorkbenchProps> = ({ currentPipeline, selectedTaskId, onSelectTask, onPipelineChange, onBack }) => {
  const [activeTab, setActiveTab] = useState<'attributes' | 'evidence'>('attributes');
  const [feature, setFeature] = useState<Feature | null>(null);
  const [isProcessingQA, setIsProcessingQA] = useState(false);
  const [qaError, setQaError] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>(AUTOMATION_JOBS[0].id);
  
  // Map Interaction State
  const [viewState, setViewState] = useState({ scale: 1, x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Admin Drawing State
  const [drawMode, setDrawMode] = useState(false);
  const [currentPolygon, setCurrentPolygon] = useState<Point[]>([]);
  const [mousePos, setMousePos] = useState<Point | null>(null);
  const [adminPolygons, setAdminPolygons] = useState<AdminPolygon[]>([]);
  const [selectedPolyId, setSelectedPolyId] = useState<string | null>(null);

  const pipelineConfig = PIPELINES.find(p => p.id === currentPipeline);
  const visibleTasks = TASKS.filter(t => t.type === currentPipeline);
  const selectedTask = visibleTasks.find(t => t.id === selectedTaskId);
  
  const linkedSource = selectedTask && selectedTask.sourceId 
    ? SOURCE_FILES.find(f => f.id === selectedTask.sourceId) 
    : null;

  useEffect(() => {
    if (currentPipeline === 'admin') {
       const adminJob = AUTOMATION_JOBS.find(j => j.pipelineId === 'admin');
       if (adminJob && (!selectedJobId || !selectedJobId.includes('ADMIN'))) {
           setSelectedJobId(adminJob.id);
       }
    }
  }, [currentPipeline]);

  useEffect(() => {
    if (selectedTaskId && MOCK_FEATURES[selectedTaskId]) {
      setFeature(MOCK_FEATURES[selectedTaskId][0]);
      if (MOCK_FEATURES[selectedTaskId][0].issues?.length) {
          if (MOCK_FEATURES[selectedTaskId][0].issues?.includes('topology_error')) {
              setQaError('QA 阻断警告: 面要素存在自相交或空隙 (Topology Error)。');
          } else {
              setQaError(null);
          }
      } else {
          setQaError(null);
      }
    } else {
      setFeature(null);
      setQaError(null);
    }
  }, [selectedTaskId]);

  // --- Coordinate Helpers ---
  const getMapCoordinates = (clientX: number, clientY: number) => {
    if (!mapContainerRef.current) return { x: 0, y: 0 };
    const rect = mapContainerRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - viewState.x) / viewState.scale,
      y: (clientY - rect.top - viewState.y) / viewState.scale
    };
  };

  // --- Map Interaction Handlers ---
  const handleWheel = (e: React.WheelEvent) => {
    // e.preventDefault(); // React synthetic events might not support this in all cases, relying on state
    const scaleAdjustment = -e.deltaY * 0.001;
    setViewState(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(8, prev.scale + scaleAdjustment))
    }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    // If in draw mode, don't drag
    if (drawMode) return;

    setIsDragging(true);
    setDragStart({ x: e.clientX - viewState.x, y: e.clientY - viewState.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const coords = getMapCoordinates(e.clientX, e.clientY);
    setMousePos(coords);

    if (isDragging) {
      setViewState(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));
    }
  };

  const handleMapClick = (e: React.MouseEvent) => {
    if (isDragging) return; // Don't trigger click if we just dragged
    if (drawMode) {
      const coords = getMapCoordinates(e.clientX, e.clientY);
      setCurrentPolygon(prev => [...prev, coords]);
    } else {
      // Logic for selecting polygons could go here
      setSelectedPolyId(null);
    }
  };

  const handlePolygonClick = (e: React.MouseEvent, polyId: string) => {
    if (drawMode) return;
    e.stopPropagation();
    setSelectedPolyId(polyId);
    // If a task is selected, deselect it to focus on the polygon
    onSelectTask(null);
  };

  const finishDrawing = () => {
    if (currentPolygon.length < 3) {
      alert("多边形至少需要3个点");
      return;
    }
    const newPoly: AdminPolygon = {
      id: `poly-${Date.now()}`,
      points: [...currentPolygon],
      attributes: {
        name: '未命名区域',
        code: '',
        level: 'District',
        type: 'Administrative'
      }
    };
    setAdminPolygons([...adminPolygons, newPoly]);
    setCurrentPolygon([]);
    setDrawMode(false);
    setSelectedPolyId(newPoly.id);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setViewState(prev => ({
      ...prev,
      scale: direction === 'in' ? Math.min(8, prev.scale * 1.2) : Math.max(0.5, prev.scale / 1.2)
    }));
  };

  const handleResetView = () => {
    setViewState({ scale: 1, x: 0, y: 0 });
  };

  const handleFeatureAction = (action: 'accept' | 'reject') => {
    if (!feature) return;

    if (action === 'accept') {
      setIsProcessingQA(true);
      setTimeout(() => {
        setIsProcessingQA(false);
        if (feature.issues?.includes('dangle_node') || feature.issues?.includes('topology_error')) {
           // Keep error open if not forced
        } else {
          setFeature(prev => prev ? ({ ...prev, status: 'validated', aiConfidence: 1.0 }) : null);
          setQaError(null);
        }
      }, 800);
    } else {
      setFeature(prev => prev ? ({ ...prev, status: 'rejected' }) : null);
      onSelectTask(null); 
    }
  };

  const handleForceSave = () => {
    setFeature(prev => prev ? ({ ...prev, status: 'validated', issues: [] }) : null);
    setQaError(null);
  };

  const handlePropertyChange = (key: string, value: string) => {
    setFeature(prev => prev ? ({ 
      ...prev, 
      properties: { ...prev.properties, [key]: value },
      status: 'human_reviewing'
    }) : null);
  };

  // Admin Polygon Attributes Change
  const handleAdminPolyChange = (key: keyof AdminPolygon['attributes'], value: string) => {
    if (!selectedPolyId) return;
    setAdminPolygons(prev => prev.map(p => 
      p.id === selectedPolyId 
      ? { ...p, attributes: { ...p.attributes, [key]: value } } 
      : p
    ));
  };

  const activeAdminPolygon = adminPolygons.find(p => p.id === selectedPolyId);

  const renderLeftPanel = () => {
    // Only show for Admin pipeline as per requirement
    if (currentPipeline !== 'admin') return null;

    const adminJobs = AUTOMATION_JOBS.filter(j => j.pipelineId === 'admin');
    
    return (
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.01)] h-full overflow-hidden shrink-0">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
           <div className="flex items-center space-x-2">
             <List size={16} className="text-blue-600"/>
             <h3 className="font-bold text-gray-800 text-sm">任务包列表</h3>
           </div>
           <div className="flex space-x-1">
             <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"><Filter size={14}/></button>
             <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"><MoreHorizontal size={14}/></button>
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/30">
           {adminJobs.map(job => {
             const isJobSelected = selectedJobId === job.id;
             const jobTasks = visibleTasks; 

             return (
               <div key={job.id} className={`rounded-xl border transition-all duration-200 overflow-hidden ${isJobSelected ? 'border-blue-200 shadow-md bg-white' : 'border-gray-200 hover:border-blue-300 bg-white'}`}>
                  {/* Job Header */}
                  <div 
                    onClick={() => setSelectedJobId(job.id)}
                    className={`p-3 cursor-pointer flex items-start space-x-3 transition-colors ${isJobSelected ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}
                  >
                     <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${isJobSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                        <Briefcase size={16} />
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                           <h4 className={`text-sm font-bold truncate pr-2 ${isJobSelected ? 'text-blue-900' : 'text-gray-700'}`}>{job.name}</h4>
                           {isJobSelected ? <ChevronDown size={14} className="text-blue-400 mt-0.5 shrink-0"/> : <ChevronRight size={14} className="text-gray-300 mt-0.5 shrink-0"/>}
                        </div>
                        <div className="flex items-center mt-1.5 space-x-2 text-xs text-gray-500">
                           <span className="bg-white border border-gray-200 px-1.5 py-0.5 rounded shadow-sm text-[10px]">{job.stats?.manual || 0} 待人工</span>
                           <span className="text-[10px]">{job.progress}% 完成</span>
                        </div>
                     </div>
                  </div>

                  {/* Task List (Expanded) */}
                  {isJobSelected && (
                    <div className="border-t border-blue-50 bg-white">
                       <div className="px-4 py-3 border-b border-blue-50/50 flex items-center text-blue-600 bg-blue-50/30">
                          <FileText size={14} className="mr-2"/>
                          <span className="text-xs font-bold">新行政区界线情报</span>
                          <span className="ml-auto text-[10px] text-gray-400">匹配置信度 92%</span>
                       </div>

                       {jobTasks.map(task => {
                          const isTaskSelected = selectedTaskId === task.id;
                          return (
                            <div 
                              key={task.id}
                              onClick={() => { onSelectTask(task.id); setSelectedPolyId(null); }}
                              className={`px-4 py-3 border-b border-gray-50 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors group ${isTaskSelected ? 'bg-blue-50/50 border-l-[3px] border-l-blue-500 pl-[13px]' : 'border-l-[3px] border-l-transparent'}`}
                            >
                               <div className="flex items-center min-w-0">
                                  <div className={`w-2 h-2 rounded-full mr-3 shrink-0 ring-2 ring-white shadow-sm ${
                                     task.status === 'auto' ? 'bg-blue-500' :
                                     task.status === 'review' ? 'bg-amber-500' : 'bg-rose-500'
                                  }`}></div>
                                  <div className="truncate">
                                     <div className={`text-xs font-bold truncate mb-0.5 ${isTaskSelected ? 'text-blue-700' : 'text-gray-700'}`}>{task.title}</div>
                                     <div className="text-[10px] text-gray-400 truncate group-hover:text-gray-500">{task.reason}</div>
                                  </div>
                               </div>
                               {task.status === 'review' && (
                                 <div className="shrink-0 bg-amber-50 text-amber-600 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-amber-100">
                                    Review
                                 </div>
                               )}
                            </div>
                          );
                       })}
                       {jobTasks.length === 0 && (
                          <div className="p-4 text-center text-xs text-gray-400">
                             暂无任务
                          </div>
                       )}
                    </div>
                  )}
               </div>
             );
           })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      
      {/* Workbench Toolbar */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shadow-[0_2px_8px_rgba(0,0,0,0.02)] shrink-0">
        <div className="flex items-center space-x-4">
           {/* Back Button for Task List context */}
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
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${p.id === currentPipeline ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
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
               placeholder="搜索图层要素..." 
               className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 w-48 focus:outline-none focus:bg-white transition-all"
             />
           </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-2">
            自动完成率: <span className="text-gray-800">92%</span>
          </span>
          <div className="h-2 w-16 bg-gray-100 rounded-full overflow-hidden">
             <div className="h-full bg-blue-500 w-[92%]"></div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar (Task List) */}
        {renderLeftPanel()}

        {/* Map Area - OSM Light Style with Interaction */}
        <div 
            ref={mapContainerRef}
            className={`flex-1 relative bg-[#eef0f3] overflow-hidden group ${drawMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onClick={handleMapClick}
        >
          {/* Transformed Map Container */}
          <div 
            style={{ 
                transform: `translate(${viewState.x}px, ${viewState.y}px) scale(${viewState.scale})`,
                transformOrigin: '0 0',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0
            }}
          >
              <div className="absolute inset-[-50%] w-[200%] h-[200%] opacity-100" style={{ 
                  backgroundColor: '#f2efe9', 
                  backgroundImage: `
                    linear-gradient(#e5e7eb 1px, transparent 1px),
                    linear-gradient(90deg, #e5e7eb 1px, transparent 1px)
                  `,
                  backgroundSize: '100px 100px'
              }}>
                 {/* Decorative background shapes */}
                 <div className="absolute top-1/2 left-1/2 w-full h-32 bg-[#aad3df] -rotate-12 transform -translate-y-20 -translate-x-1/2 border-t border-b border-[#9ec7d3]"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-40 -translate-y-40 w-40 h-40 bg-[#cdebb0] rounded-full opacity-60"></div>
              </div>
              
              {/* SVG Layer for Polygons */}
              <svg className="absolute inset-[-50%] w-[200%] h-[200%] overflow-visible pointer-events-none">
                 {/* Completed Admin Polygons */}
                 {adminPolygons.map(poly => (
                    <g key={poly.id} onClick={(e) => handlePolygonClick(e as any, poly.id)} className="pointer-events-auto cursor-pointer">
                       <polygon 
                          points={poly.points.map(p => `${p.x},${p.y}`).join(' ')}
                          fill={selectedPolyId === poly.id ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.1)"}
                          stroke={selectedPolyId === poly.id ? "#2563eb" : "#3b82f6"}
                          strokeWidth={selectedPolyId === poly.id ? 2 : 1}
                       />
                       {/* Vertices for selected polygon */}
                       {selectedPolyId === poly.id && poly.points.map((p, idx) => (
                          <circle key={idx} cx={p.x} cy={p.y} r={3 / viewState.scale} fill="white" stroke="#2563eb" strokeWidth={1} />
                       ))}
                    </g>
                 ))}

                 {/* Current Drawing Polygon */}
                 {drawMode && currentPolygon.length > 0 && (
                    <g>
                       <polyline 
                          points={currentPolygon.map(p => `${p.x},${p.y}`).join(' ')}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          strokeDasharray="5,5"
                       />
                       {currentPolygon.map((p, idx) => (
                          <circle key={idx} cx={p.x} cy={p.y} r={3 / viewState.scale} fill="white" stroke="#f59e0b" strokeWidth={1} />
                       ))}
                       {/* Rubber band line to mouse */}
                       {mousePos && (
                          <line 
                             x1={currentPolygon[currentPolygon.length - 1].x} 
                             y1={currentPolygon[currentPolygon.length - 1].y} 
                             x2={mousePos.x} 
                             y2={mousePos.y} 
                             stroke="#f59e0b" 
                             strokeWidth={1}
                             strokeDasharray="5,5"
                          />
                       )}
                    </g>
                 )}
              </svg>

              <div className="absolute inset-0">
                 {visibleTasks.map(task => {
                   const isSelected = selectedTaskId === task.id;
                   const displayFeature = isSelected && feature ? feature : { 
                      status: task.status === 'auto' ? 'validated' : 'ai_generated', 
                      aiConfidence: task.confidence / 100 
                   };
                   
                   let dotColor = 'bg-gray-400';
                   let shadowColor = '';
                   
                   if (displayFeature.status === 'ai_generated') {
                      dotColor = displayFeature.aiConfidence > 0.8 ? 'bg-emerald-500' : 'bg-rose-500';
                      shadowColor = displayFeature.aiConfidence > 0.8 ? 'shadow-[0_0_0_4px_rgba(16,185,129,0.2)]' : 'shadow-[0_0_0_4px_rgba(244,63,94,0.2)]';
                   } else if (displayFeature.status === 'validated') {
                      dotColor = 'bg-blue-600';
                      shadowColor = 'shadow-[0_0_0_4px_rgba(37,99,235,0.2)]';
                   } else if (displayFeature.status === 'human_reviewing') {
                      dotColor = 'bg-amber-500'; 
                      shadowColor = 'shadow-[0_0_0_4px_rgba(245,158,11,0.2)]';
                   }

                   return (
                     <div
                       key={task.id}
                       onClick={(e) => {
                         e.stopPropagation();
                         onSelectTask(task.id);
                         setSelectedPolyId(null);
                       }}
                       className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20`}
                       style={{ left: `${task.coords.x}%`, top: `${task.coords.y}%` }}
                     >
                       {isSelected && (
                         <div className="absolute inset-0 -m-4 border-2 border-blue-500 rounded-full opacity-100 animate-ping"></div>
                       )}
                       <div className={`relative w-4 h-4 rounded-full border-2 border-white ${dotColor} ${shadowColor} ${isSelected ? 'scale-125' : 'hover:scale-110'}`}></div>
                       
                       <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white shadow-md border border-gray-200 text-gray-700 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                           {task.title}
                           <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
                       </div>
                     </div>
                   );
                 })}
              </div>
          </div>
          
          {/* Static UI Overlays */}
          <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
            <button 
                onClick={handleResetView}
                className="p-2 bg-white rounded-lg shadow-md border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                title="重置视图"
            >
              <MousePointer2 size={18} />
            </button>
            <button 
                onClick={() => handleZoom('in')}
                className="p-2 bg-white rounded-lg shadow-md border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                title="放大"
            >
              <span className="font-bold text-sm">+</span>
            </button>
            <button 
                onClick={() => handleZoom('out')}
                className="p-2 bg-white rounded-lg shadow-md border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                title="缩小"
            >
              <span className="font-bold text-sm">-</span>
            </button>
          </div>

          {/* Admin Polygon Tools */}
          {currentPipeline === 'admin' && (
             <div className="absolute top-4 left-16 z-10 flex items-center space-x-2 bg-white p-1.5 rounded-lg shadow-md border border-gray-200">
                <button 
                   onClick={() => { setDrawMode(false); setCurrentPolygon([]); }}
                   className={`p-2 rounded-lg transition-colors ${!drawMode ? 'bg-blue-50 text-blue-600 font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                   title="选择工具"
                >
                   <MousePointer2 size={18} />
                </button>
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                <button 
                   onClick={() => { setDrawMode(true); onSelectTask(null); setSelectedPolyId(null); }}
                   className={`p-2 rounded-lg transition-colors ${drawMode ? 'bg-blue-50 text-blue-600 font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                   title="绘制多边形"
                >
                   <PenTool size={18} />
                </button>
                {drawMode && (
                   <>
                      <button 
                         onClick={() => { setCurrentPolygon(prev => prev.slice(0, -1)); }}
                         className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-amber-600 transition-colors"
                         title="撤销上一点"
                      >
                         <Undo size={18} />
                      </button>
                      <button 
                         onClick={finishDrawing}
                         className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-md hover:bg-blue-700 shadow-sm transition-colors"
                      >
                         完成绘制
                      </button>
                   </>
                )}
             </div>
          )}
          
          {qaError && (
             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white border border-rose-200 text-rose-800 px-4 py-3 rounded-xl shadow-2xl flex items-start max-w-md z-50 animate-in slide-in-from-bottom-5">
                <div className="bg-rose-100 p-1.5 rounded-full mr-3 mt-0.5">
                   <AlertTriangle className="text-rose-600" size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900">QA 阻断警告</h4>
                  <p className="text-xs mb-3 text-gray-600">{qaError}</p>
                  <div className="flex space-x-2">
                     <button 
                       onClick={() => setQaError(null)} 
                       className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-200 text-gray-700"
                     >
                       取消
                     </button>
                     <button 
                       onClick={handleForceSave}
                       className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-medium hover:bg-rose-700 shadow-sm shadow-rose-200"
                     >
                       忽略风险并保存
                     </button>
                  </div>
                </div>
             </div>
          )}

          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur border border-gray-200 text-gray-600 text-[10px] font-mono shadow-sm px-2 py-1 rounded pointer-events-none">
            Scale: {viewState.scale.toFixed(2)} | X: {viewState.x} | Y: {viewState.y}
          </div>
        </div>

        {/* Context Panel - Light Theme */}
        <div className={`w-[400px] bg-white border-l border-gray-200 flex flex-col shadow-xl absolute right-0 top-0 bottom-0 z-30 transition-transform duration-300 ${selectedTaskId || selectedPolyId ? 'translate-x-0' : 'translate-x-full'}`}>
           
           {/* Case 1: Existing Task Selected */}
           {selectedTaskId && selectedTask && feature ? (
             <>
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                   <div className={`flex items-center space-x-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                    feature.status === 'validated' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                    feature.status === 'human_reviewing' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                    'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      feature.status === 'validated' ? 'bg-blue-500' : 
                      feature.status === 'human_reviewing' ? 'bg-amber-500' : 'bg-rose-500'
                    }`}></div>
                    <span>
                      {feature.status === 'validated' ? '已校验' : 
                       feature.status === 'human_reviewing' ? '人工编辑中' : 'AI 生成 (待审)'}
                    </span>
                  </div>
                  <button onClick={() => onSelectTask(null)} className="text-gray-400 hover:text-gray-600">
                     <X size={16} />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{selectedTask.title}</h3>
                <div className="text-sm text-gray-500 flex items-center">
                  <span className="font-medium text-gray-700 mr-2">{(feature.aiConfidence * 100).toFixed(0)}% 置信度</span>
                  <span className="h-1 w-1 bg-gray-300 rounded-full mx-1"></span>
                  <span>{currentPipeline === 'road' ? '路网数据' : currentPipeline === 'admin' ? '行政区划' : '水系与植被'}</span>
                </div>
              </div>

              {/* Operation Clues (Admin Only) - Moved Above Tabs */}
              {currentPipeline === 'admin' && (
                  <div className="px-5 pt-5 pb-2 bg-white">
                        <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center text-indigo-800 font-bold text-sm">
                                    <Lightbulb size={16} className="mr-2 text-indigo-600" />
                                    作业线索
                                </div>
                                <div className="text-[10px] px-2 py-0.5 bg-white border border-indigo-100 text-indigo-600 rounded-full shadow-sm font-medium">
                                    情报置信度 98%
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Intelligence Detail Block */}
                                <div className="bg-white rounded-lg p-3 border border-indigo-50 shadow-sm space-y-2">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-[10px] text-gray-400 mb-0.5 flex items-center"><Target size={10} className="mr-1"/> 调整面积</div>
                                            <div className="text-xs font-mono font-medium text-gray-700">12.54 km²</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-gray-400 mb-0.5 flex items-center"><Calendar size={10} className="mr-1"/> 生效日期</div>
                                            <div className="text-xs font-mono font-medium text-gray-700">2025-01-01</div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-2 border-t border-gray-50">
                                        <div className="text-[10px] text-gray-400 mb-1">情报总结</div>
                                        <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-2 rounded border border-gray-100">
                                            依据《国务院关于同意设立B区北部新区的批复》，将原B区北部的部分区域划出，设立新的行政区。需重点核对北部边界与自然地物（河流）的重合度。
                                        </p>
                                    </div>

                                    <div className="pt-1 flex justify-between items-center">
                                        <div className="text-[10px] text-gray-400">信息来源</div>
                                        <div className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded cursor-pointer hover:bg-blue-100 transition-colors">
                                            <FileText size={10} className="mr-1"/>
                                            Gov_Doc_2024_001.pdf
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                  </div>
              )}

              {/* Tabs */}
              <div className="flex border-b border-gray-200 px-5">
                <button 
                  onClick={() => setActiveTab('attributes')}
                  className={`mr-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'attributes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  属性信息
                </button>
                <button 
                  onClick={() => setActiveTab('evidence')}
                  className={`mr-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'evidence' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  溯源证据
                </button>
              </div>

              <div className="flex-1 overflow-y-auto bg-gray-50 p-5">
                {activeTab === 'attributes' && (
                  <div className="space-y-6">
                    <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center mb-2">
                         <Bot className="text-blue-600 mr-2" size={16} />
                         <span className="font-bold text-blue-900 text-xs uppercase tracking-wide">AI 推理依据</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {selectedTask.reason}
                      </p>
                    </div>
                    
                    {/* ... Properties Inputs ... */}
                    <div>
                       <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">属性详情</h4>
                       <div className="space-y-3">
                          {Object.entries(feature.properties).map(([key, val]) => (
                             <div key={key}>
                               <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">{key}</label>
                               <input 
                                 type="text" 
                                 value={val} 
                                 onChange={(e) => handlePropertyChange(key, e.target.value)}
                                 className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                               />
                             </div>
                          ))}
                       </div>
                    </div>
                  </div>
                )}
                {/* ... (Evidence Tab) ... */}
              </div>

              {/* Action Footer */}
              <div className="p-4 border-t border-gray-200 bg-white grid grid-cols-2 gap-3 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                 <button 
                  onClick={() => handleFeatureAction('reject')}
                  className="flex items-center justify-center py-2.5 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-sm transition-colors hover:border-gray-400">
                   <X size={16} className="mr-2" />
                   驳回
                 </button>
                 <button 
                  onClick={() => handleFeatureAction('accept')}
                  disabled={isProcessingQA}
                  className="flex items-center justify-center py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm shadow-md shadow-blue-200 transition-colors disabled:opacity-70 disabled:shadow-none">
                   {isProcessingQA ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Check size={16} className="mr-2" />}
                   {isProcessingQA ? 'QA 检查中...' : '通过'}
                 </button>
              </div>
             </>
           ) : null}

           {/* Case 2: Drawn Polygon Selected */}
           {!selectedTaskId && activeAdminPolygon && (
             <div className="flex flex-col h-full">
               <div className="p-5 border-b border-gray-100 bg-indigo-50/20">
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide px-2 py-0.5 bg-indigo-50 rounded border border-indigo-100">
                        Admin Polygon
                     </span>
                     <button 
                        onClick={() => { setSelectedPolyId(null); }} 
                        className="text-gray-400 hover:text-gray-600"
                     >
                        <X size={16} />
                     </button>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
                     {activeAdminPolygon.attributes.name || '未命名区域'}
                  </h3>
                  <div className="text-xs text-gray-500 font-mono mt-1">ID: {activeAdminPolygon.id}</div>
               </div>

               <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50">
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                     <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center">
                        <ScanLine size={14} className="mr-2"/> 几何信息
                     </h4>
                     <div className="text-xs text-gray-600 space-y-2 font-mono">
                        <div className="flex justify-between">
                           <span>Vertices:</span>
                           <span className="font-bold">{activeAdminPolygon.points.length}</span>
                        </div>
                        <div className="flex justify-between">
                           <span>Center:</span>
                           <span>
                              {activeAdminPolygon.points[0]?.x.toFixed(1)}, {activeAdminPolygon.points[0]?.y.toFixed(1)}
                           </span>
                        </div>
                     </div>
                  </div>

                  <div>
                     <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">行政区属性</h4>
                     <div className="space-y-3">
                        <div>
                           <label className="block text-xs font-medium text-gray-500 mb-1">行政区名称 (Name)</label>
                           <input 
                              type="text" 
                              value={activeAdminPolygon.attributes.name}
                              onChange={e => handleAdminPolyChange('name', e.target.value)}
                              className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:border-indigo-500 outline-none transition-all focus:ring-1 focus:ring-indigo-500"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-medium text-gray-500 mb-1">行政代码 (Adcode)</label>
                           <input 
                              type="text" 
                              value={activeAdminPolygon.attributes.code}
                              onChange={e => handleAdminPolyChange('code', e.target.value)}
                              placeholder="e.g. 110108"
                              className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:border-indigo-500 outline-none transition-all focus:ring-1 focus:ring-indigo-500 font-mono"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-medium text-gray-500 mb-1">行政级别 (Level)</label>
                           <select 
                              value={activeAdminPolygon.attributes.level}
                              onChange={e => handleAdminPolyChange('level', e.target.value)}
                              className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:border-indigo-500 outline-none transition-all"
                           >
                              <option value="Province">Province (省/直辖市)</option>
                              <option value="City">City (地级市)</option>
                              <option value="District">District (区/县)</option>
                              <option value="Town">Town (街道/乡镇)</option>
                           </select>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-4 border-t border-gray-200 bg-white grid grid-cols-2 gap-3 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                  <button 
                     onClick={() => {
                        setAdminPolygons(prev => prev.filter(p => p.id !== selectedPolyId));
                        setSelectedPolyId(null);
                     }}
                     className="flex items-center justify-center py-2.5 px-4 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-semibold text-sm transition-colors"
                  >
                     <Trash2 size={16} className="mr-2" /> 删除
                  </button>
                  <button 
                     onClick={() => setSelectedPolyId(null)}
                     className="flex items-center justify-center py-2.5 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm shadow-md shadow-indigo-200 transition-colors"
                  >
                     <Save size={16} className="mr-2" /> 保存更改
                  </button>
               </div>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default Workbench;
