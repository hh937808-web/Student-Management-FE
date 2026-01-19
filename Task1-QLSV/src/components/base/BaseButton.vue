<template>
  <button 
    :class="['btn-base', variant]" 
    :disabled="loading" 
    @click="$emit('click')"
  >
    <span v-if="loading" class="spinner"></span>
    <slot v-else></slot>
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, 
});
defineEmits(['click']);
</script>

<style scoped>
.btn-base {
  padding: 8px 18px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.btn-base:active { transform: scale(0.96); }
.primary { background: #3498db; color: white; }
.success { background: #2ecc71; color: white; }
.danger { background: #e74c3c; color: white; }
.warning { background: #f1c40f; color: #333; }
.btn-base:disabled { opacity: 0.6; cursor: not-allowed; }
</style>