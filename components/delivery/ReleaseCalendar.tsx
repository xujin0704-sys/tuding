
import React, { useState, useMemo } from 'react';
import { Calendar, AlertCircle, Lock, Zap, MapPin, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2, Clock, GitCommit, ArrowRight, MousePointer2 } from 'lucide-react';

// Mock Data Types
interface Snapshot {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  status: 'stable' | 'beta' | 'building' | 'failed';
  type: 'road' | 'poi' | 'admin';
}

interface Release {
  id: string;
  name: string;
  startDate: string;
  endDate: string; // Launch Date
  freezeDate: string;
  status: 'planning' | 'assembling' | 'frozen' | 'released';
  dependencies: {
    road?: string; // ID of the snapshot
    poi?: string;
    admin?: string;
  };
}

const ReleaseCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10, 1)); // Nov 2025
  const [hoveredSnapshot, setHoveredSnapshot] = useState<string | null>(null);
  const [simulatedDragOffset, setSimulatedDragOffset] = useState(0); // For moving the release date
  
  // -- Configuration --
  // 30 days view roughly
  const startDate = new Date("2025-11-20");
  const dayCount = 40;
  
  const dates = useMemo(() => {
    return Array.from({ length: dayCount }).map((_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

  // -- Mock Data --
  const releaseBaseDate = new Date("2025-12-25");
  const releaseDate = new Date(releaseBaseDate);
  releaseDate.setDate(releaseDate.getDate() + simulatedDragOffset);
  
  const freezeBaseDate = new Date("2025-12-20");
  const freezeDate = new Date(freezeBaseDate);
  freezeDate.setDate(freezeDate.getDate() + simulatedDragOffset);

  const productRelease: Release = {
    id: 'rel-2025-q1',
    name: 'Map 2025 Q1 Release',
    startDate: new Date("2025-12-10").toISOString().split('T')[0],
    endDate: releaseDate.toISOString().split('T')[0],
    freezeDate: freezeDate.toISOString().split('T')[0],
    status: 'assembling',
    dependencies: {
      road: 'snap-road-1215',
      poi: 'snap-poi-1224'
    }
  };

  const snapshots: Snapshot[] = [
    // Road (Weekly)
    { id: 'snap-road-1124', name: 'Road v11.24', date: '2025-11-24', status: 'stable', type: 'road' },
    { id: 'snap-road-1201', name: 'Road v12.01', date: '2025-12-01', status: 'stable', type: 'road' },
    { id: 'snap-road-1208', name: 'Road v12.08', date: '2025-12-08', status: 'stable', type: 'road' },
    { id: 'snap-road-1215', name: 'Road v12.15', date: '2025-12-15', status: 'stable', type: 'road' }, // Targeted
    { id: 'snap-road-1222', name: 'Road v12.22', date: '2025-12-22', status: 'building', type: 'road' }, // Too late?

    // POI (Daily - Sample)
    { id: 'snap-poi-1210', name: 'POI 12.10', date: '2025-12-10', status: 'stable', type: 'poi' },
    { id: 'snap-poi-1215', name: 'POI 12.15', date: '2025-12-15', status: 'stable', type: 'poi' },
    { id: 'snap-poi-1220', name: 'POI 12.20', date: '2025-12-20', status: 'beta', type: 'poi' },
    { id: 'snap-poi-1224', name: 'POI 12.24', date: '2025-12-24', status: 'stable', type: 'poi' }, // Targeted
    { id: 'snap-poi-1226', name: 'POI 12.26', date: '2025-12-26', status: 'building', type: 'poi' },
  ];

  // -- Helpers --
  const getLeftPercent = (dateStr: string) => {
    const d = new Date(dateStr);
    const diffTime = d.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return (diffDays / dayCount) * 100;
  };

  const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

  // Validation Logic
  const checkConflict = () => {
    // Check if Road dependency is AFTER freeze date
    const roadSnap = snapshots.find(s => s.id === productRelease.dependencies.road);
    const roadDate = roadSnap ? new Date(roadSnap.date) : null;
    const isRoadLate = roadDate && roadDate > freezeDate;

    // Check if POI dependency is ready
    const poiSnap = snapshots.find(s => s.id === productRelease.dependencies.poi);
    const isPoiUnstable = poiSnap && poiSnap.status !== 'stable';

    return { isRoadLate, isPoiUnstable };
  };

  const { isRoadLate, isPoiUnstable } = checkConflict();
  const hasConflict = isRoadLate || isPoiUnstable;

  return (
    <div className="p-6 h-full overflow-hidden flex flex-col bg-slate-50 animate-in fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Calendar className="mr-3 text-blue-600" />
            发布日历 (Release Calendar)
          </h1>
          <p className="text-slate-500 mt-1">
            可视化管理大版本排期与组件依赖关系。
            <span className="text-xs ml-2 bg-slate-100 px-2 py-0.5 rounded text-slate-600">当前视图: 2025 Q4 - 2026 Q1</span>
          </p>
        </div>
        
        <div className="flex items-center space-x-6">
           {/* Controls for Simulation */}
           <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
              <button 
                onClick={() => setSimulatedDragOffset(prev => prev - 1)}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-500"
                title="提前一天"
              >
                 <ChevronLeft size={16}/>
              </button>
              <span className="text-xs font-mono font-bold text-slate-700 w-24 text-center">
                 Launch: {productRelease.endDate}
              </span>
              <button 
                onClick={() => setSimulatedDragOffset(prev => prev + 1)}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-500"
                title="推迟一天"
              >
                 <ChevronRight size={16}/>
              </button>
           </div>

           {/* Freeze Countdown */}
           <div className={`flex items-center space-x-4 px-4 py-2 rounded-lg shadow-sm border transition-colors ${hasConflict ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'}`}>
             <div className="text-right">
                <div className={`text-xs font-bold uppercase tracking-wider ${hasConflict ? 'text-rose-600' : 'text-slate-500'}`}>
                    {hasConflict ? '排期冲突警告' : '封板倒计时 (Freeze)'}
                </div>
                {hasConflict ? (
                    <div className="text-xs text-rose-500 font-medium">Road 组件晚于封板日</div>
                ) : (
                    <div className="text-sm font-mono font-bold text-slate-800">
                        {Math.max(0, Math.ceil((freezeDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} Days Left
                    </div>
                )}
             </div>
             {hasConflict ? <AlertTriangle size={24} className="text-rose-500 animate-pulse" /> : <Lock size={20} className="text-amber-500" />}
          </div>
        </div>
      </div>

      {/* Main Calendar View */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
         
         {/* 1. Timeline Header */}
         <div className="h-10 bg-slate-50 border-b border-slate-200 flex shrink-0">
            <div className="w-48 shrink-0 border-r border-slate-200 p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
               Tracks / Timeline
            </div>
            <div className="flex-1 relative overflow-hidden">
               {dates.map((d, i) => (
                  <div 
                    key={i} 
                    className={`absolute top-0 bottom-0 border-r border-slate-100 text-[10px] flex items-center justify-center ${isWeekend(d) ? 'bg-slate-50/50 text-slate-300' : 'text-slate-400'}`}
                    style={{ left: `${(i / dayCount) * 100}%`, width: `${100 / dayCount}%` }}
                  >
                     {d.getDate()}
                  </div>
               ))}
               {/* Month Labels (Simplified) */}
               <div className="absolute top-0 left-2 text-xs font-bold text-slate-300 pointer-events-none">NOV</div>
               <div className="absolute top-0 left-[35%] text-xs font-bold text-slate-300 pointer-events-none">DEC</div>
               <div className="absolute top-0 left-[90%] text-xs font-bold text-slate-300 pointer-events-none">JAN</div>
            </div>
         </div>

         {/* 2. Lanes Container */}
         <div className="flex-1 overflow-y-auto relative bg-white">
            
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex pointer-events-none ml-48">
               {dates.map((d, i) => (
                  <div 
                    key={i} 
                    className={`h-full border-r ${isWeekend(d) ? 'bg-slate-50/30 border-slate-100' : 'border-slate-50'}`}
                    style={{ width: `${100 / dayCount}%` }}
                  ></div>
               ))}
            </div>

            {/* Vertical Marker: Freeze Date */}
            <div 
                className="absolute top-0 bottom-0 w-px bg-amber-400 z-20 ml-48 border-l-2 border-dashed border-amber-400/50"
                style={{ left: `${getLeftPercent(productRelease.freezeDate)}%` }}
            >
                <div className="absolute top-2 -left-1.5 bg-amber-100 text-amber-700 text-[9px] font-bold px-1 rounded border border-amber-300 transform -rotate-90 origin-bottom-left">
                    FREEZE
                </div>
            </div>

            {/* Vertical Marker: Launch Date */}
            <div 
                className="absolute top-0 bottom-0 w-px bg-green-500 z-20 ml-48"
                style={{ left: `${getLeftPercent(productRelease.endDate)}%` }}
            >
                <div className="absolute top-2 -left-1.5 bg-green-100 text-green-700 text-[9px] font-bold px-1 rounded border border-green-300 transform -rotate-90 origin-bottom-left">
                    LAUNCH
                </div>
            </div>

            {/* --- Lane 1: Product (Big Version) --- */}
            <div className="flex h-24 border-b border-slate-100 relative group">
                <div className="w-48 shrink-0 border-r border-slate-200 p-4 bg-slate-50/10 flex flex-col justify-center z-10 bg-white">
                    <div className="flex items-center font-bold text-slate-800 text-sm">
                        <MapPin size={16} className="mr-2 text-blue-600"/> Map 2025 Q1
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center">
                        <Clock size={12} className="mr-1"/> 
                        {hasConflict ? <span className="text-rose-500 font-bold">Delay Risk</span> : 'On Track'}
                    </div>
                </div>
                <div className="flex-1 relative">
                    <div 
                        className={`absolute top-1/2 -translate-y-1/2 h-10 rounded-lg border shadow-sm flex items-center px-4 transition-all duration-300
                            ${productRelease.status === 'assembling' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}
                            ${hasConflict ? 'ring-2 ring-rose-400 ring-offset-1' : ''}
                        `}
                        style={{ 
                            left: `${getLeftPercent(productRelease.startDate)}%`, 
                            width: `${getLeftPercent(productRelease.endDate) - getLeftPercent(productRelease.startDate)}%` 
                        }}
                    >
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-bold text-blue-900 truncate">{productRelease.name}</span>
                            <span className="text-[10px] text-blue-600/80 uppercase font-bold tracking-wider">{productRelease.status}</span>
                        </div>
                        
                        {/* Dependency Anchors (Invisible targets for lines) */}
                        <div id="anchor-prod-road" className="absolute bottom-0 left-[20%] w-2 h-2 bg-blue-500 rounded-full translate-y-1/2 opacity-0"></div>
                        <div id="anchor-prod-poi" className="absolute bottom-0 left-[60%] w-2 h-2 bg-blue-500 rounded-full translate-y-1/2 opacity-0"></div>
                    </div>
                </div>
            </div>

            {/* --- Lane 2: Road Network --- */}
            <div className="flex h-20 border-b border-slate-100 relative">
                <div className="w-48 shrink-0 border-r border-slate-200 p-4 flex flex-col justify-center z-10 bg-white">
                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wide">Road Network</div>
                    <div className="text-[10px] text-slate-400 mt-1">Weekly Snapshots</div>
                </div>
                <div className="flex-1 relative flex items-center">
                    {snapshots.filter(s => s.type === 'road').map(snap => {
                        const isDependency = productRelease.dependencies.road === snap.id;
                        const isLate = isDependency && isRoadLate;
                        
                        return (
                            <div 
                                key={snap.id}
                                onMouseEnter={() => setHoveredSnapshot(snap.id)}
                                onMouseLeave={() => setHoveredSnapshot(null)}
                                className={`absolute h-6 px-2 rounded-full border flex items-center text-[10px] font-mono cursor-pointer transition-all hover:scale-110 hover:z-20
                                    ${isDependency ? (isLate ? 'bg-rose-100 border-rose-300 text-rose-700 ring-2 ring-rose-200' : 'bg-indigo-100 border-indigo-300 text-indigo-700 ring-1 ring-indigo-200') : 'bg-slate-100 border-slate-200 text-slate-500 opacity-60'}
                                `}
                                style={{ left: `${getLeftPercent(snap.date)}%` }}
                            >
                                <GitCommit size={10} className="mr-1"/> {snap.name}
                                {isDependency && <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                                    Locked for Q1 Release
                                </div>}
                            </div>
                        );
                    })}
                    
                    {/* Visual Connector Line (Simplified via CSS pseudo or absolute div for demo) */}
                    {/* In a real app, use SVG overlay calculating coordinates. Here we simulate the specific connection for Road */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{top: -40}}>
                        <path 
                            d={`M ${getLeftPercent('2025-12-15')}% 60 C ${getLeftPercent('2025-12-15')}% 20, ${getLeftPercent(productRelease.startDate) + 5}% 80, ${getLeftPercent(productRelease.startDate) + 10}% 40`} 
                            fill="none" 
                            stroke={isRoadLate ? "#f43f5e" : "#6366f1"} 
                            strokeWidth="2" 
                            strokeDasharray="4,4"
                            className="drop-shadow-sm"
                        />
                        <circle cx={`${getLeftPercent('2025-12-15')}%`} cy="60" r="3" fill={isRoadLate ? "#f43f5e" : "#6366f1"} />
                        {isRoadLate && (
                            <foreignObject x={`${getLeftPercent('2025-12-15')}%`} y="25" width="120" height="30">
                                <div className="bg-rose-600 text-white text-[9px] px-1 rounded w-fit flex items-center shadow-sm">
                                    <AlertTriangle size={8} className="mr-1"/> Late!
                                </div>
                            </foreignObject>
                        )}
                    </svg>
                </div>
            </div>

            {/* --- Lane 3: POI Service --- */}
            <div className="flex h-20 border-b border-slate-100 relative">
                <div className="w-48 shrink-0 border-r border-slate-200 p-4 flex flex-col justify-center z-10 bg-white">
                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wide">POI Service</div>
                    <div className="text-[10px] text-slate-400 mt-1">Daily Builds</div>
                </div>
                <div className="flex-1 relative flex items-center">
                    {snapshots.filter(s => s.type === 'poi').map(snap => {
                        const isDependency = productRelease.dependencies.poi === snap.id;
                        return (
                            <div 
                                key={snap.id}
                                className={`absolute w-3 h-3 rounded-full border cursor-pointer hover:scale-150 transition-all
                                    ${isDependency ? 'bg-teal-500 border-teal-600 z-10' : 
                                      snap.status === 'stable' ? 'bg-slate-300 border-slate-400' : 'bg-amber-200 border-amber-400'}
                                `}
                                style={{ left: `${getLeftPercent(snap.date)}%` }}
                                title={snap.name}
                            >
                            </div>
                        );
                    })}
                     <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{top: -120}}>
                        <path 
                            d={`M ${getLeftPercent('2025-12-24')}% 140 C ${getLeftPercent('2025-12-24')}% 100, ${getLeftPercent(productRelease.endDate) - 5}% 140, ${getLeftPercent(productRelease.endDate) - 5}% 120`} 
                            fill="none" 
                            stroke="#14b8a6" 
                            strokeWidth="2" 
                            strokeDasharray="4,4"
                        />
                        <circle cx={`${getLeftPercent('2025-12-24')}%`} cy="140" r="3" fill="#14b8a6" />
                    </svg>
                </div>
            </div>

         </div>

         {/* 3. Footer Legend */}
         <div className="h-10 bg-slate-50 border-t border-slate-200 flex items-center px-4 space-x-6 shrink-0 text-[10px] text-slate-500">
             <div className="flex items-center font-bold text-slate-700">Legend:</div>
             <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div> Product Version</div>
             <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></div> Component Snapshot</div>
             <div className="flex items-center"><div className="w-4 h-0.5 border-t-2 border-dashed border-indigo-500 mr-2"></div> Dependency Lock</div>
             <div className="flex items-center"><div className="w-0.5 h-3 bg-amber-400 mr-2"></div> Freeze Date</div>
             <div className="flex items-center"><div className="w-0.5 h-3 bg-green-500 mr-2"></div> Launch Date</div>
         </div>

      </div>
    </div>
  );
};

export default ReleaseCalendar;
