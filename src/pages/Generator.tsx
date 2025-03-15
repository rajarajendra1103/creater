
import { useState } from 'react';
import { Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TextPromptForm from '@/components/TextPromptForm';
import ApiKeySettings from '@/components/ApiKeySettings';
import { toast } from 'sonner';

interface GeneratedImage {
  imageUrl: string;
  prompt: string;
}

const Generator = () => {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleGenerate = (result: GeneratedImage) => {
    setGeneratedImages([result, ...generatedImages]);
    setSelectedImageIndex(0);
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `manga-creation-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download image");
    }
  };

  const handleShare = async (imageUrl: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Manga Creation',
          text: 'Check out this manga art I created!',
          url: imageUrl,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        console.error("Share error:", error);
        toast.error("Failed to share image");
      }
    } else {
      navigator.clipboard.writeText(imageUrl);
      toast.success("Image URL copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 page-transition page-enter">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center">
            <h1 className="section-heading mb-3">Text to Drawing Generator</h1>
            <ApiKeySettings />
          </div>
          <p className="section-subheading">
            Describe what you want to create and let AI transform your words into manga art
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="order-2 lg:order-1">
            <Card className="glass-panel overflow-hidden border-0">
              <CardContent className="p-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basic" className="mt-0">
                    <TextPromptForm onGenerate={handleGenerate} />
                  </TabsContent>
                  <TabsContent value="advanced" className="mt-0">
                    <TextPromptForm onGenerate={handleGenerate} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="order-1 lg:order-2">
            <Card className="glass-panel overflow-hidden border-0 h-full">
              <CardContent className="p-6 flex flex-col h-full">
                {selectedImageIndex !== null && generatedImages.length > 0 ? (
                  <div className="flex flex-col h-full">
                    <div className="relative overflow-hidden rounded-lg bg-secondary/30 flex-grow mb-4 flex items-center justify-center">
                      <img 
                        src={generatedImages[selectedImageIndex].imageUrl}
                        alt={generatedImages[selectedImageIndex].prompt}
                        className="object-contain max-w-full max-h-[500px] w-auto h-auto"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-muted-foreground truncate mr-2">
                        {generatedImages[selectedImageIndex].prompt}
                      </p>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleDownload(generatedImages[selectedImageIndex].imageUrl)}
                        >
                          <Download size={18} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleShare(generatedImages[selectedImageIndex].imageUrl)}
                        >
                          <Share2 size={18} />
                        </Button>
                      </div>
                    </div>
                    
                    {generatedImages.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {generatedImages.slice(0, 4).map((img, index) => (
                          <div 
                            key={index}
                            className={`aspect-square rounded-md overflow-hidden cursor-pointer transition-all ${
                              index === selectedImageIndex ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                            }`}
                            onClick={() => setSelectedImageIndex(index)}
                          >
                            <img 
                              src={img.imageUrl} 
                              alt={`Generated ${index}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="rounded-full bg-secondary/50 p-6 mb-4">
                      <div className="w-16 h-16 bg-grid-pattern rounded-lg opacity-30" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No drawings yet</h3>
                    <p className="text-muted-foreground text-sm max-w-xs">
                      Your generated drawings will appear here. Fill out the form and click Generate.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;
