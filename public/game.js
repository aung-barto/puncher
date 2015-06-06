//replace mouse cursor with boxing glove
      $(document).ready(function(){
        $('#gameCanvas').mouseout(function(){
          $('#mycursor').hide();
          return false;
        });
        $('#gameCanvas').mouseenter(function(){
          $('#mycursor').show();
          return false;
        });
        $('#gameCanvas').mousemove(function(e){
          $('#mycursor').css('left', e.clientX - 20).css('top', e.clientY + 7);
        });
      });
      //setting up stage for game
      var stage, canvas, mole, dMole, holder, spriteSheet, normMole, knockOutMole; 
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
        //define spritesheet >>> "mole"
        normMole = new createjs.SpriteSheet({
          framerate: 30,
          "images": ["./images/norm.png"],
          "frames": {
            "regX": 30, 
            "height": 90, 
            "count": 3,
            "regY": 30,
            "width": 100
          },
          //loops, 1.5x speed
          "animations": {
            "spin": {
              "frames": 3,
              "speed": 1
            }
          }
        });
        //define spritesheet >>> "dMole"
        knockOutMole = new createjs.SpriteSheet({
          framerate:30,
          "images": ["./images/knockout.png"],
          "frames": {
            "regX": 30,
            "height": 90,
            "count": 3,
            "regY": 30,
            "width": 100
          },
          "animations": {
            "spin": {
              "frames": 3,
              "speed": 1
            }
          }
        })

        stage.autoClear = true;

        window.addEventListener('resize', updateCanvasSize);
        updateCanvasSize();

        target();
        //calling balls to shoot
        setInterval(shootMoles, 2000);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", stage);
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
      //target ring - static
      function target(){
        ring = new createjs.Shape();
        ring.graphics.ss(7, 'round', 'round').s(('#ff0000')).dc(0,0,canvas.height*0.225);
        ring.x = canvas.width * 0.5;
        ring.y = canvas.height * 0.5;
        stage.addChild(ring);
      }
      function makeMole(){
        // mole = new createjs.Shape();
        // mole.graphics.ss(1, 'round', 'round').f("#" + rc() +rc() +rc()).dc(0,0,30).ef().es();
        mole = createjs.Tween.get(normMole, "float");
        mole.setBounds(mole.x, mole.y, 60, 60);
        // punchMole(mole);
        holder.addChild(mole);
        createjs.Ticker.on("tick", tick);
      }

      //generate dead moles to replace rolled overed moles
      function deadMole(){
        // dMole = new createjs.Shape();
        // dMole.graphics.beginFill("#000000").drawCircle(0,0,30);
        dMole = createjs.Tween.get(knockOutMole, "float");
        //killed position
        dMole.x = kill[0];
        dMole.y = kill[1];
        stage.addChild(dMole);
      }

      function removeDeadMole(dMole){
        stage.removeChild(dMole);
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

            holder.removeChildAt(m);
            //replace with dead mole
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
              //when mole goes off screen
              if (dMole.x >= canvas.width || dMole.y <= -30){
                removeDeadMole();
              }
            }
            //bottom right of target
            else if (dMole.x > canvas.width*0.5 && dMole.y > canvas.height*0.5){
              createjs.Tween.get(dMole)
              .to({x: dMole.x+400, y: dMole.y+400}, dSpeed, bounce);
              //when mole goes off screen
              if (dMole.x >= canvas.width || dMole.y >= canvas.height){
                removeDeadMole();
              }
            }
            //bottom left of target
            else if (dMole.x < canvas.width*0.5 && dMole.y > canvas.height*0.5){
              createjs.Tween.get(dMole)
              .to({x: -dMole.x-400, y: dMole.y+400}, dSpeed, bounce);
              //when mole goes of screen
              if (dMole.x <= -30 || dMole.y >= canvas.height){
                removeDeadMole();
              }
            }
            //left x-axis of target
            else if (dMole.x < canvas.width*0.5 && dMole.y == canvas.height*0.5){
              createjs.Tween.get(dMole)
              .to({x: -dMole.x-400}, dSpeed, bounce);
              //when mole goes off screen
              if (dMole.x <= -30){
                removeDeadMole();
              }
            }
            //top y-axis of target
            else if (dMole.x == canvas.width*0.5 && dMole.y < canvas.height*0.5){
              createjs.Tween.get(dMole)
              .to({y: -dMole.y-400}, dSpeed, bounce);
              //when mole goes off screen
              if (dMole.y <= -30){
                removeDeadMole();
              }
            }
            //right x-axis of target
            else if (dMole.x > canvas.width*0.5 && dMole.y == canvas.height*0.5){
              createjs.Tween.get(dMole)
              .to({x: dMole.x+400}, dSpeed, bounce);
              //when mole goes off screen
              if (dMole.x >= canvas.width){
                removeDeadMole();
              }
            }
            //bottom y-axis of target
            else if (dMole.x == canvas.width*0.5 && dMole.y > canvas.height*0.5){
              createjs.Tween.get(dMole)
              .to({y: dMole.y+400}, dSpeed, bounce);
              //when mole goes off screen
              if (dMole.y >= canvas.height){
                removeDeadMole();
              }
            }
          }
        }
        stage.update(event);
      }

// generating paths for new moles
      function pathOne(){
        makeMole();
        createjs.Tween.get(mole)
        //from left to right
        .to({guide: {path: [-30,ry(), rx(),ry(), canvas.width+30,ry()]}}, speed);
      }
      function pathTwo(){
        makeMole();
        createjs.Tween.get(mole)
        //from right to left
        .to({guide: {path: [canvas.width+30,ry(), canvas.width*0.5,canvas.height*0.5, -30,ry()]}}, speed);
      }
      function pathThree(){
        makeMole();
        createjs.Tween.get(mole)
        //from top to bottom
        .to({guide: {path: [rx(),-30, canvas.width*0.5,canvas.height*0.5, rx(),canvas.height+30]}}, speed);
      }
      function pathFour(){
        makeMole();
        createjs.Tween.get(mole)
        //from bottom to top
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
