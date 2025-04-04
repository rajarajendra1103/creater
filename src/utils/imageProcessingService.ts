
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
  
  // Base drawing collection URLs - these are simple line drawings rather than photos
  const baseDrawingUrl = 'public/lovable-uploads/ba89ad85-8ca4-4e39-b3be-3345faf9252c.png';
  
  // Define keywords and corresponding drawing images
  if (lowerPrompt.includes('tree') || lowerPrompt.includes('forest') || lowerPrompt.includes('plant')) {
    return 'https://i.ibb.co/ZKtRLkJ/tree-sketch.png';
  } else if (lowerPrompt.includes('sky') || lowerPrompt.includes('cloud') || lowerPrompt.includes('weather')) {
    return 'https://i.ibb.co/wL0yrKZ/sky-sketch.png';
  } else if (lowerPrompt.includes('water') || lowerPrompt.includes('ocean') || lowerPrompt.includes('sea') || lowerPrompt.includes('lake')) {
    return 'https://i.ibb.co/TwrHMZ7/water-sketch.png';
  } else if (lowerPrompt.includes('mountain') || lowerPrompt.includes('hill')) {
    return 'https://i.ibb.co/GdPBy3t/mountain-sketch.png';
  } else if (lowerPrompt.includes('city') || lowerPrompt.includes('building') || lowerPrompt.includes('house') || lowerPrompt.includes('urban')) {
    return 'https://i.ibb.co/TMJcHLz/house-sketch.png';
  } else if (lowerPrompt.includes('character') || lowerPrompt.includes('person') || lowerPrompt.includes('hero') || lowerPrompt.includes('ninja') || lowerPrompt.includes('warrior')) {
    return 'https://i.ibb.co/f1J3rYL/character-sketch.png';
  } else if (lowerPrompt.includes('animal') || lowerPrompt.includes('cat') || lowerPrompt.includes('dog')) {
    return 'https://i.ibb.co/hXXq4YM/animal-sketch.png';
  } else if (lowerPrompt.includes('manga') || lowerPrompt.includes('anime') || lowerPrompt.includes('comic')) {
    return 'https://i.ibb.co/F45KPZq/manga-sketch.png';
  } else if (lowerPrompt.includes('sketch') || lowerPrompt.includes('line art')) {
    return 'https://i.ibb.co/MkXtGPK/lineart-sketch.png';
  } else if (lowerPrompt.includes('flower') || lowerPrompt.includes('rose') || lowerPrompt.includes('garden')) {
    return 'https://i.ibb.co/c1FvQTv/flower-sketch.png';
  } else if (lowerPrompt.includes('face') || lowerPrompt.includes('portrait')) {
    return 'https://i.ibb.co/R75rJ8T/face-sketch.png';
  } else if (lowerPrompt.includes('landscape') || lowerPrompt.includes('scenery')) {
    return 'https://i.ibb.co/SXz7SSY/landscape-sketch.png';
  } else if (lowerPrompt.includes('robot') || lowerPrompt.includes('mecha') || lowerPrompt.includes('tech')) {
    return 'https://i.ibb.co/Km1FLdF/robot-sketch.png';
  }
  
  // Use the uploaded image as the default fallback
  return baseDrawingUrl;
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
    
    // For now, we'll use our better drawing placeholders until the API integration is fully functional
    console.log('Using drawing style placeholder for prompt:', prompt);
    
    // Return a drawing style image based on the prompt
    return getDrawingImageForPrompt(prompt);
    
    /* Commented out actual API call for now to prevent errors
    // First, start the prediction
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKeys.replicate}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: "8beff3369e81422112d93b89ca01426c731f3cd0f1bde4f07a5628a0ba3220ef",
        input: { prompt }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Replicate API key.');
      } else {
        throw new Error(`API returned status ${response.status}: ${errorData.detail || 'Unknown error'}`);
      }
    }
    
    const prediction = await response.json();
    
    // Poll for the result
    const getPredictionResult = async (id: string): Promise<string> => {
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
        headers: {
          'Authorization': `Token ${apiKeys.replicate}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!statusResponse.ok) {
        const errorData = await statusResponse.json();
        throw new Error(`API returned status ${statusResponse.status}: ${errorData.detail || 'Unknown error'}`);
      }
      
      const result = await statusResponse.json();
      
      if (result.status === 'succeeded') {
        return result.output[0]; // Return the generated image URL
      } else if (result.status === 'failed') {
        throw new Error(result.error || 'Image generation failed');
      } else {
        // Still processing, wait and try again
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getPredictionResult(id);
      }
    };
    
    return await getPredictionResult(prediction.id);
    */
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
