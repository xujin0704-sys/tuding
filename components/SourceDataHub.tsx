
import React, { useState } from 'react';
import { 
  FileText, 
  FileImage, 
  Video, 
  Database, 
  Search, 
  Filter, 
  MoreVertical, 
  ArrowRight,
  Clock,
  Tag,
  Loader2,
  CheckCircle,
  UploadCloud
} from 'lucide-react';
import { SOURCE_FILES } from '../constants';
import { SourceFile } from '../types';

const SourceDataHub: React.FC = () => {
  const [files, setFiles] = useState<SourceFile[]>(SOURCE_FILES);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>(''); // 'uploading' | 'processing' | 'routing'

  // 流程一：数据接入与智能分诊
  const handleSimulateUpload = () => {
    setIsUploading(true);
    setCurrentStep('uploading');
    setUploadProgress(0);

    // 1. Upload Simulation
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          startProcessing();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const startProcessing = () => {
    // 2. AI Processing Simulation (OCR/CV)
    setCurrentStep('processing');
    
    setTimeout(() => {
      // 3. Routing Logic Simulation
      setCurrentStep('routing');
      
      const newFile: SourceFile = {
        id: `new_${Date.now()}`,
        name: 'Chaoyang_Road_Notice_2025.pdf',
        type: 'text',
        date: 'Just now',
        size: '2.4 MB',
        aiTags: ['道路施工', '封闭通知', '朝阳区'], // Mock extracted entities
        usedBy: ['road'],
        status: 'routed',
        routeTarget: '路网数据产线',
        description: 'AI 自动提取关键词: "封闭施工", "朝阳北路"。已分发至路网处理队列。'
      };

      setTimeout(() => {
         setFiles(prev => [newFile, ...prev]);
         setIsUploading(false);
         setUploadProgress(0);
         setCurrentStep('');
      }, 1500); // Show routing success for a moment
    }, 2000); // Processing time
  };

  const getFileIcon = (type: SourceFile['type']) => {
    switch(type) {
      case 'image': return <FileImage size={24} className="text-purple-600" />;
      case 'text': return <FileText size={24} className="text-blue-600" />;
      case 'video': return <Video size={24} className="text-red-600" />;
      default: return <Database size={24} className="text-emerald-600" />;
    }
  };

  const getStatusColor = (status: SourceFile['status']) => {
    switch(status) {
      case 'uploading': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-amber-100 text-amber-700 animate-pulse';
      case 'routed': return 'bg-green-100 text-green-700';
      case 'archived': return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="flex-1 p-8 bg-slate-50 overflow-y-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Database className="mr-3 text-blue-600" />
            资料集市
          </h1>
          <p className="text-slate-500 mt-1">原始时空数据（影像、文档、视频）统一管理中心。</p>
        </div>
        <div className="flex space-x-3">
           <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm text-sm font-medium">
             <Filter size={16} className="mr-2" />
             筛选
           </button>
           <button 
             onClick={handleSimulateUpload}
             disabled={isUploading}
             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {isUploading ? <Loader2 size={16} className="mr-2 animate-spin"/> : <UploadCloud size={16} className="mr-2" />}
             {isUploading ? '处理中...' : '模拟数据接入'}
           </button>
        </div>
      </header>

      {/* Upload Progress Area */}
      {isUploading && (
        <div className="mb-8 bg-white p-6 rounded-xl border border-blue-200 shadow-lg animate-in fade-in slide-in-from-top-4">
           <div className="flex items-center justify-between mb-2">
             <div className="flex items-center">
                {currentStep === 'uploading' && <UploadCloud className="text-blue-500 mr-2" size={20} />}
                {currentStep === 'processing' && <Loader2 className="text-amber-500 mr-2 animate-spin" size={20} />}
                {currentStep === 'routing' && <ArrowRight className="text-green-500 mr-2" size={20} />}
                <span className="font-bold text-slate-800">
                  {currentStep === 'uploading' && '正在上传文件...'}
                  {currentStep === 'processing' && 'AI 多模态分析 (OCR/CV)...'}
                  {currentStep === 'routing' && '智能路由分发中...'}
                </span>
             </div>
             <span className="text-xs font-mono text-slate-500">{uploadProgress}%</span>
           </div>
           
           <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
             <div 
               className={`h-2 rounded-full transition-all duration-300 ${
                 currentStep === 'routing' ? 'bg-green-500' : 
                 currentStep === 'processing' ? 'bg-amber-500' : 'bg-blue-500'
               }`} 
               style={{ width: `${uploadProgress}%` }}
             ></div>
           </div>

           {/* Workflow Steps Visualization */}
           <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span className={currentStep === 'uploading' ? 'text-blue-600' : ''}>1. 接收存储</span>
              <span className={currentStep === 'processing' ? 'text-amber-600' : ''}>2. 特征提取</span>
              <span className={currentStep === 'routing' ? 'text-green-600' : ''}>3. 产线分发</span>
           </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative mb-8 max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="搜索文件名、位置或标签..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {files.map((file) => (
          <div key={file.id} className={`bg-white rounded-xl border transition-all group flex flex-col ${file.id.startsWith('new_') ? 'border-green-300 shadow-md ring-1 ring-green-100' : 'border-slate-200 shadow-sm hover:shadow-md'}`}>
            
            {/* Card Header */}
            <div className="p-5 border-b border-slate-50 flex items-start justify-between">
              <div className="flex items-start">
                <div className="p-3 bg-slate-50 rounded-lg mr-4 group-hover:bg-blue-50 transition-colors">
                  {getFileIcon(file.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 line-clamp-1" title={file.name}>{file.name}</h3>
                  <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(file.status)} uppercase tracking-wide`}>
                    {file.status === 'routed' ? '已分发' : file.status === 'processing' ? '处理中' : '归档'}
                  </span>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreVertical size={16} />
              </button>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col">
               <p className="text-xs text-slate-500 mb-4 line-clamp-2 min-h-[2.5em]">
                 {file.description}
               </p>
               
               {/* AI Tags */}
               <div className="flex flex-wrap gap-2 mb-4">
                 {file.aiTags.map(tag => (
                   <span key={tag} className="flex items-center text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                     <Tag size={10} className="mr-1" />
                     {tag}
                   </span>
                 ))}
               </div>

               <div className="mt-auto pt-4 border-t border-slate-50">
                  <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                    <span className="flex items-center"><Clock size={12} className="mr-1"/> {file.date}</span>
                    <span className="font-mono">{file.size}</span>
                  </div>
                  
                  {/* Lineage / Used By */}
                  <div className="bg-slate-50 rounded p-2">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
                      {file.routeTarget ? '路由结果:' : '关联流水线:'}
                    </span>
                    {file.routeTarget ? (
                      <div className="flex items-center text-green-700 text-xs font-bold">
                        <CheckCircle size={12} className="mr-1" />
                        {file.routeTarget}
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        {file.usedBy.map(p => (
                          <span key={p} className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-sm font-medium">
                            {p.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
               </div>
            </div>
            
          </div>
        ))}

        {/* Upload Placeholder */}
        <div 
          onClick={handleSimulateUpload}
          className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer min-h-[300px]"
        >
           <UploadCloud size={32} className="mb-2" />
           <span className="font-medium">拖拽上传新文件</span>
        </div>

      </div>
    </div>
  );
};

export default SourceDataHub;
