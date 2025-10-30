import { useCallback, useState, useRef, DragEvent } from 'react';
import {
    Node,
    addEdge,
    Connection,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    BackgroundVariant,
    ReactFlowProvider,
    ReactFlowInstance,
    OnConnect,
} from 'reactflow';
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';
import { TextNode } from './nodes/TextNode';
import { NodesPanel } from './NodesPanel';
import { SettingsPanel } from './SettingsPanel';
import { ThemeToggle } from './ThemeToogle';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const nodeTypes = {
    textNode: TextNode,
};

let id = 0;
const getId = () => `node_${id++}`;

const FlowBuilderContent = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const [showError, setShowError] = useState(false);

    const onConnect: OnConnect = useCallback(
        (params: Connection) => {
            const sourceHasConnection = edges.some(
                (edge) => edge.source === params.source && edge.sourceHandle === params.sourceHandle
            );

            if (sourceHasConnection) {
                toast.error('A source handle can only have one outgoing connection');
                return;
            }

            setEdges((eds) => addEdge(params, eds));
        },
        [edges, setEdges]
    );

    const onDragOver = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type || !reactFlowWrapper.current) {
                return;
            }

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            if (!reactFlowInstance) return;
            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            const newNode: Node = {
                id: getId(),
                type: 'textNode',
                position,
                data: { label: 'Send Message', text: '' },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes]
    );

    const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
        setShowError(false);
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
        setShowError(false);
    }, []);

    const updateNodeText = useCallback(
        (nodeId: string, text: string) => {
            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === nodeId) {
                        return {
                            ...node,
                            data: { ...node.data, text },
                        };
                    }
                    return node;
                })
            );
        },
        [setNodes]
    );

    const handleSave = useCallback(() => {
        setShowError(false);

        if (nodes.length > 1) {
            const nodesWithoutTarget = nodes.filter((node) => {
                return !edges.some((edge) => edge.target === node.id);
            });

            if (nodesWithoutTarget.length > 1) {
                setShowError(true);
                toast.error('Cannot save flow: Multiple nodes without incoming connections');
                return;
            }
        }

        setShowError(false);
        toast.success('Flow saved successfully!');
        console.log('Flow saved:', { nodes, edges });
    }, [nodes, edges]);

    return (
        <div className="h-screen flex flex-col">

            <div className="relative h-16 bg-card border-b border-border flex items-center justify-between px-6">
                <h1 className="text-lg font-semibold text-foreground tracking-tight">
                    Sam&apos;s Flow Builder
                </h1>
                {showError && (
                    <div className="absolute left-1/2 -translate-x-1/2 bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm font-medium">
                        Cannot save Flow
                    </div>
                )}
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <Button
                        onClick={handleSave}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex">
                <div className="flex-1" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        nodeTypes={nodeTypes}
                        fitView
                        className="bg-background"
                    >
                        <Controls />
                        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                    </ReactFlow>
                </div>

                <div className="w-80 border-l border-border bg-card">
                    {selectedNode ? (
                        <SettingsPanel
                            node={selectedNode}
                            onUpdateText={updateNodeText}
                            onClose={() => setSelectedNode(null)}
                        />
                    ) : (
                        <NodesPanel />
                    )}
                </div>
            </div>
        </div>
    );
};

export const FlowBuilder = () => {
    return (
        <ReactFlowProvider>
            <FlowBuilderContent />
        </ReactFlowProvider>
    );
};
