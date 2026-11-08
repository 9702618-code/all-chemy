<!-- src/components/MarketList.vue -->
<script setup lang="ts">
import { useInventoryStore } from '../stores/inventory';
const inventory = useInventoryStore();
</script>

<template>
  <div class="market">
    <ul>
      <li v-for="item in inventory.market" :key="item.id" class="market-item">
        <span>{{ item.emoji }} {{ item.name }}</span>
        <span class="price">{{ item.price }} 💰</span>
        <button @click="inventory.buyIngredient(item)">Buy</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* ... (стилі залишаються без змін) ... */
.market { color: #2e3b2e; }
ul { list-style: none; padding: 0; }
.market-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 10px; border-bottom: 1px solid #e0e0e0; background: #f1f8e9; border-radius: 0px; }
.price { color: #f57f17; font-weight: bold; }
button { padding: 5px 10px; }
</style>