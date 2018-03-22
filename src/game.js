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

// var enemies = {
//   straight: { x: 0,   y: -50, sprite: 'enemy_ship', health: 10, 
//               E: 100 },
//   ltr:      { x: 0,   y: -100, sprite: 'enemy_purple', health: 10, 
//               B: 75, C: 1, E: 100, missiles: 2  },
//   circle:   { x: 250,   y: -50, sprite: 'enemy_circle', health: 10, 
//               A: 0,  B: -100, C: 1, E: 20, F: 100, G: 1, H: Math.PI/2 },
//   wiggle:   { x: 100, y: -50, sprite: 'enemy_bee', health: 20, 
//               B: 50, C: 4, E: 100, firePercentage: 0.001, missiles: 2 },
//   step:     { x: 0,   y: -50, sprite: 'enemy_circle', health: 10,
//               B: 150, C: 1.2, E: 75 }
// };

// var OBJECT_PLAYER = 1,
//     OBJECT_PLAYER_PROJECTILE = 2,
//     OBJECT_ENEMY = 4,
//     OBJECT_ENEMY_PROJECTILE = 8,
//     OBJECT_POWERUP = 16;

// var startGame = function() {
//   var ua = navigator.userAgent.toLowerCase();

//   // Only 1 row of stars
//   if(ua.match(/android/)) {
//     Game.setBoard(0,new Starfield(50,0.6,100,true));
//   } else {
//     Game.setBoard(0,new Starfield(20,0.4,100,true));
//     Game.setBoard(1,new Starfield(50,0.6,100));
//     Game.setBoard(2,new Starfield(100,1.0,50));
//   }  
//   Game.setBoard(3,new TitleScreen("Alien Invasion", 
//                                   "Press fire to start playing",
//                                   playGame));
// };

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



var playGame = function() {
  var board = new GameBoard();
  var leftWall = new GameBoard();
  board.add(new Scenario());
  Game.setBoard(0, board);
  Game.setBoard(1, leftWall);
  leftWall.add(new LeftWall());
  board.add(new Player());
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

  const r = 2;
  board.add(new Spawner(clientPos[0], 1, 1 + r*0))
  board.add(new Spawner(clientPos[1], 1, 1 + r*1))
  board.add(new Spawner(clientPos[3], 1, 2 + r*1))
  board.add(new Spawner(clientPos[2], 2, 1 + r*2))


  // board.add(new PlayerShip());
  // board.add(new Level(level1,winGame));
  // Game.setBoard(3,board);
  // Game.setBoard(5,new GamePoints(0));
};

// var winGame = function() {
//   Game.setBoard(3,new TitleScreen("You win!", 
//                                   "Press fire to play again",
//                                   playGame));
// };

// var loseGame = function() {
//   Game.setBoard(3,new TitleScreen("You lose!", 
//                                   "Press fire to play again",
//                                   playGame));
// };

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
      console.log("You are a loser.");
    }
    else if (!this.npcs && !this.glasses) {
      console.log("MARRY ME!");
    }
  };
};

// var Starfield = function(speed,opacity,numStars,clear) {

//   // Set up the offscreen canvas
//   var stars = document.createElement("canvas");
//   stars.width = Game.width; 
//   stars.height = Game.height;
//   var starCtx = stars.getContext("2d");

//   var offset = 0;

//   // If the clear option is set, 
//   // make the background black instead of transparent
//   if(clear) {
//     starCtx.fillStyle = "#000";
//     starCtx.fillRect(0,0,stars.width,stars.height);
//   }

//   // Now draw a bunch of random 2 pixel
//   // rectangles onto the offscreen canvas
//   starCtx.fillStyle = "#FFF";
//   starCtx.globalAlpha = opacity;
//   for(var i=0;i<numStars;i++) {
//     starCtx.fillRect(Math.floor(Math.random()*stars.width),
//                      Math.floor(Math.random()*stars.height),
//                      2,
//                      2);
//   }

//   // This method is called every frame
//   // to draw the starfield onto the canvas
//   this.draw = function(ctx) {
//     var intOffset = Math.floor(offset);
//     var remaining = stars.height - intOffset;

//     // Draw the top half of the starfield
//     if(intOffset > 0) {
//       ctx.drawImage(stars,
//                 0, remaining,
//                 stars.width, intOffset,
//                 0, 0,
//                 stars.width, intOffset);
//     }

//     // Draw the bottom half of the starfield
//     if(remaining > 0) {
//       ctx.drawImage(stars,
//               0, 0,
//               stars.width, remaining,
//               0, intOffset,
//               stars.width, remaining);
//     }
//   };

//   // This method is called to update
//   // the starfield
//   this.step = function(dt) {
//     offset += dt * speed;
//     offset = offset % stars.height;
//   };
// };

// var PlayerShip = function() { 
//   this.setup('ship', { vx: 0, reloadTime: 0.25, maxVel: 200 });

//   this.reload = this.reloadTime;
//   this.x = Game.width/2 - this.w / 2;
//   this.y = Game.height - Game.playerOffset - this.h;

//   this.step = function(dt) {
//     if(Game.keys['left']) { this.vx = -this.maxVel; }
//     else if(Game.keys['right']) { this.vx = this.maxVel; }
//     else { this.vx = 0; }

//     this.x += this.vx * dt;

//     if(this.x < 0) { this.x = 0; }
//     else if(this.x > Game.width - this.w) { 
//       this.x = Game.width - this.w;
//     }

//     this.reload-=dt;
//     if(Game.keys['fire'] && this.reload < 0) {
//       Game.keys['fire'] = false;
//       this.reload = this.reloadTime;

//       this.board.add(new PlayerMissile(this.x,this.y+this.h/2));
//       this.board.add(new PlayerMissile(this.x+this.w,this.y+this.h/2));
//     }
//   };
// };

// PlayerShip.prototype = new Sprite();
// PlayerShip.prototype.type = OBJECT_PLAYER;

// PlayerShip.prototype.hit = function(damage) {
//   if(this.board.remove(this)) {
//     loseGame();
//   }
// };


// var PlayerMissile = function(x,y) {
//   this.setup('missile',{ vy: -700, damage: 10 });
//   this.x = x - this.w/2;
//   this.y = y - this.h; 
// };

// PlayerMissile.prototype = new Sprite();
// PlayerMissile.prototype.type = OBJECT_PLAYER_PROJECTILE;

// PlayerMissile.prototype.step = function(dt)  {
//   this.y += this.vy * dt;
//   var collision = this.board.collide(this,OBJECT_ENEMY);
//   if(collision) {
//     collision.hit(this.damage);
//     this.board.remove(this);
//   } else if(this.y < -this.h) { 
//       this.board.remove(this); 
//   }
// };


// var Enemy = function(blueprint,override) {
//   this.merge(this.baseParameters);
//   this.setup(blueprint.sprite,blueprint);
//   this.merge(override);
// };

// Enemy.prototype = new Sprite();
// Enemy.prototype.type = OBJECT_ENEMY;

// Enemy.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0, 
//                                    E: 0, F: 0, G: 0, H: 0,
//                                    t: 0, reloadTime: 0.75, 
//                                    reload: 0 };

// Enemy.prototype.step = function(dt) {
//   this.t += dt;

//   this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
//   this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);

//   this.x += this.vx * dt;
//   this.y += this.vy * dt;

//   var collision = this.board.collide(this,OBJECT_PLAYER);
//   if(collision) {
//     collision.hit(this.damage);
//     this.board.remove(this);
//   }

//   if(Math.random() < 0.01 && this.reload <= 0) {
//     this.reload = this.reloadTime;
//     if(this.missiles == 2) {
//       this.board.add(new EnemyMissile(this.x+this.w-2,this.y+this.h));
//       this.board.add(new EnemyMissile(this.x+2,this.y+this.h));
//     } else {
//       this.board.add(new EnemyMissile(this.x+this.w/2,this.y+this.h));
//     }

//   }
//   this.reload-=dt;

//   if(this.y > Game.height ||
//      this.x < -this.w ||
//      this.x > Game.width) {
//        this.board.remove(this);
//   }
// };

// Enemy.prototype.hit = function(damage) {
//   this.health -= damage;
//   if(this.health <=0) {
//     if(this.board.remove(this)) {
//       Game.points += this.points || 100;
//       this.board.add(new Explosion(this.x + this.w/2, 
//                                    this.y + this.h/2));
//     }
//   }
// };

// var EnemyMissile = function(x,y) {
//   this.setup('enemy_missile',{ vy: 200, damage: 10 });
//   this.x = x - this.w/2;
//   this.y = y;
// };

// EnemyMissile.prototype = new Sprite();
// EnemyMissile.prototype.type = OBJECT_ENEMY_PROJECTILE;

// EnemyMissile.prototype.step = function(dt)  {
//   this.y += this.vy * dt;
//   var collision = this.board.collide(this,OBJECT_PLAYER)
//   if(collision) {
//     collision.hit(this.damage);
//     this.board.remove(this);
//   } else if(this.y > Game.height) {
//       this.board.remove(this); 
//   }
// };



// var Explosion = function(centerX,centerY) {
//   this.setup('explosion', { frame: 0 });
//   this.x = centerX - this.w/2;
//   this.y = centerY - this.h/2;
// };

// Explosion.prototype = new Sprite();

// Explosion.prototype.step = function(dt) {
//   this.frame++;
//   if(this.frame >= 12) {
//     this.board.remove(this);
//   }
// };

window.addEventListener("load", function() {
  Game.initialize("game",sprites,playGame);
});