/*
@author avanderwoude
game data object
*/

//basic namespace for now, could sandbox this later if necessary
teilEngine = function(width, height, players, MAX_STRENGTH){
	//private
    var time = 0;
	var players = players;
	var MAX_STRENGTH = MAX_STRENGTH;
	
	//board object
	var board = function(w,h){
		var theTiles = [];
		var boardWidth = w;
		var boardHeight = h;
		
		var toLinear = function(x,y){
			return((y-1)*w)+(x-1);
		}
		
		for (var i=0;i<w*h; i++){
			theTiles.push(null);
		}
		
		var getTileByXY = function(x,y){
			return theTiles[toLinear(x,y)];
		}
		
		//token object
		var token = function(x,y,player){
			this.x = x;
			this.y = y;
			this.p = player;
			this.strength = 1;
			
		};
		
		var killToken = function(token){
			if (token.strength > 1){
				token.strength--;
				return false;
				}
			else{
				theTiles[toLinear(token.x,token.y)] = null;
				delete token;
				return true;
			}
		}
		
		//player obj
		var player = function(name, color){
			this.name = name;
			this.color = color;
		};
		
		var createPlayer = function(name, color){
			return new player(name, color);
		}
		
		var dropToken = function(x,y,p){
			//check if space is open first
			var alreadyThere = this.getTileByXY(x,y);
			if (alreadyThere === null){
				//console.log("Dropping token at " + x +", "+y);
				theTiles[toLinear(x,y)] = new token(x,y,p);
				return true;
			}else if (alreadyThere instanceof token){
				//console.log("There is already a token at " + x +", "+y);
				//is it my token?
				if (alreadyThere.p === p){
					//its my token, increase strength
					if (alreadyThere.strength < MAX_STRENGTH){
						//console.log("Adding to token at " + x +", "+y);
						alreadyThere.strength++;
						return true;
					}else{
						//console.log("Max strength at " + x +", "+y);
						//alreadyThere.strength++;
						return false;

					}
				}
				else {
					//console.log("There is already an enemy token at " + x +", "+y);
					return false;
				}
			}else{
			console.log("Someone did something nasty...");
			return false;
			}
		}
		
		//recursive swap function
		var randomSwap = function(oldBoard, randomBoard){
			//base case, fully randomized so return
			if (oldBoard.length == 0){
				return randomBoard;
				}
			else {
				var where = Math.round(Math.random()*(oldBoard.length-1));
				var couldBeAToken = oldBoard.splice(where,1)[0];
				if (couldBeAToken != null)
					randomBoard.push(couldBeAToken);
				randomSwap(oldBoard, randomBoard);
			}
		}
		
		var sim = function(step){
			
			var boardCopy = this.getTheTiles.slice(0);
			//randomly shuffle tiles
			//var randomArray = new Array();
			
			//no more, efficiency > simplicity
			//randomSwap(boardCopy,randomArray);
			
			//for each of them, execute THE ALGORITHM on the board
			//pray I do not alter the board length any further
			var boardLength = boardCopy.length;
			for (var i=0;i<boardLength;i++){
				var origToken = boardCopy.splice(Math.round(Math.random()*boardCopy.length),1)[0];
				if (typeof origToken != "undefined" && origToken != null)
					algorithm(this,origToken);
			}
			
		}
		
		//THE ALGORITHM
		//does its magic on the original objects
		var algorithm = function(board, tokenIn){
			
			if (tokenIn instanceof token){
				var tX = tokenIn.x;
				var tY = tokenIn.y;
				var tP = tokenIn.p;
				var tiles = board.getTheTiles;
				
				var polandObject = getPolandObject(board,tokenIn);
				
				if (polandObject.enemyArray.length){
					//LET LOOSE THE DOGS OF WAR
					var enemyToken = polandObject.enemyArray[Math.round(Math.random()*polandObject.enemyArray.length)]
					fight(board, polandObject, enemyToken);
				}
			}
			else return;
			
		}
		
		var getPolandObject = function(board, token){
			var tX = token.x;
			var tY = token.y;
			var tP = token.p;
			var tiles = board.getTheTiles;
			
			/*
			[0,1,2
			 3,4,5
			 6,7,8]
			*/
		
			var neighborArray = [tiles[((tY-2)*w)+(tX-2)],
								 tiles[((tY-2)*w)+(tX-1)],
								 tiles[((tY-2)*w)+(tX)],
								 tiles[((tY-1)*w)+(tX-2)],
								 tiles[((tY-1)*w)+(tX-1)],
								 tiles[((tY-1)*w)+(tX)],
								 tiles[((tY)*w)+(tX-2)],
								 tiles[((tY)*w)+(tX-1)],
								 tiles[((tY)*w)+(tX)]];
								 
			//because math, override some ends
			if (tX >= board.boardWidth){
				neighborArray[2] = undefined;
				neighborArray[5] = undefined;
				neighborArray[8] = undefined;
				}
			else if (tX <= 1){
				neighborArray[0] = undefined;
				neighborArray[3] = undefined;
				neighborArray[6] = undefined;
				}
				
			if (tY >= board.boardHeight){
				neighborArray[6] = undefined;
				neighborArray[7] = undefined;
				neighborArray[8] = undefined;
				}
			else if (tY <= 1){
				neighborArray[0] = undefined;
				neighborArray[1] = undefined;
				neighborArray[2] = undefined;
				}
				
			//of just looking to making a little bit of moneys
			var polandArray = [];
			var friendlyArray = [];
			var enemyArray = [];
			
			for (var i=0;i<neighborArray.length;i++){
				var status = 0;
				if (typeof neighborArray[i] !== "undefined"){
					status++;
					if (neighborArray[i] != null){
						status++;
						if (neighborArray[i].p === tP){
							status++;
							friendlyArray.push(neighborArray[i]);
						}
						else{
							enemyArray.push(neighborArray[i]);
						}
					}
				}
				polandArray.push(status);
			}
			
			/*{
			token:{},
			enemyArray:[],
			friendlyArray:[],
			polandArray:[]
			}
			
			*/
			return {token, polandArray, enemyArray, friendlyArray,};
		}
		
		var fight = function(board, polandObject, enemyToken){
			//get counts of each side
			var howDeepAreWeRolling = polandObject.friendlyArray.length;
			var howDeepAreTheyRolling = polandObject.enemyArray.length;
			
			
			
			//for each defender, each side rolls all their dice and takes the highest. whomever is lower, dies. repeats until no defenders left
			while (polandObject.enemyArray.length > 0 && polandObject.friendlyArray.length > 0){
				var ourName = polandObject.token.p.name;
				var theirName = "Enemies";
			
				var ourRolls = [];
				var theirRolls = [];
				
				var outputString = ourName + " rolled: ";
			
				for (var i=0;i<howDeepAreWeRolling;i++){
				var roll = Math.random().toFixed(2)*100;
				ourRolls.push(roll);
				outputString += roll +" ";
				}
				
				outputString += "\n" + theirName + " rolled: "
				for (var i=0;i<howDeepAreTheyRolling;i++){
				var roll = Math.random().toFixed(2)*100;
				theirRolls.push(roll);
				outputString += roll +" ";
				}
				
				var weWon = (Math.max.apply(null, ourRolls) >= Math.max.apply(null, theirRolls));
				
				//make sure we even have frienemies before we try to kill them
				var hasFriends = polandObject.enemyArray.length;
				var hasEnemies = polandObject.friendlyArray.length;
				
				
				if (weWon){
					var toKill = polandObject.enemyArray[polandObject.enemyArray.length-1];
					
					if (board.killToken(toKill))
						polandObject.enemyArray.pop();
					outputString += "\n"+ ourName + " Won! \n" + "RIP " + theirName;
				}
				else {
					var toKill = polandObject.friendlyArray[polandObject.friendlyArray.length-1];
					
							
					if (typeof toKill == "undefined")
						toKill = polandObject.token;
					
					if (board.killToken(toKill))
						polandObject.friendlyArray.pop();
					outputString += "\n"+ theirName + " Won! \n" + "RIP " + ourName;
				}
				
				//alert(outputString);
			}
			
			
			
			
			//kill those who were not fortunate
			//god bless the troops
			
			
			//move those who won
			//god bless the troops
			
		}
		
		return {
			getTileByXY: getTileByXY,
			getTheTiles: theTiles,
			dropToken: dropToken,
			createPlayer: createPlayer,
			boardWidth: boardWidth,
			boardHeight: boardHeight,
			sim: sim,
			killToken: killToken
		}
	}
	
	
	var theBoard = new board(width,height);
 
	//public
    return {
        getBoard: theBoard,
        getPlayers: players
    };
};

//utility functions
function drawPolygon(ctx,x,y,size,numOfSides) {
	ctx.beginPath();
	ctx.moveTo (x +  size * ma.sin(0), y +  size *  ma.cos(0));          
 
	for (var i = 1; i <= numOfSides;i++) {
	    ctx.lineTo (x + size * ma.sin((i * 2 * (ma.PI) / numOfSides)), y + size * ma.cos((i * 2 * (ma.PI) / numOfSides)));
	}
	ctx.closePath();
	ctx.fill();
}

function distance(x1,y1,x2,y2){
	 return ma.sqrt(((x1 - x2)*(x1 - x2)) + ((y1 - y2)*(y1 - y2)));
}

Array.prototype.remove = function(object) {
	this.splice(this.indexOf(object),1);
	return this;
	};
	



	

