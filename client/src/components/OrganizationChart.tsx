import { useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  EdgeTypes,
  MiniMap,
  Node,
  NodeProps,
  NodeTypes,
  Edge,
  Position,
  ReactFlowProvider,
  useReactFlow,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building, Cpu, DollarSign, BarChart, LineChart, 
  Settings, MessageSquare, Network, Users, Share2, 
  ArrowRightLeft, CornerUpRight, CornerDownRight,
  PlusCircle, MinusCircle, MoveHorizontal, ArrowBigUp,
  ArrowBigDown, Zap, Hexagon
} from "lucide-react";
import "reactflow/dist/style.css";

// Mock data for the organization chart
// In a real implementation, this would come from an API
const businessEntities = [
  { id: "entity-1", name: "Digital Merch Pros", color: "#0ea5e9" },
  { id: "entity-2", name: "Mystery Hype", color: "#8b5cf6" },
  { id: "entity-3", name: "Lone Star Custom Clothing", color: "#f59e0b" },
  { id: "entity-4", name: "Alcoeaze", color: "#10b981" },
  { id: "entity-5", name: "Hide Cafe Bars", color: "#ec4899" },
];

const departmentData = {
  "Finance": { icon: <DollarSign className="h-5 w-5" />, color: "#10b981" },
  "Marketing": { icon: <BarChart className="h-5 w-5" />, color: "#8b5cf6" },
  "Sales": { icon: <LineChart className="h-5 w-5" />, color: "#f59e0b" },
  "Operations": { icon: <Settings className="h-5 w-5" />, color: "#0ea5e9" },
  "Customer Service": { icon: <MessageSquare className="h-5 w-5" />, color: "#ef4444" },
  "IT": { icon: <Cpu className="h-5 w-5" />, color: "#6366f1" },
};

// Node types
interface EntityNodeProps extends NodeProps {
  data: {
    name: string;
    color: string;
    automationScore: number;
  };
}

const EntityNode = ({ data }: EntityNodeProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="px-4 py-3 rounded-md font-medium shadow-md border-2 flex items-center justify-between gap-4"
            style={{ borderColor: data.color, backgroundColor: 'white' }}
          >
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" style={{ color: data.color }} />
              <span>{data.name}</span>
            </div>
            <Badge className="ml-2 bg-primary text-white">
              {data.automationScore}%
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <div className="font-medium">{data.name}</div>
            <div className="text-muted-foreground">Overall Automation Score: {data.automationScore}%</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface DepartmentNodeProps extends NodeProps {
  data: {
    name: string;
    entityId: string;
    entityName: string;
    score: number;
    color: string;
    tools: number;
  };
}

const DepartmentNode = ({ data }: DepartmentNodeProps) => {
  const getScoreColor = (score: number) => {
    if (score < 40) return "#ef4444";
    if (score < 70) return "#f59e0b";
    return "#10b981";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="px-3 py-2 rounded-full shadow-md border flex items-center justify-between"
            style={{ borderColor: data.color, backgroundColor: 'white' }}
          >
            <div className="flex items-center gap-2">
              <div className="rounded-full p-1.5" style={{ backgroundColor: `${data.color}20` }}>
                {departmentData[data.name]?.icon || <Users className="h-4 w-4" style={{ color: data.color }} />}
              </div>
              <span className="font-medium">{data.name}</span>
            </div>
            <Badge className="ml-2" style={{ backgroundColor: getScoreColor(data.score) }}>
              {data.score}%
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm space-y-1">
            <div className="font-medium">{data.name} - {data.entityName}</div>
            <div className="text-muted-foreground">Automation Score: {data.score}%</div>
            <div className="text-muted-foreground">Tools: {data.tools}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface ProcessNodeProps extends NodeProps {
  data: {
    name: string;
    automation: number;
    entities: string[];
    type: 'cross-entity' | 'internal';
  };
}

const ProcessNode = ({ data }: ProcessNodeProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="px-3 py-2 border flex items-center gap-2 shadow-md"
            style={{ 
              backgroundColor: 'white',
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
              width: '180px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div 
              className="flex items-center justify-center gap-2 text-sm font-medium"
              style={{ width: '170px', padding: '0 15px' }}
            >
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="truncate">{data.name}</span>
              <Badge className="ml-auto bg-primary">{data.automation}%</Badge>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm space-y-1">
            <div className="font-medium">{data.name}</div>
            <div className="text-muted-foreground">Automation Level: {data.automation}%</div>
            <div className="text-muted-foreground">
              Type: {data.type === 'cross-entity' ? 'Cross-entity Process' : 'Internal Process'}
            </div>
            {data.entities.length > 0 && (
              <div className="text-muted-foreground">
                Entities: {data.entities.join(', ')}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Custom Edge
function CustomEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, data }) {
  const edgePath = `M${sourceX},${sourceY} C${sourceX + 50},${sourceY} ${targetX - 50},${targetY} ${targetX},${targetY}`;

  return (
    <path
      id={id}
      style={{
        ...style,
        strokeWidth: 2,
        stroke: data?.color || '#64748b',
      }}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd="url(#end-arrow)"
    />
  );
}

// Define node types
const nodeTypes: NodeTypes = {
  entity: EntityNode,
  department: DepartmentNode,
  process: ProcessNode,
};

// Define edge types
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

// Generate sample nodes and edges
const generateSampleData = (
  viewMode: 'default' | 'entity' | 'department', 
  selectedEntity?: string
) => {
  let nodes: Node[] = [];
  let edges: Edge[] = [];

  const filteredEntities = selectedEntity 
    ? businessEntities.filter(e => e.id === selectedEntity)
    : businessEntities;

  // Create entity nodes
  filteredEntities.forEach((entity, idx) => {
    const automationScore = Math.floor(Math.random() * 30) + 60; // 60-90
    
    nodes.push({
      id: entity.id,
      type: 'entity',
      position: viewMode === 'department' 
        ? { x: idx * 300 + 100, y: 500 } 
        : { x: idx * 300 + 100, y: 50 },
      data: {
        name: entity.name,
        color: entity.color,
        automationScore,
      },
    });
    
    // Create department nodes for each entity
    Object.keys(departmentData).forEach((dept, deptIdx) => {
      const departmentId = `${entity.id}-${dept.toLowerCase().replace(/\s+/g, '-')}`;
      const score = Math.floor(Math.random() * 50) + 40; // 40-90
      const toolCount = Math.floor(Math.random() * 5) + 1; // 1-5
      
      nodes.push({
        id: departmentId,
        type: 'department',
        position: viewMode === 'entity' 
          ? { x: idx * 300 + 100, y: deptIdx * 100 + 150 } 
          : viewMode === 'department' 
            ? { x: deptIdx * 200 + 150, y: 250 } 
            : { x: idx * 300 + 100, y: deptIdx * 80 + 150 },
        data: {
          name: dept,
          entityId: entity.id,
          entityName: entity.name,
          score,
          color: departmentData[dept].color,
          tools: toolCount,
        },
      });
      
      // Connect entity to department
      edges.push({
        id: `e-${entity.id}-to-${departmentId}`,
        source: entity.id,
        target: departmentId,
        sourceHandle: null,
        targetHandle: null,
        type: 'custom',
        data: { color: entity.color },
      });
    });
  });
  
  // Create process nodes (cross-entity connections)
  if (viewMode === 'default' || viewMode === 'entity') {
    const processes = [
      { name: 'Customer Acquisition', type: 'cross-entity' },
      { name: 'Order Fulfillment', type: 'cross-entity' },
      { name: 'Product Development', type: 'cross-entity' },
      { name: 'Inventory Management', type: 'cross-entity' },
      { name: 'Customer Support', type: 'cross-entity' },
      { name: 'Financial Reporting', type: 'internal' },
      { name: 'Payroll Processing', type: 'internal' },
      { name: 'Social Media Workflow', type: 'cross-entity' },
    ];
    
    processes.forEach((process, procIdx) => {
      if (procIdx >= 5 && viewMode === 'default') return; // Limit processes in default view
      
      const connectedEntities = filteredEntities
        .filter(() => Math.random() > 0.3) // Randomly connect to some entities
        .slice(0, process.type === 'cross-entity' ? 3 : 1); // Cross-entity processes connect to multiple entities
      
      if (connectedEntities.length === 0) return;
      
      const processId = `process-${process.name.toLowerCase().replace(/\s+/g, '-')}`;
      const automation = Math.floor(Math.random() * 60) + 30; // 30-90%
      
      nodes.push({
        id: processId,
        type: 'process',
        position: { 
          x: viewMode === 'entity' 
            ? 500 
            : 650 + (procIdx % 3) * 200, 
          y: viewMode === 'entity' 
            ? procIdx * 100 + 150 
            : 150 + Math.floor(procIdx / 3) * 150
        },
        data: {
          name: process.name,
          automation,
          entities: connectedEntities.map(e => e.name),
          type: process.type,
        },
      });
      
      // Connect process to relevant departments or entities
      connectedEntities.forEach(entity => {
        const targetDepartments = process.name === 'Customer Acquisition' 
          ? [`${entity.id}-marketing`, `${entity.id}-sales`]
          : process.name === 'Order Fulfillment'
            ? [`${entity.id}-operations`, `${entity.id}-customer-service`]
            : process.name === 'Product Development'
              ? [`${entity.id}-operations`, `${entity.id}-marketing`]
              : process.name === 'Inventory Management'
                ? [`${entity.id}-operations`]
                : process.name === 'Customer Support'
                  ? [`${entity.id}-customer-service`]
                  : process.name === 'Financial Reporting'
                    ? [`${entity.id}-finance`]
                    : process.name === 'Payroll Processing'
                      ? [`${entity.id}-finance`, `${entity.id}-operations`]
                      : process.name === 'Social Media Workflow'
                        ? [`${entity.id}-marketing`]
                        : [];
        
        // Create edges for these connections
        targetDepartments.forEach(deptId => {
          edges.push({
            id: `e-${processId}-to-${deptId}`,
            source: processId,
            target: deptId,
            sourceHandle: null,
            targetHandle: null,
            type: 'custom',
            data: { color: '#94a3b8' },
          });
        });
      });
    });
  }
  
  return { nodes, edges };
};

interface OrganizationChartProps {
  viewMode: 'default' | 'entity' | 'department';
  selectedEntity?: string;
}

// Flow chart component (internal)
// Export the wrapper component with ReactFlowProvider
export default function OrganizationChart(props: OrganizationChartProps) {
  return (
    <ReactFlowProvider>
      <FlowChart {...props} />
    </ReactFlowProvider>
  );
}

// Internal implementation
function FlowChart({ 
  viewMode = 'default',
  selectedEntity
}: OrganizationChartProps) {
  // Generate sample data based on view mode
  const { nodes: initialNodes, edges: initialEdges } = generateSampleData(viewMode, selectedEntity);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [zoomLevel, setZoomLevel] = useState(1);
  const reactFlowInstance = useReactFlow();
  
  // Update nodes and edges when view mode or selected entity changes
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = generateSampleData(viewMode, selectedEntity);
    setNodes(newNodes);
    setEdges(newEdges);
    
    // Auto-fit view after a short delay to ensure nodes are rendered
    setTimeout(() => {
      if (reactFlowInstance) {
        reactFlowInstance.fitView({ padding: 0.2 });
      }
    }, 50);
  }, [viewMode, selectedEntity, setNodes, setEdges, reactFlowInstance]);
  
  // Function to handle zoom
  const handleZoom = (type: 'in' | 'out') => {
    if (reactFlowInstance) {
      if (type === 'in') {
        reactFlowInstance.zoomIn();
        setZoomLevel(prev => Math.min(prev + 0.25, 2));
      } else {
        reactFlowInstance.zoomOut();
        setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
      }
    }
  };
  
  // Function to reset view
  const handleReset = () => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 });
      setZoomLevel(1);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <Button 
          size="sm" 
          variant="outline"
          className="rounded-full h-8 w-8 p-0"
          onClick={() => handleZoom('in')}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="rounded-full h-8 w-8 p-0"
          onClick={() => handleZoom('out')}
        >
          <MinusCircle className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="rounded-full h-8 w-8 p-0"
          onClick={handleReset}
        >
          <MoveHorizontal className="h-4 w-4" />
        </Button>
        <div className="text-xs bg-background/80 rounded-full px-2 flex items-center">
          {Math.round(zoomLevel * 100)}%
        </div>
      </div>
      
      <div className="flex-1 w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          minZoom={0.5}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          attributionPosition="bottom-right"
        >
          <Background color="#f1f5f9" gap={16} />
          <Controls showInteractive={false} />
          <MiniMap 
            nodeStrokeWidth={3}
            zoomable
            pannable
            nodeColor={(node) => {
              if (node.type === 'entity') return (node.data?.color || '#94a3b8');
              if (node.type === 'department') return (node.data?.color || '#64748b');
              return '#64748b';
            }}
          />
          
          {/* Custom edge marker definition */}
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
              <marker
                id="end-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
              </marker>
            </defs>
          </svg>
        </ReactFlow>
      </div>
    </div>
  );
}