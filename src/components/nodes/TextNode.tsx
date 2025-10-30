import { memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TextNode = memo(({ data, selected, id }: NodeProps) => {
    const { deleteElements } = useReactFlow();

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteElements({ nodes: [{ id }] });
    };

    return (
        <div
            className={`min-w-[280px] bg-node-bg rounded-lg shadow-lg border-2 transition-all relative group ${selected ? 'border-primary shadow-xl' : 'border-node-border'
                }`}
        >
            <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={handleDelete}
            >
                <X className="h-3 w-3" />
            </Button>

            <div className="bg-primary px-4 py-2 rounded-t-md flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary-foreground" />
                <span className="font-medium text-sm text-primary-foreground">Send Message</span>
            </div>

            <div className="px-4 py-3">
                {data.text ? (
                    <p className="text-sm text-foreground whitespace-pre-wrap">{data.text}</p>
                ) : (
                    <p className="text-sm text-muted-foreground italic">Enter your message here</p>
                )}
            </div>

            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 bg-accent border-2 border-card"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 bg-accent border-2 border-card"
            />
        </div>
    );
});

TextNode.displayName = 'TextNode';
