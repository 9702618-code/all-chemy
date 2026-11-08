<!-- src/components/PotionsInventory.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { useInventoryStore } from '../stores/inventory';
import { useAlchemistStore } from '../stores/alchemist';

const inventory = useInventoryStore();
const alchemist = useAlchemistStore();

const potionNames: Record<string, string> = {
  'heal_potion': 'Healing Potion', 'mana_potion': 'Mana Potion', 'strength_potion': 'Strength Potion',
  'antidote': 'Antidote', 'invisibility_potion': 'Invisibility Potion', 'poison_potion': 'Poison',
  'flight_potion': 'Flight Potion', 'ice_potion': 'Ice Potion', 'fire_potion': 'Fire Potion',
  'dragon_breath': 'Dragon Breath', 'life_elixir': 'Life Elixir'
};

const visiblePotions = computed(() => {
  const filtered: Record<string, number> = {};
  for (const [id, count] of Object.entries(inventory.potions)) {
    if (count > 0) filtered[id] = count;
  }
  return filtered;
});

const drinkPotion = (potionId: string) => {
  if (alchemist.isDead) return;
  if (potionId === 'heal_potion') alchemist.heal(50);
  else if (potionId === 'mana_potion') alchemist.mp = Math.min(alchemist.maxMp, alchemist.mp + 50);
  else alert(`You drank ${potionNames[potionId] || potionId}. Delicious!`);
  
  inventory.removePotion(potionId);
};
</script>

<template>
  <div class="potions">
    <h3>🧪 Potions Inventory</h3>
    
    <div v-if="Object.keys(visiblePotions).length === 0" class="empty">No potions.</div>
    
    <ul v-else>
      <li v-for="(count, id) in visiblePotions" :key="id">
        <span>{{ inventory.potionEmojis[id] || '🧪' }} {{ potionNames[id] || id }} (x{{ count }})</span>
        <button @click="drinkPotion(id)" :disabled="alchemist.isDead">Drink</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* ... (стилі залишаються без змін) ... */
.potions { border: 2px solid #a5d6a7; padding: 15px; border-radius: 0px; background: #ffffff; color: #2e3b2e; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
h3 { margin-top: 0; color: #1b5e20; }
ul { list-style: none; padding: 0; }
li { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; padding: 8px; background: #f1f8e9; border-radius: 0px; border: 1px solid #e0e0e0;}
button { padding: 5px 10px; cursor: pointer; border-radius: 0px; }
.empty { color: #6b7a6b; font-style: italic; }
</style>