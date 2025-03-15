
import { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { toast } from 'sonner';

export const useFabricTools = (fabricCanvas: fabric.Canvas | null) => {
  const [currentTool, setCurrentTool] = useState('pen');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [color, setColor] = useState('#000000');
  
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

  // Undo functionality
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

  return {
    currentTool,
    strokeWidth,
    color,
    handleToolChange,
    setStrokeWidth,
    setColor,
    handleUndo,
    clearCanvas,
    downloadCanvas
  };
};
