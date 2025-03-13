
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Loading from '@/components/ui/Loading';
import { toast } from 'sonner';
import { 
  Grid3X3, 
  Download, 
  Text, 
  MessageCircle, 
  Heading, 
  Save, 
  Trash2, 
  Plus, 
  Minus,
  LayoutGrid,
  MoveHorizontal,
  MoveVertical
} from 'lucide-react';
import PanelBubbleEditor from './PanelBubbleEditor';
import PanelTextEditor from './PanelTextEditor';
import PanelGridSelector from './PanelGridSelector';

interface Panel {
  id: string;
  content: string;
  width: number;
  height: number;
}

const PanelEditor = () => {
  const [panelLayout, setPanelLayout] = useState<'2x2' | '3x3' | '1x3' | '3x1' | 'custom'>('2x2');
  const [panels, setPanels] = useState<Panel[]>([]);
  const [activeTab, setActiveTab] = useState('grid');
  const [activePanelId, setActivePanelId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Initialize panels based on layout
  useEffect(() => {
    generatePanels(panelLayout);
  }, [panelLayout]);

  const generatePanels = (layout: string) => {
    const newPanels: Panel[] = [];
    
    // Create panels based on layout
    if (layout === '2x2') {
      for (let i = 0; i < 4; i++) {
        newPanels.push({
          id: `panel-${i}`,
          content: '',
          width: 50,
          height: 50
        });
      }
    } else if (layout === '3x3') {
      for (let i = 0; i < 9; i++) {
        newPanels.push({
          id: `panel-${i}`,
          content: '',
          width: 33.33,
          height: 33.33
        });
      }
    } else if (layout === '1x3') {
      for (let i = 0; i < 3; i++) {
        newPanels.push({
          id: `panel-${i}`,
          content: '',
          width: 100,
          height: 33.33
        });
      }
    } else if (layout === '3x1') {
      for (let i = 0; i < 3; i++) {
        newPanels.push({
          id: `panel-${i}`,
          content: '',
          width: 33.33,
          height: 100
        });
      }
    }
    
    setPanels(newPanels);
    // Select the first panel by default
    if (newPanels.length > 0) {
      setActivePanelId(newPanels[0].id);
    }
  };

  const handlePanelClick = (panelId: string) => {
    setActivePanelId(panelId);
  };

  const updatePanelContent = (id: string, content: string) => {
    setPanels(panels.map(panel => 
      panel.id === id ? { ...panel, content } : panel
    ));
  };

  const downloadManga = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Manga panels exported successfully");
    }, 1500);
  };

  const renderPanelGrid = () => {
    if (panelLayout === '2x2') {
      return (
        <div className="grid grid-cols-2 gap-2 bg-white aspect-[3/4] max-h-[800px] border shadow-sm">
          {panels.map((panel) => (
            <div 
              key={panel.id}
              className={`bg-secondary/20 border-2 ${activePanelId === panel.id ? 'border-primary' : 'border-transparent'}`}
              onClick={() => handlePanelClick(panel.id)}
            >
              <div dangerouslySetInnerHTML={{ __html: panel.content }} className="w-full h-full p-2" />
            </div>
          ))}
        </div>
      );
    } else if (panelLayout === '3x3') {
      return (
        <div className="grid grid-cols-3 gap-1 bg-white aspect-[3/4] max-h-[800px] border shadow-sm">
          {panels.map((panel) => (
            <div 
              key={panel.id}
              className={`bg-secondary/20 border-2 ${activePanelId === panel.id ? 'border-primary' : 'border-transparent'}`}
              onClick={() => handlePanelClick(panel.id)}
            >
              <div dangerouslySetInnerHTML={{ __html: panel.content }} className="w-full h-full p-2" />
            </div>
          ))}
        </div>
      );
    } else if (panelLayout === '1x3') {
      return (
        <div className="grid grid-cols-1 gap-1 bg-white aspect-[3/4] max-h-[800px] border shadow-sm">
          {panels.map((panel) => (
            <div 
              key={panel.id}
              className={`bg-secondary/20 border-2 ${activePanelId === panel.id ? 'border-primary' : 'border-transparent'}`}
              onClick={() => handlePanelClick(panel.id)}
            >
              <div dangerouslySetInnerHTML={{ __html: panel.content }} className="w-full h-full p-2" />
            </div>
          ))}
        </div>
      );
    } else if (panelLayout === '3x1') {
      return (
        <div className="grid grid-cols-3 gap-1 bg-white aspect-[3/4] max-h-[800px] border shadow-sm">
          {panels.map((panel) => (
            <div 
              key={panel.id}
              className={`bg-secondary/20 border-2 h-full ${activePanelId === panel.id ? 'border-primary' : 'border-transparent'}`}
              onClick={() => handlePanelClick(panel.id)}
            >
              <div dangerouslySetInnerHTML={{ __html: panel.content }} className="w-full h-full p-2" />
            </div>
          ))}
        </div>
      );
    }
    
    return null;
  };

  const activePanel = panels.find(p => p.id === activePanelId);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - Canvas */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Page Layout</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={downloadManga}
              disabled={isLoading}
            >
              {isLoading ? <Loading size="small" message="" /> : <Download size={16} className="mr-2" />}
              Export
            </Button>
          </div>

          <div className="flex flex-col space-y-4">
            <PanelGridSelector 
              selectedLayout={panelLayout}
              onSelectLayout={(layout) => setPanelLayout(layout as '2x2' | '3x3' | '1x3' | '3x1' | 'custom')}
            />
            
            <div className="bg-secondary/30 p-6 rounded-lg" ref={canvasRef}>
              {renderPanelGrid()}
            </div>
          </div>
        </div>

        {/* Right side - Editor */}
        <div className="w-full lg:w-[350px]">
          <Tabs defaultValue="grid" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="grid">
                <LayoutGrid size={16} className="mr-1" />
                Layout
              </TabsTrigger>
              <TabsTrigger value="bubble">
                <MessageCircle size={16} className="mr-1" />
                Bubbles
              </TabsTrigger>
              <TabsTrigger value="text">
                <Text size={16} className="mr-1" />
                Text
              </TabsTrigger>
            </TabsList>
            <TabsContent value="grid" className="space-y-4 mt-4">
              <div className="flex flex-col">
                <h3 className="text-base font-medium mb-2">Panel Adjustments</h3>
                <div className="space-y-4">
                  {activePanelId && (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <MoveHorizontal size={16} className="mr-2" />
                          <span className="mr-2 text-sm">Width:</span>
                          <Slider 
                            value={[activePanel?.width || 50]}
                            min={10}
                            max={100}
                            step={5}
                            disabled={!activePanelId}
                            className="flex-1"
                          />
                        </div>
                        <div className="flex items-center">
                          <MoveVertical size={16} className="mr-2" />
                          <span className="mr-2 text-sm">Height:</span>
                          <Slider 
                            value={[activePanel?.height || 50]}
                            min={10}
                            max={100}
                            step={5}
                            disabled={!activePanelId}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          disabled={!activePanelId}
                        >
                          <Trash2 size={14} className="mr-2" />
                          Clear Panel
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="bubble" className="space-y-4 mt-4">
              {activePanelId ? (
                <PanelBubbleEditor 
                  panelId={activePanelId}
                  onAddContent={(content) => {
                    if (activePanel) {
                      updatePanelContent(
                        activePanelId,
                        activePanel.content + content
                      );
                    }
                  }}
                />
              ) : (
                <p className="text-muted-foreground text-sm">Select a panel first to add speech bubbles</p>
              )}
            </TabsContent>
            <TabsContent value="text" className="space-y-4 mt-4">
              {activePanelId ? (
                <PanelTextEditor 
                  panelId={activePanelId}
                  onAddContent={(content) => {
                    if (activePanel) {
                      updatePanelContent(
                        activePanelId,
                        activePanel.content + content
                      );
                    }
                  }}
                />
              ) : (
                <p className="text-muted-foreground text-sm">Select a panel first to add text</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PanelEditor;
