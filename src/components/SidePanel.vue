<!-- src/components/SidePanel.vue -->
<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  title: string;
  side: 'left' | 'right';
}>();

const emit = defineEmits(['close']);
</script>

<template>
  <Transition :name="side === 'left' ? 'slide-left' : 'slide-right'">
    <div v-if="isOpen" class="side-panel" :class="side">
      <div class="panel-header">
        <h2>{{ title }}</h2>
        <button class="close-btn" @click="emit('close')">✖</button>
      </div>
      <div class="panel-content" :class="{ 'book-content': side === 'right' }">
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ... (стилі залишаються без змін) ... */
.side-panel { position: fixed; top: 0; bottom: 0; width: 350px; background-color: #ffffff; color: #2e3b2e; box-shadow: 0 0 20px rgba(0,0,0,0.3); z-index: 100; display: flex; flex-direction: column; }
.side-panel.left { left: 0; border-right: 4px solid #4db6ac; }
.side-panel.left .panel-header { background: #e0f2f1; border-bottom: 1px solid #b2dfdb; }
.side-panel.right { right: 0; width: 600px; background-color: #5d4037; border-left: 8px solid #3e2723; }
.side-panel.right .panel-header { background: #4e342e; border-bottom: 2px solid #3e2723; padding: 20px; }
.side-panel.right .panel-header h2 { color: #ffcc80; font-family: 'Georgia', serif; }
.panel-header { display: flex; justify-content: space-between; align-items: center; padding: 15px; }
.panel-header h2 { margin: 0; font-size: 1.2rem; }
.close-btn { background: #ef5350 !important; color: white; border: none; font-size: 1.2rem; cursor: pointer; padding: 5px 10px; border-radius: 0px; }
.panel-content { padding: 15px; overflow-y: auto; flex: 1; }
.book-content { background-color: #fdf5e6; color: #2b2b2b; padding: 30px; background-image: url('data:image/svg+xml;utf8,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100" height="100" filter="url(%23noise)" opacity="0.05"/></svg>'); }
.slide-left-enter-active, .slide-left-leave-active { transition: transform 0.3s ease; }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); }
.slide-right-enter-active, .slide-right-leave-active { transition: transform 0.3s ease; }
.slide-right-enter-from, .slide-right-leave-to { transform: translateX(100%); }
</style>