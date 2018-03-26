var sprites = {
  Beer: {sx: 512, sy: 99, w: 23, h: 32, frames: 1},
  Glass: {sx: 512, sy: 131, w: 23, h: 32, frames: 1},
  NPC: {sx: 512, sy: 66, w: 33, h: 33, frames: 1},
  DeadZone: {sx: 0, sy: 0, w: 0, h: 33, frames: 1},
  LeftWall: {sx: 0, sy: 0, w: 512, h: 480, frames: 1},
  Player: {sx: 512, sy: 0, w: 56, h: 66, frames: 1},
  TapperGameplay: {sx: 0, sy: 480, w: 512, h: 480, frames: 1}
};

var playerPos = {
  Lane1: {x: 325, y: 90},
  Lane2: {x: 357, y: 185},
  Lane3: {x: 389, y: 281},
  Lane4: {x: 421, y: 377}
};

var clientPos = [
  {x: 0, y: 90},
  {x: 0, y: 185},
  {x: 0, y: 281},
  {x: 0, y: 377}
  ];

var OBJECT_PLAYER = 1,
    OBJECT_BEER = 2,
    OBJECT_GLASS = 4,
    OBJECT_CLIENT = 8;
    OBJECT_DEADZONE = 16;

const BoardType = {
  TITLE: 0,
  VICTORY: 1,
  LOSS: 2,
  SCENARIO: 3,
  ENTITIES: 4,
  LEFTWALL: 5
}

// var level1 = [
//  // Start,   End, Gap,  Type,   Override
//   [ 0,      4000,  500, 'step' ],
//   [ 6000,   13000, 800, 'ltr' ],
//   [ 10000,  16000, 400, 'circle' ],
//   [ 17800,  20000, 500, 'straight', { x: 50 } ],
//   [ 18200,  20000, 500, 'straight', { x: 90 } ],
//   [ 18200,  20000, 500, 'straight', { x: 10 } ],
//   [ 22000,  25000, 400, 'wiggle', { x: 150 }],
//   [ 22000,  25000, 400, 'wiggle', { x: 100 }]
// ];

// Creates all boards
var startGame = function() {
  const ua = navigator.userAgent.toLowerCase();

  const title = new GameBoard();
  title.add(new TitleScreen("Tapper", "Press SPACE to start playing", playGame));
  Game.setBoard(BoardType.TITLE, title);

  const victory = new GameBoard();
  victory.add(new TitleScreen("You win!", "Press SPACE to splay again", playGame));
  Game.setBoard(BoardType.VICTORY, victory);

  const loss = new GameBoard();
  loss.add(new TitleScreen("You lose!", "Press SPACE to try again", playGame));
  Game.setBoard(BoardType.LOSS, loss);

  const scenario = new GameBoard();
  scenario.add(new Scenario());
  Game.setBoard(BoardType.SCENARIO, scenario);

  const board = new GameBoard();
  // Right dead zones
  board.add(new DeadZone(347, 90));
  board.add(new DeadZone(379, 185));
  board.add(new DeadZone(412, 281));
  board.add(new DeadZone(444, 377));
  // Left dead zones
  board.add(new DeadZone(107, 90));
  board.add(new DeadZone(77, 185));
  board.add(new DeadZone(45, 281));
  board.add(new DeadZone(13, 377));
  // Player
  board.add(new Player());
  // Spawner
  const r = 2;
  board.add(new Spawner(clientPos[0], 1, 1 + r*0))
  board.add(new Spawner(clientPos[1], 1, 1 + r*1))
  board.add(new Spawner(clientPos[3], 1, 2 + r*1))
  board.add(new Spawner(clientPos[2], 2, 1 + r*2))
  Game.setBoard(BoardType.ENTITIES, board);

  const wall = new GameBoard();
  wall.add(new LeftWall());
  Game.setBoard(BoardType.LEFTWALL, wall);

  Game.activateBoard(BoardType.TITLE);
};


// Activates game boards
var activateGame = function() {
  Game.deactivateBoard(BoardType.TITLE);
  Game.deactivateBoard(BoardType.VICTORY);
  Game.deactivateBoard(BoardType.LOSS);

  Game.activateBoard(BoardType.SCENARIO);
  Game.activateBoard(BoardType.ENTITIES);
  Game.activateBoard(BoardType.LEFTWALL);
}

var deactivateGame = function() {
  Game.deactivateBoard(BoardType.SCENARIO);
  Game.deactivateBoard(BoardType.ENTITIES);
  Game.deactivateBoard(BoardType.LEFTWALL);
}

// Starts gameplay
var playGame = function() {
  GameManager.reset();
  activateGame();
};

var winGame = function() {
  deactivateGame();
  Game.activateBoard(BoardType.VICTORY);
};

var loseGame = function() {
  deactivateGame();
  Game.activateBoard(BoardType.LOSS);
}

var Scenario = function() {
  this.setup('TapperGameplay', {x:0, y:0});
};
Scenario.prototype = new Sprite();
Scenario.prototype.step = function(dp) { };

var LeftWall = function() {
  this.setup('LeftWall', {x:0, y:0});
}
LeftWall.prototype = new Sprite();
LeftWall.prototype.step = function(dp) {};

var Player = function() {
  this.setup('Player', {x: 325, y: 90, spd: 0.25, beerSpd: 0.5});
  this.cooldown = this.spd;
  this.beerCooldown = this.beerSpd;

  this.step = function(dt) {
    this.cooldown-=dt;
    this.beerCooldown-=dt;
    // Movement
    if(Game.keys['Down'] && this.x === playerPos.Lane1.x && this.cooldown < 0) { this.x = playerPos.Lane2.x; this.y = playerPos.Lane2.y;  this.cooldown = this.spd;}
    else if(Game.keys['Down'] && this.x === playerPos.Lane2.x && this.cooldown < 0) { this.x = playerPos.Lane3.x; this.y = playerPos.Lane3.y;  this.cooldown = this.spd;}
    else if(Game.keys['Down'] && this.x === playerPos.Lane3.x && this.cooldown < 0) { this.x = playerPos.Lane4.x; this.y = playerPos.Lane4.y;  this.cooldown = this.spd;}
    else if(Game.keys['Down'] && this.x === playerPos.Lane4.x && this.cooldown < 0) { this.x = playerPos.Lane1.x; this.y = playerPos.Lane1.y;  this.cooldown = this.spd;}
    else if(Game.keys['Up'] && this.x === playerPos.Lane1.x && this.cooldown < 0) { this.x = playerPos.Lane4.x; this.y = playerPos.Lane4.y;  this.cooldown = this.spd;}
    else if(Game.keys['Up'] && this.x === playerPos.Lane2.x && this.cooldown < 0) { this.x = playerPos.Lane1.x; this.y = playerPos.Lane1.y;  this.cooldown = this.spd;}
    else if(Game.keys['Up'] && this.x === playerPos.Lane3.x && this.cooldown < 0) { this.x = playerPos.Lane2.x; this.y = playerPos.Lane2.y;  this.cooldown = this.spd;}
    else if(Game.keys['Up'] && this.x === playerPos.Lane4.x && this.cooldown < 0) { this.x = playerPos.Lane3.x; this.y = playerPos.Lane3.y;  this.cooldown = this.spd;}
    // Beers
    else if(Game.keys['Space'] && this.x === playerPos.Lane1.x && this.beerCooldown < 0) { this.board.add(new Beer(this.x, this.y, 33)); this.beerCooldown = this.beerSpd;}                                                                                            
    else if(Game.keys['Space'] && this.x === playerPos.Lane2.x && this.beerCooldown < 0) { this.board.add(new Beer(this.x, this.y, 33)); this.beerCooldown = this.beerSpd;}                                                                                          
    else if(Game.keys['Space'] && this.x === playerPos.Lane3.x && this.beerCooldown < 0) { this.board.add(new Beer(this.x, this.y, 33)); this.beerCooldown = this.beerSpd;}                                                                                           
    else if(Game.keys['Space'] && this.x === playerPos.Lane4.x && this.beerCooldown < 0) { this.board.add(new Beer(this.x, this.y, 33)); this.beerCooldown = this.beerSpd;}
                                                                                           
  };
};
Player.prototype = new Sprite();
Player.prototype.type = OBJECT_PLAYER;

var Beer = function(x, y, vx) {
  this.setup('Beer', {});
  this.x = x;
  this.y = y;
  this.vx = vx;

  this.step = function(dt) {
    this.x -= this.vx * dt;
    var collisionClient = this.board.collide(this,OBJECT_CLIENT);
    var collisionDeadZone = this.board.collide(this,OBJECT_DEADZONE);

    if(collisionClient) {
      this.board.remove(this);
      this.board.remove(collisionClient);
      this.board.add(new Glass(this.x, this.y, vx));
      GameManager.notifyGlasses();
    }
    else if(collisionDeadZone) {
      GameManager.notifyDead();
      this.board.remove(this); 
    }
  };
};
Beer.prototype = new Sprite();
Beer.prototype.type = OBJECT_BEER;

var Glass = function(x, y, vx) {
  this.setup('Glass', {});
  this.x = x;
  this.y = y;
  this.vx = vx;

  this.step = function(dt) {
    this.x += this.vx * dt;
    var collisionPlayer = this.board.collide(this,OBJECT_PLAYER);
    var collisionDeadZone = this.board.collide(this,OBJECT_DEADZONE); 

    if (collisionPlayer) {
      this.board.remove(this);
      GameManager.notifyServed();
    }
    else if(collisionDeadZone) {
      GameManager.notifyDead();
      this.board.remove(this); 
    }
  };
};
Glass.prototype = new Sprite();
Glass.prototype.type = OBJECT_GLASS;

var Client = function(x, y, vx) {
  this.setup('NPC', {});
  this.x = x;
  this.y = y;
  this.vx = vx;

  this.step = function(dt) {
    this.x += this.vx * dt;

    var collisionDeadZone = this.board.collide(this,OBJECT_DEADZONE);
    var collisionPlayer = this.board.collide(this,OBJECT_PLAYER);

    if (collisionDeadZone && this.x > 256) {
      GameManager.notifyDead();
      this.board.remove(this);
    }
    else if (collisionPlayer) {
      GameManager.notifyDead();
      this.board.remove(this);
    }
  };
};
Client.prototype = new Sprite();
Client.prototype.type = OBJECT_CLIENT;

var DeadZone = function(x, y) {
  this.setup('DeadZone', {});
  this.x = x;
  this.y = y;

  this.step = function(dt) { };
};
DeadZone.prototype = new Sprite();
DeadZone.prototype.type = OBJECT_DEADZONE;

var Spawner = function(coord, nClients, freq) {
  this.initClients = nClients;
  this.nClients = this.initClients;
  this.freq = freq;
  this.time = this.freq;
  this.client = new Client(coord.x, coord.y, 23);

  this.reset = function() {
    this.time = this.freq;
    this.nClients = this.initClients;
    GameManager.notifyClients(this.nClients);
  };
  this.reset();

  this.step = function(dt) {
    this.time -= dt;

    if (this.nClients > 0 && this.time < 0) {
      this.time = this.freq;

      this.board.add(Object.create(this.client));
      this.nClients--;
    }
  };
  this.draw = function() { };
};

var GameManager = new function() {
  this.npcs = 0;
  this.glasses = 0;
  this.dead = 0;

  this.reset = function() {
    this.npcs = 0;
    this.glasses = 0;
    this.dead = 0;
  };

  this.notifyClients = function(n) {
    this.npcs += n;
  };

  this.notifyGlasses = function() {
    this.glasses++;
    this.check();
  };

  this.notifyServed = function() {
    this.glasses--;
    this.npcs--;
    this.check();
  };

  this.notifyDead = function() {
    this.dead++;
    this.check();
  };

  this.check = function() {
    if (this.dead) {
      loseGame();
    }
    else if (!this.npcs && !this.glasses) {
      winGame();
    }
  };
};

window.addEventListener("load", function() {
  Game.initialize("game",sprites,startGame);
});