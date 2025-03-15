
// API key storage in localStorage with encryption
const API_KEYS_STORAGE_KEY = 'manga_app_api_keys';

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
    if (!storedKeys) return {};
    
    const decryptedKeys = decrypt(storedKeys);
    return JSON.parse(decryptedKeys);
  } catch (e) {
    console.error('Error retrieving API keys:', e);
    return {};
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
  return !!keys[keyName];
};

// Clear all stored API keys
export const clearApiKeys = (): void => {
  localStorage.removeItem(API_KEYS_STORAGE_KEY);
};
