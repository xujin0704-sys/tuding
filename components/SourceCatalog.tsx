
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  FileText, 
  FileImage, 
  Video, 
  Database,
  Cloud,
  Server,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  X,
  Tag,
  Edit3,
  Clock,
  Folder,
  Workflow,
  Zap,
  ArrowRight,
  ArrowLeft,
  Sliders,
  Play,
  Save,
  Cpu,
  MousePointer2,
  ChevronDown,
  Layout,
  ListFilter,
  LayoutList,
  Map as MapIcon,
  MoreVertical,
  Download,
  Trash2,
  Settings2,
  PieChart,
  BarChart3,
  Loader2,
  UploadCloud,
  Table,
  Terminal,
  Camera,
  ScanEye
} from 'lucide-react';
import { SOURCE_ASSETS, INGESTION_TASKS, MODELS } from '../constants';
import { SourceAsset } from '../types';

interface FlowNode {
  id: string;
  type: 'trigger' | 'filter' | 'model' | 'action';
  title: string;
  subtitle: string;
  x: number;
  y: number;
  color: 'yellow' | 'purple' | 'indigo' | 'green' | 'blue';
  icon: any;
  config?: any;
}

const SourceCatalog: React.FC = () => {
  const [activeView, setActiveView] = useState<'explorer' | 'rules' | 'detail'>('explorer');
  const [explorerMode, setExplorerMode] = useState<'list' | 'map'>('list');
  const [selectedAsset, setSelectedAsset] = useState<SourceAsset | null>(null);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [dateRange, setDateRange] = useState<string>('all');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  
  // Local Asset State for mutations (Delete)
  const [assets, setAssets] = useState<SourceAsset[]>(SOURCE_ASSETS);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // Simulation State
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);

  // Rule Builder State
  const [debugMode, setDebugMode] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodes, setNodes] = useState<FlowNode[]>([
    { id: '1', type: 'trigger', title: '新影像接入', subtitle: 'Source: S3_Satellite_Daily', x: 60, y: 100, color: 'yellow', icon: Zap, config: { sourceType: 's3', path: 's3://daily-sat-feed/' } },
    { id: '2', type: 'filter', title: '文件过滤器', subtitle: 'Ext: .tiff OR .geotiff', x: 300, y: 100, color: 'purple', icon: Filter, config: { pattern: '*.tiff, *.geotiff', maxSize: '5GB' } },
    { id: '3', type: 'model', title: 'CV 质检模型', subtitle: 'Model: Cloud_Detect_v2', x: 540, y: 100, color: 'indigo', icon: Cpu, config: { modelId: 'm1' } },
    { id: '4', type: 'action', title: '标签映射', subtitle: 'IF Cloud > 20% THEN Quality:Low', x: 780, y: 100, color: 'green', icon: Tag, config: { condition: 'cloud_cover > 20', tag: 'quality:low' } },
  ]);
  
  // Create Task Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    sourceType: 'db' as 's3' | 'db' | 'ftp' | 'file',
    connectionStr: '',
    syncMode: 'cron' as 'once' | 'cron',
    cronExp: '0 2 * * *'
  });

  const handleSimulateUpload = () => {
    setIsSimulatingUpload(true);
    setTimeout(() => {
        const newAsset: SourceAsset = {
            id: `f_new_admin_01`, 
            name: 'Gov_Plan_2024_Zone_B.pdf', 
            sourceType: 'upload', 
            geometry: { type: 'Point', coordinates: [], center: {x: 50, y: 50} },
            timestamp: new Date().toISOString().split('T')[0], 
            ingestedAt: 'Just now',
            size: '18 MB', 
            aiTags: { keywords: ['行政变更', 'B区', '规划图'], locationName: ['新城区'], quality: 'High' },
            status: 'cataloged',
            thumbnailColor: '#fca5a5'
        };
        setAssets(prev => [newAsset, ...prev]);
        setIsSimulatingUpload(false);
        // Automatically open the detail view for the "story"
        setSelectedAsset(newAsset);
        setActiveView('detail');
    }, 1500);
  };
  
  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'ftp': return <Server size={14} className="mr-1" />;
      case 's3': return <Cloud size={14} className="mr-1" />;
      case 'db': return <Database size={14} className="mr-1" />;
      default: return <FileText size={14} className="mr-1" />;
    }
  };

  const getStatusColor = (status: SourceAsset['status']) => {
    switch (status) {
      case 'routed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cataloged': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'archived': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const filteredAssets = assets.filter(a => {
      const matchesType = filterType === 'all' || a.sourceType === filterType || (filterType === 'semantic' && a.aiTags.keywords.includes('Semantic'));
      const term = searchTerm.toLowerCase();
      const matchesSearch = !term || a.name.toLowerCase().includes(term) || a.id.toLowerCase().includes(term);
      const matchesDate = dateRange === 'all' || a.timestamp.includes(dateRange);
      return matchesType && matchesSearch && matchesDate;
  });

  const stats = useMemo(() => {
    let sizeMB = 0;
    const types = { Image: 0, Video: 0, Doc: 0, DB: 0 };
    const status = { Routed: 0, Cataloged: 0, Archived: 0 };

    filteredAssets.forEach(asset => {
      const val = parseFloat(asset.size);
      if (asset.size.includes('GB')) sizeMB += val * 1024;
      else if (asset.size.includes('MB')) sizeMB += val;
      else if (asset.size.includes('KB')) sizeMB += val / 1024;

      if (asset.sourceType === 'db') types.DB++;
      else if (asset.name.endsWith('.mp4')) types.Video++;
      else if (asset.name.endsWith('.pdf') || asset.name.endsWith('.csv')) types.Doc++;
      else types.Image++;

      if (asset.status === 'routed') status.Routed++;
      else if (asset.status === 'archived') status.Archived++;
      else status.Cataloged++;
    });

    return {
      count: filteredAssets.length,
      volume: sizeMB > 1024 ? `${(sizeMB / 1024).toFixed(1)} GB` : `${Math.round(sizeMB)} MB`,
      types,
      status
    };
  }, [filteredAssets]);

  const handleDeleteAsset = (id: string) => {
    if (window.confirm('确认删除此资产?')) {
        setAssets(prev => prev.filter(a => a.id !== id));
        if (selectedAsset?.id === id) {
            setSelectedAsset(null);
            setActiveView('explorer');
        }
    }
    setOpenActionId(null);
  };

  // ... (Create Task Modal render code omitted for brevity as it is unchanged) ...
  const renderCreateTaskModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-2xl w-[600px] overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 text-lg">新增数据接入任务</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={20} />
                </button>
            </div>
            {/* ... Modal content remains the same ... */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">任务名称</label>
                    <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder:text-slate-400"
                        placeholder="例如: 每日人口数据增量同步"
                        value={newTask.name}
                        onChange={e => setNewTask({...newTask, name: e.target.value})}
                    />
                </div>
                {/* ... other modal inputs ... */}
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-medium transition-colors">取消</button>
                <button 
                    onClick={() => {
                        setShowCreateModal(false);
                        if (newTask.sourceType === 'file') {
                            handleSimulateUpload();
                        } else {
                            // Simulate adding task
                            alert(`任务 "${newTask.name}" 创建成功，后台 Worker 将开始调度。`);
                        }
                    }} 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors"
                >
                    {newTask.sourceType === 'file' ? '开始上传' : '创建任务'}
                </button>
            </div>
        </div>
    </div>
  );

  const renderPropertyPanel = () => {
      // ... (Property panel code remains unchanged)
      const node = nodes.find(n => n.id === selectedNodeId);
      if (!node) return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <MousePointer2 size={32} className="mb-2 opacity-50" />
              <p className="text-sm font-medium">选择节点以配置</p>
          </div>
      );
      return (
          <div className="h-full flex flex-col">
              <div className="p-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                  <div className="flex items-center">
                       <div className={`p-2 rounded mr-3 bg-${node.color}-100 text-${node.color}-600`}>
                           {React.createElement(node.icon, { size: 18 })}
                       </div>
                       <div>
                           <h3 className="font-bold text-slate-800 text-sm">{node.title}</h3>
                           <p className="text-xs text-slate-500 uppercase tracking-wide">{node.type} Node</p>
                       </div>
                  </div>
                  <button onClick={() => setSelectedNodeId(null)} className="text-slate-400 hover:text-slate-600">
                      <X size={16} />
                  </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                  {/* ... node specific configs ... */}
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded shadow-sm text-sm font-medium hover:bg-blue-700">应用更改</button>
              </div>
          </div>
      );
  }

  const renderAssetDetail = () => {
    // ... (Asset detail render code remains unchanged) ...
    if (!selectedAsset) return null;
    return (
      <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden animate-in slide-in-from-right duration-300">
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center space-x-4">
                <button 
                    onClick={() => setActiveView('explorer')}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center">
                        {selectedAsset.name}
                        <span className={`ml-3 text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border ${getStatusColor(selectedAsset.status)}`}>
                            {selectedAsset.status}
                        </span>
                    </h2>
                    <div className="flex items-center text-xs text-slate-500 mt-0.5 space-x-3">
                         <span className="flex items-center">
                            {getSourceIcon(selectedAsset.sourceType)} 
                            <span className="uppercase ml-1">{selectedAsset.sourceType}</span>
                         </span>
                         <span>•</span>
                         <span>ID: {selectedAsset.id}</span>
                    </div>
                </div>
            </div>
            {/* ... */}
        </div>
        {/* ... */}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden relative">
      {activeView !== 'detail' && (
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shadow-sm shrink-0">
        <div className="flex items-center space-x-8">
          <div>
            <h1 className="text-xl font-bold text-slate-900">AI 智能编目</h1>
            <p className="text-xs text-slate-500">多源数据自动化接入、清洗与时空索引构建。</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg">
             <button 
               onClick={() => setActiveView('explorer')}
               className={`flex items-center px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeView === 'explorer' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                <Search size={14} className="mr-2" />
                资产检索
             </button>
             <button 
               onClick={() => setActiveView('rules')}
               className={`flex items-center px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeView === 'rules' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                <Workflow size={14} className="mr-2" />
                编目规则
             </button>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm text-sm font-medium transition-colors">
            <ListFilter size={16} className="mr-2" />
            任务列表
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm text-sm font-medium transition-colors"
          >
            <Plus size={16} className="mr-2" />
            新增数据接入
          </button>
        </div>
      </div>
      )}

      {activeView === 'explorer' && (
        <>
            <div className="bg-white border-b border-slate-200 px-6 py-2 shrink-0 flex items-center space-x-4 overflow-x-auto custom-scrollbar">
                <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap flex items-center">
                    <ActivityIcon size={12} className="mr-1" />
                    运行中任务
                </span>
                {INGESTION_TASKS.map(task => (
                    <div key={task.id} className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1 min-w-[180px] hover:border-blue-300 transition-colors cursor-pointer group">
                        <div className={`p-1 rounded-full ${task.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                            {task.sourceType === 'S3' ? <Cloud size={10} /> : task.sourceType === 'DB' ? <Database size={10} /> : <Server size={10} />}
                        </div>
                        <span className="text-xs font-medium text-slate-700 truncate max-w-[100px]">{task.name}</span>
                        {task.status === 'active' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse ml-auto"></span>}
                        <span className="text-[10px] text-slate-400 ml-auto group-hover:text-blue-500">{task.filesSynced} items</span>
                    </div>
                ))}
            </div>

            <div className="px-6 py-3 bg-white border-b border-slate-200 flex justify-between items-center sticky top-0 z-20">
                <div className="flex space-x-3 items-center">
                    <div className="relative">
                         <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                         <input 
                            type="text" 
                            placeholder="Search by filename, date, or semantic..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 pr-10 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500 w-80 transition-all placeholder:text-slate-400" 
                         />
                         <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors" title="以图搜图 (Visual Search)">
                             <Camera size={14} />
                         </button>
                    </div>
                    <div className="h-4 w-px bg-slate-200 mx-2"></div>
                    <div className="flex space-x-1 relative">
                        <button 
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className={`px-2.5 py-1.5 border rounded-md text-xs font-medium flex items-center transition-colors ${filterType !== 'all' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                        >
                            <Filter size={12} className="mr-1.5" /> 
                            {filterType === 'all' ? '筛选' : filterType === 'semantic' ? '语义筛选' : filterType.toUpperCase()}
                        </button>
                        {showFilterDropdown && (
                             <>
                                <div className="fixed inset-0 z-20" onClick={() => setShowFilterDropdown(false)}></div>
                                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-xl z-30">
                                    <div className="py-1">
                                        {['all', 's3', 'db', 'ftp', 'semantic'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => { setFilterType(type); setShowFilterDropdown(false); }}
                                                className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 ${filterType === type ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
                                            >
                                                {type === 'all' ? '全部类型' : type === 'semantic' ? <span className="flex items-center"><ScanEye size={12} className="mr-1 text-purple-500"/> 语义筛选 (SAM)</span> : type.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                             </>
                        )}
                        <button 
                             onClick={() => setShowDateDropdown(!showDateDropdown)}
                             className={`px-2.5 py-1.5 border rounded-md text-xs font-medium flex items-center transition-colors ${dateRange !== 'all' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                        >
                            <Calendar size={12} className="mr-1.5" /> 
                            {dateRange === 'all' ? '时间范围' : dateRange}
                        </button>
                        {showDateDropdown && (
                             <>
                                <div className="fixed inset-0 z-20" onClick={() => setShowDateDropdown(false)}></div>
                                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-xl z-30">
                                    <div className="py-1">
                                        {['all', '2023', '2024', '2025'].map(range => (
                                            <button
                                                key={range}
                                                onClick={() => { setDateRange(range); setShowDateDropdown(false); }}
                                                className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 ${dateRange === range ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
                                            >
                                                {range === 'all' ? '所有时间' : `${range} 年`}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                             </>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-xs text-slate-500 font-medium">共 {filteredAssets.length} 个资产</span>
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button 
                            onClick={() => setExplorerMode('list')}
                            className={`p-1.5 rounded transition-all ${explorerMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            title="列表视图"
                        >
                            <LayoutList size={16} />
                        </button>
                        <button 
                            onClick={() => setExplorerMode('map')}
                            className={`p-1.5 rounded transition-all ${explorerMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            title="地图视图"
                        >
                            <MapIcon size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ... (Existing stats visualization and List/Map views code) ... */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-4 bg-slate-50 border-b border-slate-200">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">当前筛选总量</p>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-bold text-slate-800">{stats.count}</span>
                            <span className="text-sm text-slate-500">assets</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Est. Volume: <span className="font-mono text-slate-600 font-medium">{stats.volume}</span></div>
                    </div>
                    <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
                        <Database size={20} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                     <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">类型分布</span>
                        <PieChart size={14} className="text-slate-400" />
                     </div>
                     <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        <div className="flex flex-col">
                           <div className="flex justify-between text-xs text-slate-500 mb-1">
                              <span>Image</span>
                              <span className="font-mono text-slate-700">{stats.types.Image}</span>
                           </div>
                           <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-500" style={{width: `${stats.count ? (stats.types.Image / stats.count) * 100 : 0}%`}}></div>
                           </div>
                        </div>
                        <div className="flex flex-col">
                           <div className="flex justify-between text-xs text-slate-500 mb-1">
                              <span>DB</span>
                              <span className="font-mono text-slate-700">{stats.types.DB}</span>
                           </div>
                           <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500" style={{width: `${stats.count ? (stats.types.DB / stats.count) * 100 : 0}%`}}></div>
                           </div>
                        </div>
                        <div className="flex flex-col">
                           <div className="flex justify-between text-xs text-slate-500 mb-1">
                              <span>Doc</span>
                              <span className="font-mono text-slate-700">{stats.types.Doc}</span>
                           </div>
                           <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-orange-500" style={{width: `${stats.count ? (stats.types.Doc / stats.count) * 100 : 0}%`}}></div>
                           </div>
                        </div>
                        <div className="flex flex-col">
                           <div className="flex justify-between text-xs text-slate-500 mb-1">
                              <span>Video</span>
                              <span className="font-mono text-slate-700">{stats.types.Video}</span>
                           </div>
                           <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-red-500" style={{width: `${stats.count ? (stats.types.Video / stats.count) * 100 : 0}%`}}></div>
                           </div>
                        </div>
                     </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                     <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">处理状态</span>
                        <BarChart3 size={14} className="text-slate-400" />
                     </div>
                     <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center text-slate-600">
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                已分发 (Routed)
                            </span>
                            <span className="font-mono font-bold text-slate-800">{stats.status.Routed}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center text-slate-600">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                编目中 (Cataloged)
                            </span>
                            <span className="font-mono font-bold text-slate-800">{stats.status.Cataloged}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center text-slate-600">
                                <span className="w-2 h-2 rounded-full bg-slate-400 mr-2"></span>
                                已归档 (Archived)
                            </span>
                            <span className="font-mono font-bold text-slate-800">{stats.status.Archived}</span>
                        </div>
                     </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 relative bg-slate-50 overflow-y-auto">
                    {explorerMode === 'list' && (
                         <div className="p-6">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">资产名称</th>
                                            <th className="px-6 py-3 font-medium">来源类型</th>
                                            <th className="px-6 py-3 font-medium">AI 标签</th>
                                            <th className="px-6 py-3 font-medium">大小 / 时间</th>
                                            <th className="px-6 py-3 font-medium">状态</th>
                                            <th className="px-6 py-3 font-medium text-right">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredAssets.map(asset => (
                                            <tr 
                                                key={asset.id} 
                                                onClick={() => { setSelectedAsset(asset); setActiveView('detail'); }}
                                                className={`cursor-pointer transition-colors ${selectedAsset?.id === asset.id ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className={`p-2 rounded mr-3 ${
                                                            asset.name.endsWith('.pdf') ? 'bg-red-50 text-red-500' : 
                                                            asset.name.endsWith('.tiff') ? 'bg-purple-50 text-purple-500' : 'bg-blue-50 text-blue-500'
                                                        }`}>
                                                            {asset.name.endsWith('.pdf') ? <FileText size={18} /> : 
                                                             asset.name.endsWith('.mp4') ? <Video size={18} /> :
                                                             <FileImage size={18} />}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-slate-900">{asset.name}</div>
                                                            <div className="text-xs text-slate-500">{asset.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded w-fit">
                                                        {getSourceIcon(asset.sourceType)}
                                                        <span className="uppercase ml-1">{asset.sourceType}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                        {asset.aiTags.keywords.slice(0, 2).map(k => (
                                                            <span key={k} className="text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                                                                {k}
                                                            </span>
                                                        ))}
                                                        {asset.aiTags.keywords.length > 2 && <span className="text-[10px] text-slate-400">+{asset.aiTags.keywords.length - 2}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-xs text-slate-900 font-mono">{asset.size}</div>
                                                    <div className="text-[10px] text-slate-400">{asset.timestamp}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(asset.status)}`}>
                                                        {asset.status === 'routed' && <CheckCircle2 size={10} className="mr-1.5"/>}
                                                        <span className="capitalize">{asset.status}</span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right relative">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenActionId(openActionId === asset.id ? null : asset.id);
                                                        }}
                                                        className={`p-1.5 rounded transition-colors ${openActionId === asset.id ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>
                                                    
                                                    {openActionId === asset.id && (
                                                        <>
                                                            <div className="fixed inset-0 z-30 cursor-default" onClick={(e) => { e.stopPropagation(); setOpenActionId(null); }}></div>
                                                            <div className="absolute right-8 top-1/2 -translate-y-1/2 w-32 bg-white rounded-lg shadow-xl border border-slate-100 z-40 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                                                                 <button 
                                                                    onClick={(e) => { 
                                                                        e.stopPropagation(); 
                                                                        setSelectedAsset(asset); 
                                                                        setActiveView('detail'); 
                                                                        setOpenActionId(null); 
                                                                    }}
                                                                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center transition-colors border-b border-slate-50"
                                                                 >
                                                                    <Edit3 size={14} className="mr-2" />
                                                                    修改
                                                                 </button>
                                                                 <button 
                                                                    onClick={() => handleDeleteAsset(asset.id)}
                                                                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center transition-colors"
                                                                 >
                                                                    <Trash2 size={14} className="mr-2" />
                                                                    删除
                                                                 </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                         </div>
                    )}

                    {explorerMode === 'map' && (
                        <div className="absolute inset-0 bg-slate-100 overflow-hidden">
                            <div className="absolute inset-0" style={{ 
                                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
                                backgroundSize: '30px 30px',
                                backgroundColor: '#f1f5f9' 
                            }}>
                                {filteredAssets.map(asset => (
                                    <div 
                                        key={asset.id}
                                        onClick={() => { setSelectedAsset(asset); setActiveView('detail'); }}
                                        className={`absolute w-12 h-12 border-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-110 shadow-sm rounded-lg bg-white
                                            ${selectedAsset?.id === asset.id ? 'border-blue-600 z-20 ring-4 ring-blue-100 scale-110' : 'border-white opacity-90 hover:opacity-100 hover:border-blue-300 z-10'}
                                        `}
                                        style={{ 
                                            top: `${asset.geometry.center?.y || 50}%`, 
                                            left: `${asset.geometry.center?.x || 50}%`,
                                        }}
                                    >
                                        <div style={{color: asset.thumbnailColor}} className="opacity-80">
                                            {asset.name.endsWith('.pdf') ? <FileText size={20} /> : 
                                            asset.name.endsWith('.mp4') ? <Video size={20} /> :
                                            <FileImage size={20} />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-xs font-mono text-slate-500">
                                检索模式: R-Tree 空间索引
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
      )}

      {activeView === 'rules' && (
        <div className="flex-1 flex bg-slate-100 overflow-hidden relative">
            {/* ... rule builder ... */}
            <div className="w-56 bg-white border-r border-slate-200 p-4 z-10 flex flex-col">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">组件库</h3>
                {/* ... existing components ... */}
                <div className="space-y-6">
                    {/* ... */}
                </div>
            </div>
            {/* ... rule canvas ... */}
            <div className="flex-1 relative overflow-hidden bg-slate-100 group cursor-grab active:cursor-grabbing">
                {/* ... */}
            </div>
             <div className={`w-80 bg-white border-l border-slate-200 z-20 transition-transform duration-300 ${selectedNodeId ? 'translate-x-0' : 'translate-x-full'}`}>
                {renderPropertyPanel()}
             </div>
        </div>
      )}

      {activeView === 'detail' && renderAssetDetail()}

      {showCreateModal && renderCreateTaskModal()}
    </div>
  );
};

function ActivityIcon({ size, className }: { size?: number, className?: string }) {
    return (
        <svg 
            width={size || 24} 
            height={size || 24} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
    );
}

export default SourceCatalog;
