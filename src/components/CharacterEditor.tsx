
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Download, Undo2, Redo2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import Loading from '@/components/ui/Loading';

const bodyPartOptions = {
  head: ['Round', 'Square', 'Heart-shaped', 'Oval'],
  eyes: ['Large Round', 'Sharp', 'Droopy', 'Small'],
  hair: ['Short Spiky', 'Long Straight', 'Wavy', 'Ponytail'],
  outfit: ['School Uniform', 'Casual', 'Fantasy', 'Futuristic']
};

const emotionOptions = ['Neutral', 'Happy', 'Sad', 'Angry', 'Surprised', 'Thoughtful'];

const CharacterEditor = () => {
  const [gender, setGender] = useState('female');
  const [head, setHead] = useState(bodyPartOptions.head[0]);
  const [eyes, setEyes] = useState(bodyPartOptions.eyes[0]);
  const [hair, setHair] = useState(bodyPartOptions.hair[0]);
  const [outfit, setOutfit] = useState(bodyPartOptions.outfit[0]);
  const [emotion, setEmotion] = useState(emotionOptions[0]);
  const [age, setAge] = useState(18);
  const [name, setName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [characterImageUrl, setCharacterImageUrl] = useState<string | null>(null);

  const generateCharacter = async () => {
    setIsGenerating(true);
    
    try {
      // In a real implementation, this would call an API with the character details
      // For now, we'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock response - in production this would be a real API call
      const mockImageUrl = 'https://images.unsplash.com/photo-1611457194403-d3aca4cf9d11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=686&q=80';
      setCharacterImageUrl(mockImageUrl);
      
      toast.success("Character generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate character. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const downloadCharacter = async () => {
    if (!characterImageUrl) return;
    
    try {
      const response = await fetch(characterImageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const characterName = name || 'manga-character';
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${characterName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Character downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download character");
    }
  };

  const randomizeCharacter = () => {
    setHead(bodyPartOptions.head[Math.floor(Math.random() * bodyPartOptions.head.length)]);
    setEyes(bodyPartOptions.eyes[Math.floor(Math.random() * bodyPartOptions.eyes.length)]);
    setHair(bodyPartOptions.hair[Math.floor(Math.random() * bodyPartOptions.hair.length)]);
    setOutfit(bodyPartOptions.outfit[Math.floor(Math.random() * bodyPartOptions.outfit.length)]);
    setEmotion(emotionOptions[Math.floor(Math.random() * emotionOptions.length)]);
    setAge(Math.floor(Math.random() * 30) + 10);
    
    toast.info("Character randomized! Click Generate to see the result.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Character Options */}
      <div className="space-y-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Base Attributes</h3>
          
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Character Name</Label>
              <Input 
                placeholder="Enter character name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            
            <div>
              <Label className="mb-2 block">Gender</Label>
              <RadioGroup
                value={gender}
                onValueChange={setGender}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="gender-male" />
                  <Label htmlFor="gender-male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="gender-female" />
                  <Label htmlFor="gender-female">Female</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label className="mb-2 block">Age: {age}</Label>
              <Slider
                value={[age]}
                min={10}
                max={60}
                step={1}
                onValueChange={(values) => setAge(values[0])}
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Character Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="head-select" className="mb-2 block">Head Shape</Label>
              <Select value={head} onValueChange={setHead}>
                <SelectTrigger id="head-select">
                  <SelectValue placeholder="Select head shape" />
                </SelectTrigger>
                <SelectContent>
                  {bodyPartOptions.head.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="eyes-select" className="mb-2 block">Eye Style</Label>
              <Select value={eyes} onValueChange={setEyes}>
                <SelectTrigger id="eyes-select">
                  <SelectValue placeholder="Select eye style" />
                </SelectTrigger>
                <SelectContent>
                  {bodyPartOptions.eyes.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="hair-select" className="mb-2 block">Hair Style</Label>
              <Select value={hair} onValueChange={setHair}>
                <SelectTrigger id="hair-select">
                  <SelectValue placeholder="Select hair style" />
                </SelectTrigger>
                <SelectContent>
                  {bodyPartOptions.hair.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="outfit-select" className="mb-2 block">Outfit</Label>
              <Select value={outfit} onValueChange={setOutfit}>
                <SelectTrigger id="outfit-select">
                  <SelectValue placeholder="Select outfit" />
                </SelectTrigger>
                <SelectContent>
                  {bodyPartOptions.outfit.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Expression</h3>
          
          <div>
            <Label htmlFor="emotion-select" className="mb-2 block">Emotion</Label>
            <Select value={emotion} onValueChange={setEmotion}>
              <SelectTrigger id="emotion-select">
                <SelectValue placeholder="Select emotion" />
              </SelectTrigger>
              <SelectContent>
                {emotionOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={randomizeCharacter}
          >
            <RefreshCw size={18} className="mr-2" />
            Randomize
          </Button>
          
          <Button 
            className="flex-1 py-6 rounded-xl btn-hover"
            onClick={generateCharacter}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loading size="small" message="" />
            ) : (
              "Generate Character"
            )}
          </Button>
        </div>
      </div>
      
      {/* Character Preview */}
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-medium mb-3">Character Preview</h3>
        
        <div className="bg-secondary/30 rounded-lg flex-grow flex items-center justify-center p-4 min-h-[400px]">
          {characterImageUrl ? (
            <img 
              src={characterImageUrl} 
              alt="Generated character" 
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-center">
              <div className="w-32 h-32 bg-grid-pattern rounded-full mx-auto opacity-30 mb-4" />
              <p className="text-muted-foreground">
                Customize your character and click Generate
              </p>
            </div>
          )}
        </div>
        
        {characterImageUrl && (
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCharacterImageUrl(null)}
            >
              <Undo2 size={18} className="mr-2" />
              Reset
            </Button>
            
            <Button 
              onClick={downloadCharacter}
            >
              <Download size={18} className="mr-2" />
              Download Character
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterEditor;
