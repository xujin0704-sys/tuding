
import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Globe, 
  EyeOff, 
  Download, 
  FileCheck,
  Lock,
  Ban,
  Fingerprint,
  AlertTriangle,
  Component,
  Plus,
  Trash2,
  Map as MapIcon,
  Eye
} from 'lucide-react';

const SystemSecurity: React.FC = () => {
  // Coordinate & Encryption State
  const [crs, setCrs] = useState('gcj02');
  const [plugins, setPlugins] = useState([
    { id: 'p1', name: '国测局加密算法插件 (GCJ-Plugin)', version: 'v2.1.0', status: true, mandatory: true },
    { id: 'p2', name: '自定义偏移混淆器', version: 'v1.0.5', status: false, mandatory: false },
  ]);

  // Geofencing State
  const [zones, setZones] = useState([
    { id: 1, name: '京西军事管理区', type: 'Military', center: '116.12, 39.95', radius: '5km', policy: 'block', active: true },
    { id: 2, name: 'XX 市政府大院', type: 'Government', center: '116.38, 39.91', radius: '800m', policy: 'mask', active: true },
    { id: 3, name: '关键能源设施 B', type: 'Infrastructure', center: '116.45, 39.88', radius: '1.2km', policy: 'alert', active: true },
  ]);

  // Audit State
  const [watermark, setWatermark] = useState(true);
  const [approvalThreshold, setApprovalThreshold] = useState(1000);

  const togglePlugin = (id: string) => {
    setPlugins(prev => prev.map(p => p.id === id ? { ...p, status: !p.status } : p));
  };

  const deleteZone = (id: number) => {
    if(confirm('确认删除此禁区配置？')) {
      setZones(prev => prev.filter(z => z.id !== id));
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50 animate-in fade-in">
       <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-end">
             <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                   <ShieldAlert className="mr-3 text-blue-600" />
                   安全与合规 (Security & Compliance)
                </h1>
                <p className="text-slate-500 mt-1">地理信息安全控制塔：坐标加密、敏感区域围栏与数据导出审计。</p>
             </div>
             <div className="flex items-center space-x-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                <ShieldCheck size={14} className="mr-1.5" />
                合规性检测通过
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             
             {/* 1. Coordinate System & Encryption */}
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                   <Globe className="mr-2 text-indigo-500" size={20} />
                   坐标系与加密 (Coordinates)
                </h3>
                
                <div className="space-y-6 flex-1">
                   {/* Output Control */}
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-3">默认输出坐标系 (Default CRS)</label>
                      <div className="grid grid-cols-2 gap-3">
                          <label className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${crs === 'wgs84' ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-200' : 'border-slate-200 hover:bg-slate-50'}`}>
                             <input type="radio" name="crs" checked={crs === 'wgs84'} onChange={() => setCrs('wgs84')} className="mt-0.5 mr-3 text-indigo-600"/>
                             <div>
                                <div className="text-sm font-bold text-slate-800">WGS84</div>
                                <div className="text-xs text-slate-500 mt-0.5">GPS 原始坐标 (仅限内部流转)</div>
                             </div>
                          </label>
                          <label className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${crs === 'gcj02' ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-200' : 'border-slate-200 hover:bg-slate-50'}`}>
                             <input type="radio" name="crs" checked={crs === 'gcj02'} onChange={() => setCrs('gcj02')} className="mt-0.5 mr-3 text-indigo-600"/>
                             <div>
                                <div className="text-sm font-bold text-slate-800">GCJ-02</div>
                                <div className="text-xs text-slate-500 mt-0.5">国测局加密坐标 (对外发布默认)</div>
                             </div>
                          </label>
                      </div>
                   </div>

                   {/* Plugin Management */}
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-3 flex items-center">
                         <Component size={12} className="mr-1.5"/> 加密插件管理
                      </label>
                      <div className="space-y-3">
                         {plugins.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                               <div className="flex items-center">
                                  <Lock size={16} className={`mr-3 ${p.status ? 'text-green-600' : 'text-slate-400'}`} />
                                  <div>
                                     <div className="text-sm font-bold text-slate-700">{p.name}</div>
                                     <div className="text-xs text-slate-400 font-mono">{p.version}</div>
                                  </div>
                               </div>
                               <div 
                                  onClick={() => !p.mandatory && togglePlugin(p.id)}
                                  className={`relative w-10 h-5 rounded-full transition-colors ${p.status ? 'bg-green-500' : 'bg-slate-300'} ${p.mandatory ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                               >
                                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${p.status ? 'left-6' : 'left-1'}`}></div>
                               </div>
                            </div>
                         ))}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 flex items-center">
                         <AlertTriangle size={10} className="mr-1 text-amber-500"/>
                         启用插件后，所有 GeoJSON/Shapefile 导出将自动经过偏移算法处理。
                      </p>
                   </div>
                </div>
             </div>

             {/* 3. Watermark & Export Audit */}
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                   <Fingerprint className="mr-2 text-blue-500" size={20} />
                   水印与导出审计 (Audit)
                </h3>
                
                <div className="space-y-8 flex-1">
                   {/* Screen Watermark */}
                   <div>
                      <div className="flex justify-between items-center mb-3">
                         <div>
                            <div className="text-sm font-bold text-slate-700">屏幕防泄密水印</div>
                            <div className="text-xs text-slate-500">强制开启作业台明/暗水印 (显示操作员 ID)</div>
                         </div>
                         <div 
                            onClick={() => setWatermark(!watermark)}
                            className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${watermark ? 'bg-blue-600' : 'bg-slate-300'}`}
                         >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${watermark ? 'left-7' : 'left-1'}`}></div>
                         </div>
                      </div>
                      
                      {/* Watermark Preview */}
                      <div className="h-32 bg-slate-100 rounded-lg border border-slate-200 relative overflow-hidden flex items-center justify-center">
                         <div className="text-slate-400 text-xs">水印效果预览区域</div>
                         {watermark && (
                            <div className="absolute inset-0 pointer-events-none flex flex-wrap content-start p-4 opacity-10">
                               {Array.from({length: 12}).map((_, i) => (
                                  <div key={i} className="w-1/3 h-1/4 flex items-center justify-center transform -rotate-12 text-sm font-bold text-slate-900 select-none">
                                     User_89757
                                  </div>
                               ))}
                            </div>
                         )}
                      </div>
                   </div>

                   {/* Export Approval */}
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-3">数据导出审批策略</label>
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                         <div className="flex items-center space-x-3 mb-2">
                            <span className="text-sm text-slate-700">单次导出超过</span>
                            <div className="relative">
                               <input 
                                  type="number" 
                                  value={approvalThreshold}
                                  onChange={(e) => setApprovalThreshold(parseInt(e.target.value))}
                                  className="w-24 px-2 py-1 border border-slate-300 rounded text-sm font-bold text-center focus:border-blue-500 outline-none text-blue-600" 
                               />
                               <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">条</span>
                            </div>
                            <span className="text-sm text-slate-700">需主管审批</span>
                         </div>
                         <div className="h-1 w-full bg-slate-200 rounded-full mt-2">
                            <div className="h-1 bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (approvalThreshold / 5000) * 100)}%` }}></div>
                         </div>
                         <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                            <span>0 (Always)</span>
                            <span>5000 (Loose)</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* 2. Sensitive Geofencing */}
             <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                   <div>
                      <h3 className="text-lg font-bold text-slate-800 flex items-center">
                         <Ban className="mr-2 text-rose-500" size={20} />
                         敏感区域围栏 (Sensitive Geofencing)
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">红线管理：定义禁区并配置自动熔断或脱敏策略。</p>
                   </div>
                   <button className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold hover:bg-rose-700 shadow-sm transition-colors flex items-center">
                      <Plus size={16} className="mr-1.5" /> 绘制禁区
                   </button>
                </div>
                
                <div className="flex gap-6">
                   {/* Visual Map Preview Placeholder */}
                   <div className="w-1/3 bg-slate-100 rounded-xl border border-slate-200 relative overflow-hidden h-64 group">
                      {/* Map BG */}
                      <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/116.4074,39.9042,10,0/400x300?access_token=pk.xxx')] bg-cover opacity-60 grayscale group-hover:grayscale-0 transition-all"></div>
                      
                      {/* Red Zones */}
                      <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-rose-500/30 border-2 border-rose-500 rounded-full flex items-center justify-center animate-pulse">
                         <Ban size={16} className="text-rose-700 opacity-80" />
                      </div>
                      <div className="absolute bottom-1/3 right-1/3 w-12 h-12 bg-rose-500/30 border-2 border-rose-500 rounded flex items-center justify-center"></div>
                      
                      <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-mono border border-slate-200">
                         3 Active Zones
                      </div>
                   </div>

                   {/* Zone List Table */}
                   <div className="flex-1 overflow-hidden border border-slate-200 rounded-xl">
                      <table className="w-full text-left">
                         <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                            <tr>
                               <th className="px-4 py-3">区域名称</th>
                               <th className="px-4 py-3">中心坐标</th>
                               <th className="px-4 py-3">控制策略 (Policy)</th>
                               <th className="px-4 py-3">状态</th>
                               <th className="px-4 py-3 text-right">操作</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100 text-sm">
                            {zones.map((zone) => (
                               <tr key={zone.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-4 py-3">
                                     <div className="font-bold text-slate-700">{zone.name}</div>
                                     <div className="text-[10px] text-slate-500 bg-slate-100 px-1.5 rounded inline-block mt-0.5">{zone.type}</div>
                                  </td>
                                  <td className="px-4 py-3 font-mono text-slate-500 text-xs">{zone.center}</td>
                                  <td className="px-4 py-3">
                                     {zone.policy === 'block' && (
                                        <span className="flex items-center text-xs font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-100 w-fit">
                                           <Ban size={12} className="mr-1"/> 自动熔断 (Block)
                                        </span>
                                     )}
                                     {zone.policy === 'mask' && (
                                        <span className="flex items-center text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-100 w-fit">
                                           <EyeOff size={12} className="mr-1"/> 像素抹除 (Mosaic)
                                        </span>
                                     )}
                                     {zone.policy === 'alert' && (
                                        <span className="flex items-center text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100 w-fit">
                                           <AlertTriangle size={12} className="mr-1"/> 仅报警 (Alert)
                                        </span>
                                     )}
                                  </td>
                                  <td className="px-4 py-3">
                                     <div className="flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        <span className="text-xs font-medium text-slate-600">生效中</span>
                                     </div>
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                     <button 
                                        onClick={() => deleteZone(zone.id)}
                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                     >
                                        <Trash2 size={16} />
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
       </div>
    </div>
  );
};

function ShieldCheck(props: any) {
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
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}

export default SystemSecurity;
