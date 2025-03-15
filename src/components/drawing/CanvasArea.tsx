
import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

interface CanvasAreaProps {
  width: number;
  height: number;
  fabricCanvas: fabric.Canvas | null;
  setFabricCanvas: (canvas: fabric.Canvas) => void;
}

const CanvasArea = ({ 
  width, 
  height, 
  fabricCanvas,
  setFabricCanvas 
}: CanvasAreaProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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
    });
    
    setFabricCanvas(canvas);
    
    // Clean up function
    return () => {
      canvas.dispose();
    };
  }, [width, height, setFabricCanvas]);

  return (
    <div className="relative border border-gray-200 rounded-lg shadow-lg overflow-hidden">
      <canvas
        id="manga-fabric-canvas"
        ref={canvasRef}
        className="drawing-canvas bg-white w-full h-full"
      />
    </div>
  );
};

export default CanvasArea;
