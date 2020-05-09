class dextgameGameScreen extends Phaser.Scene{
  constructor(){
    super({key:"gameScreen"});
    this.timerLeft;
    this.timerRight;
  }

  preload(){
    //Used for load music and pictures
    this.load.image('brush', 'img/brush1.png');
    this.load.image('flares', 'assets/particles/blue.png');
    this.load.image('tileback', 'assets/particles/star2.jpg');
    touchCounter = 2;
    score = 0;
  }

  create(){
    //create objects
    this.add.image(400, 300, 'tileback').setScale(0.6).setDepth(-20);
    this.back = this.add.tileSprite(0,0,5000,5000, 'tileback').setScale(0.8).setDepth(-20);
    var pointer = this.input.addPointer(1);
    text = this.add.text(20,20, 'Welcome to Level ' + userLevel + '!');
    text.setColor('aqua');
    timeTextLeft = this.add.text(40, 40, 'Left Timer: ');
    timeTextRight = this.add.text(500, 40, 'Right Timer: ');
    var graphicsDrawing = this.add.graphics({ fillStyle: { color: 0x9400D3 } });

    //picks a shape from the shape database and checks to make sure we have not used this shape yet.
    var indexLeft = Math.floor(Math.random() * shapeList.length);
    var indexRight = Math.floor(Math.random() * shapeList.length);

    leftShape = shapeList[indexLeft];
    while(leftShape.hasUsed == true){
      indexLeft = Math.floor(Math.random() * shapeList.length);
      leftShape = shapeList[indexLeft];
    }

    //picks a shape from the shape database and checks
    //to make sure the two randomly picked shapes are not the same shape
    //and checks to make sure we have not used this shape yet
    rightShape = shapeList[indexRight];
    while (rightShape.name == leftShape.name || rightShape.hasUsed == true){
      indexRight = Math.floor(Math.random() * shapeList.length);
      rightShape = shapeList[indexRight];
    }

    shapeList[indexLeft].hasUsed = true;
    shapeList[indexRight].hasUsed = true;

    var leftGraphics = this.strokeShape(leftShape.shapePoints, 0x0000FF);
    var rightGraphics = this.strokeShape(rightShape.shapePoints, 0xFF0000);

    leftGraphics.setPosition(150, 250);
    rightGraphics.setPosition(550, 250);

    //Allows the User to draw *over* the shapes
    leftGraphics.setDepth(-10);
    rightGraphics.setDepth(-10);

    var tracer1 = new Tracer(leftShape.shapePoints, leftGraphics);
    var tracer2 = new Tracer(rightShape.shapePoints, rightGraphics);

    for (var tracer of [tracer1, tracer2]){
      tracer.onPointReached = (x, y) =>{
        var particles = this.add.particles('flares');
        var emitter = particles.createEmitter();
        // particles.setScale(0.1);
        // emitter.emitParticleAt(x,y);
        emitter.setLifespan(200);
        emitter.setAlpha(0.5);
        emitter.setSpeed(240);
        // emitter.setRadius(0.2);
        emitter.setScale(0.2);
        emitter.setBlendMode(Phaser.BlendModes.ADD);
        this.add.image(x, y, 'brush').setScale(0.8).setDepth(-20).setTint(0xFFA500);
        emitter.explode(60, x, y)
      };
    }
    
    //Finds the point that the player is starting nearest on the shape
    this.input.on('pointerdown', (pointer) => {
      var x = pointer.x;
      var y = pointer.y;

      if (x <= 400){
        tracer1.start(x, y);
        pointer.pointerId = 1;
        tracer1.pointerID = pointer.pointerId;
      }
      else if (x > 400){
        tracer2.start(x, y);
        pointer.pointerId = 2;
        tracer2.pointerID = pointer.pointerId;
      }

      this.input.on('pointerup', (pointer) => {
        if (pointer.pointerId == tracer1.pointerID){
          touchCounter--;
        }
        else if (pointer.pointerId == tracer2.pointerID){
          touchCounter--;
        }
      }, this);

    }, this);

    //Allows user to draw when pressing finger down
    this.input.on('pointermove', (pointer) => {
      if (pointer.isDown){
        var x = pointer.x;
        var y = pointer.y;

        avg = total/2;
        perc = (avg/130000)*100;
        score = perc - ((diff)/total)*100;

        if (pointer.pointerId == tracer1.pointerID){
          tracer1.trace(x, y);
          timeTextLeft.setText('Left: ' + Math.floor([this.timerLeft-accumulatedLeftTime]));
          var userTrail = this.add.image(x, y, 'brush').setScale(0.5).setAlpha(0.3).setTint(0xFF000);
          this.tweens.add({
            targets: userTrail,
            alpha: 0,
            duration: 2500,
            ease: 'Power2'
          }, this);
        }
        else if (pointer.pointerId == tracer2.pointerID){
          tracer2.trace(x, y);
          timeTextRight.setText('Right: ' + Math.floor([this.timerRight-accumulatedRightTime]));
          var userTrail = this.add.image(x, y, 'brush').setScale(0.5).setAlpha(0.3).setTint(0x9400D3);
          this.tweens.add({
            targets: userTrail,
            alpha: 0,
            duration: 2500,
            ease: 'Power2'
          }, this);
        }

        if (tracer1.pathFinished && tracer2.pathFinished){
          if (score >= 80){
            sceneChangeCondition=0;
          }
          else{
            sceneChangeCondition = 1;
          }
          winCondition = true;
        }
      }
    }, this);
  }

  strokeShape(shapePoints, color){
    var graphics = this.add.graphics();
    graphics.lineStyle(5, color, 1.0);
    graphics.beginPath();
    for (var [i, point] of shapePoints.entries()) {
      var lineOp = (i == 0) ? "moveTo" : "lineTo";
      graphics[lineOp](point[0], point[1]);
    }
    graphics.closePath();
    graphics.stroke();
    return graphics;
  }

  update(time){
    checkOriention(window.innerWidth, window.innerHeight);
    this.back.tilePositionX +=0.5;
    //Sets timer var equal to time
    this.timerLeft = time;
    this.timerRight = time;
    total = (130000-(-accumulatedLeftTime)) + (130000-(this.timerRight-accumulatedRightTime));
    diff = Phaser.Math.Difference((this.timerLeft-accumulatedLeftTime), (this.timerRight-accumulatedRightTime));

    if (touchCounter < 2){
      this.scene.start("loseScreen");
    }

    if (winCondition){
      cumulativeScore += score;
      completedShapes += 2;
      accumulatedLeftTime = time;
      accumulatedRightTime = time;
      if (completedShapes == shapeList.length && score >= 80){
        this.scene.start("winScreen");
      }
      else
        this.scene.start("scoreScreen");
    }
  }

}
