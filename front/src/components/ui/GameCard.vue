<template>
  <div class="game-card">
    <div class="game-card-banner" :style="{ background: gradient }">
      <span class="game-card-tag">{{ tag }}</span>
      <div class="game-card-img">{{ img }}</div>
    </div>
    <div class="game-card-body">
      <h3 class="game-card-title">{{ title }}</h3>
      <p class="game-card-desc">{{ description }}</p>
      <AppButton :variant="btnVariant" :full="true">Jouer !</AppButton>
    </div>
  </div>
</template>

<script setup>
import AppButton from './AppButton.vue'

defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  img: { type: String, default: '' },
  tag: { type: String, default: '' },
  gradient: { type: String, default: 'linear-gradient(135deg, var(--color-purple), var(--color-blue))' },
  btnVariant: { type: String, default: 'primary' }
})
</script>

<style scoped>
.game-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  display: flex;
  flex-direction: column;
}

.game-card:hover {
  transform: translateY(-8px) rotate(-0.5deg);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.18);
}

.game-card-banner {
  height: 140px;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 1rem;
  flex-shrink: 0;
}

.game-card-tag {
  font-family: var(--font-fredoka);
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(4px);
  color: white;
  padding: 0.2rem 0.7rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.game-card-emoji {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  font-size: 3.5rem;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
}

.game-card-body {
  padding: 1.25rem 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.game-card-title {
  font-family: var(--font-bungee);
  font-size: 1.4rem;
  margin: 0 0 0.5rem 0;
  color: #222;
}

.game-card-desc {
  font-family: var(--font-fredoka);
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 auto 0;
  line-height: 1.5;
  padding-bottom: 1rem;
}
</style>
