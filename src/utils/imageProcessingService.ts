
import { toast } from 'sonner';

// Note: In a production app, you would not store API keys directly in the code
// Instead, you would use a backend service or environment variables
// These are included here for demonstration purposes only
const API_KEYS = {
  replicate: "r8_QrqqAVtchqQw7fsVISUNUF5Sj4AjoKU38F8z0",
  deepAI: "2ac63084-bc2b-4954-86ce-b7f93db66524",
  removeBg: "XS75Qy3m6PG9B4YeLnnnwNon"
};

/**
 * Converts an image to a manga-style sketch using DeepAI
 */
export const convertImageToSketch = async (imageFile: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch('https://api.deepai.org/api/toonify', {
      method: 'POST',
      headers: {
        'api-key': API_KEYS.deepAI
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
    const formData = new FormData();
    formData.append('image_file', imageFile);
    
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': API_KEYS.removeBg
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
 * Generates an image using Replicate AI
 */
export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
  try {
    // First, start the prediction
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${API_KEYS.replicate}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: "8beff3369e81422112d93b89ca01426c731f3cd0f1bde4f07a5628a0ba3220ef",
        input: { prompt }
      })
    });
    
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    
    const prediction = await response.json();
    
    // Poll for the result
    const getPredictionResult = async (id: string): Promise<string> => {
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
        headers: {
          'Authorization': `Token ${API_KEYS.replicate}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!statusResponse.ok) {
        throw new Error(`API returned status ${statusResponse.status}`);
      }
      
      const result = await statusResponse.json();
      
      if (result.status === 'succeeded') {
        return result.output[0]; // Return the generated image URL
      } else if (result.status === 'failed') {
        throw new Error('Image generation failed');
      } else {
        // Still processing, wait and try again
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getPredictionResult(id);
      }
    };
    
    return await getPredictionResult(prediction.id);
  } catch (error) {
    console.error('Error generating image:', error);
    toast.error('Failed to generate image');
    throw error;
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
