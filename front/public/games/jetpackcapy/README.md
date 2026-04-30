# Jetpack Capy 🦫

Un jeu de style **Jetpack Joyride** avec un capybara pilotant un jetpack ! C'est un jeu d'esquive infini où vous devez éviter les obstacles en contrôlant votre vol avec un carburant limité.

## 🎮 Commandes

- **Souris / Toucher**: Appuyez et maintenez enfoncé pour activer le jetpack et monter
- **Clavier**: Appuyez sur `ESPACE` ou `FLÈCHE HAUT` pour activer le jetpack

## 🎯 Objectif

- Vole le plus loin possible
- Évite les obstacles (carrés orange)
- Collecte les pièces (cercles dorés) pour marquer des points
- Gère ton carburant avec sagesse !

## 📊 Système de Jeu

- **Carburant**: Limité et visible en haut à droite
  - Se consomme en activeant le jetpack (60 fuel/sec)
  - Se régénère automatiquement au repos (30 fuel/sec)
  
- **Vitesse**: Augmente progressivement au fur et à mesure
- **Obstacles**: Apparaissent tous les 1.5 secondes
- **Pièces**: Apparaissent tous les 2.5 secondes
- **Score**: +10 points par pièce collectée

## 🏗️ Structure du Projet

```
jetpackcapy/
├── index.html              # Fichier HTML principal
├── phaser.js               # Framework Phaser 3
├── project.config          # Configuration du projet
├── src/
│   ├── main.js            # Point d'entrée et configuration Phaser
│   ├── assets.js          # Définitions des assets
│   ├── animation.js       # Définitions des animations
│   ├── scenes/            # Scènes du jeu
│   │   ├── Boot.js        # Scène de démarrage
│   │   ├── Preloader.js   # Chargement des assets
│   │   ├── Game.js        # Scène de jeu principal
│   │   └── GameOver.js    # Écran de fin de partie
│   └── gameObjects/       # Objets du jeu
│       └── Capy.js        # Classe du capybara jouable
└── assets/                # Dossier pour les sprites/sons
```

## 🚀 Améliorations Possibles

- [ ] Ajouter du son (jetpack, collecte, collision)
- [ ] Plus de variété d'obstacles (types différents)
- [ ] Power-ups spéciaux
- [ ] Système de scores persistant
- [ ] Animations plus fluides du capybara
- [ ] Parallax background
- [ ] Niveaux/difficultés
- [ ] Sprites et assets custom professionnels

## 🎨 Personnalisation

Vous pouvez facilement modifier:
- La vitesse du jeu en changeant `this.maxGameSpeed` dans Game.js
- Les fréquences d'apparition des obstacles/pièces
- La taille du carburant et sa consommation dans Capy.js
- Les couleurs et dimensions dans Preloader.js

Bon vol! 🚀
