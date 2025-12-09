
import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Server, 
  ArrowRight,
  Sliders,
  PlayCircle,
  Loader2,
  ShieldCheck,
  BarChart3,
  Activity,
  XCircle,
  Lock,
  ChevronRight,
  Split,
  GitMerge,
  MessageSquare,
  Fingerprint,
  TrendingUp
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

type ReleaseStage = 'idle' | 'config' | 'canary' | 'approval' | 'releasing' | 'completed';

const ReleaseRollback: React.FC = () => {
  const [releaseStage, setReleaseStage] = useState<ReleaseStage>('idle');
  const [canaryPercentage, setCanaryPercentage] = useState(10);
  const [autoRollback, setAutoRollback] = useState(true);
  const [trafficStrategy, setTrafficStrategy] = useState<'canary' | 'blue_green'>('canary');
  
  const [testProgress, setTestProgress] = useState(0);
  const [testMetrics, setTestMetrics] = useState({ errorRate: 0.0, latency: 45, qps: 2400 });
  const [metricHistory, setMetricHistory] = useState<{time: string, error: number, latency: number}[]>([]);
  const [approvalComment, setApprovalComment] = useState('');
  const [signerName, setSignerName] = useState('');

  // Reset state helper
  const resetRelease = () => {
    setReleaseStage('idle');
    setTestProgress(0);
    setCanaryPercentage(10);
    setApprovalComment('');
    setMetricHistory([]);
    setSignerName('');
  };

  useEffect(() => {
    let interval: any;
    if (releaseStage === 'canary') {
      setTestProgress(0);
      setMetricHistory([]);
      
      interval = setInterval(() => {
        setTestProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          
          // Simulate metric fluctuation
          const newError = Number((Math.random() * 0.05).toFixed(3));
          const newLatency = 40 + Math.floor(Math.random() * 15);
          
          setTestMetrics(prevM => ({
             errorRate: newError,
             latency: newLatency,
             qps: prevM.qps + Math.floor(Math.random() * 50 - 25)
          }));

          setMetricHistory(prevH => {
              const newHistory = [...prevH, {
                  time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" }),
                  error: newError * 100, // Scale for chart
                  latency: newLatency
              }];
              return newHistory.slice(-20); // Keep last 20 points
          });

          return prev + 1; // Slower progress for realism
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [releaseStage]);

  const getRiskLevel = () => {
      if (trafficStrategy === 'blue_green') return { label: 'High Risk', color: 'text-rose-600 bg-rose-50 border-rose-200' };
      if (canaryPercentage > 30) return { label: 'Medium Risk', color: 'text-amber-600 bg-amber-50 border-amber-200' };
      return { label: 'Low Risk', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  };

  const renderStepper = () => {
    const steps = [
      { id: 'config', label: '策略配置' },
      { id: 'canary', label: '灰度验证' },
      { id: 'approval', label: '上线审批' },
      { id: 'completed', label: '发布完成' }
    ];
    
    const currentIdx = steps.findIndex(s => s.id === releaseStage) === -1 
        ? (releaseStage === 'releasing' ? 2 : 0) 
        : steps.findIndex(s => s.id === releaseStage);

    return (
      <div className="flex items-center justify-between mb-8 px-4">
         {steps.map((step, idx) => (
            <div key={step.id} className="flex flex-col items-center relative z-10 w-full">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                  idx <= currentIdx 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200' 
                  : 'bg-white border-slate-200 text-slate-300'
               }`}>
                  {idx < currentIdx ? <CheckCircle2 size={16} /> : idx + 1}
               </div>
               <span className={`text-xs mt-2 font-medium ${idx <= currentIdx ? 'text-blue-700' : 'text-slate-400'}`}>{step.label}</span>
               
               {/* Connector Line */}
               {idx < steps.length - 1 && (
                  <div className={`absolute top-4 left-[50%] w-full h-0.5 -z-10 ${
                     idx < currentIdx ? 'bg-blue-600' : 'bg-slate-100'
                  }`}></div>
               )}
            </div>
         ))}
      </div>
    );
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50 animate-in fade-in">
       <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
             <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                   <Rocket className="mr-3 text-blue-600" />
                   发布与回滚 (Delivery Console)
                </h1>
                <p className="text-slate-500 mt-1">控制线上环境的版本交付、灰度验证与应急响应。</p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Left: Staging & Info */}
             <div className="lg:col-span-1 space-y-6">
                {/* Staging Area */}
                <div className="bg-white rounded-xl border border-blue-200 shadow-sm overflow-hidden flex flex-col relative">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Server size={100} className="text-blue-600" />
                    </div>
                    <div className="px-6 py-4 bg-blue-50/50 border-b border-blue-100 flex justify-between items-center">
                       <h3 className="font-bold text-blue-900 flex items-center">
                          <Server size={18} className="mr-2" />
                          预发布环境
                       </h3>
                       <span className="bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Staging</span>
                    </div>
                    <div className="p-6">
                       <div className="mb-6">
                          <div className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-1">待发布快照</div>
                          <div className="text-2xl font-mono font-bold text-slate-800 tracking-tight">v2025.12.01-RC2</div>
                          <div className="flex items-center mt-2 text-xs text-slate-500">
                             <GitMerge size={12} className="mr-1" /> Branch: release/2025.12
                          </div>
                       </div>
                       
                       <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm border-b border-slate-50 pb-2">
                             <span className="text-slate-500">自动化测试</span>
                             <span className="font-bold text-green-600 flex items-center"><CheckCircle2 size={12} className="mr-1"/> Passed</span>
                          </div>
                          <div className="flex justify-between text-sm border-b border-slate-50 pb-2">
                             <span className="text-slate-500">代码扫描</span>
                             <span className="font-bold text-green-600 flex items-center"><CheckCircle2 size={12} className="mr-1"/> 0 Issues</span>
                          </div>
                          <div className="flex justify-between text-sm">
                             <span className="text-slate-500">人工验收</span>
                             <span className="font-bold text-green-600 flex items-center"><CheckCircle2 size={12} className="mr-1"/> Approved</span>
                          </div>
                       </div>

                       <button 
                         disabled={releaseStage !== 'idle'}
                         onClick={() => setReleaseStage('config')}
                         className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center group"
                       >
                          {releaseStage === 'idle' ? '启动发布流程' : '发布流程锁定中'}
                          {releaseStage === 'idle' && <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                       </button>
                    </div>
                </div>

                {/* Rollback Panel */}
                <div className="bg-white rounded-xl border border-rose-200 shadow-sm overflow-hidden">
                   <div className="px-6 py-4 bg-rose-50/50 border-b border-rose-100 flex items-center text-rose-800">
                      <AlertTriangle size={18} className="mr-2" />
                      <h3 className="font-bold text-sm">应急回滚 (Emergency)</h3>
                   </div>
                   <div className="p-6">
                      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                         若当前线上版本出现严重故障，可立即回退至上一稳定版本。此操作将强制切换流量并重置缓存。
                      </p>
                      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
                          <span className="text-xs font-bold text-slate-500">Last Stable</span>
                          <span className="text-xs font-mono font-bold text-slate-700">v2025.11.15-Release</span>
                      </div>
                      <button className="w-full py-2 bg-white border-2 border-rose-500 text-rose-600 rounded-lg font-bold hover:bg-rose-50 transition-colors flex items-center justify-center text-sm">
                         <RotateCcw size={14} className="mr-2" />
                         一键回退
                      </button>
                   </div>
                </div>
             </div>

             {/* Right: Release Wizard */}
             <div className="lg:col-span-2">
                 <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                       <h3 className="font-bold text-slate-800 flex items-center">
                          <Rocket size={18} className="mr-2 text-blue-600" />
                          正式环境发布向导
                       </h3>
                       <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${releaseStage === 'idle' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {releaseStage === 'idle' ? 'System Stable' : 'Release In Progress'}
                       </span>
                    </div>
                    
                    <div className="p-8 flex-1 flex flex-col">
                       {releaseStage !== 'idle' && renderStepper()}

                       <div className="flex-1 flex flex-col">
                          {/* Step 0: Idle State */}
                          {releaseStage === 'idle' && (
                             <div className="h-full flex flex-col justify-center items-center text-slate-400 space-y-4 py-12">
                                <div className="p-6 bg-slate-50 rounded-full border border-slate-100">
                                   <Lock size={40} className="text-slate-300" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-slate-600">发布通道空闲</p>
                                    <p className="text-xs mt-1">请从左侧预发布环境发起新的发布请求。</p>
                                </div>
                             </div>
                          )}

                          {/* Step 1: Configuration */}
                          {releaseStage === 'config' && (
                             <div className="space-y-6 animate-in slide-in-from-right flex-1">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="block text-sm font-bold text-slate-700">发布策略 (Strategy)</label>
                                        <div 
                                            onClick={() => setTrafficStrategy('canary')}
                                            className={`p-4 rounded-lg border cursor-pointer transition-all ${trafficStrategy === 'canary' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200' : 'border-slate-200 hover:border-blue-300'}`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-sm text-slate-800">灰度发布 (Canary)</span>
                                                {trafficStrategy === 'canary' && <CheckCircle2 size={16} className="text-blue-600"/>}
                                            </div>
                                            <p className="text-xs text-slate-500">按百分比逐步放量，风险可控，适合常规版本迭代。</p>
                                        </div>
                                        <div 
                                            onClick={() => setTrafficStrategy('blue_green')}
                                            className={`p-4 rounded-lg border cursor-pointer transition-all ${trafficStrategy === 'blue_green' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200' : 'border-slate-200 hover:border-blue-300'}`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-sm text-slate-800">蓝绿部署 (Blue/Green)</span>
                                                {trafficStrategy === 'blue_green' && <CheckCircle2 size={16} className="text-blue-600"/>}
                                            </div>
                                            <p className="text-xs text-slate-500">部署全量新环境，瞬间切换流量，适合重大架构升级。</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-sm font-bold text-slate-700">部署参数 (Parameters)</label>
                                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                                            <div>
                                                <div className="flex justify-between text-xs mb-2">
                                                    <span className="font-medium text-slate-600">初始流量比例</span>
                                                    <span className="font-bold text-blue-600">{canaryPercentage}%</span>
                                                </div>
                                                <input 
                                                    type="range" min="5" max="50" step="5" 
                                                    value={canaryPercentage} 
                                                    onChange={(e) => setCanaryPercentage(parseInt(e.target.value))}
                                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                                />
                                                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                                    <span>5%</span>
                                                    <span>50%</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                                                <span className="text-xs font-medium text-slate-600">异常自动回滚</span>
                                                <div 
                                                    onClick={() => setAutoRollback(!autoRollback)}
                                                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${autoRollback ? 'bg-blue-600' : 'bg-slate-300'}`}
                                                >
                                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${autoRollback ? 'left-6' : 'left-1'}`}></div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Risk Badge */}
                                        <div className={`p-2 rounded border text-xs font-bold flex items-center justify-center ${getRiskLevel().color}`}>
                                            <AlertTriangle size={14} className="mr-2"/>
                                            {getRiskLevel().label}
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex justify-end">
                                    <button 
                                        onClick={() => setReleaseStage('canary')}
                                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm transition-all flex items-center"
                                    >
                                        开始部署 <ArrowRight size={16} className="ml-2"/>
                                    </button>
                                </div>
                             </div>
                          )}

                          {/* Step 2: Canary Testing */}
                          {releaseStage === 'canary' && (
                             <div className="space-y-6 animate-in slide-in-from-right flex-1 flex flex-col">
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-slate-800 text-sm flex items-center">
                                            <Split size={16} className="mr-2 text-purple-500"/>
                                            流量分发 & 遥测 (Telemetry)
                                        </h4>
                                        <div className="text-xs bg-white px-2 py-1 rounded border border-slate-200 shadow-sm font-mono flex items-center">
                                            <Activity size={12} className="mr-1 text-blue-500" />
                                            QPS: {testMetrics.qps}
                                        </div>
                                    </div>
                                    
                                    {/* Traffic Visualization */}
                                    <div className="h-12 w-full flex rounded-lg overflow-hidden border border-slate-200 mb-4 bg-white">
                                        <div className="bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 transition-all duration-500" style={{ width: `${100 - canaryPercentage}%` }}>
                                            Current (v1) {100 - canaryPercentage}%
                                        </div>
                                        <div className="bg-blue-500 flex items-center justify-center text-xs font-bold text-white transition-all duration-500 relative overflow-hidden" style={{ width: `${canaryPercentage}%` }}>
                                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                            Canary (v2)
                                        </div>
                                    </div>

                                    {/* Real-time Charts */}
                                    <div className="h-40 w-full bg-white rounded-lg border border-slate-200 p-2 relative">
                                        <div className="absolute top-2 left-3 text-[10px] font-bold text-slate-400 z-10 flex items-center">
                                            <TrendingUp size={10} className="mr-1"/> Error Rate Trend
                                        </div>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={metricHistory}>
                                                <defs>
                                                    <linearGradient id="colorError" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="time" hide />
                                                <YAxis hide domain={[0, 10]} />
                                                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px'}} />
                                                <Area type="monotone" dataKey="error" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorError)" isAnimationActive={false} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">验证进度</div>
                                        <div className="relative w-16 h-16 flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle cx="32" cy="32" r="28" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                                                <circle cx="32" cy="32" r="28" stroke="#3b82f6" strokeWidth="4" fill="none" strokeDasharray={`${testProgress * 1.75} 175`} />
                                            </svg>
                                            <span className="absolute text-sm font-bold text-blue-600">{testProgress}%</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm text-center flex flex-col justify-center">
                                        <div className="text-xs text-slate-500 uppercase font-bold mb-2">Error Rate</div>
                                        <div className={`text-2xl font-bold ${testMetrics.errorRate > 0.1 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                            {testMetrics.errorRate}%
                                        </div>
                                        <div className="text-[10px] text-slate-400 mt-1">Threshold: 1.0%</div>
                                    </div>
                                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm text-center flex flex-col justify-center">
                                        <div className="text-xs text-slate-500 uppercase font-bold mb-2">Latency (P95)</div>
                                        <div className="text-2xl font-bold text-slate-800">
                                            {testMetrics.latency}ms
                                        </div>
                                        <div className="text-[10px] text-slate-400 mt-1">Baseline: 42ms</div>
                                    </div>
                                </div>

                                <div className="flex-1"></div>

                                {testProgress >= 100 && (
                                   <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 animate-in fade-in">
                                       <button 
                                          onClick={() => setReleaseStage('config')}
                                          className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all text-sm"
                                       >
                                          中止并回滚
                                       </button>
                                       <button 
                                          onClick={() => setReleaseStage('approval')}
                                          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-sm transition-all flex items-center justify-center"
                                       >
                                          <CheckCircle2 size={16} className="mr-2" />
                                          验证通过，进入审批
                                       </button>
                                   </div>
                                )}
                             </div>
                          )}

                          {/* Step 3: Approval */}
                          {releaseStage === 'approval' && (
                             <div className="space-y-6 animate-in slide-in-from-right flex-1">
                                <div className="p-5 bg-amber-50 border border-amber-100 rounded-xl">
                                   <div className="flex items-start mb-4">
                                      <ShieldCheck size={24} className="text-amber-600 mr-3 mt-0.5" />
                                      <div>
                                         <h5 className="text-base font-bold text-amber-900">全量发布前确认</h5>
                                         <p className="text-sm text-amber-800/80 mt-1 leading-relaxed">
                                            灰度测试已通过。当前版本 <span className="font-mono font-bold">v2025.12.01-RC2</span> 表现稳定，未触发自动回滚阈值。
                                            <br/>请确认以下检查项并签署发布意见。
                                         </p>
                                      </div>
                                   </div>
                                   
                                   <div className="space-y-2 bg-white/60 p-4 rounded-lg border border-amber-200/50">
                                      {[
                                          '无 P0/P1 级活跃告警',
                                          '核心业务接口 QPS/Latency 正常',
                                          '数据库 Schema 变更已完成',
                                          '数据回滚方案已就绪'
                                      ].map((item, i) => (
                                          <label key={i} className="flex items-center space-x-2 cursor-pointer">
                                              <input type="checkbox" className="w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500" defaultChecked />
                                              <span className="text-sm text-amber-900">{item}</span>
                                          </label>
                                      ))}
                                   </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">发布意见 / 备注</label>
                                        <div className="relative">
                                            <MessageSquare size={16} className="absolute left-3 top-3 text-slate-400" />
                                            <textarea 
                                                value={approvalComment}
                                                onChange={(e) => setApprovalComment(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none h-24 resize-none"
                                                placeholder="请输入批准理由或注意事项..."
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">数字签名 (Sign-off)</label>
                                        <div className="relative">
                                            <Fingerprint size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input 
                                                type="text"
                                                value={signerName}
                                                onChange={(e) => setSignerName(e.target.value)}
                                                className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-sm outline-none transition-all ${signerName ? 'border-green-500 focus:ring-green-100' : 'border-slate-200 focus:border-blue-500'}`}
                                                placeholder="输入用户名以签署..."
                                            />
                                            {signerName && <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in" />}
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-2">
                                            * 此操作将被记录在审计日志中，操作人: {signerName || 'Unknown'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                   <button 
                                      onClick={() => setReleaseStage('config')}
                                      className="py-3 bg-white border border-slate-300 text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition-all text-sm"
                                   >
                                      驳回
                                   </button>
                                   <button 
                                      onClick={() => {
                                         setReleaseStage('releasing');
                                         setTimeout(() => setReleaseStage('completed'), 2000);
                                      }}
                                      disabled={!signerName}
                                      className="py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-bold shadow-lg shadow-green-100 transition-all text-sm flex items-center justify-center"
                                   >
                                      <Rocket size={18} className="mr-2" />
                                      批准并全量上线
                                   </button>
                                </div>
                             </div>
                          )}

                          {/* Step 3.5: Releasing (Loading) */}
                          {releaseStage === 'releasing' && (
                             <div className="h-full flex flex-col justify-center items-center space-y-6 animate-in fade-in">
                                <div className="relative">
                                   <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-blue-500 animate-spin"></div>
                                   <div className="absolute inset-0 flex items-center justify-center">
                                      <Server size={32} className="text-blue-600" />
                                   </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-lg font-bold text-slate-800">正在全量切换流量...</h3>
                                    <p className="text-sm text-slate-500">Updating Load Balancer Rules & CDN Cache</p>
                                </div>
                             </div>
                          )}

                          {/* Step 4: Completed */}
                          {releaseStage === 'completed' && (
                             <div className="h-full flex flex-col justify-center items-center space-y-6 animate-in zoom-in duration-300">
                                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner">
                                   <CheckCircle2 size={48} />
                                </div>
                                <div className="text-center space-y-2">
                                   <h4 className="text-2xl font-bold text-slate-900">发布成功!</h4>
                                   <p className="text-slate-500">版本 <span className="font-mono font-bold text-slate-700">v2025.12.01-RC2</span> 已全量上线。</p>
                                   {approvalComment && (
                                       <div className="mt-4 p-3 bg-slate-50 rounded text-xs text-slate-500 italic max-w-xs mx-auto">
                                           "{approvalComment}"
                                       </div>
                                   )}
                                   {signerName && (
                                       <div className="text-[10px] text-slate-400 mt-2 font-mono">
                                           Signed by: {signerName}
                                       </div>
                                   )}
                                </div>
                                <button 
                                   onClick={resetRelease}
                                   className="px-8 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-all shadow-lg"
                                >
                                   返回控制台
                                </button>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default ReleaseRollback;
