export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        // Les assets seront chargés ici si besoin
        // Pour l'instant, on utilise des graphiques générés
    }

    create() {
        // Créer les graphiques du jeu
        this.createGraphics();
        this.scene.start('Game');
    }

    createGraphics() {
        // Créer les graphiques pour les sprites
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Créer le Capybara (carré coloré pour l'instant)
        graphics.fillStyle(0xB8860B, 1);
        graphics.fillRect(0, 0, 40, 30);
        graphics.generateTexture('capy', 40, 30);

        // Créer un obstacle
        graphics.fillStyle(0xFF4500, 1);
        graphics.fillRect(0, 0, 50, 100);
        graphics.generateTexture('obstacle', 50, 100);

        // Créer une pièce
        graphics.fillStyle(0xFFD700, 1);
        graphics.fillCircle(8, 8, 8);
        graphics.generateTexture('coin', 16, 16);

        // Créer une particule d'exhaust
        graphics.fillStyle(0xFF6600, 0.8);
        graphics.fillRect(0, 0, 6, 6);
        graphics.generateTexture('particle', 6, 6);

        graphics.destroy();
    }
}
