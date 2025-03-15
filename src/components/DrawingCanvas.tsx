
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Trash2, 
  Undo2, 
  Redo2, 
  Save, 
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
import { toast } from 'sonner';
import { fabric } from 'fabric';

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

interface DrawingCanvasProps {
  width?: number;
  height?: number;
}

const DrawingCanvas = ({ width = 800, height = 600 }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [currentTool, setCurrentTool] = useState('pen');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [color, setColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Get the canvas element's ID
    const canvasId = canvasRef.current.id;
    
    // Create a new Fabric.js canvas
    const canvas = new fabric.Canvas(canvasId, {
      width,
      height,
      backgroundColor: '#ffffff',
      isDrawingMode: currentTool === 'pen',
    });
    
    // Initialize the brush
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = strokeWidth;
    
    setFabricCanvas(canvas);
    
    // Clean up function
    return () => {
      canvas.dispose();
    };
  }, [width, height]);
  
  // Update canvas when tools change
  useEffect(() => {
    if (!fabricCanvas) return;
    
    // Set drawing mode based on current tool
    fabricCanvas.isDrawingMode = currentTool === 'pen' || currentTool === 'eraser';
    
    // Configure the brush based on the current tool
    if (currentTool === 'pen') {
      fabricCanvas.freeDrawingBrush.color = color;
      fabricCanvas.freeDrawingBrush.width = strokeWidth;
    } else if (currentTool === 'eraser') {
      // Simulate eraser with white color
      fabricCanvas.freeDrawingBrush.color = '#ffffff';
      fabricCanvas.freeDrawingBrush.width = strokeWidth * 2;
    }
    
  }, [currentTool, color, strokeWidth, fabricCanvas]);
  
  // Handle tool selection
  const handleToolChange = (toolId: string) => {
    setCurrentTool(toolId);
    
    if (!fabricCanvas) return;
    
    // Deselect all objects when changing tools
    fabricCanvas.discardActiveObject().renderAll();
    
    if (toolId === 'rectangle') {
      // Create rectangle on next click
      fabricCanvas.once('mouse:down', (options) => {
        const pointer = fabricCanvas.getPointer(options.e);
        const rect = new fabric.Rect({
          left: pointer.x,
          top: pointer.y,
          width: 100,
          height: 80,
          fill: 'transparent',
          stroke: color,
          strokeWidth: strokeWidth,
        });
        fabricCanvas.add(rect);
        fabricCanvas.setActiveObject(rect);
      });
    } else if (toolId === 'circle') {
      // Create circle on next click
      fabricCanvas.once('mouse:down', (options) => {
        const pointer = fabricCanvas.getPointer(options.e);
        const circle = new fabric.Circle({
          left: pointer.x,
          top: pointer.y,
          radius: 50,
          fill: 'transparent',
          stroke: color,
          strokeWidth: strokeWidth,
        });
        fabricCanvas.add(circle);
        fabricCanvas.setActiveObject(circle);
      });
    } else if (toolId === 'text') {
      // Add text on next click
      fabricCanvas.once('mouse:down', (options) => {
        const pointer = fabricCanvas.getPointer(options.e);
        const text = new fabric.Textbox('Type here', {
          left: pointer.x,
          top: pointer.y,
          fontSize: 20,
          fill: color,
          width: 200,
          editable: true,
        });
        fabricCanvas.add(text);
        fabricCanvas.setActiveObject(text);
      });
    }
  };

  // Clear canvas
  const clearCanvas = () => {
    if (!fabricCanvas) return;
    
    fabricCanvas.clear();
    fabricCanvas.setBackgroundColor('#ffffff', () => {});
    fabricCanvas.renderAll();
    
    toast.success("Canvas cleared");
  };

  // Undo / Redo functionality would require maintaining a history stack
  // This is a simplified version without history
  const handleUndo = () => {
    if (!fabricCanvas) return;
    
    const objects = fabricCanvas.getObjects();
    if (objects.length > 0) {
      fabricCanvas.remove(objects[objects.length - 1]);
      toast.info("Last action undone");
    }
  };
  
  // Download canvas
  const downloadCanvas = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1
    });
    
    const link = document.createElement('a');
    link.download = `manga-drawing-${Date.now()}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Drawing downloaded successfully");
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-secondary/30 p-3 rounded-lg">
        <div className="flex space-x-1">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={currentTool === tool.id ? "default" : "outline"}
              size="icon"
              onClick={() => handleToolChange(tool.id)}
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
            onClick={() => setStrokeWidth(Math.max(1, strokeWidth - 1))}
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
              onValueChange={(values) => setStrokeWidth(values[0])}
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setStrokeWidth(Math.min(20, strokeWidth + 1))}
            disabled={strokeWidth >= 20}
            className="rounded-md"
          >
            <Plus size={16} />
          </Button>
        </div>
        
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 rounded-md cursor-pointer border-2 border-gray-200"
        />
        
        <div className="flex space-x-1">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleUndo}
            className="rounded-md"
          >
            <Undo2 size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={clearCanvas}
            className="rounded-md"
          >
            <Trash2 size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={downloadCanvas}
            className="rounded-md"
          >
            <Download size={18} />
          </Button>
        </div>
      </div>
      
      <div className="relative border border-gray-200 rounded-lg shadow-lg overflow-hidden">
        <canvas
          id="manga-fabric-canvas"
          ref={canvasRef}
          className="drawing-canvas bg-white w-full h-full"
        />
      </div>
    </div>
  );
};

export default DrawingCanvas;
