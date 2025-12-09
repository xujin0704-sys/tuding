
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, 
  Workflow, 
  GitFork, 
  MapPin, 
  Landmark, 
  Database, 
  Filter, 
  Search, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  User, 
  Calendar, 
  FileText, 
  X,
  Send,
  Loader2,
  MoreVertical,
  Building2,
  Users,
  Satellite,
  ShoppingBag,
  ListFilter,
  Layers,
  BarChart3,
  Inbox,
  Plus,
  Settings,
  Trash2,
  Edit2,
  Save,
  Sliders,
  Zap,
  Cloud,
  Server,
  Briefcase,
  ChevronDown,
  LayoutList,
  ThumbsUp,
  ThumbsDown,
  Network
} from 'lucide-react';
import { RoutingRule, PipelineDef } from '../types';

interface SourceTriageProps {
  routingRules: RoutingRule[];
  onUpdateRules: (rules: RoutingRule[]) => void;
  pipelineDefs: PipelineDef[];
  onUpdatePipelines: (pipelines: PipelineDef[]) => void;
}

// --- Mock Data ---
const INITIAL_CLUES = [
  {
    id: 101,
    sourceName: '市规划和自然资源局',
    sourceIcon: Building2,
    pipelineId: 'road',
    subPipelineId: 'road-main',
    pipelineLabel: '道路交通',
    content: '公告：因地铁12号线施工需要，建设大道至和平大道之间的人民路段将于2023年10月15日起实施全封闭施工，预计工期6个月。',
    date: 'Today',
    time: '10:42 AM',
    status: 'pending_dispatch', // 待分发
    ruleMode: 'manual',
    confidence: 98,
    tags: ['封路', '地铁施工']
  },
  {
    id: 102,
    sourceName: '小红书 (用户: 城市探险家)',
    sourceIcon: Users,
    pipelineId: 'poi',
    subPipelineId: 'poi-ingest',
    pipelineLabel: 'POI信息',
    content: '在阳光花园小区后门发现一家超隐蔽的新咖啡馆“云端九号”！就在那个蓝色大门后面，装修非常有格调。',
    date: 'Today',
    time: '10:30 AM',
    status: 'pending_dispatch', // 待分发
    ruleMode: 'manual',
    confidence: 65,
    tags: ['新店', '咖啡馆']
  },
  {
    id: 103,
    sourceName: 'Sentinel-2 变化检测',
    sourceIcon: Satellite,
    pipelineId: 'hydro',
    subPipelineId: 'hydro-change', 
    pipelineLabel: '区域/楼栋',
    content: '坐标 [31.2304, 121.4737] 处检测到新增建筑轮廓的高概率信号。面积约 500 平方米。此前分类：植被/空地。',
    date: 'Today',
    time: '09:15 AM',
    status: 'dispatched', // 已分发 (自动) -> 未作业
    ruleMode: 'auto',
    confidence: 89,
    tags: ['变化检测', '新增建筑']
  },
  {
    id: 104,
    sourceName: '美团商家数据',
    sourceIcon: ShoppingBag,
    pipelineId: 'poi',
    subPipelineId: 'poi-qa',
    pipelineLabel: 'POI信息',
    content: '商户“金龙火锅（西湖路店）”状态变更为“永久停业”。地址：西湖路 88 号。',
    date: 'Yesterday',
    time: '18:20 PM',
    status: 'completed', // 已作业
    ruleMode: 'auto',
    confidence: 100,
    tags: ['闭店', '状态变更']
  },
  {
    id: 105,
    sourceName: '民政局',
    sourceIcon: Landmark,
    pipelineId: 'admin',
    subPipelineId: 'admin-ingest',
    pipelineLabel: '行政区划',
    content: '关于调整高新区行政区划范围的通知：即日起，将湖滨工业园整体纳入高新区管辖范围。',
    date: 'Yesterday',
    time: '14:00 PM',
    status: 'pending_operation', // 已分发 -> 未作业
    ruleMode: 'auto',
    confidence: 95,
    tags: ['区划调整', '高新区']
  },
  {
    id: 106,
    sourceName: '高德路况 API',
    sourceIcon: MapPin,
    pipelineId: 'road',
    subPipelineId: 'road-main',
    pipelineLabel: '道路交通',
    content: '检测到西二旗北路（K2+100处）持续拥堵指数异常，疑似新增临时施工围挡。',
    date: 'Today',
    time: '11:05 AM',
    status: 'pending_dispatch',
    ruleMode: 'manual',
    confidence: 78,
    tags: ['拥堵异常', '疑似施工']
  }
];

// Mock Capabilities available for import
const AVAILABLE_CAPABILITIES = [
  { id: 'cap-3d-box', name: '3D 车辆框选', type: '3d', description: '点云数据中的动态目标检测与包围盒标注。' },
  { id: 'cap-lane-line', name: '车道线高精矢量化', type: 'map', description: '高精地图车道线提取与属性挂接。' },
  { id: 'cap-sign-rec', name: '交通标志识别', type: 'image', description: '道路交通标志牌检测与内容识别。' }
];

const SourceTriage: React.FC<SourceTriageProps> = ({ 
  routingRules,
  onUpdateRules,
  pipelineDefs,
  onUpdatePipelines
}) => {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'matrix'>('monitoring');
  
  // Monitoring State
  const [clues, setClues] = useState(INITIAL_CLUES);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>('all'); // Default to all
  const [selectedClue, setSelectedClue] = useState<typeof INITIAL_CLUES[0] | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [isHeaderDropdownOpen, setIsHeaderDropdownOpen] = useState(false);

  // Matrix Configuration State
  const [matrixSelection, setMatrixSelection] = useState<{ pipelineId: string, subPipelineId: string | null }>({
      pipelineId: '',
      subPipelineId: null
  });
  const [matrixViewMode, setMatrixViewMode] = useState<'table' | 'flow'>('table');

  // Initialize selection on load
  useEffect(() => {
      if (pipelineDefs.length > 0 && !matrixSelection.pipelineId) {
          setMatrixSelection({
              pipelineId: pipelineDefs[0].id,
              subPipelineId: pipelineDefs[0].subPipelines[0]?.id || null
          });
      }
  }, [pipelineDefs]);

  const [expandedPipelines, setExpandedPipelines] = useState<Record<string, boolean>>({}); // Toggle tree nodes
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState<Partial<RoutingRule>>({});
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);

  // --- Statistics Calculation ---
  const pipelineStats = useMemo(() => {
    return pipelineDefs.map(p => {
      const pClues = clues.filter(c => c.pipelineId === p.id);
      
      const pendingDispatch = pClues.filter(c => c.status === 'pending_dispatch').length;
      const dispatched = pClues.filter(c => ['dispatched', 'pending_operation', 'completed'].includes(c.status)).length;
      const worked = pClues.filter(c => c.status === 'completed').length;
      const pendingWork = pClues.filter(c => ['dispatched', 'pending_operation'].includes(c.status)).length;

      return {
        ...p,
        stats: {
          total: pClues.length,
          pendingDispatch,
          dispatched,
          worked,
          pendingWork
        }
      };
    });
  }, [clues, pipelineDefs]);

  // Overall Stats
  const overallStats = useMemo(() => {
      const pendingDispatch = clues.filter(c => c.status === 'pending_dispatch').length;
      const dispatched = clues.filter(c => ['dispatched', 'pending_operation', 'completed'].includes(c.status)).length;
      const worked = clues.filter(c => c.status === 'completed').length;
      const pendingWork = clues.filter(c => ['dispatched', 'pending_operation'].includes(c.status)).length;
      return { total: clues.length, pendingDispatch, dispatched, worked, pendingWork };
  }, [clues]);

  // --- Filtering Logic ---
  const displayClues = useMemo(() => {
    if (!selectedPipelineId || selectedPipelineId === 'all') {
        return clues;
    }
    return clues.filter(c => c.pipelineId === selectedPipelineId);
  }, [clues, selectedPipelineId]);

  const activePipelineName = selectedPipelineId && selectedPipelineId !== 'all' 
    ? pipelineDefs.find(p => p.id === selectedPipelineId)?.name 
    : '全部产线汇总';

  // --- Matrix Logic ---
  const filteredMatrixRules = useMemo(() => {
      if (!matrixSelection.pipelineId) return [];
      return routingRules.filter(r => {
          const matchPipeline = r.targetPipelineId === matrixSelection.pipelineId;
          const matchSub = matrixSelection.subPipelineId 
              ? r.targetSubPipelineId === matrixSelection.subPipelineId
              : true; 
          return matchPipeline && matchSub;
      });
  }, [routingRules, matrixSelection]);

  const activeMatrixPipeline = pipelineDefs.find(p => p.id === matrixSelection.pipelineId);
  const activeMatrixSubPipeline = activeMatrixPipeline?.subPipelines.find(s => s.id === matrixSelection.subPipelineId);

  // --- Actions ---
  const handleDispatch = () => {
    if (!selectedClue) return;
    setIsDispatching(true);
    setTimeout(() => {
        setClues(prev => prev.map(c => 
            c.id === selectedClue.id 
            ? { ...c, status: 'dispatched' } 
            : c
        ));
        setSelectedClue(prev => prev ? { ...prev, status: 'dispatched' } : null);
        setIsDispatching(false);
    }, 1000);
  };

  // Matrix Actions
  const handleSaveRule = () => {
    if (currentRule.id) {
        // Update existing
        onUpdateRules(routingRules.map(r => r.id === currentRule.id ? { ...r, ...currentRule } as RoutingRule : r));
    } else {
        // Create new
        const newRule: RoutingRule = {
            id: `RR-${Date.now()}`,
            name: currentRule.name || 'New Rule',
            conditionDescription: currentRule.conditionDescription || 'Default Condition',
            targetPipelineId: currentRule.targetPipelineId || matrixSelection.pipelineId, // Enforce context
            targetPipelineName: pipelineDefs.find(p => p.id === (currentRule.targetPipelineId || matrixSelection.pipelineId))?.name || 'Unknown',
            targetSubPipelineId: currentRule.targetSubPipelineId || matrixSelection.subPipelineId || undefined, // Enforce context
            targetSubPipelineName: activeMatrixPipeline?.subPipelines.find(s => s.id === (currentRule.targetSubPipelineId || matrixSelection.subPipelineId))?.name,
            active: currentRule.active ?? true,
            mode: currentRule.mode || 'auto',
            priority: currentRule.priority || 'medium',
            weight: currentRule.weight || 50
        };
        onUpdateRules([...routingRules, newRule]);
    }
    setIsRuleModalOpen(false);
  };

  const handleDeleteRule = (id: string) => {
      if(confirm('确定要删除这条路由规则吗？')) {
          onUpdateRules(routingRules.filter(r => r.id !== id));
      }
  };

  const handleImportPipeline = (capability: typeof AVAILABLE_CAPABILITIES[0]) => {
      const newPipeline: PipelineDef = {
          id: `pipe-${Date.now()}`,
          name: capability.name,
          status: 'active',
          iconName: 'Box',
          subPipelines: [
              { id: `sub-${Date.now()}-main`, name: '默认作业流程', nodes: [] }
          ]
      };
      onUpdatePipelines([...pipelineDefs, newPipeline]);
      setIsPipelineModalOpen(false);
  };

  const togglePipelineExpand = (pid: string) => {
      setExpandedPipelines(prev => ({ ...prev, [pid]: !prev[pid] }));
  };

  // Helper to get pipeline icon
  const getPipelineIcon = (id: string) => {
      if (id === 'road') return GitFork;
      if (id === 'poi') return MapPin;
      if (id === 'admin') return Landmark;
      return Database;
  };

  // Helper for Status Badge in List
  const StatusBadge = ({ status }: { status: string }) => {
      if (status === 'pending_dispatch') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">待分发</span>;
      if (status === 'dispatched' || status === 'pending_operation') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200">已分发</span>;
      if (status === 'completed') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-600 border border-green-200">已作业</span>;
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500">未知</span>;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden relative">
      {/* Header */}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shadow-sm shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900">线索与路由</h1>
          <p className="text-xs text-slate-500">基于价值评估规则的智能产线分发中心。</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('monitoring')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center ${activeTab === 'monitoring' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Activity size={14} className="mr-2" />
              实时线索监控
            </button>
            <button 
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center ${activeTab === 'matrix' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Workflow size={14} className="mr-2" />
              路由矩阵配置
            </button>
        </div>
      </div>

      {activeTab === 'monitoring' && (
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Panel: Pipeline List & Stats */}
        {/* Strict Layout: 1. Filter, 2. Stats, 3. List */}
        <div className="w-[340px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-10">
            
            {/* 1. Filter Conditions */}
            <div className="p-4 border-b border-slate-100 bg-white">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                        type="text" 
                        placeholder="搜索产线..." 
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all focus:bg-white"
                    />
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                
                {/* 3. Pipeline List */}
                <div className="space-y-3">
                    {pipelineStats.map(p => {
                        const Icon = getPipelineIcon(p.id);
                        const isSelected = selectedPipelineId === p.id;
                        return (
                            <div 
                                key={p.id}
                                onClick={() => { setSelectedPipelineId(p.id); setSelectedClue(null); }}
                                className={`rounded-xl border p-4 cursor-pointer transition-all hover:shadow-sm ${
                                    isSelected 
                                    ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500 relative z-10' 
                                    : 'bg-white border-slate-200 hover:border-blue-300'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center">
                                        <div className={`p-1.5 rounded-lg mr-2 transition-colors ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                            <Icon size={16} />
                                        </div>
                                        <div>
                                            <div className={`text-sm font-bold ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{p.name}</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">
                                                {p.subPipelines.length} 子流程 • {p.stats.total} Total
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-xs font-bold ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>{p.stats.total}</div>
                                    </div>
                                </div>

                                {/* Mini Stats Bar */}
                                <div className="space-y-3">
                                    {/* Pending Dispatch */}
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-slate-500 font-medium">待分发</span>
                                        <div className="flex items-center flex-1 mx-3">
                                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${p.stats.total ? (p.stats.pendingDispatch / p.stats.total) * 100 : 0}%` }}></div>
                                            </div>
                                        </div>
                                        <span className={`font-bold ${p.stats.pendingDispatch > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{p.stats.pendingDispatch}</span>
                                    </div>
                                    
                                    {/* Work Status */}
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-slate-500 font-medium">作业进度</span>
                                        <div className="flex items-center space-x-1">
                                            <span className="text-slate-400" title="未作业">{p.stats.pendingWork}</span>
                                            <span className="text-slate-300">/</span>
                                            <span className="text-green-600 font-bold" title="已作业">{p.stats.worked}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* Center Panel: Clue List */}
        <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
            {/* List Header */}
            <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
                <div className="relative">
                    <button 
                        onClick={() => setIsHeaderDropdownOpen(!isHeaderDropdownOpen)}
                        className="flex items-center text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors focus:outline-none"
                    >
                        {selectedPipelineId && selectedPipelineId !== 'all' ? (
                            <>
                                {React.createElement(getPipelineIcon(selectedPipelineId), { size: 16, className: 'mr-2 text-blue-600' })}
                                {activePipelineName}
                            </>
                        ) : (
                            <>
                                <ListFilter size={16} className="mr-2 text-slate-500"/>
                                全部线索列表
                            </>
                        )}
                        <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs font-medium">{displayClues.length}</span>
                        <ChevronDown size={14} className={`ml-2 text-slate-400 transition-transform duration-200 ${isHeaderDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isHeaderDropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsHeaderDropdownOpen(false)}></div>
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                                <button
                                    onClick={() => { setSelectedPipelineId('all'); setSelectedClue(null); setIsHeaderDropdownOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center hover:bg-slate-50 transition-colors ${selectedPipelineId === 'all' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'}`}
                                >
                                    <ListFilter size={16} className={`mr-2 ${selectedPipelineId === 'all' ? 'text-blue-500' : 'text-slate-400'}`}/>
                                    全部线索列表
                                    {selectedPipelineId === 'all' && <CheckCircle2 size={14} className="ml-auto text-blue-600" />}
                                </button>
                                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                    {pipelineStats.map(p => {
                                         const Icon = getPipelineIcon(p.id);
                                         const isSelected = selectedPipelineId === p.id;
                                         return (
                                            <button
                                                key={p.id}
                                                onClick={() => { setSelectedPipelineId(p.id); setSelectedClue(null); setIsHeaderDropdownOpen(false); }}
                                                className={`w-full text-left px-4 py-2.5 text-sm flex items-center hover:bg-slate-50 transition-colors ${isSelected ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'}`}
                                            >
                                                <Icon size={16} className={`mr-2 ${isSelected ? 'text-blue-500' : 'text-slate-400'}`}/>
                                                <div className="flex-1 flex justify-between items-center">
                                                    <span>{p.name}</span>
                                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{p.stats.total}</span>
                                                </div>
                                                {isSelected && <CheckCircle2 size={14} className="ml-2 text-blue-600" />}
                                            </button>
                                         );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>
                
                <div className="flex items-center space-x-2">
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500"><Filter size={16}/></button>
                    <div className="h-4 w-px bg-slate-200"></div>
                    <select className="bg-transparent text-xs font-medium text-slate-600 outline-none cursor-pointer hover:text-blue-600">
                        <option>最近更新</option>
                        <option>置信度 (High to Low)</option>
                    </select>
                </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {displayClues.map(clue => (
                    <div 
                        key={clue.id}
                        onClick={() => setSelectedClue(clue)}
                        className={`bg-white border rounded-lg p-5 cursor-pointer transition-all hover:shadow-md group ${
                            selectedClue?.id === clue.id 
                            ? 'border-blue-500 ring-1 ring-blue-100 shadow-md relative z-10' 
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-3">
                                <StatusBadge status={clue.status} />
                                <span className="text-xs text-slate-400 flex items-center font-mono">
                                    <Clock size={10} className="mr-1" /> {clue.time}
                                </span>
                                <span className="text-[10px] text-slate-300 font-mono">ID: {clue.id}</span>
                            </div>
                            {clue.status === 'pending_dispatch' && (
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            )}
                        </div>
                        
                        <h4 className="text-sm font-bold text-slate-800 mb-4 line-clamp-2 leading-relaxed group-hover:text-blue-700 transition-colors">
                            {clue.content}
                        </h4>
                        
                        <div className="flex justify-between items-end pt-3 border-t border-slate-50">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center text-xs text-slate-500 font-medium">
                                    <clue.sourceIcon size={12} className="mr-1.5 text-slate-400" />
                                    {clue.sourceName}
                                </div>
                                <div className="flex gap-1.5">
                                    {clue.tags?.map(t => (
                                        <span key={t} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-500 font-medium">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <div className="text-[10px] text-slate-400 font-medium">
                                    AI 置信度: <span className={`font-bold ${clue.confidence > 90 ? 'text-green-600' : 'text-amber-600'}`}>{clue.confidence}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {displayClues.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 pb-20">
                        <div className="p-4 bg-slate-100 rounded-full mb-3">
                            <Inbox size={32} className="opacity-50 text-slate-500"/>
                        </div>
                        <p className="text-sm font-medium text-slate-600">暂无符合条件的线索</p>
                        <p className="text-xs text-slate-400 mt-1">请尝试切换产线或调整筛选条件</p>
                    </div>
                )}
            </div>
        </div>

        {/* Right Drawer: Detail View */}
        <div className={`w-[400px] bg-white border-l border-slate-200 shadow-2xl z-20 transition-transform duration-300 flex flex-col ${selectedClue ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full'}`}>
            {selectedClue ? (
                <>
                    <div className="h-14 border-b border-slate-200 flex items-center justify-between px-5 bg-slate-50/50 shrink-0">
                        <span className="font-bold text-slate-800 text-sm flex items-center">
                            <FileText size={16} className="mr-2 text-blue-600"/>
                            线索详情
                        </span>
                        <button onClick={() => setSelectedClue(null)} className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Status Card */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <StatusBadge status={selectedClue.status} />
                                <span className="text-xs text-slate-400 font-mono">#{selectedClue.id}</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">目标产线</span>
                                    <span className="font-bold text-slate-800">{selectedClue.pipelineLabel}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">子流程</span>
                                    <span className="font-mono text-slate-700 bg-slate-50 px-1.5 rounded">{selectedClue.subPipelineId}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">路由模式</span>
                                    <span className="uppercase font-bold text-slate-700">{selectedClue.ruleMode}</span>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center">
                                线索内容
                            </h4>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 leading-relaxed shadow-inner">
                                {selectedClue.content}
                            </div>
                        </div>

                        {/* Metadata */}
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center">
                                元数据
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200">
                                    <div className="flex items-center text-xs text-slate-700 font-medium">
                                        <selectedClue.sourceIcon size={14} className="mr-2 text-slate-400"/>
                                        {selectedClue.sourceName}
                                    </div>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Source</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200">
                                    <div className="flex items-center text-xs text-slate-700 font-medium">
                                        <Clock size={14} className="mr-2 text-slate-400"/>
                                        {selectedClue.date} <span className="text-slate-400 mx-1">|</span> {selectedClue.time}
                                    </div>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Time</span>
                                </div>
                            </div>
                        </div>

                        {/* AI Analysis */}
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center">
                                AI 智能分析
                            </h4>
                            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-indigo-800 font-bold">置信度评分</span>
                                    <span className="text-sm font-bold text-indigo-700">{selectedClue.confidence}%</span>
                                </div>
                                <div className="w-full h-2 bg-indigo-200/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${selectedClue.confidence}%` }}></div>
                                </div>
                                <div className="pt-1 flex flex-wrap gap-2">
                                    {selectedClue.tags.map(t => (
                                        <span key={t} className="text-[10px] bg-white text-indigo-600 px-2 py-1 rounded border border-indigo-100 font-medium shadow-sm">
                                            #{t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* User Feedback */}
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center">
                                反馈 (Feedback)
                            </h4>
                            <div className="bg-white border border-slate-200 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs text-slate-600">数据质量评价:</span>
                                    <div className="flex space-x-2">
                                        <button className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-50 hover:bg-green-50 text-slate-500 hover:text-green-600 border border-slate-200 hover:border-green-200 transition-colors text-xs">
                                            <ThumbsUp size={12} />
                                            <span>有用</span>
                                        </button>
                                        <button className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-colors text-xs">
                                            <ThumbsDown size={12} />
                                            <span>报错</span>
                                        </button>
                                    </div>
                                </div>
                                <textarea 
                                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-400 placeholder:text-slate-400 resize-none"
                                    rows={2}
                                    placeholder="可选：描述具体问题或建议..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-slate-200 bg-white shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
                        {selectedClue.status === 'pending_dispatch' ? (
                            <div className="grid grid-cols-2 gap-3">
                                <button className="py-2.5 px-4 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors hover:border-slate-400">
                                    忽略 / 归档
                                </button>
                                <button 
                                    onClick={handleDispatch}
                                    disabled={isDispatching}
                                    className="py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-md shadow-blue-100 transition-colors flex items-center justify-center disabled:opacity-70"
                                >
                                    {isDispatching ? <Loader2 size={16} className="animate-spin mr-2"/> : <Send size={16} className="mr-2"/>}
                                    {isDispatching ? '分发中...' : '确认分发'}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-2 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-lg border border-slate-100 border-dashed">
                                <CheckCircle2 size={24} className="mb-2 text-green-500 opacity-50"/>
                                <span className="text-xs">此线索已进入后续作业流程</span>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-full text-slate-400 bg-slate-50/50">
                    <p className="text-sm font-medium">选择一条线索查看详情</p>
                </div>
            )}
        </div>

      </div>
      )}

      {activeTab === 'matrix' && (
          <div className="flex-1 flex bg-slate-50 overflow-hidden">
              {/* Left Panel: Pipeline Hierarchy */}
              <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                      <h2 className="text-sm font-bold text-slate-800">产线管理</h2>
                      <button 
                        onClick={() => setIsPipelineModalOpen(true)}
                        className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors"
                        title="引入新产线"
                      >
                          <Plus size={16} />
                      </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-1">
                      {pipelineDefs.map(p => {
                          const isExpanded = expandedPipelines[p.id] ?? true;
                          const isSelectedMain = matrixSelection.pipelineId === p.id && !matrixSelection.subPipelineId;
                          
                          return (
                          <div key={p.id} className="space-y-1">
                              {/* Main Pipeline Item */}
                              <div 
                                onClick={() => {
                                    togglePipelineExpand(p.id);
                                    // Optionally select main pipeline context
                                    // setMatrixSelection({ pipelineId: p.id, subPipelineId: null });
                                }}
                                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors group ${isSelectedMain ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-700'}`}
                              >
                                  <div className="flex items-center">
                                      <span className={`mr-2 transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                                          <ChevronRight size={14} className="text-slate-400" />
                                      </span>
                                      <span className="text-sm font-bold">{p.name}</span>
                                  </div>
                                  <div className={`w-2 h-2 rounded-full ${p.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                              </div>

                              {/* Sub Pipelines */}
                              {isExpanded && (
                                  <div className="pl-6 space-y-1 border-l border-slate-100 ml-4">
                                      {p.subPipelines.map(sub => {
                                          const isSubSelected = matrixSelection.pipelineId === p.id && matrixSelection.subPipelineId === sub.id;
                                          return (
                                              <div 
                                                key={sub.id}
                                                onClick={() => setMatrixSelection({ pipelineId: p.id, subPipelineId: sub.id })}
                                                className={`flex items-center p-2 rounded-md cursor-pointer text-xs font-medium transition-all ${
                                                    isSubSelected 
                                                    ? 'bg-blue-600 text-white shadow-sm' 
                                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                                }`}
                                              >
                                                  <div className={`w-1.5 h-1.5 rounded-full mr-2 ${isSubSelected ? 'bg-white' : 'bg-slate-300'}`}></div>
                                                  {sub.name}
                                              </div>
                                          );
                                      })}
                                      {p.subPipelines.length === 0 && (
                                          <div className="p-2 text-[10px] text-slate-400 italic">暂无子流程</div>
                                      )}
                                  </div>
                              )}
                          </div>
                      )})}
                  </div>
              </div>

              {/* Main Content: Routing Rules Table / Flow */}
              <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
                  <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
                      <div className="flex items-center">
                          <Sliders size={18} className="mr-3 text-blue-600"/>
                          <div className="flex flex-col">
                              <h2 className="text-sm font-bold text-slate-800">
                                  {activeMatrixSubPipeline ? `路由规则配置: ${activeMatrixSubPipeline.name}` : activeMatrixPipeline ? `路由规则配置: ${activeMatrixPipeline.name}` : '请选择子流程'}
                              </h2>
                              <div className="flex items-center text-[10px] text-slate-500 space-x-1">
                                  <span>{activeMatrixPipeline?.name}</span>
                                  <ChevronRight size={10} />
                                  <span>{activeMatrixSubPipeline?.name || 'All'}</span>
                              </div>
                          </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                          <div className="flex bg-slate-100 p-1 rounded-lg">
                              <button 
                                onClick={() => setMatrixViewMode('table')}
                                className={`p-1.5 rounded transition-all ${matrixViewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                                title="列表视图"
                              >
                                <LayoutList size={16} />
                              </button>
                              <button 
                                onClick={() => setMatrixViewMode('flow')}
                                className={`p-1.5 rounded transition-all ${matrixViewMode === 'flow' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                                title="流程图视图"
                              >
                                <Network size={16} />
                              </button>
                          </div>
                          <div className="h-4 w-px bg-slate-200 mx-2"></div>
                          <button 
                            onClick={() => { 
                                setCurrentRule({ 
                                    targetPipelineId: matrixSelection.pipelineId, 
                                    targetSubPipelineId: matrixSelection.subPipelineId || undefined 
                                }); 
                                setIsRuleModalOpen(true); 
                            }}
                            disabled={!matrixSelection.pipelineId}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              <Plus size={14} className="mr-1.5" /> 新增规则
                          </button>
                      </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 bg-slate-50 relative">
                      {matrixSelection.pipelineId ? (
                        matrixViewMode === 'table' ? (
                          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in">
                              <table className="w-full text-left">
                                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                                      <tr>
                                          <th className="px-6 py-3">规则名称</th>
                                          <th className="px-6 py-3">触发条件 (Source / Filter)</th>
                                          <th className="px-6 py-3">目标产线</th>
                                          <th className="px-6 py-3">分发模式</th>
                                          <th className="px-6 py-3">权重</th>
                                          <th className="px-6 py-3 text-right">操作</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 text-sm">
                                      {filteredMatrixRules.length > 0 ? (
                                          filteredMatrixRules.map(rule => (
                                              <tr key={rule.id} className="hover:bg-slate-50 group">
                                                  <td className="px-6 py-4 font-medium text-slate-900">{rule.name}</td>
                                                  <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={rule.conditionDescription}>
                                                      {rule.conditionDescription}
                                                  </td>
                                                  <td className="px-6 py-4">
                                                      <div className="flex items-center">
                                                          <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-100">
                                                              {rule.targetPipelineName}
                                                          </span>
                                                          {rule.targetSubPipelineName && (
                                                              <>
                                                                  <ChevronRight size={12} className="mx-1 text-slate-300"/>
                                                                  <span className="text-xs text-slate-500">{rule.targetSubPipelineName}</span>
                                                              </>
                                                          )}
                                                      </div>
                                                  </td>
                                                  <td className="px-6 py-4">
                                                      <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                                                          rule.mode === 'auto' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
                                                      }`}>
                                                          {rule.mode}
                                                      </span>
                                                  </td>
                                                  <td className="px-6 py-4 font-mono text-slate-500">{rule.weight}</td>
                                                  <td className="px-6 py-4 text-right">
                                                      <div className="flex items-center justify-end space-x-2">
                                                          <button 
                                                            onClick={() => { setCurrentRule(rule); setIsRuleModalOpen(true); }}
                                                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                          >
                                                              <Edit2 size={14}/>
                                                          </button>
                                                          <button 
                                                            onClick={() => handleDeleteRule(rule.id)}
                                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                          >
                                                              <Trash2 size={14}/>
                                                          </button>
                                                      </div>
                                                  </td>
                                              </tr>
                                          ))
                                      ) : (
                                          <tr>
                                              <td colSpan={6} className="px-6 py-8 text-center text-slate-400 text-sm">
                                                  此流程暂无特定路由规则
                                              </td>
                                          </tr>
                                      )}
                                  </tbody>
                              </table>
                          </div>
                        ) : (
                          // Flow View Implementation
                          <div className="h-full w-full bg-slate-100 rounded-xl border border-slate-200 relative overflow-hidden flex items-center justify-center animate-in fade-in">
                              <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ 
                                  backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', 
                                  backgroundSize: '20px 20px' 
                              }}></div>
                              
                              {filteredMatrixRules.length > 0 ? (
                                  <div className="relative w-[800px] h-[500px]">
                                      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{zIndex: 0}}>
                                          <defs>
                                              <marker id="arrowhead-flow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                                  <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                                              </marker>
                                          </defs>
                                          {filteredMatrixRules.map((rule, idx) => {
                                              const startY = 50 + idx * 100;
                                              const endY = 250; // Center target
                                              return (
                                                  <path 
                                                      key={rule.id}
                                                      d={`M 250 ${startY} C 400 ${startY}, 400 ${endY}, 550 ${endY}`}
                                                      stroke={rule.mode === 'auto' ? '#10b981' : '#f59e0b'}
                                                      strokeWidth="2"
                                                      fill="none"
                                                      markerEnd="url(#arrowhead-flow)"
                                                      strokeDasharray={rule.mode === 'manual' ? "5,5" : "0"}
                                                      className="animate-in fade-in duration-500"
                                                  />
                                              );
                                          })}
                                      </svg>

                                      {/* Left Column: Rules */}
                                      <div className="absolute left-0 top-0 bottom-0 w-[250px] flex flex-col space-y-6 pt-6">
                                          {filteredMatrixRules.map((rule, idx) => (
                                              <div 
                                                  key={rule.id} 
                                                  className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer relative group"
                                                  style={{ top: `${idx * 20}px` }} // slight offset visually if needed, but flex handles it
                                                  onClick={() => { setCurrentRule(rule); setIsRuleModalOpen(true); }}
                                              >
                                                  <div className="flex items-center justify-between mb-2">
                                                      <span className="text-xs font-bold text-slate-700 truncate w-32">{rule.name}</span>
                                                      <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold border ${rule.mode === 'auto' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                                          {rule.mode}
                                                      </span>
                                                  </div>
                                                  <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 font-mono">
                                                      {rule.conditionDescription}
                                                  </div>
                                                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-300 rounded-full border-2 border-white z-10 group-hover:bg-blue-500"></div>
                                              </div>
                                          ))}
                                      </div>

                                      {/* Right Column: Target */}
                                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[250px]">
                                          <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-lg relative">
                                              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white z-10"></div>
                                              <div className="text-xs font-bold text-blue-500 uppercase mb-1">Target Pipeline</div>
                                              <h3 className="font-bold text-slate-800 text-lg">{activeMatrixPipeline?.name}</h3>
                                              {activeMatrixSubPipeline && (
                                                  <div className="flex items-center mt-1 text-sm text-slate-600 bg-slate-50 px-2 py-1 rounded w-fit">
                                                      <GitFork size={12} className="mr-1"/>
                                                      {activeMatrixSubPipeline.name}
                                                  </div>
                                              )}
                                              <div className="mt-4 flex items-center space-x-2 text-xs text-slate-400">
                                                  <Zap size={12} />
                                                  <span>{filteredMatrixRules.length} Active Rules</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              ) : (
                                  <div className="text-center text-slate-400">
                                      <div className="bg-slate-200 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                          <Network size={24} className="opacity-50"/>
                                      </div>
                                      <p className="text-sm">暂无规则配置</p>
                                      <button 
                                          onClick={() => { setCurrentRule({ targetPipelineId: matrixSelection.pipelineId, targetSubPipelineId: matrixSelection.subPipelineId || undefined }); setIsRuleModalOpen(true); }}
                                          className="text-blue-600 text-xs font-bold hover:underline mt-2"
                                      >
                                          创建第一条规则
                                      </button>
                                  </div>
                              )}
                          </div>
                        )
                      ) : (
                          <div className="flex h-full items-center justify-center text-slate-400">
                              <div className="text-center">
                                  <LayoutList size={48} className="mx-auto mb-4 opacity-20" />
                                  <p>请在左侧选择一个子流程以配置规则</p>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* --- Modals --- */}

      {/* Rule Editor Modal */}
      {isRuleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-xl shadow-2xl w-[600px] overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800">{currentRule.id ? '编辑路由规则' : '新增路由规则'}</h3>
                      <button onClick={() => setIsRuleModalOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                  </div>
                  <div className="p-6 space-y-5">
                      {/* Context Info */}
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center mb-2">
                          <Workflow size={16} className="text-blue-600 mr-2" />
                          <div className="text-sm text-blue-900">
                              正在为 <span className="font-bold">{activeMatrixPipeline?.name}</span>
                              {activeMatrixSubPipeline ? ` / ${activeMatrixSubPipeline.name}` : ''} 配置规则
                          </div>
                      </div>

                      {/* Basic Info */}
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">规则名称</label>
                          <input 
                              type="text" 
                              value={currentRule.name || ''} 
                              onChange={e => setCurrentRule({...currentRule, name: e.target.value})}
                              className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none"
                              placeholder="e.g. 高优先级卫星影像分发"
                          />
                      </div>
                      
                      {/* Source & Condition */}
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">资料来源与条件</label>
                          <div className="flex gap-3 mb-2">
                              <select className="w-1/3 px-3 py-2 border border-slate-200 rounded text-sm bg-white outline-none">
                                  <option>API 接口</option>
                                  <option>数据库同步</option>
                                  <option>文件上传</option>
                              </select>
                              <input 
                                  type="text" 
                                  value={currentRule.conditionDescription || ''}
                                  onChange={e => setCurrentRule({...currentRule, conditionDescription: e.target.value})}
                                  className="flex-1 px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none"
                                  placeholder="条件表达式 (e.g. Type=Image AND Cloud<10%)"
                              />
                          </div>
                      </div>

                      {/* Routing Config - Read Only / Hidden logic for simplification based on context */}
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">分发模式</label>
                              <div className="flex space-x-4 mt-1">
                                  <label className="flex items-center cursor-pointer">
                                      <input 
                                          type="radio" 
                                          name="mode" 
                                          checked={currentRule.mode === 'auto'} 
                                          onChange={() => setCurrentRule({...currentRule, mode: 'auto'})}
                                          className="mr-2 text-blue-600"
                                      />
                                      <span className="text-sm text-slate-700">自动 (Auto)</span>
                                  </label>
                                  <label className="flex items-center cursor-pointer">
                                      <input 
                                          type="radio" 
                                          name="mode" 
                                          checked={currentRule.mode === 'manual'} 
                                          onChange={() => setCurrentRule({...currentRule, mode: 'manual'})}
                                          className="mr-2 text-blue-600"
                                      />
                                      <span className="text-sm text-slate-700">人工审核 (Manual)</span>
                                  </label>
                              </div>
                          </div>
                          
                          {/* Weight / Priority */}
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">资料权重 (Priority) - {currentRule.weight || 50}</label>
                              <input 
                                  type="range" 
                                  min="0" max="100" 
                                  value={currentRule.weight || 50}
                                  onChange={e => setCurrentRule({...currentRule, weight: parseInt(e.target.value)})}
                                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                              />
                          </div>
                      </div>
                  </div>
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
                      <button onClick={() => setIsRuleModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50">取消</button>
                      <button onClick={handleSaveRule} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">保存规则</button>
                  </div>
              </div>
          </div>
      )}

      {/* Pipeline Import Modal */}
      {isPipelineModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-xl shadow-2xl w-[600px] overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800">引入新产线 (From Annotation Square)</h3>
                      <button onClick={() => setIsPipelineModalOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                  </div>
                  <div className="p-6">
                      <p className="text-sm text-slate-500 mb-4">请选择基于已有标注能力的作业规范来创建新的数据产线：</p>
                      <div className="space-y-3">
                          {AVAILABLE_CAPABILITIES.map(cap => (
                              <div key={cap.id} className="flex items-start p-3 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer group transition-all"
                                   onClick={() => handleImportPipeline(cap)}
                              >
                                  <div className="p-2 bg-white rounded-md border border-slate-100 mr-3 text-blue-600">
                                      <Briefcase size={20} />
                                  </div>
                                  <div className="flex-1">
                                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-700">{cap.name}</h4>
                                      <p className="text-xs text-slate-500 mt-1">{cap.description}</p>
                                  </div>
                                  <div className="self-center">
                                      <button className="px-3 py-1 bg-white border border-blue-200 text-blue-600 rounded text-xs font-medium hover:bg-blue-600 hover:text-white transition-colors">
                                          引入
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default SourceTriage;
