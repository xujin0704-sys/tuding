
import React from 'react';
import { 
  FileText, 
  Sparkles, 
  Link, 
  Search,
  Calendar
} from 'lucide-react';

const LOGS = [
  {
    version: 'v2.5.0',
    date: '2025-12-01',
    aiGenerated: true,
    content: '本次版本重点更新了海淀区北部的路网，基于 11 月高分影像新增了 15km 道路，并修复了上个版本中 CBD 区域的 POI 偏移问题。同时优化了渲染性能。',
    assets: ['Sat_Image_Nov_HD.tiff', 'POI_Patch_CBD.csv']
  },
  {
    version: 'v2.4.2',
    date: '2025-11-15',
    aiGenerated: true,
    content: '修复了行政区划边界在缩放层级 14 下的显示异常。更新了朝阳区新增的 3 个公园绿地多边形。',
    assets: ['Bugfix_Admin_Poly.json']
  },
  {
    version: 'v2.4.0',
    date: '2025-11-01',
    aiGenerated: false,
    content: 'Q3 常规数据更新。覆盖全市范围内的餐饮与零售 POI 数据清洗。引入了新的 3D 建筑模型用于核心商圈展示。',
    assets: ['Q3_POI_Dump.db', '3D_Models_V2.zip']
  },
];

const ChangelogDocs: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden animate-in fade-in">
       <div className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center shrink-0">
          <div>
             <h1 className="text-xl font-bold text-slate-900 flex items-center">
                <FileText className="mr-3 text-slate-500" />
                变更日志与文档
             </h1>
             <p className="text-xs text-slate-500 mt-1">AI 自动生成的版本说明书与资产溯源。</p>
          </div>
          <div className="relative w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input type="text" placeholder="搜索变更内容..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
       </div>

       <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto relative pl-8 border-l-2 border-slate-200 space-y-12">
             {LOGS.map((log, idx) => (
                <div key={log.version} className="relative">
                   <div className={`absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 border-slate-50 ${idx === 0 ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-300'}`}></div>
                   
                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                         <div className="flex items-center space-x-3">
                            <span className="text-lg font-bold text-slate-900">{log.version}</span>
                            {log.aiGenerated && (
                               <span className="bg-purple-50 text-purple-700 text-[10px] px-2 py-0.5 rounded-full border border-purple-100 flex items-center font-bold">
                                  <Sparkles size={10} className="mr-1" /> AI Generated
                               </span>
                            )}
                         </div>
                         <div className="flex items-center text-xs text-slate-400">
                            <Calendar size={12} className="mr-1.5" />
                            {log.date}
                         </div>
                      </div>
                      
                      <div className="text-slate-700 text-sm leading-relaxed mb-4">
                         {log.content}
                      </div>

                      <div className="border-t border-slate-50 pt-3">
                         <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">资产引用溯源</div>
                         <div className="flex flex-wrap gap-2">
                            {log.assets.map(asset => (
                               <div key={asset} className="flex items-center px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-blue-600 hover:underline cursor-pointer">
                                  <Link size={10} className="mr-1.5" />
                                  {asset}
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default ChangelogDocs;
