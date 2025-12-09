
import React, { useState, useEffect } from 'react';
import { 
  Briefcase,
  Layers,
  ChevronDown,
  ChevronRight,
  Database,
  Cpu,
  CheckSquare,
  Settings,
  ArrowRight,
  Save,
  Search,
  Plus,
  Box,
  CheckCircle2,
  Map as MapIcon,
  Filter,
  Clock,
  Zap,
  Users,
  ShieldCheck,
  MousePointer2,
  FileText,
  Check,
  Landmark,
  FileBadge,
  ScanLine,
  LayoutGrid,
  ArrowLeft,
  MoreHorizontal,
  Workflow,
  Book,
  ExternalLink,
  Edit3,
  PenTool,
  Image as ImageIcon,
  Type,
  List
} from 'lucide-react';
import { PipelineDef } from '../types';

interface JobRepositoryProps {
  pipelineDefs: PipelineDef[];
  onUpdatePipelines: (pipelines: PipelineDef[]) => void;
}

// --- Data Models ---

interface Scenario {
  id: string;
  name: string;
  status: 'active' | 'draft';
  description?: string;
  lastUpdate?: string;
  linkedSopId?: string; // Link to SOP
}

interface ProductLine {
  id: string;
  name: string;
  icon: any;
  scenarios: Scenario[];
}

interface SOPDef {
  id: string;
  name: string;
  type: 'admin' | 'road' | 'poi' | 'general';
  lastModified: string;
  stages: { id: string; name: string; role: string; icon: any }[];
}

// --- Mock Data ---

const SOP_LIBRARY: SOPDef[] = [
  {
    id: 'sop-road-v3',
    name: '道路矢量化标准作业程序 v3.0',
    type: 'road',
    lastModified: '2 days ago',
    stages: [
      { id: 's1', name: '数据准备', role: 'System', icon: Database },
      { id: 's2', name: '人工采集', role: 'Worker', icon: MousePointer2 },
      { id: 's3', name: '质检', role: 'Inspector', icon: CheckCircle2 },
      { id: 's4', name: '入库', role: 'System', icon: Save },
    ]
  },
  {
    id: 'sop-admin-boundary-v1',
    name: '行政区划界线勘定 SOP v1.0',
    type: 'admin',
    lastModified: '1 week ago',
    stages: [
      { id: 's1', name: '公文解析', role: 'System', icon: FileText },
      { id: 's2', name: '边界标绘', role: 'Expert', icon: PenTool },
      { id: 's3', name: '多级审核', role: 'Inspector', icon: ShieldCheck },
      { id: 's4', name: '发布', role: 'System', icon: CheckCircle2 },
    ]
  },
  {
    id: 'sop-poi-mining',
    name: 'POI 数据清洗与融合规范',
    type: 'poi',
    lastModified: '3 days ago',
    stages: [
      { id: 's1', name: '多源接入', role: 'System', icon: Database },
      { id: 's2', name: '信息补全', role: 'Worker', icon: Edit3 },
      { id: 's3', name: '合规检查', role: 'Inspector', icon: CheckCircle2 },
    ]
  }
];

const TREE_DATA: ProductLine[] = [
  {
    id: 'pl-road',
    name: '路网数据 (Road Network)',
    icon: Layers,
    scenarios: [
      { id: 'sc-road-new', name: '道路新增发现 (New Discovery)', status: 'active', description: '基于高频卫星影像，自动识别新增道路及其几何属性。', lastUpdate: '2h ago', linkedSopId: 'sop-road-v3' },
      { id: 'sc-road-attr', name: '属性变更更新 (Attribute Update)', status: 'active', description: '针对存量路网，检测车道数、限速等属性变化。', lastUpdate: '1d ago', linkedSopId: 'sop-road-v3' },
      { id: 'sc-road-3d', name: '车道线矢量化 (Lane Vectorization)', status: 'draft', description: '高精地图生产，提取车道边线与中心线。', lastUpdate: '3d ago', linkedSopId: 'sop-road-v3' },
    ]
  },
  {
    id: 'pl-poi',
    name: '兴趣点 (POI)',
    icon: MapIcon,
    scenarios: [
      { id: 'sc-poi-mining', name: 'POI 挖掘与清洗', status: 'active', description: '互联网多源数据清洗与去重，生成候选 POI 集合。', lastUpdate: '5h ago', linkedSopId: 'sop-poi-mining' },
      { id: 'sc-poi-brand', name: '品牌连锁匹配', status: 'active', description: '针对连锁品牌进行标准化名称与类别挂接。', lastUpdate: '2d ago', linkedSopId: 'sop-poi-mining' },
    ]
  },
  {
    id: 'pl-admin',
    name: '行政区划 (Admin)',
    icon: Box,
    scenarios: [
      { id: 'sc-admin-adj', name: '区划边界调整', status: 'draft', description: '基于民政公文与红头文件，调整行政区划边界几何。', lastUpdate: 'Just now', linkedSopId: 'sop-admin-boundary-v1' },
    ]
  }
];

const STEPS = [
  { id: 'source', label: '监听与触发', subLabel: 'Listen & Trigger', icon: Database },
  { id: 'ai', label: '智能处理配置', subLabel: 'AI Processing', icon: Cpu },
  { id: 'task', label: '作业 SOP 引用', subLabel: 'SOP Reference', icon: Briefcase },
  { id: 'eval', label: '准入评测标准', subLabel: 'Gatekeeping', icon: CheckSquare },
];

const JobRepository: React.FC<JobRepositoryProps> = ({ pipelineDefs, onUpdatePipelines }) => {
  // Navigation State
  const [viewMode, setViewMode] = useState<'overview' | 'pipeline' | 'sop'>('overview');
  const [selectedId, setSelectedId] = useState<string | null>(null); // Can be Scenario ID or SOP ID
  const [activeStep, setActiveStep] = useState<string>('source');
  
  // UI State
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({'pl-road': true, 'pl-poi': true, 'pl-admin': true, 'sop-lib': true});

  // Helpers
  const getActiveScenario = () => {
    if (viewMode !== 'pipeline') return null;
    for (const pl of TREE_DATA) {
      const found = pl.scenarios.find(s => s.id === selectedId);
      if (found) return found;
    }
    return null;
  };

  const getActiveSOP = () => {
    if (viewMode === 'sop') {
      return SOP_LIBRARY.find(s => s.id === selectedId);
    }
    // If in pipeline mode, find the SOP linked to the active scenario
    const scenario = getActiveScenario();
    if (scenario && scenario.linkedSopId) {
      return SOP_LIBRARY.find(s => s.id === scenario.linkedSopId);
    }
    return null;
  };

  const activeScenario = getActiveScenario();
  const activeSOP = getActiveSOP();
  const isAdmin = activeScenario?.id === 'sc-admin-adj' || activeSOP?.type === 'admin';

  const currentStepIndex = STEPS.findIndex(s => s.id === activeStep);
  const nextStep = STEPS[currentStepIndex + 1];
  const prevStep = STEPS[currentStepIndex - 1];

  // Configuration State (Pipeline)
  const [pipelineConfig, setPipelineConfig] = useState({
    // Step 1: Source
    sourceHubStream: true,
    sourceGovStream: true,
    sourceFilterTags: isAdmin ? '行政变更, 撤销设立, 界线调整' : '道路施工, 地物变化',
    triggerFreq: 'realtime',
    batchTime: '02:00',
    // Step 2: AI
    aiModel: isAdmin ? 'doc-intelligence-v2' : 'sam-2-huge',
    aiAdapter: isAdmin ? 'Admin-Policy-Adapter' : 'Road-Adapter-v1',
    aiPrompt: isAdmin ? 'Extract administrative boundary changes and coordinates from official documents.' : 'Extract asphalt roads',
    paramMapping: true,
    // Step 3: SOP Reference
    selectedSopId: isAdmin ? 'sop-admin-boundary-v1' : 'sop-road-v3',
    // Step 4: Eval
    ruleNoDangle: true,
    ruleNoIntersect: true,
    thresholdConfidence: 0.8,
    thresholdPassRate: 98,
  });

  // Configuration State (SOP Editor)
  const [sopConfig, setSopConfig] = useState({
    toolsTopology: true,
    toolsMagicWand: true,
    distSkillGroup: isAdmin ? 'senior-admin-specialist' : 'senior-road-worker',
    instructions: isAdmin 
      ? `## 行政区划作业规范 (Admin Boundary SOP)\n\n1. **依据文件**：\n   - 必须严格遵循民政局发布的红头文件，优先参考附带的界桩坐标。\n   - 公文中的文字描述具有最高优先级。\n\n2. **边界对齐**：\n   - 优先沿河流中心线、道路中心线绘制。\n   - 不得穿越保留建筑（如政府大楼、学校）。\n\n3. **拓扑检查**：\n   - 严禁重叠 (Overlap) 与 缝隙 (Gap)。\n   - 所有多边形必须闭合。`
      : `## 路网采集作业规范 (Road Network SOP)\n\n1. **几何精度**：\n   - 道路中线需位于路面几何中心，偏差 < 20cm。\n2. **属性录入**：\n   - 必须填写完整路名，参照路牌。\n   - 车道数需区分双向。\n3. **特殊情况**：\n   - 遇到立交桥，需分层绘制并标记层级 (Level).`
  });

  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConfigChange = (key: string, value: any) => {
    setPipelineConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSopConfigChange = (key: string, value: any) => {
    setSopConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleNavigate = (mode: 'overview' | 'pipeline' | 'sop', id: string | null, step: string = 'source') => {
      setViewMode(mode);
      setSelectedId(id);
      setActiveStep(step);
  };

  // --- Renderers ---

  const renderConfigForm = () => {
    switch (activeStep) {
      case 'source':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Data Source Selection */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
                <Database size={16} className="mr-2 text-blue-600"/> 数据源订阅
              </h4>
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                {isAdmin ? (
                    <>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={pipelineConfig.sourceGovStream}
                                onChange={(e) => handleConfigChange('sourceGovStream', e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                            />
                            <div className="flex items-center">
                                <Landmark size={16} className="mr-2 text-slate-500" />
                                <span className="text-sm text-slate-700">民政局公文流 (Gov Document Stream)</span>
                            </div>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={pipelineConfig.sourceHubStream}
                                onChange={(e) => handleConfigChange('sourceHubStream', e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                            />
                            <div className="flex items-center">
                                <ScanLine size={16} className="mr-2 text-slate-500" />
                                <span className="text-sm text-slate-700">规划图红线扫描件 (Planning Raster)</span>
                            </div>
                        </label>
                    </>
                ) : (
                    <>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={pipelineConfig.sourceHubStream}
                                onChange={(e) => handleConfigChange('sourceHubStream', e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                            />
                            <span className="text-sm text-slate-700">源资集市.影像流 (Source Hub Image Stream)</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer opacity-60">
                            <input type="checkbox" disabled className="w-4 h-4 text-slate-400 rounded border-slate-300"/>
                            <span className="text-sm text-slate-500">互联网舆情 (待接入)</span>
                        </label>
                    </>
                )}
              </div>
            </div>
            {/* ... Other Source Configs ... */}
          </div>
        );
      
      case 'ai':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Model Binding */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
                <Cpu size={16} className="mr-2 text-purple-600"/> 绑定模型
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Foundation Model</label>
                  <select 
                    value={pipelineConfig.aiModel}
                    onChange={(e) => handleConfigChange('aiModel', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-purple-500 outline-none"
                  >
                    {isAdmin ? (
                        <>
                            <option value="doc-intelligence-v2">DocMaster v2 (NLP/OCR)</option>
                            <option value="vector-ai-pro">GeoVector Pro (Raster-to-Vector)</option>
                        </>
                    ) : (
                        <>
                            <option value="sam-2-huge">SAM 2 (Huge) - Segmentation</option>
                            <option value="gemini-pro-vision">Gemini Pro Vision</option>
                        </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Adapter / LoRA</label>
                  <select 
                    value={pipelineConfig.aiAdapter}
                    onChange={(e) => handleConfigChange('aiAdapter', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-purple-500 outline-none"
                  >
                    {isAdmin ? (
                        <>
                            <option value="Admin-Policy-Adapter">Admin-Policy-Adapter (Gov Policies)</option>
                            <option value="Legal-Text-Adapter">Legal-Text-Adapter</option>
                        </>
                    ) : (
                        <>
                            <option value="Road-Adapter-v1">Road-Adapter-v1 (Asphalt)</option>
                            <option value="General-Adapter">General Purpose</option>
                        </>
                    )}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'task': // SOP Reference Step
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             {/* Header */}
             <div className="flex justify-between items-end mb-2">
                <div>
                    <h4 className="text-sm font-bold text-slate-800 flex items-center">
                        <Briefcase size={16} className="mr-2 text-orange-600"/> 
                        作业 SOP 引用 (SOP Reference)
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">选择并挂载已定义的标准作业程序。</p>
                </div>
                <button 
                    onClick={() => handleNavigate('sop', pipelineConfig.selectedSopId)}
                    className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1.5 rounded hover:bg-orange-100 flex items-center font-bold transition-colors"
                >
                    <Edit3 size={12} className="mr-1"/> 编辑当前 SOP
                </button>
             </div>

             {/* SOP Selector */}
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">选择 SOP 模板</label>
                <div className="relative">
                    <select 
                        value={pipelineConfig.selectedSopId}
                        onChange={(e) => handleConfigChange('selectedSopId', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-orange-500 outline-none appearance-none font-medium shadow-sm"
                    >
                        {SOP_LIBRARY.map(sop => (
                            <option key={sop.id} value={sop.id}>{sop.name}</option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                </div>
             </div>

             {/* Read-Only Preview of Selected SOP */}
             {activeSOP && (
                 <div className="bg-white border border-slate-200 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 bg-slate-50 border-b border-slate-100 px-4 py-2 text-[10px] font-bold text-slate-500 uppercase w-full flex justify-between">
                        <span>Workflow Preview: {activeSOP.name}</span>
                        <span className="text-slate-400">Read Only</span>
                    </div>
                    <div className="mt-8 flex items-center justify-between relative px-4">
                        {/* Connecting Line */}
                        <div className="absolute top-5 left-10 right-10 h-0.5 bg-slate-200 -z-10"></div>
                        
                        {activeSOP.stages.map((node, idx) => (
                            <div key={node.id} className="flex flex-col items-center group opacity-80">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white bg-white text-slate-500 shadow-sm mb-2 relative z-10">
                                    <node.icon size={16} />
                                </div>
                                <span className="text-xs font-bold text-slate-600">{node.name}</span>
                                <span className="text-[9px] text-slate-400 bg-slate-50 px-1.5 rounded mt-1">{node.role}</span>
                            </div>
                        ))}
                    </div>
                 </div>
             )}
          </div>
        );

      case 'eval':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Thresholds */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
                <CheckCircle2 size={16} className="mr-2 text-emerald-600"/> 通过阈值
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">AI 置信度 ( &gt; {pipelineConfig.thresholdConfidence})</label>
                  <input 
                    type="range" min="0.5" max="1.0" step="0.05"
                    value={pipelineConfig.thresholdConfidence}
                    onChange={(e) => handleConfigChange('thresholdConfidence', parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // --- SOP Editor Renderer (Standalone) ---
  const renderSOPEditor = () => {
      const sop = getActiveSOP();
      if (!sop) return <div>Select an SOP</div>;

      return (
          <div className="flex flex-col h-full">
              {/* SOP Editor Header */}
              <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0 flex justify-between items-center">
                  <div className="flex items-center">
                      <button 
                        onClick={() => handleNavigate('overview', null)}
                        className="mr-3 p-1.5 hover:bg-slate-100 rounded text-slate-400 transition-colors"
                        title="返回总览"
                      >
                          <ArrowLeft size={20} />
                      </button>
                      <div>
                          <div className="flex items-center space-x-3">
                              <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                                  <Book size={20} />
                              </div>
                              <h2 className="text-xl font-bold text-slate-900">{sop.name}</h2>
                          </div>
                          <div className="text-xs text-slate-500 mt-1 ml-11 flex items-center space-x-3">
                              <span>ID: {sop.id}</span>
                              <span>•</span>
                              <span className="uppercase">{sop.type}</span>
                              <span>•</span>
                              <span>Modified: {sop.lastModified}</span>
                          </div>
                      </div>
                  </div>
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700 shadow-sm flex items-center transition-colors">
                      <Save size={16} className="mr-2" /> 保存规范
                  </button>
              </div>

              {/* SOP Editor Content */}
              <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
                  <div className="max-w-6xl mx-auto space-y-6">
                      
                      {/* Workflow Designer */}
                      <div className="bg-white border border-slate-200 rounded-xl p-0 shadow-sm overflow-hidden">
                          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                              <h4 className="font-bold text-slate-800 text-sm flex items-center">
                                  <Workflow size={16} className="mr-2 text-slate-500"/>
                                  工序编排 (Workflow Stages)
                              </h4>
                              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center">
                                <Plus size={12} className="mr-1"/> 添加工序
                              </button>
                          </div>
                          
                          {/* Flow Visualization */}
                          <div className="p-10 relative flex justify-center bg-slate-50/30">
                                {/* Connected Flow */}
                                <div className="flex items-center relative w-full max-w-4xl justify-between">
                                    {/* Connecting Line */}
                                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10 -translate-y-1/2 rounded-full"></div>
                                    
                                    {/* Stages */}
                                    {sop.stages.map((node, idx) => (
                                        <div key={node.id} className="flex flex-col items-center group cursor-pointer relative z-10">
                                            
                                            {/* Connector Dots on Line */}
                                            {idx > 0 && (
                                                <div className="absolute top-1/2 -left-[50%] w-full flex justify-center -z-10">
                                                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                                                </div>
                                            )}

                                            <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-white bg-white shadow-sm group-hover:border-blue-100 group-hover:shadow-md transition-all relative">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                                                    idx === 1 ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-100' : 'bg-slate-50 text-slate-500 group-hover:text-slate-600'
                                                }`}>
                                                    <node.icon size={22} />
                                                </div>
                                            </div>
                                            
                                            <div className="mt-3 text-center">
                                                <span className={`text-sm font-bold block ${idx === 1 ? 'text-blue-700' : 'text-slate-700'}`}>{node.name}</span>
                                                <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200 block mt-1 shadow-sm w-fit mx-auto">{node.role}</span>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Button Placeholder */}
                                    <div className="flex flex-col items-center group cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-dashed border-slate-300 bg-white text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50">
                                            <Plus size={18} />
                                        </div>
                                        <div className="mt-4 text-center">
                                            <span className="text-xs text-slate-400 font-medium">Add Stage</span>
                                        </div>
                                    </div>
                                </div>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Instructions Editor */}
                          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px]">
                              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                                  <span className="text-sm font-bold text-slate-700 flex items-center">
                                      <FileText size={16} className="mr-2 text-slate-500"/>
                                      作业指南 (Instructions)
                                  </span>
                                  <div className="flex space-x-1">
                                      {/* Mock Editor Toolbar */}
                                      <button className="p-1.5 text-slate-400 hover:bg-white rounded"><Type size={14}/></button>
                                      <button className="p-1.5 text-slate-400 hover:bg-white rounded"><ImageIcon size={14}/></button>
                                      <button className="p-1.5 text-slate-400 hover:bg-white rounded"><List size={14}/></button>
                                      <div className="w-px h-4 bg-slate-300 mx-1 self-center"></div>
                                      <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded cursor-pointer font-medium ml-1">Markdown</span>
                                  </div>
                              </div>
                              <div className="flex-1 relative">
                                  <textarea 
                                      className="w-full h-full text-sm font-mono text-slate-600 bg-white p-6 outline-none resize-none leading-relaxed"
                                      value={sopConfig.instructions}
                                      onChange={(e) => handleSopConfigChange('instructions', e.target.value)}
                                  />
                              </div>
                          </div>

                          {/* Sidebar Configuration */}
                          <div className="space-y-6">
                              {/* Tool Configuration */}
                              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                                  <h5 className="text-sm font-bold text-slate-700 mb-4 flex items-center">
                                      <MousePointer2 size={16} className="mr-2 text-slate-500"/> 工具箱 (Toolbar)
                                  </h5>
                                  <div className="space-y-2">
                                      {[
                                          { label: '基础绘图 (Draw)', checked: true, required: false },
                                          { label: '智能吸附 (Snap)', checked: sopConfig.toolsTopology, required: true, key: 'toolsTopology' },
                                          { label: 'SAM 智能魔棒', checked: sopConfig.toolsMagicWand, required: false, key: 'toolsMagicWand', ai: true },
                                          { label: '拓扑修边 (Reshape)', checked: true, required: false },
                                          { label: '区域合并 (Merge)', checked: true, required: false },
                                      ].map((tool, idx) => (
                                          <label key={idx} className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer border transition-colors ${
                                              tool.ai ? 'bg-orange-50 border-orange-100 hover:border-orange-200' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                                          }`}>
                                              <div className="flex items-center">
                                                  <input 
                                                      type="checkbox" 
                                                      defaultChecked={tool.checked} 
                                                      className="mr-3 accent-blue-600 w-4 h-4 rounded" 
                                                      onChange={(e) => tool.key && handleSopConfigChange(tool.key, e.target.checked)}
                                                  />
                                                  <span className={`text-xs ${tool.ai ? 'text-orange-900 font-medium' : 'text-slate-600'}`}>{tool.label}</span>
                                              </div>
                                              {tool.required && <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">Required</span>}
                                              {tool.ai && <span className="text-[9px] bg-white text-orange-600 px-1.5 py-0.5 rounded border border-orange-200 font-bold">AI</span>}
                                          </label>
                                      ))}
                                  </div>
                              </div>

                              {/* Qualification */}
                              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                                  <h5 className="text-sm font-bold text-slate-700 mb-4 flex items-center">
                                      <Users size={16} className="mr-2 text-slate-500"/> 人员要求 (Qualification)
                                  </h5>
                                  <div className="space-y-3">
                                      <div>
                                          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">最低职级</label>
                                          <select 
                                              value={sopConfig.distSkillGroup}
                                              onChange={(e) => handleSopConfigChange('distSkillGroup', e.target.value)}
                                              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
                                          >
                                              <option value="senior-admin-specialist">L2 - 行政区划专家 (Senior)</option>
                                              <option value="policy-analyst">L3 - 政策分析员 (Expert)</option>
                                              <option value="senior-road-worker">L2 - 中级作业员</option>
                                              <option value="junior-worker">L1 - 初级 (含外包)</option>
                                          </select>
                                      </div>
                                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                          <p className="text-[10px] text-blue-700 leading-relaxed">
                                              * 此步骤涉及敏感行政边界确认，仅限具备 <b>L2</b> 及以上资质的内部员工领取。
                                          </p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  const renderOverview = () => {
    return (
      <div className="p-8 h-full overflow-y-auto bg-slate-50">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
          <LayoutGrid className="mr-3 text-blue-600" />
          流水线总览 (All Pipelines)
        </h1>
        
        {TREE_DATA.map(group => (
          <div key={group.id} className="mb-10">
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
               <group.icon size={16} className="mr-2" />
               {group.name}
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {group.scenarios.map(sc => (
                 <div 
                   key={sc.id} 
                   onClick={() => handleNavigate('pipeline', sc.id)}
                   className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-400 cursor-pointer transition-all group flex flex-col h-40 relative overflow-hidden"
                 >
                    <div className="flex justify-between items-start mb-3 relative z-10">
                       <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-700">{sc.name}</h4>
                       <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                          sc.status === 'active' 
                          ? 'bg-green-50 text-green-700 border-green-100' 
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                       }`}>
                          {sc.status}
                       </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-auto leading-relaxed relative z-10">
                       {sc.description || '暂无描述。'}
                    </p>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-50 mt-auto relative z-10">
                       <span className="flex items-center text-xs text-slate-400">
                          <Clock size={12} className="mr-1"/> {sc.lastUpdate || 'Unknown'}
                       </span>
                       <div className="flex space-x-2">
                          <button 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                // Navigate to SOP View with the linked SOP ID
                                handleNavigate('sop', sc.linkedSopId || null); 
                            }}
                            className="flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-700 hover:text-orange-600 hover:border-orange-300 transition-all shadow-sm"
                            title="配置 SOP 规范"
                          >
                            <Book size={14} className="mr-1.5 text-orange-500"/> SOP 配置
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleNavigate('pipeline', sc.id, 'source'); }}
                            className="flex items-center px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-xs font-bold hover:bg-blue-100 transition-all shadow-sm"
                            title="配置流水线"
                          >
                            <Workflow size={14} className="mr-1.5"/> 流程配置
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden relative">
      
      {/* Header */}
      {viewMode === 'overview' && (
          <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0 flex justify-between items-center z-20">
            <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg mr-2">
                <Briefcase size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">流水线编排 (Pipeline Manager)</h2>
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors">
                <Plus size={16} className="mr-2" /> 新建场景
            </button>
          </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar: Tree View (Hidden in SOP mode if desired, but kept for context switching) */}
        {viewMode !== 'sop' && (
            <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 overflow-y-auto">
            <div className="p-4">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                    type="text" 
                    placeholder="搜索场景..." 
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500" 
                    />
                </div>
                
                <div className="space-y-4">
                    {/* Overview Button */}
                    <div 
                        onClick={() => handleNavigate('overview', null)}
                        className={`flex items-center px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                            viewMode === 'overview'
                            ? 'bg-blue-50 text-blue-700 font-bold shadow-sm' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        <LayoutGrid size={16} className={`mr-2 ${viewMode === 'overview' ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="text-sm">总览 (All Pipelines)</span>
                    </div>

                    {/* Section 1: Pipelines */}
                    <div>
                        <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">业务场景 (Scenarios)</div>
                        {TREE_DATA.map(pl => (
                            <div key={pl.id}>
                            <div 
                                onClick={() => toggleExpand(pl.id)}
                                className="flex items-center px-2 py-2 rounded-lg cursor-pointer hover:bg-slate-50 text-slate-700 transition-colors"
                            >
                                {expandedNodes[pl.id] ? <ChevronDown size={14} className="mr-1 text-slate-400" /> : <ChevronRight size={14} className="mr-1 text-slate-400" />}
                                <pl.icon size={16} className="mr-2 text-slate-500" />
                                <span className="text-sm font-bold">{pl.name}</span>
                            </div>
                            
                            {expandedNodes[pl.id] && (
                                <div className="ml-6 border-l border-slate-100 pl-2 space-y-1 mt-1">
                                    {pl.scenarios.map(sc => (
                                        <div 
                                        key={sc.id}
                                        onClick={() => handleNavigate('pipeline', sc.id)}
                                        className={`px-3 py-2 rounded-md cursor-pointer text-sm transition-all flex items-center justify-between group ${
                                            selectedId === sc.id && viewMode === 'pipeline'
                                            ? 'bg-blue-50 text-blue-700 font-medium' 
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                        >
                                        <span>{sc.name}</span>
                                        {selectedId === sc.id && viewMode === 'pipeline' && <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
                                        </div>
                                    ))}
                                </div>
                            )}
                            </div>
                        ))}
                    </div>

                    {/* Section 2: SOP Library */}
                    <div>
                        <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                            <span>作业规范库 (SOP Library)</span>
                            <Plus size={12} className="cursor-pointer hover:text-blue-600"/>
                        </div>
                        <div 
                            onClick={() => toggleExpand('sop-lib')}
                            className="flex items-center px-2 py-2 rounded-lg cursor-pointer hover:bg-slate-50 text-slate-700 transition-colors"
                        >
                            {expandedNodes['sop-lib'] ? <ChevronDown size={14} className="mr-1 text-slate-400" /> : <ChevronRight size={14} className="mr-1 text-slate-400" />}
                            <Book size={16} className="mr-2 text-slate-500" />
                            <span className="text-sm font-bold">标准作业程序</span>
                        </div>
                        {expandedNodes['sop-lib'] && (
                            <div className="ml-6 border-l border-slate-100 pl-2 space-y-1 mt-1">
                                {SOP_LIBRARY.map(sop => (
                                    <div 
                                        key={sop.id}
                                        onClick={() => handleNavigate('sop', sop.id)}
                                        className="px-3 py-2 rounded-md cursor-pointer text-sm transition-all flex items-center justify-between group text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    >
                                        <span className="truncate" title={sop.name}>{sop.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </div>
        )}

        {/* Main Content: Flow & Config */}
        <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
           {viewMode === 'sop' ? (
              // SOP Editor Mode
              renderSOPEditor()
           ) : viewMode === 'pipeline' && activeScenario ? (
              <>
                 {/* Top: Process Diagram */}
                 <div className="bg-white border-b border-slate-200 p-8 shadow-sm shrink-0">
                    <div className="flex items-center justify-between mb-10">
                       <div className="flex items-center">
                           <button 
                             onClick={() => handleNavigate('overview', null)}
                             className="mr-3 p-1.5 hover:bg-slate-100 rounded text-slate-400 transition-colors"
                             title="返回总览"
                           >
                               <ArrowLeft size={20} />
                           </button>
                           <h2 className="text-xl font-bold text-slate-900">{activeScenario.name}</h2>
                       </div>
                       <div className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded border border-green-200 font-medium uppercase">
                          {activeScenario.status}
                       </div>
                    </div>
                    
                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            {/* Track Background */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full"></div>
                            
                            {/* Progress Bar */}
                            <div 
                                className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                            ></div>

                            {/* Steps */}
                            <div className="relative flex justify-between w-full">
                               {STEPS.map((step, idx) => {
                                  const isActive = activeStep === step.id;
                                  const isCompleted = idx < currentStepIndex;
                                  
                                  return (
                                     <div 
                                        key={step.id} 
                                        onClick={() => setActiveStep(step.id)}
                                        className={`flex flex-col items-center cursor-pointer group relative`}
                                     >
                                        {/* Circle */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 bg-white ${
                                           isActive 
                                           ? 'border-blue-600 text-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.2)] scale-110' 
                                           : isCompleted 
                                             ? 'border-blue-600 bg-blue-600 text-white' 
                                             : 'border-slate-200 text-slate-300 group-hover:border-slate-300'
                                        }`}>
                                           {isCompleted ? <Check size={18} strokeWidth={3} /> : <step.icon size={18} />}
                                        </div>
                                        
                                        {/* Label */}
                                        <div className={`absolute top-12 flex flex-col items-center w-32 transition-all duration-300 ${
                                            isActive ? 'opacity-100 transform translate-y-0' : 'opacity-70 group-hover:opacity-100'
                                        }`}>
                                            <span className={`text-xs font-bold ${
                                                isActive ? 'text-blue-700' : isCompleted ? 'text-blue-600' : 'text-slate-500'
                                            }`}>
                                               {step.label}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider scale-90">
                                                {step.subLabel}
                                            </span>
                                        </div>
                                     </div>
                                  );
                               })}
                            </div>
                        </div>
                    </div>
                    <div className="h-12"></div> {/* Spacer for labels */}
                 </div>

                 {/* Bottom: Configuration Area */}
                 <div className="flex-1 overflow-hidden p-6">
                    <div className="max-w-5xl mx-auto h-full">
                       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                             <h3 className="font-bold text-slate-800 text-sm flex items-center">
                                <Settings size={16} className="mr-2 text-slate-500" />
                                {STEPS.find(s => s.id === activeStep)?.label} 配置
                             </h3>
                             <div className="text-xs text-slate-400 font-mono">
                                Step {STEPS.findIndex(s => s.id === activeStep) + 1} / 4
                             </div>
                          </div>
                          
                          <div className="p-8 flex-1 overflow-y-auto">
                             {renderConfigForm()}
                          </div>
                          
                          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
                             <div className="flex items-center space-x-3">
                                <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100 font-medium transition-colors">
                                    重置本步
                                </button>
                                {isAdmin && (
                                    <div className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 flex items-center">
                                        <FileBadge size={12} className="mr-1"/> 行政区划模式
                                    </div>
                                )}
                             </div>
                             <div className="flex space-x-3">
                                {activeStep !== 'source' && (
                                   <button 
                                     onClick={() => setActiveStep(prevStep?.id || 'source')}
                                     className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100 font-medium transition-colors flex items-center"
                                   >
                                      {prevStep && <span className="mr-2 text-xs text-slate-400 font-normal">上一歩: {prevStep.label}</span>}
                                      Back
                                   </button>
                                )}
                                {currentStepIndex < STEPS.length - 1 ? (
                                   <button 
                                     onClick={() => setActiveStep(nextStep?.id || 'eval')}
                                     className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm flex items-center transition-colors"
                                   >
                                      下一步 
                                      {nextStep && <span className="ml-2 text-xs opacity-80 font-normal">: {nextStep.label}</span>}
                                      <ArrowRight size={16} className="ml-2" />
                                   </button>
                                ) : (
                                   <button className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 shadow-sm flex items-center transition-colors">
                                      <Save size={16} className="mr-2" /> 完成并保存
                                   </button>
                                )}
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </>
           ) : (
              // Overview Dashboard
              renderOverview()
           )}
        </div>

      </div>
    </div>
  );
};

export default JobRepository;
