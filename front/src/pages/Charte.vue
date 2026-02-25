<template>
  <div class="charte-container">
    <h1>Charte Graphique</h1>

    <!-- ===== COULEURS ===== -->
    <section class="charte-section">
      <h2>Les couleurs</h2>
      <div class="colors-grid">
        <div v-for="color in colors" :key="color.var" class="color-card">
          <div class="color-box" :style="{ backgroundColor: `var(${color.var})` }"></div>
          <p class="color-name">{{ color.name }}</p>
          <p class="color-var">{{ color.var }}</p>
          <p class="color-code">{{ color.hex }}</p>
        </div>
      </div>
    </section>

    <!-- ===== POLICES ===== -->
    <section class="charte-section">
      <h2>Les polices</h2>
      <div class="fonts-grid">
        <div v-for="font in fonts" :key="font.var" class="font-card">
          <p class="font-label">{{ font.var }}</p>
          <p class="font-name" :style="{ fontFamily: `var(${font.var})` }">{{ font.name }}</p>
          <p class="font-sample" :style="{ fontFamily: `var(${font.var})` }">Aa Bb Cc 0123</p>
          <p class="font-sample-text" :style="{ fontFamily: `var(${font.var})` }">Capybagames � The Adventure Begins</p>
        </div>
      </div>
    </section>

    <!-- ===== BOUTONS ===== -->
    <section class="charte-section">
      <h2>Les boutons</h2>
      <div class="buttons-showcase">
        <div class="button-row">
          <AppButton variant="primary">Primary</AppButton>
          <AppButton variant="secondary">Secondary</AppButton>
          <AppButton variant="danger">Danger</AppButton>
          <AppButton variant="fun">Fun</AppButton>
          <AppButton variant="outline">Outline</AppButton>
        </div>
        <div class="button-row">
          <AppButton variant="primary" size="lg">Lancer la partie</AppButton>
          <AppButton variant="fun" size="lg"> Classement</AppButton>
          <AppButton variant="outline" size="lg">Règles du jeu</AppButton>
        </div>
      </div>
    </section>

    <!-- ===== CARTES DE JEU ===== -->
    <section class="charte-section">
      <h2>Les cartes de jeu</h2>
      <div class="game-cards-grid">
        <GameCard
          v-for="game in games"
          :key="game.title"
          :title="game.title"
          :description="game.description"
          :emoji="game.emoji"
          :tag="game.tag"
          :gradient="game.gradient"
          :btn-variant="game.btnVariant"
        />
      </div>
    </section>

  </div>
</template>

<script setup>
import AppButton from '../components/ui/AppButton.vue'
import GameCard from '../components/ui/GameCard.vue'

const colors = [
  { name: 'Orange Chaud',    var: '--color-orange', hex: '#f4a33c' },
  { name: 'Cyan Ciel',       var: '--color-cyan',   hex: '#41c6e8' },
  { name: 'Bleu Electrique', var: '--color-blue',   hex: '#0069ff' },
  { name: 'Rose Pastel',     var: '--color-pink',   hex: '#ff7fbb' },
  { name: 'Violet Profond',  var: '--color-purple', hex: '#4B43AE' },
  { name: 'Jaune Eclatant',  var: '--color-yellow', hex: '#FEFA67' },
  { name: 'Rouge Vif',       var: '--color-red',    hex: '#ED3B21' },
  { name: 'Gris Clair',      var: '--color-gray',   hex: '#DDDCDF' },
]

const fonts = [
  { name: 'Bungee',  var: '--font-bungee' },
  { name: 'Chewy',   var: '--font-chewy'  },
  { name: 'Fredoka', var: '--font-fredoka'},
]

const games = [
  {
    title: 'Capy Quest',
    description: 'Aide le capybara a traverser la jungle en resolvant des puzzles de plus en plus tricky !',
    emoji: '',
    tag: 'Puzzle',
    gradient: 'linear-gradient(135deg, var(--color-purple), var(--color-blue))',
    btnVariant: 'primary',
  },
  {
    title: 'Run Capy Run',
    description: 'Sprinte a toute vitesse et evite les obstacles dans ce runner effrene aux couleurs flamboyantes !',
    emoji: '',
    tag: 'Action',
    gradient: 'linear-gradient(135deg, var(--color-orange), var(--color-yellow))',
    btnVariant: 'fun',
  },
  {
    title: 'Capy Cards',
    description: 'Construis ton deck de capybaras legendaires et affronte tes amis dans des duels epiques !',
    emoji: '',
    tag: 'Cartes',
    gradient: 'linear-gradient(135deg, var(--color-cyan), var(--color-pink))',
    btnVariant: 'secondary',
  },
]
</script>

<style scoped>
/* ===== LAYOUT ===== */

.charte-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

h1 {
  font-family: var(--font-bungee);
  text-align: center;
  font-size: 2.5rem;
  margin: 0 0 2rem 0;
  color: #222;
}

.charte-section {
  width: 100%;
  background-color: #f5f5f5;
  padding: 2.5rem 3rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  font-family: var(--font-chewy);
  font-size: 1.8rem;
  margin: 0 0 1.5rem 0;
  color: #333;
  border-bottom: 3px solid var(--color-purple);
  padding-bottom: 0.75rem;
  width: 100%;
  text-align: center;
}

/* ===== COULEURS ===== */

.colors-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 1rem;
  width: 100%;
}

.color-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.color-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.color-box { width: 100%; height: 70px; }

.color-name {
  font-family: var(--font-fredoka);
  font-size: 0.72rem;
  font-weight: 600;
  color: #333;
  margin: 0.4rem 0.3rem 0.1rem;
}

.color-var {
  font-family: monospace;
  font-size: 0.58rem;
  color: #888;
  margin: 0 0.3rem 0.1rem;
}

.color-code {
  font-family: monospace;
  font-size: 0.58rem;
  font-weight: bold;
  color: #aaa;
  margin: 0 0.3rem 0.5rem;
}

/* ===== POLICES ===== */

.fonts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  width: 100%;
}

.font-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.font-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.font-label {
  font-family: monospace;
  font-size: 0.75rem;
  color: #999;
  margin: 0 0 0.4rem 0;
}

.font-name {
  font-size: 2.2rem;
  margin: 0 0 0.75rem 0;
  color: #222;
  line-height: 1;
}

.font-sample {
  font-size: 1.1rem;
  color: #555;
  margin: 0 0 0.6rem 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.6rem;
}

.font-sample-text {
  font-size: 0.95rem;
  color: #777;
  margin: 0;
  line-height: 1.5;
}

/* ===== BOUTONS ===== */

.buttons-showcase {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
}

/* ===== CARTES DE JEU ===== */

.game-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  width: 100%;
}

/* ===== RESPONSIVE ===== */

@media (max-width: 1024px) {
  .colors-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  .game-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .charte-container { padding: 1.5rem 1rem; }
  .charte-section { padding: 1.5rem 1.25rem; border-radius: 16px; }
  h1 { font-size: 2rem; }

  .colors-grid { grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
  .fonts-grid  { grid-template-columns: repeat(2, 1fr); }
  .game-cards-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; }
}

@media (max-width: 480px) {
  h1 { font-size: 1.6rem; }
  .colors-grid { grid-template-columns: repeat(2, 1fr); }
  .fonts-grid  { grid-template-columns: 1fr; }
  .charte-section { padding: 1.25rem 1rem; }
}
</style>
