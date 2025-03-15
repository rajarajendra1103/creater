
import { useState } from 'react';
import CanvasToolbar from '@/components/drawing/CanvasToolbar';
import CanvasArea from '@/components/drawing/CanvasArea';
import { useFabricTools } from '@/components/drawing/useFabricTools';
import { fabric } from 'fabric';

interface DrawingCanvasProps {
  width?: number;
  height?: number;
}

const DrawingCanvas = ({ width = 800, height = 600 }: DrawingCanvasProps) => {
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  
  const {
    currentTool,
    strokeWidth,
    color,
    handleToolChange,
    setStrokeWidth,
    setColor,
    handleUndo,
    clearCanvas,
    downloadCanvas
  } = useFabricTools(fabricCanvas);

  return (
    <div className="flex flex-col space-y-4">
      <CanvasToolbar 
        currentTool={currentTool}
        strokeWidth={strokeWidth}
        color={color}
        onToolChange={handleToolChange}
        onStrokeWidthChange={setStrokeWidth}
        onColorChange={setColor}
        onUndo={handleUndo}
        onClear={clearCanvas}
        onDownload={downloadCanvas}
      />
      
      <CanvasArea 
        width={width}
        height={height}
        fabricCanvas={fabricCanvas}
        setFabricCanvas={setFabricCanvas}
      />
    </div>
  );
};

export default DrawingCanvas;
