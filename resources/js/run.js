//execution scripts




/*function InvSqrt(float x){
	   var xhalf = 0.5f * x;
	   var i = *(int*)&x; // store floating-point bits in integer
	   i = 0x5f3759d5 - (i >> 1); // initial guess for Newton's method
	   x = *(float*)&i; // convert new bits into float
	   x = x*(1.5f - xhalf*x*x); // One round of Newton's method
	   return x;
	}*/
	var MAX_WIDTH = 720;
	var MAX_HEIGHT = 720;
	
	var ctx, screenWidth, screenHeight, board, size;
		
	function pageInit(te){
		var width = $(window).width()-5;
		var height = $(window).height()-5;
		if (width>MAX_WIDTH)
			screenWidth = MAX_WIDTH;
		if (height>MAX_HEIGHT)
			screenHeight = MAX_HEIGHT;
		
		c = document.getElementById('c');
		c.width = screenWidth;
		c.height = screenHeight;
		
		c.onselectstart = function () { return false; } // ie
		c.onmousedown = function () { return false; }// mozilla
		c.onmousemove = function() { return false; }
		
		ctx = c.getContext('2d');
		
		CANVAS_WIDTH = $('#c').width();
		CANVAS_HEIGHT = $('#c').height();
		
		
		
		requestAnimFrame(render);
	}
	
	//requestAnim shim layer by Paul Irish
	//paulirish.com
	//thx paul
	window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element){
			  window.setTimeout(callback, 1000 / 60);
			};
	})();

	function render(){
		//cache board
		var renderBoard = board.getTheTiles;
		
		size = screenWidth/board.boardWidth;
		
		//used only here
		var boardToXY = function(bx,by){
			var outx = (bx*(screenWidth/board.boardWidth));
			var outy = (by*(screenHeight/board.boardHeight));
			return {
			x:outx,
			y:outy
			}
		}
		
		//for each spot in the board
		for (i=0;i<renderBoard.length;i++){
			var currentTile = renderBoard[i];
			
			if (currentTile === false){
				//no token here
			}else if (typeof currentTile.x !== "undefined"){
				//found one
				var sc = boardToXY(currentTile.x, currentTile.y);
				
				ctx.fillStyle = currentTile.p.color;
				ctx.globalAlpha=(0.33*currentTile.strength);
				ctx.fillRect(sc.x-(size), sc.y-(size), size, size);
				ctx.globalAlpha=1;
			}else{
			//			
			}
			
		}
			//if empty
			//if tile, draw color of player
	}
	
	var xyToBoard = function(x,y){
		var boardx = Math.floor((x/(screenWidth/board.boardWidth)));
		var boardy = Math.floor((y/(screenHeight/board.boardHeight)));
		return {
		bx:boardx,
		by:boardy
		}
	}
	
	function goClick(x,y){
		var ret = xyToBoard(x,y)
		alert(ret.bx +", "+ret.by);
	}

	function start(){
		var width = 16;
		var height = 16;

		window.te = new teilEngine(width,height,2);
		board = te.getBoard;
		var player1 = te.getBoard.createPlayer("Hero", "#c00");
		var player2 = te.getBoard.createPlayer("Enemy", "#00c");
		
		var x = 0;
		var conflict = false;
		
		pageInit(te);
		
		while (x<300){
			var a = Math.round(1+Math.random()*(width-1));
			var b = Math.round(1+Math.random()*(height-1));
			var c = player1;
			conflict = te.getBoard.dropToken(a,b,c);
			
			a = Math.round(1+Math.random()*(width-1));
			b = Math.round(1+Math.random()*(height-1));
			c = player2
			conflict = te.getBoard.dropToken(a,b,c);
			
			x++;
		}
		
		
		//clickhandlers
	}
	
	$(document).ready(function(){
		start();
		keyHandlers();
	});
