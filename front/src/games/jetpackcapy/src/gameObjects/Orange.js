export class Orange extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'orange');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.25);
        this.setImmovable(false);
    }

    collect(scene) {
        scene.score += 25;
        scene.capy.jetpackFuel = Math.min(
            scene.capy.jetpackFuel + 40,
            scene.capy.maxFuel
        );
        this.destroy();
    }
}
