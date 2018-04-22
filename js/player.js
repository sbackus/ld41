class Player {
  constructor(scene) {
    this.sprite = scene.physics.add.sprite(200, 200, 'player');
    this.scene = scene;
  }

  static preload(scene) {
    // player animations
    scene.load.atlas('player', 'assets/octosprite.png', 'assets/player.json');
  }

  static createAnims(scene){
    // player walk animation
    scene.anims.create({
        key: 'walk',
        frames: scene.anims.generateFrameNames('player', {prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
        frameRate: 10,
        repeat: -1
    });
    // idle with only one frame, so repeat is not neaded
    scene.anims.create({
        key: 'idle',
        frames: [{key: 'player', frame: 'p1_stand'}],
        frameRate: 10,
    });
  }

  create(groundLayer, coinLayer, playerIndex, playerTexts) {
    this.playerIndex = playerIndex;
    this.score = 0;
    this.sprite.setBounce(0.2); // our player will bounce from items
    this.sprite.setCollideWorldBounds(true); // don't go out of the map
    // small fix to our player images, we resize the physics body object slightly
    this.sprite.body.setSize(this.sprite.width-30, this.sprite.height-30);
    // player will collide with the level tiles
    this.scene.physics.add.collider(groundLayer, this.sprite);
    // when the player overlaps with a tile with index 17, collectCoin
    // will be called
    this.scene.physics.add.overlap(this.sprite, coinLayer);

    // this text will show the score
    const text = this.scene.add.text(40 * playerIndex, 570, '0', {
        fontSize: '20px',
        fill: '#ffffff'
    });
    // fix the text to the camera
    text.setScrollFactor(0);
    playerTexts.push(text);
  }

  update(cursor) {
    if (!this.hasControl && this.sprite.body.onFloor()) {
        this.sprite.body.setVelocityX(0);
        return;
    }
    if (cursor.left.isDown)
    {
        this.sprite.body.setVelocityX(-200);
        this.sprite.anims.play('walk', true); // walk left
        this.sprite.flipX = true; // flip the sprite to the left
    }
    else if (cursor.right.isDown)
    {
        this.sprite.body.setVelocityX(200);
        this.sprite.anims.play('walk', true);
        this.sprite.flipX = false; // use the original sprite looking to the right
    } else {
        this.sprite.body.setVelocityX(0);
        this.sprite.anims.play('idle', true);
    }
    // jump
    if (cursor.up.isDown && this.sprite.body.onFloor())
    {
        this.sprite.body.setVelocityY(-500);
    }
  }
}
