<!-- src/components/RecipeBook.vue -->
<script setup lang="ts">
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
</script>

<template>
  <div class="recipe-book">
    <ul>
      <li v-for="recipe in cauldron.recipes" :key="recipe.id" class="recipe-item">
        <template v-if="recipe.isUnlocked">
          <div class="recipe-header">
            <div class="recipe-title">✅ {{ potionNames[recipe.resultPotionId] || recipe.resultPotionId }}</div>
            <button 
              class="pin-btn" 
              @click.stop="cauldron.togglePin(recipe.id)" 
              :class="{ 'is-pinned': cauldron.pinnedRecipes.includes(recipe.id) }" 
              :title="cauldron.pinnedRecipes.includes(recipe.id) ? 'Unpin' : 'Pin'"
            >
              📌
            </button>
          </div>
          <div class="recipe-ingredients">
            {{ inventory.getIngredientName(recipe.slot1) }} + 
            {{ inventory.getIngredientName(recipe.slot2) }}
          </div>
        </template>
        <template v-else>
          <div class="recipe-title locked">❓ Unknown Recipe</div>
          <div class="recipe-ingredients locked">??? + ???</div>
        </template>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.recipe-book { padding: 0; font-family: 'Georgia', serif; }
ul { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.recipe-item { padding: 12px; border-radius: 8px; background: #ffffff; border: 1px solid #c8e6c9; transition: background 0.2s, transform 0.2s, box-shadow 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.recipe-item:hover { background: #f1f8e9; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); border-color: #81c784; }
.recipe-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
.recipe-title { font-weight: bold; color: #1b5e20; font-size: 1.05rem; }
.recipe-title.locked { color: #8d9e8d; }
.recipe-ingredients { font-size: 0.9em; color: #4a5a4a; line-height: 1.4; }
.recipe-ingredients.locked { color: #aebdae; font-style: italic; }
.pin-btn { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; font-size: 1.2rem; cursor: pointer; opacity: 0.3; transition: opacity 0.2s, transform 0.2s !important; filter: grayscale(100%); }
.pin-btn:hover { opacity: 1; transform: scale(1.2) !important; filter: grayscale(0%); }
.pin-btn.is-pinned { opacity: 1; filter: drop-shadow(0 0 3px #ffb300); }
</style>