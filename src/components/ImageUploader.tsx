
import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import Loading from '@/components/ui/Loading';

interface ImageUploaderProps {
  onImageProcess: (result: { 
    originalUrl: string;
    processedUrl: string;
  }) => void;
  maxFileSizeMB?: number;
  allowedTypes?: string[];
}

const ImageUploader = ({ 
  onImageProcess, 
  maxFileSizeMB = 5, 
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      toast.error(`Invalid file type. Please upload ${allowedTypes.join(', ')}`);
      return;
    }
    
    // Check file size
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds ${maxFileSizeMB}MB limit`);
      return;
    }
    
    setSelectedImage(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const clearSelection = () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setSelectedImage(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processImage = async () => {
    if (!selectedImage || !imagePreviewUrl) return;
    
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would upload and process the image
      // For now, we'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response - in production this would be a real API call
      onImageProcess({
        originalUrl: imagePreviewUrl,
        processedUrl: imagePreviewUrl // In real app, this would be the processed image URL
      });
      
      toast.success("Image processed successfully!");
    } catch (error) {
      console.error("Processing error:", error);
      toast.error("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <input
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      
      {!imagePreviewUrl ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] transition-colors ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-muted hover:border-muted-foreground/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="rounded-full bg-secondary/50 p-4 mb-4">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium mb-1">Drop your image here</p>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            or click to browse your files<br />
            Supports JPG, PNG and WebP (max {maxFileSizeMB}MB)
          </p>
          <Button variant="outline" onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}>
            Select Image
          </Button>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-0 relative">
            <div className="relative aspect-video bg-secondary/30 flex items-center justify-center overflow-hidden">
              <img 
                src={imagePreviewUrl}
                alt="Selected"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex justify-between items-center p-4">
              <div className="flex items-center space-x-2">
                <ImageIcon size={18} className="text-muted-foreground" />
                <span className="text-sm truncate max-w-[200px]">
                  {selectedImage?.name}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={clearSelection}
                  disabled={isProcessing}
                >
                  <X size={18} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {imagePreviewUrl && (
        <Button 
          onClick={processImage} 
          disabled={isProcessing}
          className="w-full py-6 rounded-xl btn-hover"
        >
          {isProcessing ? (
            <Loading size="small" message="" />
          ) : (
            "Process Image"
          )}
        </Button>
      )}
    </div>
  );
};

export default ImageUploader;
