export class Capy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'capy');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Ajuste la taille du PNG capyjetpack pour garder un gameplay lisible.
        this.setDisplaySize(112, 68);
        this.body.setSize(this.displayWidth * 0.62, this.displayHeight * 0.5, true);

        this.setCollideWorldBounds(true);
        this.setBounce(0);

        // Jetpack properties
        this.jetpackActive = false;
        this.jetpackPower = 500;
        this.jetpackFuel = 150;
        this.maxFuel = 150;
        this.fuelRegenRate = 30; // fuel par seconde en repos
        this.fuelConsumptionRate = 50; // fuel par seconde en vol
        this.gravityAcceleration = 500;

        // Create exhaust particles for visual effect
        this.createExhaustEmitter();
    }

    createExhaustEmitter() {
        this.exhaustFlame = this.scene.add.image(this.x - 15, this.y + 15, 'particle');
        this.exhaustFlame.setVisible(false);
        this.exhaustFlame.setBlendMode(Phaser.BlendModes.ADD);
        this.exhaustFlame.setDepth(this.depth - 1);

        this.on('destroy', () => {
            if (this.exhaustFlame) {
                this.exhaustFlame.destroy();
            }
        });
    }

    activateJetpack() {
        this.jetpackActive = true;
    }

    deactivateJetpack() {
        this.jetpackActive = false;
    }

    update() {
        const deltaTime = this.scene.game.loop.delta / 1000; // en secondes

        // Appliquer la gravité
        if (!this.jetpackActive) {
            this.setAccelerationY(this.gravityAcceleration);
        } else {
            this.setAccelerationY(-this.jetpackPower);
        }

        // Gestion du carburant
        if (this.jetpackActive && this.jetpackFuel > 0) {
            this.jetpackFuel -= this.fuelConsumptionRate * deltaTime;
            
            if (this.jetpackFuel < 0) {
                this.jetpackFuel = 0;
                this.jetpackActive = false;
            }

            // Flamme d'echappement compatible Phaser 3.60+
            this.exhaustFlame.setVisible(true);
            this.exhaustFlame.setPosition(
                this.x - 18,
                this.y + 15 + Phaser.Math.Between(-2, 2)
            );
            this.exhaustFlame.setScale(
                0.9 + Math.random() * 0.6,
                0.8 + Math.random() * 0.4
            );
            this.exhaustFlame.setAlpha(0.6 + Math.random() * 0.4);
        } else if (this.jetpackFuel < this.maxFuel) {
            // Recharger le carburant
            this.jetpackFuel += this.fuelRegenRate * deltaTime;
            
            if (this.jetpackFuel > this.maxFuel) {
                this.jetpackFuel = this.maxFuel;
            }

            this.exhaustFlame.setVisible(false);
        } else {
            this.exhaustFlame.setVisible(false);
        }

        // Limiter la vitesse verticale max
        const maxVelocityY = 600;
        if (this.body.velocity.y > maxVelocityY) {
            this.body.velocity.y = maxVelocityY;
        }

        // Rotation du capy en fonction de la vélocité
        if (this.body.velocity.y < -50) {
            this.setRotation(-0.3); // regarder vers le haut
        } else if (this.body.velocity.y > 100) {
            this.setRotation(0.3); // regarder vers le bas
        } else {
            this.setRotation(0);
        }

        // Limiter la position horizontale (le capy avance pas)
        if (this.x > 150) {
            this.x = 150;
        }
    }

    getDamageFromJetpack() {
        return this.jetpackFuel / this.maxFuel; // 0 à 1
    }
}
