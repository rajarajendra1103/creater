
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Download, Undo2, Redo2, RefreshCw, ChevronDown, User, Shirt, Palette } from 'lucide-react';
import { toast } from 'sonner';
import Loading from '@/components/ui/Loading';

// Expanded options for character design
const headShapeOptions = [
  'Round', 'Oval', 'Square', 'Heart', 'Triangle', 'Diamond', 'Rectangular'
];

const eyeStyleOptions = {
  male: ['Sharp', 'Narrow', 'Small', 'Focused', 'Serious'],
  female: ['Large Round', 'Expressive', 'Wide', 'Sparkly', 'Gentle']
};

const hairStyleOptions = {
  male: {
    short: ['Buzz Cut', 'Crew Cut', 'Caesar Cut', 'Spiky Hair'],
    medium: ['Textured Crop', 'Side Part', 'Shaggy Hair'],
    long: ['Straight and Flowing', 'Wavy', 'Ponytail', 'Man Bun'],
    unconventional: ['Undercut', 'Mohawk', 'Dreadlocks']
  },
  female: {
    short: ['Pixie Cut', 'Bob Cut', 'Asymmetrical Cut'],
    medium: ['Layered Cut', 'Wavy Lob', 'Braided Styles'],
    long: ['Straight and Sleek', 'Wavy or Curly', 'Twintails', 'Hime Cut'],
    unconventional: ['Space Buns', 'Side Shave', 'Fantasy Styles']
  }
};

const facialHairOptions = [
  'Clean-Shaven', 'Stubble', 'Thin Mustache', 'Thick Mustache', 
  'Goatee', 'Full Beard', 'Sideburns', 'Soul Patch'
];

const outfitOptions = {
  male: ['Casual', 'Formal', 'School Uniform', 'Athletic', 'Fantasy', 'Sci-Fi', 'Military'],
  female: ['Casual', 'Formal', 'School Uniform', 'Athletic', 'Fantasy', 'Sci-Fi', 'Elegant']
};

const bodyProportionOptions = {
  male: ['Athletic', 'Muscular', 'Slender', 'Stocky', 'Average'],
  female: ['Hourglass', 'Slender', 'Athletic', 'Petite', 'Curvy']
};

const emotionOptions = ['Neutral', 'Happy', 'Sad', 'Angry', 'Surprised', 'Thoughtful', 'Determined', 'Shy'];

const CharacterEditor = () => {
  const [gender, setGender] = useState('female');
  const [name, setName] = useState('');
  const [age, setAge] = useState(18);
  
  // Head & Face options
  const [headShape, setHeadShape] = useState(headShapeOptions[0]);
  const [eyeStyle, setEyeStyle] = useState('');
  const [hairLength, setHairLength] = useState('medium');
  const [hairStyle, setHairStyle] = useState('');
  const [facialHair, setFacialHair] = useState('Clean-Shaven');
  
  // Body options
  const [bodyProportion, setBodyProportion] = useState('');
  const [height, setHeight] = useState(170);
  
  // Style options
  const [outfit, setOutfit] = useState('');
  const [emotion, setEmotion] = useState(emotionOptions[0]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [characterImageUrl, setCharacterImageUrl] = useState<string | null>(null);
  
  // State for collapsible sections
  const [headSectionOpen, setHeadSectionOpen] = useState(true);
  const [bodySectionOpen, setBodySectionOpen] = useState(false);
  const [styleSectionOpen, setStyleSectionOpen] = useState(false);

  // Update dependent options when gender changes
  React.useEffect(() => {
    setEyeStyle(eyeStyleOptions[gender as keyof typeof eyeStyleOptions][0]);
    setHairStyle(hairStyleOptions[gender as keyof typeof hairStyleOptions][hairLength][0]);
    setOutfit(outfitOptions[gender as keyof typeof outfitOptions][0]);
    setBodyProportion(bodyProportionOptions[gender as keyof typeof bodyProportionOptions][0]);
    
    // Reset facial hair for female characters
    if (gender === 'female') {
      setFacialHair('Clean-Shaven');
    }
  }, [gender, hairLength]);

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
    // Randomize all character attributes
    const randomGender = Math.random() > 0.5 ? 'male' : 'female';
    setGender(randomGender);
    
    // Randomize basic attributes
    setAge(Math.floor(Math.random() * 30) + 10);
    
    // Randomize head & face
    setHeadShape(headShapeOptions[Math.floor(Math.random() * headShapeOptions.length)]);
    
    const randomHairLength = ['short', 'medium', 'long', 'unconventional'][Math.floor(Math.random() * 4)];
    setHairLength(randomHairLength);
    
    setEyeStyle(eyeStyleOptions[randomGender][Math.floor(Math.random() * eyeStyleOptions[randomGender].length)]);
    
    const randomHairOptions = hairStyleOptions[randomGender][randomHairLength];
    setHairStyle(randomHairOptions[Math.floor(Math.random() * randomHairOptions.length)]);
    
    if (randomGender === 'male') {
      setFacialHair(facialHairOptions[Math.floor(Math.random() * facialHairOptions.length)]);
    }
    
    // Randomize body
    setBodyProportion(bodyProportionOptions[randomGender][Math.floor(Math.random() * bodyProportionOptions[randomGender].length)]);
    setHeight(Math.floor(Math.random() * 40) + 150); // 150-190cm
    
    // Randomize style
    setOutfit(outfitOptions[randomGender][Math.floor(Math.random() * outfitOptions[randomGender].length)]);
    setEmotion(emotionOptions[Math.floor(Math.random() * emotionOptions.length)]);
    
    toast.info("Character randomized! Click Generate to see the result.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Character Options */}
      <div className="space-y-6 overflow-y-auto max-h-[80vh] pr-2">
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
        
        {/* Head & Face Section - Collapsible */}
        <Collapsible 
          open={headSectionOpen} 
          onOpenChange={setHeadSectionOpen}
          className="border rounded-lg p-4"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <User size={18} className="mr-2" />
              <h3 className="text-lg font-medium">Head & Face</h3>
            </div>
            <ChevronDown 
              size={18} 
              className={`transition-transform duration-200 ${headSectionOpen ? 'rotate-180' : ''}`} 
            />
          </CollapsibleTrigger>
          
          <CollapsibleContent className="pt-4 space-y-4">
            <div>
              <Label htmlFor="head-shape" className="mb-2 block">Head Shape</Label>
              <Select value={headShape} onValueChange={setHeadShape}>
                <SelectTrigger id="head-shape">
                  <SelectValue placeholder="Select head shape" />
                </SelectTrigger>
                <SelectContent>
                  {headShapeOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="eye-style" className="mb-2 block">Eye Style</Label>
              <Select value={eyeStyle} onValueChange={setEyeStyle}>
                <SelectTrigger id="eye-style">
                  <SelectValue placeholder="Select eye style" />
                </SelectTrigger>
                <SelectContent>
                  {eyeStyleOptions[gender as keyof typeof eyeStyleOptions].map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="hair-length" className="mb-2 block">Hair Length</Label>
              <Select value={hairLength} onValueChange={setHairLength}>
                <SelectTrigger id="hair-length">
                  <SelectValue placeholder="Select hair length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                  <SelectItem value="unconventional">Unconventional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="hair-style" className="mb-2 block">Hair Style</Label>
              <Select value={hairStyle} onValueChange={setHairStyle}>
                <SelectTrigger id="hair-style">
                  <SelectValue placeholder="Select hair style" />
                </SelectTrigger>
                <SelectContent>
                  {hairStyleOptions[gender as keyof typeof hairStyleOptions][hairLength as keyof typeof hairStyleOptions.male].map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {gender === 'male' && (
              <div>
                <Label htmlFor="facial-hair" className="mb-2 block">Facial Hair</Label>
                <Select value={facialHair} onValueChange={setFacialHair}>
                  <SelectTrigger id="facial-hair">
                    <SelectValue placeholder="Select facial hair" />
                  </SelectTrigger>
                  <SelectContent>
                    {facialHairOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
        
        {/* Body Section - Collapsible */}
        <Collapsible 
          open={bodySectionOpen} 
          onOpenChange={setBodySectionOpen}
          className="border rounded-lg p-4"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Shirt size={18} className="mr-2" />
              <h3 className="text-lg font-medium">Body & Proportions</h3>
            </div>
            <ChevronDown 
              size={18} 
              className={`transition-transform duration-200 ${bodySectionOpen ? 'rotate-180' : ''}`} 
            />
          </CollapsibleTrigger>
          
          <CollapsibleContent className="pt-4 space-y-4">
            <div>
              <Label htmlFor="body-proportion" className="mb-2 block">Body Type</Label>
              <Select value={bodyProportion} onValueChange={setBodyProportion}>
                <SelectTrigger id="body-proportion">
                  <SelectValue placeholder="Select body type" />
                </SelectTrigger>
                <SelectContent>
                  {bodyProportionOptions[gender as keyof typeof bodyProportionOptions].map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="mb-2 block">Height: {height}cm</Label>
              <Slider
                value={[height]}
                min={150}
                max={190}
                step={1}
                onValueChange={(values) => setHeight(values[0])}
                className="w-full"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Style Section - Collapsible */}
        <Collapsible 
          open={styleSectionOpen} 
          onOpenChange={setStyleSectionOpen}
          className="border rounded-lg p-4"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Palette size={18} className="mr-2" />
              <h3 className="text-lg font-medium">Style & Expression</h3>
            </div>
            <ChevronDown 
              size={18} 
              className={`transition-transform duration-200 ${styleSectionOpen ? 'rotate-180' : ''}`} 
            />
          </CollapsibleTrigger>
          
          <CollapsibleContent className="pt-4 space-y-4">
            <div>
              <Label htmlFor="outfit" className="mb-2 block">Outfit</Label>
              <Select value={outfit} onValueChange={setOutfit}>
                <SelectTrigger id="outfit">
                  <SelectValue placeholder="Select outfit" />
                </SelectTrigger>
                <SelectContent>
                  {outfitOptions[gender as keyof typeof outfitOptions].map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="emotion" className="mb-2 block">Expression</Label>
              <Select value={emotion} onValueChange={setEmotion}>
                <SelectTrigger id="emotion">
                  <SelectValue placeholder="Select expression" />
                </SelectTrigger>
                <SelectContent>
                  {emotionOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <div className="flex space-x-3 pt-4">
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
