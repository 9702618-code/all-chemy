<!-- src/components/PinnedRecipes.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { useCauldronStore } from '../stores/cauldron';
import { useInventoryStore } from '../stores/inventory';

const cauldron = useCauldronStore();
const inventory = useInventoryStore();

const potionNames: Record<string, string> = {
  'heal_potion': 'Healing Potion', 'mana_potion': 'Mana Potion', 'strength_potion': 'Strength Potion',
  'antidote': 'Antidote', 'invisibility_potion': 'Invisibility Potion', 'poison_potion': 'Poison',
  'flight_potion': 'Flight Potion', 'ice_potion': 'Ice Potion', 'fire_potion': 'Fire Potion',
  'dragon_breath': 'Dragon Breath', 'life_elixir': 'Life Elixir'
};

const pinnedList = computed(() => {
  return cauldron.pinnedRecipes
    .map(id => cauldron.recipes.find(r => r.id === id))
    .filter(r => r !== undefined);
});
</script>

<template>
  <div class="pinned-panel">
    <h3>📌 Pinned Recipes</h3>
    
    <div v-if="pinnedList.length === 0" class="empty">
      No pinned recipes.
    </div>
    
    <ul v-else>
      <li v-for="recipe in pinnedList" :key="recipe.id" class="pinned-item">
        <div class="title">
          {{ inventory.potionEmojis[recipe.resultPotionId] || '🧪' }} 
          {{ potionNames[recipe.resultPotionId] }}
        </div>
        <div class="ingredients">
          {{ inventory.getIngredientName(recipe.slot1) }} + 
          {{ inventory.getIngredientName(recipe.slot2) }}
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* ... (стилі залишаються без змін) ... */
.pinned-panel { border: 2px solid #a5d6a7; padding: 15px; border-radius: 0px; background: #ffffff; color: #2e3b2e; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
h3 { margin-top: 0; font-size: 1.1rem; color: #1b5e20; }
ul { list-style: none; padding: 0; margin: 0; }
.pinned-item { background: #f1f8e9; padding: 10px; border-radius: 0px; margin-bottom: 8px; border-left: 4px solid #f57f17; border-top: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0; border-bottom: 1px solid #e0e0e0; }
.title { font-weight: bold; color: #1b5e20; margin-bottom: 4px; font-size: 0.95em; }
.ingredients { font-size: 0.85em; color: #4a5a4a; }
.empty { color: #6b7a6b; font-style: italic; font-size: 0.9em; text-align: center; }
</style>