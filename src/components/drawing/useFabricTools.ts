import { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { toast } from 'sonner';

export const useFabricTools = (fabricCanvas: fabric.Canvas | null) => {
  const [currentTool, setCurrentTool] = useState('pen');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [color, setColor] = useState('#000000');
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingName, setDrawingName] = useState('Untitled Drawing');
  
  // Update canvas when tools change
  useEffect(() => {
    if (!fabricCanvas) return;
    
    // Set drawing mode based on current tool
    fabricCanvas.isDrawingMode = currentTool === 'pen' || currentTool === 'eraser' || currentTool === 'freeform';
    
    // Configure the brush based on the current tool
    if (currentTool === 'pen' || currentTool === 'freeform') {
      fabricCanvas.freeDrawingBrush.color = color;
      fabricCanvas.freeDrawingBrush.width = strokeWidth;
    } else if (currentTool === 'eraser') {
      // Simulate eraser with white color
      fabricCanvas.freeDrawingBrush.color = '#ffffff';
      fabricCanvas.freeDrawingBrush.width = strokeWidth * 2;
    }
    
  }, [currentTool, color, strokeWidth, fabricCanvas]);
  
  // Set up event listeners
  useEffect(() => {
    if (!fabricCanvas) return;
    
    const handleMouseDown = (options: fabric.IEvent<MouseEvent>) => {
      if (currentTool === 'line' || currentTool === 'polygon') {
        setIsDrawing(true);
        const pointer = fabricCanvas.getPointer(options.e);
        setPoints([{ x: pointer.x, y: pointer.y }]);
      }
    };
    
    const handleMouseMove = (options: fabric.IEvent<MouseEvent>) => {
      if (!isDrawing) return;
      
      const pointer = fabricCanvas.getPointer(options.e);
      
      if (currentTool === 'line') {
        // For line tool, update the line in real-time as user moves mouse
        if (points.length === 1) {
          // Find existing temp line and remove it
          const objects = fabricCanvas.getObjects();
          const tempLine = objects.find(obj => obj.data?.temp === true);
          if (tempLine) fabricCanvas.remove(tempLine);
          
          // Create new temp line
          const line = new fabric.Line(
            [points[0].x, points[0].y, pointer.x, pointer.y],
            {
              stroke: color,
              strokeWidth: strokeWidth,
              data: { temp: true }
            }
          );
          fabricCanvas.add(line);
          fabricCanvas.renderAll();
        }
      } else if (currentTool === 'polygon') {
        // For polygon tool, update the line to current mouse position
        if (points.length > 0) {
          // Find existing temp line and remove it
          const objects = fabricCanvas.getObjects();
          const tempLine = objects.find(obj => obj.data?.temp === true);
          if (tempLine) fabricCanvas.remove(tempLine);
          
          const lastPoint = points[points.length - 1];
          // Create new temp line
          const line = new fabric.Line(
            [lastPoint.x, lastPoint.y, pointer.x, pointer.y],
            {
              stroke: color,
              strokeWidth: strokeWidth,
              data: { temp: true }
            }
          );
          fabricCanvas.add(line);
          fabricCanvas.renderAll();
        }
      }
    };
    
    const handleMouseUp = (options: fabric.IEvent<MouseEvent>) => {
      if (!isDrawing) return;
      
      const pointer = fabricCanvas.getPointer(options.e);
      
      if (currentTool === 'line') {
        // Remove the temporary line
        const objects = fabricCanvas.getObjects();
        const tempLine = objects.find(obj => obj.data?.temp === true);
        if (tempLine) fabricCanvas.remove(tempLine);
        
        // Create permanent line
        const line = new fabric.Line(
          [points[0].x, points[0].y, pointer.x, pointer.y],
          {
            stroke: color,
            strokeWidth: strokeWidth
          }
        );
        fabricCanvas.add(line);
        setIsDrawing(false);
        setPoints([]);
      } else if (currentTool === 'polygon') {
        // For polygon, add point but don't finish unless double-clicked
        setPoints(prev => [...prev, { x: pointer.x, y: pointer.y }]);
        
        // If more than one point, draw line between last two points
        if (points.length > 0) {
          // Remove temporary line
          const objects = fabricCanvas.getObjects();
          const tempLine = objects.find(obj => obj.data?.temp === true);
          if (tempLine) fabricCanvas.remove(tempLine);
          
          const lastPoint = points[points.length - 1];
          const line = new fabric.Line(
            [lastPoint.x, lastPoint.y, pointer.x, pointer.y],
            {
              stroke: color,
              strokeWidth: strokeWidth
            }
          );
          fabricCanvas.add(line);
        }
      }
      
      fabricCanvas.renderAll();
    };
    
    const handleDblClick = () => {
      if (currentTool === 'polygon' && points.length > 2) {
        // Complete the polygon on double-click
        // Remove the temporary line
        const objects = fabricCanvas.getObjects();
        const tempLine = objects.find(obj => obj.data?.temp === true);
        if (tempLine) fabricCanvas.remove(tempLine);
        
        // Create the polygon using the collected points
        const polygonPoints = points.flatMap(p => [p.x, p.y]);
        // Add first point to close the polygon
        polygonPoints.push(points[0].x, points[0].y);
        
        const polygon = new fabric.Polygon(
          points.map(p => new fabric.Point(p.x, p.y)),
          {
            stroke: color,
            strokeWidth: strokeWidth,
            fill: 'transparent'
          }
        );
        
        fabricCanvas.add(polygon);
        setIsDrawing(false);
        setPoints([]);
        
        // Remove all the lines we used to preview the polygon
        const linesToRemove = fabricCanvas.getObjects('line');
        linesToRemove.forEach(line => fabricCanvas.remove(line));
        
        fabricCanvas.renderAll();
      }
    };

    // Add event listeners
    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);
    fabricCanvas.on('mouse:dblclick', handleDblClick);
    
    // Cleanup function
    return () => {
      fabricCanvas.off('mouse:down', handleMouseDown);
      fabricCanvas.off('mouse:move', handleMouseMove);
      fabricCanvas.off('mouse:up', handleMouseUp);
      fabricCanvas.off('mouse:dblclick', handleDblClick);
    };
  }, [fabricCanvas, currentTool, color, strokeWidth, isDrawing, points]);
  
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

  // Save drawing to localStorage
  const saveToLocalStorage = () => {
    if (!fabricCanvas) return;
    
    try {
      // Get the canvas as JSON
      const canvasJSON = JSON.stringify(fabricCanvas.toJSON());
      
      // Generate a unique key based on timestamp if none exists
      const key = `manga-drawing-${Date.now()}`;
      
      // Save the canvas data and metadata
      const drawingData = {
        id: key,
        name: drawingName,
        preview: fabricCanvas.toDataURL({ format: 'png', quality: 0.5 }),
        data: canvasJSON,
        lastModified: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem(key, JSON.stringify(drawingData));
      
      // Update the saved drawings list
      const savedDrawings = JSON.parse(localStorage.getItem('manga-drawings') || '[]');
      savedDrawings.push({
        id: key,
        name: drawingName,
        preview: drawingData.preview,
        lastModified: drawingData.lastModified
      });
      localStorage.setItem('manga-drawings', JSON.stringify(savedDrawings));
      
      toast.success(`Drawing saved as "${drawingName}"`);
      return key;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      toast.error('Failed to save drawing to browser storage');
      return null;
    }
  };
  
  // Load a drawing from localStorage
  const loadFromLocalStorage = (key: string) => {
    if (!fabricCanvas) return false;
    
    try {
      const savedDrawing = localStorage.getItem(key);
      
      if (!savedDrawing) {
        toast.error('Drawing not found');
        return false;
      }
      
      const { data, name } = JSON.parse(savedDrawing);
      fabricCanvas.loadFromJSON(JSON.parse(data), () => {
        fabricCanvas.renderAll();
        setDrawingName(name);
        toast.success(`Drawing "${name}" loaded`);
      });
      
      return true;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      toast.error('Failed to load drawing');
      return false;
    }
  };
  
  // Get saved drawings from localStorage
  const getSavedDrawings = () => {
    try {
      const savedDrawings = localStorage.getItem('manga-drawings');
      return savedDrawings ? JSON.parse(savedDrawings) : [];
    } catch (error) {
      console.error('Error getting saved drawings:', error);
      return [];
    }
  };
  
  // Export drawing as a file
  const exportToFile = () => {
    if (!fabricCanvas) return;
    
    try {
      // Get the canvas as JSON
      const canvasJSON = JSON.stringify(fabricCanvas.toJSON());
      
      // Create a Blob with the JSON data
      const blob = new Blob([canvasJSON], { type: 'application/json' });
      
      // Create a download link
      const link = document.createElement('a');
      link.download = `${drawingName.replace(/\s+/g, '-').toLowerCase()}.json`;
      link.href = URL.createObjectURL(blob);
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Drawing exported as ${link.download}`);
    } catch (error) {
      console.error('Error exporting to file:', error);
      toast.error('Failed to export drawing');
    }
  };
  
  // Import drawing from a file
  const importFromFile = (file: File) => {
    if (!fabricCanvas) return;
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (event.target?.result) {
          const jsonData = JSON.parse(event.target.result as string);
          
          fabricCanvas.loadFromJSON(jsonData, () => {
            fabricCanvas.renderAll();
            // Extract filename without extension
            const fileName = file.name.replace(/\.[^/.]+$/, "");
            setDrawingName(fileName);
            toast.success(`Drawing "${fileName}" imported`);
          });
        }
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        toast.error('Failed to import drawing: Invalid file format');
      }
    };
    
    reader.onerror = () => {
      toast.error('Failed to read file');
    };
    
    reader.readAsText(file);
  };
  
  // Handle drawing name change
  const handleDrawingNameChange = (name: string) => {
    setDrawingName(name);
  };

  return {
    currentTool,
    strokeWidth,
    color,
    drawingName,
    handleToolChange,
    setStrokeWidth,
    setColor,
    handleDrawingNameChange,
    handleUndo,
    clearCanvas,
    downloadCanvas,
    saveToLocalStorage,
    loadFromLocalStorage,
    getSavedDrawings,
    exportToFile,
    importFromFile
  };
};
