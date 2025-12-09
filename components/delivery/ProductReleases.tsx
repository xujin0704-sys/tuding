
import React from 'react';
import { Package, Box, Layers, ArrowRight, Play, AlertTriangle } from 'lucide-react';

const ProductReleases: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50 animate-in fade-in">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center">
              <Package className="mr-3 text-blue-600" />
              产品发版 (Product Releases)
            </h1>
            <p className="text-slate-500 mt-1">发版组装台：将各产线组件组装为最终产品。</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                    <Box size={20} className="mr-2 text-indigo-600"/> 发版组装台 (Assembly Workbench)
                </h3>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">清单选择器 (Manifest)</h4>
                    
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative group hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center font-bold text-slate-700">
                                <Layers size={16} className="mr-2 text-slate-400"/> 路网组件 (Road Network)
                            </div>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Stable</span>
                        </div>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500">
                            <option>Road-v20231220 [Stable]</option>
                            <option>Road-v20231221-RC1</option>
                        </select>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative group hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center font-bold text-slate-700">
                                <Layers size={16} className="mr-2 text-slate-400"/> POI 组件 (Points of Interest)
                            </div>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Stable</span>
                        </div>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500">
                            <option>POI-v20231231 [Stable]</option>
                            <option>POI-v20240105-Beta</option>
                        </select>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative group hover:border-blue-300 transition-colors opacity-60">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center font-bold text-slate-700">
                                <Layers size={16} className="mr-2 text-slate-400"/> 渲染配置 (Render Config)
                            </div>
                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold">Default</span>
                        </div>
                        <div className="text-sm text-slate-500 px-3 py-2 bg-slate-50 rounded border border-slate-200">
                            v2.1 (Standard Light)
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center border-l border-slate-100 pl-12">
                    <div className="mb-8">
                        <div className="flex items-center text-sm font-bold text-slate-700 mb-2">
                            <AlertTriangle size={16} className="mr-2 text-emerald-500"/>
                            依赖检查 (Dependency Check)
                        </div>
                        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-xs text-emerald-800">
                            All dependencies satisfied.
                            <br/>Admin Code Match: <span className="font-mono font-bold">PASSED</span>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center group">
                        <Play size={20} className="mr-2 group-hover:scale-110 transition-transform"/>
                        Build & Test Release
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-3">
                        Will trigger full integration simulation.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReleases;