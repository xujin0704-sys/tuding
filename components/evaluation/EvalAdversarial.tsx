
import React from 'react';
import { ShieldAlert, Bot } from 'lucide-react';
import { ADVERSARIAL_LOGS } from '../../constants';

const EvalAdversarial: React.FC = () => {
  return (
      <div className="flex h-full bg-slate-900 text-slate-300 font-mono p-6 overflow-hidden">
          <div className="w-full max-w-5xl mx-auto flex flex-col h-full">
              <div className="flex justify-between items-end mb-6">
                  <div>
                      <h2 className="text-2xl font-bold text-white flex items-center">
                          <ShieldAlert className="mr-3 text-rose-500" />
                          对抗性验证实验室
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">AI Agent 主动式攻击测试环境</p>
                  </div>
                  <button className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-all flex items-center">
                      <Bot className="mr-2" /> 启动攻击 (Attack)
                  </button>
              </div>

              <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
                  <div className="col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-4 flex flex-col">
                      <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">实时攻击日志 (Live Logs)</h3>
                      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                          {ADVERSARIAL_LOGS.map(log => (
                              <div key={log.id} className="bg-slate-900/50 p-3 rounded border border-slate-700/50 text-xs">
                                  <div className="flex justify-between items-center mb-1">
                                      <span className="font-bold text-blue-400">Agent: {log.agent}</span>
                                      <span className={`px-2 py-0.5 rounded ${log.result === 'Success' ? 'bg-green-900/30 text-green-400' : 'bg-rose-900/30 text-rose-400'}`}>
                                          {log.result === 'Success' ? 'DEFENDED' : 'BREACHED'}
                                      </span>
                                  </div>
                                  <div className="text-slate-300 mb-1">Action: {log.action}</div>
                                  <div className="text-slate-500">{log.details}</div>
                              </div>
                          ))}
                          <div className="animate-pulse flex space-x-2 p-2">
                              <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                              <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                              <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                          </div>
                      </div>
                  </div>

                  <div className="space-y-6 flex flex-col">
                      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 flex-1">
                          <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Agent 配置</h3>
                          <div className="space-y-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-2">攻击模式</label>
                                  <select className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-300 focus:border-blue-500 outline-none">
                                      <option>混合模式 (Mixed)</option>
                                      <option>极限寻路 (Pathfinding)</option>
                                      <option>拓扑破坏 (Topology)</option>
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-2">算力资源</label>
                                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                      <div className="bg-purple-500 h-full w-3/4"></div>
                                  </div>
                                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                      <span>12 Cores Active</span>
                                      <span>75% Usage</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                      
                      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
                          <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">鲁棒性评分</h3>
                          <div className="text-4xl font-bold text-white mb-1">92.4</div>
                          <p className="text-xs text-slate-500">Based on 1,042 attack vectors</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default EvalAdversarial;
