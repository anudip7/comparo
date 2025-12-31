
import { PhotoPair } from './types';

/**
 * Exact filenames from the provided screenshot.
 * These files must be located in the same folder as index.html.
 */
export const PHOTO_PAIRS: PhotoPair[] = [
  { id: 1, iphone: 'car dew iphone.jpg', sony: 'car dew sony.jpg', category: 'Automotive Detail' },
  { id: 2, iphone: 'hair flower iphone.jpg', sony: 'hair flower sony.jpg', category: 'Portrait Macro' },
  { id: 3, iphone: 'home iphone.jpg', sony: 'home sony.jpg', category: 'Interior Design' },
  { id: 4, iphone: 'mask iphone.jpg', sony: 'mask sony.jpg', category: 'Art & Culture' },
  { id: 5, iphone: 'pink flower iphone.jpg', sony: 'pink flower sony.jpg', category: 'Floral Close-up' },
  { id: 6, iphone: 'stick plant iphone.jpg', sony: 'stick plant sony.jpg', category: 'Botanical' },
  { id: 7, iphone: 'vase detailed iphone.jpg', sony: 'vase detailed sony.jpg', category: 'Texture Study' },
  { id: 8, iphone: 'vase iphone.jpg', sony: 'vase sony.jpg', category: 'Still Life' },
  { id: 9, iphone: 'yellow flower iphone.jpg', sony: 'yellow flower sony.jpg', category: 'Nature' },
  { id: 10, iphone: 'bushes iphone.jpg', sony: 'bushes sony.jpg', category: 'Landscape' }
];

export const getShuffledPairs = () => [...PHOTO_PAIRS].sort(() => Math.random() - 0.5);
