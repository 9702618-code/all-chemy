<!-- src/components/Cauldron.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCauldronStore } from '../stores/cauldron';
import { useAlchemistStore } from '../stores/alchemist';
import { useInventoryStore } from '../stores/inventory';

const cauldron = useCauldronStore();
const alchemist = useAlchemistStore();
const inventory = useInventoryStore();

const isShaking = ref(false);
const hasEnoughMana = computed(() => alchemist.mp >= 15);

const clearSlot = (slotNum: 1 | 2) => {
  if (alchemist.isDead) return;
  const targetSlot = slotNum === 1 ? cauldron.slot1 : cauldron.slot2;
  if (targetSlot) cauldron.setSlot(slotNum, targetSlot);
};

const dumpCauldron = () => {
  if (alchemist.isDead) return;
  if (!cauldron.slot1 && !cauldron.slot2) return;
  let refund = 0;
  if (cauldron.slot1) {
    const item = inventory.market.find(i => i.id === cauldron.slot1);
    if (item) refund += Math.ceil(item.price / 2);
    cauldron.slot1 = null;
  }
  if (cauldron.slot2) {
    const item = inventory.market.find(i => i.id === cauldron.slot2);
    if (item) refund += Math.ceil(item.price / 2);
    cauldron.slot2 = null;
  }
  if (refund > 0) alchemist.addGold(refund);
};

const onDrop = (event: DragEvent, slotNum: 1 | 2) => {
  if (alchemist.isDead) return;
  const data = event.dataTransfer?.getData('text/plain');
  if (!data) return;
  const [source, id] = data.split(':');
  if (!id) return; 

  if (source === 'pantry') {
    const countInPantry = inventory.pantry[id] || 0;
    if (countInPantry > 0) cauldron.setSlot(slotNum, id);
  }
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault(); 
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
};

const handleBrew = () => {
  if (!cauldron.slot1 || !cauldron.slot2 || alchemist.isDead || !hasEnoughMana.value) return;
  const oldHp = alchemist.hp;
  cauldron.brew();
  if (alchemist.hp < oldHp) {
    isShaking.value = true;
    setTimeout(() => isShaking.value = false, 500);
  }
};
</script>

<template>
  <div class="cauldron" :class="{ 'dead-cauldron': alchemist.isDead, 'shake': isShaking }">
    <h3>⚗️ Synthesis Cauldron</h3>
    
    <div v-if="alchemist.isDead" class="ghost-warning">
      👻 You are a ghost! Synthesis disabled.
    </div>

    <div class="slots">
      <div class="slot" :class="{ 'has-item': cauldron.slot1 }" @click="clearSlot(1)" @dragover="onDragOver" @drop="onDrop($event, 1)">
        <span v-if="cauldron.slot1">{{ inventory.getIngredientName(cauldron.slot1) }}</span>
        <span v-else>Slot 1</span>
      </div>
      
      <div class="slot" :class="{ 'has-item': cauldron.slot2 }" @click="clearSlot(2)" @dragover="onDragOver" @drop="onDrop($event, 2)">
        <span v-if="cauldron.slot2">{{ inventory.getIngredientName(cauldron.slot2) }}</span>
        <span v-else>Slot 2</span>
      </div>
    </div>
    
    <div class="actions">
      <button @click="handleBrew" :disabled="!cauldron.slot1 || !cauldron.slot2 || alchemist.isDead || !hasEnoughMana" class="brew-btn">
        Brew (-15 MP)
      </button>
      
      <button @click="dumpCauldron" :disabled="(!cauldron.slot1 && !cauldron.slot2) || alchemist.isDead" class="dump-btn">
        Dump Contents
      </button>
    </div>

    <p v-if="!hasEnoughMana && !alchemist.isDead" class="mana-warning">
      ⚠️ Not enough mana!
    </p>

    <p class="hint">Click a slot to discard ingredient</p>
  </div>
</template>

<style scoped>
.cauldron { border: 2px solid #a5d6a7; padding: 15px; border-radius: 0px; background: #ffffff; color: #2e3b2e; transition: all 0.3s; position: relative; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.cauldron.dead-cauldron { opacity: 0.6; filter: grayscale(100%); border-color: #ef5350; }
.shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
@keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
.ghost-warning { text-align: center; color: #c62828; font-weight: bold; margin-bottom: 10px; }
.mana-warning { text-align: center; color: #e65100; font-size: 0.9em; margin-top: 10px; font-weight: bold; }
.slots { display: flex; gap: 10px; margin-bottom: 15px; }
.slot { flex: 1; height: 60px; border: 2px dashed #81c784; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 0px; background: rgba(255,255,255,0.6); transition: all 0.2s; font-weight: bold; text-align: center; font-size: 0.9em; padding: 5px; user-select: none; color: #4a5a4a; }
.slot:hover { background: #f1f8e9; }
.slot.has-item { border-style: solid; border-color: #4caf50; background: #e8f5e9; color: #1b5e20; }
.actions { display: flex; flex-direction: column; gap: 10px; }
.brew-btn { width: 100%; padding: 10px; border: none; border-radius: 0px; cursor: pointer; font-weight: bold; font-size: 1rem; }
.dump-btn { width: 100%; padding: 8px; background: transparent !important; color: #c62828 !important; border: 1px solid #c62828 !important; border-radius: 0px; cursor: pointer; font-weight: bold; font-size: 0.9rem; box-shadow: none !important; }
.dump-btn:disabled { border-color: #ccc !important; color: #999 !important; cursor: not-allowed; }
.dump-btn:not(:disabled):hover { background: #ffebee !important; }
.hint { font-size: 0.8em; color: #6b7a6b; text-align: center; margin-top: 15px; }
</style>