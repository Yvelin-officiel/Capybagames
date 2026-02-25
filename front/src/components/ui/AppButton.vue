<template>
  <button :class="['btn', `btn-${variant}`, size === 'lg' ? 'btn-lg' : '', full ? 'btn-full' : '']">
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: v => ['primary', 'secondary', 'danger', 'fun', 'outline'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: v => ['md', 'lg'].includes(v)
  },
  full: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.btn {
  font-family: var(--font-chewy);
  font-size: 1rem;
  padding: 0.6rem 1.4rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  letter-spacing: 0.03em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.btn:hover  { transform: translateY(-3px) scale(1.03); }
.btn:active { transform: translateY(1px) scale(0.98); }

.btn-lg {
  font-size: 1.15rem;
  padding: 0.8rem 2rem;
}

.btn-full {
  width: 100%;
  padding: 0.7rem;
}

/* Variants */
.btn-primary {
  background-color: var(--color-purple);
  color: white;
  box-shadow: 0 4px 0 #2e2875;
}
.btn-primary:hover { box-shadow: 0 6px 0 #2e2875; }

.btn-secondary {
  background-color: var(--color-cyan);
  color: white;
  box-shadow: 0 4px 0 #1e8fa8;
}
.btn-secondary:hover { box-shadow: 0 6px 0 #1e8fa8; }

.btn-danger {
  background-color: var(--color-red);
  color: white;
  box-shadow: 0 4px 0 #a02510;
}
.btn-danger:hover { box-shadow: 0 6px 0 #a02510; }

.btn-fun {
  background: linear-gradient(135deg, var(--color-orange), var(--color-yellow));
  color: #333;
  box-shadow: 0 4px 0 #b87220;
  font-weight: 700;
}
.btn-fun:hover { box-shadow: 0 6px 0 #b87220; }

.btn-outline {
  background: transparent;
  color: var(--color-purple);
  border: 2.5px solid var(--color-purple);
  box-shadow: none;
}
.btn-outline:hover {
  background-color: var(--color-purple);
  color: white;
}
</style>
