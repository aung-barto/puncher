
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
          "spin": [0, 2, "spin", 0.2],
        }
    });
    mole = new createjs.Sprite(moleSprite, "spin");
    stage.addChild(mole);
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
    
module.exports = makeMole;
module.exports = deadMole;
