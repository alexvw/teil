/*
@author avanderwoude
game data object
*/

//basic namespace for now, could sandbox this later if necessary
teilEngine = function(width, height, players){
	//private
    var time = 0;
	var players = players;
	
	//board object
	var board = function(w,h){
		var theTiles = [];
		var boardWidth = w;
		var boardHeight = h;
		
		var toLinear = function(x,y){
			return((y-1)*w)+(x-1);
		}
		
		for (var i=0;i<w*h; i++){
			theTiles.push(false);
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
			if (alreadyThere === false){
				console.log("Dropping token at " + x +", "+y);
				theTiles[toLinear(x,y)] = new token(x,y,p);
				return true;
			}else if (alreadyThere instanceof token){
				console.log("There is already a token at " + x +", "+y);
				//is it my token?
				if (alreadyThere.p === p){
					//its my token, increase strength
					console.log("Adding to token at " + x +", "+y);
					alreadyThere.strength++;
					return true;
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
		
		return {
			getTileByXY: getTileByXY,
			getTheTiles: theTiles,
			dropToken: dropToken,
			createPlayer: createPlayer,
			boardWidth: boardWidth,
			boardHeight: boardHeight
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
	



	

