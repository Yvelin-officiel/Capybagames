<template>
	<main class="home-page">
		<section class="hero">
			<div class="hero-content">
				<p class="hero-kicker">Bienvenue sur CapybaGames</p>
				<h1>Des mini-jeux fun avec les capybaras les plus cools</h1>
				<p class="hero-subtitle">
					Explore un univers coloré, détendu et plein de défis. Chaque mascotte a son style,
					chaque partie est une nouvelle aventure.
				</p>

				<ul class="hero-stats">
					<li v-for="stat in stats" :key="stat.label" class="stat-item">
						<strong>{{ stat.value }}</strong>
						<span>{{ stat.label }}</span>
					</li>
				</ul>
			</div>
		</section>

		<section class="mascots-section" aria-label="Présentation des mascottes">
			<div class="section-header">
				<h2>Nos mascottes</h2>
				<p>Découvre chaque capybara et sa vibe unique.</p>
			</div>

			<div class="mascots-grid">
				<article
					v-for="capy in floatingCapys"
					:key="capy.name"
					class="mascot-card"
				>
					<div
						class="floating-capy mascot-figure"
						:style="{
							'--capy-size': `${capy.size}px`,
							'--float-duration': `${capy.duration}s`,
							'--float-delay': `${capy.delay}s`,
							'--tilt': `${capy.tilt}deg`
						}"
					>
						<img :src="capy.image" :alt="capy.name" />
						<div class="capy-bubble">{{ capy.message }}</div>
					</div>
					<h3>{{ capy.name }}</h3>
				</article>
			</div>
		</section>

		<section class="games-section">
			<div class="section-header">
				<h2>Les jeux du moment</h2>
				<p>Choisis ton ambiance et lance ta prochaine session.</p>
			</div>

			<div class="games-grid">
				<article
					v-for="game in gameModes"
					:key="game.title"
					class="game-tile"
					:style="{ '--tile-gradient': game.gradient }"
				>
					<img :src="game.image" :alt="game.title" class="tile-image" />
					<div class="tile-body">
						<span class="tile-tag">{{ game.tag }}</span>
						<h3>{{ game.title }}</h3>
						<p>{{ game.description }}</p>
						<button class="tile-button">Jouer</button>
					</div>
				</article>
			</div>
		</section>

		<section class="ambiance-section">
			<h2>Pourquoi on adore CapybaGames ?</h2>
			<div class="pill-row">
				<span v-for="item in ambiencePoints" :key="item" class="ambience-pill">{{ item }}</span>
			</div>
		</section>
	</main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import AppButton from '../components/ui/AppButton.vue'

import capyGamer from '../assets/capymg/capy-gamer.png'
import capyLove from '../assets/capymg/capy-love.png'
import capySport from '../assets/capymg/capy-sport.png'
import capyTea from '../assets/capymg/capy-tea.png'
import capyWizard from '../assets/capymg/capy-wizard.png'

const floatingCapys = [
	{
		name: 'Capy Gamer',
		image: capyGamer,
		size: 158,
		duration: 3.8,
		delay: 0,
		tilt: -3,
		message: 'Je campe le spawn 😎'
	},
	{
		name: 'Capy Love',
		image: capyLove,
		size: 172,
		duration: 4.6,
		delay: 0.6,
		tilt: 2,
		message: 'GG, t’es trop fort 💖'
	},
	{
		name: 'Capy Sport',
		image: capySport,
		size: 166,
		duration: 3.4,
		delay: 0.2,
		tilt: -2,
		message: 'Speedrun ou rien ! 🏁'
	},
	{
		name: 'Capy Wizard',
		image: capyWizard,
		size: 160,
		duration: 4.9,
		delay: 1,
		tilt: 3,
		message: 'Abracapybara ✨'
	},
	{
		name: 'Capy Tea',
		image: capyTea,
		size: 176,
		duration: 4.1,
		delay: 0.4,
		tilt: 1,
		message: 'Pause chill avant le boss ☕'
	}
]

const gameModes = [
	{
		title: 'Arcade Rush',
		tag: 'Action',
		description: 'Enchaîne les obstacles et vise le meilleur score avec Capy Sport.',
		image: capySport,
		gradient: 'linear-gradient(135deg, var(--color-red), var(--color-orange))'
	},
	{
		title: 'Potion Puzzle',
		tag: 'Réflexion',
		description: 'Compose les bonnes combinaisons magiques avec Capy Wizard.',
		image: capyWizard,
		gradient: 'linear-gradient(135deg, var(--color-purple), var(--color-blue))'
	},
	{
		title: 'Cozy Garden',
		tag: 'Chill',
		description: 'Crée ton petit coin paisible et collectionne les bonus zen.',
		image: capyTea,
		gradient: 'linear-gradient(135deg, var(--color-cyan), var(--color-yellow))'
	}
]

const stats = [
	{ value: '5', label: 'Mascottes uniques' },
	{ value: '3', label: 'Jeux disponibles' },
	{ value: '100%', label: 'Good vibes' }
]

const ambiencePoints = [
	'Parties rapides',
	'Direction artistique fun',
	'Accessible à tous',
	'Univers attachant',
	'Toujours coloré'
]
</script>

<style scoped>
.home-page {
	min-height: 100vh;
	background:
		radial-gradient(circle at 85% 10%, rgba(255, 127, 187, 0.18), transparent 35%),
		radial-gradient(circle at 10% 80%, rgba(65, 198, 232, 0.2), transparent 30%),
		#fff;
	padding: 2rem 1.25rem 3rem;
}

.hero {
	max-width: 1180px;
	margin: 0 auto;
	display: block;
}

.mascots-section {
	max-width: 1180px;
	margin: 2.2rem auto 0;
}

.mascots-grid {
	margin-top: 1rem;
	display: grid;
	grid-template-columns: repeat(5, minmax(0, 1fr));
	grid-auto-rows: 1fr;
	gap: 0.9rem;
}

.mascot-card {
	background: #fff;
	border-radius: 16px;
	padding: 0.9rem 0.7rem 0.8rem;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	text-align: center;
	height: 100%;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.mascot-card:hover {
	transform: translateY(-4px);
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.mascot-card h3 {
	margin: 0.8rem 0 0;
	font-family: var(--font-chewy);
	font-size: 1.05rem;
	color: var(--color-purple);
}

.hero-kicker {
	font-family: var(--font-fredoka);
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.07em;
	color: var(--color-purple);
	margin: 0 0 0.5rem;
}

h1 {
	margin: 0;
	font-family: var(--font-bungee);
	line-height: 1.15;
	font-size: clamp(2rem, 4vw, 3.1rem);
	color: #1b1b1b;
}

.hero-subtitle {
	margin: 1rem 0 1.5rem;
	max-width: 55ch;
	font-family: var(--font-fredoka);
	color: #4b4b4b;
	font-size: 1.08rem;
}

.hero-cta {
	display: flex;
	gap: 0.9rem;
	flex-wrap: wrap;
	align-items: center;
}

.hero-link {
	text-decoration: none;
}

.hero-stats {
	margin: 1.8rem 0 0;
	padding: 0;
	list-style: none;
	display: flex;
	gap: 1rem;
	flex-wrap: wrap;
}

.stat-item {
	background: #ffffff;
	border: 2px solid var(--color-gray);
	border-radius: 16px;
	min-width: 140px;
	padding: 0.8rem 1rem;
	display: flex;
	flex-direction: column;
}

.stat-item strong {
	font-family: var(--font-bungee);
	color: var(--color-blue);
	font-size: 1.35rem;
}

.stat-item span {
	font-family: var(--font-fredoka);
	color: #5b5b5b;
}

.floating-capy {
	position: relative;
	width: var(--capy-size);
	z-index: 0;
	transition: transform 0.25s ease;
}

.mascot-figure {
	pointer-events: auto;
}

.floating-capy img {
	width: 100%;
	object-fit: contain;
	filter: drop-shadow(0 10px 14px rgba(0, 0, 0, 0.16));
	animation: capyFloat var(--float-duration) ease-in-out infinite;
	animation-delay: var(--float-delay);
}

.floating-capy:hover {
	transform: translateY(-8px) scale(1.04);
	z-index: 5;
}

.capy-bubble {
	position: absolute;
	left: 50%;
	bottom: calc(100% + 8px);
	transform: translateX(-50%) translateY(8px);
	background: #fff;
	color: #2b2b2b;
	font-family: var(--font-fredoka);
	font-weight: 600;
	font-size: 0.92rem;
	padding: 0.45rem 0.7rem;
	border-radius: 12px;
	border: 2px solid var(--color-purple);
	white-space: nowrap;
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.2s ease, transform 0.2s ease;
	box-shadow: 0 8px 16px rgba(0, 0, 0, 0.16);
}

.capy-bubble::after {
	content: '';
	position: absolute;
	left: 50%;
	top: 100%;
	transform: translateX(-50%);
	width: 0;
	height: 0;
	border-left: 8px solid transparent;
	border-right: 8px solid transparent;
	border-top: 9px solid #fff;
}

.floating-capy:hover .capy-bubble {
	opacity: 1;
	transform: translateX(-50%) translateY(0);
}

.games-section,
.ambiance-section {
	max-width: 1180px;
	margin: 2.5rem auto 0;
}

.section-header h2,
.ambiance-section h2 {
	font-family: var(--font-chewy);
	font-size: clamp(1.8rem, 2.5vw, 2.4rem);
	color: var(--color-purple);
	margin: 0;
}

.section-header p {
	font-family: var(--font-fredoka);
	color: #666;
	margin-top: 0.5rem;
}

.games-grid {
	margin-top: 1.4rem;
	display: grid;
	gap: 1rem;
	grid-template-columns: repeat(3, minmax(0, 1fr));
}

.game-tile {
	background: #fff;
	border-radius: 20px;
	overflow: hidden;
	box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
	transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.game-tile:hover {
	transform: translateY(-8px) rotate(-0.5deg);
	box-shadow: 0 16px 32px rgba(0, 0, 0, 0.18);
}

.tile-image {
	width: 100%;
	aspect-ratio: 4 / 3;
	object-fit: contain;
	background: var(--tile-gradient);
	padding: 1rem;
	box-sizing: border-box;
}

.tile-body {
	padding: 1rem;
}

.tile-tag {
	display: inline-block;
	font-family: var(--font-fredoka);
	font-weight: 700;
	font-size: 0.82rem;
	color: #fff;
	background: var(--color-blue);
	border-radius: 999px;
	padding: 0.25rem 0.7rem;
}

.tile-body h3 {
	margin: 0.7rem 0 0.45rem;
	font-family: var(--font-bungee);
	font-size: 1.2rem;
	line-height: 1.2;
	color: #202020;
}

.tile-body p {
	margin: 0;
	min-height: 52px;
	font-family: var(--font-fredoka);
	color: #5f5f5f;
}

.tile-button {
	margin-top: 0.9rem;
	border: none;
	border-radius: 999px;
	background: var(--color-purple);
	color: #fff;
	padding: 0.5rem 1rem;
	font-family: var(--font-chewy);
	font-size: 1rem;
}

.ambiance-section {
	background: #fff;
	border: 2px dashed var(--color-cyan);
	border-radius: 24px;
	padding: 1.2rem;
}

.pill-row {
	display: flex;
	flex-wrap: wrap;
	gap: 0.7rem;
	margin-top: 1rem;
}

.ambience-pill {
	background: linear-gradient(135deg, var(--color-cyan), var(--color-blue));
	color: #fff;
	font-family: var(--font-fredoka);
	font-weight: 600;
	padding: 0.4rem 0.85rem;
	border-radius: 999px;
}


@keyframes capyFloat {
	0%,
	100% {
		transform: translateY(0) rotate(var(--tilt));
	}
	50% {
		transform: translateY(-12px) rotate(calc(var(--tilt) + 2deg));
	}
}

@media (max-width: 980px) {
	.mascots-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.games-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (max-width: 640px) {
	.home-page {
		padding: 1.2rem 0.8rem 2rem;
	}

	.games-grid {
		grid-template-columns: 1fr;
	}

	.mascots-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.stat-item {
		min-width: 120px;
	}

	.floating-capy {
		width: clamp(120px, 36vw, 156px);
	}

	.capy-bubble {
		white-space: normal;
		text-align: center;
		max-width: 150px;
	}
}
</style>