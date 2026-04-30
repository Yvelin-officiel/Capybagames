<template>
	<div class="game-page">
		<header class="game-header">
			<RouterLink to="/" class="back-button">← Retour</RouterLink>
			<h1>🚀 Jetpack Capy</h1>
		</header>
		
		<div class="game-container">
			<iframe 
				src="./games/jetpackcapy/index.html"
				title="Jetpack Capy Game"
				class="game-iframe"
				allow="autoplay"
			></iframe>
		</div>

		<section class="game-info">
			<div class="info-content">
				<h2>À propos de Jetpack Capy</h2>
				<p>
					Enfile ton jetpack et vole aussi haut que possible ! Évite les obstacles, 
					collecte les pièces et manage ton carburant avec sagesse. À combien de mètres 
					tu peux arriver ?
				</p>
				
				<div class="controls">
					<h3>Contrôles</h3>
					<ul>
						<li><strong>Souris / Toucher :</strong> Clic pour activer le jetpack</li>
						<li><strong>Clavier :</strong> ESPACE ou FLÈCHE HAUT</li>
					</ul>
				</div>

				<div class="tips">
					<h3>💡 Conseils</h3>
					<ul>
						<li>Gère ton carburant : il se consomme rapidement en vol mais régénère au repos</li>
						<li>Reste au milieu pour avoir plus de place pour manœuvrer</li>
						<li>Collecte les pièces pour augmenter ton score</li>
						<li>La vitesse augmente progressivement, reste concentré !</li>
					</ul>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.game-page {
	min-height: 100vh;
	/* background: linear-gradient(135deg, #87CEEB 0%, #E0F6FF 100%); */
	padding: 1rem;
}

.game-header {
	max-width: 1180px;
	margin: 0 auto 1.5rem;
	display: flex;
	align-items: center;
	gap: 1rem;
}

.back-button {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1.25rem;
	background: rgba(255, 255, 255, 0.9);
	border-radius: 50px;
	text-decoration: none;
	color: #333;
	font-weight: 600;
	transition: all 0.25s ease;
	border: 2px solid transparent;
}

.back-button:hover {
	background: white;
	border-color: #87CEEB;
	transform: translateX(-4px);
}

.game-header h1 {
	font-size: 2rem;
	color: white;
	text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
	margin: 0;
}

.game-container {
	max-width: 1000px;
	margin: 0 auto 2rem;
	background: white;
	border-radius: 20px;
	overflow: hidden;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
	aspect-ratio: 4 / 3;
}

.game-iframe {
	width: 100%;
	height: 100%;
	border: none;
	display: block;
}

.game-info {
	max-width: 1180px;
	margin: 0 auto;
}

.info-content {
	background: white;
	border-radius: 20px;
	padding: 2rem;
	box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.info-content h2 {
	color: #333;
	margin-bottom: 1rem;
	font-size: 1.5rem;
}

.info-content p {
	color: #666;
	line-height: 1.6;
	margin-bottom: 2rem;
}

.controls,
.tips {
	margin-bottom: 1.5rem;
}

.controls h3,
.tips h3 {
	color: #333;
	margin-bottom: 0.75rem;
	font-size: 1.1rem;
}

.controls ul,
.tips ul {
	list-style: none;
	padding: 0;
	margin: 0;
}

.controls li,
.tips li {
	color: #555;
	padding: 0.5rem 0;
	padding-left: 1.5rem;
	position: relative;
}

.controls li::before,
.tips li::before {
	content: "▸";
	position: absolute;
	left: 0;
	color: #87CEEB;
	font-weight: bold;
}

@media (max-width: 768px) {
	.game-header {
		flex-direction: column;
		align-items: flex-start;
	}

	.game-header h1 {
		font-size: 1.5rem;
	}

	.game-container {
		width: 100%;
		aspect-ratio: 4 / 3;
	}

	.info-content {
		padding: 1.5rem;
	}
}
</style>
