
export interface UserProfile {
  name: string;
  ageGroup: string;
  mbti: string;
  zodiac: string;
  mood: string;
  preferences: string;
}

export interface Ingredient {
  item: string;
  amount: string;
}

export interface CocktailRecipe {
  name: string;
  tagline: string;
  story: string;
  ingredients: Ingredient[];
  glassware: string;
  garnish: string;
  instructions: string;
  visualDescription: string;
}

export interface GeneratedCocktail extends CocktailRecipe {
  imageUrl?: string;
}

export interface InventoryItem {
  name: string;
  category: 'Spirit' | 'Mixer' | 'Fresh' | 'Other';
}

export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING_RECIPE = 'GENERATING_RECIPE',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export const MBTI_TYPES = [
  'ENFJ', 'ENFP', 'ENTJ', 'ENTP',
  'ESFJ', 'ESFP', 'ESTJ', 'ESTP',
  'INFJ', 'INFP', 'INTJ', 'INTP',
  'ISFJ', 'ISFP', 'ISTJ', 'ISTP'
];

export const ZODIAC_SIGNS = [
  'Capricorn', 'Aquarius', 'Pisces', 'Aries', 
  'Taurus', 'Gemini', 'Cancer', 'Leo', 
  'Virgo', 'Libra', 'Scorpio', 'Sagittarius'
];

export const AGE_GROUPS = [
  { label: 'Select your era...', value: '' },
  { label: 'Born 2004 or later (Under 21)', value: 'underage' },
  { label: 'Gen Z (Born 2000 - 2003)', value: 'Gen Z (Ages 21-25)' },
  { label: 'Zennial / Late Millennial (1995 - 1999)', value: 'Zennial (Ages 26-30)' },
  { label: 'Core Millennial (1990 - 1994)', value: 'Core Millennial (Ages 31-35)' },
  { label: 'Elder Millennial (1981 - 1989)', value: 'Elder Millennial (Ages 36-44)' },
  { label: 'Gen X (1965 - 1980)', value: 'Gen X (Ages 45-60)' },
  { label: 'Boomer & Beyond (Born 1964 or earlier)', value: 'Boomer (Ages 61+)' }
];
