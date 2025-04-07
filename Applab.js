// Instructions
// Takes input through the the keyboard arrow keys, or the on screen arrow key buttons to move the player
// Output will be the player moving and the levels updating


//All the tiles in the grid
var gameGrid = [];

//The width and height of the grid in tiles
var gridSize = 10;

//The value for how much to offset each tile based on its position
//Also doubles as the width and height of each tile
var gridOffset = 320 / gridSize;

//Used to prevent new sprites being created when there are already some from previous grids
var createdGridSize = 0;

//Returns an object for a tile of the specified type
//type {string} - The type of the tile
//return {object} - An object containing data for the tile
function createTileOfType(type) {
  //The base object for every tile
  var tileObject = {
    type:type,
    changed:true
  };
  
  //Tiles with extra data are handled here
  //anything starting with "floating_platform"
  if(type.substring(0,17) == "floating_platform") {
    //rt, up, lt, dn, the 4 directions, represented by 0, 1, 2 ,3
    var dir = type.substring(18,20);
    switch(dir) {
      case "rt":
        tileObject.direction = 0;
        break;
      case "up":
        tileObject.direction = 1;
        break;
      case "lt":
        tileObject.direction = 2;
        break;
      case "dn":
        tileObject.direction = 3;
        break;
    }
    
    //The frame of the platforms animation. AKA the 23rd character of the name
    var animationFrame = type[21];
    //There was no provided animation frame
    if(animationFrame == undefined) {
      tileObject.type = "floating_platform";
    } else {
      tileObject.type = "floating_platform_" + animationFrame;
    }
  }
  
  if(tileObject.type == "floating_platform") { 

  }
  
  return tileObject;
}

//Initializes the grid and sets up elements for each part of it.
function InitializeGrid() {
  //Update the gridOffset to ensure its accurate
  gridOffset = 320 / gridSize;
  
  //Delete any previous tiles
  for(var x = 0; x < createdGridSize; x++) {
    for(var y = 0; y < createdGridSize; y++) {
      //Find the element id
      var elementId = "tile_" + x + "_" + y;
      //Remove it
      deleteElement(elementId);
    }
  }
  
  //Update createdGridSize since its no longer needed.
  createdGridSize = gridSize;
  
  //Loop over the whole grid and set it to ice
  for(var y = 0; y < gridSize; y++) {
    for(var x = 0; x < gridSize; x++) {
      //Calculates the list index for the x and y position
      var index = y*gridSize + x;
      
      //Calculates the id for the image element that will display the tile
      //It is formatted as tile_x_y
      var elementId = "tile_" + x + "_" + y;
      
      //The type of the tile. Also represents the name of 
      //the image without the file extension
      var tileType = "ice";
        
      //Create the new image using the type, adding .PNG to form the full path
      image(elementId, tileType+".PNG");
      
      //Position and resize the sprite using the gridOffset value
      setPosition(elementId, x*gridOffset, y*gridOffset, gridOffset, gridOffset);
      
      //An object representing a tile
      //It contains the type and values of the tile
      var tileObject = createTileOfType(tileType);
      gameGrid[index] = tileObject;
    }
  }
}

//Sets the the type of the tile at the specified x and y to the specified type
//x {number} - The x position
//y {number} - The y position
//type {string} - The tile type
//return {boolean} - If the function succeeded
function setTile(x,y,type) {
  //Fails if the x or y are out of bounds
  if(x >= gridSize || x < 0) {
    return false;
  }
  if(y >= gridSize || y < 0) {
    return false;
  }
  
  //Calculates the list index for the x and y position
  var index = y*gridSize + x;
  
  //Calculates the element id
  var elementId = "tile_" + x + "_" + y;
  
  //Creates a tile using the tile id
  var tileObject = createTileOfType(type);
  
  //Set the tile at the index to the tile object
  gameGrid[index] = tileObject;
  
  //Update the url for the image. The tileObject's type is used since it might not match the inputted type
  setImageURL(elementId,tileObject.type+".PNG");
}

//Gets the the type of the tile at the specified x and y to the specified type
//x {number} - The x position
//y {number} - The y position
//return {object?} - The tile object. Will return null if out of bounds.
function getTile(x,y) {
  //Fails if the x or y are out of bounds
  if(x >= gridSize || x < 0) {
    return null;
  }
  if(y >= gridSize || y < 0) {
    return null;
  }
  
  //Calculates the list index for the x and y position
  var index = y*gridSize + x;
  
  //Return the tile at the index
  return gameGrid[index];
}

//Returns true if the tile at the x and y is collidable
//x {number} - The x position
//y {number} - The y position
//return {boolean} - Is the tile collidable
function isCollidable(x,y) {
  var currentTile = getTile(x,y);
  
  switch(currentTile.type) {
    case "ice_wall":
      return true;
    case "ice_ramp_rt":
      //If the velocity matches up then no collision
      if(playerVX == 1) { return false; } else { return true; }
    case "ice_ramp_lt":
      //If the velocity matches up then no collision
      if(playerVX == -1) { return false; } else { return true; }
    case "ice_ramp_up":
      //If the velocity matches up then no collision
      if(playerVY == -1) { return false; } else { return true; }
    case "ice_ramp_dn":
      //If the velocity matches up then no collision
      if(playerVY == 1) { return false; } else { return true; }
    default:
      return false;
  }
}

//Updates the tiles on the grid
function updateGrid() {
  //Set the edited status of every tile to false since it hasn't been changed at the beginning of the update
  for(var x = 0; x < gridSize; x++) {
    for(var y = 0; y < gridSize; y++) {
      gameGrid[y*gridSize + x].changed = false;
    }
  }
  
  for(var x = 0; x < gridSize; x++) {
    for(var y = 0; y < gridSize; y++) {
      var tile = getTile(x,y);
      //Skip over tiles that have already been changed to prevent subframe updates
      if(tile.changed) { continue; }
      
      //Choose which behaviour to run using the tile type.
      switch (tile.type) {
        //Water variants - Simple animation
        case "water":
          setTile(x,y,"water_1");
          break;
        case "water_1":
          setTile(x,y,"water_2");
          break;
        case "water_2":
          setTile(x,y,"water_3");
          break;
        case "water_3":
          setTile(x,y,"water");
          break;
          
        //Floating platform variants - Call the updateFloatingPlatform function
        case "floating_platform":
          updateFloatingPlatform(x,y);
          break;
        case "floating_platform_1":
          updateFloatingPlatform(x,y);
          break;
        case "floating_platform_2":
          updateFloatingPlatform(x,y);
          break;
        case "floating_platform_3":
          updateFloatingPlatform(x,y);
          break;
        default:
          break;
      }
    }
  }
}

//Handles updates for floating platforms located at the x and y position
//Updates the animation and position of the platform
//x {number} - The x position of the platform
//y {number} - The y position of the platform
function updateFloatingPlatform(x,y) {
  var directions = ["rt", "up", "lt", "dn"];
  
  var tile = getTile(x,y);
  var direction = tile.direction;
  //Retrieve the text of the frame
  var frameNumber = tile.type[18];
  var currentFrame;
  //If frameNumber is undefined its the same as frame 0
  if(frameNumber == undefined) {
    currentFrame = 0;
  } else {
    currentFrame = parseInt(tile.type[18]);
  }

  var velocityX = 0;
  var velocityY = 0;
  
  //Set the velocity based on the direction
  if(direction == 0) { velocityX = 1; }
  else if(direction == 1) { velocityY = -1 }
  else if(direction == 2) { velocityX = -1 }
  else { velocityY = 1 }
  
  //Cycle through the next frame
  currentFrame++;
  currentFrame = currentFrame % 4;
  
  var tileName = "";
  var waterName = "";
  

  
  //Check the tile its trying to move to
  var targetTile = getTile(x+velocityX,y+velocityY);
  if(targetTile == null || getTile(x+velocityX,y+velocityY).type.substring(0,5) != "water") {
    //Reverses the direction
    direction = (direction+2)%4;
    
    //Frame 0 has no suffix
    if(currentFrame == 0) {
      tileName = "floating_platform_"+directions[direction];
    } else {
      //Other frames do
      tileName = "floating_platform_"+directions[direction]+"_"+currentFrame;
    }
    
    setTile(x,y,tileName);
    return;
  }

  //Frame 0 has no suffix
  if(currentFrame == 0) {
    tileName = "floating_platform_"+directions[direction];
    waterName = "water";
  } else {
    //Other frames do
    tileName = "floating_platform_"+directions[direction]+"_"+currentFrame;
    waterName = "water_" + currentFrame;
  }

  setTile(x+velocityX,y+velocityY,tileName);
  setTile(x,y,waterName);
}

//  Level Related Code  

//Loads a level into the grid from an array of string types
//level {list} - The list of strings for each type
function loadLevel(level) {
  //The level should be gridSize*gridSize in length, so the sqrt should be the size of the level
  var size = Math.sqrt(level.length);
  
  //If size is not an integer something is wrong with the level array. Cancel the loading.
  if(Math.round(size) != size) {
    return;
  }
  
  //Set up the gridSize
  gridSize = size;
  
  InitializeGrid();
  InitializePlayer();
  
  for(var x = 0; x < gridSize; x++) {
    for(var y = 0; y < gridSize; y++) {
      //Calculate the index of the current tile in the level array
      var index = y*gridSize + x;
  
      //Ice is present by default and can be represented by an empty string to shorten the array
      //Empty strings get skipped
      if(level[index] != "") {
        //Set the tile in the grid to the one in the level array.
        setTile(x,y,level[index]);
      }
    }
  }
}

//All the levels, stored as very long arrays of tile names
//Each row is on a different line, and '' represents ice
var level1 = 
['','','','',
'ice_wall','water','floating_platform_lt','',
'ice_wall','water','water','',
'home','','','',];
var level2 = 
['','','','',
'','ice_wall','','','home',
'','','','','',
'','','','','',
'ice_wall','ice_wall','ice_wall','','',
''];
var level3 = 
['','','','','','ice_wall','',
'ice_wall','ice_wall','','ice_wall','water','floating_platform_rt','water','water',
'ice_wall','','','','home','','','',
'ice_wall','','','','ice_wall','','','',
'','ice_wall','ice_wall','','','','','ice_wall',
'','','','','','','','',
'','','','','','','','',
'','','','','ice_wall','','','',
'ice_wall'];
var level4 = 
['','','','ice_ramp_rt','','ice_wall','',
'','ice_wall','ice_wall','','','','','',
'','','','','home','','','',
'ice_ramp_up','','','','ice_wall','','','',
'','ice_wall','','','','','','ice_wall',
'','','','ice_ramp_lt','','','','',
'','ice_ramp_dn','','','','','','',
'','','','','ice_wall','','','',
'ice_wall'];
var level5 = 
['','ice_ramp_rt','','','','ice_wall','','','',
'','','','','','','','ice_ramp_up','ice_ramp_up','ice_ramp_up',
'','water','water','water','water','water','water','water','water','floating_platform_lt',
'water','water','water','water','water','water','water','water','water','water',
'floating_platform_lt','','','','','ice_ramp_dn','','','','ice_ramp_rt',
'home','ice_wall','','','','','','','','',
'ice_ramp_up','','','','','','','','','',
'','','','','','','','ice_ramp_rt','','',
'ice_wall','','','','','ice_wall','','','','',
'','','','','','','','','','',
'ice_wall'];

//Array of all the level data arrays
var levels = [level1, level2, level3, level4, level5];
//Current level
var currentLevel = 0;

//Advances the player to the next level
function nextLevel() {
  currentLevel ++;
  //Are there no more levels left?
  if (currentLevel >= levels.length) {
    currentLevel --; //We don't want the displayed level to increase
    //The player won the game
    showElement("winDisplay");
    showElement("restartButton");
    
    //Stop the game from running
    stopTimedLoop();
    return;
  }
  
  //Load the new level;
  loadLevel(levels[currentLevel]);
}

//Reloads the current level, such as in the event the player dies
function reloadLevel() {
  loadLevel(levels[currentLevel]);
}

//The grid x and y position of the player
var playerX = 0;
var playerY = 0;

//The x and y velocity of the player.
var playerVX = 0;
var playerVY = 0;

//Stores if a player sprite has already been created
var playerSprite = false;

//Sets up the player sprite and variables
function InitializePlayer() {
  if(playerSprite) {
    //An existing player sprite is deleted
    deleteElement("player");
  } else { playerSprite = true; }
  
  //Create a new player sprite, ensuring its on top of the other sprites
  image("player", "penguin_right.PNG");
  
  playerX = 0;
  playerY = 0;
  playerVX = 0;
  playerVY = 0;
  
  //Set its position and size;
  setPosition("player",0,0,gridOffset,gridOffset);
}


//Sets the players position based on the grid coordinates
//It takes 2 arguments
//x {number} - The x position
//y {number} - The y position
function setPlayerPosition(x,y) {
  setPosition("player",x*gridOffset,y*gridOffset);
}


//Updates the image for the player based on their velocity
function updatePlayerGraphics() {
  if(playerVX > 0) {
    setImageURL("player","penguin_right.PNG");
  } else if (playerVX < 0) {
    setImageURL("player","penguin_left.PNG");
  } else if (playerVY > 0) {
    setImageURL("player","penguin_down.PNG");
  } else if (playerVY < 0) {
    setImageURL("player","penguin_up.PNG");
  }
}

//Updates the players velocity and position
function updatePlayer() {
  //Start off by updating the image of the player.
  updatePlayerGraphics();
  playerX += playerVX;
  
  //Restrict the player to the grid
  //If the x is less than 0 then the player is off the grid
  if(playerX < 0) {
    //Set the x to the minimum value
    playerX = 0;
    //The velocity is set to zero when a wall is reached so the player can move again
    playerVX = 0;
  }
  //If the player x is greater than or equal to the gridSize, its off the grid
  else if(playerX >= gridSize) {
    //gridSize - 1 is the edge of the grid, or the maximum value
    playerX = gridSize - 1;
    //The velocity is set to zero when a wall is reached so the player can move again
    playerVX = 0;
  } 
  
  playerY += playerVY;
  
  //Restrict the player to the grid
  //If the y is less than 0 then the player is off the grid
  if(playerY < 0) {
    //Set the y to the minimum value
    playerY = 0;
    //The velocity is set to zero when a wall is reached so the player can move again
    playerVY = 0;
  }
  //If the player y is greater than or equal to the gridSize, its off the grid
  else if(playerY >= gridSize) {
    //gridSize - 1 is the edge of the grid. or the maximum value
    playerY = gridSize - 1;
    //The velocity is set to zero when a wall is reached so the player can move again
    playerVY = 0;
  }
  
  //Check if the player is colliding with anything
  if(isCollidable(playerX,playerY)) {
    //Undo the movement so the player is no longer inside the tile
    playerX -= playerVX;
    playerY -= playerVY;
    
    //The velocity is set to zero when a wall is reached so the player can move again
    playerVX = 0;
    playerVY = 0;
  } 
  //Check if the player has reached the home tile
  else if (getTile(playerX,playerY).type == "home") {
    //If so load the next level
    nextLevel();
  } else if (getTile(playerX,playerY).type.substring(0,5) == "water") {
    reloadLevel();
  }
  
  //Update the player's position;
  setPlayerPosition(playerX,playerY);
}

function updateScreen() {
  //Update the level display
  setText("levelDisplay","Level: " + (currentLevel + 1));
}

//Updates the entire game.
function updateGame() {
  //Update tiles like water and moving platforms
  
  updateGrid();
  //Update the player first
  updatePlayer();
  
  //Update the screen
  updateScreen();
}


//Event handler for key presses
onEvent("screen1","keydown",function(e) {
  //If the player is already moving then key input is ignored
  if(playerVX != 0 || playerVY != 0) { return; }
  
  //37 - The left arrow key
  if(e.keyCode == 37) {
    //Set the players velocity to move left
    playerVX = -1;
    playerVY = 0;
    // generateLevel();
  }
  
  //38 - The up arrow key
  if(e.keyCode == 38) {
    //Set the players velocity to move up
    playerVX = 0;
    playerVY = -1;
  }
  
  //39 - The right arrow key
  if(e.keyCode == 39) {
    //Set the players velocity to move right
    playerVX = 1;
    playerVY = 0;
  }
  
  //40 - The down arrow key
  if(e.keyCode == 40) {
    //Set the players velocity to move down
    playerVX = 0;
    playerVY = 1;
  }
});

//The mousedown event is used for the movement buttons so they respond to clicks instantly
onEvent("rtButton","mousedown",function() {
  //Don't do anything if the player is already moving
  if(playerVX != 0 || playerVY != 0) { return; }
  
  //Set the players velocity to move right
  playerVX = 1;
  playerVY = 0;
});
onEvent("upButton","mousedown",function() {
  //Don't do anything if the player is already moving
  if(playerVX != 0 || playerVY != 0) { return; }
  
  //Set the players velocity to move up
  playerVX = 0;
  playerVY = -1;
});
onEvent("ltButton","mousedown",function() {
  //Don't do anything if the player is already moving
  if(playerVX != 0 || playerVY != 0) { return; }
  
  //Set the players velocity to move left
  playerVX = -1;
  playerVY = 0;
});
onEvent("dnButton","mousedown",function() {
  //Don't do anything if the player is already moving
  if(playerVX != 0 || playerVY != 0) { return; }
  
  //Set the players velocity to move down
  playerVX = 0;
  playerVY = 1;
});

onEvent("restartButton","click",function() {
  init();
});

//Resets the entire game from the beginning
function init() {
  //Reset the current level
  currentLevel = 0;
  loadLevel(levels[0]);
  
  //Hide the win display and restart button
  hideElement("winDisplay");
  hideElement("restartButton");
  
  //Start the game update loop
  timedLoop(150, updateGame);
}

//Start the game
init();
