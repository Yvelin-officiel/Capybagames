import ASSETS from "../assets.js";

const HOURS = ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM"];

const CAMERA_IMAGE_MAP = {
  CAM1: ASSETS.cameras.cam1,
  CAM2: ASSETS.cameras.cam2,
  CAM3: ASSETS.cameras.cam3,
  CAML: ASSETS.cameras.caml,
  CAMR: ASSETS.cameras.camr,
};

const MINIMAP_LAYOUT = {
  CAM1: { mapX: 50, mapY: 15 },
  CAM2: { mapX: 30, mapY: 55 },
  CAM3: { mapX: 70, mapY: 55 },
  CAML: { mapX: 10, mapY: 75 },
  CAMR: { mapX: 90, mapY: 75 },
};

const CAMERA_MAP = {
  CAM1: "stage",
  CAM2: "dining",
  CAM3: "hall",
  CAML: "leftDoor",
  CAMR: "rightDoor",
};

const CAMERA_LAYOUT = {
  CAM1: { x: 480, y: 295, spreadX: 110, spreadY: 16 },
  CAM2: { x: 490, y: 320, spreadX: 145, spreadY: 24 },
  CAM3: { x: 500, y: 300, spreadX: 130, spreadY: 20 },
  CAML: { x: 370, y: 330, spreadX: 70, spreadY: 12 },
  CAMR: { x: 600, y: 330, spreadX: 70, spreadY: 12 },
};

export class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.initState();
    this.createOfficeView();
    this.createHud();
    this.createControls();
    this.applyView();
  }

  initState() {
    this.nightDurationMs = 120000;
    this.elapsedNightMs = 0;
    this.hourIndex = 0;
    this.power = 100;
    this.cameraOpen = false;
    this.selectedCamera = "CAM1";
    this.doors = {
      left: false,
      right: false,
    };
    this.gameEnded = false;
    this.globalBreachTimer = 0;

    this.monsters = [
      {
        id: "pixel",
        name: "Pixel Bara",
        key: ASSETS.monsters.capyGamer,
        route: ["stage", "dining", "leftDoor"],
        positionIndex: 0,
        aggression: 0.16,
        breachTimer: 0,
        moveDelayMs: Phaser.Math.Between(5000, 9000),
        isMoving: false,
        travelFrom: 0,
        travelTo: 0,
        travelProgress: 1,
        travelDurationMs: 0,
        lateralSeed: 0,
        allowedReachIndex: 0,
        dwellMinMs: 1800,
        dwellMaxMs: 4200,
      },
      {
        id: "luna",
        name: "Bara Luna",
        key: ASSETS.monsters.capyWizard,
        route: ["stage", "hall", "rightDoor"],
        positionIndex: 0,
        aggression: 0.17,
        breachTimer: 0,
        moveDelayMs: Phaser.Math.Between(6200, 10500),
        isMoving: false,
        travelFrom: 0,
        travelTo: 0,
        travelProgress: 1,
        travelDurationMs: 0,
        lateralSeed: 1,
        allowedReachIndex: 0,
        dwellMinMs: 2000,
        dwellMaxMs: 4400,
      },
      {
        id: "love",
        name: "Love Bara",
        key: ASSETS.monsters.capyLove,
        route: ["stage", "dining", "hall", "rightDoor"],
        positionIndex: 0,
        aggression: 0.14,
        breachTimer: 0,
        moveDelayMs: Phaser.Math.Between(7000, 12000),
        isMoving: false,
        travelFrom: 0,
        travelTo: 0,
        travelProgress: 1,
        travelDurationMs: 0,
        lateralSeed: 2,
        allowedReachIndex: 0,
        dwellMinMs: 2200,
        dwellMaxMs: 4800,
      },
    ];
  }

  createOfficeView() {
    this.roomLayer = this.add.container(0, 0);
    this.cameraLayer = this.add.container(0, 0);

    this.roomBg = this.add.rectangle(480, 270, 960, 540, 0x0d1017);
    this.roomCeiling = this.add.rectangle(480, 70, 960, 140, 0x171d2a);
    this.roomDesk = this.add.rectangle(480, 465, 960, 150, 0x1b2436);
    this.roomCenter = this.add
      .rectangle(480, 290, 340, 210, 0x0f1421)
      .setStrokeStyle(4, 0x283248);

    this.leftDoorPanel = this.add
      .rectangle(120, 270, 80, 330, 0x2a3142)
      .setStrokeStyle(3, 0x46516a);
    this.rightDoorPanel = this.add
      .rectangle(840, 270, 80, 330, 0x2a3142)
      .setStrokeStyle(3, 0x46516a);
    this.leftDoorShutter = this.add
      .rectangle(120, 270, 70, 300, 0x7b1e1e)
      .setVisible(false);
    this.rightDoorShutter = this.add
      .rectangle(840, 270, 70, 300, 0x7b1e1e)
      .setVisible(false);

    this.leftPeek = this.add
      .image(175, 320, ASSETS.monsters.capyGamer)
      .setScale(0.22)
      .setVisible(false)
      .setAlpha(0.95);
    this.rightPeek = this.add
      .image(785, 320, ASSETS.monsters.capyWizard)
      .setScale(0.22)
      .setVisible(false)
      .setAlpha(0.95);

    this.roomLayer.add([
      this.roomBg,
      this.roomCeiling,
      this.roomDesk,
      this.roomCenter,
      this.leftDoorPanel,
      this.rightDoorPanel,
      this.leftDoorShutter,
      this.rightDoorShutter,
      this.leftPeek,
      this.rightPeek,
    ]);

    this.cameraBackground = this.add
      .rectangle(480, 270, 960, 540, 0x0a0d13)
      .setVisible(false);

    // Create camera image sprites
    this.cameraImages = {};
    Object.entries(CAMERA_IMAGE_MAP).forEach(([camId, imageKey]) => {
      const image = this.add
        .image(480, 270, imageKey)
        .setDisplaySize(820, 420)
        .setVisible(false);
      this.cameraImages[camId] = image;
    });

    this.cameraTitle = this.add
      .text(32, 26, "CAM 1", {
        fontSize: "24px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setVisible(false);
    this.cameraNoise = this.add
      .rectangle(480, 270, 930, 510, 0xffffff, 0.08)
      .setVisible(false);
    this.cameraRoomTint = this.add
      .rectangle(480, 285, 820, 420, 0x222f45, 0.48)
      .setVisible(false);

    this.cameraMonsterSprites = this.monsters.map((monster) => {
      const sprite = this.add
        .image(480, 320, monster.key)
        .setScale(0.24)
        .setVisible(false);
      return sprite;
    });

    this.createMinimap();

    this.cameraLayer.add([
      this.cameraBackground,
      ...Object.values(this.cameraImages),
      this.cameraRoomTint,
      this.cameraNoise,
      ...this.cameraMonsterSprites,
      this.cameraTitle,
      this.minimapContainer,
    ]);
  }

  createMinimap() {
    this.minimapContainer = this.add.container(880, 270);

    const minimapBg = this.add
      .rectangle(0, 0, 150, 150, 0x0a0d13)
      .setStrokeStyle(2, 0x445566)
      .setVisible(false);

    const minimapTitle = this.add
      .text(-65, -65, "MAP", {
        fontSize: "14px",
        color: "#aabbcc",
        fontStyle: "bold",
      })
      .setVisible(false);

    const playerMarker = this.add
      .rectangle(0, 65, 11, 11, 0x44ff44)
      .setVisible(false);

    this.cameraMarkers = {};
    Object.entries(MINIMAP_LAYOUT).forEach(([camId, pos]) => {
      const marker = this.add
        .rectangle(pos.mapX - 50, pos.mapY - 50, 8, 8, 0x6688ff)
        .setVisible(false);
      const label = this.add
        .text(pos.mapX - 50, pos.mapY - 37, camId, {
          fontSize: "11px",
          color: "#ffffff",
        })
        .setOrigin(0.5)
        .setVisible(false);
      this.cameraMarkers[camId] = { marker, label };
    });

    this.minimapBg = minimapBg;
    this.minimapTitle = minimapTitle;
    this.playerMarker = playerMarker;

    const allMinimapItems = [
      minimapBg,
      minimapTitle,
      playerMarker,
      ...Object.values(this.cameraMarkers).flatMap((cm) => [
        cm.marker,
        cm.label,
      ]),
    ];
    this.minimapContainer.add(allMinimapItems);
  }

  updateMinimapDisplay() {
    if (!this.minimapBg) {
      return;
    }

    const showMinimap = this.cameraOpen;

    this.minimapBg.setVisible(showMinimap);
    this.minimapTitle.setVisible(showMinimap);
    this.playerMarker.setVisible(showMinimap);

    Object.entries(this.cameraMarkers).forEach(([camId, { marker, label }]) => {
      const isSelected = camId === this.selectedCamera;
      marker.setVisible(showMinimap);
      label.setVisible(showMinimap);
      marker.setFillStyle(isSelected ? 0xff6644 : 0x6688ff);
      label.setColor(isSelected ? "#ffaa44" : "#ffffff");
      label.setStyle({ fontStyle: isSelected ? "bold" : "normal" });
    });
  }

  createHud() {
    this.hudContainer = this.add.container(0, 0);

    this.hudBackdrop = this.add
      .rectangle(480, 36, 930, 54, 0x000000, 0.58)
      .setStrokeStyle(2, 0x2f3340);
    this.timeText = this.add.text(30, 20, "12 AM", {
      fontSize: "28px",
      color: "#ffffff",
      fontStyle: "bold",
    });

    this.powerText = this.add.text(760, 20, "Power: 100%", {
      fontSize: "24px",
      color: "#8eea90",
      fontStyle: "bold",
    });

    this.statusText = this.add.text(330, 21, "Survis jusqu’à 6 AM", {
      fontSize: "18px",
      color: "#f0db7f",
    });

    this.hudContainer.add([
      this.hudBackdrop,
      this.timeText,
      this.powerText,
      this.statusText,
    ]);
  }

  createControls() {
    this.controlsLayer = this.add.container(0, 0);

    this.cameraButton = this.createButton(480, 505, 180, 46, "CAMÉRAS", () => {
      if (this.power <= 0 || this.gameEnded) {
        return;
      }
      this.cameraOpen = !this.cameraOpen;
      this.applyView();
    });

    this.leftDoorButton = this.createButton(
      115,
      505,
      170,
      46,
      "PORTE GAUCHE",
      () => {
        if (this.power <= 0 || this.gameEnded) {
          return;
        }
        this.doors.left = !this.doors.left;
        this.applyDoorState();
      },
    );

    this.rightDoorButton = this.createButton(
      845,
      505,
      170,
      46,
      "PORTE DROITE",
      () => {
        if (this.power <= 0 || this.gameEnded) {
          return;
        }
        this.doors.right = !this.doors.right;
        this.applyDoorState();
      },
    );

    const cameras = ["CAM1", "CAM2", "CAM3", "CAML", "CAMR"];
    this.cameraButtons = cameras.map((camId, index) => {
      return this.createButton(
        180 + index * 150,
        82,
        130,
        34,
        camId,
        () => {
          this.selectedCamera = camId;
          this.applyCameraFeed();
        },
        0x22314a,
        0x62d0ff,
      );
    });

    this.cameraButtons.forEach((button) => button.container.setVisible(false));

    this.controlsLayer.add([
      this.cameraButton.container,
      this.leftDoorButton.container,
      this.rightDoorButton.container,
      ...this.cameraButtons.map((button) => button.container),
    ]);
  }

  createButton(
    x,
    y,
    width,
    height,
    label,
    callback,
    color = 0x1d2a3e,
    activeColor = 0x7f264f,
  ) {
    const container = this.add.container(x, y);
    const bg = this.add
      .rectangle(0, 0, width, height, color)
      .setStrokeStyle(2, 0xb1bfdc);
    const text = this.add
      .text(0, 0, label, {
        fontSize: "15px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    bg.setInteractive({ useHandCursor: true })
      .on("pointerdown", callback)
      .on("pointerover", () => bg.setFillStyle(activeColor))
      .on("pointerout", () => bg.setFillStyle(color));

    container.add([bg, text]);

    return {
      container,
      bg,
      text,
      defaultColor: color,
      hoverColor: activeColor,
    };
  }

  applyDoorState() {
    this.leftDoorShutter.setVisible(this.doors.left);
    this.rightDoorShutter.setVisible(this.doors.right);
    this.leftDoorButton.text.setText(
      this.doors.left ? "PORTE G: FERMÉE" : "PORTE GAUCHE",
    );
    this.rightDoorButton.text.setText(
      this.doors.right ? "PORTE D: FERMÉE" : "PORTE DROITE",
    );
  }

  applyView() {
    this.roomLayer.setVisible(!this.cameraOpen);
    this.cameraLayer.setVisible(this.cameraOpen);
    this.cameraButtons.forEach((button) =>
      button.container.setVisible(this.cameraOpen),
    );
    this.cameraButton.text.setText(
      this.cameraOpen ? "FERMER CAMÉRAS" : "CAMÉRAS",
    );
    this.applyDoorState();
    this.updateMinimapDisplay();
    this.applyCameraFeed();
  }

  applyCameraFeed() {
    this.updateMinimapDisplay();

    if (!this.cameraOpen) {
      this.cameraTitle.setVisible(false);
      this.cameraBackground.setVisible(false);
      this.cameraNoise.setVisible(false);
      this.cameraRoomTint.setVisible(false);
      Object.values(this.cameraImages).forEach((image) =>
        image.setVisible(false),
      );
      this.cameraMonsterSprites.forEach((sprite) => sprite.setVisible(false));
      return;
    }

    const cameraPosition = CAMERA_MAP[this.selectedCamera];

    this.cameraTitle.setText(this.selectedCamera);
    this.cameraTitle.setVisible(true);
    this.cameraBackground.setVisible(true);
    this.cameraNoise.setVisible(true);

    // Hide the tinted rectangle and show the camera image instead
    this.cameraRoomTint.setVisible(false);

    // Show the selected camera image and hide others
    Object.entries(this.cameraImages).forEach(([camId, image]) => {
      image.setVisible(camId === this.selectedCamera);
    });

    const layout = CAMERA_LAYOUT[this.selectedCamera] || CAMERA_LAYOUT.CAM1A;

    this.cameraMonsterSprites.forEach((sprite, index) => {
      const monster = this.monsters[index];
      const presence = this.getMonsterCameraPresence(monster, cameraPosition);
      const isVisible = presence > 0.12;

      sprite.setVisible(isVisible);

      if (isVisible) {
        const approach = this.getMonsterApproachProgress(monster);
        const pulse =
          Math.sin(this.time.now * 0.0022 + monster.lateralSeed) * 6;
        const offsetX = (index - 1) * layout.spreadX + pulse;
        const offsetY = (index % 2 === 0 ? -1 : 1) * layout.spreadY;

        sprite.setPosition(
          layout.x + offsetX,
          layout.y + offsetY + approach * 38,
        );

        const scale = 0.17 + approach * 0.22;
        sprite.setScale(scale);
        sprite.setAlpha(Phaser.Math.Clamp(0.35 + presence * 0.85, 0.35, 1));
      }
    });
  }

  getMonsterApproachProgress(monster) {
    const maxStep = monster.route.length - 1;
    if (maxStep <= 0) {
      return 0;
    }

    if (!monster.isMoving) {
      return monster.positionIndex / maxStep;
    }

    const travelIndex = Phaser.Math.Linear(
      monster.travelFrom,
      monster.travelTo,
      monster.travelProgress,
    );
    return Phaser.Math.Clamp(travelIndex / maxStep, 0, 1);
  }

  getMonsterCameraPresence(monster, cameraPosition) {
    const current = monster.route[monster.positionIndex];

    if (!monster.isMoving) {
      return current === cameraPosition ? 1 : 0;
    }

    const from = monster.route[monster.travelFrom];
    const to = monster.route[monster.travelTo];

    if (from === cameraPosition) {
      return 1 - monster.travelProgress;
    }

    if (to === cameraPosition) {
      return monster.travelProgress;
    }

    return 0;
  }

  isDoorOccupied(doorName, sourceMonster = null) {
    return this.monsters.some((other) => {
      if (other === sourceMonster) {
        return false;
      }

      const current = other.route[other.positionIndex];
      const movingToDoor =
        other.isMoving && other.route[other.travelTo] === doorName;
      return current === doorName || movingToDoor;
    });
  }

  startMonsterTravel(monster, nextIndex) {
    monster.isMoving = true;
    monster.travelFrom = monster.positionIndex;
    monster.travelTo = nextIndex;
    monster.travelProgress = 0;
    monster.travelDurationMs = Phaser.Math.Between(1000, 2200);
  }

  getAllowedReachIndex(monster) {
    const maxIndex = monster.route.length - 1;
    const phase = Phaser.Math.Clamp(this.hourIndex + 1, 1, 6);
    const normalized = phase / 6;
    const unlocked = Math.floor(normalized * (maxIndex + 1));
    return Phaser.Math.Clamp(unlocked, 0, maxIndex);
  }

  resolveMonsterDecision(monster) {
    const maxIndex = monster.route.length - 1;
    const bonusAggression = this.hourIndex * 0.026;
    const directionRoll = Math.random();
    const pushForwardChance = Phaser.Math.Clamp(
      monster.aggression +
        bonusAggression +
        Phaser.Math.FloatBetween(-0.04, 0.07),
      0.03,
      0.95,
    );

    const currentPosition = monster.route[monster.positionIndex];
    if (currentPosition === "leftDoor" || currentPosition === "rightDoor") {
      const retreatChance = this.power <= 0 ? 0 : 0.55;
      if (directionRoll < retreatChance && monster.positionIndex > 0) {
        this.startMonsterTravel(monster, monster.positionIndex - 1);
      }
      return;
    }

    if (
      directionRoll < pushForwardChance &&
      monster.positionIndex < maxIndex &&
      monster.positionIndex < monster.allowedReachIndex
    ) {
      const targetName = monster.route[monster.positionIndex + 1];
      if (
        (targetName === "leftDoor" || targetName === "rightDoor") &&
        this.isDoorOccupied(targetName, monster)
      ) {
        if (Math.random() < 0.8) {
          return;
        }
      }
      this.startMonsterTravel(monster, monster.positionIndex + 1);
      return;
    }

    const canRetreat = monster.positionIndex > 0;
    if (canRetreat && directionRoll > 0.92) {
      this.startMonsterTravel(monster, monster.positionIndex - 1);
    }
  }

  updateMonsterMovement(delta) {
    this.monsters.forEach((monster) => {
      monster.allowedReachIndex = this.getAllowedReachIndex(monster);

      if (monster.isMoving) {
        monster.travelProgress += delta / monster.travelDurationMs;
        if (monster.travelProgress >= 1) {
          monster.positionIndex = monster.travelTo;
          monster.isMoving = false;
          monster.travelProgress = 1;
          const dwellPhaseBonus = Phaser.Math.Clamp(
            (this.hourIndex - 2) * 300,
            -600,
            900,
          );
          const dwellMin = Math.max(900, monster.dwellMinMs - dwellPhaseBonus);
          const dwellMax = Math.max(
            dwellMin + 300,
            monster.dwellMaxMs - dwellPhaseBonus,
          );
          monster.moveDelayMs = Phaser.Math.Between(dwellMin, dwellMax);
        }
        return;
      }

      monster.moveDelayMs -= delta;
      if (monster.moveDelayMs > 0) {
        return;
      }

      this.resolveMonsterDecision(monster);
      if (!monster.isMoving) {
        const idleMin = Math.max(1000, monster.dwellMinMs - 500);
        const idleMax = Math.max(idleMin + 300, monster.dwellMaxMs - 250);
        monster.moveDelayMs = Phaser.Math.Between(idleMin, idleMax);
      }
    });
  }

  update(time, delta) {
    if (this.gameEnded) {
      return;
    }

    this.elapsedNightMs += delta;
    const hourProgress = Math.floor(
      (this.elapsedNightMs / this.nightDurationMs) * 6,
    );
    this.hourIndex = Phaser.Math.Clamp(hourProgress, 0, 6);

    if (this.hourIndex >= 6) {
      this.finishNight(true, "Tu as survécu jusqu’à 6 AM !");
      return;
    }

    const baseDrain = 0.55;
    const cameraDrain = this.cameraOpen ? 0.35 : 0;
    const leftDoorDrain = this.doors.left ? 0.45 : 0;
    const rightDoorDrain = this.doors.right ? 0.45 : 0;
    const totalDrainPerSecond =
      baseDrain + cameraDrain + leftDoorDrain + rightDoorDrain;

    this.power = Math.max(0, this.power - (totalDrainPerSecond * delta) / 1000);

    if (this.power <= 0) {
      this.doors.left = false;
      this.doors.right = false;
      this.cameraOpen = false;
      this.statusText.setText("Power out... tiens bon !");
      this.statusText.setColor("#ff7e7e");
      this.applyView();
    }

    this.updateMonsterMovement(delta);
    this.updateDoorThreats(delta);

    if (this.cameraOpen) {
      this.applyCameraFeed();
    }

    this.updateHud();
  }

  updateDoorThreats(delta) {
    const leftThreat = this.monsters.some((monster) => {
      const current = monster.route[monster.positionIndex];
      const movingIn =
        monster.isMoving &&
        monster.route[monster.travelTo] === "leftDoor" &&
        monster.travelProgress > 0.55;
      return current === "leftDoor" || movingIn;
    });
    const rightThreat = this.monsters.some((monster) => {
      const current = monster.route[monster.positionIndex];
      const movingIn =
        monster.isMoving &&
        monster.route[monster.travelTo] === "rightDoor" &&
        monster.travelProgress > 0.55;
      return current === "rightDoor" || movingIn;
    });

    this.leftPeek.setVisible(leftThreat && !this.cameraOpen);
    this.rightPeek.setVisible(rightThreat && !this.cameraOpen);

    this.monsters.forEach((monster) => {
      const currentPosition = monster.route[monster.positionIndex];
      if (currentPosition !== "leftDoor" && currentPosition !== "rightDoor") {
        monster.breachTimer = 0;
        return;
      }

      const blocked =
        currentPosition === "leftDoor" ? this.doors.left : this.doors.right;
      if (blocked) {
        monster.breachTimer = 0;
        return;
      }

      monster.breachTimer += delta;
    });

    const breachMonster = this.monsters.find(
      (monster) => monster.breachTimer >= 3500,
    );
    if (breachMonster) {
      this.finishNight(
        false,
        `${breachMonster.name} t'a attrapé !`,
        breachMonster,
      );
      return;
    }

    if (this.power <= 0 && (leftThreat || rightThreat)) {
      this.globalBreachTimer += delta;
      if (this.globalBreachTimer > 1600) {
        this.finishNight(false, "Plus de courant... les capys arrivent.");
      }
    } else {
      this.globalBreachTimer = 0;
    }
  }

  updateHud() {
    const displayPower = Math.ceil(this.power);
    this.timeText.setText(HOURS[this.hourIndex]);
    this.powerText.setText(`Power: ${displayPower}%`);

    if (this.power > 50) {
      this.powerText.setColor("#8eea90");
    } else if (this.power > 25) {
      this.powerText.setColor("#ffd971");
    } else {
      this.powerText.setColor("#ff8f8f");
    }
  }

  finishNight(won, reason, monster = null) {
    if (this.gameEnded) {
      return;
    }

    this.gameEnded = true;

    this.scene.start("GameOver", {
      won,
      reason,
      hour: HOURS[this.hourIndex],
      power: Math.max(0, Math.ceil(this.power)),
      monsterKey: monster ? monster.key : null,
    });
  }
}
