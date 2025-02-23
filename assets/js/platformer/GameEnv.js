/**
 * GameEnv.js key purpose is to manage shared game environment data and methods.
 * 
 * @class
 * @classdesc GameEnv is defined as a static class, this ensures that there is only one instance of the class.
 * Static classes do not have a constructor, cannot be instantiated, do not have instance variables, only singleton/static variables,
 * do not have instance methods, only singleton/static methods, is similar in namespace to an object literal, but is a class.
 * The benefit is it is similar to other coding languages (e.g. Java, C#), thus is more readable to other developers.
 * 
 * Purpose of GameEnv:
 * - stores game objects (e.g. gameObjects, player, levels, etc.)
 * - stores game attributes (e.g. gravity, speed, width, height, top, bottom, etc.)
 * - defines methods to update, draw, and destroy game objects
 * - defines methods to initialize and resize game objects
 * 
 * Usage Notes:
 * GameEnv is used by other classes to manage the game environment.  
 * It is dangerous to use GameEnv directly, it is not protected from misuse. Comments below show locations of usage.
 * Here are some methods supported by GameEnv:
 * - call GameEnv.initialize() to initialize window dimensions
 * - call GameEnv.resize() to resize game objects
 * - call GameEnv.update() to update, serialize, and draw game objects
 * - call GameEnv.destroy() to destroy game objects
 */
export class GameEnv {

    /**
     * @static
     * @property {string} userID - localstorage key, used by GameControl
     * @property {Object} player - used by GameControl
     * @property {Array} levels - used by GameControl
     * @property {Object} currentLevel - used by GameControl
     * @property {Array} gameObjects - used by GameControl
     * @property {boolean} isInverted - localstorage key, canvas filter property, used by GameControl
     * @property {boolean} invincible - invincibility for the mario when stomping on Goomba
     * @property {boolean} goombaInvincible - invincibility for the goomba when mario touch
     * @property {boolean} goombaBounce - mario touch goomba --> bounce
     * @property {boolean} goombaBounce1 - bounce on mushroom
     * @property {number} gameSpeed - localstorage key, used by platformer objects
     * @property {number} backgroundDirection- used by background objects
     * @property {boolean} transitionHide - used to hide the transition screen
     * @property {number} gravity - localstorage key, used by platformer objects
     * @property {boolean} destroyedMushroom - to see when mushroom is destroyed
     * @property {boolean} destroyedMagicBeam - to see when magic beam is destroyed
     * @property {boolean} destroyedChocoFrog - to see when chocofrog is destroyed
     * @property {boolean} playMessage
     * @property {Object} difficulty - localstorage key, used by GameControl
     * @property {number} innerWidth - used by platformer objects
     * @property {number} prevInnerWidth - used by platformer objects
     * @property {number} innerHeight - used by platformer objects
     * @property {number} top - used by platformer objects
     * @property {number} bottom - used by platformer objects
     * @property {number} prevBottom - used by platformer objects
     * @property {number} time - Initialize time variable, used by timer objects
     * @property {number} timerInterval - Variable to hold the interval reference, used by timer objects
     * @property {boolean} keyCollected - Checks whether the key has been collected my Mario or not
     * @property {boolean} powerUpCollected - Checks whether the powerup has been collected by the escaper sprite
     * @property {boolean} wandCollected - Checks whether the wand has been collected by the player
     * @property {boolean} spellUsed - Checks whether the wand has been used by the player

     */
    static userID = "guest";
    static player = null;
    static levels = [];
    static currentLevel = null;
    static gameObjects = [];
    static isInverted = false;
    static gameSpeed = 2;
    static backgroundDirection = 0;
    static transitionHide = false;
    static gravity = 3;
    static destroyedMushroom = false;
    static destroyedMagicBeam = false;
    static destroyedChocoFrog = false;
    static playMessage = false;
    static difficulty = "normal";
    static innerWidth;
    static prevInnerWidth;
    static innerHeight;
    static top;
    static bottom;
    static prevBottom;
    static invincible = false;
    static visible = false;
    static goombaInvincible = false;
    static goombaBounce = false;
    static goombaBounce1 = false;
    static keyCollected = false;
    static powerUpCollected = false;

    static timerActive = false;
    static timerInterval = 10;
    static coinScore = 0;
    static time = 0;
    static darkMode = true
    static playerAttack = false;

    static playerChange = false;

    static claimedCoinIds = [];

    static trashCount = [];

    static wandCollected = false;

    static spellUsed = false

    
    // Make the constructor throws an error, or effectively make it a private constructor.
    constructor() {
        throw new Error('GameEnv is a static class and cannot be instantiated.');
    }
  
     /**
     * Setter for Top position, called by initialize in GameEnv
     * @static
     */
    static setTop() {
        // set top of game as header height
        const header = document.querySelector('header');
        if (header) {
            this.top = header.offsetHeight;
        }
    }
  
    /**
     * Setter for Bottom position, called by resize in GameEnv
     * @static
     */
    static setBottom() {
        // sets the bottom or gravity 0
        this.bottom =
        this.top + this.backgroundHeight;
    }
  
    /**
     * Setup for Game Environment, called by transitionToLevel in GameControl
     * @static
     */
    static initialize() {
        // store previous for ratio calculations on resize
        this.prevInnerWidth = this.innerWidth;
        this.prevBottom = this.bottom;
    
        // game uses available width and height
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;
        this.setTop();
        //this.setBottom(); // must be called in platformer objects
    }
  
    /**
     * Resize game objects, called by resize in GameControl
     * @static
     */    
    static resize() {
        GameEnv.initialize();  // Update GameEnv dimensions
  
        // Call the sizing method on all game objects
        for (var gameObject of GameEnv.gameObjects){
            gameObject.size();
        }
    }
  
    /**
     * Update, serialize, and draw game objects, called by update in GameControl
     * @static
     */
    static update() {
        // Update game state, including all game objects
        // if statement prevents game from updating upon player death
        if (GameEnv.player === null || GameEnv.player.state.isDying === false) {
            for (const gameObject of GameEnv.gameObjects) {
                gameObject.update();
                gameObject.serialize();
                gameObject.draw();
            } 
        }
    }
  
    /**
     * Destroy game objects, called by destroy in GameControl
     * @static
     */
    static destroy() {
        // Destroy objects in reverse order
        for (var i = GameEnv.gameObjects.length - 1; i >= 0; i--) {
            const gameObject = GameEnv.gameObjects[i];
            gameObject.destroy();
        }
        GameEnv.gameObjects = [];
    }
  
    /**
     * Set "canvas filter property" between inverted and normal, called by setInvert in GameControl
     * @static
     */
    static setInvert() {
        for (var gameObject of GameEnv.gameObjects){
            if (gameObject.invert && !this.isInverted) {  // toggle off
                gameObject.canvas.style.filter = "none";  // remove filter
            } else if (gameObject.invert && this.isInverted) { // toggle on
                gameObject.canvas.style.filter = "invert(100%)";  // remove filter
            } else {
                gameObject.canvas.style.filter = "none";  // remove filter
            }
        }
    }
  
    static PlayerPosition() {
      let playerX = 0;
      let playerY = 0;
    }

    // Play a sound by its ID
    static playSound(id) {
        const sound = document.getElementById(id);
        sound.play();
    }

    // Play a sound by its ID in a loop
    static loopSound(id) {
        const sound = document.getElementById(id);
        sound.loop = true;
        sound.play();
    }

    // Stop all sounds
    static stopAllSounds() {
        const sounds = document.getElementsByTagName('audio');
        for (let sound of sounds) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    static updateParallaxDirection(key) {
        switch (key) {
            case "a":
                if (GameEnv.player?.x > 2) {
                    GameEnv.backgroundDirection = -1;
                }
                break;
            case "d":
                if (GameEnv.player?.x < (GameEnv.innerWidth - 2)) {
                    GameEnv.backgroundDirection = 1;
                }
                break;
            case "s":
                if (keys.includes("a") && keys.includes("s")) {
                // If both "a" and "s" are clicked
                    if (GameEnv.player?.x > 2) {
                    GameEnv.backgroundDirection = -5;
                    }
                } else if  (keys.includes("d") && keys.includes("s")) {
                // If both " d" and "s" are clicked
                    if (GameEnv.player?.x < (GameEnv.innerWidth - 2)) {
                        GameEnv.backgroundDirection = 5;
                    }
                } else {
                    GameEnv.backgroundDirection = 0;
                }
                break;
            default:
                GameEnv.backgroundDirection = 0;
                break;
        }
    }

    static customTimeout(callback, delay) {
        const start = Date.now();
        
        function loop() {
          if (Date.now() - start >= delay) {
            callback();
          } else {
            requestAnimationFrame(loop);
          }
        }
      
        requestAnimationFrame(loop);
      }
      
  }
  
  export default GameEnv;