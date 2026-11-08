// src/stores/inventory.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAlchemistStore } from './alchemist';
import type { Ingredient } from '../types';

export const useInventoryStore = defineStore('inventory', () => {
  const alchemist = useAlchemistStore();

  const allIngredients = ref<(Ingredient & { requiredLevel: number })[]>([
    // Level 1
    { id: 'praneph', name: 'Primordy Oil', price: 5, requiredLevel: 1, emoji: '🧪' },
    { id: 'brine', name: 'Deep Brine', price: 8, requiredLevel: 1, emoji: '🧴' },
    { id: 'sand', name: 'Silky Sand', price: 10, requiredLevel: 1, emoji: '🏖️' },
    { id: 'ash', name: 'Lava Dust', price: 12, requiredLevel: 1, emoji: '🌋' },
    { id: 'wax', name: 'Buzz Wax', price: 6, requiredLevel: 1, emoji: '🍯' },
    { id: 'honey', name: 'Wild Honey', price: 15, requiredLevel: 1, emoji: '🐝' },
    
    // Level 2
    { id: 'jelly', name: 'Jellystone', price: 20, requiredLevel: 2, emoji: '🍬' },
    { id: 'ore', name: 'Radiant Ore', price: 25, requiredLevel: 2, emoji: '💎' },
    
    // Level 3
    { id: 'diamond', name: 'Strange Diamond', price: 35, requiredLevel: 3, emoji: '🔷' },
    { id: 'fossil', name: 'Slime Fossil', price: 30, requiredLevel: 3, emoji: '🪨' },
    
    // Level 4
    { id: 'snowflake', name: 'Perfect Snowflake', price: 50, requiredLevel: 4, emoji: '❄️' },
    { id: 'juice', name: 'Sun Sap', price: 45, requiredLevel: 4, emoji: '🍊' },
    { id: 'tin', name: 'Tin Petal', price: 40, requiredLevel: 4, emoji: '🌸' },
    
    // Level 5+
    { id: 'glow_particle', name: 'Lightning Mote', price: 80, requiredLevel: 5, emoji: '✨' },
    { id: 'indigo', name: 'Black Indigonium', price: 90, requiredLevel: 5, emoji: '⬛' },
    { id: 'royal', name: 'Royal Jelly', price: 110, requiredLevel: 5, emoji: '👑' },
    { id: 'glass', name: 'Storm Glass', price: 120, requiredLevel: 6, emoji: '🪟' },
    { id: 'magma', name: 'Magma Comb', price: 150, requiredLevel: 6, emoji: '🌋' },
    { id: 'aqua', name: 'Aqua Glass', price: 150, requiredLevel: 6, emoji: '🌊' },
    { id: 'crystal', name: 'Drift Crystal', price: 200, requiredLevel: 7, emoji: '🔮' },
    { id: 'dream', name: 'Dream Bubble', price: 300, requiredLevel: 8, emoji: '💭' },
  ]);

  const potionEmojis: Record<string, string> = {
    'heal_potion': '❤️', 'mana_potion': '🔮', 'strength_potion': '💪', 'antidote': '🧪',
    'invisibility_potion': '👻', 'poison_potion': '☠️', 'flight_potion': '🕊️', 'ice_potion': '🧊',
    'fire_potion': '🔥', 'dragon_breath': '🐲', 'life_elixir': '✨'
  };

  const market = computed(() => {
    return allIngredients.value.filter(i => alchemist.level >= i.requiredLevel);
  });

  const pantry = ref<Record<string, number>>({});
  const potions = ref<Record<string, number>>({});

  const buyIngredient = (ingredient: Ingredient) => {
    if (alchemist.spendGold(ingredient.price)) {
      pantry.value[ingredient.id] = (pantry.value[ingredient.id] || 0) + 1;
    }
  };

  const addPotion = (potionId: string) => {
    potions.value[potionId] = (potions.value[potionId] || 0) + 1;
  };

  const removePotion = (potionId: string) => {
    if (potions.value[potionId] && potions.value[potionId] > 0) {
      potions.value[potionId]--;
    }
  };

  const removeIngredient = (ingredientId: string) => {
    if (pantry.value[ingredientId] && pantry.value[ingredientId] > 0) {
      pantry.value[ingredientId]--;
    }
  };

  const addIngredient = (ingredientId: string) => {
    pantry.value[ingredientId] = (pantry.value[ingredientId] || 0) + 1;
  };

  const getIngredientName = (id: string) => {
    const item = allIngredients.value.find(i => i.id === id);
    return item ? `${item.emoji} ${item.name}` : id;
  };

  return { 
    market, pantry, potions, 
    buyIngredient, addPotion, removePotion, removeIngredient, 
    getIngredientName, addIngredient, potionEmojis 
  };
});