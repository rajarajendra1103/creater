
// API key storage in localStorage with encryption
const API_KEYS_STORAGE_KEY = 'manga_app_api_keys';

// Default API keys
const DEFAULT_API_KEYS = {
  replicate: 'r8_QrqqAVtchqQw7fsVISUNUF5Sj4AjoKU38F8z0',
  removeBg: '2ac63084-bc2b-4954-86ce-b7f93db66524',
  deepAI: 'XS75Qy3m6PG9B4YeLnnnwNon'
};

// Simple encryption to obscure stored keys (not truly secure)
const encrypt = (text: string): string => {
  return btoa(text);
};

// Decrypt the stored keys
const decrypt = (encryptedText: string): string => {
  try {
    return atob(encryptedText);
  } catch (e) {
    return '';
  }
};

export interface ApiKeys {
  replicate?: string;
  deepAI?: string;
  removeBg?: string;
}

// Get stored API keys
export const getStoredApiKeys = (): ApiKeys => {
  try {
    const storedKeys = localStorage.getItem(API_KEYS_STORAGE_KEY);
    if (!storedKeys) return DEFAULT_API_KEYS;
    
    const decryptedKeys = decrypt(storedKeys);
    const parsedKeys = JSON.parse(decryptedKeys);
    
    // Merge with default keys to ensure all keys are present
    return { 
      ...DEFAULT_API_KEYS, 
      ...parsedKeys 
    };
  } catch (e) {
    console.error('Error retrieving API keys:', e);
    return DEFAULT_API_KEYS;
  }
};

// Store API keys
export const storeApiKeys = (keys: ApiKeys): void => {
  try {
    const encryptedKeys = encrypt(JSON.stringify(keys));
    localStorage.setItem(API_KEYS_STORAGE_KEY, encryptedKeys);
  } catch (e) {
    console.error('Error storing API keys:', e);
  }
};

// Check if a specific API key is stored
export const hasApiKey = (keyName: keyof ApiKeys): boolean => {
  const keys = getStoredApiKeys();
  return !!keys[keyName] && keys[keyName]!.trim() !== '';
};

// Clear all stored API keys
export const clearApiKeys = (): void => {
  localStorage.removeItem(API_KEYS_STORAGE_KEY);
};
