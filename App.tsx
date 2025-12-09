
import React, { useState, useRef } from 'react';
import { Bot } from 'lucide-react';
import MainLayout from './components/MainLayout';
import Dashboard from './components/Dashboard';
import MonitoringDashboard from './components/MonitoringDashboard';
import Workbench from './components/Workbench';
import WorkbenchPOI from './components/WorkbenchPOI';
import WorkbenchAddress from './components/WorkbenchAddress';
import WorkbenchLocationGuide from './components/WorkbenchLocationGuide';
import WorkbenchAdmin from './components/WorkbenchAdmin';
import SourceCatalog from './components/SourceCatalog'; 
import SourceTriage from './components/SourceTriage';   
import ModelRegistry from './components/ModelRegistry';
import JobRepository from './components/JobRepository';
import PipelineTaskCenter from './components/PipelineTaskCenter';
import CopilotPanel from './components/CopilotPanel';

// Import Delivery & Operations Components
import ReleaseCalendar from './components/delivery/ReleaseCalendar';
import IssueTracker from './components/delivery/IssueTracker';
import HotfixExpress from './components/delivery/HotfixExpress';
import ProductReleases from './components/delivery/ProductReleases';
import ComponentSnapshots from './components/delivery/ComponentSnapshots';
import DeliveryEvaluation from './components/delivery/DeliveryEvaluation';

// Import Version Management Components (Legacy but kept if needed)
import VersionDashboard from './components/versions/VersionDashboard';
import BranchManagement from './components/versions/BranchManagement';
import SnapshotCommits from './components/versions/SnapshotCommits';
import ReleaseRollback from './components/versions/ReleaseRollback';
import ChangelogDocs from './components/versions/ChangelogDocs';

// Import New Independent System Management Components
import SystemUsers from './components/system/SystemUsers';
import SystemRoles from './components/system/SystemRoles';
import SystemDataScope from './components/system/SystemDataScope';

import SystemQuota from './components/system/SystemQuota';
import SystemComputeMonitor from './components/system/SystemComputeMonitor';

import SystemGeoFence from './components/system/SystemGeoFence';
import SystemEncryption from './components/system/SystemEncryption';
import SystemAuditExport from './components/system/SystemAuditExport';

import SystemCostBill from './components/system/SystemCostBill';
import SystemPricing from './components/system/SystemPricing';

import SystemOpLog from './components/system/SystemOpLog';
import SystemSysLog from './components/system/SystemSysLog';

import SystemThresholds from './components/system/SystemThresholds';
import SystemDictionary from './components/system/SystemDictionary';

import { ViewState, PipelineType, PipelineDef, RoutingRule } from './types';
import { INITIAL_PIPELINE_DEFS, ROUTING_RULES } from './constants';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [currentPipeline, setCurrentPipeline] = useState<PipelineType>('poi');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // Global State for Pipelines and Routing to share between Triage, TaskCenter and JobRepo
  const [pipelineDefs, setPipelineDefs] = useState<PipelineDef[]>(INITIAL_PIPELINE_DEFS);
  const [routingRules, setRoutingRules] = useState<RoutingRule[]>(ROUTING_RULES);

  // Copilot State
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotPos, setCopilotPos] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    
    // Auto-switch pipeline context based on view
    if (view === 'wb-poi') setCurrentPipeline('poi');
    if (view === 'wb-address') setCurrentPipeline('address');
    if (view === 'wb-road') setCurrentPipeline('road');
    if (view === 'wb-admin') setCurrentPipeline('admin');
    if (view === 'wb-nature') setCurrentPipeline('hydro');
    
    if (!view.startsWith('wb-')) {
       setSelectedTaskId(null);
    }
  };

  const handleCopilotMouseDown = (e: React.MouseEvent) => {
    // Only allow drag on left click
    if (e.button !== 0) return;
    
    // e.preventDefault(); // Don't prevent default indiscriminately, let focus happen if needed
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    startPosRef.current = { ...copilotPos };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.x;
      const dy = moveEvent.clientY - dragStartRef.current.y;
      
      // If moved significantly, mark as dragged
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          hasDraggedRef.current = true;
      }

      setCopilotPos({
        x: startPosRef.current.x + dx,
        y: startPosRef.current.y + dy
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // If it was a click (not a drag), toggle the copilot
      if (!hasDraggedRef.current) {
          setIsCopilotOpen(prev => !prev);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'monitoring':
        return <MonitoringDashboard />;
      case 'source-hub': 
        return <SourceCatalog />;
      case 'source-catalog':
        return <SourceCatalog />;
      case 'source-triage':
        return (
          <SourceTriage 
            routingRules={routingRules}
            onUpdateRules={setRoutingRules}
            pipelineDefs={pipelineDefs}
            onUpdatePipelines={setPipelineDefs}
          />
        );
        
      case 'model-hub':
        return <ModelRegistry />;

      case 'job-repo':
        return (
          <JobRepository 
            pipelineDefs={pipelineDefs}
            onUpdatePipelines={setPipelineDefs}
          />
        );
        
      case 'pipeline-center':
        return (
          <PipelineTaskCenter 
            pipelineDefs={pipelineDefs} 
            onWorkTask={(pipelineId, taskId) => {
               // Map pipelineId to ViewState
               let view: ViewState = 'dashboard';
               if (pipelineId === 'poi') view = 'wb-poi';
               else if (pipelineId === 'address') view = 'wb-address';
               else if (pipelineId === 'road') view = 'wb-road';
               else if (pipelineId === 'admin') view = 'wb-admin';
               else if (pipelineId === 'hydro') view = 'wb-nature';
               else view = 'wb-poi'; // default fallback
               
               handleNavigate(view);
               setSelectedTaskId(taskId);
            }}
          />
        );
      
      case 'wb-poi':
        return (
          <WorkbenchPOI
            currentPipeline='poi'
            selectedTaskId={selectedTaskId}
            onSelectTask={setSelectedTaskId}
            onPipelineChange={(p) => setCurrentPipeline(p)}
            onBack={() => handleNavigate('pipeline-center')}
          />
        );

      case 'wb-address':
        return (
          <WorkbenchAddress
            currentPipeline='address'
            selectedTaskId={selectedTaskId}
            onSelectTask={setSelectedTaskId}
            onPipelineChange={(p) => setCurrentPipeline(p)}
            onBack={() => handleNavigate('pipeline-center')}
          />
        );

      case 'wb-admin':
        return (
          <WorkbenchAdmin
            currentPipeline='admin'
            selectedTaskId={selectedTaskId}
            onSelectTask={setSelectedTaskId}
            onBack={() => handleNavigate('pipeline-center')}
          />
        );

      case 'wb-road':
      case 'wb-nature':
        return (
          <Workbench 
            currentPipeline={currentView === 'wb-road' ? 'road' : 'hydro'}
            selectedTaskId={selectedTaskId}
            onSelectTask={setSelectedTaskId}
            onPipelineChange={(p) => setCurrentPipeline(p)}
            onBack={() => handleNavigate('pipeline-center')}
          />
        );

      case 'wb-location-guide':
        return <WorkbenchLocationGuide />;

      case 'wb-llm-rlhf':
        return (
          <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">大模型标注 (RLHF)</h3>
              <p>功能开发中...</p>
            </div>
          </div>
        );
        
      // Delivery & Operations
      case 'del-calendar':
        return <ReleaseCalendar />;
      case 'del-ops-tracker':
        return <IssueTracker />;
      case 'del-ops-hotfix':
        return <HotfixExpress />;
      case 'del-prod-releases':
        return <ProductReleases />;
      case 'del-comp-snapshots':
        return <ComponentSnapshots />;
      case 'del-eval-center':
        return <DeliveryEvaluation />;

      // Legacy Versions
      case 'versions':
      case 'ver-dashboard':
        return <VersionDashboard />;
      case 'ver-branches':
        return <BranchManagement />;
      case 'ver-snapshots':
        return <SnapshotCommits />;
      case 'ver-release':
        return <ReleaseRollback />;
      case 'ver-changelog':
        return <ChangelogDocs />;
      
      // System Management - Granular Routing
      case 'sys-users':
        return <SystemUsers />;
      case 'sys-roles':
        return <SystemRoles />;
      case 'sys-data-scope':
        return <SystemDataScope />;
      
      case 'sys-quota':
        return <SystemQuota />;
      case 'sys-compute-monitor':
        return <SystemComputeMonitor />;
      
      case 'sys-geo-fence':
        return <SystemGeoFence />;
      case 'sys-encryption':
        return <SystemEncryption />;
      case 'sys-audit-export':
        return <SystemAuditExport />;
      
      case 'sys-cost':
        return <SystemCostBill />;
      case 'sys-pricing':
        return <SystemPricing />;
      
      case 'sys-op-log':
        return <SystemOpLog />;
      case 'sys-sys-log':
        return <SystemSysLog />;
        
      case 'sys-settings-thresholds':
        return <SystemThresholds />;
      case 'sys-settings-dict':
        return <SystemDictionary />;
      case 'settings':
        return <SystemThresholds />; // Default fallback
        
      default:
        return <Dashboard />;
    }
  };

  return (
    <MainLayout currentView={currentView} onNavigate={handleNavigate}>
      {/* View Content */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
          {renderContent()}
      </div>
      
      {/* Floating Copilot Wrapper */}
      <div 
        className="absolute bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none"
        style={{ 
          transform: `translate(${copilotPos.x}px, ${copilotPos.y}px)`,
        }}
      >
          {/* The Chat Panel */}
          {isCopilotOpen && (
              <div className="pointer-events-auto mb-2 origin-bottom-right shadow-2xl rounded-2xl">
                  <CopilotPanel onClose={() => setIsCopilotOpen(false)} />
              </div>
          )}

          {/* The Trigger Button */}
          <div 
            className="cursor-move select-none touch-none pointer-events-auto"
            onMouseDown={handleCopilotMouseDown}
            title={isCopilotOpen ? "收起助手" : "点击打开 AI 助手 (可拖拽)"}
          >
              <button className={`flex items-center bg-white text-gray-800 px-4 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-200 group border border-gray-100 ${isCopilotOpen ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
                <div className="mr-3 relative">
                  <div className="w-2 h-2 bg-green-500 rounded-full absolute top-0 right-0 animate-pulse ring-2 ring-white"></div>
                  <Bot size={22} className="text-blue-600" />
                </div>
                <span className="font-bold text-sm pr-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {isCopilotOpen ? '收起助手' : 'AI 助手 (Copilot)'}
                </span>
              </button>
          </div>
      </div>
    </MainLayout>
  );
}

export default App;