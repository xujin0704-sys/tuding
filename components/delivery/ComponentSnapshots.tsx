
import React from 'react';
import { Layers, GitCommit, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

const SNAPSHOTS = [
    { id: 'Road-v20231220', branch: 'release/road/q4', author: 'AutoCI', score: 98, conflict: false },
    { id: 'POI-v20231231', branch: 'release/poi/dec', author: 'Jane Doe', score: 95, conflict: false },
    { id: 'Admin-v20240102', branch: 'feature/new-zone', author: 'John Smith', score: 88, conflict: true },
];

const ComponentSnapshots: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50 animate-in fade-in">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center mb-6">
            <Layers className="mr-3 text-blue-600" />
            组件版本库 (Component Snapshots)
        </h1>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4">Snapshot ID</th>
                        <th className="px-6 py-4">Branch</th>
                        <th className="px-6 py-4">Unit QA Score</th>
                        <th className="px-6 py-4">Conflict Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                    {SNAPSHOTS.map(snap => (
                        <tr key={snap.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-mono font-bold text-slate-700">{snap.id}</td>
                            <td className="px-6 py-4 text-slate-500 flex items-center">
                                <GitCommit size={14} className="mr-1"/> {snap.branch}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="w-16 h-2 bg-slate-200 rounded-full mr-2 overflow-hidden">
                                        <div className={`h-full ${snap.score > 90 ? 'bg-green-500' : 'bg-amber-500'}`} style={{width: `${snap.score}%`}}></div>
                                    </div>
                                    <span className="font-bold">{snap.score}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                {snap.conflict ? (
                                    <span className="flex items-center text-rose-600 text-xs font-bold bg-rose-50 px-2 py-1 rounded w-fit border border-rose-100">
                                        <AlertTriangle size={12} className="mr-1"/> 5 Conflicts
                                    </span>
                                ) : (
                                    <span className="flex items-center text-green-600 text-xs font-bold">
                                        <CheckCircle2 size={14} className="mr-1"/> Clean
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-blue-600 hover:underline text-xs font-bold flex items-center justify-end">
                                    Detail <ArrowRight size={12} className="ml-1"/>
                                </button>
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

export default ComponentSnapshots;