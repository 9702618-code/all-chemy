// src/types/index.ts

export interface Ingredient {
  id: string;
  name: string;
  price: number;
  emoji: string; // Додано
}

export interface Potion {
  id: string;
  name: string;
  type: 'heal' | 'mana' | 'buff';
  value: number;
  emoji: string; // Додано
}

export interface Recipe {
  id: string;
  slot1: string;
  slot2: string;
  resultPotionId: string;
  isUnlocked: boolean;
}

export interface Customer {
  id: number;
  name: string;
  requestedPotionId: string;
  offerPrice: number;
}