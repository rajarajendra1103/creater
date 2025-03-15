
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Trash2, 
  Undo2, 
  Redo2, 
  Download,
  Minus,
  Plus,
  Eraser,
  Pen,
  Square,
  Circle,
  MousePointer,
  Type
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const tools: Tool[] = [
  { id: 'select', name: 'Select', icon: <MousePointer size={20} /> },
  { id: 'pen', name: 'Pen', icon: <Pen size={20} /> },
  { id: 'eraser', name: 'Eraser', icon: <Eraser size={20} /> },
  { id: 'rectangle', name: 'Rectangle', icon: <Square size={20} /> },
  { id: 'circle', name: 'Circle', icon: <Circle size={20} /> },
  { id: 'text', name: 'Text', icon: <Type size={20} /> },
];

interface CanvasToolbarProps {
  currentTool: string;
  strokeWidth: number;
  color: string;
  onToolChange: (toolId: string) => void;
  onStrokeWidthChange: (width: number) => void;
  onColorChange: (color: string) => void;
  onUndo: () => void;
  onClear: () => void;
  onDownload: () => void;
}

const CanvasToolbar = ({
  currentTool,
  strokeWidth,
  color,
  onToolChange,
  onStrokeWidthChange,
  onColorChange,
  onUndo,
  onClear,
  onDownload
}: CanvasToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 bg-secondary/30 p-3 rounded-lg">
      <div className="flex space-x-1">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={currentTool === tool.id ? "default" : "outline"}
            size="icon"
            onClick={() => onToolChange(tool.id)}
            title={tool.name}
            className="rounded-md"
          >
            {tool.icon}
          </Button>
        ))}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onStrokeWidthChange(Math.max(1, strokeWidth - 1))}
          disabled={strokeWidth <= 1}
          className="rounded-md"
        >
          <Minus size={16} />
        </Button>
        <div className="w-24">
          <Slider
            value={[strokeWidth]}
            min={1}
            max={20}
            step={1}
            onValueChange={(values) => onStrokeWidthChange(values[0])}
          />
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onStrokeWidthChange(Math.min(20, strokeWidth + 1))}
          disabled={strokeWidth >= 20}
          className="rounded-md"
        >
          <Plus size={16} />
        </Button>
      </div>
      
      <input
        type="color"
        value={color}
        onChange={(e) => onColorChange(e.target.value)}
        className="w-8 h-8 rounded-md cursor-pointer border-2 border-gray-200"
      />
      
      <div className="flex space-x-1">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onUndo}
          className="rounded-md"
        >
          <Undo2 size={18} />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onClear}
          className="rounded-md"
        >
          <Trash2 size={18} />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onDownload}
          className="rounded-md"
        >
          <Download size={18} />
        </Button>
      </div>
    </div>
  );
};

export default CanvasToolbar;
