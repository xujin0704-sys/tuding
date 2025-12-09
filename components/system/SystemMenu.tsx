
import React, { useState } from 'react';
import { 
  ListTree, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FileText, 
  LayoutDashboard, 
  Database, 
  Workflow, 
  Map as MapIcon, 
  X,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';

interface MenuNode {
  id: string;
  label: string;
  icon?: any;
  path: string;
  type: 'group' | 'item';
  visible: boolean;
  children?: MenuNode[];
}

const INITIAL_MENU_DATA: MenuNode[] = [
  {
    id: '1',
    label: '总览',
    path: '/dashboard',
    type: 'group',
    visible: true,
    children: [
      { id: '1-1', label: '运营总览', icon: LayoutDashboard, path: '/dashboard', type: 'item', visible: true },
      { id: '1-2', label: '实时监测', icon: LayoutDashboard, path: '/monitoring', type: 'item', visible: true },
    ]
  },
  {
    id: '2',
    label: '资源',
    path: '/resources',
    type: 'group',
    visible: true,
    children: [
      { 
        id: '2-1', 
        label: '资料集市', 
        icon: Database, 
        path: '/source-hub', 
        type: 'item', 
        visible: true,
        children: [
           { id: '2-1-1', label: 'AI 智能编目', path: '/source-catalog', type: 'item', visible: true },
           { id: '2-1-2', label: '线索与路由', path: '/source-triage', type: 'item', visible: true }
        ]
      },
      { id: '2-2', label: '模型仓库', icon: Database, path: '/model-hub', type: 'item', visible: true },
      { id: '2-3', label: '标注广场', icon: Database, path: '/job-repo', type: 'item', visible: true },
    ]
  },
  {
    id: '3',
    label: '生产',
    path: '/production',
    type: 'group',
    visible: true,
    children: [
      { id: '3-1', label: '流水线任务', icon: Workflow, path: '/pipeline-center', type: 'item', visible: true },
      { 
        id: '3-2', 
        label: '作业台', 
        icon: MapIcon, 
        path: '/workbenches', 
        type: 'item', 
        visible: true,
        children: [
           { id: '3-2-1', label: '地图标注组', path: '/wb-map-group', type: 'item', visible: true },
           { id: '3-2-2', label: '地址标注组', path: '/wb-address-group', type: 'item', visible: true }
        ]
      },
    ]
  }
];

interface MenuRowProps {
  node: MenuNode;
  level?: number;
  expandedNodes: Record<string, boolean>;
  onToggle: (id: string) => void;
}

const MenuRow: React.FC<MenuRowProps> = ({ node, level = 0, expandedNodes, onToggle }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes[node.id];
  const Icon = node.icon || (hasChildren ? Folder : FileText);

  return (
    <>
      <div className="flex items-center hover:bg-slate-50 transition-colors py-3 px-4 border-b border-slate-100 group">
        <div className="flex-1 flex items-center" style={{ paddingLeft: `${level * 24}px` }}>
          <button 
            onClick={() => hasChildren && onToggle(node.id)}
            className={`mr-2 p-1 rounded hover:bg-slate-200 text-slate-400 transition-colors ${!hasChildren ? 'invisible' : ''}`}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          <div className={`p-1.5 rounded mr-3 ${node.type === 'group' ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-blue-600'}`}>
             <Icon size={16} />
          </div>
          <div>
             <div className="text-sm font-medium text-slate-800">{node.label}</div>
             <div className="text-[10px] text-slate-400 font-mono">{node.path}</div>
          </div>
        </div>
        
        <div className="w-24 text-center">
           <span className={`text-xs px-2 py-0.5 rounded ${node.type === 'group' ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-600'}`}>
              {node.type === 'group' ? '目录' : '菜单'}
           </span>
        </div>
        
        <div className="w-20 text-center">
           {node.visible ? (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">显示</span>
           ) : (
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">隐藏</span>
           )}
        </div>

        <div className="w-32 flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
              <Edit2 size={14} />
           </button>
           <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded">
              <Trash2 size={14} />
           </button>
           <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded">
              <MoreVertical size={14} />
           </button>
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map(child => (
            <MenuRow 
              key={child.id} 
              node={child} 
              level={level + 1} 
              expandedNodes={expandedNodes}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </>
  );
};

const SystemMenu: React.FC = () => {
  const [menuData, setMenuData] = useState(INITIAL_MENU_DATA);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({'1': true, '2': true, '2-1': true, '3': true, '3-2': true});
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<{
    label: string;
    path: string;
    type: 'group' | 'item';
    parentId: string;
  }>({
    label: '',
    path: '',
    type: 'item',
    parentId: 'root'
  });

  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddItem = () => {
    if (!newItem.label || !newItem.path) return;
    
    const newNode: MenuNode = {
      id: `new-${Date.now()}`,
      label: newItem.label,
      path: newItem.path,
      type: newItem.type,
      visible: true,
      children: newItem.type === 'group' ? [] : undefined
    };

    if (newItem.parentId === 'root') {
      setMenuData(prev => [...prev, newNode]);
    } else {
      // Simple recursive finder for demo (assumes 2 levels deep max for simplicity in prototype)
      const addNodeRecursive = (nodes: MenuNode[]): MenuNode[] => {
        return nodes.map(node => {
          if (node.id === newItem.parentId) {
            return { ...node, children: [...(node.children || []), newNode] };
          }
          if (node.children) {
            return { ...node, children: addNodeRecursive(node.children) };
          }
          return node;
        });
      };
      setMenuData(prev => addNodeRecursive(prev));
      setExpandedNodes(prev => ({ ...prev, [newItem.parentId]: true }));
    }
    
    setIsModalOpen(false);
    setNewItem({ label: '', path: '', type: 'item', parentId: 'root' });
  };

  // Flatten groups for parent selection
  const getGroups = (nodes: MenuNode[]): {id: string, label: string}[] => {
    let groups: {id: string, label: string}[] = [];
    nodes.forEach(node => {
      if (node.type === 'group') {
        groups.push({ id: node.id, label: node.label });
        if (node.children) {
          groups = [...groups, ...getGroups(node.children)];
        }
      }
    });
    return groups;
  };
  
  const availableGroups = getGroups(menuData);

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden animate-in fade-in relative">
       <div className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center shrink-0">
          <div>
             <h1 className="text-xl font-bold text-slate-900 flex items-center">
                <ListTree className="mr-3 text-blue-600" />
                菜单管理
             </h1>
             <p className="text-xs text-slate-500 mt-1">配置系统左侧导航菜单结构与权限。</p>
          </div>
          <div className="flex space-x-4">
             <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="搜索菜单名称..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
             </div>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm text-sm font-medium transition-colors"
             >
                <Plus size={16} className="mr-2" /> 新增菜单
             </button>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto p-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             {/* Header */}
             <div className="flex items-center py-3 px-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <div className="flex-1 pl-2">菜单名称</div>
                <div className="w-24 text-center">类型</div>
                <div className="w-20 text-center">状态</div>
                <div className="w-32 text-right pr-4">操作</div>
             </div>
             
             {/* Tree Table */}
             <div>
                {menuData.map(node => (
                   <MenuRow 
                      key={node.id} 
                      node={node} 
                      expandedNodes={expandedNodes}
                      onToggle={toggleExpand}
                   />
                ))}
             </div>
          </div>
       </div>

       {/* Add Menu Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-[500px] overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">新增菜单项</h3>
                    <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">上级菜单</label>
                        <select 
                            className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none bg-white"
                            value={newItem.parentId}
                            onChange={e => setNewItem({...newItem, parentId: e.target.value})}
                        >
                            <option value="root">顶层目录 (Root)</option>
                            {availableGroups.map(g => (
                                <option key={g.id} value={g.id}>{g.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">菜单名称</label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none" 
                                placeholder="e.g. 财务管理"
                                value={newItem.label}
                                onChange={e => setNewItem({...newItem, label: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">类型</label>
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                <button 
                                    onClick={() => setNewItem({...newItem, type: 'group'})}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${newItem.type === 'group' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
                                >
                                    目录
                                </button>
                                <button 
                                    onClick={() => setNewItem({...newItem, type: 'item'})}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${newItem.type === 'item' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
                                >
                                    页面
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">路由路径 (Path)</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none font-mono" 
                            placeholder="/system/finance"
                            value={newItem.path}
                            onChange={e => setNewItem({...newItem, path: e.target.value})}
                        />
                    </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-100">取消</button>
                    <button onClick={handleAddItem} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 shadow-sm">创建菜单</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SystemMenu;
