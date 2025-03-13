
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
  MousePointer
} from 'lucide-react';
import { toast } from 'sonner';

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
];

interface DrawingCanvasProps {
  width?: number;
  height?: number;
}

const DrawingCanvas = ({ width = 800, height = 600 }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState('pen');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [color, setColor] = useState('#000000');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Initialize with white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    setCtx(context);

    // Save initial state
    const initialState = context.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialState]);
    setHistoryIndex(0);
  }, [width, height]);

  // Save current state to history
  const saveState = () => {
    if (!ctx || !canvasRef.current) return;
    
    const currentState = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // If we've gone back in history and then drawn something new,
    // we need to remove all the states after the current one
    const newHistory = history.slice(0, historyIndex + 1);
    
    setHistory([...newHistory, currentState]);
    setHistoryIndex(newHistory.length);
  };

  // Undo and redo functions
  const undo = () => {
    if (historyIndex <= 0) return;
    
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    
    if (!ctx || !canvasRef.current) return;
    ctx.putImageData(history[newIndex], 0, 0);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    
    if (!ctx || !canvasRef.current) return;
    ctx.putImageData(history[newIndex], 0, 0);
  };

  // Clear canvas
  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    saveState();
    toast.success("Canvas cleared");
  };

  // Download canvas
  const downloadCanvas = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `manga-drawing-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Drawing downloaded successfully");
  };

  // Drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctx || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    if (currentTool === 'pen') {
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    } else if (currentTool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = strokeWidth * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
    
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (currentTool === 'pen' || currentTool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (currentTool === 'rectangle') {
      // Not implemented in this simplified version
    } else if (currentTool === 'circle') {
      // Not implemented in this simplified version
    }
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveState();
  };

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!ctx || !canvasRef.current) return;
    e.preventDefault();
    
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    if (currentTool === 'pen') {
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    } else if (currentTool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = strokeWidth * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
    
    setIsDrawing(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx || !canvasRef.current) return;
    e.preventDefault();
    
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    if (currentTool === 'pen' || currentTool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    setIsDrawing(false);
    saveState();
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
              onClick={() => setCurrentTool(tool.id)}
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
            onClick={undo}
            disabled={historyIndex <= 0}
            className="rounded-md"
          >
            <Undo2 size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="rounded-md"
          >
            <Redo2 size={18} />
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
          ref={canvasRef}
          className="drawing-canvas bg-white w-full h-full"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
    </div>
  );
};

export default DrawingCanvas;
