
import { 
  RoutingRule, 
  DispatchLog, 
  PipelineDef, 
  Feature, 
  SourceFile, 
  ModelItem, 
  AutomationJob, 
  SourceAsset, 
  VersionMonitor, 
  PipelineMonitorStatus, 
  FlowNode 
} from './types';

// --- Evaluation Center Data ---

export const EVAL_HISTORY_TREND = [
  { version: 'v1.0', quality: 82, regression: 5, accuracy: 80, performance: 75 },
  { version: 'v1.1', quality: 85, regression: 4, accuracy: 83, performance: 78 },
  { version: 'v1.2', quality: 84, regression: 6, accuracy: 82, performance: 76 },
  { version: 'v1.3', quality: 88, regression: 3, accuracy: 86, performance: 80 },
  { version: 'v1.4', quality: 89, regression: 2, accuracy: 88, performance: 82 },
  { version: 'v1.5', quality: 92, regression: 1, accuracy: 90, performance: 85 },
  { version: 'v1.6', quality: 91, regression: 2, accuracy: 89, performance: 84 },
  { version: 'v1.7', quality: 94, regression: 1, accuracy: 92, performance: 88 },
  { version: 'v1.8', quality: 95, regression: 0.5, accuracy: 94, performance: 90 },
  { version: 'v2.0-rc', quality: 88, regression: 7.0, accuracy: 85, performance: 82 }, 
];

export const EVAL_TASKS = [
  { id: 'ET-2024-082', submitter: 'Auto_CI', version: 'v2.0.0-rc', baseline: 'v1.9.5', type: 'Full Regression', status: 'running', duration: '45m', progress: 68 },
  { id: 'ET-2024-081', submitter: 'Jane Doe', version: 'v1.9.5-hotfix', baseline: 'v1.9.5', type: 'Sanity Check', status: 'passed', duration: '12m', progress: 100 },
  { id: 'ET-2024-080', submitter: 'System', version: 'v1.9.0', baseline: 'v1.8.5', type: 'Full Regression', status: 'passed', duration: '2h 10m', progress: 100 },
  { id: 'ET-2024-079', submitter: 'John Smith', version: 'v2.0.0-beta', baseline: 'v1.9.0', type: 'Adversarial', status: 'failed', duration: '30m', progress: 100 },
];

export const CHART_DATA = [
  { time: '00:00', ingestion: 120, completion: 110 },
  { time: '04:00', ingestion: 132, completion: 125 },
  { time: '08:00', ingestion: 101, completion: 98 },
  { time: '12:00', ingestion: 134, completion: 128 },
  { time: '16:00', ingestion: 90, completion: 95 },
  { time: '20:00', ingestion: 230, completion: 210 },
  { time: '23:59', ingestion: 210, completion: 200 },
];

export const PIPELINES: PipelineDef[] = [
  { id: 'poi', name: 'POI 兴趣点', iconName: 'MapPin', status: 'active', subPipelines: [{id: 'poi-ingest', name: 'POI Ingestion', nodes: []}, {id: 'poi-qa', name: 'POI QA', nodes: []}] },
  { id: 'road', name: '路网数据', iconName: 'GitFork', status: 'active', subPipelines: [{id: 'road-main', name: 'Road Extraction', nodes: []}] },
  { id: 'admin', name: '行政区划', iconName: 'Landmark', status: 'active', subPipelines: [{id: 'admin-ingest', name: 'Admin Ingestion', nodes: []}] },
  { id: 'hydro', name: '水系植被', iconName: 'Trees', status: 'active', subPipelines: [{id: 'hydro-change', name: 'Change Detection', nodes: []}] },
  { id: 'address', name: '标准地址', iconName: 'Mail', status: 'active', subPipelines: [{id: 'addr-std', name: 'Standardization', nodes: []}] },
];

export const INITIAL_PIPELINE_DEFS = PIPELINES;

export const TASKS = [
  { id: 101, type: 'poi', sourceId: 'src-001', title: 'New Coffee Shop', reason: 'Detected signboard match', status: 'auto', confidence: 98, coords: {x: 30, y: 40} },
  { id: 102, type: 'poi', sourceId: 'src-001', title: 'Closed Restaurant', reason: 'Status change', status: 'review', confidence: 65, coords: {x: 60, y: 20} },
  { id: 103, type: 'road', sourceId: 'src-002', title: 'New Lane', reason: 'Road marking detection', status: 'auto', confidence: 92, coords: {x: 45, y: 55} },
  { id: 104, type: 'admin', sourceId: 'src-003', title: 'Boundary Shift', reason: 'Gov doc alignment', status: 'review', confidence: 78, coords: {x: 20, y: 30} },
  { id: 105, type: 'address', sourceId: 'src-004', title: 'Address Standardization', reason: 'Format mismatch', status: 'review', confidence: 85, coords: {x: 50, y: 50} },
];

export const SOURCE_FILES: SourceFile[] = [
  { id: 'src-001', name: 'Street_View_Batch_20231025.jpg', type: 'image', date: '2023-10-25', size: '24MB', aiTags: ['POI', 'Signage'], usedBy: ['poi'], status: 'routed', routeTarget: 'POI Pipeline' },
  { id: 'src-002', name: 'City_Ortho_Map.tiff', type: 'image', date: '2023-10-26', size: '1.2GB', aiTags: ['Road', 'Building'], usedBy: ['road', 'hydro'], status: 'routed', routeTarget: 'Road Pipeline' },
  { id: 'src-003', name: 'Gov_Notice_2024.pdf', type: 'text', date: '2023-10-27', size: '4.5MB', aiTags: ['Admin', 'Text'], usedBy: ['admin'], status: 'processing', description: 'Admin boundary update' },
  { id: 'src-004', name: 'Address_Db_Dump.csv', type: 'db', date: '2023-10-28', size: '450MB', aiTags: ['Address'], usedBy: ['address'], status: 'routed', routeTarget: 'Address Pipeline' },
];

export const MOCK_FEATURES: Record<number, Feature[]> = {
  101: [{ id: 1, properties: { name: 'Starbucks', type: 'Cafe' }, status: 'ai_generated', aiConfidence: 0.98, issues: [] }],
  102: [{ id: 2, properties: { name: 'Old Diner', status: 'Closed' }, status: 'human_reviewing', aiConfidence: 0.65, issues: [] }],
  104: [{ id: 4, properties: { name: 'District A', area: '12km2' }, status: 'ai_generated', aiConfidence: 0.78, issues: ['topology_error'] }],
  105: [{ id: 5, properties: { address: '123 Main St' }, status: 'human_reviewing', aiConfidence: 0.85, issues: [] }],
};

export const AUTOMATION_JOBS: AutomationJob[] = [
  { id: 'job-101', name: 'Daily POI Update', pipelineId: 'poi', pipelineName: 'POI Production', sourceFile: 'src-001', startTime: '10:00 AM', duration: '45m', status: 'completed', progress: 100, priority: 'high', stats: {total: 500, auto: 480, manual: 20}, dueDate: '2023-11-15' },
  { id: 'job-102', name: 'Road Network Refresh', pipelineId: 'road', pipelineName: 'Road Production', sourceFile: 'src-002', startTime: '11:00 AM', duration: '30m', status: 'running', progress: 60, priority: 'medium', stats: {total: 1200, auto: 1000, manual: 200}, dueDate: '2023-11-20' },
  { id: 'job-103', name: 'Admin Boundary Check', pipelineId: 'admin', pipelineName: 'Admin Production', sourceFile: 'src-003', startTime: '09:00 AM', duration: '1h', status: 'failed', progress: 20, priority: 'high', stats: {total: 50, auto: 10, manual: 40}, dueDate: '2023-11-10' },
];

export const INGESTION_LOGS = [
  { id: 'log-1', source: 'S3_Bucket_Image_001.jpg', time: '10:01:23', action: 'Image Tagging', target: 'POI Pipeline' },
  { id: 'log-2', source: 'API_Request_Payload.json', time: '10:01:25', action: 'Schema Validation', target: 'Address Pipeline' },
  { id: 'log-3', source: 'Upload_Doc_Report.pdf', time: '10:02:00', action: 'OCR Extraction', target: 'Admin Pipeline' },
];

export const ROUTING_RULES: RoutingRule[] = [
  { id: 'rule-1', name: 'High Conf POI', conditionDescription: 'Confidence > 90%', targetPipelineId: 'poi', targetPipelineName: 'POI Pipeline', active: true, mode: 'auto', priority: 'high', weight: 80 },
  { id: 'rule-2', name: 'Road Construction', conditionDescription: 'Keyword match "Construction"', targetPipelineId: 'road', targetPipelineName: 'Road Pipeline', active: true, mode: 'manual', priority: 'medium', weight: 50 },
  { id: 'rule-3', name: 'OCR 文本识别', conditionDescription: '文件类型为 PDF 且包含 OCR 关键字', targetPipelineId: 'admin', targetPipelineName: '行政区划', active: true, mode: 'auto', priority: 'high', weight: 85 },
];

export const MODELS: ModelItem[] = [
  { 
    id: 'sam-2-huge', 
    name: 'SAM 2 (Huge)', 
    version: '2.0', 
    type: 'AI', 
    tags: ['foundation', 'image', 'video'], 
    status: 'Prod', 
    accuracy: 'SOTA', 
    latency: '4x A100', // Replaced simple latency with Resource info for Foundation models conceptually
    description: 'Segment Anything Model 2. Supports image and video segmentation with zero-shot capabilities.', 
    provider: 'Meta AI',
    metrics: { precision: 0.98, recall: 0.97, f1: 0.975 }
  },
  { 
    id: 'solar-adapter-v1', 
    name: 'Solar Panel Extractor', 
    version: 'v1.0-adapter', 
    type: 'AI', 
    tags: ['adapter', 'image'], 
    status: 'Beta', 
    accuracy: 'AP 85%', 
    latency: 'Low', 
    description: 'Specialized adapter for extracting solar panels from satellite imagery. Powered by SAM 2.', 
    provider: 'Internal',
    baseModelId: 'sam-2-huge',
    promptConfig: {
        template: 'blue rectangular solar panels',
        threshold: 0.7,
        maxMasks: 100,
        mode: 'text'
    },
    metrics: { precision: 0.88, recall: 0.85, f1: 0.86 }
  },
  { 
    id: 'm1', 
    name: 'POI Detector v2', 
    version: '2.0.1', 
    type: 'AI', 
    tags: ['specific', 'image'], 
    status: 'Prod', 
    accuracy: '95%', 
    latency: '50ms', 
    description: 'Detects storefronts and signs.', 
    provider: 'Internal',
    metrics: { precision: 0.96, recall: 0.94, f1: 0.95 }
  },
  { 
    id: 'm2', 
    name: 'Road Segmentation', 
    version: '1.5.0', 
    type: 'AI', 
    tags: ['specific', 'image'], 
    status: 'Beta', 
    accuracy: '88%', 
    latency: '120ms', 
    description: 'Segments road surfaces.', 
    provider: 'Internal',
    metrics: { precision: 0.89, recall: 0.85, f1: 0.87 }
  },
  { 
    id: 'm3', 
    name: 'Address Parser', 
    version: '3.1.0', 
    type: 'Algo', 
    tags: ['algorithm', 'text'], 
    status: 'Prod', 
    accuracy: '99%', 
    latency: '10ms', 
    description: 'Standardizes address strings.', 
    provider: 'Internal',
    metrics: { precision: 0.99, recall: 0.98, f1: 0.99 }
  },
];

export const VERSIONS = [
  { id: 'v2.0.0', status: 'Live', message: 'Major release with new road features.', author: 'System', date: '2023-11-01', qaScore: 98 },
  { id: 'v1.9.5', status: 'Ready', message: 'POI hotfixes.', author: 'Jane Doe', date: '2023-10-25', qaScore: 95 },
  { id: 'v1.9.0', status: 'Archived', message: 'Initial Q4 release.', author: 'John Smith', date: '2023-10-01', qaScore: 92 },
];

export const SOURCE_ASSETS: SourceAsset[] = [
  { id: 'asset-1', name: 'Sat_Image_Region_A.tiff', sourceType: 's3', geometry: { type: 'Point', coordinates: [], center: {x: 20, y: 30} }, timestamp: '2023-11-02', ingestedAt: '2023-11-02 10:00', size: '500 MB', aiTags: { keywords: ['Urban', 'Road'], locationName: ['Region A'], quality: 'High', cloudCover: 5 }, status: 'cataloged', thumbnailColor: '#cbd5e1' },
  { id: 'asset-2', name: 'POIs_Downtown.csv', sourceType: 'upload', geometry: { type: 'Point', coordinates: [], center: {x: 50, y: 50} }, timestamp: '2023-11-03', ingestedAt: '2023-11-03 09:30', size: '5 MB', aiTags: { keywords: ['Shops'], locationName: ['Downtown'], quality: 'High' }, status: 'routed', thumbnailColor: '#93c5fd' },
];

export const INGESTION_TASKS = [
  { id: 'task-1', name: 'Daily Sat Feed', sourceType: 'S3', status: 'active', filesSynced: 120 },
  { id: 'task-2', name: 'Gov Data Sync', sourceType: 'DB', status: 'active', filesSynced: 45 },
  { id: 'task-3', name: 'Partner FTP', sourceType: 'Server', status: 'active', filesSynced: 12 },
];

export const VERSION_MONITORS: VersionMonitor[] = [
  { 
    versionId: 'v2.1-beta', name: 'Q4 Iteration', type: 'Release', riskLevel: 'low', overallProgress: 75, eta: '2d',
    pipelines: [
      { id: 'road', name: 'Road', stage: 'QA', status: 'success', progress: 80, queueSize: 12, throughput: '50/h' },
      { id: 'poi', name: 'POI', stage: 'Processing', status: 'warning', progress: 60, queueSize: 150, throughput: '120/h' },
    ]
  },
  { 
    versionId: 'v2.0-hotfix', name: 'Emergency Fix', type: 'Hotfix', riskLevel: 'high', overallProgress: 90, eta: '4h',
    pipelines: [
      { id: 'admin', name: 'Admin', stage: 'Review', status: 'error', progress: 90, queueSize: 5, throughput: '10/h' },
    ]
  }
];

export const FLOW_NODES: FlowNode[] = [
  { id: 'n1', type: 'source', label: 'Ingestion (S3)', x: 50, y: 200, value: 5000 },
  { id: 'n2', type: 'process', label: 'AI Pre-process', x: 250, y: 200, value: 4950, loss: 50 },
  { id: 'n3', type: 'path_green', label: 'Auto Label', x: 550, y: 130, value: 4000 },
  { id: 'n4', type: 'path_red', label: 'Manual Review', x: 550, y: 270, value: 950, backlog: 150 },
  { id: 'n5', type: 'process', label: 'Validation', x: 800, y: 200, value: 4900 },
];

export const QA_ISSUES = [
  { id: 'QA-001', type: 'Geometry', desc: 'Polygon self-intersection detected in Region A.', severity: 'Critical', location: 'Region A' },
  { id: 'QA-002', type: 'Attribute', desc: 'Missing mandatory field "BuildingHeight".', severity: 'High', location: 'District 4' },
  { id: 'QA-003', type: 'Logic', desc: 'Road connectivity broken at node 4521.', severity: 'Medium', location: 'Main St.' },
];

export const ADVERSARIAL_LOGS = [
  { id: 'log-adv-1', agent: 'ChaosMonkey-1', action: 'Inject Noise', result: 'Success', details: 'Added 5% noise to coords.' },
  { id: 'log-adv-2', agent: 'PathFinder-X', action: 'Route Flood', result: 'Failed', details: 'System rate limited requests.' },
];
