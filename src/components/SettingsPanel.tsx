import { useState, useEffect } from 'react';
import type { Node } from 'reactflow';
import { ArrowLeft } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface SettingsPanelProps {
    node: Node;
    onUpdateText: (nodeId: string, text: string) => void;
    onClose: () => void;
}

export const SettingsPanel = ({ node, onUpdateText, onClose }: SettingsPanelProps) => {
    const [text, setText] = useState(node.data.text || '');
    useEffect(() => {
        setText(node.data.text || '');
    }, [node]);

    const handleTextChange = (value: string) => {
        setText(value);
        onUpdateText(node.id, value);
    };

    return (
        <div className="p-6">
            <button
                onClick={onClose}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>

            <h3 className="text-sm font-semibold text-foreground mb-6">Message Settings</h3>

            <div className="space-y-2">
                <Label htmlFor="message-text" className="text-sm font-medium">
                    Message Text
                </Label>
                <Textarea
                    id="message-text"
                    value={text}
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder="Enter your message here"
                    className="min-h-[120px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                    This text will be displayed in the message node
                </p>
            </div>
        </div>
    );
};
