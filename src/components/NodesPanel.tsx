import { DragEvent } from 'react';
import { MessageSquare } from 'lucide-react';

export const NodesPanel = () => {
  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Nodes Panel</h3>
      
      <div
        className="border-2 border-primary rounded-lg p-4 cursor-grab active:cursor-grabbing bg-card hover:bg-accent/5 transition-colors"
        onDragStart={(event) => onDragStart(event, 'textNode')}
        draggable
      >
        <div className="flex flex-col items-center gap-2">
          <MessageSquare className="w-8 h-8 text-primary" />
          <span className="text-sm font-medium text-foreground">Message</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Drag and drop nodes to the canvas to build your chatbot flow
      </p>
    </div>
  );
};
