
import React, { useState } from 'react';
import { 
  Cpu, 
  Ruler, 
  Activity, 
  Clock, 
  ChevronRight, 
  Search,
  LayoutGrid,
  List,
  FileText,
  Image as ImageIcon,
  Mic,
  Video,
  Box,
  Monitor,
  BrainCircuit,
  Layers,
  Sparkles,
  Zap,
  Filter,
  Plus,
  Settings,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Check,
  Save,
  PenTool,
  Code,
  ArrowLeft,
  History,
  BarChart2,
  Terminal,
  Copy,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Hexagon,
  MessageSquare,
  Play,
  MousePointer2,
  Link as LinkIcon
} from 'lucide-react';
import { MODELS } from '../constants';
import { ModelCapability, ModelItem } from '../types';

// Map icon names to components for dynamic rendering
const ICON_MAP: Record<string, any> = {
  Layers, FileText, ImageIcon, Mic, Video, Box, Monitor, Sparkles, BrainCircuit, Cpu, Zap, Code, PenTool, Hexagon
};

// Architecture-based categories
const ARCHITECTURE_CATEGORIES = [
  { id: 'all', label: '全部模型', iconName: 'Layers' },
  { id: 'foundation', label: '基座大模型 (Foundation)', iconName: 'Hexagon' },
  { id: 'adapter', label: '适配器与提示词 (Adapters)', iconName: 'Sparkles' },
  { id: 'specific', label: '专用小模型 (Task-Specific)', iconName: 'Cpu' },
  { id: 'algorithm', label: '几何算法 (Algorithms)', iconName: 'Ruler' },
];

const ModelRegistry: React.FC = () => {
  // State for Data
  const [categories, setCategories] = useState(ARCHITECTURE_CATEGORIES);
  const [models, setModels] = useState<ModelItem[]>(MODELS);
  
  // State for UI
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for Selection & Detail View
  const [selectedModel, setSelectedModel] = useState<ModelItem | null>(null);
  const [detailTab, setDetailTab] = useState<'overview' | 'evaluation' | 'versions' | 'settings' | 'prompt-lab'>('overview');

  // State for Modals
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catForm, setCatForm] = useState({ label: '', iconName: 'Layers', id: '' });

  const [showModelModal, setShowModelModal] = useState(false);
  const [modelForm, setModelForm] = useState<{
    name: string;
    version: string;
    type: 'AI' | 'Algo';
    tags: ModelCapability[];
    status: 'Prod' | 'Beta' | 'Deprecated';
    accuracy: string;
    latency: string;
    description: string;
    provider: string;
    baseModelId?: string;
  }>({
    name: '', version: 'v1.0', type: 'AI', tags: ['specific'], status: 'Beta', 
    accuracy: '', latency: '', description: '', provider: 'Self-hosted', baseModelId: ''
  });

  // Prompt Lab State
  const [promptInput, setPromptInput] = useState('');
  const [promptMode, setPromptMode] = useState<'text' | 'point' | 'box'>('text');
  const [showSaveVirtualModal, setShowSaveVirtualModal] = useState(false);
  const [virtualModelName, setVirtualModelName] = useState('');

  // --- Helpers ---
  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'bg-emerald-500';
    if (score >= 0.8) return 'bg-blue-500';
    if (score >= 0.6) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  // --- Category Management ---
  const handleAddCategory = () => {
    setEditingCatId(null);
    setCatForm({ label: '', iconName: 'Layers', id: '' });
    setShowCatModal(true);
  };

  const handleEditCategory = (e: React.MouseEvent, cat: typeof ARCHITECTURE_CATEGORIES[0]) => {
    e.stopPropagation();
    setEditingCatId(cat.id);
    setCatForm({ label: cat.label, iconName: cat.iconName, id: cat.id });
    setShowCatModal(true);
  };

  const saveCategory = () => {
    if (editingCatId) {
      setCategories(prev => prev.map(c => c.id === editingCatId ? { ...c, label: catForm.label, iconName: catForm.iconName } : c));
    } else {
      const newId = `cat_${Date.now()}`;
      setCategories(prev => [...prev, { id: newId, label: catForm.label, iconName: catForm.iconName }]);
    }
    setShowCatModal(false);
  };

  // --- Model Management ---
  const handleAddModel = () => {
    setModelForm({
      name: '', version: 'v1.0', type: 'AI', tags: activeCategory !== 'all' ? [activeCategory as ModelCapability] : ['specific'], status: 'Beta', 
      accuracy: 'N/A', latency: 'N/A', description: '', provider: 'Self-hosted', baseModelId: ''
    });
    setShowModelModal(true);
  };

  const saveModel = () => {
    const newModel: ModelItem = {
      id: `m_${Date.now()}`,
      name: modelForm.name || 'New Model',
      version: modelForm.version || 'v1.0',
      type: modelForm.type,
      tags: modelForm.tags,
      status: modelForm.status,
      accuracy: modelForm.accuracy,
      latency: modelForm.latency,
      description: modelForm.description || '暂无描述',
      provider: modelForm.provider,
      metrics: { precision: 0, recall: 0, f1: 0 },
      baseModelId: modelForm.tags.includes('adapter') ? modelForm.baseModelId : undefined
    };
    setModels(prev => [newModel, ...prev]);
    setShowModelModal(false);
  };

  // --- Save Virtual Model ---
  const handleSaveVirtualModel = () => {
    if (!virtualModelName) return;
    
    const newVirtualModel: ModelItem = {
        id: `vm-${Date.now()}`,
        name: virtualModelName,
        version: 'v1.0-adapter',
        type: 'AI',
        tags: ['adapter', 'image'],
        status: 'Beta',
        accuracy: 'TBD',
        latency: 'Low',
        description: `Virtual model based on ${selectedModel?.name}. Prompt: ${promptInput}`,
        provider: 'Internal (Virtual)',
        baseModelId: selectedModel?.id,
        promptConfig: {
            template: promptInput,
            threshold: 0.5, // Default for now
            maxMasks: 10,
            mode: promptMode
        },
        metrics: { precision: 0, recall: 0, f1: 0 }
    };

    setModels(prev => [newVirtualModel, ...prev]);
    setShowSaveVirtualModal(false);
    setVirtualModelName('');
    alert(`虚拟模型 "${newVirtualModel.name}" 已保存到模型仓库`);
  };

  // --- Filtering ---
  const filteredModels = models.filter(model => {
    const matchesCategory = activeCategory === 'all' || model.tags.includes(activeCategory as ModelCapability);
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          model.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeCategoryLabel = categories.find(c => c.id === activeCategory)?.label || 'Unknown';

  // --- Open Prompt Lab ---
  const handleDebugPrompt = (e: React.MouseEvent, model: ModelItem) => {
      e.stopPropagation();
      setSelectedModel(model);
      setDetailTab('prompt-lab');
  };

  // --- Render Detail View ---
  const renderModelDetail = () => {
    if (!selectedModel) return null;

    return (
      <div className="flex flex-col h-full bg-slate-50 animate-in slide-in-from-right duration-300">
        {/* Detail Header */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-20">
           <div className="flex items-center">
              <button 
                onClick={() => setSelectedModel(null)}
                className="mr-4 p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                 <div className="flex items-center space-x-3">
                    <h2 className="text-lg font-bold text-slate-900">{selectedModel.name}</h2>
                    <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-600 border border-slate-200">{selectedModel.version}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        selectedModel.status === 'Prod' ? 'bg-green-50 text-green-700 border border-green-200' :
                        selectedModel.status === 'Beta' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                        {selectedModel.status}
                    </span>
                    {selectedModel.baseModelId && <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-100 font-bold flex items-center"><LinkIcon size={10} className="mr-1"/> Adapter</span>}
                 </div>
                 <div className="text-xs text-slate-500 mt-0.5 flex items-center">
                    <span className="mr-3">Provider: {selectedModel.provider}</span>
                    {selectedModel.baseModelId && (
                        <span className="flex items-center mr-3 text-purple-600">
                            Base: {models.find(m => m.id === selectedModel.baseModelId)?.name || selectedModel.baseModelId}
                        </span>
                    )}
                    <span className="flex items-center"><Clock size={10} className="mr-1"/> Updated: 2023-11-01</span>
                 </div>
              </div>
           </div>

           <div className="flex bg-slate-100 p-1 rounded-lg">
              {['overview', 'evaluation', 'versions', 'settings', 'prompt-lab'].map(tab => (
                 <button
                    key={tab}
                    onClick={() => setDetailTab(tab as any)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all capitalize ${
                       detailTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                 >
                    {tab.replace('-', ' ')}
                 </button>
              ))}
           </div>

           <div className="flex items-center space-x-3">
              <button className="flex items-center px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg shadow-sm text-xs font-medium hover:bg-slate-50 transition-colors">
                 <Terminal size={14} className="mr-1.5"/> Test
              </button>
              <button className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg shadow-sm text-xs font-medium hover:bg-blue-700 transition-colors">
                 <Zap size={14} className="mr-1.5"/> Deploy
              </button>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
           <div className="max-w-6xl mx-auto">
              {detailTab === 'overview' && (
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                       <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
                             <FileText size={16} className="mr-2 text-blue-500"/> 
                             模型简介 (Description)
                          </h3>
                          <p className="text-sm text-slate-600 leading-relaxed mb-4">
                             {selectedModel.description}
                          </p>
                          {selectedModel.promptConfig && (
                              <div className="mb-4 bg-purple-50 p-3 rounded-lg border border-purple-100">
                                  <div className="text-xs font-bold text-purple-700 uppercase mb-2 flex items-center">
                                      <Sparkles size={12} className="mr-1"/> Prompt Configuration (Frozen)
                                  </div>
                                  <div className="font-mono text-xs text-slate-700 bg-white p-2 rounded border border-purple-100">
                                      {selectedModel.promptConfig.template}
                                  </div>
                                  <div className="mt-2 flex gap-4 text-xs text-slate-500">
                                      <span>Mode: {selectedModel.promptConfig.mode}</span>
                                      <span>Threshold: {selectedModel.promptConfig.threshold}</span>
                                  </div>
                              </div>
                          )}
                          <div className="flex flex-wrap gap-2">
                             {selectedModel.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 font-medium">
                                   #{tag}
                                </span>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              )}

              {/* Prompt Lab Tab */}
              {detailTab === 'prompt-lab' && (
                  <div className="grid grid-cols-2 gap-6 h-[600px]">
                      {/* Left: Interactive Preview */}
                      <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex flex-col">
                          <div className="p-3 border-b border-slate-700 flex justify-between items-center bg-slate-950">
                              <span className="text-xs font-bold text-slate-300 flex items-center">
                                  <ImageIcon size={14} className="mr-2 text-blue-400"/> 实时预览 (Live Preview)
                              </span>
                              <div className="flex space-x-2">
                                  <button className={`p-1.5 rounded ${promptMode === 'text' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`} onClick={() => setPromptMode('text')} title="Text Prompt">
                                      <Type size={14} />
                                  </button>
                                  <button className={`p-1.5 rounded ${promptMode === 'point' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`} onClick={() => setPromptMode('point')} title="Point Prompt">
                                      <MousePointer2 size={14} />
                                  </button>
                                  <button className={`p-1.5 rounded ${promptMode === 'box' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`} onClick={() => setPromptMode('box')} title="Box Prompt">
                                      <Box size={14} />
                                  </button>
                              </div>
                          </div>
                          <div className="flex-1 relative flex items-center justify-center bg-slate-800/50">
                              {/* Placeholder Image */}
                              <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/116.4074,39.9042,16,0/600x600?access_token=pk.xxx')] bg-cover opacity-80"></div>
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400 text-xs bg-slate-900/80 px-3 py-1 rounded backdrop-blur border border-slate-700">
                                  Interactive Canvas Placeholder
                              </div>
                          </div>
                      </div>

                      {/* Right: Prompt Engineering */}
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                              <h3 className="text-sm font-bold text-slate-800 flex items-center">
                                  <MessageSquare size={16} className="mr-2 text-indigo-500"/>
                                  Prompt 调试器 (Lab)
                              </h3>
                              <div className="text-xs text-slate-500">
                                  Base: <span className="font-bold text-slate-700">{selectedModel.baseModelId ? models.find(m => m.id === selectedModel.baseModelId)?.name : selectedModel.name}</span>
                              </div>
                          </div>
                          <div className="p-5 flex-1 flex flex-col space-y-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Prompt Content ({promptMode})</label>
                                  <textarea 
                                      className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 outline-none resize-none font-mono"
                                      placeholder={promptMode === 'text' ? "e.g. Extract all swimming pools..." : "Click on the image to add points/boxes..."}
                                      value={promptInput || selectedModel.promptConfig?.template}
                                      onChange={(e) => setPromptInput(e.target.value)}
                                      disabled={promptMode !== 'text'}
                                  ></textarea>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Confidence Threshold</label>
                                      <input type="range" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"/>
                                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                                          <span>0.0</span>
                                          <span>0.50</span>
                                          <span>1.0</span>
                                      </div>
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Max Masks</label>
                                      <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" defaultValue={10} />
                                  </div>
                              </div>

                              <div className="mt-auto flex space-x-3">
                                  <button className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-sm flex items-center justify-center transition-colors">
                                      <Play size={16} className="mr-2"/> Run Inference
                                  </button>
                                  <button 
                                    onClick={() => setShowSaveVirtualModal(true)}
                                    className="px-4 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-bold shadow-sm transition-colors flex items-center justify-center"
                                    title="Save as Adapter"
                                  >
                                      <Save size={16} className="mr-2"/> Save as Adapter
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              )}
           </div>
        </div>
      </div>
    );
  };

  function Type(props: any) {
      return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="4 7 4 4 20 4 20 7" />
            <line x1="9" x2="15" y1="20" y2="20" />
            <line x1="12" x2="12" y1="4" y2="20" />
        </svg>
      )
  }

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden relative">
      
      {/* Sidebar Categories - Only show when no model is selected */}
      {!selectedModel && (
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center">
                <BrainCircuit className="mr-2 text-blue-600" />
                模型能力库
                </h2>
                <p className="text-xs text-slate-500 mt-1">按架构角色管理 AI 资产</p>
            </div>
            <button 
                onClick={handleAddCategory}
                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-blue-600 transition-colors"
                title="添加新分类"
            >
                <Plus size={18} />
            </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {categories.map(cat => {
                const Icon = ICON_MAP[cat.iconName] || Layers;
                return (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all group relative ${
                    activeCategory === cat.id 
                    ? 'bg-blue-50 text-blue-700 font-bold shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                    <Icon size={16} className={`mr-3 ${activeCategory === cat.id ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="truncate">{cat.label}</span>
                    
                    {cat.id !== 'all' && (
                        <div className="ml-auto flex items-center">
                        <span className={`text-xs ${activeCategory === cat.id ? 'text-blue-400' : 'text-slate-400'} font-normal mr-1 group-hover:hidden`}>
                            {models.filter(m => m.tags.includes(cat.id as ModelCapability)).length}
                        </span>
                        <div 
                            onClick={(e) => handleEditCategory(e, cat)}
                            className="hidden group-hover:flex p-1 hover:bg-slate-200 rounded text-slate-500"
                        >
                            <Edit2 size={12} />
                        </div>
                        </div>
                    )}
                    {cat.id === 'all' && (
                        <span className="ml-auto text-xs text-slate-400 font-normal">
                        {models.length}
                        </span>
                    )}
                </button>
                );
            })}
            </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {selectedModel ? renderModelDetail() : (
            <>
                {/* Header */}
                <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
                <div className="flex items-center space-x-4">
                    <div className="text-sm font-bold text-slate-700">
                        {activeCategoryLabel}
                    </div>
                    <div className="h-4 w-px bg-slate-200"></div>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                        type="text" 
                        placeholder="搜索模型名称或描述..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-1.5 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button className="flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 text-xs font-medium hover:bg-slate-50">
                        <Filter size={14} className="mr-1.5" /> 状态筛选
                    </button>
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                        <LayoutGrid size={16} />
                        </button>
                        <button 
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                        <List size={16} />
                        </button>
                    </div>
                    <button 
                        onClick={handleAddModel}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors"
                    >
                        <Plus size={16} className="mr-2" /> 注册模型
                    </button>
                </div>
                </div>

                {/* Content Grid/List */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredModels.map(model => {
                        const isFoundation = model.tags.includes('foundation');
                        const isAdapter = model.tags.includes('adapter');
                        
                        return (
                        <div 
                            key={model.id} 
                            onClick={() => setSelectedModel(model)}
                            className={`bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-all group cursor-pointer hover:border-blue-300 flex flex-col
                                ${isFoundation ? 'xl:col-span-2 border-indigo-200 bg-indigo-50/10' : 'border-slate-200'}
                            `}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-start">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 shrink-0 ${
                                        isFoundation ? 'bg-indigo-600 text-white shadow-md' : 
                                        isAdapter ? 'bg-purple-50 text-purple-600' : 
                                        model.type === 'AI' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                                    }`}>
                                        {isFoundation ? <Hexagon size={20} /> :
                                         isAdapter ? <Sparkles size={20} /> :
                                         model.type === 'AI' ? <BrainCircuit size={20} /> : <Zap size={20} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center">
                                            <h3 className="font-bold text-slate-800 text-sm mr-2">{model.name}</h3>
                                            {isFoundation && <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase">Foundation</span>}
                                        </div>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono border border-slate-200">{model.version}</span>
                                            {model.baseModelId && (
                                                <span className="text-[10px] text-purple-600 flex items-center bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 font-medium truncate max-w-[120px]">
                                                    <LinkIcon size={8} className="mr-1"/>
                                                    Linked to {models.find(m => m.id === model.baseModelId)?.name || 'Parent'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button className="text-slate-300 hover:text-slate-500">
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                            
                            <p className="text-xs text-slate-500 mb-4 h-8 line-clamp-2 leading-relaxed">
                                {model.description}
                            </p>

                            {/* Metrics Area */}
                            <div className="mt-auto">
                                <div className={`rounded-lg p-3 border mb-3 ${isFoundation ? 'bg-white border-indigo-100 grid grid-cols-2 gap-4' : 'bg-slate-50 border-slate-100'}`}>
                                    {isFoundation ? (
                                        <>
                                            <div>
                                                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Resources</span>
                                                <div className="text-xs font-mono font-bold text-slate-700">{model.latency}</div>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Capabilities</span>
                                                <div className="text-xs font-bold text-indigo-600">Zero-Shot, Multi-Modal</div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-slate-500">Metric (F1)</span>
                                                <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">Lat: {model.latency}</span>
                                            </div>
                                            <div className="flex space-x-1 h-1.5">
                                                <div className="bg-blue-500 rounded-full h-full" style={{width: `${model.metrics?.f1 ? model.metrics.f1 * 100 : 0}%`}}></div>
                                                <div className="bg-slate-200 rounded-full h-full flex-1"></div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-50 text-xs">
                                    <span className="text-slate-400">Provider: <span className="text-slate-600 font-medium">{model.provider}</span></span>
                                    {isFoundation ? (
                                        <button 
                                            onClick={(e) => handleDebugPrompt(e, model)}
                                            className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded shadow-sm font-bold transition-colors flex items-center"
                                        >
                                            <Sparkles size={12} className="mr-1"/> Debug Prompt
                                        </button>
                                    ) : (
                                        <span className="text-blue-600 font-bold hover:underline">详情 &gt;</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )})}
                    {/* Add New Placeholder */}
                    <div 
                        onClick={handleAddModel}
                        className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer min-h-[280px]"
                    >
                        <Plus size={32} className="mb-2" />
                        <span className="font-bold text-sm">注册新模型</span>
                    </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3">Model Name</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Version</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {filteredModels.map(model => (
                                <tr key={model.id} onClick={() => setSelectedModel(model)} className="hover:bg-slate-50 group cursor-pointer transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{model.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                            {categories.find(c => model.tags.includes(c.id as ModelCapability))?.label || 'Other'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{model.version}</td>
                                    <td className="px-6 py-4">{model.type}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${model.status === 'Prod' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {model.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-blue-600">
                                            <Edit2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                )}
                </div>
            </>
        )}
      </div>

      {/* --- Save Virtual Model Modal --- */}
      {showSaveVirtualModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-xl shadow-2xl w-[500px] overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800">保存为虚拟模型 (Virtual Model - Adapter)</h3>
                      <button onClick={() => setShowSaveVirtualModal(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800 mb-2">
                          虚拟模型本质上是一个 Adapter 配置，它引用了底座模型 <b>{selectedModel?.name}</b> 并固化了当前的 Prompt 参数。
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">模型名称</label>
                          <input 
                              type="text" 
                              value={virtualModelName}
                              onChange={(e) => setVirtualModelName(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                              placeholder="e.g. 蓝色工棚提取器 v1"
                              autoFocus
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Prompt 预览</label>
                          <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-600 line-clamp-3">
                              {promptInput || '(Empty)'}
                          </div>
                      </div>
                  </div>
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
                      <button onClick={() => setShowSaveVirtualModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-100 font-medium">取消</button>
                      <button onClick={handleSaveVirtualModel} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 font-bold shadow-sm">确认保存</button>
                  </div>
              </div>
          </div>
      )}

      {/* --- Other Modals (Category) --- */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-[400px] overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">{editingCatId ? '编辑分类' : '新建分类'}</h3>
                  <button onClick={() => setShowCatModal(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
               </div>
               <div className="p-6 space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-2">分类名称</label>
                     <input 
                       type="text" 
                       value={catForm.label}
                       onChange={e => setCatForm({...catForm, label: e.target.value})}
                       className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none"
                     />
                  </div>
               </div>
               <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
                  <button onClick={() => setShowCatModal(false)} className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-100">取消</button>
                  <button onClick={saveCategory} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">保存</button>
               </div>
            </div>
        </div>
      )}

      {/* --- Add Model Modal --- */}
      {showModelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-[600px] overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">注册新模型</h3>
                  <button onClick={() => setShowModelModal(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
               </div>
               <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">模型名称</label>
                        <input 
                           type="text" 
                           value={modelForm.name}
                           onChange={e => setModelForm({...modelForm, name: e.target.value})}
                           className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none"
                           placeholder="e.g. YOLOv8-Road"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">版本号</label>
                        <input 
                           type="text" 
                           value={modelForm.version}
                           onChange={e => setModelForm({...modelForm, version: e.target.value})}
                           className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none"
                           placeholder="v1.0.0"
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">类型</label>
                        <select
                           value={modelForm.type}
                           onChange={e => setModelForm({...modelForm, type: e.target.value as any})}
                           className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none bg-white"
                        >
                           <option value="AI">AI Model</option>
                           <option value="Algo">Algorithm</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">分类</label>
                        <select 
                           value={modelForm.tags[0]}
                           onChange={e => setModelForm({...modelForm, tags: [e.target.value as ModelCapability]})}
                           className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none bg-white"
                        >
                           {categories.filter(c => c.id !== 'all').map(c => (
                               <option key={c.id} value={c.id}>{c.label}</option>
                           ))}
                        </select>
                     </div>
                  </div>

                  {modelForm.tags.includes('adapter') && (
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">关联基座模型 (Base Model)</label>
                          <select 
                             value={modelForm.baseModelId || ''}
                             onChange={e => setModelForm({...modelForm, baseModelId: e.target.value})}
                             className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none bg-white"
                          >
                             <option value="">-- 选择基座模型 --</option>
                             {models.filter(m => m.tags.includes('foundation')).map(m => (
                                 <option key={m.id} value={m.id}>{m.name}</option>
                             ))}
                          </select>
                      </div>
                  )}

                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-2">描述</label>
                     <textarea 
                        value={modelForm.description}
                        onChange={e => setModelForm({...modelForm, description: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none h-24 resize-none"
                        placeholder="简述模型功能与适用场景..."
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">供应商/来源</label>
                        <input 
                           type="text" 
                           value={modelForm.provider}
                           onChange={e => setModelForm({...modelForm, provider: e.target.value})}
                           className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">资源/延迟 (Resources)</label>
                        <input 
                           type="text" 
                           value={modelForm.latency}
                           onChange={e => setModelForm({...modelForm, latency: e.target.value})}
                           className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none"
                           placeholder="e.g. 50ms or 4x A100"
                        />
                     </div>
                  </div>
               </div>
               <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
                  <button onClick={() => setShowModelModal(false)} className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-100">取消</button>
                  <button onClick={saveModel} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">保存</button>
               </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ModelRegistry;
