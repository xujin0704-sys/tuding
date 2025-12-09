
import React, { useState } from 'react';
import { 
  Workflow, 
  Play, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  MoreHorizontal, 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  ArrowLeft, 
  Terminal, 
  FileCode, 
  Pause, 
  Edit, 
  Eye, 
  Download, 
  Box, 
  Layers, 
  Zap, 
  PackageCheck, 
  UserCheck, 
  CornerDownRight, 
  Cpu, 
  ArrowRight, 
  LayoutDashboard, 
  List, 
  UserPlus, 
  ArrowUpRight, 
  MapPin, 
  X, 
  Database,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { AUTOMATION_JOBS, SOURCE_FILES } from '../constants';
import { AutomationJob, PipelineDef } from '../types';

interface PipelineTaskCenterProps {
  pipelineDefs: PipelineDef[];
  onWorkTask: (pipelineId: string, taskId: number) => void;
}

// Mock Data Item Interface
interface DataItem {
  id: number;
  jobId: string;
  title: string;
  status: 'pending' | 'processing' | 'claimed' | 'completed' | 'rejected';
  assignee: string | null;
  priority: 'High' | 'Medium' | 'Low';
  type: string;
}

const PipelineTaskCenter: React.FC<PipelineTaskCenterProps> = ({ pipelineDefs, onWorkTask }) => {
  // -- View State --
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs'>('jobs');
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'monitor' | 'data'>('data');
  const [selectedPipelineFilter, setSelectedPipelineFilter] = useState<string>('all');

  // -- Data State --
  const [jobs, setJobs] = useState<AutomationJob[]>(AUTOMATION_JOBS);
  const [isCreating, setIsCreating] = useState(false);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  
  // -- Create Task Modal State --
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    name: '',
    pipelineId: '',
    subPipelineIds: [] as string[],
    sourceFile: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: ''
  });

  // -- Mock Data Items for Detail View --
  const [dataItems, setDataItems] = useState<DataItem[]>([]);

  // Generate mock items when entering detail view
  const loadJobDetails = (job: AutomationJob) => {
    setActiveJobId(job.id);
    // Simulate fetching items
    const mockItems: DataItem[] = Array.from({ length: 12 }).map((_, i) => ({
      id: 1000 + i,
      jobId: job.id,
      title: `${job.pipelineId === 'poi' ? 'POI' : job.pipelineId === 'road' ? '道路' : '行政'}要素 #${1000 + i}`,
      status: i < 3 ? 'completed' : i < 5 ? 'claimed' : 'pending',
      assignee: i < 3 ? 'System' : i < 5 ? 'Current User' : null,
      priority: i % 4 === 0 ? 'High' : 'Medium',
      type: job.pipelineId
    }));
    setDataItems(mockItems);
    setActiveDetailTab('data');
  };

  // Execution Handlers
  const handleOpenCreateModal = () => {
    const defaultPipelineId = selectedPipelineFilter !== 'all' ? selectedPipelineFilter : (pipelineDefs[0]?.id || '');
    const defaultSubPipelines = pipelineDefs.find(p => p.id === defaultPipelineId)?.subPipelines || [];
    const defaultSubPipelineIds = defaultSubPipelines.length > 0 ? [defaultSubPipelines[0].id] : [];

    setNewTaskForm({
        name: '',
        pipelineId: defaultPipelineId,
        subPipelineIds: defaultSubPipelineIds,
        sourceFile: '',
        priority: 'medium',
        dueDate: ''
    });
    setShowCreateModal(true);
  };

  const handleCreateTaskSubmit = () => {
    if (!newTaskForm.name || !newTaskForm.pipelineId) return;

    setIsCreating(true);
    
    // Simulate API Call
    setTimeout(() => {
      const selectedPipeline = pipelineDefs.find(p => p.id === newTaskForm.pipelineId);
      const newJob: AutomationJob = {
        id: `JOB-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*1000)}`,
        name: newTaskForm.name,
        pipelineId: newTaskForm.pipelineId,
        pipelineName: selectedPipeline?.name || '未知产线',
        sourceFile: newTaskForm.sourceFile || 'Manual_Input_Data',
        startTime: 'Just now',
        duration: '-',
        status: 'queued',
        progress: 0,
        priority: newTaskForm.priority,
        stats: { total: 0, auto: 0, manual: 0 },
        dueDate: newTaskForm.dueDate
      };
      
      setJobs([newJob, ...jobs]);
      setIsCreating(false);
      setShowCreateModal(false);
    }, 1000);
  };

  const handleClaimItem = (itemId: number) => {
    setDataItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 'claimed', assignee: 'Current User' } : item
    ));
  };

  const handleDispatchItem = (itemId: number) => {
    const user = prompt("请输入分发目标用户 (User ID):", "User_B");
    if (user) {
      setDataItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, status: 'claimed', assignee: user } : item
      ));
    }
  };

  const filteredJobs = selectedPipelineFilter === 'all' 
    ? jobs 
    : jobs.filter(j => j.pipelineId === selectedPipelineFilter);

  // Charts Data
  const jobStatusData = [
    { name: 'Completed', value: jobs.filter(j => j.status === 'completed').length, color: '#10b981' },
    { name: 'Running', value: jobs.filter(j => j.status === 'running').length, color: '#3b82f6' },
    { name: 'Failed', value: jobs.filter(j => j.status === 'failed').length, color: '#f43f5e' },
    { name: 'Queued', value: jobs.filter(j => j.status === 'queued').length, color: '#94a3b8' },
  ];

  const pipelineDistData = pipelineDefs.map(p => ({
    name: p.name,
    count: jobs.filter(j => j.pipelineId === p.id).length
  }));

  const getStatusBadge = (status: AutomationJob['status']) => {
    switch (status) {
      case 'running': return <span className="flex items-center text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full text-xs font-bold"><Loader2 size={12} className="mr-1 animate-spin" /> 执行中</span>;
      case 'completed': return <span className="flex items-center text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full text-xs font-bold"><CheckCircle2 size={12} className="mr-1" /> 已完成</span>;
      case 'failed': return <span className="flex items-center text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full text-xs font-bold"><AlertCircle size={12} className="mr-1" /> 失败</span>;
      case 'queued': return <span className="flex items-center text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full text-xs font-bold"><Clock size={12} className="mr-1" /> 排队中</span>;
    }
  };

  const renderDashboard = () => (
    <div className="p-8 space-y-8 animate-in fade-in duration-300 overflow-y-auto h-full">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">任务包总数</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{jobs.length}</h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Layers size={24} />
                </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">平均耗时</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">34m</h3>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <Clock size={24} />
                </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">成功率</p>
                    <h3 className="text-2xl font-bold text-green-600 mt-1">98.5%</h3>
                </div>
                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                    <CheckCircle2 size={24} />
                </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">正在排队</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{jobs.filter(j => j.status === 'queued').length}</h3>
                </div>
                <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                    <MoreHorizontal size={24} />
                </div>
            </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-6">产线任务分布</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={pipelineDistData} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" fontSize={12} stroke="#94a3b8" />
                            <YAxis dataKey="name" type="category" width={100} fontSize={12} stroke="#64748b" />
                            <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                <h3 className="text-sm font-bold text-slate-800 mb-2 w-full text-left">任务状态占比</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={jobStatusData} 
                                innerRadius={60} 
                                outerRadius={80} 
                                paddingAngle={5} 
                                dataKey="value"
                            >
                                {jobStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex gap-4 text-xs">
                    {jobStatusData.map((entry) => (
                        <div key={entry.name} className="flex items-center">
                            <div className="w-2 h-2 rounded-full mr-1" style={{backgroundColor: entry.color}}></div>
                            <span className="text-slate-600">{entry.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );

  const renderJobList = () => (
    <div className="flex flex-1 h-full overflow-hidden">
        {/* Sidebar Filters */}
        <div className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-500 uppercase tracking-wider">
                产线筛选
            </div>
            <div className="p-2 space-y-1">
                <button 
                    onClick={() => setSelectedPipelineFilter('all')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between ${selectedPipelineFilter === 'all' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    <span className="flex items-center"><LayoutDashboard size={14} className="mr-2"/> 全部任务</span>
                    <span className="text-xs bg-white border px-1.5 rounded">{jobs.length}</span>
                </button>
                {pipelineDefs.map(p => (
                    <button 
                        key={p.id}
                        onClick={() => setSelectedPipelineFilter(p.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between ${selectedPipelineFilter === p.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <span className="truncate">{p.name}</span>
                        <span className="text-xs bg-slate-50 border px-1.5 rounded">{jobs.filter(j => j.pipelineId === p.id).length}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* List Content */}
        <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
            {/* Toolbar */}
            <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                        type="text" 
                        placeholder="搜索任务包名称..." 
                        className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <button 
                    onClick={handleOpenCreateModal}
                    className="flex items-center px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm text-sm font-medium transition-colors"
                >
                    <Plus size={14} className="mr-2" />
                    新建任务包
                </button>
            </div>

            {/* List Table */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-3">任务名称 / ID</th>
                                <th className="px-6 py-3">产线类型</th>
                                <th className="px-6 py-3">统计 (总量/自动/人工)</th>
                                <th className="px-6 py-3">状态</th>
                                <th className="px-6 py-3">截止日期</th>
                                <th className="px-6 py-3 text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {filteredJobs.map(job => (
                                <tr 
                                    key={job.id} 
                                    onClick={() => loadJobDetails(job)}
                                    className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800 text-sm group-hover:text-blue-600">{job.name}</div>
                                        <div className="text-xs text-slate-400 font-mono mt-0.5">{job.id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded border bg-slate-50 text-slate-600 border-slate-200 text-xs">
                                            <Layers size={10} className="mr-1.5"/>
                                            {job.pipelineName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {job.stats ? (
                                            <div className="flex items-center space-x-3 text-xs">
                                                <span className="font-bold text-slate-700">{job.stats.total}</span>
                                                <span className="text-slate-300">|</span>
                                                <span className="font-bold text-purple-600">{job.stats.auto}</span>
                                                <span className="text-slate-300">|</span>
                                                <span className="font-bold text-amber-600">{job.stats.manual}</span>
                                            </div>
                                        ) : <span className="text-slate-300">-</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(job.status)}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-600">
                                        {job.dueDate || <span className="text-slate-300">-</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 text-xs font-bold hover:underline">
                                            查看详情
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );

  const renderJobDetail = () => {
    const selectedJob = jobs.find(j => j.id === activeJobId);
    if (!selectedJob) return null;

    return (
      <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden animate-in slide-in-from-right duration-300">
         {/* Detail Header */}
         <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center space-x-4">
               <button 
                 onClick={() => setActiveJobId(null)}
                 className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
               >
                 <ArrowLeft size={20} />
               </button>
               <div>
                 <div className="flex items-center">
                    <h2 className="text-lg font-bold text-slate-900 mr-3">{selectedJob.name}</h2>
                    {getStatusBadge(selectedJob.status)}
                 </div>
                 <div className="text-xs text-slate-500 mt-0.5 flex items-center">
                    <span className="font-mono mr-3">ID: {selectedJob.id}</span>
                    {selectedJob.dueDate && <span className="flex items-center"><Calendar size={10} className="mr-1"/> Due: {selectedJob.dueDate}</span>}
                 </div>
               </div>
            </div>
            
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveDetailTab('monitor')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center ${activeDetailTab === 'monitor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Zap size={14} className="mr-2" /> 运行监控
                </button>
                <button 
                    onClick={() => setActiveDetailTab('data')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center ${activeDetailTab === 'data' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <List size={14} className="mr-2" /> 数据明细 (Items)
                </button>
            </div>
         </div>

         {/* Content Area */}
         <div className="flex-1 overflow-y-auto p-6">
            
            {activeDetailTab === 'data' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 text-sm">任务包数据列表 ({dataItems.length})</h3>
                        <div className="flex space-x-2">
                            <button className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-600 hover:bg-slate-50">批量认领</button>
                            <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 shadow-sm">自动分发</button>
                        </div>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-3">数据 ID / 标题</th>
                                <th className="px-6 py-3">优先级</th>
                                <th className="px-6 py-3">状态</th>
                                <th className="px-6 py-3">作业员 (Assignee)</th>
                                <th className="px-6 py-3 text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {dataItems.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50 group">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-800">{item.title}</div>
                                        <div className="text-xs text-slate-400 font-mono mt-0.5">#{item.id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.priority === 'High' ? (
                                            <span className="text-rose-600 font-bold text-xs bg-rose-50 px-2 py-0.5 rounded">HIGH</span>
                                        ) : (
                                            <span className="text-slate-500 text-xs bg-slate-100 px-2 py-0.5 rounded">NORMAL</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.status === 'pending' && <span className="inline-flex items-center text-slate-500 text-xs bg-slate-100 px-2 py-1 rounded"><Clock size={12} className="mr-1"/> 待分配</span>}
                                        {item.status === 'claimed' && <span className="inline-flex items-center text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded"><UserCheck size={12} className="mr-1"/> 已认领</span>}
                                        {item.status === 'completed' && <span className="inline-flex items-center text-green-600 text-xs bg-green-50 px-2 py-1 rounded"><CheckCircle2 size={12} className="mr-1"/> 已完成</span>}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-xs">
                                        {item.assignee || <span className="text-slate-300 italic">Unassigned</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            {item.status === 'pending' && (
                                                <>
                                                    <button 
                                                        onClick={() => handleClaimItem(item.id)}
                                                        className="px-2 py-1 border border-slate-200 rounded text-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                                                    >
                                                        认领
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDispatchItem(item.id)}
                                                        className="px-2 py-1 border border-slate-200 rounded text-xs hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-colors"
                                                    >
                                                        分发
                                                    </button>
                                                </>
                                            )}
                                            {item.assignee === 'Current User' && item.status !== 'completed' && (
                                                <button 
                                                    onClick={() => onWorkTask(item.type, item.id)}
                                                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 shadow-sm flex items-center"
                                                >
                                                    作业 <ArrowUpRight size={12} className="ml-1" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeDetailTab === 'monitor' && (
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Reuse existing monitor view components logic roughly here */}
                  <div className="lg:col-span-2 space-y-6">
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                         <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
                            <Workflow size={16} className="mr-2 text-blue-500"/>
                            执行流水线概览
                         </h3>
                         <div className="w-full h-48 bg-slate-50 rounded-lg border border-slate-100 relative overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/grid.png')]"></div>
                            <div className="flex items-center space-x-8 relative z-10">
                               <div className="flex flex-col items-center">
                                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-indigo-600 mb-2">
                                     <FileText size={18} />
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-500">Input</span>
                                </div>
                               <ArrowRight size={16} className="text-slate-300" />
                               <div className="flex flex-col items-center">
                                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 shadow-sm flex items-center justify-center text-blue-600 mb-2 ring-2 ring-blue-100">
                                     <Cpu size={18} />
                                  </div>
                                  <span className="text-[10px] font-bold text-blue-600">Processing</span>
                               </div>
                               <ArrowRight size={16} className="text-slate-300" />
                               <div className="flex flex-col items-center">
                                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-emerald-600 mb-2">
                                     <PackageCheck size={18} />
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-500">Output</span>
                               </div>
                            </div>
                         </div>
                      </div>
                      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden flex flex-col h-64">
                         <div className="px-4 py-2 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                            <h3 className="text-xs font-bold text-slate-300 flex items-center font-mono">
                               <Terminal size={14} className="mr-2"/>
                               System Logs
                            </h3>
                         </div>
                         <div className="flex-1 p-4 font-mono text-xs text-slate-400 space-y-1 overflow-y-auto">
                            <div>[INFO] Job initialized at {selectedJob.startTime}</div>
                            <div>[INFO] Resource allocated: 4 cores</div>
                            <div>[INFO] Pipeline: {selectedJob.pipelineName}</div>
                            <div>[INFO] Loading source: {selectedJob.sourceFile}</div>
                            {selectedJob.status === 'running' && <div className="text-green-400 animate-pulse">[RUNNING] Processing batch 42...</div>}
                         </div>
                      </div>
                  </div>
                  <div className="space-y-6">
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                         <h3 className="text-sm font-bold text-slate-800 mb-4">基本信息</h3>
                         <div className="space-y-3">
                            <div className="flex justify-between text-xs"><span className="text-slate-500">Created</span><span className="text-slate-800">{selectedJob.startTime}</span></div>
                            <div className="flex justify-between text-xs"><span className="text-slate-500">Duration</span><span className="text-slate-800">{selectedJob.duration}</span></div>
                            <div className="flex justify-between text-xs"><span className="text-slate-500">Priority</span><span className="text-slate-800">{selectedJob.priority}</span></div>
                            <div className="flex justify-between text-xs"><span className="text-slate-500">Due Date</span><span className="text-slate-800">{selectedJob.dueDate || '-'}</span></div>
                         </div>
                      </div>
                  </div>
               </div>
            )}

         </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden relative">
      
      {/* Top Navigation */}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shadow-sm shrink-0">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold text-slate-900 flex items-center">
            <Workflow className="mr-3 text-blue-600" />
            流水线任务中心
          </h1>
          <div className="flex bg-slate-100 p-1 rounded-lg">
             <button 
                onClick={() => { setActiveTab('dashboard'); setActiveJobId(null); }}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center ${activeTab === 'dashboard' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                <LayoutDashboard size={16} className="mr-2" /> 任务仪表盘
             </button>
             <button 
                onClick={() => { setActiveTab('jobs'); setActiveJobId(null); }}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center ${activeTab === 'jobs' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                <List size={16} className="mr-2" /> 任务列表
             </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
         {activeJobId ? renderJobDetail() : (
            activeTab === 'dashboard' ? renderDashboard() : renderJobList()
         )}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white rounded-xl shadow-2xl w-[500px] overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                 <h3 className="font-bold text-slate-800 flex items-center">
                    <Plus size={18} className="mr-2 text-blue-600" /> 新建任务包
                 </h3>
                 <button onClick={() => setShowCreateModal(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
              </div>
              <div className="p-6 space-y-5">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">任务名称</label>
                    <input 
                      type="text" 
                      value={newTaskForm.name}
                      onChange={e => setNewTaskForm({...newTaskForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none"
                      placeholder="例如: 海淀区路网更新 2024Q1"
                    />
                 </div>
                 
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">关联产线</label>
                    <select 
                      value={newTaskForm.pipelineId}
                      onChange={e => {
                          const pid = e.target.value;
                          const pDef = pipelineDefs.find(p => p.id === pid);
                          const subPipelines = pDef?.subPipelines || [];
                          // Reset subPipelineIds to the first one available or empty
                          setNewTaskForm({
                              ...newTaskForm, 
                              pipelineId: pid,
                              subPipelineIds: subPipelines.length > 0 ? [subPipelines[0].id] : []
                          });
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none bg-white"
                    >
                       <option value="" disabled>请选择产线...</option>
                       {pipelineDefs.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                       ))}
                    </select>
                 </div>

                 {/* New Sub-Pipeline Selection (Multi-select) */}
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">子流程 (可多选)</label>
                    <div className="w-full px-3 py-2 border border-slate-200 rounded bg-white max-h-40 overflow-y-auto">
                        {!newTaskForm.pipelineId ? (
                            <span className="text-slate-400 text-sm">请先选择关联产线...</span>
                        ) : (
                            <div className="space-y-2">
                                {pipelineDefs.find(p => p.id === newTaskForm.pipelineId)?.subPipelines.map(sub => (
                                    <label key={sub.id} className="flex items-center space-x-2 cursor-pointer group hover:bg-slate-50 p-1 -mx-1 rounded transition-colors">
                                        <input 
                                            type="checkbox"
                                            checked={newTaskForm.subPipelineIds.includes(sub.id)}
                                            onChange={e => {
                                                const checked = e.target.checked;
                                                setNewTaskForm(prev => ({
                                                    ...prev,
                                                    subPipelineIds: checked 
                                                        ? [...prev.subPipelineIds, sub.id]
                                                        : prev.subPipelineIds.filter(id => id !== sub.id)
                                                }));
                                            }}
                                            className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4"
                                        />
                                        <span className="text-sm text-slate-700 group-hover:text-blue-700">{sub.name}</span>
                                    </label>
                                ))}
                                {pipelineDefs.find(p => p.id === newTaskForm.pipelineId)?.subPipelines.length === 0 && (
                                    <span className="text-slate-400 text-sm italic">该产线暂无子流程配置</span>
                                )}
                            </div>
                        )}
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">源数据文件</label>
                    <select 
                      value={newTaskForm.sourceFile}
                      onChange={e => setNewTaskForm({...newTaskForm, sourceFile: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none bg-white"
                    >
                       <option value="" disabled>选择资料集市文件...</option>
                       {SOURCE_FILES.map(f => (
                          <option key={f.id} value={f.name}>{f.name} ({f.size})</option>
                       ))}
                       <option value="Manual_Input.dat">手动输入/其他</option>
                    </select>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">优先级</label>
                        <div className="flex space-x-4 h-[38px] items-center">
                        {['high', 'medium', 'low'].map(p => (
                            <label key={p} className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="priority" 
                                    checked={newTaskForm.priority === p}
                                    onChange={() => setNewTaskForm({...newTaskForm, priority: p as any})}
                                    className="mr-2 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-700 capitalize">{p}</span>
                            </label>
                        ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">截止日期 (Due Date)</label>
                        <input 
                            type="date"
                            value={newTaskForm.dueDate}
                            onChange={e => setNewTaskForm({...newTaskForm, dueDate: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none"
                        />
                    </div>
                 </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
                 <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50">取消</button>
                 <button 
                    onClick={handleCreateTaskSubmit}
                    disabled={isCreating || !newTaskForm.name || !newTaskForm.pipelineId}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                 >
                    {isCreating ? <Loader2 size={16} className="mr-2 animate-spin" /> : null}
                    {isCreating ? '创建中...' : '立即创建'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PipelineTaskCenter;
