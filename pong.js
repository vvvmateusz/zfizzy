	var canvas;
	var canvasContext;
	var ballX = 400;
	var ballY = 300;
	var ballSpeedX;
	var ballSpeedY;

	var player1Score = 0;
	var player2Score = 0;
	const WINNING_SCORE = 3;

	var showingWinScreen = false;

	var paddle1Y = 250;
	var paddle2Y = 250;
	const PADDLE_THICKNESS = 10;
	const PADDLE_HEIGHT = 100;


	function calculateMousePos(evt){
		var rect = canvas.getBoundingClientRect();
		var root = document.documentElement;
		var mouseX = evt.clientX - rect.left - root.scrollLeft;
		var mouseY = evt.clientY - rect.top - root.scrollTop;
		return {
				x:mouseX,
				y:mouseY
		}
	}

	function handleMouseClick(evt){
		if(showingWinScreen){
			showingWinScreen = false;
			player1Score = 0;
			player2Score = 0;
		}
	}

	window.onload = function() {
		canvas = document.getElementById('gameCanvas');
		canvasContext = canvas.getContext('2d');
		ballRandomDirection(Math.round(Math.random()));

		var framesPerSecond = 60;
		setInterval(function() {
						move();
						draw();
					}, 1000/framesPerSecond);

		canvas.addEventListener('mousedown',handleMouseClick);

		canvas.addEventListener('mousemove',
				function(evt){
						var mousePos = calculateMousePos(evt);
						paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
				});
	}

	function resetAll(whichPlayer){
		if(player1Score == WINNING_SCORE || player2Score == WINNING_SCORE){
			showingWinScreen = true;
		}
		ballRandomDirection(whichPlayer);
		ballX = canvas.width/2;
		ballY = canvas.height/2;
	}

	function computerMovement(){
		var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
		if(paddle2YCenter < ballY-35){
			paddle2Y+=3;
		}else if(paddle2YCenter > ballY+35){
			paddle2Y-=3;
		}
	}
	
	function ballRandomDirection(whichPlayer){
		if(whichPlayer==false){
			if(Math.random()<0.5){
				ballSpeedX = -5;
				ballSpeedY = 1;
			}
			else{
				ballSpeedX = -5;
				ballSpeedY = -1;
			}
		}
		else{
			if(Math.random()<0.5){
				ballSpeedX = 5;
				ballSpeedY = 1;
			}
			else{
				ballSpeedX = 5;
				ballSpeedY = -1;
			}
		}
	}

	function move(){
		if(showingWinScreen){
			return;
		}
		computerMovement();

		ballX+=ballSpeedX;
		ballY+=ballSpeedY;
		if(ballX >= canvas.width-PADDLE_THICKNESS-10) {
			if(ballY > paddle2Y && ballY+10 < paddle2Y + PADDLE_HEIGHT) {
				ballSpeedX*=-1;

				var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
				ballSpeedY = deltaY * 0.175;
			}else {
				if(ballX+10 >= canvas.width){	
					player1Score++;
					resetAll(0);
				}
			}
		}
		if(ballX <= PADDLE_THICKNESS+10) {
			if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
				ballSpeedX*=-1;

				var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
				ballSpeedY = deltaY * 0.175;
			}else {
				if(ballX-10 <= 0){	
					player2Score++;
					resetAll(0);
				}
			}
		}
		if(ballY >= canvas.height-10) {
			ballSpeedY*=-1;
		}
		if(ballY <= 10) {
			ballSpeedY*=-1;
		}
	}

	function drawNet(){
		for(var i=10;i<canvas.height;i+=40){
			colorRect(canvas.width/2-1,i,2,20,'white');
		}
	}

	function draw() {
		canvasContext.font = '32px Courier';
		colorRect(0,0,canvas.width,canvas.height,'black');
		if(showingWinScreen){
			canvasContext.fillStyle = 'white';

			if(player1Score == WINNING_SCORE){
				canvasContext.fillText("Left Player Won!",225,200);
			}else if(player2Score == WINNING_SCORE){
				canvasContext.fillText("Right Player Won!",225,200);
			}
			canvasContext.fillText("Click to continue!",225,500);
			return;
		}

		drawNet();


		colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
		colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
		colorCircle(ballX,ballY,10,'white');


		canvasContext.fillText(player1Score,150,150);
		canvasContext.fillText(player2Score,canvas.width-150,150);
	}


	function colorRect(leftX,topY,width,height,drawColor) {
		canvasContext.fillStyle = drawColor;
		canvasContext.fillRect(leftX,topY,width,height);
	}

	function colorCircle(centerX,centerY,radius,drawColor){
		canvasContext.fillStyle = drawColor;
		canvasContext.beginPath();
		canvasContext.arc(centerX,centerY,radius,0,Math.PI*2,true);
		canvasContext.fill();
	}