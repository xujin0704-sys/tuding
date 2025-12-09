
import React, { useState } from 'react';
import { MapPin, Bug } from 'lucide-react';
import { QA_ISSUES } from '../../constants';

const EvalStaticQA: React.FC = () => {
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(QA_ISSUES[0].id);

  return (
      <div className="flex h-full bg-slate-50 overflow-hidden">
          {/* Issue List */}
          <div className="w-80 bg-white border-r border-slate-200 flex flex-col z-10 shadow-sm shrink-0">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">质检问题清单</h3>
                  <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">{QA_ISSUES.length}</span>
              </div>
              <div className="p-2 border-b border-slate-100 flex space-x-2">
                  {['Geometry', 'Attribute', 'Logic'].map(type => (
                      <button key={type} className="flex-1 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 rounded hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors">
                          {type}
                      </button>
                  ))}
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {QA_ISSUES.map(issue => (
                      <div 
                        key={issue.id} 
                        onClick={() => setSelectedIssueId(issue.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedIssueId === issue.id 
                            ? 'bg-blue-50 border-blue-200 shadow-sm' 
                            : 'bg-white border-slate-200 hover:border-blue-300'
                        }`}
                      >
                          <div className="flex justify-between items-start mb-1">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                  issue.severity === 'Critical' ? 'bg-rose-100 text-rose-700' :
                                  issue.severity === 'High' ? 'bg-orange-100 text-orange-700' : 
                                  'bg-slate-100 text-slate-600'
                              }`}>
                                  {issue.severity}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{issue.id}</span>
                          </div>
                          <div className="text-xs font-medium text-slate-800 mb-1 line-clamp-2">{issue.desc}</div>
                          <div className="flex items-center text-[10px] text-slate-500">
                              <MapPin size={10} className="mr-1" /> {issue.location}
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Visualization Area */}
          <div className="flex-1 flex flex-col relative bg-slate-100">
              <div className="absolute inset-0 bg-[#eef0f3] overflow-hidden">
                  {/* Mock Map Background */}
                  <div className="absolute inset-0 opacity-20" style={{ 
                        backgroundImage: `linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                  }}></div>
                  
                  {/* Mock Issue Visualization */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      {/* Context shapes */}
                      <svg width="400" height="400" viewBox="0 0 400 400" className="drop-shadow-xl">
                          <path d="M 50 150 L 350 150" stroke="#cbd5e1" strokeWidth="20" strokeLinecap="round" />
                          <path d="M 200 50 L 200 350" stroke="#cbd5e1" strokeWidth="20" strokeLinecap="round" />
                          
                          {/* The Error Shape (e.g., Self Intersection) */}
                          <path 
                            d="M 150 100 L 250 100 L 150 200 L 250 200 Z" 
                            fill="rgba(244, 63, 94, 0.2)" 
                            stroke="#f43f5e" 
                            strokeWidth="3" 
                            className="animate-pulse"
                          />
                          {/* Error Point */}
                          <circle cx="200" cy="150" r="8" fill="#f43f5e" className="animate-ping" />
                      </svg>
                  </div>

                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-4 rounded-xl border border-slate-200 shadow-lg max-w-sm">
                      <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center">
                          <Bug size={16} className="mr-2 text-rose-500" />
                          错误详情
                      </h4>
                      <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                          检测到多边形几何存在自相交节点。这会导致渲染引擎在处理该区域时发生异常。建议使用拓扑修复工具进行修正。
                      </p>
                      <div className="flex space-x-2">
                          <button className="flex-1 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700">跳转作业台修复</button>
                          <button className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-600 hover:bg-slate-50">忽略</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default EvalStaticQA;
