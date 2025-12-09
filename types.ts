
export type ViewState = 
  | 'dashboard' 
  | 'monitoring' 
  | 'source-hub' 
  | 'source-catalog' 
  | 'source-triage' 
  | 'model-hub' 
  | 'job-repo' 
  | 'pipeline-center' 
  | 'wb-poi' 
  | 'wb-address' 
  | 'wb-road' 
  | 'wb-admin' 
  | 'wb-nature' 
  | 'wb-location-guide' 
  | 'wb-llm-rlhf' 
  // Delivery & Operations
  | 'del-calendar'
  | 'del-ops-tracker' // New: Issue Tracker
  | 'del-ops-hotfix'  // New: Hotfix Express
  | 'del-prod-releases'
  | 'del-comp-snapshots'
  | 'del-eval-center'
  // Version Management (Legacy/Specific views if needed, otherwise subsumed)
  | 'versions'
  | 'ver-dashboard'
  | 'ver-branches'
  | 'ver-snapshots'
  | 'ver-release'
  | 'ver-changelog' 
  // System
  | 'sys-users'
  | 'sys-roles'
  | 'sys-data-scope'
  | 'sys-quota'
  | 'sys-compute-monitor'
  | 'sys-geo-fence'
  | 'sys-encryption'
  | 'sys-audit-export'
  | 'sys-cost'
  | 'sys-pricing'
  | 'sys-op-log'
  | 'sys-sys-log'
  | 'sys-settings-thresholds'
  | 'sys-settings-dict'
  | 'settings';

export type PipelineType = 'poi' | 'road' | 'admin' | 'hydro' | 'address' | 'archive';

export interface PipelineDef {
  id: string;
  name: string;
  iconName?: string;
  status?: 'active' | 'inactive';
  subPipelines: {
    id: string;
    name: string;
    description?: string;
    nodes: any[]; // Simplified for now
  }[];
}

// 2. 路由规则 (在“线索与路由”中使用)
export interface RoutingRule {
  id: string;
  name: string;
  // 触发条件描述 (Simplified for UI)
  conditionDescription: string; 
  // 分发动作 (Simplified)
  targetPipelineId: string;
  targetPipelineName: string;
  targetSubPipelineId?: string; // New: Support sub-pipeline targeting
  targetSubPipelineName?: string; // New
  active: boolean;
  mode: 'auto' | 'manual';
  priority?: 'high' | 'medium' | 'low'; // New priority field
  weight?: number; // 0-100 for data source weighting
}

export interface DispatchLog {
  id: string;
  assetId: string;
  assetName: string;
  targetPipelineName: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
  message?: string;
}

export interface Feature {
  id: number;
  properties: Record<string, any>;
  status: 'validated' | 'human_reviewing' | 'rejected' | 'ai_generated';
  aiConfidence: number;
  issues?: string[];
}

export interface SourceFile {
  id: string;
  name: string;
  type: 'image' | 'text' | 'video' | 'db';
  date: string;
  size: string;
  aiTags: string[];
  usedBy: string[];
  status: 'uploading' | 'processing' | 'routed' | 'archived';
  routeTarget?: string;
  description?: string;
}

export type ModelCapability = 'text' | 'image' | 'audio' | 'video' | 'point_cloud' | 'oblique' | 'llm' | 'multimodal' | 'foundation' | 'adapter' | 'specific' | 'algorithm';

export interface ModelItem {
  id: string;
  name: string;
  version: string;
  type: 'AI' | 'Algo';
  tags: ModelCapability[];
  status: 'Prod' | 'Beta' | 'Deprecated';
  accuracy: string;
  latency: string;
  description: string;
  provider: string;
  metrics?: {
    precision: number;
    recall: number;
    f1: number;
  };
  promptConfig?: {
    template: string;
    threshold: number;
    maxMasks: number;
    mode: 'text' | 'point' | 'box';
  };
  baseModelId?: string;
}

export interface AutomationJob {
  id: string;
  name: string;
  pipelineId: string;
  pipelineName: string;
  sourceFile: string;
  startTime: string;
  duration: string;
  status: 'running' | 'completed' | 'failed' | 'queued';
  progress: number;
  priority: 'high' | 'medium' | 'low';
  stats?: { total: number; auto: number; manual: number };
  dueDate?: string;
}

export interface SourceAsset {
  id: string;
  name: string;
  sourceType: 'upload' | 's3' | 'db' | 'ftp' | 'api';
  geometry: { type: string; coordinates: any[]; center?: {x: number, y: number} };
  timestamp: string;
  ingestedAt: string;
  size: string;
  aiTags: { keywords: string[]; locationName: string[]; quality: string; cloudCover?: number };
  status: 'routed' | 'cataloged' | 'archived';
  thumbnailColor?: string;
}

export interface VersionMonitor {
  versionId: string;
  name: string;
  type: string;
  riskLevel: 'low' | 'medium' | 'high';
  overallProgress: number;
  eta: string;
  pipelines: PipelineMonitorStatus[];
}

export interface PipelineMonitorStatus {
  id: string;
  name: string;
  stage: string;
  status: 'success' | 'warning' | 'error' | 'idle';
  progress: number;
  queueSize: number;
  throughput: string;
}

export interface FlowNode {
  id: string;
  type: 'source' | 'process' | 'path_green' | 'path_red';
  label: string;
  x: number;
  y: number;
  value: number;
  status?: 'normal' | 'warning' | 'error';
  backlog?: number;
  loss?: number;
  details?: string;
  meta?: Record<string, string>;
}