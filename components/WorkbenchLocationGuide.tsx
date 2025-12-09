import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Check, 
  Image as ImageIcon, 
  Eye, 
  Video, 
  Camera, 
  MapPin, 
  Square, 
  Waypoints, 
  ArrowRight, 
  Type, 
  Eraser, 
  Trash2,
  Info,
  Map as MapIcon,
  Navigation,
  ChevronDown,
  ChevronUp,
  LayoutTemplate,
  Layers
} from 'lucide-react';

const WorkbenchLocationGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Record<string, boolean>>({
    'basic': true,
    'overview': true,
    'guide': true
  });

  const toggleSection = (key: string) => {
    setActiveSection(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const MATERIALS = [
    { id: 1, title: '【小哥入镜】小区门口头照片', time: '11:49:42', type: 'JPG' },
    { id: 2, title: '【门卫室】拍摄门卫室及门卫照片', time: '11:48:55', type: 'JPG' },
    { id: 3, title: '从门口到目标地址楼栋', time: '11:50:00', type: 'MP4' },
    { id: 4, title: '目标地址楼栋号照片', time: '11:53:12', type: 'JPG' },
    { id: 5, title: '楼栋门禁拍照', time: '11:53:45', type: 'JPG' },
    { id: 6, title: '楼层指引图', time: '11:56:24', type: 'JPG' },
    { id: 7, title: '所在房产门牌号（需开门或半开门）', time: '11:57:06', type: 'JPG' },
    { id: 8, title: '补充场景照片 A', time: '11:58:10', type: 'JPG' },
    { id: 9, title: '补充场景照片 B', time: '11:59:05', type: 'JPG' },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Header */}
      <div className="h-14 bg-white border-b border-gray-200 flex justify-between items-center px-4 shrink-0 shadow-sm z-20">
        <div className="flex items-center">
          <button className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center">
              <h1 className="font-bold text-gray-800 mr-2 text-base">德意名居二期 - 初次采集标注</h1>
              <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded font-medium border border-blue-100">进行中</span>
            </div>
            <div className="text-xs text-gray-400 mt-0.5 font-mono">ID: ESS175326498034930581137</div>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center font-medium shadow-sm shadow-blue-100">
            <Save size={16} className="mr-1.5" /> 保存
          </button>
          <button className="px-4 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded text-sm hover:bg-green-100 flex items-center font-medium">
            <Check size={16} className="mr-1.5" /> 提交
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Collection Materials */}
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.01)]">
          <div className="p-3 border-b border-gray-100 font-bold text-sm text-gray-700 flex items-center bg-gray-50/50">
            <ImageIcon size={16} className="mr-2 text-blue-600" /> 采集素材 (9)
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-white">
            {MATERIALS.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold w-5 h-5 flex items-center justify-center rounded">
                    {item.id}
                  </span>
                  <Eye size={14} className="text-gray-300 group-hover:text-blue-500" />
                </div>
                <h4 className="text-xs font-medium text-gray-800 leading-snug mb-2">{item.title}</h4>
                <div className="flex items-center text-[10px] text-gray-400">
                  {item.type === 'MP4' ? <Video size={10} className="mr-1" /> : <ImageIcon size={10} className="mr-1" />}
                  <span className="mr-2">{item.time}</span>
                  <span>• {item.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Canvas: Map & Tools */}
        <div className="flex-1 relative bg-[#FDFCF8] overflow-hidden group">
          {/* Map Grid Background */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>

          {/* Fake Map Content */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 opacity-10 pointer-events-none">
             {/* Abstract Roadmap */}
             <svg width="100%" height="100%" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 500 L 300 450 L 400 300 L 600 250 L 700 100" stroke="#E2E8F0" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M100 500 L 300 450 L 400 300 L 600 250 L 700 100" stroke="white" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </div>

          {/* Camera Markers */}
          {[
            { x: '30%', y: '60%' }, 
            { x: '45%', y: '50%' }, 
            { x: '48%', y: '55%' },
            { x: '60%', y: '40%' },
            { x: '65%', y: '35%' },
            { x: '68%', y: '30%' }
          ].map((pos, i) => (
             <div key={i} className="absolute p-1.5 bg-blue-600 rounded-full text-white shadow-lg cursor-pointer hover:scale-110 transition-transform" style={{ left: pos.x, top: pos.y }}>
                <Camera size={14} />
             </div>
          ))}

          {/* Toolbar */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-1.5 flex items-center space-x-1">
             {[
               { icon: MapPin, label: '标点' },
               { icon: Square, label: '画圆' }, // Approximating Draw Area
               { icon: Waypoints, label: '路径' },
               { icon: ArrowRight, label: '箭头' },
               { icon: Type, label: '文本' },
               { separator: true },
               { icon: Eraser, label: '擦除' },
               { icon: Trash2, label: '清空' },
             ].map((tool, idx) => (
               tool.separator ? (
                 <div key={idx} className="w-px h-6 bg-gray-200 mx-1"></div>
               ) : (
                 <button key={idx} className="flex flex-col items-center justify-center w-12 h-12 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-blue-600 transition-colors group">
                    {/* @ts-ignore */}
                    <tool.icon size={20} className="mb-1" />
                    <span className="text-[10px] font-medium">{tool.label}</span>
                 </button>
               )
             ))}
          </div>

          <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 text-[10px] text-gray-400 pointer-events-none border-l border-t border-gray-200 rounded-tl">
             20 m
          </div>
          <div className="absolute bottom-2 right-2 w-10 h-px bg-gray-400 mb-4 mr-2"></div>
          <div className="absolute bottom-2 right-2 h-2 w-px bg-gray-400 mb-4 mr-12"></div>
          <div className="absolute bottom-2 right-2 h-2 w-px bg-gray-400 mb-4 mr-2"></div>
        </div>

        {/* Right Sidebar: Rules & Production */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.01)]">
          <div className="p-3 border-b border-gray-100 font-bold text-sm text-gray-700 flex items-center justify-between bg-gray-50/50">
            <span>作业规范与生产</span>
            <Layers size={16} className="text-gray-400" />
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Basic Info Accordion */}
            <div className="border border-gray-100 rounded-lg overflow-hidden shadow-sm">
               <button 
                onClick={() => toggleSection('basic')}
                className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors"
               >
                  <div className="flex items-center text-sm font-bold text-gray-700">
                     <Info size={16} className="mr-2 text-blue-500" />
                     小区基本信息
                  </div>
                  {activeSection['basic'] ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
               </button>
               {activeSection['basic'] && (
                 <div className="p-3 pt-0 bg-white space-y-3">
                    <div>
                       <div className="text-xs text-gray-400 mb-1">小区名称</div>
                       <div className="text-sm font-medium text-gray-800">德意名居二期</div>
                    </div>
                    <div>
                       <div className="text-xs text-gray-400 mb-1">详细地址</div>
                       <div className="text-sm font-medium text-gray-800 leading-snug">广东省深圳市南山区桃源街道西丽湖路4221-72</div>
                    </div>
                    <div className="bg-blue-50 rounded p-2 border border-blue-100">
                       <div className="text-xs text-blue-400 mb-1">目标地址</div>
                       <div className="text-sm font-bold text-blue-700">B座 15B</div>
                    </div>
                 </div>
               )}
            </div>

            {/* Overview Map Production */}
            <div className="border border-gray-100 rounded-lg overflow-hidden shadow-sm">
               <button 
                onClick={() => toggleSection('overview')}
                className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors"
               >
                  <div className="flex items-center text-sm font-bold text-gray-700">
                     <LayoutTemplate size={16} className="mr-2 text-blue-500" />
                     俯瞰图制作
                  </div>
                  {activeSection['overview'] ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
               </button>
               {activeSection['overview'] && (
                 <div className="p-3 pt-0 bg-white space-y-3">
                    <p className="text-xs text-gray-500 leading-relaxed">
                       在这染底图上截取小区的全局平面俯瞰图，清晰显示小区整体布局，并标注从大门到目标楼栋的路径。
                    </p>
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-100">
                       <span className="text-xs font-medium text-gray-600">状态</span>
                       <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">未制作</span>
                    </div>
                    <button className="w-full py-2 bg-white border border-blue-200 text-blue-600 rounded text-xs font-bold hover:bg-blue-50 transition-colors flex items-center justify-center">
                       <Square size={14} className="mr-2" /> 绘制俯瞰区域
                    </button>
                 </div>
               )}
            </div>

            {/* Guide Map Production */}
            <div className="border border-gray-100 rounded-lg overflow-hidden shadow-sm">
               <button 
                onClick={() => toggleSection('guide')}
                className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors"
               >
                  <div className="flex items-center text-sm font-bold text-gray-700">
                     <Navigation size={16} className="mr-2 text-blue-500" />
                     引导图制作
                  </div>
                  {activeSection['guide'] ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
               </button>
               {activeSection['guide'] && (
                 <div className="p-3 pt-0 bg-white space-y-4">
                    <p className="text-xs text-gray-500 leading-relaxed">
                       选取关键路径照片（大门口、转角、游乐场等），并标注路径指引和简短描述。
                    </p>
                    <div className="space-y-4 relative">
                       {/* Vertical Line */}
                       <div className="absolute top-2 bottom-2 left-[7px] w-px bg-gray-200"></div>

                       {/* Step 1 */}
                       <div className="relative pl-6">
                          <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10"></div>
                          <div className="bg-white border border-gray-200 rounded p-2 hover:border-blue-300 transition-colors cursor-pointer">
                             <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-gray-800">小区出入口</span>
                                <span className="text-[10px] text-gray-400">步骤 1</span>
                             </div>
                             <div className="text-[10px] text-gray-500">由南门进入德意名居</div>
                          </div>
                       </div>

                       {/* Step 2 */}
                       <div className="relative pl-6">
                          <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white border-2 border-gray-300 z-10"></div>
                          <div className="bg-white border border-gray-200 rounded p-2 hover:border-blue-300 transition-colors cursor-pointer">
                             <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-gray-800">关键转折点</span>
                                <span className="text-[10px] text-gray-400">步骤 2</span>
                             </div>
                             <div className="text-[10px] text-gray-500">直行50米后左转</div>
                          </div>
                       </div>

                       {/* Step 3 */}
                       <div className="relative pl-6">
                          <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white border-2 border-gray-300 z-10"></div>
                          <div className="bg-white border border-gray-200 rounded p-2 hover:border-blue-300 transition-colors cursor-pointer">
                             <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-gray-800">目标楼栋</span>
                                <span className="text-[10px] text-gray-400">步骤 3</span>
                             </div>
                             <div className="text-[10px] text-gray-500">抵达二期B座</div>
                          </div>
                       </div>
                    </div>
                 </div>
               )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkbenchLocationGuide;