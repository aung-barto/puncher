//setting up stage for game
var stage, canvas, holder;
var mole, dMole, moleBound, ring, ringRadius, moleRaw, bounds, loop, clearTime, listener; 
var speed = 11500;
var dSpeed = 7000;
var kill = [];
var bounce = createjs.Ease.getPowOut(4);
var punchSound = "punching";
var crowdSound = "crowding";
var count = 1;
var clock;
var second = 8;
var moles = [];
var glove = new createjs.Bitmap("./images/boxing_glove.png");
var iceCream = new createjs.Bitmap("./images/ice_cream_s.png");
  
//array of functions to push moles from random locations
var path = [pathOne, pathTwo, pathThree, pathFour];
var random = function(){return Math.floor(Math.random()*120)};

function init(){
  createjs.MotionGuidePlugin.install(createjs.Tween);
  canvas = document.getElementById("gameCanvas");
  stage = new createjs.Stage(canvas);

  //create a container to store all moles
  holder = stage.addChild(new createjs.Container());

  stage.autoClear = true;

  window.addEventListener('resize', updateCanvasSize);
  updateCanvasSize();
  
  target();

  loadSound();
  setTimeout(crowd, 1000);
  loop = setInterval(shootMoles, 4000);
  stage.addChild(glove);

 
  timer();


  createjs.Ticker.setFPS(40);
  createjs.Ticker.addEventListener("tick", stage);
  createjs.Ticker.addEventListener("tick", moveGlove);
  listener = createjs.Ticker.on("tick", timesUp);
}

function loadSound() {
  createjs.Sound.registerSound("./sounds/sharp_punch_sound.mp3", punchSound);
  createjs.Sound.registerSound("./sounds/sports_crowd.mp3", crowdSound);
}

function punch() {
  createjs.Sound.play(punchSound);
}

function crowd(){
  createjs.Sound.play(crowdSound);
}


function timer(){
  // debugger
clearTime =setInterval(function(){
    second--;
    $(".timer").html(second);
  }, 1000);
 stage.update();
};
   // $(".timer").html()-1;
    // $(".timer").html(function(c, clock){
    //   return clock*1-1;

function timesUp(){
  // if ($(".timer").html() == "0" && count > 10){
  //   clearInterval(loop);
  //   clearInterval(clearTime);
  //   holder.removeAllChildren();
  //   stage.removeAllChildren();
  //   stage.clear();
  //   $('.level2').html('LEVEL 2');
  //   setTimeout(restart,3000);
  // }
  // else 
    if($(".timer").html() === "0") {
    clearInterval(loop);
    clearInterval(clearTime);
    createjs.Ticker.off("tick", listener);
    console.log(count)
    postScore();
    ;
    // setTimeout(redirect, 2000);
  }
  stage.update();
}

// function redirect(){
//   window.location.assign("http://localhost:3000/timesup");
// }

function postScore(){
   var scoreData = JSON.stringify({score: count});
    $.ajax({
      method: 'POST',
      url: '/timesup',
      dataType: 'json',
      data: scoreData,
      contentType: "application/json"
    }).done(function(data){
        window.location.assign("http://localhost:3000/timesup/" + data.id)
    });
}
// function restart(){
//   speed = 10000;
//   second = 15;
//   timer();
//   //create a container to store all moles
//   holder = stage.addChild(new createjs.Container());

//   stage.autoClear = true;

//   window.addEventListener('resize', updateCanvasSize);
//   updateCanvasSize();
  
//   target();

//   loadSound();
//   setTimeout(crowd, 1000);
//   loop = setInterval(shootMoles, 3000);
//   stage.addChild(glove);

//   createjs.Ticker.addEventListener("tick", stage);
//   createjs.Ticker.addEventListener("tick", moveGlove);
//   createjs.Ticker.addEventListener("tick", timesUp);
//   stage.update();
// }

function moveGlove(event){
  glove.x = stage.mouseX - 30;
  glove.y = stage.mouseY - 33;
  stage.update();
}

function updateCanvasSize(){
  var w = window.innerWidth;
  var h = window.innerHeight;
  canvas.width = w;
  canvas.height = h-100;
}
//projecting moles from different paths
function shootMoles(){
  for (var shoot = 0; shoot < path.length; shoot++){
   path[shoot]();
  }
}

//target ring - doesn't move
function target(){
  // ring = new createjs.Shape();
  // ring.graphics.ss(7, 'round', 'round').s(('#ff0000')).dc(0,0,canvas.height*0.225);
  iceCream.x = canvas.width * 0.5;
  iceCream.y = canvas.height * 0.5;
  iceCream.scaleX = 0.8;
  iceCream.scaleY = 0.8;
  // ringRadius = canvas.height*0.225;
  // ringBound = ring.getBounds();
  // console.log(ringBound);
  holder.addChild(iceCream);
}

function moleIntersectTarget(mole){
  var l = holder.getNumChildren();
  for (var m = 0; m < l; m++){
    var pig = holder.getChildAt(m);
  // console.log('intersect')

  // for (var i = 0; i< moles.length; i++){
    // var pig = moles[i];
    console.log("pig coords= "+pig.x + ","+pig.y)
    var dx = iceCream.x+40 - pig.x;
    var dy = iceCream.y+64 - pig.y;
    var distance = Math.sqrt(dx*dx+dy*dy);
    // console.log(distance);
    if (distance < 75) {

    // if(pig.x == canvas.width*0.5 && pig.y == canvas.height*0.5){

    // if(((pig.x > canvas.width*0.5 - 40 && pig.x < canvas.width*0.5)&&(pig.y > canvas.height*0.5 - 64 && pig.y < canvas.height*0.5))&&
    // ((pig.x > canvas.width*0.5 && pig.x < canvas.width*0.5 + 40)&&(pig.y > canvas.height*0.5 - 64 && pig.y < canvas.height*0.5))&&
    // ((pig.x > canvas.width*0.5 && pig.x < canvas.width*0.5 + 40)&&(pig.y > canvas.height*0.5 && pig.y < canvas.height*0.5 + 64))&&
    // ((pig.x > canvas.width*0.5 - 40 && pig.x < canvas.width*0.5)&&(pig.y > canvas.height*0.5 && pig.y < canvas.height*0.5 + 64))){
      // console.log('crashed');
      window.location.assign("http://localhost:3000/gameover");
    }
    // var collision = ndgmr.checkPixelCollision(iceCream, pig);
    // if (collision){
    //   // console.log("collision");
    //   window.location.assign("http://localhost:3000/gameover");
    // }
  }
  stage.update();
  // // console.log(ringRadius);
    
  //     console.log("collision")
  //   }
    // if(child.x == canvas.width*0.5 || child.y == canvas.height*0.5){
    //   console.log("collision");
    // }
    // var distanceX = child.x - ring.x;
    // var distanceY = child.y - ring.y;

    // var magnitudeSquared = distanceX * distanceX + distanceY + distanceY;
    // console.log("x " + distanceX);
    // console.log("y " + distanceY);
    // console.log("ring radius " + ringRadius);
    // console.log("magnitude " + magnitudeSquared);
    // console.log((ringRadius + 45) * (ringRadius + 45));
    // if( magnitudeSquared < ((ringRadius + 45) * (ringRadius + 45))){

    // console.log("TOUCH!!!");
    // }
  // }
}

//create individual mole
function makeMole(){
    var moleSprite = new createjs.SpriteSheet({
        framerate: 30,
        "images": ["./images/norm.png"],
        //{regX, regY - mid position of a frame| height, width of a frame| total number of frames}
        "frames": {
            "regX": 35, 
            "height": 70, 
            "count": 3, 
            "regY": 35, 
            "width": 70
        },
        //[frame index, action, loop speed]
        "animations": {
          "spin": [0, 2, "spin", 0.05],
        }
    });
    // mole.crossOrigin = "Anonymous";
    // moleRaw = new createjs.Sprite(moleSprite, "spin");
    mole = new createjs.Sprite(moleSprite, "spin");
    //set boundary around mole for collision detection
    // moleBound = new createjs.Shape();
    // moleBound.graphics.ss(1, 'round', 'round').s(("#000000")).dc(0,0,35);
    // moleBound.alpha = 0.5;
    // bounds = moleBound.getBounds();
    // moleBound.setBounds(0, 0, 70, 70);
    // stage.addChild(moleBound);

    // mole = new createjs.Container();
    // mole.addChild(moleRaw, moleBound);
    // moles.push(mole);
    holder.addChild(mole);
    // createjs.Ticker.addEventListener("tick", checkOverLap);
    createjs.Ticker.on("tick", hitMole);
    // createjs.Ticker.addEventListener("tick", moleIntersectTarget);
}

//generate dead moles to replace rolled over moles
function deadMole(){
    var dMoleSprite = new createjs.SpriteSheet({
        framerate: 30,
        "images": ["./images/knockout.png"],
        "frames": {
            "regX": 35, 
            "height": 69, 
            "count": 6, 
            "regY": 34.5, 
            "width": 70
        },

        "animations": {
          "spin": [0, 5, "spin", 0.2],
        }
    });
    dMole = new createjs.Sprite(dMoleSprite, "spin");  

    //killed position
    dMole.x = kill[0];
    dMole.y = kill[1];
    stage.addChild(dMole);
}

function removeDeadMole(dMole){
  stage.removeChild(dMole);
}

function counter(count){
  $(".count").html(function(i,count){
    return count * 1 + 1;
  });
}

//when mouse is in each mole's boundary, kill
function hitMole(event){
  var l = holder.getNumChildren();
  for ( var m = 0; m < l; m++){
    var child = holder.getChildAt(m); //get child by index
    var pt = (child.globalToLocal(stage.mouseX, stage.mouseY))
    if (stage.mouseInBounds && child.hitTest(pt.x, pt.y)) {
      //get last mouse coordinates before killing each mole
      kill[0] = stage.mouseX;
      kill[1] = stage.mouseY;
      punch();
      count++;
      counter();
    
      //kill and replace with dead mole
      holder.removeChildAt(m);
      deadMole();

      //where did the mole get killed?
      //top left of target
      if (dMole.x < canvas.width*0.5 && dMole.y < canvas.height*0.5){
        createjs.Tween.get(dMole)
        .to({x: -dMole.x-400, y: -dMole.y-400}, dSpeed, bounce);
        //when mole goes off screen
        if (dMole.x <= -30 || dMole.y <= -30){
          // removeDeadMole();
        }
      }
      //top right of target
      else if (dMole.x > canvas.width*0.5 && dMole.y < canvas.height*0.5){
        createjs.Tween.get(dMole)
        .to({x: dMole.x+400, y: -dMole.y-400}, dSpeed, bounce);
        if (dMole.x >= canvas.width || dMole.y <= -30){
          // removeDeadMole();
        }
      }
      //bottom right of target
      else if (dMole.x > canvas.width*0.5 && dMole.y > canvas.height*0.5){
        createjs.Tween.get(dMole)
        .to({x: dMole.x+400, y: dMole.y+400}, dSpeed, bounce);
        if (dMole.x >= canvas.width || dMole.y >= canvas.height){
          // removeDeadMole();
        }
      }
      //bottom left of target
      else if (dMole.x < canvas.width*0.5 && dMole.y > canvas.height*0.5){
        createjs.Tween.get(dMole)
        .to({x: -dMole.x-400, y: dMole.y+400}, dSpeed, bounce);
        if (dMole.x <= -30 || dMole.y >= canvas.height){
          // removeDeadMole();
        }
      }
      //left x-axis of target
      else if (dMole.x < canvas.width*0.5 && dMole.y == canvas.height*0.5){
        createjs.Tween.get(dMole)
        .to({x: -dMole.x-400}, dSpeed, bounce);
        if (dMole.x <= -30){
          // removeDeadMole();
        }
      }
      //top y-axis of target
      else if (dMole.x == canvas.width*0.5 && dMole.y < canvas.height*0.5){
        createjs.Tween.get(dMole)
        .to({y: -dMole.y-400}, dSpeed, bounce);
        if (dMole.y <= -30){
          // removeDeadMole();
        }
      }
      //right x-axis of target
      else if (dMole.x > canvas.width*0.5 && dMole.y == canvas.height*0.5){
        createjs.Tween.get(dMole)
        .to({x: dMole.x+400}, dSpeed, bounce);
        if (dMole.x >= canvas.width){
          // removeDeadMole();
        }
      }
      //bottom y-axis of target
      else if (dMole.x == canvas.width*0.5 && dMole.y > canvas.height*0.5){
        createjs.Tween.get(dMole)
        .to({y: dMole.y+400}, dSpeed, bounce);
        if (dMole.y >= canvas.height){
          // removeDeadMole();
        }
      }
    }
  }
  stage.update(event);
}

// generating paths for new moles
//from left to right
function pathOne(){
  makeMole();
  createjs.Tween.get(mole)
  .to({guide: {path: [-50,ry(), rx(),ry(), canvas.width+50,ry()]}}, speed);
  stage.removeChild(mole);
}
//from right to left
function pathTwo(){
  makeMole();
  createjs.Tween.get(mole)
  .to({guide: {path: [canvas.width+50,ry(), canvas.width*0.5,canvas.height*0.5, -50,ry()]}}, speed);
  stage.removeChild(mole);
}
//from top to bottom
function pathThree(){
  makeMole();
  createjs.Tween.get(mole)
  .to({guide: {path: [rx(),-50, canvas.width*0.5,canvas.height*0.5, rx(),canvas.height+50]}}, speed);
  stage.removeChild(mole);
}
//from bottom to top
function pathFour(){
  makeMole();
  createjs.Tween.get(mole)
  .to({guide: {path: [rx(),canvas.height, canvas.width*0.5,canvas.height*0.5, rx(),-50]}}, speed);
  stage.removeChild(mole);
}

//random x position
function rx() {
  return Math.random() * 2580 + 10;
}
//random y position
function ry() {
  return Math.random() * 600 + 10;
}
//random hex color
function rc() {
  return Math.round(Math.random() * 0xED + 0x12).toString(16);
}


// function createMoleBound(mole){
//   var g = new createjs.Graphics();
//   g.setStrokeStyle(1);
//   g.beginStroke("#000000");
//   // var radius = getMoleRadius(mole);
//   g.drawCircle(mole.x, mole.y, 50);
//   console.log("circle");
//   return new createjs.Shape(g);
//   stage.addChild(g);
// }
// var ringX = ringY = (canvas.height*0.225)/2;
// var ringRadius = canvas.height*0.225;
// var moleBoundX = moleBoundY = 45;
// var moleBoundRadius = 45; 

//create individual mole
// function makeMole(){
  // mole = new createjs.Shape();
  // mole.graphics.ss(1, 'round', 'round').f("#" + rc() +rc() +rc()).dc(0,0,30).ef().es();
  
  
  // punchMole(mole);
  // holder.addChild(mole);

  // createjs.Ticker.on("tick", tick);
  // createjs.Ticker.timingMode = createjs.Ticker.RAF; 
// }

//generate dead moles to replace rolled over moles
// function deadMole(){
  // dMole = new createjs.Shape();
  // dMole.graphics.beginFill("#000000").drawCircle(0,0,30);
  // dMole = new createjs.Sprite(knockOutSprite, "spin");
  // dMole.gotoAndPlay("spin");
  //killed position
//   dMole.x = kill[0];
//   dMole.y = kill[1];
//   stage.addChild(dMole);
// }
