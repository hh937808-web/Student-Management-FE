<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal-box">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close']);
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: white;
  padding: 25px;
  border-radius: 8px;
  width: 400px;
}
</style>