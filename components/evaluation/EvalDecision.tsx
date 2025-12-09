
import React from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

const EvalDecision: React.FC = () => {
  return (
      <div className="flex flex-col h-full items-center justify-center bg-slate-50 p-8 overflow-y-auto">
          <div className="w-full max-w-4xl space-y-8">
              <div className="text-center">
                  <h2 className="text-3xl font-bold text-slate-900">版本发布决策报告</h2>
                  <p className="text-slate-500 mt-2">Release Candidate: <span className="font-mono font-bold text-slate-700">v2.0.0-rc</span></p>
              </div>

              {/* Scorecard */}
              <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">静态质量</div>
                      <div className="text-4xl font-bold text-emerald-500 mb-1">98</div>
                      <div className="text-xs text-slate-500">Geometry & Logic Checks</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center ring-2 ring-rose-100">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">仿真可用性</div>
                      <div className="text-4xl font-bold text-rose-500 mb-1">82</div>
                      <div className="text-xs text-rose-600 font-bold">Failed Golden Set (Routing)</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">覆盖率</div>
                      <div className="text-4xl font-bold text-blue-500 mb-1">100%</div>
                      <div className="text-xs text-slate-500">Core Areas Verified</div>
                  </div>
              </div>

              {/* Heatmap Placeholder */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4">变更热力图 (Diff Heatmap)</h3>
                  <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/116.4074,39.9042,11,0/800x300?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGUifQ')] bg-cover opacity-50"></div>
                      {/* Heat Blobs */}
                      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-500 rounded-full blur-2xl opacity-40"></div>
                      <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-red-500 rounded-full blur-2xl opacity-40"></div>
                      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-yellow-500 rounded-full blur-2xl opacity-40"></div>
                      <div className="relative z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-xs font-mono">
                          <div className="flex items-center gap-4">
                              <span className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>新增: 1,240</span>
                              <span className="flex items-center"><span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>修改: 856</span>
                              <span className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>删除: 120</span>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center space-x-4 pt-4 border-t border-slate-200">
                  <button className="flex items-center px-8 py-3 bg-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-300 transition-colors">
                      <ThumbsDown className="mr-2" /> 驳回 (Reject)
                  </button>
                  <button className="flex items-center px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition-all">
                      <ThumbsUp className="mr-2" /> 批准发布 (Release)
                  </button>
              </div>
          </div>
      </div>
  );
};

export default EvalDecision;
