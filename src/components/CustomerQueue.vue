<!-- src/components/CustomerQueue.vue -->
<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useCustomerStore } from '../stores/customers';
import { useInventoryStore } from '../stores/inventory';

const customers = useCustomerStore();
const inventory = useInventoryStore();

const potionNames: Record<string, string> = {
  'heal_potion': 'Healing Potion', 'mana_potion': 'Mana Potion', 'strength_potion': 'Strength Potion',
  'antidote': 'Antidote', 'invisibility_potion': 'Invisibility Potion', 'poison_potion': 'Poison',
  'flight_potion': 'Flight Potion', 'ice_potion': 'Ice Potion', 'fire_potion': 'Fire Potion',
  'dragon_breath': 'Dragon Breath', 'life_elixir': 'Life Elixir'
};

const hasRequiredPotion = computed(() => {
  if (!customers.currentCustomer) return false;
  const potionId = customers.currentCustomer.requestedPotionId;
  return (inventory.potions[potionId] || 0) > 0;
});

const handleSell = () => {
  if (!hasRequiredPotion.value) {
    alert("You don't have this potion on display!");
    return;
  }
  const potionId = customers.currentCustomer!.requestedPotionId;
  inventory.removePotion(potionId);
  customers.sellToCustomer(true);
};

onMounted(() => {
  if (!customers.currentCustomer) {
    customers.generateCustomer();
  }
});
</script>

<template>
  <div class="customers" v-if="customers.currentCustomer">
    <h3>🧑‍🤝‍🧑 Customer Queue</h3>
    <div class="customer-card">
      <p><strong>Customer:</strong> {{ customers.currentCustomer.name }}</p>
      <p><strong>Wants:</strong> {{ potionNames[customers.currentCustomer.requestedPotionId] || customers.currentCustomer.requestedPotionId }}</p>
      <p><strong>Offers:</strong> <span class="price">{{ customers.currentCustomer.offerPrice }} 💰</span></p>
      
      <div class="actions">
        <button class="sell" @click="handleSell" :disabled="!hasRequiredPotion">Sell</button>
        <button class="reject" @click="customers.rejectCustomer()">Reject</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ... (стилі залишаються без змін) ... */
.customers { border: 2px solid #a5d6a7; padding: 15px; border-radius: 0px; background: #ffffff; color: #2e3b2e; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
h3 { margin-top: 0; color: #1b5e20; }
.customer-card { background: #f1f8e9; padding: 12px; border-radius: 0px; border: 1px solid #c8e6c9; }
p { margin: 6px 0; }
.price { color: #f57f17; font-weight: bold; }
.actions { display: flex; gap: 10px; margin-top: 12px; }
button { flex: 1; padding: 8px; border: none; cursor: pointer; font-weight: bold; border-radius: 0px; transition: all 0.2s; }
.sell { background: radial-gradient(circle at center, #43a047 0%, #2e7d32 100%) !important; color: white; }
.sell:disabled { background: #c8e6c9 !important; color: #7a8b7a; cursor: not-allowed; }
.reject { background: radial-gradient(circle at center, #ef5350 0%, #c62828 100%) !important; color: white; }
</style>