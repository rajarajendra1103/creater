
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface SavedDrawing {
  id: string;
  name: string;
  preview: string;
  lastModified: string;
}

interface SavedDrawingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadDrawing: (id: string) => void;
}

const SavedDrawingsDialog = ({
  open,
  onOpenChange,
  onLoadDrawing
}: SavedDrawingsDialogProps) => {
  const [savedDrawings, setSavedDrawings] = useState<SavedDrawing[]>([]);

  useEffect(() => {
    if (open) {
      // Load saved drawings when dialog opens
      loadSavedDrawings();
    }
  }, [open]);

  const loadSavedDrawings = () => {
    try {
      const drawings = localStorage.getItem('manga-drawings');
      if (drawings) {
        setSavedDrawings(JSON.parse(drawings));
      } else {
        setSavedDrawings([]);
      }
    } catch (error) {
      console.error('Error loading saved drawings:', error);
      setSavedDrawings([]);
    }
  };

  const handleDeleteDrawing = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // Remove from localStorage
      localStorage.removeItem(id);
      
      // Update the saved drawings list
      const updatedDrawings = savedDrawings.filter(drawing => drawing.id !== id);
      setSavedDrawings(updatedDrawings);
      localStorage.setItem('manga-drawings', JSON.stringify(updatedDrawings));
    } catch (error) {
      console.error('Error deleting drawing:', error);
    }
  };

  const handleLoadDrawing = (id: string) => {
    onLoadDrawing(id);
    onOpenChange(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Saved Drawings</DialogTitle>
          <DialogDescription>
            Click on a drawing to open it in the editor.
          </DialogDescription>
        </DialogHeader>
        
        {savedDrawings.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No saved drawings found.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 max-h-[400px] overflow-y-auto">
            {savedDrawings.map((drawing) => (
              <div 
                key={drawing.id}
                className="group relative border rounded-md overflow-hidden cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleLoadDrawing(drawing.id)}
              >
                <div className="aspect-w-4 aspect-h-3 w-full">
                  <img 
                    src={drawing.preview} 
                    alt={drawing.name}
                    className="object-cover w-full h-40"
                  />
                </div>
                <div className="p-2 bg-muted/50">
                  <h3 className="font-medium text-sm truncate">{drawing.name}</h3>
                  <p className="text-xs text-muted-foreground">{formatDate(drawing.lastModified)}</p>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDeleteDrawing(drawing.id, e)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default SavedDrawingsDialog;
