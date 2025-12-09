
import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  MoreHorizontal, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Loader2,
  FileText,
  Workflow,
  Calendar
} from 'lucide-react';
import { AUTOMATION_JOBS, PIPELINES, SOURCE_FILES } from '../constants';
import { AutomationJob } from '../types';

const TaskManagement: React.FC = () => {
  const [jobs, setJobs] = useState<AutomationJob[]>(AUTOMATION_JOBS);
  const [isCreating, setIsCreating] = useState(false);

  // Mock function to create a new task
  const handleCreateTask = () => {
    setIsCreating(true);
    setTimeout(() => {
      const newJob: AutomationJob = {
        id: `JOB-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*100)}`,
        name: '手动触发: 临时路网更新',
        pipelineId: 'road',
        pipelineName: '路网数据产线 v3.0',
        sourceFile: 'Manual_Upload_001.geojson',
        startTime: 'Just now',
        duration: '-',
        status: 'running',
        progress: 0,
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // +2 days
      };
      setJobs([newJob, ...jobs]);
      setIsCreating(false);
    }, 1500);
  };

  const getStatusBadge = (status: AutomationJob['status']) => {
    switch (status) {
      case 'running':
        return <span className="flex items-center text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full text-xs font-bold"><Loader2 size={12} className="mr-1 animate-spin" /> 执行中</span>;
      case 'completed':
        return <span className="flex items-center text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full text-xs font-bold"><CheckCircle2 size={12} className="mr-1" /> 已完成</span>;
      case 'failed':
        return <span className="flex items-center text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full text-xs font-bold"><AlertCircle size={12} className="mr-1" /> 失败</span>;
      case 'queued':
        return <span className="flex items-center text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full text-xs font-bold"><Clock size={12} className="mr-1" /> 排队中</span>;
    }
  };

  return (
    <div className="flex-1 p-8 bg-slate-50 overflow-y-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Workflow className="mr-3 text-blue-600" />
            任务管理
          </h1>
          <p className="text-slate-500 mt-1">实例化流水线，调度与监控大规模自动化作业。</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm text-sm font-medium">
             <Filter size={16} className="mr-2" />
             筛选
           </button>
          <button 
            onClick={handleCreateTask}
            disabled={isCreating}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm text-sm font-medium disabled:opacity-70"
          >
            {isCreating ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Plus size={16} className="mr-2" />}
            {isCreating ? '创建中...' : '新建任务'}
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-xs text-slate-500 font-medium uppercase">今日运行任务</p>
             <h3 className="text-2xl font-bold text-slate-900">42</h3>
           </div>
           <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
             <Play size={20} />
           </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-xs text-slate-500 font-medium uppercase">平均耗时</p>
             <h3 className="text-2xl font-bold text-slate-900">34m</h3>
           </div>
           <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
             <Clock size={20} />
           </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-xs text-slate-500 font-medium uppercase">成功率</p>
             <h3 className="text-2xl font-bold text-green-600">98.5%</h3>
           </div>
           <div className="p-3 bg-green-50 text-green-600 rounded-lg">
             <CheckCircle2 size={20} />
           </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-xs text-slate-500 font-medium uppercase">排队等待</p>
             <h3 className="text-2xl font-bold text-slate-900">1</h3>
           </div>
           <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
             <MoreHorizontal size={20} />
           </div>
        </div>
      </div>

      {/* Task List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
           <div className="relative w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input 
               type="text" 
               placeholder="搜索任务ID或名称..." 
               className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
             />
           </div>
           <div className="text-sm text-slate-500">
             共 {jobs.length} 个任务
           </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-3">任务名称 / ID</div>
          <div className="col-span-2">引用流水线</div>
          <div className="col-span-2">数据源</div>
          <div className="col-span-2">状态 / 进度</div>
          <div className="col-span-2">截止日期</div>
          <div className="col-span-1 text-right">操作</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-100">
          {jobs.map((job) => (
            <div key={job.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-blue-50/30 transition-colors">
              
              <div className="col-span-3">
                 <div className="font-bold text-slate-800 text-sm mb-1">{job.name}</div>
                 <div className="text-xs text-slate-400 font-mono">{job.id}</div>
              </div>

              <div className="col-span-2">
                 <div className="flex items-center text-sm font-medium text-slate-700">
                    <Workflow size={14} className="mr-2 text-blue-500" />
                    <span className="truncate" title={job.pipelineName}>{job.pipelineName}</span>
                 </div>
              </div>

              <div className="col-span-2">
                 <div className="flex items-center text-xs text-slate-600">
                    <FileText size={12} className="mr-1.5 text-slate-400" />
                    <span className="truncate max-w-[120px]" title={job.sourceFile}>{job.sourceFile}</span>
                 </div>
              </div>

              <div className="col-span-2">
                 <div className="flex flex-col items-start">
                    <div className="mb-1.5">
                       {getStatusBadge(job.status)}
                    </div>
                    {job.status === 'running' && (
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500 rounded-full" style={{ width: `${job.progress}%` }}></div>
                      </div>
                    )}
                 </div>
              </div>

              <div className="col-span-2">
                 <div className="flex items-center text-xs text-slate-600">
                    <Calendar size={12} className="mr-1.5 text-slate-400" />
                    {job.dueDate || <span className="text-slate-300">-</span>}
                 </div>
              </div>

              <div className="col-span-1 text-right">
                 <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreHorizontal size={16} />
                 </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;
