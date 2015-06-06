//setting up stage for game
var stage, canvas, holder;
var mole, dMole, glove, moleBound, ring, radius, moleRaw; 
var speed = 11000;
var dSpeed = 7000;
var kill = [];
var bounce = createjs.Ease.getPowOut(4);
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
  //replace cursor with glove
  glove = new createjs.Bitmap("./images/boxing_glove.png");
  stage.addChild(glove);

  setInterval(shootMoles, 3000);
  createjs.Ticker.setFPS(40);
  createjs.Ticker.addEventListener("tick", stage);
  createjs.Ticker.addEventListener("tick", moveGlove);
  createjs.Ticker.addEventListener("tick", removeOutBoundMole);
  // createjs.Ticker.addEventListener("tick", dangerZone);
}

function moveGlove(event){
  glove.x = stage.mouseX;
  glove.y = stage.mouseY;
  stage.update();
}

function updateCanvasSize(){
  var w = window.innerWidth;
  var h = window.innerHeight;
  canvas.width = w;
  canvas.height = h-49;
}
//projecting moles from different paths
function shootMoles(){
  for ( i = 0; i < path.length; i++){
   path[i]();
  }
}
//target ring - doesn't move
function target(){
  ring = new createjs.Shape();
  ring.graphics.ss(7, 'round', 'round').s(('#ff0000')).dc(0,0,canvas.height*0.225);
  ring.x = canvas.width * 0.5;
  ring.y = canvas.height * 0.5;
  stage.addChild(ring);
}

// function getMoleRadius(mole){
//   radius = Math.sqrt(((mole.image.width/2 * mole.image.width/2) + (mole.image.height/2 * mole.image.height/2)));
//   console.log(radius);
// }

function createMoleBound(mole){
  var g = new createjs.Graphics();
  g.setStrokeStyle(1);
  g.beginStroke("#000000");
  // var radius = getMoleRadius(mole);
  g.drawCircle(mole.x, mole.y, 50);
  console.log("circle");
  return new createjs.Shape(g);
  stage.addChild(g);
}

function moleIntersectTarget(ringX, ringY, ringRadius, moleBoundX, moleBoundY, moleBoundRadius){
  var distanceX = moleBoundX - ringX;
  var distanceY = moleBoundY - ringY;

  var magnitudeSquared = distanceX * distanceX + distanceY + distanceY;
  return magnitudeSquared < (ringRadius + moleBoundRadius) * (ringRadius + moleBoundRadius);
}

//create individual mole
function makeMole(){
    var moleSprite = new createjs.SpriteSheet({
        framerate: 30,
        "images": ["./images/norm.png"],
        //regX, regY - mid position of a frame
        //height, width of a frame
        //total number of frames
        "frames": {
            "regX": 50, 
            "height": 90, 
            "count": 3, 
            "regY": 45, 
            "width": 100
        },
        //[frame index, action, loop speed]
        "animations": {
          "spin": [0, 2, "spin", 0.05],
        }
    });
    moleRaw = new createjs.Sprite(moleSprite, "spin");
    // mole.onload = function(){
      // var g = new createjs.Graphics();
      // g.setStrokeStyle(1);
      // g.beginStroke("#000000");
      // g.drawCircle(mole.x, mole.y, 50);
      moleBound = new createjs.Shape();
      moleBound.graphics.ss(1, 'round', 'round').s(("#000000")).dc(0,0,50);
      moleBound.alpha = 0.5;
      stage.addChild(moleBound);

      mole = new createjs.Container();
      mole.addChild(moleRaw, moleBound);
    stage.addChild(mole);

    createjs.Ticker.on("tick", tick);
}

//generate dead moles to replace rolled over moles
function deadMole(){
    var dMoleSprite = new createjs.SpriteSheet({
        framerate: 30,
        "images": ["./images/knockout.png"],
        "frames": {
            "regX": 50, 
            "height": 90, 
            "count": 6, 
            "regY": 45, 
            "width": 100
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

function removeDeadMole(dMole){
  stage.removeChild(dMole);
}

function removeOutBoundMole(mole){
  if(mole.x < 10 || mole.x > canvas.width-5 || mole.y < 10 || mole.y > canvas.height-5){
    holder.removeChild(mole);
  }
}

//when mouse is in each mole's boundary, kill
function tick(event){
  var l = holder.getNumChildren();
  for ( var m = 0; m < l; m++){
    var child = holder.getChildAt(m); //get child by index
    var pt = (child.globalToLocal(stage.mouseX, stage.mouseY))
    if (stage.mouseInBounds && child.hitTest(pt.x, pt.y)) {
      //get last mouse coordinates before killing each mole
      kill[0] = stage.mouseX;
      kill[1] = stage.mouseY;

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
          removeDeadMole();
        }
      }
      //top right of target
      else if (dMole.x > canvas.width*0.5 && dMole.y < canvas.height*0.5){
        createjs.Tween.get(dMole)
        .to({x: dMole.x+400, y: -dMole.y-400}, dSpeed, bounce);
        if (dMole.x >= canvas.width || dMole.y <= -30){
          removeDeadMole();
        }
      }
      //bottom right of target
      else if (dMole.x > canvas.width*0.5 && dMole.y > canvas.height*0.5){
        createjs.Tween.get(dMole)
        .to({x: dMole.x+400, y: dMole.y+400}, dSpeed, bounce);
        if (dMole.x >= canvas.width || dMole.y >= canvas.height){
          removeDeadMole();
        }
      }
      //bottom left of target
      else if (dMole.x < canvas.width*0.5 && dMole.y > canvas.height*0.5){
        createjs.Tween.get(dMole)
        .to({x: -dMole.x-400, y: dMole.y+400}, dSpeed, bounce);
        if (dMole.x <= -30 || dMole.y >= canvas.height){
          removeDeadMole();
        }
      }
      //left x-axis of target
      else if (dMole.x < canvas.width*0.5 && dMole.y == canvas.height*0.5){
        createjs.Tween.get(dMole)
        .to({x: -dMole.x-400}, dSpeed, bounce);
        if (dMole.x <= -30){
          removeDeadMole();
        }
      }
      //top y-axis of target
      else if (dMole.x == canvas.width*0.5 && dMole.y < canvas.height*0.5){
        createjs.Tween.get(dMole)
        .to({y: -dMole.y-400}, dSpeed, bounce);
        if (dMole.y <= -30){
          removeDeadMole();
        }
      }
      //right x-axis of target
      else if (dMole.x > canvas.width*0.5 && dMole.y == canvas.height*0.5){
        createjs.Tween.get(dMole)
        .to({x: dMole.x+400}, dSpeed, bounce);
        if (dMole.x >= canvas.width){
          removeDeadMole();
        }
      }
      //bottom y-axis of target
      else if (dMole.x == canvas.width*0.5 && dMole.y > canvas.height*0.5){
        createjs.Tween.get(dMole)
        .to({y: dMole.y+400}, dSpeed, bounce);
        if (dMole.y >= canvas.height){
          removeDeadMole();
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
  .to({guide: {path: [-30,ry(), rx(),ry(), canvas.width+30,ry()]}}, speed);
}
//from right to left
function pathTwo(){
  makeMole();
  createjs.Tween.get(mole)
  .to({guide: {path: [canvas.width+30,ry(), canvas.width*0.5,canvas.height*0.5, -30,ry()]}}, speed);
}
//from top to bottom
function pathThree(){
  makeMole();
  createjs.Tween.get(mole)
  .to({guide: {path: [rx(),-30, canvas.width*0.5,canvas.height*0.5, rx(),canvas.height+30]}}, speed);
}
//from bottom to top
function pathFour(){
  makeMole();
  createjs.Tween.get(mole)
  .to({guide: {path: [rx(),canvas.height, canvas.width*0.5,canvas.height*0.5, rx(),-30]}}, speed);
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
