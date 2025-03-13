import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Undo2, Redo2, RefreshCw, ChevronDown, User, Shirt, Palette, Upload, Image, Footprints, Pointer } from 'lucide-react';
import { toast } from 'sonner';
import Loading from '@/components/ui/Loading';
import ImageUploader from '@/components/ImageUploader';

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

// Body proportion options expanded
const bodyProportionOptions = {
  male: ['Athletic', 'Muscular', 'Slender', 'Stocky', 'Average'],
  female: ['Hourglass', 'Slender', 'Athletic', 'Petite', 'Curvy']
};

// Torso options
const torsoOptions = {
  male: {
    chest: ['Broad V-Shape', 'Muscular', 'Average', 'Slim'],
    waist: ['Straight', 'Slightly Tapered', 'Athletic', 'Broad'],
    abs: ['Defined', 'Subtle', 'Toned', 'Not Visible']
  },
  female: {
    chest: ['Small', 'Medium', 'Large', 'Athletic'],
    waist: ['Narrow', 'Average', 'Defined', 'Athletic'],
    hips: ['Wider than Shoulders', 'Proportional', 'Narrow', 'Curvy']
  }
};

// Arms and hands
const armOptions = {
  male: {
    arms: ['Muscular', 'Thick', 'Defined', 'Average'],
    hands: ['Large', 'Broad', 'Average', 'Detailed']
  },
  female: {
    arms: ['Slender', 'Delicate', 'Toned', 'Average'],
    hands: ['Small', 'Slender', 'Tapered Fingers', 'Elegant']
  }
};

// Legs and hips
const legOptions = {
  male: {
    hips: ['Narrow', 'Straight', 'Athletic', 'Tapered'],
    legs: ['Muscular', 'Thick', 'Athletic', 'Long'],
    feet: ['Large', 'Broad', 'Average', 'Detailed']
  },
  female: {
    hips: ['Wide', 'Rounded', 'Curvy', 'Proportional'],
    legs: ['Long', 'Slender', 'Toned', 'Elegant'],
    feet: ['Small', 'Delicate', 'Average', 'Dainty']
  }
};

// Pose and expression options
const poseOptions = {
  male: ['Confident Stance', 'Action Ready', 'Relaxed', 'Arms Crossed', 'Dynamic', 'Heroic'],
  female: ['Graceful', 'Elegant', 'Playful', 'Dynamic', 'Relaxed', 'Poised']
};

const expressionOptions = {
  male: ['Serious', 'Determined', 'Brooding', 'Stoic', 'Confident', 'Amused'],
  female: ['Expressive', 'Joyful', 'Gentle', 'Serious', 'Confident', 'Playful']
};

// Base emotions for both
const emotionOptions = ['Neutral', 'Happy', 'Sad', 'Angry', 'Surprised', 'Thoughtful', 'Determined', 'Shy'];

// Coloring options
const skinToneOptions = {
  male: ['Warm Medium', 'Tan', 'Dark', 'Olive', 'Fair', 'Deep Brown'],
  female: ['Fair', 'Light', 'Medium', 'Olive', 'Tan', 'Dark']
};

const hairColorOptions = {
  male: ['Black', 'Brown', 'Blonde', 'Red', 'Grey', 'White', 'Blue', 'Green'],
  female: ['Black', 'Brown', 'Blonde', 'Red', 'Pink', 'Purple', 'Blue', 'White', 'Silver', 'Pastel']
};

const outfitColorOptions = {
  male: ['Dark Blue', 'Black', 'Grey', 'Brown', 'Deep Red', 'Forest Green', 'Navy'],
  female: ['Pink', 'Purple', 'Light Blue', 'Yellow', 'Red', 'White', 'Pastel Green', 'Lavender']
};

const outfitOptions = {
  male: ['Casual', 'Formal', 'School Uniform', 'Athletic', 'Fantasy', 'Sci-Fi', 'Military'],
  female: ['Casual', 'Formal', 'School Uniform', 'Athletic', 'Fantasy', 'Sci-Fi', 'Elegant']
};

const CharacterEditor = () => {
  const [gender, setGender] = useState('female');
  const [name, setName] = useState('');
  const [age, setAge] = useState(18);
  const [designMode, setDesignMode] = useState('manual');
  
  // Head & Face options
  const [headShape, setHeadShape] = useState(headShapeOptions[0]);
  const [eyeStyle, setEyeStyle] = useState('');
  const [hairLength, setHairLength] = useState('medium');
  const [hairStyle, setHairStyle] = useState('');
  const [facialHair, setFacialHair] = useState('Clean-Shaven');
  
  // Body options
  const [bodyProportion, setBodyProportion] = useState('');
  const [height, setHeight] = useState(170);
  
  // New torso options
  const [chestType, setChestType] = useState('');
  const [waistType, setWaistType] = useState('');
  const [hipType, setHipType] = useState('');
  const [absType, setAbsType] = useState('');
  
  // Arms and hands options
  const [armType, setArmType] = useState('');
  const [handType, setHandType] = useState('');
  
  // Legs and feet options
  const [legType, setLegType] = useState('');
  const [footType, setFootType] = useState('');
  
  // Pose and expression
  const [poseType, setPoseType] = useState('');
  const [expressionType, setExpressionType] = useState('');
  const [emotion, setEmotion] = useState(emotionOptions[0]);
  
  // Coloring options
  const [skinTone, setSkinTone] = useState('');
  const [hairColor, setHairColor] = useState('');
  const [outfitColor, setOutfitColor] = useState('');
  
  // Style options
  const [outfit, setOutfit] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [characterImageUrl, setCharacterImageUrl] = useState<string | null>(null);
  const [uploadedFeatureImages, setUploadedFeatureImages] = useState<Record<string, string>>({});
  
  // State for collapsible sections
  const [headSectionOpen, setHeadSectionOpen] = useState(true);
  const [bodySectionOpen, setBodySectionOpen] = useState(false);
  const [limbSectionOpen, setLimbSectionOpen] = useState(false);
  const [poseSectionOpen, setPoseSectionOpen] = useState(false);
  const [styleSectionOpen, setStyleSectionOpen] = useState(false);
  const [colorSectionOpen, setColorSectionOpen] = useState(false);

  // Update dependent options when gender changes
  React.useEffect(() => {
    setEyeStyle(eyeStyleOptions[gender as keyof typeof eyeStyleOptions][0]);
    setHairStyle(hairStyleOptions[gender as keyof typeof hairStyleOptions][hairLength][0]);
    setOutfit(outfitOptions[gender as keyof typeof outfitOptions][0]);
    setBodyProportion(bodyProportionOptions[gender as keyof typeof bodyProportionOptions][0]);
    
    // Set torso options based on gender
    if (gender === 'male') {
      setChestType(torsoOptions.male.chest[0]);
      setWaistType(torsoOptions.male.waist[0]);
      setAbsType(torsoOptions.male.abs[0]);
      setHipType(legOptions.male.hips[0]);
    } else {
      setChestType(torsoOptions.female.chest[0]);
      setWaistType(torsoOptions.female.waist[0]);
      setHipType(torsoOptions.female.hips[0]);
    }
    
    // Set limb options based on gender
    setArmType(armOptions[gender as keyof typeof armOptions].arms[0]);
    setHandType(armOptions[gender as keyof typeof armOptions].hands[0]);
    setLegType(legOptions[gender as keyof typeof legOptions].legs[0]);
    setFootType(legOptions[gender as keyof typeof legOptions].feet[0]);
    
    // Set pose and expression
    setPoseType(poseOptions[gender as keyof typeof poseOptions][0]);
    setExpressionType(expressionOptions[gender as keyof typeof expressionOptions][0]);
    
    // Set coloring options
    setSkinTone(skinToneOptions[gender as keyof typeof skinToneOptions][0]);
    setHairColor(hairColorOptions[gender as keyof typeof hairColorOptions][0]);
    setOutfitColor(outfitColorOptions[gender as keyof typeof outfitColorOptions][0]);
    
    // Reset facial hair for female characters
    if (gender === 'female') {
      setFacialHair('Clean-Shaven');
    }
  }, [gender, hairLength]);

  const handleFeatureUpload = (featureType: string, result: { originalUrl: string; processedUrl: string }) => {
    setUploadedFeatureImages(prev => ({
      ...prev,
      [featureType]: result.processedUrl
    }));
    
    toast.success(`Custom ${featureType} uploaded successfully!`);
  };

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
      
      // Randomize male-specific body options
      setChestType(torsoOptions.male.chest[Math.floor(Math.random() * torsoOptions.male.chest.length)]);
      setWaistType(torsoOptions.male.waist[Math.floor(Math.random() * torsoOptions.male.waist.length)]);
      setAbsType(torsoOptions.male.abs[Math.floor(Math.random() * torsoOptions.male.abs.length)]);
    } else {
      // Randomize female-specific body options
      setChestType(torsoOptions.female.chest[Math.floor(Math.random() * torsoOptions.female.chest.length)]);
      setWaistType(torsoOptions.female.waist[Math.floor(Math.random() * torsoOptions.female.waist.length)]);
      setHipType(torsoOptions.female.hips[Math.floor(Math.random() * torsoOptions.female.hips.length)]);
    }
    
    // Randomize body
    setBodyProportion(bodyProportionOptions[randomGender][Math.floor(Math.random() * bodyProportionOptions[randomGender].length)]);
    setHeight(Math.floor(Math.random() * 40) + 150); // 150-190cm
    
    // Randomize arms and hands
    setArmType(armOptions[randomGender].arms[Math.floor(Math.random() * armOptions[randomGender].arms.length)]);
    setHandType(armOptions[randomGender].hands[Math.floor(Math.random() * armOptions[randomGender].hands.length)]);
    
    // Randomize legs and feet
    setLegType(legOptions[randomGender].legs[Math.floor(Math.random() * legOptions[randomGender].legs.length)]);
    setFootType(legOptions[randomGender].feet[Math.floor(Math.random() * legOptions[randomGender].feet.length)]);
    
    // Randomize pose and expression
    setPoseType(poseOptions[randomGender][Math.floor(Math.random() * poseOptions[randomGender].length)]);
    setExpressionType(expressionOptions[randomGender][Math.floor(Math.random() * expressionOptions[randomGender].length)]);
    setEmotion(emotionOptions[Math.floor(Math.random() * emotionOptions.length)]);
    
    // Randomize colors
    setSkinTone(skinToneOptions[randomGender][Math.floor(Math.random() * skinToneOptions[randomGender].length)]);
    setHairColor(hairColorOptions[randomGender][Math.floor(Math.random() * hairColorOptions[randomGender].length)]);
    setOutfitColor(outfitColorOptions[randomGender][Math.floor(Math.random() * outfitColorOptions[randomGender].length)]);
    
    // Randomize style
    setOutfit(outfitOptions[randomGender][Math.floor(Math.random() * outfitOptions[randomGender].length)]);
    
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
            
            <div>
              <Label className="mb-2 block">Design Method</Label>
              <Tabs defaultValue="manual" value={designMode} onValueChange={setDesignMode} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="manual">Manual Design</TabsTrigger>
                  <TabsTrigger value="upload">Upload Features</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        
        {designMode === "manual" ? (
          <>
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
            
            {/* Body & Torso Section - Collapsible */}
            <Collapsible 
              open={bodySectionOpen} 
              onOpenChange={setBodySectionOpen}
              className="border rounded-lg p-4"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Shirt size={18} className="mr-2" />
                  <h3 className="text-lg font-medium">Body & Torso</h3>
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
                
                <div>
                  <Label htmlFor="chest-type" className="mb-2 block">Chest</Label>
                  <Select 
                    value={chestType} 
                    onValueChange={setChestType}
                  >
                    <SelectTrigger id="chest-type">
                      <SelectValue placeholder="Select chest type" />
                    </SelectTrigger>
                    <SelectContent>
                      {gender === 'male' 
                        ? torsoOptions.male.chest.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))
                        : torsoOptions.female.chest.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="waist-type" className="mb-2 block">Waist</Label>
                  <Select 
                    value={waistType} 
                    onValueChange={setWaistType}
                  >
                    <SelectTrigger id="waist-type">
                      <SelectValue placeholder="Select waist type" />
                    </SelectTrigger>
                    <SelectContent>
                      {gender === 'male' 
                        ? torsoOptions.male.waist.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))
                        : torsoOptions.female.waist.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                
                {gender === 'male' ? (
                  <div>
                    <Label htmlFor="abs-type" className="mb-2 block">Abs</Label>
                    <Select 
                      value={absType} 
                      onValueChange={setAbsType}
                    >
                      <SelectTrigger id="abs-type">
                        <SelectValue placeholder="Select abs definition" />
                      </SelectTrigger>
                      <SelectContent>
                        {torsoOptions.male.abs.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="hip-type" className="mb-2 block">Hips</Label>
                    <Select 
                      value={hipType} 
                      onValueChange={setHipType}
                    >
                      <SelectTrigger id="hip-type">
                        <SelectValue placeholder="Select hip type" />
                      </SelectTrigger>
                      <SelectContent>
                        {torsoOptions.female.hips.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
            
            {/* Arms & Legs Section - Collapsible */}
            <Collapsible 
              open={limbSectionOpen} 
              onOpenChange={setLimbSectionOpen}
              className="border rounded-lg p-4"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Footprints size={18} className="mr-2" />
                  <h3 className="text-lg font-medium">Arms & Legs</h3>
                </div>
                <ChevronDown 
                  size={18} 
                  className={`transition-transform duration-200 ${limbSectionOpen ? 'rotate-180' : ''}`} 
                />
              </CollapsibleTrigger>
              
              <CollapsibleContent className="pt-4 space-y-4">
                <div>
                  <Label htmlFor="arm-type" className="mb-2 block">Arms</Label>
                  <Select 
                    value={armType} 
                    onValueChange={setArmType}
                  >
                    <SelectTrigger id="arm-type">
                      <SelectValue placeholder="Select arm type" />
                    </SelectTrigger>
                    <SelectContent>
                      {armOptions[gender as keyof typeof armOptions].arms.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="hand-type" className="mb-2 block">Hands</Label>
                  <Select 
                    value={handType} 
                    onValueChange={setHandType}
                  >
                    <SelectTrigger id="hand-type">
                      <SelectValue placeholder="Select hand type" />
                    </SelectTrigger>
                    <SelectContent>
                      {armOptions[gender as keyof typeof armOptions].hands.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="leg-type" className="mb-2 block">Legs</Label>
                  <Select 
                    value={legType} 
                    onValueChange={setLegType}
                  >
                    <SelectTrigger id="leg-type">
                      <SelectValue placeholder="Select leg type" />
                    </SelectTrigger>
                    <SelectContent>
                      {legOptions[gender as keyof typeof legOptions].legs.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="foot-type" className="mb-2 block">Feet</Label>
                  <Select 
                    value={footType} 
                    onValueChange={setFootType}
                  >
                    <SelectTrigger id="foot-type">
                      <SelectValue placeholder="Select foot type" />
                    </SelectTrigger>
                    <SelectContent>
                      {legOptions[gender as keyof typeof legOptions].feet.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            {/* Pose & Expression Section - Collapsible */}
            <Collapsible 
              open={poseSectionOpen} 
              onOpenChange={setPoseSectionOpen}
              className="border rounded-lg p-4"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Pointer size={18} className="mr-2" />
                  <h3 className="text-lg font-medium">Pose & Expression</h3>
                </div>
                <ChevronDown 
                  size={18} 
                  className={`transition-transform duration-200 ${poseSectionOpen ? 'rotate-180' : ''}`} 
                />
              </CollapsibleTrigger>
              
              <CollapsibleContent className="pt-4 space-y-4">
                <div>
                  <Label htmlFor="pose-type" className="mb-2 block">Pose</Label>
                  <Select 
                    value={poseType} 
                    onValueChange={setPoseType}
                  >
                    <SelectTrigger id="pose-type">
                      <SelectValue placeholder="Select pose" />
                    </SelectTrigger>
                    <SelectContent>
                      {poseOptions[gender as keyof typeof poseOptions].map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="expression-type" className="mb-2 block">Expression Style</Label>
                  <Select 
                    value={expressionType} 
                    onValueChange={setExpressionType}
                  >
                    <SelectTrigger id="expression-type">
                      <SelectValue placeholder="Select expression style" />
                    </SelectTrigger>
                    <SelectContent>
                      {expressionOptions[gender as keyof typeof expressionOptions].map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="emotion" className="mb-2 block">Emotion</Label>
                  <Select value={emotion} onValueChange={setEmotion}>
                    <SelectTrigger id="emotion">
                      <SelectValue placeholder="Select emotion" />
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
            
            {/* Coloring Section - Collapsible */}
            <Collapsible 
              open={colorSectionOpen} 
              onOpenChange={setColorSectionOpen}
              className="border rounded-lg p-4"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Palette size={18} className="mr-2" />
                  <h3 className="text-lg font-medium">Coloring</h3>
                </div>
                <ChevronDown 
                  size={18} 
                  className={`transition-transform duration-200 ${colorSectionOpen ? 'rotate-180' : ''}`} 
                />
              </CollapsibleTrigger>
