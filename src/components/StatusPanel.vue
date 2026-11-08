<!-- src/components/StatusPanel.vue -->
<script setup lang="ts">
import { useAlchemistStore } from '../stores/alchemist';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

const alchemist = useAlchemistStore();
const { hp, maxHp, mp, maxMp, gold, debt, level, xp, xpToNextLevel, isDead, isMaster } = storeToRefs(alchemist);

const floatingTexts = ref<{ id: number, text: string, color: string, x: number }[]>([]);

watch(gold, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    const diff = newVal - oldVal;
    const text = diff > 0 ? `+${diff} 💰` : `${diff} 💰`;
    const color = diff > 0 ? '#2e7d32' : '#c62828';
    addFloatingText(text, color);
  }
});

watch(mp, (newVal, oldVal) => {
  if (newVal !== oldVal && !isDead.value) {
    const diff = newVal - oldVal;
    if (diff > 0) addFloatingText(`+${diff} MP`, '#1976D2');
  }
});

watch(hp, (newVal, oldVal) => {
  if (newVal !== oldVal && !isDead.value) {
    const diff = newVal - oldVal;
    const text = diff > 0 ? `+${diff} ❤️` : `${diff} 💔`;
    const color = diff > 0 ? '#2e7d32' : '#c62828';
    addFloatingText(text, color);
  }
});

const addFloatingText = (text: string, color: string) => {
  const id = Date.now();
  const x = Math.random() * 40 - 20; 
  floatingTexts.value.push({ id, text, color, x });
  setTimeout(() => {
    floatingTexts.value = floatingTexts.value.filter(t => t.id !== id);
  }, 1000);
};

const buyMana = () => {
  const success = alchemist.buyMana(30, 60); 
  if (!success) {
    if (gold.value < 60) alert("Not enough gold! Need 60 coins.");
    else if (mp.value >= maxMp.value) alert("Your mana is already full!");
  }
};
</script>

<template>
  <div class="status-panel" :class="{ dead: isDead }" style="position: relative; overflow: hidden;">
    <TransitionGroup name="float">
      <div v-for="txt in floatingTexts" :key="txt.id" class="floating-text" :style="{ color: txt.color, left: `calc(50% + ${txt.x}px)` }">
        {{ txt.text }}
      </div>
    </TransitionGroup>

    <h2>Alchemist <span v-if="isMaster" class="master-badge">(Master)</span></h2>
    
    <div class="stat">
      <span>HP:</span> <progress :value="hp" :max="maxHp"></progress> <span>{{ hp }}/{{ maxHp }}</span>
    </div>
    
    <div class="stat mp-row">
      <span>MP:</span> <progress :value="mp" :max="maxMp"></progress> <span>{{ mp }}/{{ maxMp }}</span>
      <button class="buy-mp-btn" @click="buyMana" :disabled="isDead || mp >= maxMp || gold < 60" title="Buy 30 MP for 60 gold">💧+</button>
    </div>
    
    <div class="stat gold-row">
      <span>Gold:</span> <span class="gold">💰 {{ gold }}</span>
    </div>
    
    <div v-if="debt > 0" class="stat debt-row">
      <span>Debt:</span> <span class="debt">📉 {{ debt }}</span>
    </div>
    
    <div class="stat">
      <span>Level: {{ level }}</span> <progress :value="xp" :max="xpToNextLevel"></progress> <span>{{ xp }}/{{ xpToNextLevel }}</span>
    </div>

    <div v-if="isDead" class="death-message">
      <h3>💀 You died!</h3>
      <button @click="alchemist.resurrect()">Resurrect</button>
    </div>
  </div>
</template>

<style scoped>
/* ... (стилі залишаються без змін) ... */
.status-panel { border: 2px solid #a5d6a7; padding: 15px; border-radius: 0px; background: #ffffff; color: #2e3b2e; width: 340px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.status-panel.dead { border-color: #ef5350; background-color: #ffebee; }
.stat { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 5px; }
progress { width: 80px; }
.gold { color: #f57f17; font-weight: bold; }
.debt { color: #c62828; font-weight: bold; }
.master-badge { color: #f57f17; font-size: 0.8em; }
.death-message { margin-top: 15px; text-align: center; color: #c62828; }
.death-message button { padding: 8px; width: 100%; margin-top: 10px; background: #c62828 !important; border-radius: 0px; }
.buy-mp-btn { color: white; border: none; border-radius: 0px; padding: 4px 8px; cursor: pointer; font-size: 0.9rem; font-weight: bold; background: #1976D2 !important; }
.buy-mp-btn:hover:not(:disabled) { transform: scale(1.05) !important; }
.floating-text { position: absolute; top: 40%; font-weight: bold; font-size: 1.2rem; pointer-events: none; text-shadow: 1px 1px 0px #fff; }
.float-enter-active, .float-leave-active { transition: all 1s ease-out; }
.float-enter-from { opacity: 1; transform: translateY(0); }
.float-leave-to { opacity: 0; transform: translateY(-50px); }
</style>