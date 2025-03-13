
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageUploader from '@/components/ImageUploader';
import { toast } from 'sonner';

interface ProcessedImage {
  originalUrl: string;
  processedUrl: string;
}

const Upload = () => {
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [activeTab, setActiveTab] = useState("upload");

  const handleImageProcess = (result: ProcessedImage) => {
    setProcessedImage(result);
    setActiveTab("result");
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `manga-sketch-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download image");
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 page-transition page-enter">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="section-heading mb-3">Image to Sketch Converter</h1>
          <p className="section-subheading">
            Upload an image and convert it to a manga-style sketch
          </p>
        </div>

        <Card className="glass-panel overflow-hidden border-0">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="result" disabled={!processedImage}>Result</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-0">
                <ImageUploader onImageProcess={handleImageProcess} />
              </TabsContent>
              
              <TabsContent value="result" className="mt-0">
                {processedImage && (
                  <div className="flex flex-col space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <h3 className="text-lg font-medium mb-2">Original Image</h3>
                        <div className="rounded-lg overflow-hidden bg-secondary/30 aspect-video flex items-center justify-center">
                          <img 
                            src={processedImage.originalUrl} 
                            alt="Original" 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <h3 className="text-lg font-medium mb-2">Converted Sketch</h3>
                        <div className="rounded-lg overflow-hidden bg-secondary/30 aspect-video flex items-center justify-center">
                          <img 
                            src={processedImage.processedUrl} 
                            alt="Processed" 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab("upload")}
                      >
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Upload
                      </Button>
                      
                      <div className="flex space-x-3">
                        <Button 
                          variant="outline" 
                          onClick={() => handleDownload(processedImage.processedUrl)}
                        >
                          <Download size={16} className="mr-2" />
                          Download Sketch
                        </Button>
                        
                        <Button onClick={() => {
                          // In a real app, this would open the drawing canvas with the sketch
                          toast.info("Feature coming soon: Edit in Canvas");
                        }}>
                          Edit in Canvas
                          <ArrowRight size={16} className="ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Upload;
