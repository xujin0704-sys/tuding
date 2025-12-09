
import React, { useState } from 'react';
import { 
  Maximize2, 
  SplitSquareHorizontal 
} from 'lucide-react';

const EvalSimulation: React.FC = () => {
  const [simDiffMode, setSimDiffMode] = useState<'swipe' | 'side'>('swipe');
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in">
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shrink-0">
            <div className="flex space-x-4">
                {['路由仿真 (Routing)', '检索仿真 (Search)', '视觉仿真 (Visual)'].map((tab, idx) => (
                    <button key={idx} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${idx === 2 ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                        {tab}
                    </button>
                ))}
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500">对比模式:</span>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setSimDiffMode('swipe')} 
                        className={`p-1.5 rounded ${simDiffMode === 'swipe' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`} 
                        title="卷帘对比"
                    >
                        <SplitSquareHorizontal size={16} />
                    </button>
                    <button 
                        onClick={() => setSimDiffMode('side')} 
                        className={`p-1.5 rounded ${simDiffMode === 'side' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`} 
                        title="并排对比"
                    >
                        <Maximize2 size={16} />
                    </button>
                </div>
            </div>
        </div>

        <div className="flex-1 relative overflow-hidden bg-slate-200">
            {/* Simulation Viewport */}
            {simDiffMode === 'side' ? (
                <div className="grid grid-cols-2 h-full gap-1 p-1">
                    <div className="bg-white relative flex items-center justify-center overflow-hidden">
                        <span className="absolute top-4 left-4 bg-slate-900/50 text-white px-2 py-1 rounded text-xs backdrop-blur font-mono">Baseline (v1.9)</span>
                        {/* Mock Image Content */}
                        <div className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/116.4074,39.9042,12,0/800x600?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGUifQ')] bg-cover opacity-50 grayscale"></div>
                    </div>
                    <div className="bg-white relative flex items-center justify-center overflow-hidden">
                        <span className="absolute top-4 left-4 bg-blue-600/80 text-white px-2 py-1 rounded text-xs backdrop-blur font-mono">Candidate (v2.0)</span>
                        <div className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/116.4074,39.9042,12,0/800x600?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGUifQ')] bg-cover"></div>
                        {/* Mock Diff Highlight */}
                        <div className="absolute top-1/3 left-1/3 w-24 h-24 border-2 border-red-500 rounded-full animate-ping opacity-50"></div>
                    </div>
                </div>
            ) : (
                <div className="relative w-full h-full overflow-hidden select-none">
                    {/* Background: Candidate */}
                    <div className="absolute inset-0 bg-white">
                        <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-400">
                             Candidate Image (v2.0) - Colored
                        </div>
                    </div>
                    {/* Foreground: Baseline (Clipped) */}
                    <div 
                        className="absolute inset-0 bg-slate-400 border-r-2 border-white overflow-hidden shadow-2xl"
                        style={{ width: `${sliderPosition}%` }}
                    >
                        <div className="absolute top-0 left-0 h-full w-screen flex items-center justify-center text-slate-600 grayscale bg-slate-200">
                             Baseline Image (v1.9) - Grayscale
                        </div>
                    </div>
                    {/* Slider Handle */}
                    <div 
                        className="absolute top-0 bottom-0 w-8 -ml-4 cursor-ew-resize flex items-center justify-center group z-20"
                        style={{ left: `${sliderPosition}%` }}
                        onMouseDown={(e) => {
                            const handleMouseMove = (ev: MouseEvent) => {
                                const newPos = (ev.clientX / window.innerWidth) * 100;
                                setSliderPosition(Math.max(0, Math.min(100, newPos)));
                            };
                            const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove);
                                document.removeEventListener('mouseup', handleMouseUp);
                            };
                            document.addEventListener('mousemove', handleMouseMove);
                            document.addEventListener('mouseup', handleMouseUp);
                        }}
                    >
                        <div className="w-1 h-full bg-white shadow-lg group-hover:bg-blue-400 transition-colors"></div>
                        <div className="w-8 h-8 bg-white rounded-full shadow-xl absolute flex items-center justify-center text-slate-400 group-hover:text-blue-600 cursor-grab active:cursor-grabbing">
                            <SplitSquareHorizontal size={16} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default EvalSimulation;
