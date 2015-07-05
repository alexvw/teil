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
		
		//token object
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
				console.log("Dropping token at " + x +", "+y);
				theTiles[toLinear(x,y)] = new token(x,y,p);
				return true;
			}else if (alreadyThere instanceof token){
				//console.log("There is already a token at " + x +", "+y);
				//is it my token?
				if (alreadyThere.p === p){
					//its my token, increase strength
					if (alreadyThere.strength < MAX_STRENGTH){
						console.log("Adding to token at " + x +", "+y);
						alreadyThere.strength++;
						return true;
					}else{
						console.log("Max strength at " + x +", "+y);
						//alreadyThere.strength++;
						return false;

					}
				}
				else {
					console.log("There is already an enemy token at " + x +", "+y);
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
			var randomArray = new Array();
			
			randomSwap(boardCopy,randomArray);
			
			//for each of them, execute THE ALGORITHM on the board
			for (var i=0;i<randomArray.length;i++){
				var randomToken = randomArray[i];
				var tX = randomToken.x;
				var tY = randomToken.y;
				
				var origToken = this.getTileByXY(tX,tY);
				algorithm(this,origToken);
			}
			
		}
		
		//THE ALGORITHM
		//does its magic on the original objects
		var algorithm = function(board, token){
			
			var tX = token.x;
			var tY = token.y;
			var tP = token.p;
			var tiles = board.getTheTiles;
			
			var polandObject = getPolandObject(board,token);
			
			if (polandObject.enemyCount){
				//LET LOOSE THE DOGS OF WAR
				
			}
			
			
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
			var friendlyCount = 0;
			var enemyCount = 0;
			
			for (var i=0;i<neighborArray.length;i++){
				var status = 0;
				if (typeof neighborArray[i] !== "undefined"){
					status++;
					if (neighborArray[i] != null){
						status++;
						if (neighborArray[i].p === tP){
							status++;
							friendlyCount++;
						}
						else{
							enemyCount++;
						}
					}
				}
				polandArray.push(status);
			}
			
			/*{
			enemyCount:0,
			friendlyCount:0,
			polandArray:[]
			}
			
			*/
			return {enemyCount, friendlyCount, polandArray};
		}
		
		var fight = function(polandObject){
		
		}
		
		return {
			getTileByXY: getTileByXY,
			getTheTiles: theTiles,
			dropToken: dropToken,
			createPlayer: createPlayer,
			boardWidth: boardWidth,
			boardHeight: boardHeight,
			sim: sim
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
	



	

