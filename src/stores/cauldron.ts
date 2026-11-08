// src/stores/cauldron.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAlchemistStore } from './alchemist';
import { useInventoryStore } from './inventory';
import type { Recipe } from '../types';

export const useCauldronStore = defineStore('cauldron', () => {
  const alchemist = useAlchemistStore();
  const inventory = useInventoryStore();

  const slot1 = ref<string | null>(null);
  const slot2 = ref<string | null>(null);
  const mpCost = 15;

  // РЕЦЕПТИ (ID мають збігатися з inventory.ts)
  const recipes = ref<Recipe[]>([
    // Level 1
    { id: 'r1', slot1: 'praneph', slot2: 'honey', resultPotionId: 'heal_potion', isUnlocked: false },
    { id: 'r2', slot1: 'brine', slot2: 'wax', resultPotionId: 'mana_potion', isUnlocked: false },
    { id: 'r3', slot1: 'sand', slot2: 'ash', resultPotionId: 'strength_potion', isUnlocked: false },
    { id: 'r4', slot1: 'praneph', slot2: 'brine', resultPotionId: 'antidote', isUnlocked: false },
    
    // Level 2
    { id: 'r5', slot1: 'jelly', slot2: 'sand', resultPotionId: 'invisibility_potion', isUnlocked: false },
    { id: 'r6', slot1: 'ore', slot2: 'praneph', resultPotionId: 'poison_potion', isUnlocked: false },
    { id: 'r7', slot1: 'jelly', slot2: 'brine', resultPotionId: 'mana_potion', isUnlocked: false },
    
    // Level 3
    { id: 'r8', slot1: 'diamond', slot2: 'ash', resultPotionId: 'flight_potion', isUnlocked: false },
    { id: 'r9', slot1: 'fossil', slot2: 'honey', resultPotionId: 'heal_potion', isUnlocked: false },
    { id: 'r10', slot1: 'diamond', slot2: 'ore', resultPotionId: 'poison_potion', isUnlocked: false },
    
    // Level 4
    { id: 'r11', slot1: 'snowflake', slot2: 'juice', resultPotionId: 'ice_potion', isUnlocked: false },
    { id: 'r12', slot1: 'snowflake', slot2: 'wax', resultPotionId: 'mana_potion', isUnlocked: false },
    
    // Level 5+
    { id: 'r13', slot1: 'glow_particle', slot2: 'fossil', resultPotionId: 'fire_potion', isUnlocked: false },
    { id: 'r14', slot1: 'glass', slot2: 'glow_particle', resultPotionId: 'dragon_breath', isUnlocked: false },
    { id: 'r15', slot1: 'crystal', slot2: 'snowflake', resultPotionId: 'life_elixir', isUnlocked: false },
  ]);

  const pinnedRecipes = ref<string[]>([]);

  const togglePinRecipe = (recipeId: string) => {
    const index = pinnedRecipes.value.indexOf(recipeId);
    if (index !== -1) {
      pinnedRecipes.value.splice(index, 1);
    } else {
      if (pinnedRecipes.value.length < 3) {
        pinnedRecipes.value.push(recipeId);
      } else {
        alert("You can pin a maximum of 3 recipes!");
      }
    }
  };

  const setSlot = (slotNum: 1 | 2, ingredientId: string) => {
    if (alchemist.isDead) return; 
    
    const targetSlot = slotNum === 1 ? slot1 : slot2;
    
    if (targetSlot.value) {
      inventory.addIngredient(targetSlot.value);
    }
    
    inventory.removeIngredient(ingredientId);
    targetSlot.value = ingredientId;
  };

  const brew = () => {
    if (alchemist.isDead) return; 
    if (!slot1.value || !slot2.value) return;
    
    if (!alchemist.spendMana(mpCost)) {
      alert("Not enough mana!");
      return;
    }

    // Пошук рецепта
    const recipe = recipes.value.find(r => 
      (r.slot1 === slot1.value && r.slot2 === slot2.value) ||
      (r.slot1 === slot2.value && r.slot2 === slot1.value)
    );

    // Очищення слотів
    slot1.value = null;
    slot2.value = null;

    if (recipe) {
      if (!recipe.isUnlocked) recipe.isUnlocked = true;
      inventory.addPotion(recipe.resultPotionId);
      alert("Synthesis successful! New potion created.");
    } else {
      // Вибух
      const roll = Math.random();
      let damage = 25; 
      let message = "Normal explosion: -25 HP";

      if (roll < 0.1) {
        damage = 75; 
        message = "CATASTROPHE! Triple explosion: -75 HP";
      } else if (roll < 0.3) {
        damage = 50; 
        message = "Strong explosion: -50 HP";
      }
      
      alchemist.takeDamage(damage);
      alert(message);
    }
  };

  return { slot1, slot2, recipes, pinnedRecipes, togglePin: togglePinRecipe, setSlot, brew };
});