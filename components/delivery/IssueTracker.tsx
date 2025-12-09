
import React from 'react';
import { MessageSquare, AlertOctagon, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

const IssueTracker: React.FC = () => {
  const ISSUES = [
    { id: 'ISS-1024', location: '京藏高速入口', desc: '导航指引方向错误，导致逆行风险。', confidence: 92, status: 'Open', time: '10 mins ago' },
    { id: 'ISS-1025', location: '朝阳大悦城', desc: 'POI 名称显示为旧名。', confidence: 85, status: 'Open', time: '1 hour ago' },
    { id: 'ISS-1023', location: '五道口', desc: '道路施工封路未及时更新。', confidence: 98, status: 'Converted', time: '2 hours ago' },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50 animate-in fade-in">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center">
              <MessageSquare className="mr-3 text-blue-600" />
              问题工单池 (Issue Tracker)
            </h1>
            <p className="text-slate-500 mt-1">集中管理来自用户反馈、现场采集与自动化检测的各类问题。</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4">Issue ID</th>
                        <th className="px-6 py-4">位置 / 描述</th>
                        <th className="px-6 py-4">AI 预判</th>
                        <th className="px-6 py-4">上报时间</th>
                        <th className="px-6 py-4">状态</th>
                        <th className="px-6 py-4 text-right">操作</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                    {ISSUES.map(issue => (
                        <tr key={issue.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-mono text-slate-600">{issue.id}</td>
                            <td className="px-6 py-4">
                                <div className="font-bold text-slate-800">{issue.location}</div>
                                <div className="text-xs text-slate-500">{issue.desc}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`text-xs px-2 py-1 rounded border ${issue.confidence > 90 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                    {issue.confidence > 90 ? 'High Risk' : 'Medium'} ({issue.confidence}%)
                                </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-xs">{issue.time}</td>
                            <td className="px-6 py-4">
                                <span className={`text-xs font-bold ${issue.status === 'Open' ? 'text-blue-600' : 'text-slate-400'}`}>{issue.status}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                {issue.status === 'Open' ? (
                                    <div className="flex justify-end space-x-2">
                                        <button className="px-3 py-1.5 border border-slate-200 rounded hover:bg-slate-50 text-xs text-slate-600">忽略</button>
                                        <button className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-bold shadow-sm">转为任务</button>
                                    </div>
                                ) : (
                                    <span className="text-xs text-slate-400">已处理</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default IssueTracker;