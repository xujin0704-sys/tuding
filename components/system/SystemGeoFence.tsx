
import React, { useState, useRef } from 'react';
import { Ban, Plus, Trash2, EyeOff, AlertTriangle, Siren, Map as MapIcon, X, Crosshair, Check, MousePointer2 } from 'lucide-react';

interface Zone {
  id: number;
  name: string;
  type: string;
  center: string;
  radius: string;
  policy: 'block' | 'mask' | 'alert';
  active: boolean;
  x: number; // Percentage
  y: number; // Percentage
}

const INITIAL_ZONES: Zone[] = [
  { id: 1, name: '京西军事管理区', type: 'Military', center: '116.12, 39.95', radius: '5km', policy: 'block', active: true, x: 25, y: 25 },
  { id: 2, name: 'XX 市政府大院', type: 'Government', center: '116.38, 39.91', radius: '800m', policy: 'mask', active: true, x: 60, y: 65 },
  { id: 3, name: '关键能源设施 B', type: 'Infrastructure', center: '116.45, 39.88', radius: '1.2km', policy: 'alert', active: true, x: 75, y: 35 },
];

const SystemGeoFence: React.FC = () => {
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempPoint, setTempPoint] = useState<{x: number, y: number} | null>(null);
  
  const [newZone, setNewZone] = useState<Partial<Zone>>({
    name: '',
    type: 'Military',
    radius: '1km',
    policy: 'block',
    active: true
  });

  const mapRef = useRef<HTMLDivElement>(null);

  const deleteZone = (id: number) => {
    if(confirm('确认删除此禁区配置？')) setZones(prev => prev.filter(z => z.id !== id));
  };

  const startDrawing = () => {
    setIsDrawing(true);
  };

  const handleMapClick = (e: React.MouseEvent) => {
    if (!isDrawing || !mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setTempPoint({ x, y });
    setIsDrawing(false);
    setIsModalOpen(true);
    
    // Simulate reverse geocoding for coordinates
    const lat = (39.95 - (y / 100) * 0.1).toFixed(4);
    const lng = (116.10 + (x / 100) * 0.4).toFixed(4);
    setNewZone(prev => ({ ...prev, center: `${lng}, ${lat}` }));
  };

  const handleSaveZone = () => {
    if (!newZone.name || !tempPoint) return;
    
    const zone: Zone = {
      id: Date.now(),
      name: newZone.name,
      type: newZone.type || 'Custom',
      center: newZone.center || '0, 0',
      radius: newZone.radius || '1km',
      policy: newZone.policy as any,
      active: true,
      x: tempPoint.x,
      y: tempPoint.y
    };

    setZones([...zones, zone]);
    setIsModalOpen(false);
    setNewZone({ name: '', type: 'Military', radius: '1km', policy: 'block', active: true });
    setTempPoint(null);
  };

  const cancelDrawing = () => {
    setIsDrawing(false);
    setIsModalOpen(false);
    setTempPoint(null);
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50 animate-in fade-in relative">
       <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
             <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                   <Ban className="mr-3 text-rose-500" />
                   敏感区域围栏 (Geo-Fencing)
                </h1>
                <p className="text-slate-500 mt-1">红线管理：定义地理禁区并配置自动熔断或脱敏策略。</p>
             </div>
             {!isDrawing ? (
                <button 
                    onClick={startDrawing}
                    className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold hover:bg-rose-700 shadow-sm transition-colors flex items-center shadow-rose-200"
                >
                    <Plus size={16} className="mr-1.5" /> 绘制新禁区
                </button>
             ) : (
                <div className="flex items-center space-x-3 bg-rose-50 px-4 py-2 rounded-lg border border-rose-100 animate-in slide-in-from-right">
                    <span className="text-sm text-rose-700 font-medium flex items-center">
                        <Crosshair size={16} className="mr-2 animate-pulse"/>
                        请在下方地图点击选择中心点...
                    </span>
                    <button onClick={cancelDrawing} className="text-xs bg-white border border-rose-200 text-rose-600 px-2 py-1 rounded hover:bg-rose-100">
                        取消
                    </button>
                </div>
             )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* List */}
             <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-sm">围栏列表 ({zones.length})</h3>
                    <div className="text-xs text-slate-500">
                        <span className="text-green-600 font-bold">{zones.filter(z => z.active).length}</span> Active
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left">
                    <thead className="bg-white text-xs font-bold text-slate-500 uppercase border-b border-slate-100 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 bg-slate-50/50">区域名称</th>
                            <th className="px-6 py-3 bg-slate-50/50">中心坐标</th>
                            <th className="px-6 py-3 bg-slate-50/50">控制策略 (Policy)</th>
                            <th className="px-6 py-3 bg-slate-50/50">状态</th>
                            <th className="px-6 py-3 text-right bg-slate-50/50">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {zones.map((zone) => (
                            <tr key={zone.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                <div className="font-bold text-slate-700">{zone.name}</div>
                                <div className="text-[10px] text-slate-500 bg-slate-100 px-1.5 rounded inline-block mt-0.5 border border-slate-200">{zone.type}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center text-slate-600 font-mono text-xs">
                                        <MapIcon size={12} className="mr-1.5 text-slate-400"/>
                                        {zone.center}
                                    </div>
                                    <div className="text-[10px] text-slate-400 pl-4 mt-0.5">R: {zone.radius}</div>
                                </td>
                                <td className="px-6 py-4">
                                {zone.policy === 'block' && (
                                    <div className="flex items-center text-xs font-bold text-rose-700 bg-rose-50 px-2 py-1.5 rounded border border-rose-100 w-fit">
                                        <Siren size={14} className="mr-1.5"/> 
                                        <div>自动熔断<span className="block text-[9px] font-normal opacity-80">禁止查看/编辑</span></div>
                                    </div>
                                )}
                                {zone.policy === 'mask' && (
                                    <div className="flex items-center text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1.5 rounded border border-purple-100 w-fit">
                                        <EyeOff size={14} className="mr-1.5"/> 
                                        <div>像素抹除<span className="block text-[9px] font-normal opacity-80">输出自动打码</span></div>
                                    </div>
                                )}
                                {zone.policy === 'alert' && (
                                    <div className="flex items-center text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1.5 rounded border border-amber-100 w-fit">
                                        <AlertTriangle size={14} className="mr-1.5"/> 
                                        <div>仅报警<span className="block text-[9px] font-normal opacity-80">审计日志记录</span></div>
                                    </div>
                                )}
                                </td>
                                <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className={`w-9 h-5 rounded-full relative transition-colors ${zone.active ? 'bg-green-500' : 'bg-slate-300'}`}>
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${zone.active ? 'left-5' : 'left-1'}`}></div>
                                    </div>
                                </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={() => deleteZone(zone.id)}
                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors opacity-0 group-hover:opacity-100"
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

             {/* Map Preview */}
             <div 
                ref={mapRef}
                onClick={handleMapClick}
                className={`bg-slate-100 rounded-xl border border-slate-200 relative overflow-hidden h-full min-h-[350px] shadow-inner group transition-all ${isDrawing ? 'cursor-crosshair ring-2 ring-rose-400 ring-offset-2' : ''}`}
             >
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/116.4074,39.9042,10,0/400x600?access_token=pk.xxx')] bg-cover opacity-70 grayscale group-hover:grayscale-0 transition-all duration-500"></div>
                
                {/* Dynamic Zones Rendering */}
                {zones.map(zone => (
                    <div 
                        key={zone.id}
                        className={`absolute flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 cursor-pointer z-10`}
                        style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                        title={zone.name}
                    >
                        <div className={`
                            ${zone.policy === 'block' ? 'w-24 h-24 bg-rose-500/20 border-rose-500' : 
                              zone.policy === 'mask' ? 'w-16 h-16 bg-purple-500/20 border-purple-500' : 'w-20 h-20 bg-amber-500/20 border-amber-500'}
                            border-2 rounded-full flex items-center justify-center animate-pulse
                        `}>
                            {zone.policy === 'block' && <Ban size={24} className="text-rose-600 drop-shadow-md" />}
                            {zone.policy === 'mask' && <EyeOff size={16} className="text-purple-600 drop-shadow-md" />}
                            {zone.policy === 'alert' && <AlertTriangle size={18} className="text-amber-600 drop-shadow-md" />}
                        </div>
                        <div className={`absolute -bottom-6 text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-sm whitespace-nowrap
                            ${zone.policy === 'block' ? 'bg-rose-600' : zone.policy === 'mask' ? 'bg-purple-600' : 'bg-amber-600'}
                        `}>
                            {zone.name}
                        </div>
                    </div>
                ))}

                {/* Drawing Cursor Hint */}
                {isDrawing && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-rose-600/90 text-white text-xs px-3 py-1.5 rounded-full shadow-lg pointer-events-none animate-bounce">
                        <MousePointer2 size={12} className="inline mr-1" />
                        点击地图以确定中心点
                    </div>
                )}
                
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur px-4 py-3 rounded-xl border border-slate-200 text-xs shadow-lg pointer-events-none">
                    <div className="flex justify-between items-center mb-2">
                        <div className="font-bold text-slate-800">红线地图预览</div>
                        <div className="text-[10px] text-slate-400">Updates Live</div>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex items-center"><div className="w-2 h-2 bg-rose-500 rounded-full mr-1.5"></div> Block (熔断)</div>
                        <div className="flex items-center"><div className="w-2 h-2 bg-purple-500 rounded-full mr-1.5"></div> Mask (脱敏)</div>
                        <div className="flex items-center"><div className="w-2 h-2 bg-amber-500 rounded-full mr-1.5"></div> Alert (报警)</div>
                    </div>
                </div>
             </div>
          </div>
       </div>

       {/* Add Zone Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-[500px] overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">配置新禁区</h3>
                    <button onClick={cancelDrawing}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">区域名称</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none" 
                            placeholder="例如: 某军事管理区"
                            value={newZone.name}
                            onChange={e => setNewZone({...newZone, name: e.target.value})}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">类型</label>
                            <select 
                                className="w-full px-3 py-2 border border-slate-200 rounded text-sm bg-white focus:border-rose-500 outline-none"
                                value={newZone.type}
                                onChange={e => setNewZone({...newZone, type: e.target.value})}
                            >
                                <option value="Military">军事禁区</option>
                                <option value="Government">政府机关</option>
                                <option value="Infrastructure">关键设施</option>
                                <option value="Custom">自定义区域</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">半径范围</label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-rose-500 outline-none" 
                                placeholder="e.g. 5km"
                                value={newZone.radius}
                                onChange={e => setNewZone({...newZone, radius: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">中心坐标 (自动获取)</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm text-slate-600 font-mono" 
                            value={newZone.center}
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">控制策略</label>
                        <div className="grid grid-cols-3 gap-3">
                            <label className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all ${newZone.policy === 'block' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'border-slate-200 hover:bg-slate-50'}`}>
                                <input type="radio" name="policy" className="hidden" checked={newZone.policy === 'block'} onChange={() => setNewZone({...newZone, policy: 'block'})} />
                                <Ban size={20} className="mb-1" />
                                <span className="text-xs font-bold">自动熔断</span>
                            </label>
                            <label className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all ${newZone.policy === 'mask' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-slate-200 hover:bg-slate-50'}`}>
                                <input type="radio" name="policy" className="hidden" checked={newZone.policy === 'mask'} onChange={() => setNewZone({...newZone, policy: 'mask'})} />
                                <EyeOff size={20} className="mb-1" />
                                <span className="text-xs font-bold">像素抹除</span>
                            </label>
                            <label className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all ${newZone.policy === 'alert' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'border-slate-200 hover:bg-slate-50'}`}>
                                <input type="radio" name="policy" className="hidden" checked={newZone.policy === 'alert'} onChange={() => setNewZone({...newZone, policy: 'alert'})} />
                                <AlertTriangle size={20} className="mb-1" />
                                <span className="text-xs font-bold">仅报警</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
                    <button onClick={cancelDrawing} className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-100">取消</button>
                    <button onClick={handleSaveZone} className="px-4 py-2 bg-rose-600 text-white rounded text-sm hover:bg-rose-700 shadow-sm">保存禁区</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
export default SystemGeoFence;
