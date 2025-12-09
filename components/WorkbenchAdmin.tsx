
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  MousePointer2, 
  PenTool, 
  Scissors, 
  Combine, 
  Waypoints, 
  Magnet, 
  AlertTriangle, 
  Save, 
  FileText, 
  Info, 
  Network, 
  CheckCircle2, 
  Wand2, 
  Minimize2, 
  Maximize2, 
  RotateCcw, 
  Move, 
  Plus, 
  Trash2, 
  Undo2, 
  Redo2, 
  Pentagon, 
  Layers, 
  ChevronDown, 
  Upload, 
  Sparkles, 
  Command, 
  Send,
  AlignCenter, // For Centerline
  ScanLine,    // For Scan-to-Vector
  Eye
} from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface AdminPolygon {
  id: string;
  name: string;
  points: Point[];
  fill: string;
  stroke: string;
  level: string; // 'province' | 'city' | 'district' | 'town'
  adcode: string;
  parentId: string;
}

// New Interface for Reference Data
interface ReferenceEntity {
  id: string;
  type: 'road' | 'river';
  label: string;
  points: Point[];
  color: string;
}

interface WorkbenchAdminProps {
  currentPipeline: 'admin';
  selectedTaskId: number | null;
  onSelectTask: (taskId: number | null) => void;
  onBack?: () => void;
}

// --- Helper Functions for Map Tiles ---
const TILE_SIZE = 256;
const DEFAULT_ZOOM = 15;
// Center roughly on a city area (e.g., Beijing) for demo
const CENTER_LAT = 39.9042;
const CENTER_LON = 116.4074;

const long2tile = (lon: number, zoom: number) => {
  return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
}
const lat2tile = (lat: number, zoom: number) => {
  return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
}

// Mercator Projection Helper for Importing GeoJSON
const project = (lat: number, lon: number) => {
  const siny = Math.sin((lat * Math.PI) / 180);
  const sinyClipped = Math.min(Math.max(siny, -0.9999), 0.9999);

  return {
    x: 256 * (0.5 + lon / 360) * Math.pow(2, DEFAULT_ZOOM),
    y: 256 * (0.5 - Math.log((1 + sinyClipped) / (1 - sinyClipped)) / (4 * Math.PI)) * Math.pow(2, DEFAULT_ZOOM)
  };
}

// --- Mock Data ---
const ADMIN_TASKS = [
  { 
    id: 1001, 
    title: '关于同意XX市撤销A区设立B区的批复', 
    source: '民政部公告 2025[12]号', 
    type: 'Merge',
    aiSummary: { action: '合并', objects: ['A区', 'B区'], newName: 'C区' },
    status: 'pending',
    date: '2025-01-12',
    confidence: 98,
    location: { x: 365, y: 275 }, // Centered between Poly A and B
    evidenceContent: `
      国务院关于同意设立B区北部新区的批复：
      <br/><br/>
      ...现决定将原A区东部区域划归B区管辖。
      具体调整范围为：以<span class="text-amber-600 font-bold cursor-pointer hover:bg-amber-100 px-1 rounded transition-colors border-b-2 border-amber-200" data-id="road-1">京哈高速</span>为西界，向东延伸至<span class="text-sky-600 font-bold cursor-pointer hover:bg-sky-100 px-1 rounded transition-colors border-b-2 border-sky-200" data-id="river-1">温榆河</span>中心线，北至市界...
      <br/><br/>
      调整后的B区需尽快完成行政界线勘定工作，确保无缝衔接。
    `
  },
  { 
    id: 1002, 
    title: '高新区东部边界调整通知', 
    source: '市规自委文件 [2025] 45号', 
    type: 'Reshape',
    aiSummary: { action: '边界扩展', objects: ['高新区'], ref: 'X河中心线' },
    status: 'processing',
    date: '2025-01-10',
    confidence: 65,
    location: { x: 560, y: 200 }, // Near the river
    evidenceContent: `
      关于高新区东部边界调整的通知：
      <br/><br/>
      为适应高新技术产业发展需求，现决定将高新区东部边界向东扩展。
      <br/>
      调整后边界沿<span class="text-sky-600 font-bold cursor-pointer hover:bg-sky-100 px-1 rounded transition-colors border-b-2 border-sky-200" data-id="river-1">温榆河</span>中心线向下游延伸，至入海口处止。
    `
  },
  { 
    id: 1003, 
    title: '新增街道办事处管辖范围划定', 
    source: '区政府会议纪要', 
    type: 'Split',
    aiSummary: { action: '拆分', objects: ['原城关镇'], newName: '城东街道' },
    status: 'done',
    date: '2025-01-08',
    confidence: 92,
    location: { x: 250, y: 450 }, // Below Poly A
    evidenceContent: `
      区政府常务会议纪要（摘要）：
      <br/><br/>
      会议审议通过了《关于设立城东街道办事处的请示》。
      <br/>
      同意以<span class="text-amber-600 font-bold cursor-pointer hover:bg-amber-100 px-1 rounded transition-colors border-b-2 border-amber-200" data-id="road-1">京哈高速</span>为界，将原城关镇以东区域划出，设立城东街道办事处。
    `
  }
];

const REFERENCE_ENTITIES: ReferenceEntity[] = [
  {
    id: 'road-1',
    type: 'road',
    label: '京哈高速 (G1)',
    points: [{x: 160, y: 50}, {x: 160, y: 250}, {x: 180, y: 550}],
    color: '#d97706' // amber-600
  },
  {
    id: 'river-1',
    type: 'river',
    label: '温榆河',
    points: [{x: 560, y: 80}, {x: 550, y: 300}, {x: 570, y: 550}],
    color: '#0284c7' // sky-600
  }
];

// Initial Polygons in "Screen/Local" Coordinates relative to the initial view
const INITIAL_POLYS: AdminPolygon[] = [
  { 
    id: 'poly-a', 
    name: 'A 区 (Old)', 
    points: [{x: 200, y: 150}, {x: 350, y: 150}, {x: 350, y: 400}, {x: 200, y: 400}], 
    fill: 'rgba(59, 130, 246, 0.2)', 
    stroke: '#3b82f6',
    level: 'district',
    adcode: '110105',
    parentId: 'parent-1'
  },
  { 
    id: 'poly-b', 
    name: 'B 区', 
    points: [{x: 380, y: 150}, {x: 530, y: 150}, {x: 530, y: 400}, {x: 380, y: 400}], // Gap of 30px
    fill: 'rgba(16, 185, 129, 0.2)', 
    stroke: '#10b981',
    level: 'district',
    adcode: '110108',
    parentId: 'parent-1'
  }
];

const MOCK_PARENTS = [
  { id: 'parent-1', name: '北京市 (110000)' },
  { id: 'parent-2', name: '天津市 (120000)' },
];

const WorkbenchAdmin: React.FC<WorkbenchAdminProps> = ({ selectedTaskId, onSelectTask, onBack }) => {
  // Layout State
  const [rightPanelTab, setRightPanelTab] = useState<'evidence' | 'attributes' | 'topology'>('evidence');
  
  // Map View State
  const [viewState, setViewState] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // For GeoJSON Import

  // Tool State
  const [activeTool, setActiveTool] = useState<'select' | 'draw' | 'reshape' | 'split' | 'merge' | 'trace' | 'centerline' | 'scan-vector' | 'stitch' | 'redraw' | 'import' | 'sam-wand'>('select');
  const [snapModes, setSnapModes] = useState({ road: true, river: true, admin: true });
  const [isSnapMenuOpen, setIsSnapMenuOpen] = useState(false);
  const [samPrompt, setSamPrompt] = useState('');
  
  // Data State
  const [polygons, setPolygons] = useState<AdminPolygon[]>(INITIAL_POLYS);
  const [selectedPolyIds, setSelectedPolyIds] = useState<string[]>([]);
  
  // History State
  const [history, setHistory] = useState<AdminPolygon[][]>([INITIAL_POLYS]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Interaction State
  const [dragVertex, setDragVertex] = useState<{ polyId: string, index: number } | null>(null);
  const [splitLine, setSplitLine] = useState<Point[]>([]);
  const [highlightedEntity, setHighlightedEntity] = useState<string | null>(null);
  const [traceCandidateId, setTraceCandidateId] = useState<string | null>(null);
  const [hoveredTaskId, setHoveredTaskId] = useState<number | null>(null);
  const [showStitchAlert, setShowStitchAlert] = useState(false);
  const [isStitched, setIsStitched] = useState(false);
  const [showGhostLayer, setShowGhostLayer] = useState(false);
  
  // Drawing State
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [currentMousePos, setCurrentMousePos] = useState<Point | null>(null);

  // --- Effects ---
  
  // Auto-switch to evidence tab when task is selected
  useEffect(() => {
    if (selectedTaskId) {
      setRightPanelTab('evidence');
    }
  }, [selectedTaskId]);

  const activeTask = useMemo(() => ADMIN_TASKS.find(t => t.id === selectedTaskId), [selectedTaskId]);

  // --- Map Calculation ---
  const centerTileX = useMemo(() => long2tile(CENTER_LON, DEFAULT_ZOOM), []);
  const centerTileY = useMemo(() => lat2tile(CENTER_LAT, DEFAULT_ZOOM), []);

  const getTiles = () => {
    const tiles = [];
    const radius = 2; 
    for (let x = -radius; x <= radius; x++) {
      for (let y = -radius; y <= radius; y++) {
        tiles.push({
          x: centerTileX + x,
          y: centerTileY + y,
          z: DEFAULT_ZOOM,
          style: {
            left: 400 + (x * TILE_SIZE) - (TILE_SIZE / 2),
            top: 300 + (y * TILE_SIZE) - (TILE_SIZE / 2),
            width: TILE_SIZE,
            height: TILE_SIZE,
            position: 'absolute' as 'absolute'
          }
        });
      }
    }
    return tiles;
  };

  // --- History Handlers ---
  const recordHistory = (newPolygons: AdminPolygon[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newPolygons);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setPolygons(newPolygons);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setPolygons(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPolygons(history[newIndex]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
      if (e.key === 'Escape') {
          if (activeTool === 'draw') {
              setDrawingPoints([]);
          }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, historyIndex, activeTool]);

  // --- Tool Handlers ---

  const handleToolClick = (tool: typeof activeTool) => {
    if (tool === 'import') {
        fileInputRef.current?.click();
        return;
    }

    setActiveTool(tool);
    if (tool !== 'draw') setDrawingPoints([]); 
    
    if (tool === 'redraw') {
      recordHistory(INITIAL_POLYS);
      setIsStitched(false);
      setShowStitchAlert(false);
      setSplitLine([]);
      setActiveTool('select');
    }
    
    if (tool === 'trace') {
        setTraceCandidateId(null);
    } 
    
    if (tool !== 'select' && tool !== 'merge' && tool !== 'reshape' && tool !== 'centerline') {
        setSelectedPolyIds([]);
    }
  };

  // --- GeoJSON Import Handler ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        processGeoJSON(json);
      } catch (err) {
        console.error("Invalid GeoJSON", err);
        alert("无法解析文件: 请确保是有效的 GeoJSON 格式");
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset
  };

  const processGeoJSON = (geojson: any) => {
    const features = geojson.features || (geojson.type === 'Feature' ? [geojson] : []);
    const newPolys: AdminPolygon[] = [];
    
    // World Center in Pixel Space at Zoom 15
    const centerPoint = project(CENTER_LAT, CENTER_LON); 
    // This roughly maps CENTER_LAT/LON to the SVG origin (400, 300) in our simplified view.
    
    features.forEach((f: any, i: number) => {
        if (!f.geometry) return;
        const geomType = f.geometry.type;
        const coords = f.geometry.coordinates;
        
        let rings: number[][][] = [];
        
        if (geomType === 'Polygon') {
            rings = coords;
        } else if (geomType === 'MultiPolygon') {
            rings = coords.flat();
        }
        
        rings.forEach((ring, ringIdx) => {
            // Only outer ring for simplicity
            const points = ring.map((coord: number[]) => {
                const [lon, lat] = coord;
                const px = project(lat, lon);
                return {
                    x: px.x - centerPoint.x + 400,
                    y: px.y - centerPoint.y + 300
                };
            });
            
            newPolys.push({
                id: `import-${Date.now()}-${i}-${ringIdx}`,
                name: f.properties?.name || `Imported Area ${i+1}`,
                points: points,
                fill: 'rgba(99, 102, 241, 0.2)',
                stroke: '#4f46e5',
                level: 'district',
                adcode: f.properties?.adcode || '',
                parentId: ''
            });
        });
    });
    
    if (newPolys.length > 0) {
        const updated = [...polygons, ...newPolys];
        setPolygons(updated);
        recordHistory(updated);
        setSelectedPolyIds(newPolys.map(p => p.id));
        alert(`成功导入 ${newPolys.length} 个区域多边形`);
    } else {
        alert('未找到有效的多边形数据 (Polygon/MultiPolygon)');
    }
  };

  // --- Map Interactions ---

  const toggleSnapMode = (mode: keyof typeof snapModes) => {
    setSnapModes(prev => ({ ...prev, [mode]: !prev[mode] }));
  };

  const activeSnapCount = Object.values(snapModes).filter(Boolean).length;

  const getLocalCoords = (e: React.MouseEvent) => {
    if (!mapContainerRef.current) return { x: 0, y: 0 };
    const rect = mapContainerRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    return {
      x: (rawX - viewState.x) / viewState.scale,
      y: (rawY - viewState.y) / viewState.scale
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getLocalCoords(e);

    // 0. Draw Logic (Add Point)
    if (activeTool === 'draw') {
        e.stopPropagation();
        if (drawingPoints.length >= 3) {
            const firstPt = drawingPoints[0];
            const dist = Math.hypot(firstPt.x - coords.x, firstPt.y - coords.y);
            if (dist < 15 / viewState.scale) {
                // Close polygon
                const newPoly: AdminPolygon = {
                    id: `poly-new-${Date.now()}`,
                    name: '新绘区域',
                    points: [...drawingPoints],
                    fill: 'rgba(99, 102, 241, 0.2)',
                    stroke: '#4f46e5',
                    level: 'district',
                    adcode: '',
                    parentId: ''
                };
                const newPolys = [...polygons, newPoly];
                recordHistory(newPolys);
                setDrawingPoints([]);
                setSelectedPolyIds([newPoly.id]);
                setActiveTool('select'); 
                return;
            }
        }
        setDrawingPoints(prev => [...prev, coords]);
        return; 
    }

    // 1. Reshape Logic (Vertex Dragging)
    if (activeTool === 'reshape' && selectedPolyIds.length === 1) {
      const poly = polygons.find(p => p.id === selectedPolyIds[0]);
      if (poly) {
        const hitThreshold = 10 / viewState.scale;
        const vertexIdx = poly.points.findIndex(p => Math.hypot(p.x - coords.x, p.y - coords.y) < hitThreshold);
        if (vertexIdx !== -1) {
          setDragVertex({ polyId: poly.id, index: vertexIdx });
          e.stopPropagation();
          return;
        }
      }
    }

    // 2. Trace Logic (Click to Apply)
    if (activeTool === 'trace' && traceCandidateId) {
        e.stopPropagation();
        const ref = REFERENCE_ENTITIES.find(r => r.id === traceCandidateId);
        if (ref) {
            const offset = 20 / viewState.scale;
            const forward = ref.points.map(p => ({ x: p.x, y: p.y }));
            const backward = [...ref.points].reverse().map(p => ({ x: p.x + offset, y: p.y + offset }));
            const newPoints = [...forward, ...backward];
            
            const newPoly: AdminPolygon = {
                id: `poly-trace-${Date.now()}`,
                name: `${ref.label} 边界`,
                points: newPoints,
                fill: 'rgba(99, 102, 241, 0.2)', 
                stroke: '#4f46e5', 
                level: 'district',
                adcode: '',
                parentId: ''
            };
            
            const newPolys = [...polygons, newPoly];
            recordHistory(newPolys);
            setSelectedPolyIds([newPoly.id]);
            setActiveTool('select');
            setTraceCandidateId(null);
        }
        return;
    }

    // 3. Split Logic (Start Line)
    if (activeTool === 'split') {
        setSplitLine([coords]);
        e.stopPropagation();
        return;
    }

    // 4. Pan Logic
    if (e.button === 0) {
        setIsPanning(true);
        setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const coords = getLocalCoords(e);
    
    if (activeTool === 'draw') {
        setCurrentMousePos(coords);
    }

    if (activeTool === 'trace') {
        const threshold = 30 / viewState.scale; 
        let foundRefId: string | null = null;
        
        for (const ref of REFERENCE_ENTITIES) {
            for (const p of ref.points) {
                if (Math.hypot(p.x - coords.x, p.y - coords.y) < threshold) {
                    foundRefId = ref.id;
                    break;
                }
            }
            if (foundRefId) break;
        }
        setTraceCandidateId(foundRefId);
    }

    if (dragVertex) {
      setPolygons(prev => prev.map(p => {
        if (p.id === dragVertex.polyId) {
          const newPoints = [...p.points];
          newPoints[dragVertex.index] = coords;
          return { ...p, points: newPoints };
        }
        return p;
      }));
      return;
    }

    if (activeTool === 'split' && splitLine.length > 0) {
        setSplitLine(prev => [prev[0], coords]);
    }

    if (activeTool === 'sam-wand') {
        setCurrentMousePos(coords);
    }

    if (isPanning) {
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;
      setViewState(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsPanning(false);
    
    if (dragVertex) {
      setDragVertex(null);
      recordHistory(polygons); 
      return;
    }

    if (activeTool === 'split' && splitLine.length === 2) {
        if (selectedPolyIds.length > 0) {
            const targetId = selectedPolyIds[0];
            const targetPoly = polygons.find(p => p.id === targetId);
            if (targetPoly) {
                const midX = (Math.min(...targetPoly.points.map(p => p.x)) + Math.max(...targetPoly.points.map(p => p.x))) / 2;
                
                const leftPoly: AdminPolygon = {
                    ...targetPoly,
                    id: targetPoly.id + '-L',
                    name: targetPoly.name + ' (W)',
                    points: targetPoly.points.map(p => p.x > midX ? { ...p, x: midX } : p)
                };
                const rightPoly: AdminPolygon = {
                    ...targetPoly,
                    id: targetPoly.id + '-R',
                    name: targetPoly.name + ' (E)',
                    points: targetPoly.points.map(p => p.x < midX ? { ...p, x: midX } : p)
                };
                
                const newPolys = [...polygons.filter(p => p.id !== targetId), leftPoly, rightPoly];
                recordHistory(newPolys);
                setSelectedPolyIds([leftPoly.id, rightPoly.id]);
            }
        }
        setSplitLine([]);
    }
  };

  const handlePolygonClick = (e: React.MouseEvent, polyId: string) => {
    if (activeTool === 'draw') return; 
    e.stopPropagation();
    
    if (activeTool === 'select' || activeTool === 'reshape' || activeTool === 'split' || activeTool === 'centerline') {
        setSelectedPolyIds([polyId]);
    } else if (activeTool === 'merge') {
        if (selectedPolyIds.length < 2) {
            if (selectedPolyIds.includes(polyId)) {
                setSelectedPolyIds(prev => prev.filter(id => id !== polyId));
            } else {
                setSelectedPolyIds(prev => [...prev, polyId]);
            }
        }
    }
  };

  // Perform Merge
  const executeMerge = () => {
      if (selectedPolyIds.length < 2) return;
      
      const p1 = polygons.find(p => p.id === selectedPolyIds[0])!;
      const p2 = polygons.find(p => p.id === selectedPolyIds[1])!;
      
      const allPoints = [...p1.points, ...p2.points];
      const minX = Math.min(...allPoints.map(p => p.x));
      const maxX = Math.max(...allPoints.map(p => p.x));
      const minY = Math.min(...allPoints.map(p => p.y));
      const maxY = Math.max(...allPoints.map(p => p.y));
      
      const mergedPoly: AdminPolygon = {
          id: 'poly-merged-' + Date.now(),
          name: 'Merged Zone',
          points: [{x: minX, y: minY}, {x: maxX, y: minY}, {x: maxX, y: maxY}, {x: minX, y: maxY}],
          fill: p1.fill,
          stroke: p1.stroke,
          level: 'district',
          adcode: '',
          parentId: ''
      };
      
      const newPolys = [...polygons.filter(p => !selectedPolyIds.includes(p.id)), mergedPoly];
      recordHistory(newPolys);
      setSelectedPolyIds([mergedPoly.id]);
      setActiveTool('select');
  };

  const handleAttributeChange = (id: string, field: keyof AdminPolygon, value: string) => {
    setPolygons(prev => prev.map(p => {
        if (p.id === id) {
            return { ...p, [field]: value };
        }
        return p;
    }));
  };

  const handleAutoStitch = () => {
      setIsStitched(true);
      setShowStitchAlert(false);
      const newPolys = polygons.map(p => 
          p.id === 'poly-b' 
          ? { ...p, points: p.points.map(pt => pt.x === 380 ? { ...pt, x: 350 } : pt) } 
          : p
      );
      recordHistory(newPolys);
  };

  const handleZoom = (delta: number) => {
      setViewState(prev => ({ ...prev, scale: Math.max(0.5, Math.min(5, prev.scale + delta)) }));
  };

  const handleEvidenceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const id = target.getAttribute('data-id');
    if (id) {
        setHighlightedEntity(prev => prev === id ? null : id);
    } else {
        setHighlightedEntity(null);
    }
  };

  // Determine placeholder based on context
  const promptPlaceholder = useMemo(() => {
      if (selectedPolyIds.length > 0) {
          const names = polygons.filter(p => selectedPolyIds.includes(p.id)).map(p => p.name).join(', ');
          return `针对 ${names} 执行指令...`;
      }
      return "输入提示词，例如：提取所有蓝色屋顶的工棚...";
  }, [selectedPolyIds, polygons]);

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Hidden File Input for Import */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json, .geojson"
        className="hidden"
      />

      {/* Header */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
        <div className="flex items-center">
           <button onClick={onBack} className="mr-3 p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors">
             <ArrowLeft size={18} />
           </button>
           <div>
             <h1 className="text-base font-bold text-slate-900 flex items-center">
               行政区划作业台
               <span className="ml-2 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded border border-indigo-100 font-medium">
                 Admin Studio
               </span>
             </h1>
           </div>
        </div>
        <div className="flex items-center space-x-3">
           <div className="flex items-center text-xs text-slate-500 mr-4 space-x-4">
              <span className={`flex items-center transition-colors ${activeSnapCount > 0 ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
                  <Magnet size={12} className="mr-1"/> 吸附: {activeSnapCount > 0 ? `${activeSnapCount}项` : 'OFF'}
              </span>
              <span className="flex items-center"><Network size={12} className="mr-1"/> 拓扑: 实时检查</span>
           </div>
           <div className="flex bg-slate-100 p-1 rounded-lg mr-2">
              <button 
                onClick={handleUndo} 
                disabled={historyIndex <= 0}
                className={`p-1.5 rounded-md transition-colors ${historyIndex > 0 ? 'hover:bg-white hover:text-slate-700 text-slate-500' : 'text-slate-300 cursor-not-allowed'}`}
                title="撤销 (Ctrl+Z)"
              >
                <Undo2 size={16} />
              </button>
              <button 
                onClick={handleRedo} 
                disabled={historyIndex >= history.length - 1}
                className={`p-1.5 rounded-md transition-colors ${historyIndex < history.length - 1 ? 'hover:bg-white hover:text-slate-700 text-slate-500' : 'text-slate-300 cursor-not-allowed'}`}
                title="重做 (Ctrl+Y)"
              >
                <Redo2 size={16} />
              </button>
           </div>
           <button className="px-4 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 font-medium shadow-sm flex items-center transition-colors">
             <Save size={16} className="mr-1.5" /> 提交变更
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Task/Clue List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col z-10">
           <div className="p-4 border-b border-gray-100 flex flex-col space-y-3 bg-slate-50/50">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">线索任务队列</h2>
              <div className="relative">
                 <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input type="text" placeholder="搜索公告或公文..." className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:border-indigo-500 outline-none" />
              </div>
           </div>
           <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/30">
              {ADMIN_TASKS.map(task => (
                 <div 
                    key={task.id}
                    onClick={() => onSelectTask(task.id)}
                    onMouseEnter={() => setHoveredTaskId(task.id)}
                    onMouseLeave={() => setHoveredTaskId(null)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md group relative ${
                       selectedTaskId === task.id ? 'bg-white border-indigo-500 ring-1 ring-indigo-500 shadow-sm' : 'bg-white border-gray-200 hover:border-indigo-300'
                    }`}
                 >
                    {/* Confidence Score Badge */}
                    <div className={`absolute top-3 right-3 text-[10px] font-bold px-1.5 py-0.5 rounded border shadow-sm ${
                        task.confidence >= 90 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        task.confidence >= 60 ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                        {task.confidence}% High
                    </div>

                    <div className="flex justify-between items-start mb-2 pr-12">
                       <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                          task.type === 'Merge' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                          task.type === 'Split' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                          'bg-blue-50 text-blue-700 border-blue-100'
                       }`}>{task.type}</span>
                    </div>
                    <h3 className={`text-sm font-bold mb-2 leading-snug ${selectedTaskId === task.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                       {task.title}
                    </h3>
                    {/* AI Summary Block */}
                    <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 text-xs space-y-1 group-hover:bg-white group-hover:border-indigo-100 transition-colors">
                       <div className="flex items-center text-slate-600">
                          <Wand2 size={10} className="mr-1.5 text-indigo-500"/>
                          <span className="font-bold mr-1">AI 摘要:</span>
                          {task.aiSummary.action}
                       </div>
                       <div className="pl-4 text-slate-500">
                          对象: {task.aiSummary.objects.join(', ')}
                          {task.aiSummary.newName && <span className="ml-1">→ {task.aiSummary.newName}</span>}
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Center Column: Map Canvas */}
        <div className="flex-1 relative bg-slate-200 overflow-hidden">
           
           {/* Floating Toolbar */}
           <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 p-1.5 flex items-center space-x-1 z-30">
              {[
                 { id: 'select', icon: MousePointer2, label: '选择' },
                 { id: 'sam-wand', icon: Sparkles, label: '智绘魔棒 (SAM)', special: true }, // NEW
                 { id: 'draw', icon: Pentagon, label: '绘制 (Draw)' },
                 { id: 'centerline', icon: AlignCenter, label: '提取中线 (Centerline)', admin: true }, // NEW
                 { id: 'scan-vector', icon: ScanLine, label: '红图吸附 (Scan)', admin: true }, // NEW
                 { id: 'reshape', icon: PenTool, label: '修边 (Reshape)' },
                 { id: 'split', icon: Scissors, label: '拆分 (Split)' },
                 { id: 'merge', icon: Combine, label: '合并 (Merge)' },
                 { separator: true },
                 { id: 'snap', icon: Magnet, label: '吸附 (Snap)', custom: true },
                 { id: 'trace', icon: Waypoints, label: '智能追踪 (Trace)' },
                 { id: 'stitch', icon: Network, label: '缝合 (Stitch)' },
                 { separator: true },
                 { id: 'redraw', icon: RotateCcw, label: '重绘 (Redraw)' },
              ].map((tool, idx) => {
                 if (tool.separator) {
                    return <div key={`sep-${idx}`} className="w-px h-6 bg-gray-200 mx-2"></div>;
                 }
                 
                 // Custom rendering for Snap tool
                 if (tool.id === 'snap') {
                     return (
                        <div key={tool.id} className="relative">
                            <button
                                onClick={() => setIsSnapMenuOpen(!isSnapMenuOpen)}
                                className={`flex flex-col items-center justify-center w-14 h-12 rounded-lg transition-all group relative ${
                                    activeSnapCount > 0 
                                    ? 'bg-indigo-50 text-indigo-600 font-medium' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                                title={tool.label}
                            >
                                {/* @ts-ignore */}
                                <tool.icon size={20} className="mb-1" />
                                <span className="text-[9px]">{tool.label?.split(' ')[0]}</span>
                                {activeSnapCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full border border-white"></span>}
                            </button>
                            
                            {/* Snap Settings Popup */}
                            {isSnapMenuOpen && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-2 w-36 flex flex-col gap-1 z-40 animate-in fade-in zoom-in-95 duration-100">
                                    <div className="flex justify-between items-center px-2 pb-2 border-b border-gray-100 mb-1">
                                        <span className="text-[10px] font-bold text-slate-400">吸附目标</span>
                                        <button onClick={() => setIsSnapMenuOpen(false)} className="text-slate-300 hover:text-slate-500"><Minimize2 size={10}/></button>
                                    </div>
                                    {[
                                        { key: 'road', label: '路网 (Road)' },
                                        { key: 'river', label: '水系 (River)' },
                                        { key: 'admin', label: '行政界 (Admin)' }
                                    ].map(opt => (
                                        <button
                                            key={opt.key}
                                            onClick={() => toggleSnapMode(opt.key as any)}
                                            className={`flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${
                                                snapModes[opt.key as keyof typeof snapModes] 
                                                ? 'bg-indigo-50 text-indigo-700 font-bold' 
                                                : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            <span>{opt.label}</span>
                                            {snapModes[opt.key as keyof typeof snapModes] && <CheckCircle2 size={12} className="text-indigo-600"/>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                     );
                 }

                 return (
                    <button
                       key={tool.id}
                       onClick={() => handleToolClick(tool.id as any)}
                       className={`flex flex-col items-center justify-center w-14 h-12 rounded-lg transition-all group relative ${
                          activeTool === tool.id 
                          ? tool.id === 'sam-wand' ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white font-medium shadow-md' : 'bg-indigo-50 text-indigo-600 font-medium' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                       }`}
                       title={tool.label}
                    >
                       {/* @ts-ignore */}
                       <tool.icon size={20} className="mb-1" />
                       <span className="text-[9px]">{tool.label?.split(' ')[0]}</span>
                    </button>
                 );
              })}
           </div>

           {/* Zoom Controls */}
           <div className="absolute top-4 right-4 z-30 flex flex-col space-y-2">
                <button onClick={() => handleZoom(0.2)} className="p-2 bg-white rounded-lg shadow-md border border-gray-200 text-slate-600 hover:text-indigo-600"><Plus size={18}/></button>
                <button onClick={() => handleZoom(-0.2)} className="p-2 bg-white rounded-lg shadow-md border border-gray-200 text-slate-600 hover:text-indigo-600"><Minimize2 size={18}/></button>
           </div>

           {/* Prompt Bar (SAM) - NEW */}
           <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 w-[500px]">
                <div className="bg-white/90 backdrop-blur-md border border-indigo-100 rounded-full shadow-2xl flex items-center p-1.5 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-300">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                        <Sparkles size={16} className="animate-pulse" />
                    </div>
                    <input 
                        type="text" 
                        value={samPrompt}
                        onChange={(e) => setSamPrompt(e.target.value)}
                        placeholder={promptPlaceholder} 
                        className="flex-1 bg-transparent border-none outline-none px-4 text-sm text-slate-700 placeholder:text-slate-400 font-medium"
                    />
                    <div className="flex items-center space-x-1 border-l border-slate-200 pl-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="语音输入">
                            <Command size={16} />
                        </button>
                        <button className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-sm transition-colors">
                            <Send size={14} />
                        </button>
                    </div>
                </div>
                {/* Floating Suggestions - Admin Specific */}
                <div className="flex justify-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-white/80 backdrop-blur rounded-full text-[10px] text-slate-600 border border-white/50 shadow-sm cursor-pointer hover:bg-white hover:text-indigo-600 transition-colors">沿河修边 (Snap River)</span>
                    <span className="px-3 py-1 bg-white/80 backdrop-blur rounded-full text-[10px] text-slate-600 border border-white/50 shadow-sm cursor-pointer hover:bg-white hover:text-indigo-600 transition-colors">沿路修边 (Snap Road)</span>
                    <span className="px-3 py-1 bg-white/80 backdrop-blur rounded-full text-[10px] text-slate-600 border border-white/50 shadow-sm cursor-pointer hover:bg-white hover:text-indigo-600 transition-colors">填补缝隙 (Fix Gaps)</span>
                    <span className="px-3 py-1 bg-white/80 backdrop-blur rounded-full text-[10px] text-slate-600 border border-white/50 shadow-sm cursor-pointer hover:bg-white hover:text-indigo-600 transition-colors">消除重叠 (Fix Overlaps)</span>
                </div>
           </div>

           {/* Map Simulation Container */}
           <div 
             className={`absolute inset-0 ${activeTool === 'sam-wand' ? 'cursor-none' : 'cursor-default'}`}
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseMove}
             onMouseUp={handleMouseUp}
             ref={mapContainerRef}
           >
              {/* Movable Layer */}
              <div 
                style={{ 
                    transform: `translate(${viewState.x}px, ${viewState.y}px) scale(${viewState.scale})`,
                    transformOrigin: '0 0',
                    width: '100%', height: '100%'
                }}
              >
                  {/* OSM Tile Layer - Using CartoDB Light for OSM Light Style */}
                  <div className="absolute inset-[-1000px] pointer-events-none">
                      {getTiles().map((tile, i) => (
                          <img 
                            key={`${tile.x}-${tile.y}-${tile.z}`}
                            src={`https://basemaps.cartocdn.com/light_all/${tile.z}/${tile.x}/${tile.y}.png`}
                            style={tile.style}
                            alt=""
                            className="opacity-100"
                          />
                      ))}
                  </div>

                  {/* SVG Overlay */}
                  <svg width="800" height="600" viewBox="0 0 800 600" className="absolute top-[300px] left-[400px] overflow-visible" style={{ transform: 'translate(-50%, -50%)' }}>
                     
                     {/* Reference Entities Layer (Bottom) */}
                     {REFERENCE_ENTITIES.map(ref => {
                        const isHighlighted = highlightedEntity === ref.id;
                        return (
                            <g key={ref.id} className="pointer-events-none">
                                <polyline 
                                    points={ref.points.map(p => `${p.x},${p.y}`).join(' ')}
                                    fill="none"
                                    stroke={ref.color}
                                    strokeWidth={isHighlighted ? 6 : 3}
                                    strokeLinecap="round"
                                    className={`transition-all duration-300 ${isHighlighted ? 'opacity-100 filter drop-shadow-lg' : 'opacity-60'}`}
                                />
                                {isHighlighted && (
                                    <text 
                                        x={ref.points[0].x} 
                                        y={ref.points[0].y - 10} 
                                        className="text-xs font-bold fill-slate-700"
                                    >
                                        {ref.label}
                                    </text>
                                )}
                            </g>
                        )
                     })}

                     {/* Diff Overlay (Task Hover) */}
                     {hoveredTaskId && (() => {
                         const task = ADMIN_TASKS.find(t => t.id === hoveredTaskId);
                         if (!task) return null;
                         const { x, y } = task.location;
                         const diffSize = 40;
                         return (
                             <g className="pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                                 {/* "Before" Red Dashed */}
                                 <rect 
                                    x={x - diffSize} y={y - diffSize} width={diffSize * 2} height={diffSize * 2} 
                                    fill="rgba(244, 63, 94, 0.1)" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4,4"
                                    className="animate-pulse"
                                 />
                                 {/* "After" Green Fill */}
                                 <rect 
                                    x={x - diffSize + 10} y={y - diffSize + 10} width={diffSize * 2} height={diffSize * 2} 
                                    fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2"
                                 />
                                 <text x={x} y={y - diffSize - 10} textAnchor="middle" className="text-xs font-bold fill-slate-700 bg-white/80">
                                     Diff Preview
                                 </text>
                             </g>
                         );
                     })()}

                     {/* Task Markers Layer */}
                     {ADMIN_TASKS.map(task => {
                        const isSelected = selectedTaskId === task.id;
                        const color = task.type === 'Merge' ? '#a855f7' : task.type === 'Split' ? '#f97316' : '#3b82f6';
                        
                        return (
                           <g 
                              key={task.id}
                              className="cursor-pointer group"
                              onClick={(e) => {
                                 e.stopPropagation();
                                 onSelectTask(task.id);
                              }}
                              style={{ opacity: selectedTaskId && !isSelected ? 0.4 : 1 }}
                           >
                              <g transform={`translate(${task.location.x}, ${task.location.y})`}>
                                 {/* Pulse effect if selected */}
                                 {isSelected && (
                                    <circle r="16" fill={color} fillOpacity="0.3">
                                       <animate attributeName="r" from="16" to="32" dur="1.5s" repeatCount="indefinite" />
                                       <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" />
                                    </circle>
                                 )}
                                 
                                 {/* Pin Body */}
                                 <path 
                                    d="M0 0 L-10 -26 A 12 12 0 1 1 10 -26 L 0 0 Z" 
                                    fill={isSelected ? color : 'white'} 
                                    stroke={color} 
                                    strokeWidth="2"
                                    className="transition-colors duration-300 drop-shadow-sm"
                                 />
                                 <circle cy="-26" r="4" fill="white" />
                                 
                                 {/* Hover/Selected Label */}
                                 <g className={`transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                     <rect x="-40" y="-60" width="80" height="24" rx="4" fill="white" stroke={color} strokeWidth="1" />
                                     <text 
                                        y="-44" 
                                        textAnchor="middle" 
                                        className="text-[10px] font-bold fill-slate-700 pointer-events-none"
                                        dominantBaseline="middle"
                                     >
                                        {task.type}
                                     </text>
                                 </g>
                              </g>
                           </g>
                        );
                     })}

                     {/* Existing Polygons */}
                     {polygons.map(poly => {
                       const isSelected = selectedPolyIds.includes(poly.id);
                       return (
                        <g key={poly.id} onClick={(e) => handlePolygonClick(e as any, poly.id)}>
                            <polygon 
                               points={poly.points.map(p => `${p.x},${p.y}`).join(' ')}
                               fill={isSelected ? 'rgba(99, 102, 241, 0.2)' : poly.fill}
                               stroke={isSelected ? '#4f46e5' : poly.stroke}
                               strokeWidth={isSelected ? 3 : 2}
                               className="cursor-pointer hover:opacity-80 transition-all duration-200"
                            />
                            
                            {/* Reshape Handles */}
                            {isSelected && activeTool === 'reshape' && poly.points.map((p, idx) => {
                                const isDraggingThis = dragVertex?.polyId === poly.id && dragVertex?.index === idx;
                                return (
                                <circle 
                                    key={idx} 
                                    cx={p.x} cy={p.y} 
                                    r={6 / viewState.scale} // Constant screen size
                                    fill={isDraggingThis ? "#f59e0b" : "white"} 
                                    stroke={isDraggingThis ? "#b45309" : "#4f46e5"} 
                                    strokeWidth={2 / viewState.scale}
                                    className="cursor-move"
                                />
                                );
                            })}
                        </g>
                       )
                     })}

                     {/* Drawing Polygon (In Progress) */}
                     {activeTool === 'draw' && drawingPoints.length > 0 && (
                        <g>
                            <polyline 
                                points={drawingPoints.map(p => `${p.x},${p.y}`).join(' ')}
                                fill="none"
                                stroke="#4f46e5"
                                strokeWidth={2}
                            />
                            {/* Rubber band line to cursor */}
                            {currentMousePos && (
                                <line 
                                    x1={drawingPoints[drawingPoints.length - 1].x} 
                                    y1={drawingPoints[drawingPoints.length - 1].y}
                                    x2={currentMousePos.x}
                                    y2={currentMousePos.y}
                                    stroke="#4f46e5"
                                    strokeWidth={2}
                                    strokeDasharray="5,5"
                                />
                            )}
                            {/* Vertices */}
                            {drawingPoints.map((p, idx) => (
                                <circle 
                                    key={idx} 
                                    cx={p.x} cy={p.y} r={4} 
                                    fill="white" stroke="#4f46e5" strokeWidth={2}
                                />
                            ))}
                            {/* Start Point Highlight (Close Snap) */}
                            <circle 
                                cx={drawingPoints[0].x} cy={drawingPoints[0].y} r={6} 
                                fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="2,2"
                                className="animate-pulse"
                            />
                        </g>
                     )}

                     {/* Split Line Rubberband */}
                     {splitLine.length > 0 && (
                         <line 
                            x1={splitLine[0].x} y1={splitLine[0].y}
                            x2={splitLine[1]?.x || splitLine[0].x} y2={splitLine[1]?.y || splitLine[0].y}
                            stroke="#ef4444" strokeWidth={2} strokeDasharray="5,5"
                         />
                     )}

                     {/* Trace Tool: Candidate Highlight (Ghost Layer) */}
                     {activeTool === 'trace' && traceCandidateId && (
                        <g className="pointer-events-none">
                            {(() => {
                                const ref = REFERENCE_ENTITIES.find(r => r.id === traceCandidateId);
                                if (!ref) return null;
                                return (
                                    <>
                                        {/* Highlight the line itself */}
                                        <polyline 
                                            points={ref.points.map(p => `${p.x},${p.y}`).join(' ')}
                                            fill="none"
                                            stroke="#6366f1" 
                                            strokeWidth={4 / viewState.scale + 2} // Slightly thicker
                                            strokeDasharray="8,4"
                                            className="animate-pulse opacity-70"
                                        />
                                        {/* Show the 'potential' polygon outline (Buffer preview - Ghost Layer) */}
                                        <polygon 
                                            points={[
                                                ...ref.points,
                                                ...[...ref.points].reverse().map(p => ({ x: p.x + 20/viewState.scale, y: p.y + 20/viewState.scale }))
                                            ].map(p => `${p.x},${p.y}`).join(' ')}
                                            fill="rgba(99, 102, 241, 0.15)"
                                            stroke="#6366f1"
                                            strokeWidth="1"
                                            strokeDasharray="4,4"
                                            className="animate-in fade-in"
                                        />
                                        <text 
                                            x={ref.points[0].x} 
                                            y={ref.points[0].y - 15} 
                                            className="text-xs font-bold fill-indigo-600 bg-white"
                                            style={{ fontSize: 12 / viewState.scale }}
                                        >
                                            Click to Trace: {ref.label}
                                        </text>
                                    </>
                                );
                            })()}
                        </g>
                     )}

                     {/* SAM Wand Preview Effect (Simulated) */}
                     {activeTool === 'sam-wand' && currentMousePos && (
                         <g className="pointer-events-none">
                             {/* Simulated SAM Mask Preview */}
                             <circle cx={currentMousePos.x} cy={currentMousePos.y} r="30" fill="rgba(139, 92, 246, 0.3)" stroke="rgba(139, 92, 246, 0.8)" strokeWidth="2" strokeDasharray="4,4">
                                <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite"/>
                             </circle>
                             <text x={currentMousePos.x + 35} y={currentMousePos.y} className="fill-violet-600 font-bold text-xs bg-white/80 px-1">
                                 SAM 预测中...
                             </text>
                         </g>
                     )}

                     {/* Ghost Trace Layer (Static Demo - Keep if needed, but Trace Tool now handles dynamic) */}
                     {showGhostLayer && (
                        <path 
                           d="M 400 50 Q 450 300, 400 550" 
                           stroke="#6366f1" strokeWidth="2" strokeDasharray="5,5" fill="none"
                           className="animate-pulse pointer-events-none"
                        />
                     )}

                     {/* Gap Indicator */}
                     {!isStitched && polygons.some(p => p.id === 'poly-b') && (
                        <g onClick={() => setShowStitchAlert(true)} className="cursor-pointer group">
                           <rect 
                              x="350" y="150" width="30" height="250" 
                              fill="rgba(244, 63, 94, 0.1)" 
                              stroke="#f43f5e" 
                              strokeWidth="2" 
                              strokeDasharray="6,4"
                              className="animate-pulse"
                           />
                           <circle cx="365" cy="275" r="12" fill="#f43f5e" className="group-hover:scale-125 transition-transform"/>
                           <text x="385" y="280" className="text-sm fill-rose-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1 rounded shadow-sm">Gap!</text>
                        </g>
                     )}
                  </svg>
              </div>
           </div>

           {/* Stitch Alert */}
           {showStitchAlert && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl border border-rose-100 p-4 w-72 animate-in zoom-in-95 z-40">
                 <div className="flex items-start mb-3">
                    <div className="p-2 bg-rose-100 rounded-lg text-rose-600 mr-3">
                       <AlertTriangle size={20} />
                    </div>
                    <div>
                       <h4 className="font-bold text-slate-800 text-sm">检测到拓扑缝隙 (Gap)</h4>
                       <p className="text-xs text-slate-500 mt-1">
                          A 区与 B 区之间存在 30px 宽度的未闭合区域。
                       </p>
                    </div>
                 </div>
                 <div className="flex space-x-2">
                    <button onClick={() => setShowStitchAlert(false)} className="flex-1 py-1.5 border border-slate-200 rounded text-xs text-slate-600 hover:bg-slate-50">忽略</button>
                    <button onClick={handleAutoStitch} className="flex-1 py-1.5 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 shadow-sm flex items-center justify-center">
                       <Wand2 size={12} className="mr-1.5"/> 自动缝合
                    </button>
                 </div>
              </div>
           )}

           {/* Status Bar */}
           <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-xs font-mono text-slate-500 pointer-events-none z-30">
              Scale: {viewState.scale.toFixed(2)} | X: {viewState.x.toFixed(0)} | Y: {viewState.y.toFixed(0)} | <span className="text-indigo-600 font-bold">{activeTool.toUpperCase()}</span>
           </div>
        </div>

        {/* Right Column: Context Panel (Same as before) */}
        <div className="w-[360px] bg-white border-l border-gray-200 flex flex-col z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.01)]">
           <div className="flex border-b border-gray-100">
              {[
                 { id: 'evidence', label: '线索依据', icon: FileText },
                 { id: 'attributes', label: '属性编辑', icon: Info },
                 { id: 'topology', label: '拓扑检查', icon: Network },
              ].map(tab => (
                 <button
                    key={tab.id}
                    onClick={() => setRightPanelTab(tab.id as any)}
                    className={`flex-1 py-3 text-xs font-bold flex items-center justify-center transition-colors border-b-2 ${
                       rightPanelTab === tab.id 
                       ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' 
                       : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                 >
                    <tab.icon size={14} className="mr-1.5" />
                    {tab.label}
                 </button>
              ))}
           </div>

           <div className="flex-1 overflow-y-auto bg-slate-50/50 p-5">
              {rightPanelTab === 'evidence' && (
                 <div className="space-y-4">
                    {activeTask ? (
                        <>
                            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-xs text-indigo-800 flex items-start">
                               <Info size={14} className="mr-2 mt-0.5 shrink-0" />
                               <p>系统已自动识别文中地理实体。点击高亮关键词可在地图上定位。</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                               <h3 className="font-bold text-slate-800 text-sm mb-4 border-b border-gray-100 pb-2">
                                   {activeTask.source}
                               </h3>
                               <div 
                                  className="text-sm text-slate-600 leading-7 font-serif select-text"
                                  dangerouslySetInnerHTML={{ __html: activeTask.evidenceContent }} 
                                  onClick={handleEvidenceClick}
                               />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10">
                            <FileText size={48} className="mb-4 opacity-20" />
                            <p className="text-sm">请在左侧列表选择一个任务</p>
                            <p className="text-xs mt-1">查看详细的公文依据与 AI 分析</p>
                        </div>
                    )}
                 </div>
              )}
              {rightPanelTab === 'attributes' && (
                 <div className="space-y-6">
                    {selectedPolyIds.length === 1 ? (
                        (() => {
                            const poly = polygons.find(p => p.id === selectedPolyIds[0]);
                            if (!poly) return null;
                            
                            const isGeometryValid = poly.parentId === 'parent-1'; // Mock validation

                            return (
                                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-5 animate-in slide-in-from-right-2">
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                        <h3 className="font-bold text-slate-800 text-sm">基本属性</h3>
                                        <span className="text-[10px] font-mono text-slate-400">ID: {poly.id}</span>
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5">行政区名称</label>
                                        <input 
                                            type="text" 
                                            value={poly.name}
                                            onChange={(e) => handleAttributeChange(poly.id, 'name', e.target.value)}
                                            className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors"
                                        />
                                    </div>

                                    {/* Adcode & Level */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1.5">行政代码 (6位)</label>
                                            <input 
                                                type="text" 
                                                value={poly.adcode}
                                                maxLength={6}
                                                onChange={(e) => handleAttributeChange(poly.id, 'adcode', e.target.value)}
                                                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1.5">行政级别</label>
                                            <select 
                                                value={poly.level}
                                                onChange={(e) => handleAttributeChange(poly.id, 'level', e.target.value)}
                                                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors"
                                            >
                                                <option value="province">省 / 直辖市</option>
                                                <option value="city">地级市</option>
                                                <option value="district">区 / 县</option>
                                                <option value="town">乡 / 镇</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Parent Cascade Check */}
                                    <div className="bg-indigo-50/50 rounded-lg p-4 border border-indigo-100 space-y-3">
                                        <div>
                                            <label className="block text-xs font-bold text-indigo-900 mb-1.5 flex items-center">
                                                <Layers size={12} className="mr-1.5"/> 所属父级行政区
                                            </label>
                                            <select 
                                                value={poly.parentId}
                                                onChange={(e) => handleAttributeChange(poly.id, 'parentId', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors text-indigo-900"
                                            >
                                                <option value="">-- 请选择 --</option>
                                                {MOCK_PARENTS.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        {/* Validation Result */}
                                        {poly.parentId && (
                                            <div className={`flex items-start p-2 rounded text-xs ${isGeometryValid ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                                {isGeometryValid ? <CheckCircle2 size={14} className="mr-2 mt-0.5 shrink-0"/> : <AlertTriangle size={14} className="mr-2 mt-0.5 shrink-0"/>}
                                                <div>
                                                    <div className="font-bold">{isGeometryValid ? '几何校验通过' : '空间拓扑冲突'}</div>
                                                    <div className="opacity-80 mt-0.5 scale-90 origin-top-left">
                                                        {isGeometryValid ? '当前多边形完全包含于父级范围内。' : '当前多边形超出父级行政区边界。'}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })()
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <MousePointer2 size={32} className="opacity-50"/>
                            </div>
                            <p className="text-sm font-medium">请在地图上选择一个多边形</p>
                            <p className="text-xs mt-1">以查看和编辑属性详情</p>
                        </div>
                    )}
                 </div>
              )}
              {rightPanelTab === 'topology' && (
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                       <div>
                          <div className="text-xs text-slate-500">拓扑健康度</div>
                          <div className={`text-xl font-bold ${isStitched ? 'text-emerald-600' : 'text-rose-600'}`}>
                             {isStitched ? '100%' : '85%'}
                          </div>
                       </div>
                       <div className={`p-2 rounded-full ${isStitched ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                          {isStitched ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                       </div>
                    </div>
                    {/* Issues List */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                       <div className="px-4 py-3 border-b border-gray-100 bg-slate-50/50 text-xs font-bold text-slate-500 uppercase">
                          问题列表 (Issues)
                       </div>
                       {!isStitched ? (
                          <div className="divide-y divide-gray-100">
                             <div className="p-3 hover:bg-rose-50 cursor-pointer transition-colors group" onClick={() => setShowStitchAlert(true)}>
                                <div className="flex justify-between items-center mb-1">
                                   <span className="text-xs font-bold text-rose-600 flex items-center">
                                      <Minimize2 size={12} className="mr-1"/> Gap (缝隙)
                                   </span>
                                   <span className="text-[10px] text-slate-400 bg-white border px-1.5 rounded">High</span>
                                </div>
                                <div className="text-xs text-slate-600">Between A and B</div>
                             </div>
                          </div>
                       ) : (
                          <div className="p-8 text-center text-slate-400 text-xs">暂无拓扑错误</div>
                       )}
                    </div>
                 </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default WorkbenchAdmin;
