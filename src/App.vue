<!-- src/App.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue';
import StatusPanel from './components/StatusPanel.vue';
import Cauldron from './components/Cauldron.vue';
import PantryShelf from './components/PantryShelf.vue';
import PotionsInventory from './components/PotionsInventory.vue';
import CustomerQueue from './components/CustomerQueue.vue';
import MarketList from './components/MarketList.vue';
import RecipeBook from './components/RecipeBook.vue';
import SidePanel from './components/SidePanel.vue';
import BankPanel from './components/BankPanel.vue';
import PinnedRecipes from './components/PinnedRecipes.vue';

import { saveGame, resetGame } from './stores/save';
import { useAlchemistStore } from './stores/alchemist';
import { useInventoryStore } from './stores/inventory';
import { useCauldronStore } from './stores/cauldron';

const alchemist = useAlchemistStore();
const inventory = useInventoryStore();
const cauldron = useCauldronStore();

const isMarketOpen = ref(false);
const isGrimoireOpen = ref(false);

watch(
  () => [alchemist.gold, alchemist.hp, alchemist.mp, alchemist.level, alchemist.xp, alchemist.isDead, alchemist.debt],
  () => saveGame(),
  { deep: true }
);
watch(() => [inventory.pantry, inventory.potions], () => saveGame(), { deep: true });
watch(() => [cauldron.recipes, cauldron.pinnedRecipes], () => saveGame(), { deep: true });

const startNewGame = () => {
  const confirm = window.confirm("Are you sure you want to start a new game? All progress will be lost!");
  if (confirm) resetGame();
};
</script>

<template>
  <div class="app-container">
    <header>
      <div class="header-left">
        <button class="nav-btn market-btn" @click="isMarketOpen = true">🛒 Market</button>
        <button class="nav-btn new-game-btn" @click="startNewGame">🔄 New Game</button>
      </div>
      
      <h1>All-chemy</h1>
      
      <button class="nav-btn grimoire-btn" @click="isGrimoireOpen = true">📖 Grimoire</button>
    </header>
    
    <div class="layout">
      <aside class="left-col">
        <StatusPanel />
        <BankPanel />
        <PotionsInventory />
      </aside>

      <main class="center-col">
        <Cauldron />
        <PantryShelf />
      </main>

      <aside class="right-col">
        <CustomerQueue />
        <PinnedRecipes />
      </aside>
    </div>

    <SidePanel :isOpen="isMarketOpen" title="🛒 Ingredient Market" side="left" @close="isMarketOpen = false">
      <MarketList />
    </SidePanel>

    <SidePanel :isOpen="isGrimoireOpen" title="📖 Recipe Grimoire" side="right" @close="isGrimoireOpen = false">
      <RecipeBook />
    </SidePanel>
  </div>
</template>

<style>
body { margin: 0; background-color: #e8f5e9; background-image: radial-gradient(circle at 50% 0%, #ffffff 0%, #dcedc8 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2e3b2e; }
.app-container { max-width: 1300px; margin: 0 auto; padding: 20px; min-height: 100vh; }
header { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; margin-bottom: 20px; border-bottom: 2px solid #81c784; }
.header-left { display: flex; gap: 10px; }
header h1 { margin: 0; color: #1b5e20; text-shadow: 0 2px 4px rgba(27, 94, 32, 0.2); font-size: 2.5rem; letter-spacing: 2px; font-family: 'Georgia', serif;}
.layout { display: flex; gap: 20px; align-items: flex-start; }
.left-col { flex: 1; display: flex; flex-direction: column; gap: 20px; }
.center-col { flex: 1.2; display: flex; flex-direction: column; gap: 20px; }
.right-col { flex: 1; display: flex; flex-direction: column; gap: 20px; }
button { border-radius: 0px !important; background: radial-gradient(circle at center, #43a047 0%, #2e7d32 100%) !important; color: white !important; border: 1px solid #66bb6a !important; font-weight: bold; cursor: pointer; transition: all 0.3s ease !important; box-shadow: 0 4px 6px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2) !important; }
button:hover:not(:disabled) { background: radial-gradient(circle at center, #4caf50 0%, #388e3c 100%) !important; box-shadow: 0 6px 12px rgba(76, 175, 80, 0.3), inset 0 1px 0 rgba(255,255,255,0.3) !important; transform: translateY(-2px); border-color: #a5d6a7 !important; }
button:active:not(:disabled) { transform: translateY(1px); box-shadow: 0 2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(0,0,0,0.2) !important; background: radial-gradient(circle at center, #2e7d32 0%, #1b5e20 100%) !important; }
button:disabled { background: radial-gradient(circle at center, #c8e6c9 0%, #a5d6a7 100%) !important; border-color: #c8e6c9 !important; color: #7a8b7a !important; cursor: not-allowed; box-shadow: none !important; transform: none !important; }
.market-btn { background: radial-gradient(circle at center, #26a69a 0%, #00695c 100%) !important; border-color: #4db6ac !important; }
.grimoire-btn { background: radial-gradient(circle at center, #8d6e63 0%, #5d4037 100%) !important; border-color: #a1887f !important; }
.new-game-btn { background: radial-gradient(circle at center, #ef5350 0%, #c62828 100%) !important; border-color: #e57373 !important; }
</style>