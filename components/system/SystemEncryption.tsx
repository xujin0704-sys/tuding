
import React, { useState } from 'react';
import { Globe, Lock, Shield, AlertTriangle, FileKey, CheckCircle2, RefreshCcw } from 'lucide-react';

const SystemEncryption: React.FC = () => {
  const [crs, setCrs] = useState<'wgs84' | 'gcj02'>('gcj02');
  const [plugins, setPlugins] = useState([
    { id: 'p1', name: '国测局加密算法插件 (GCJ-Plugin)', version: 'v2.4.1', active: true, mandatory: true, lastUpdate: '2024-12-01' },
    { id: 'p2', name: '自定义偏移混淆器 (Custom-Offset)', version: 'v1.0.2', active: false, mandatory: false, lastUpdate: '2024-10-15' },
  ]);

  const togglePlugin = (id: string) => {
    setPlugins(prev => prev.map(p => 
      p.id === id ? { ...p, active: !p.active } : p
    ));
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50 animate-in fade-in">
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                        <Globe className="mr-3 text-indigo-600" />
                        坐标系与加密 (Coordinates & Encryption)
                    </h1>
                    <p className="text-slate-500 mt-1">管理平台默认输出坐标系及合规加密插件。</p>
                </div>
                <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 text-xs font-bold">
                    <Shield size={14} className="mr-1" />
                    Security Compliance: Pass
                </div>
            </div>

            {/* CRS Configuration */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Globe size={120} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center relative z-10">
                    输出控制 (Output Control)
                </h3>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div 
                        onClick={() => setCrs('wgs84')}
                        className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${crs === 'wgs84' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-300'}`}
                    >
                        <div className="flex items-center mb-2">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 ${crs === 'wgs84' ? 'border-indigo-600' : 'border-slate-400'}`}>
                                {crs === 'wgs84' && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
                            </div>
                            <span className={`font-bold ${crs === 'wgs84' ? 'text-indigo-900' : 'text-slate-700'}`}>WGS84 (GPS)</span>
                        </div>
                        <p className="text-xs text-slate-500 ml-7 leading-relaxed">
                            <span className="font-bold text-amber-600">内部专用：</span> 原始坐标系。仅限内部数据流转或科研用途，严禁直接对外发布未加密的敏感地理信息。
                        </p>
                    </div>

                    <div 
                        onClick={() => setCrs('gcj02')}
                        className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${crs === 'gcj02' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-300'}`}
                    >
                        <div className="flex items-center mb-2">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 ${crs === 'gcj02' ? 'border-indigo-600' : 'border-slate-400'}`}>
                                {crs === 'gcj02' && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
                            </div>
                            <span className={`font-bold ${crs === 'gcj02' ? 'text-indigo-900' : 'text-slate-700'}`}>GCJ-02 (Encrypted)</span>
                        </div>
                        <p className="text-xs text-slate-500 ml-7 leading-relaxed">
                            <span className="font-bold text-green-600">对外发布：</span> 国测局加密坐标系。平台默认对外输出格式，符合国家地理信息安全合规性要求。
                        </p>
                    </div>
                </div>
            </div>

            {/* Plugin Manager */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center">
                        插件管理 (Encryption Plugins)
                    </h3>
                    <button className="text-xs text-blue-600 hover:underline flex items-center">
                        <RefreshCcw size={12} className="mr-1"/> Check Updates
                    </button>
                </div>
                <div className="space-y-4">
                    {plugins.map(plugin => (
                        <div key={plugin.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 transition-all hover:shadow-sm">
                            <div className="flex items-center">
                                <div className={`p-2.5 rounded-lg border mr-4 ${plugin.active ? 'bg-green-100 border-green-200 text-green-700' : 'bg-white border-slate-200 text-slate-400'}`}>
                                    <FileKey size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800 text-sm flex items-center">
                                        {plugin.name}
                                        {plugin.mandatory && <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">Mandatory</span>}
                                    </div>
                                    <div className="text-xs text-slate-500 font-mono mt-0.5 flex items-center">
                                        {plugin.version}
                                        <span className="mx-2 text-slate-300">|</span>
                                        Updated: {plugin.lastUpdate}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <button 
                                    onClick={() => !plugin.mandatory && togglePlugin(plugin.id)}
                                    disabled={plugin.mandatory}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${plugin.active ? 'bg-indigo-600' : 'bg-slate-300'} ${plugin.mandatory ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${plugin.active ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start text-xs text-blue-800">
                    <Shield size={14} className="mr-2 mt-0.5 shrink-0" />
                    <div>
                        <span className="font-bold">安全提示：</span>
                        启用加密插件后，系统将在数据导出（Export）及 API 响应环节自动调用算法进行坐标偏移。此过程在内存中进行，不修改原始数据库。
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
export default SystemEncryption;
