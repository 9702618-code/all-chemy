<!-- src/components/BankPanel.vue -->
<script setup lang="ts">
import { useAlchemistStore } from '../stores/alchemist';
const alchemist = useAlchemistStore();
</script>

<template>
  <div class="bank-panel">
    <h3>🏦 Goblin Bank</h3>
    
    <div v-if="alchemist.debt > 0" class="debt-info">
      <p class="warning">⚠️ Your debt: {{ alchemist.debt }} 💰</p>
      <button class="repay-btn" @click="alchemist.repayLoan()" :disabled="alchemist.gold < alchemist.debt">
        Repay Debt
      </button>
    </div>
    
    <div v-else class="no-debt">
      <p>Need money to grow?</p>
      <button class="loan-btn" @click="alchemist.takeLoan()">
        Take Loan (+100 💰)
      </button>
      <p class="terms">Terms: repay 120 coins. No collateral — no new loans.</p>
    </div>
  </div>
</template>

<style scoped>
/* ... (стилі залишаються без змін) ... */
.bank-panel { border: 2px solid #f57f17; padding: 15px; border-radius: 0px; background: #fffde7; color: #4e342e; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
h3 { margin-top: 0; text-align: center; color: #e65100; }
p { margin: 5px 0; font-size: 0.9em; text-align: center; }
button { width: 100%; padding: 10px; border: none; cursor: pointer; font-weight: bold; margin-top: 10px; transition: transform 0.2s; border-radius: 0px; }
button:hover:not(:disabled) { transform: scale(1.02); }
.loan-btn { background: radial-gradient(circle at center, #ffb300 0%, #f57f17 100%) !important; color: #fff !important; }
.repay-btn { background: radial-gradient(circle at center, #43a047 0%, #2e7d32 100%) !important; color: white !important; }
.repay-btn:disabled { background: #e0e0e0 !important; color: #999 !important; }
.warning { color: #c62828; font-weight: bold; }
.terms { font-size: 0.75em; color: #795548; margin-top: 10px; }
</style>