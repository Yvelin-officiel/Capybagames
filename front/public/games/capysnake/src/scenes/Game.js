import {
    GRID_SIZE,
    SNAKE_INITIAL_SPEED,
    SNAKE_MIN_SPEED,
    SNAKE_SPEED_STEP,
    SNAKE_INITIAL_LENGTH,
    SNAKE_START_X,
    SNAKE_START_Y,
    HIGH_SCORE_KEY,
    HUD_HEIGHT,
    FOOD_COLOR,
    FOOD_STEM_COLOR,
    GRID_COLOR_LIGHT,
    GRID_COLOR_DARK,
    BORDER_COLOR
} from '../constants.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');

        this.snake = [];
        this.food = null;
        this.foodStem = null;
        this.direction = 'right';
        this.nextDirection = 'right';
        this.gridSize = GRID_SIZE;
        this.snakeSpeed = SNAKE_INITIAL_SPEED;
        this.lastMoveTime = 0;
        this.isGameOver = false;
        this.isPaused = false;
        this.score = 0;
        this.highScore = 0;
        this.scoreText = null;
        this.bestText = null;
        this.pauseText = null;
        this.pauseOverlay = null;
        this.minSnakeSpeed = SNAKE_MIN_SPEED;
        this.speedStep = SNAKE_SPEED_STEP;
        this.worldWidth = 0;
        this.worldHeight = 0;
        this.gridWidth = 0;
        this.gridHeight = 0;
        this.playAreaY = 0;
        this._touchStartX = 0;
        this._touchStartY = 0;
        this.directionHistory = [];
    }

    create() {
        this.isGameOver = false;
        this.isPaused = false;
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.snakeSpeed = SNAKE_INITIAL_SPEED;
        this.lastMoveTime = 0;

        this.worldWidth = this.scale.width;
        this.worldHeight = this.scale.height;
        this.playAreaY = HUD_HEIGHT;
        this.gridWidth = Math.floor(this.worldWidth / this.gridSize);
        this.gridHeight = Math.floor((this.worldHeight - this.playAreaY) / this.gridSize);

        // half = décalage pour centrer les sprites dans les cases du damier
        this.half = this.gridSize / 2;

        const cx = this.worldWidth / 2;

        this.cameras.main.setBackgroundColor(0x000000);

        // === 1. FOND EN DAMIER ===
        // Les cellules sont dessinées par coin (fillRect depuis gx*size, gy*size)
        // → les sprites sont positionnés au CENTRE de chaque cellule (+ half)
        const checkerGfx = this.add.graphics();
        for (let gx = 0; gx <= this.gridWidth; gx++) {
            for (let gy = 0; gy <= this.gridHeight; gy++) {
                const color = (gx + gy) % 2 === 0 ? GRID_COLOR_LIGHT : GRID_COLOR_DARK;
                checkerGfx.fillStyle(color);
                checkerGfx.fillRect(
                    gx * this.gridSize,
                    this.playAreaY + gy * this.gridSize,
                    this.gridSize,
                    this.gridSize
                );
            }
        }

        // === 2. BORDURE ===
        const border = this.add.graphics();
        border.lineStyle(4, BORDER_COLOR, 1);
        border.strokeRect(0, this.playAreaY, this.worldWidth, this.worldHeight - this.playAreaY);

        // === SERPENT (positions centrées dans les cases) ===
        this.highScore = this.getHighScore();
        this.snake = [];

        for (let i = 0; i < SNAKE_INITIAL_LENGTH; i++) {
            // Centre de la cellule = gx * gridSize + half
            const x = (SNAKE_START_X - i) * this.gridSize + this.half;
            const y = this.playAreaY + SNAKE_START_Y * this.gridSize + this.half;

            let segment;
            if (i === 0) {
                segment = this.add.image(x, y, 'capy')
                    .setDisplaySize(this.gridSize - 2, this.gridSize - 2);
                this.applyHeadOrientation(segment, 'right');
            } else {
                segment = this.add.image(x, y, 'capy')
                    .setDisplaySize(this.gridSize - 2, this.gridSize - 2);
            }
            this.snake.push(segment);
        }

        // Historique des directions (une par segment, initialement tous vers droite)
        this.directionHistory = Array(SNAKE_INITIAL_LENGTH).fill('right');

        // === NOURRITURE ===
        this.spawnFood();

        // === 3. HUD (au-dessus de tout via setDepth) ===
        const hudY = HUD_HEIGHT / 2;
        this.add.rectangle(cx, hudY, this.worldWidth, HUD_HEIGHT, 0x1a3a08).setDepth(10);
        // Ligne séparatrice
        this.add.rectangle(cx, HUD_HEIGHT - 1, this.worldWidth, 3, 0x4aaa20).setDepth(10);

        // Icône nourriture
        const iconR = 11;
        this.add.ellipse(30, hudY + 2, iconR * 2, iconR * 2, FOOD_COLOR).setDepth(10);
        this.add.rectangle(30, hudY + 2 - iconR - 3, 2, 6, FOOD_STEM_COLOR).setDepth(10);

        // Score courant
        this.scoreText = this.add.text(50, hudY, '0', {
            fontFamily: 'Arial Black',
            fontSize: 26,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0, 0.5).setDepth(10);

        // Meilleur score (droite)
        this.bestText = this.add.text(this.worldWidth - 16, hudY, `Best: ${this.highScore}`, {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#ccffaa',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(1, 0.5).setDepth(10);

        // === TUTORIAL ===
        const playCenterY = this.playAreaY + (this.worldHeight - this.playAreaY) / 2;
        this.tutorialText = this.add.text(cx, playCenterY - 60, 'Flèches / swipe pour jouer', {
            fontFamily: 'Arial Black',
            fontSize: 26,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(5);

        // Contrôles clavier
        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.on('keydown', (event) => {
            if (this.tutorialText && this.tutorialText.visible) {
                const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
                if (arrowKeys.includes(event.key)) {
                    this.tutorialText.setVisible(false);
                }
            }
        });

        // === PAUSE ===
        this.pauseOverlay = this.add.rectangle(cx, this.worldHeight / 2, this.worldWidth, this.worldHeight, 0x000000, 0.5)
            .setVisible(false).setDepth(20);

        this.pauseText = this.add.text(cx, this.worldHeight / 2,
            'PAUSE\n\n[Échap]  Reprendre\n[R]  Recommencer', {
            fontFamily: 'Arial Black',
            fontSize: 36,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5).setVisible(false).setDepth(21);

        const togglePause = () => {
            if (this.isGameOver) return;
            this.isPaused = !this.isPaused;
            this.pauseOverlay.setVisible(this.isPaused);
            this.pauseText.setVisible(this.isPaused);
        };

        this.input.keyboard.on('keydown-P',   togglePause);
        this.input.keyboard.on('keydown-ESC', togglePause);

        this.input.keyboard.on('keydown-R', () => {
            if (!this.isPaused) return;
            this.scene.start('Game');
        });

        // === SWIPE MOBILE ===
        this.input.on('pointerdown', (pointer) => {
            this._touchStartX = pointer.x;
            this._touchStartY = pointer.y;
        });

        this.input.on('pointerup', (pointer) => {
            if (this.isGameOver || this.isPaused) return;
            const dx = pointer.x - this._touchStartX;
            const dy = pointer.y - this._touchStartY;
            const minSwipe = 30;
            if (Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe) return;
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0 && this.direction !== 'left') this.nextDirection = 'right';
                else if (dx < 0 && this.direction !== 'right') this.nextDirection = 'left';
            } else {
                if (dy > 0 && this.direction !== 'up') this.nextDirection = 'down';
                else if (dy < 0 && this.direction !== 'down') this.nextDirection = 'up';
            }
        });
    }

    update(time) {
        if (this.isGameOver || this.isPaused) return;

        if (this.cursors.left.isDown && this.direction !== 'right') {
            this.nextDirection = 'left';
        } else if (this.cursors.right.isDown && this.direction !== 'left') {
            this.nextDirection = 'right';
        } else if (this.cursors.up.isDown && this.direction !== 'down') {
            this.nextDirection = 'up';
        } else if (this.cursors.down.isDown && this.direction !== 'up') {
            this.nextDirection = 'down';
        }

        if (time >= this.lastMoveTime + this.snakeSpeed) {
            this.moveSnake();
            this.lastMoveTime = time;
        }
    }

    moveSnake() {
        this.direction = this.nextDirection;

        const head = this.snake[0];
        let newX = head.x;
        let newY = head.y;

        switch (this.direction) {
            case 'left':  newX -= this.gridSize; break;
            case 'right': newX += this.gridSize; break;
            case 'up':    newY -= this.gridSize; break;
            case 'down':  newY += this.gridSize; break;
        }

        // Collision murs — les positions valides sont [half .. worldWidth-half] et [playAreaY+half .. playAreaY+gridHeight*gridSize-half]
        const minX = this.half;
        const maxX = this.worldWidth - this.half;
        const minY = this.playAreaY + this.half;
        const maxY = this.playAreaY + this.gridHeight * this.gridSize - this.half;

        if (newX < minX || newX > maxX || newY < minY || newY > maxY) {
            this.gameOver();
            return;
        }

        // Collision avec soi-même
        for (let segment of this.snake) {
            if (newX === segment.x && newY === segment.y) {
                this.gameOver();
                return;
            }
        }

        const eating = this.food && newX === this.food.x && newY === this.food.y;

        // Mise à jour de l'historique des directions (une entrée par segment)
        this.directionHistory.unshift(this.direction);

        // L'ancienne tête devient un segment de corps (même sprite)
        const bodyImg = this.add.image(head.x, head.y, 'capy')
            .setDisplaySize(this.gridSize - 2, this.gridSize - 2);
        head.destroy();
        this.snake[0] = bodyImg;

        // Nouvelle tête
        const newHead = this.add.image(newX, newY, 'capy')
            .setDisplaySize(this.gridSize - 2, this.gridSize - 2);
        this.snake.unshift(newHead);

        if (!eating) {
            const tail = this.snake.pop();
            tail.destroy();
            this.directionHistory.pop();
        } else {
            // Flash visuel
            const flash = this.add.ellipse(this.food.x, this.food.y, this.gridSize * 1.2, this.gridSize * 1.2, 0xffff00, 0.8);
            this.tweens.add({
                targets: flash,
                alpha: 0,
                scaleX: 2,
                scaleY: 2,
                duration: 200,
                ease: 'Power2',
                onComplete: () => flash.destroy()
            });

            this.food.destroy();
            if (this.foodStem) this.foodStem.destroy();

            this.score += 10;
            this.snakeSpeed = Math.max(this.minSnakeSpeed, this.snakeSpeed - this.speedStep);
            this.scoreText.setText(String(this.score));
            this.spawnFood();
        }

        // Appliquer l'orientation à TOUS les segments selon leur direction historique
        for (let i = 0; i < this.snake.length; i++) {
            this.applyHeadOrientation(this.snake[i], this.directionHistory[i]);
        }
    }

    // Retourne/pivote un segment selon sa direction de déplacement
    applyHeadOrientation(head, direction) {
        switch (direction) {
            case 'right': head.setFlipX(true).setAngle(0);    break;
            case 'left':  head.setFlipX(false).setAngle(0);   break;
            case 'up':    head.setFlipX(true).setAngle(-90);   break;
            case 'down':  head.setFlipX(true).setAngle(90);  break;
        }
    }

    spawnFood() {
        const occupied = this.getOccupiedSet();
        const position = this.getFreePosition(occupied);

        if (!position) {
            this.gameOver();
            return;
        }

        const { x, y } = position;
        const r = Math.floor(this.gridSize * 0.38);
        this.food = this.add.ellipse(x, y, r * 2, r * 2, FOOD_COLOR);
        this.foodStem = this.add.rectangle(x, y - r - 3, 2, 6, FOOD_STEM_COLOR);
    }

    gameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;

        this.direction = 'right';
        this.nextDirection = 'right';

        this.snake.forEach(segment => segment.destroy());
        this.snake = [];

        if (this.food) { this.food.destroy(); this.food = null; }
        if (this.foodStem) { this.foodStem.destroy(); this.foodStem = null; }

        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.setHighScore(this.highScore);
        }

        this.scene.start('GameOver', {
            score: this.score,
            highScore: this.highScore
        });
    }

    getOccupiedSet() {
        const occupied = new Set();
        for (let segment of this.snake) {
            occupied.add(this.getGridKey(segment.x, segment.y));
        }
        return occupied;
    }

    // Positions centrées dans les cases : gx*gridSize + half
    getFreePosition(occupied) {
        const free = [];
        for (let gx = 0; gx < this.gridWidth; gx++) {
            for (let gy = 0; gy < this.gridHeight; gy++) {
                const x = gx * this.gridSize + this.half;
                const y = this.playAreaY + gy * this.gridSize + this.half;
                if (!occupied.has(this.getGridKey(x, y))) {
                    free.push({ x, y });
                }
            }
        }
        if (free.length === 0) return null;
        return free[Phaser.Math.Between(0, free.length - 1)];
    }

    getGridKey(x, y) {
        return `${x},${y}`;
    }

    getHighScore() {
        const raw = localStorage.getItem(HIGH_SCORE_KEY);
        const parsed = parseInt(raw, 10);
        return Number.isNaN(parsed) ? 0 : parsed;
    }

    setHighScore(score) {
        localStorage.setItem(HIGH_SCORE_KEY, String(score));
    }
}
