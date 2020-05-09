class dextgameScoreScreen extends Phaser.Scene{
  constructor(){
    super({key:"scoreScreen"});
    this.loseCondition;
  }

  preload(){
    //sets the loose condition to false
    this.loseCondition = false;
  }

  create(){
    //checks to see if the user beat the level
    //if so, the game shows a congradulations text on the screen, sets the set
    //then displays the scores, Current, Average, and tells the instructions of
    //continueing. Else, the game presents the failed message with, the try
    //again button

    if (sceneChangeCondition == 0){
      var congratsText = this.add.text(323, 200, 'Nice going!');
      congratsText.setColor('aqua');
      var displayScore = this.add.text(300, 240, 'Current Score: ' + Math.floor(score));
      var displayAvgScore = this.add.text(300, 260, 'Average Score: ' + Math.floor(cumulativeScore/userLevel))
      var instructions = this.add.text(80, 280, 'When ready, press the button below to move on to the next level!');

      continueButton = this.add.text(450,450, "Continue", {fill: '#0f0'}).setInteractive()
      .on('pointerdown', ()=>this.actionOnClick())
      .on('pointerup', ()=>this.actionOnRelease()).setFontSize(25);
      userLevel += 1;


      rulesButton = this.add.text(300,450, "Rules", {fill: '#0f0'}).setInteractive()
      .on('pointerdown', ()=>this.actionOnClick())
      .on('pointerup', ()=>this.actionOnReleaseRules()).setFontSize(25);
    }
    else if (sceneChangeCondition==1) {
      var loseText = this.add.text(323, 200, 'YOU LOSE! Would you like to play again?');
      loseText.setColor('red');
      var displayScore = this.add.text(300, 220, 'Current Score: ' + Math.floor(score));
      var displayAvgScore = this.add.text(300, 240, 'Average Score: ' + Math.floor(score/userLevel));

      this.loseCondition = true;

      continueButton = this.add.text(450,450, "Try Again", {fill: '#0f0'}).setInteractive()
      .on('pointerdown', ()=>this.actionOnClick())
      .on('pointerup', ()=>this.actionOnRelease()).setFontSize(25);
    }

  }

  //fucnttion that changes the color of the button when clciked
  actionOnClick(){
    continueButton.setStyle({ color: '#ff0'});
  }

  //function that triggers either restart or game screen depending on if the
  //user failed or succeded on the previous level.
  actionOnRelease(){
    if (this.loseCondition)
      this.scene.start("restart");
    else
      this.scene.start("gameScreen");
  }

  // //fucnttion that changes the color of the button when clciked
  // actionOnClickRules(){
  //   rulesButton.setStyle({ color: '#ff0'});
  // }

  //when the putton is realased, the game will start the rules screen
  actionOnReleaseRules(){
    this.scene.start("rulesScreen");
  }

  update(){
    //checks to make sure the user is in Landscape View
    checkOriention(window.innerWidth, window.innerHeight);
    //resents window condition
    winCondition = false;
  }

}
