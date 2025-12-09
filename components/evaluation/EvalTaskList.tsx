
import React, { useState } from 'react';
import { 
  Plus, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  Filter,
  ChevronDown
} from 'lucide-react';
import { EVAL_TASKS } from '../../constants';

const EvalTaskList: React.FC = () => {
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [isStartingTask, setIsStartingTask] = useState(false);
  const [filterCandidate, setFilterCandidate] = useState('all');
  const [filterBaseline, setFilterBaseline] = useState('all');

  const uniqueCandidates = Array.from(new Set(EVAL_TASKS.map(t => t.version)));
  const uniqueBaselines = Array.from(new Set(EVAL_TASKS.map(t => t.baseline).filter(Boolean)));

  const filteredTasks = EVAL_TASKS.filter(task => {
      return (filterCandidate === 'all' || task.version === filterCandidate) &&
             (filterBaseline === 'all' || task.baseline === filterBaseline);
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in">
        <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
            <div className="flex flex-col space-y-2">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">评测任务列表</h2>
                    <p className="text-xs text-slate-500">管理所有历史与进行中的仿真测试任务。</p>
                </div>
                <div className="flex space-x-3 items-center pt-2">
                    <div className="relative group">
                        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:border-blue-400 transition-colors">
                            <Filter size={12} className="text-slate-400"/>
                            <span>Candidate: {filterCandidate === 'all' ? '全部' : filterCandidate}</span>
                            <ChevronDown size={12} className="text-slate-400"/>
                        </div>
                        <select 
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            value={filterCandidate}
                            onChange={(e) => setFilterCandidate(e.target.value)}
                        >
                            <option value="all">全部候选版本</option>
                            {uniqueCandidates.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>
                    
                    <div className="relative group">
                        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:border-blue-400 transition-colors">
                            <Filter size={12} className="text-slate-400"/>
                            <span>Baseline: {filterBaseline === 'all' ? '全部' : filterBaseline}</span>
                            <ChevronDown size={12} className="text-slate-400"/>
                        </div>
                        <select 
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            value={filterBaseline}
                            onChange={(e) => setFilterBaseline(e.target.value)}
                        >
                            <option value="all">全部基线版本</option>
                            {uniqueBaselines.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            <button 
                onClick={() => setShowNewTaskModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm text-sm font-medium transition-colors"
            >
                <Plus size={16} className="mr-2" /> 发起新评测
            </button>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                        <tr>
                            <th className="px-6 py-4">任务 ID</th>
                            <th className="px-6 py-4">待测版本 (Candidate)</th>
                            <th className="px-6 py-4">基线版本 (Baseline)</th>
                            <th className="px-6 py-4">测试类型</th>
                            <th className="px-6 py-4">提交人</th>
                            <th className="px-6 py-4">状态 / 进度</th>
                            <th className="px-6 py-4">耗时</th>
                            <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {filteredTasks.map(task => (
                            <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-slate-600">{task.id}</td>
                                <td className="px-6 py-4 font-bold text-slate-800">{task.version}</td>
                                <td className="px-6 py-4 text-slate-600 font-medium">
                                    {task.baseline || <span className="text-slate-300">-</span>}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-slate-100 rounded text-slate-600 text-xs font-medium border border-slate-200">
                                        {task.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{task.submitter}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        {task.status === 'running' && <Loader2 size={14} className="mr-2 text-blue-500 animate-spin" />}
                                        {task.status === 'passed' && <CheckCircle2 size={14} className="mr-2 text-green-500" />}
                                        {task.status === 'failed' && <AlertTriangle size={14} className="mr-2 text-rose-500" />}
                                        <span className={`capitalize font-medium ${
                                            task.status === 'running' ? 'text-blue-600' : 
                                            task.status === 'passed' ? 'text-green-600' : 'text-rose-600'
                                        }`}>
                                            {task.status} {task.status === 'running' && `(${task.progress}%)`}
                                        </span>
                                    </div>
                                    {task.status === 'running' && (
                                        <div className="w-24 bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                                            <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{width: `${task.progress}%`}}></div>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-slate-500 font-mono text-xs">{task.duration}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 hover:text-blue-800 text-xs font-bold hover:underline">查看报告</button>
                                </td>
                            </tr>
                        ))}
                        {filteredTasks.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                                    暂无符合筛选条件的任务
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* New Task Modal */}
      {showNewTaskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-xl shadow-2xl w-[600px] overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800">发起新评测任务</h3>
                      <button onClick={() => setShowNewTaskModal(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                  </div>
                  <div className="p-6 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">待测版本 (Candidate)</label>
                              <select className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none">
                                  <option>v2.0.0-rc</option>
                                  <option>v2.0.0-beta.2</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">基线版本 (Baseline)</label>
                              <select className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none">
                                  <option>v1.9.5 (Live)</option>
                                  <option>v1.9.0</option>
                              </select>
                          </div>
                      </div>
                      
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-3">测试套件 (Test Suites)</label>
                          <div className="space-y-3">
                              <label className="flex items-center p-3 border border-blue-200 bg-blue-50 rounded-lg cursor-pointer">
                                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                                  <div className="ml-3">
                                      <span className="block text-sm font-bold text-slate-800">Static QA (Essential)</span>
                                      <span className="block text-xs text-slate-500">Geometry, Attribute, and Schema validation.</span>
                                  </div>
                              </label>
                              <label className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                                  <div className="ml-3">
                                      <span className="block text-sm font-bold text-slate-800">Service Simulation</span>
                                      <span className="block text-xs text-slate-500">Routing regression & Visual diff.</span>
                                  </div>
                              </label>
                              <label className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                                  <div className="ml-3">
                                      <span className="block text-sm font-bold text-slate-800">Adversarial Attack</span>
                                      <span className="block text-xs text-slate-500">AI Agents active probing. (Slow)</span>
                                  </div>
                              </label>
                          </div>
                      </div>
                  </div>
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
                      <button onClick={() => setShowNewTaskModal(false)} className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50">取消</button>
                      <button 
                        onClick={() => { setIsStartingTask(true); setTimeout(() => { setIsStartingTask(false); setShowNewTaskModal(false); }, 1000); }}
                        className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center"
                      >
                          {isStartingTask && <Loader2 size={14} className="mr-2 animate-spin" />}
                          {isStartingTask ? '启动中...' : '开始评测'}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default EvalTaskList;
