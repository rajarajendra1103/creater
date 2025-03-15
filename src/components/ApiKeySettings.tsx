
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getStoredApiKeys, storeApiKeys, hasApiKey, ApiKeys } from '@/utils/apiKeyStorage';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Settings } from 'lucide-react';

const ApiKeySettings = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Load existing API keys
    setApiKeys(getStoredApiKeys());
  }, [open]);

  const handleSave = () => {
    try {
      storeApiKeys(apiKeys);
      toast.success("API keys saved successfully");
      setOpen(false);
    } catch (error) {
      console.error("Error saving API keys:", error);
      toast.error("Failed to save API keys");
    }
  };

  const handleChange = (keyName: keyof ApiKeys, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [keyName]: value.trim()
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="ml-2" title="API Settings">
          <Settings size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Key Settings</DialogTitle>
          <DialogDescription>
            Enter your API keys for different services. Your keys are stored securely in your browser.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="replicate">Replicate API Key</Label>
            <Input
              id="replicate"
              type="password"
              value={apiKeys.replicate || ''}
              onChange={(e) => handleChange('replicate', e.target.value)}
              placeholder="r8_..."
            />
            <p className="text-xs text-muted-foreground">
              Used for text-to-image generation. Get your key at <a href="https://replicate.com/" target="_blank" rel="noopener noreferrer" className="underline">replicate.com</a>
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deepAI">DeepAI API Key</Label>
            <Input
              id="deepAI"
              type="password"
              value={apiKeys.deepAI || ''}
              onChange={(e) => handleChange('deepAI', e.target.value)}
              placeholder="..."
            />
            <p className="text-xs text-muted-foreground">
              Used for image toonification. Get your key at <a href="https://deepai.org/" target="_blank" rel="noopener noreferrer" className="underline">deepai.org</a>
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="removeBg">Remove.bg API Key</Label>
            <Input
              id="removeBg"
              type="password"
              value={apiKeys.removeBg || ''}
              onChange={(e) => handleChange('removeBg', e.target.value)}
              placeholder="..."
            />
            <p className="text-xs text-muted-foreground">
              Used for background removal. Get your key at <a href="https://www.remove.bg/" target="_blank" rel="noopener noreferrer" className="underline">remove.bg</a>
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeySettings;
