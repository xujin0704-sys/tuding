
export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  children?: MenuItem[];
}

export interface MenuCategory {
  category: string;
  items: MenuItem[];
}

export const MENU_CONFIG: MenuCategory[] = [
  {
    category: "总览", 
    items: [
      { id: 'dashboard', label: '运营总览', icon: 'LayoutDashboard' },
      { id: 'monitoring', label: '实时监测', icon: 'Activity' },
    ]
  },
  {
    category: "资源", 
    items: [
      { 
        id: 'source-hub', 
        label: '资料集市', 
        icon: 'Database',
        children: [
           { id: 'source-catalog', label: 'AI 智能编目' },
           { id: 'source-triage', label: '线索与路由' }
        ]
      },
      { id: 'model-hub', label: '模型仓库', icon: 'Cpu' },
      { id: 'job-repo', label: '流水线编排', icon: 'Briefcase' },
    ]
  },
  {
    category: "生产", 
    items: [
      { id: 'pipeline-center', label: '流水线任务', icon: 'Workflow' },
      { 
        id: 'workbenches', 
        label: '作业台', 
        icon: 'Map',
        children: [
          { 
            id: 'wb-map-group', 
            label: '地图标注',
            children: [
              { id: 'wb-poi', label: '兴趣点 (POI)' },
              { id: 'wb-road', label: '路网数据' },
              { id: 'wb-admin', label: '行政区划' },
              { id: 'wb-nature', label: '自然地物' },
            ]
          },
          { 
            id: 'wb-address-group', 
            label: '地址标注',
            children: [
               { id: 'wb-address', label: '标准地址库' }
            ]
          },
          { 
            id: 'wb-location-group', 
            label: '位置场景标注',
            children: [
               { id: 'wb-location-guide', label: '上门指引标注' }
            ]
          },
          { 
            id: 'wb-llm-group', 
            label: '大模型标注',
            children: [
               { id: 'wb-llm-rlhf', label: 'RLHF 反馈' }
            ]
          },
        ]
      }
    ]
  },
  {
    category: "交付与运营", 
    items: [
      { id: 'del-calendar', label: '发布日历', icon: 'Calendar' },
      { 
        id: 'del-ops', 
        label: '运营与工单', 
        icon: 'MessageSquare',
        children: [
          { id: 'del-ops-tracker', label: '问题工单池' },
          { id: 'del-ops-hotfix', label: '热修通道' }
        ]
      },
      { 
        id: 'del-releases', 
        label: '产品发版', 
        icon: 'Package',
        children: [
          { id: 'del-prod-releases', label: '发版组装台' }
        ]
      },
      { id: 'del-comp-snapshots', label: '组件版本库', icon: 'Layers' },
      { 
        id: 'del-eval-center', 
        label: '评测中心', 
        icon: 'FlaskConical'
      }
    ]
  },
  {
    category: "系统",
    items: [
      { 
        id: 'sys-org', 
        label: '组织与权限', 
        icon: 'Users',
        children: [
          { id: 'sys-users', label: '用户管理' },
          { id: 'sys-roles', label: '角色与RBAC' },
          { id: 'sys-data-scope', label: '数据空间权限' }
        ]
      },
      { 
        id: 'sys-compute-group', 
        label: '算力与资源', 
        icon: 'Cpu',
        children: [
          { id: 'sys-quota', label: '配额管理' },
          { id: 'sys-compute-monitor', label: '推理节点监控' }
        ]
      },
      { 
        id: 'sys-security-group', 
        label: '安全与合规', 
        icon: 'ShieldAlert',
        children: [
          { id: 'sys-geo-fence', label: '敏感区域管理' },
          { id: 'sys-encryption', label: '坐标系与加密' },
          { id: 'sys-audit-export', label: '导出审计' }
        ]
      },
      { 
        id: 'sys-finops-group', 
        label: '成本管理', 
        icon: 'Coins',
        children: [
          { id: 'sys-cost', label: '成本账单' },
          { id: 'sys-pricing', label: '计费策略' }
        ]
      },
      { 
        id: 'sys-settings-group', 
        label: '全局配置', 
        icon: 'Settings',
        children: [
          { id: 'sys-settings-thresholds', label: '阈值配置' },
          { id: 'sys-settings-dict', label: '字典与标准' }
        ]
      },
      { 
        id: 'sys-logs-group', 
        label: '日志中心', 
        icon: 'FileText',
        children: [
          { id: 'sys-op-log', label: '操作审计' },
          { id: 'sys-sys-log', label: '系统日志' }
        ]
      }
    ]
  }
];