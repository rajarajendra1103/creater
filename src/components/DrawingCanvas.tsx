
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import CanvasToolbar from '@/components/drawing/CanvasToolbar';
import CanvasArea from '@/components/drawing/CanvasArea';
import SavedDrawingsDialog from '@/components/drawing/SavedDrawingsDialog';
import { useFabricTools } from '@/components/drawing/useFabricTools';
import { fabric } from 'fabric';

interface DrawingCanvasProps {
  width?: number;
  height?: number;
}

const DrawingCanvas = ({ width = 800, height = 600 }: DrawingCanvasProps) => {
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [savedDrawingsOpen, setSavedDrawingsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
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
    exportToFile,
    importFromFile
  } = useFabricTools(fabricCanvas);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        importFromFile(file);
      } else {
        toast.error('Please select a valid JSON file');
      }
      // Clear the input value so the same file can be selected again
      event.target.value = '';
    }
  };

  const handleLoadDrawing = (id: string) => {
    loadFromLocalStorage(id);
  };

  return (
    <div className="flex flex-col space-y-4">
      <CanvasToolbar 
        currentTool={currentTool}
        strokeWidth={strokeWidth}
        color={color}
        drawingName={drawingName}
        onToolChange={handleToolChange}
        onStrokeWidthChange={setStrokeWidth}
        onColorChange={setColor}
        onDrawingNameChange={handleDrawingNameChange}
        onUndo={handleUndo}
        onClear={clearCanvas}
        onDownload={downloadCanvas}
        onSave={saveToLocalStorage}
        onExport={exportToFile}
        onShowSavedDrawings={() => setSavedDrawingsOpen(true)}
        onImport={handleImportClick}
      />
      
      <CanvasArea 
        width={width}
        height={height}
        fabricCanvas={fabricCanvas}
        setFabricCanvas={setFabricCanvas}
      />

      {/* Hidden file input for importing drawings */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,application/json"
        className="hidden"
      />

      {/* Saved drawings dialog */}
      <SavedDrawingsDialog
        open={savedDrawingsOpen}
        onOpenChange={setSavedDrawingsOpen}
        onLoadDrawing={handleLoadDrawing}
      />
    </div>
  );
};

export default DrawingCanvas;
