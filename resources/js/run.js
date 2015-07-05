//execution scripts

	
	var MAX_WIDTH = 768;
	var MAX_HEIGHT = 768;
	
	var MAX_STRENGTH = 3;
	
	var player1;
	var player2;
	var running = true;
	
	var step = 0;
	
	/*function InvSqrt(x){
	   var xhalf = 0.5 * x;
	   //var i = *(int*)&x;
	   i = 0x5f3759d5 - (i >> 1); 
	   //x = *(float*)&i;
	   x = x*(1.5 - xhalf*x*x); //Newton's method
	   return x;
	}*/

	function pageInit(te){
		var width = $(window).width()-5;
		var height = $(window).height()-5;
		//if (width>MAX_WIDTH)
			screenWidth = MAX_WIDTH;
		//if (height>MAX_HEIGHT)
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
		
		(function animloop(){
			if (running){
				requestAnimFrame(animloop);
				render(ctx, screenWidth, screenHeight, te.getBoard);
			}
		})();
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

	function render(ctx, screenWidth, screenHeight, board){
		//cache board
		var renderBoard = board.getTheTiles;
		
		size = screenWidth/board.boardWidth;
		
		ctx.clearRect(0,0,screenWidth,screenHeight);
		
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
			
			if (currentTile === null){
				//no token here
			}else if (typeof currentTile.x !== "undefined"){
				//found one
				var sc = boardToXY(currentTile.x, currentTile.y);
				ctx.fillStyle = currentTile.p.color;
				ctx.globalAlpha=((0.8/MAX_STRENGTH)*currentTile.strength)+0.2;
				ctx.fillRect(sc.x-(size), sc.y-(size), size, size);
				ctx.globalAlpha=1;
			}else{
			//			
			}
			
		}
	}
	
	var xyToBoard = function(x,y){
		var boardx = Math.floor((x/(screenWidth/board.boardWidth))) + 1;
		var boardy = Math.floor((y/(screenHeight/board.boardHeight))) + 1;
		return {
		bx:boardx,
		by:boardy
		}
	}
	
	function goClick(x,y){
		var ret = xyToBoard(x,y)
		//alert(ret.bx +", "+ret.by);
		var p = player2;
		if (step%2)
			p = player1;
		var success = te.getBoard.dropToken(ret.bx,ret.by,p);
		if (success)
			step++;
			
		updateUI(step);
		te.getBoard.sim(step);
	}

	function updateUI(step){
		if (step % 2){
			$('#p1').addClass("active");
			$('#p2').removeClass("active");
		}else{
			$('#p2').addClass("active");
			$('#p1').removeClass("active");
		}
	}
	
	
	function start(){
		var width = 16;
		var height = 16;

		window.te = new teilEngine(width,height,2,3);
		board = te.getBoard;
		player1 = te.getBoard.createPlayer("Hero", "#c00");
		player2 = te.getBoard.createPlayer("Enemy", "#00c");
		
		var x = 0;
		var conflict = false;
		
		pageInit(te);
		
		/*while (x<300){
			var a = Math.round(1+Math.random()*(width-1));
			var b = Math.round(1+Math.random()*(height-1));
			var p = player1;
			success = te.getBoard.dropToken(a,b,p);
			
			a = Math.round(1+Math.random()*(width-1));
			b = Math.round(1+Math.random()*(height-1));
			p = player2
			success = te.getBoard.dropToken(a,b,p);
			
			x++;
		}*/
		
		
		//clickhandlers
	}
	
	$(document).ready(function(){
		start();
		keyHandlers();
	});
