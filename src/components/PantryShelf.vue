<!-- src/components/PantryShelf.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { useInventoryStore } from '../stores/inventory';
import { useCauldronStore } from '../stores/cauldron';

const inventory = useInventoryStore();
const cauldron = useCauldronStore();

const visiblePantry = computed(() => {
  const filtered: Record<string, number> = {};
  for (const [id, count] of Object.entries(inventory.pantry)) {
    if (count > 0) filtered[id] = count;
  }
  return filtered;
});

const sendToCauldron = (id: string) => {
  if (!cauldron.slot1) cauldron.setSlot(1, id);
  else if (!cauldron.slot2) cauldron.setSlot(2, id);
  else alert("Slots are occupied!");
};

const onDragStart = (event: DragEvent, id: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', `pantry:${id}`);
    event.dataTransfer.effectAllowed = 'move';
  }
};
</script>

<template>
  <div class="pantry">
    <h3>📦 Pantry</h3>
    
    <div v-if="Object.keys(visiblePantry).length === 0" class="empty">
      Empty. Buy ingredients in the market.
    </div>
    
    <ul v-else>
      <li v-for="(count, id) in visiblePantry" :key="id" @click="sendToCauldron(id)" class="has-items" draggable="true" @dragstart="onDragStart($event, id)">
        <span>{{ inventory.getIngredientName(id) }}</span> 
        <span>x{{ count }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.pantry { border: 2px solid #a5d6a7; padding: 15px; border-radius: 0px; background: #ffffff; color: #2e3b2e; min-height: 100px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
ul { list-style: none; padding: 0; }
li { display: flex; justify-content: space-between; padding: 8px 12px; background: #f1f8e9; margin-bottom: 6px; border-radius: 0px; cursor: grab; transition: background 0.2s, transform 0.2s; font-weight: bold; user-select: none; border: 1px solid #e0e0e0; }
li.has-items:hover { background-color: #dcedc8; transform: scale(1.02); }
li:active { cursor: grabbing; }
.empty { color: #6b7a6b; font-style: italic; }
</style>