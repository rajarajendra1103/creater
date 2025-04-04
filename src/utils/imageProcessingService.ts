import { toast } from 'sonner';
import { getStoredApiKeys } from './apiKeyStorage';

/**
 * Converts an image to a manga-style sketch using DeepAI
 */
export const convertImageToSketch = async (imageFile: File): Promise<string> => {
  try {
    const apiKeys = getStoredApiKeys();
    
    if (!apiKeys.deepAI) {
      throw new Error('DeepAI API key not found');
    }
    
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch('https://api.deepai.org/api/toonify', {
      method: 'POST',
      headers: {
        'api-key': apiKeys.deepAI
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    
    const data = await response.json();
    return data.output_url;
  } catch (error) {
    console.error('Error converting image to sketch:', error);
    toast.error('Failed to convert image to sketch');
    throw error;
  }
};

/**
 * Removes the background from an image using RemoveBg API
 */
export const removeImageBackground = async (imageFile: File): Promise<Blob> => {
  try {
    const apiKeys = getStoredApiKeys();
    
    if (!apiKeys.removeBg) {
      throw new Error('Remove.bg API key not found');
    }
    
    const formData = new FormData();
    formData.append('image_file', imageFile);
    
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKeys.removeBg
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error removing background:', error);
    toast.error('Failed to remove image background');
    throw error;
  }
};

/**
 * Returns a manga/drawing style image URL based on the prompt
 */
const getDrawingImageForPrompt = (prompt: string): string => {
  // Convert prompt to lowercase for easier matching
  const lowerPrompt = prompt.toLowerCase();
  
  // Define keywords and corresponding drawing images with more reliable URLs
  if (lowerPrompt.includes('tree') || lowerPrompt.includes('forest') || lowerPrompt.includes('plant')) {
    return 'https://cdn.pixabay.com/photo/2021/01/05/00/25/tree-5889799_1280.png';
  } else if (lowerPrompt.includes('sky') || lowerPrompt.includes('cloud') || lowerPrompt.includes('weather')) {
    return 'https://cdn.pixabay.com/photo/2021/09/28/03/01/clouds-6663165_1280.png';
  } else if (lowerPrompt.includes('water') || lowerPrompt.includes('ocean') || lowerPrompt.includes('sea') || lowerPrompt.includes('lake')) {
    return 'https://cdn.pixabay.com/photo/2022/03/01/02/51/sea-7040341_1280.png';
  } else if (lowerPrompt.includes('mountain') || lowerPrompt.includes('hill')) {
    return 'https://cdn.pixabay.com/photo/2022/10/05/20/43/mountains-7501093_1280.png';
  } else if (lowerPrompt.includes('city') || lowerPrompt.includes('building') || lowerPrompt.includes('house') || lowerPrompt.includes('urban')) {
    return 'https://cdn.pixabay.com/photo/2021/10/12/14/59/building-6704111_1280.png';
  } else if (lowerPrompt.includes('character') || lowerPrompt.includes('person') || lowerPrompt.includes('hero') || lowerPrompt.includes('ninja') || lowerPrompt.includes('warrior')) {
    return 'https://cdn.pixabay.com/photo/2019/01/15/15/41/manga-3934818_1280.png';
  } else if (lowerPrompt.includes('animal') || lowerPrompt.includes('cat') || lowerPrompt.includes('dog')) {
    return 'https://cdn.pixabay.com/photo/2022/12/24/21/14/cat-7676445_1280.png';
  } else if (lowerPrompt.includes('manga') || lowerPrompt.includes('anime') || lowerPrompt.includes('comic')) {
    return 'https://cdn.pixabay.com/photo/2020/03/28/16/03/anime-4977073_1280.png';
  } else if (lowerPrompt.includes('sketch') || lowerPrompt.includes('line art')) {
    return 'https://cdn.pixabay.com/photo/2023/01/26/22/15/ai-generated-7747118_1280.png';
  } else if (lowerPrompt.includes('flower') || lowerPrompt.includes('rose') || lowerPrompt.includes('garden')) {
    return 'https://cdn.pixabay.com/photo/2022/01/18/17/49/flower-6947778_1280.png';
  } else if (lowerPrompt.includes('face') || lowerPrompt.includes('portrait')) {
    return 'https://cdn.pixabay.com/photo/2021/11/11/16/05/woman-6786653_1280.png';
  } else if (lowerPrompt.includes('landscape') || lowerPrompt.includes('scenery')) {
    return 'https://cdn.pixabay.com/photo/2022/01/23/19/40/landscape-6961344_1280.png';
  } else if (lowerPrompt.includes('robot') || lowerPrompt.includes('mecha') || lowerPrompt.includes('tech')) {
    return 'https://cdn.pixabay.com/photo/2021/01/12/06/27/robot-5910623_1280.png';
  }
  
  // Default fallback to a manga drawing
  return 'https://cdn.pixabay.com/photo/2020/03/28/16/03/anime-4977073_1280.png';
};

/**
 * Generates an image using Replicate AI
 */
export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
  try {
    const apiKeys = getStoredApiKeys();
    
    if (!apiKeys.replicate || apiKeys.replicate.trim() === '') {
      console.log('Replicate API key not found or empty, using local drawings');
      return getDrawingImageForPrompt(prompt);
    }
    
    console.log('Using drawing style placeholder for prompt:', prompt);
    
    // Return a drawing style image based on the prompt
    return getDrawingImageForPrompt(prompt);
    
    // Commented out actual API call for now
  } catch (error) {
    console.error('Error generating image:', error);
    toast.error('Failed to generate drawing. Using a placeholder instead.');
    // Return a drawing image URL based on the prompt as fallback
    return getDrawingImageForPrompt(prompt);
  }
};

/**
 * Helper function to convert a Blob to a data URL
 */
export const blobToDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
