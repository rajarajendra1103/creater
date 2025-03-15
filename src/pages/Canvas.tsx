
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DrawingCanvas from '@/components/DrawingCanvas';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const Canvas = () => {
  const [canvasSize, setCanvasSize] = useState('medium');
  
  const getCanvasSize = () => {
    switch (canvasSize) {
      case 'small':
        return { width: 600, height: 450 };
      case 'medium':
        return { width: 800, height: 600 };
      case 'large':
        return { width: 1024, height: 768 };
      default:
        return { width: 800, height: 600 };
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 page-transition page-enter">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="section-heading mb-3">Drawing Canvas</h1>
          <p className="section-subheading">
            Sketch and refine your manga artwork with professional drawing tools
          </p>
        </div>

        <Alert variant="default" className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Enhanced Drawing Tools</AlertTitle>
          <AlertDescription>
            This canvas now uses Fabric.js for better drawing capabilities. Try the rectangle, circle, and text tools!
          </AlertDescription>
        </Alert>

        <Card className="glass-panel overflow-hidden border-0">
          <CardContent className="p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="col-span-2">
                <h3 className="text-lg font-medium mb-2">Canvas Size</h3>
                <RadioGroup
                  value={canvasSize}
                  onValueChange={setCanvasSize}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="small" id="size-small" />
                    <Label htmlFor="size-small">Small</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="size-medium" />
                    <Label htmlFor="size-medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="size-large" />
                    <Label htmlFor="size-large">Large</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <DrawingCanvas 
              width={getCanvasSize().width} 
              height={getCanvasSize().height} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Canvas;
