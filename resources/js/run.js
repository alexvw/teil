//execution scripts

	
	var MAX_WIDTH = 768;
	var MAX_HEIGHT = 768;
	
	var MAX_STRENGTH = 3;
	
	var players = [];
	var running = true;
	
	var step = 0;
	var ip = 0;
	
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
		var success = te.getBoard.dropToken(ret.bx,ret.by,players[ip]);
		if (success){
			step++;
			ip = (ip+1) % (players.length);
		}
			
			
		updateUI(players[ip].name);
		te.getBoard.sim(step);
		if (step%4 == 0)
			updateScores();
	}
	
	function calcScore(players, board){
		//for every tile on the board, see what player controls
		var score = {};
		for (var i=0;i<players.length;i++){
			score[players[i].name] = 0;
		}
		
		var tiles = board.getTheTiles;
		for (var i=0;i<tiles.length;i++){
			var thisSpot = tiles[i];
			if (typeof thisSpot != undefined && thisSpot != null){
				score[thisSpot.p.name]++;
			}
		}
		return score;
	}

	function updateUI(playerid){
		$('.player').removeClass("active");
		$('#player-'+playerid).addClass("active");
	}
	function updateScores(){
		var scores = calcScore(players, te.getBoard);
		for (n in scores){
			$('#player-'+n).find(".score").html(scores[n]);
		}
		
	}
	
	
	function start(){
		var width = 32;
		var height = 32;

		window.te = new teilEngine(width,height,2,3);
		board = te.getBoard;
		players.push(te.getBoard.createPlayer("Red", "#c00"));
		players.push(te.getBoard.createPlayer("Cerulean", "#00c"));
		players.push(te.getBoard.createPlayer("Green", "#0c0"));
		players.push(te.getBoard.createPlayer("Purple", "#c0c"));
		
		//players.push(te.getBoard.createPlayer("Yellow", "#cc0"));
		//players.push(te.getBoard.createPlayer("Grey", "#888"));
		
		$('#players').html("");
		
		for (var i=0;i<players.length;i++){
			var list = $('#players').html();
			list += "<div id='player-"+players[i].name+"' class='player col-sm-"+Math.round(12/players.length)+"'><span style='width:30px;height:30px;background-color:"
			+players[i].color+"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> &nbsp;"+players[i].name+"&nbsp;&nbsp;<span class='score'></span></div>";
			$('#players').html(list);
		}
		
		var x = 0;
		var conflict = false;
		
		pageInit(te);
		
		//setInterval(testClickP1, 15);
		setInterval(testClickP1, 7);
		
		//clickhandlers
	}
	
	function testClickP1(){
			var a = Math.round(1+Math.random()*(766));
			var b = Math.round(1+Math.random()*(766));
			var success = false;
			success = goClick(a,b);
	}
	
	$(document).ready(function(){
		start();
		keyHandlers();
	});
