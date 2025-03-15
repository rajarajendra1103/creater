
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Trash2, 
  Undo2, 
  Download,
  Minus,
  Plus,
  Eraser,
  Pen,
  Square,
  Circle,
  MousePointer,
  Type,
  Minimize2,
  Hexagon,
  Pencil,
  Save,
  Upload,
  FileJson
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const tools: Tool[] = [
  { id: 'select', name: 'Select', icon: <MousePointer size={20} /> },
  { id: 'pen', name: 'Pen', icon: <Pen size={20} /> },
  { id: 'freeform', name: 'Freeform', icon: <Pencil size={20} /> },
  { id: 'line', name: 'Line', icon: <Minimize2 size={20} /> },
  { id: 'polygon', name: 'Polygon', icon: <Hexagon size={20} /> },
  { id: 'eraser', name: 'Eraser', icon: <Eraser size={20} /> },
  { id: 'rectangle', name: 'Rectangle', icon: <Square size={20} /> },
  { id: 'circle', name: 'Circle', icon: <Circle size={20} /> },
  { id: 'text', name: 'Text', icon: <Type size={20} /> },
];

interface CanvasToolbarProps {
  currentTool: string;
  strokeWidth: number;
  color: string;
  drawingName: string;
  onToolChange: (toolId: string) => void;
  onStrokeWidthChange: (width: number) => void;
  onColorChange: (color: string) => void;
  onDrawingNameChange: (name: string) => void;
  onUndo: () => void;
  onClear: () => void;
  onDownload: () => void;
  onSave: () => void;
  onExport: () => void;
  onShowSavedDrawings: () => void;
  onImport: () => void;
}

const CanvasToolbar = ({
  currentTool,
  strokeWidth,
  color,
  drawingName,
  onToolChange,
  onStrokeWidthChange,
  onColorChange,
  onDrawingNameChange,
  onUndo,
  onClear,
  onDownload,
  onSave,
  onExport,
  onShowSavedDrawings,
  onImport
}: CanvasToolbarProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center mb-2">
        <input
          type="text"
          value={drawingName}
          onChange={(e) => onDrawingNameChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Drawing name..."
        />
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-2 bg-secondary/30 p-3 rounded-lg">
        <div className="flex flex-wrap gap-1">
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
            title="Undo"
          >
            <Undo2 size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onClear}
            className="rounded-md"
            title="Clear canvas"
          >
            <Trash2 size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onDownload}
            className="rounded-md"
            title="Download as PNG"
          >
            <Download size={18} />
          </Button>
        </div>
        
        <div className="flex space-x-1">
          <Button 
            variant="default" 
            size="sm" 
            onClick={onSave}
            className="rounded-md"
            title="Save to browser storage"
          >
            <Save size={16} className="mr-1" /> Save
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onShowSavedDrawings}
            className="rounded-md"
            title="Open saved drawings"
          >
            Open
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onExport}
            className="rounded-md"
            title="Export as file"
          >
            <FileJson size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onImport}
            className="rounded-md"
            title="Import from file"
          >
            <Upload size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CanvasToolbar;
