
var intervale = 100; // ms

var width = 500;
var height = 500;

var xini = 200;
var yini = 200;
var step = 10;
var xvel = step;
var yvel = 0;

var c;
var ctx;
var bufferCanvas;
var bufferCtx;

var snake = [];
var apple = randomApple();

var touchdirX;
var touchdirY;

function onload() {
	c = document.getElementById("myCanvas");
	ctx = c.getContext("2d");
	
	window.onkeyup = function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		
		if (key == 38 && yvel != step) { // up
			xvel = 0;
			yvel = -step;
		} else if (key == 40 && yvel != -step) { // down
			xvel = 0;
			yvel = step;
		} else if (key == 37 && xvel != step) { //left
			xvel = -step;
			yvel = 0;
		} else if (key == 39 && xvel != -step) { // right
			xvel = step;
			yvel = 0;
		}
	};
	
	window.ontouchstart = function(e) {
		e.preventDefault();
		
		touchdirX = e.changedTouches[0].pageX;
		touchdirY = e.changedTouches[0].pageY;
	}
	
	window.ontouchmove = function(e) {
		
		e.preventDefault();
		
		var tdX = e.changedTouches[0].pageX;
		var tdY = e.changedTouches[0].pageY;
		
		var xdif = touchdirX - tdX;
		var ydif = touchdirY - tdY;
		
		if (Math.abs(xdif) >= Math.abs(ydif)) {
			// horizontal move
			if (tdX >= touchdirX && xvel != -step) { // right
				xvel = step;
				yvel = 0;
			} else if(xvel != step) { // left
				xvel = -step;
			yvel = 0;
			}
		} else {
			// vertical move
			if (tdY >= touchdirY && yvel != -step) { // down
				xvel = 0;
				yvel = step;				
			} else if (yvel != step) { // up
				xvel = 0;
				yvel = -step;				
			}
		}
	}
	
	bufferCanvas = document.createElement("canvas");
	bufferCanvas.width = width;
	bufferCanvas.height = height;
	bufferCtx = bufferCanvas.getContext("2d");
	
	snake.unshift(new Cell(xini, yini));
	
	snake.push(new Cell(xini-10, yini));
	snake.push(new Cell(xini-20, yini));
	snake.push(new Cell(xini-30, yini));
	
	draw();
}

function draw() {
	var t = new Date().getTime(); // ms
	
	var head = snake[0];
	
	var n = new Cell(head.x + xvel, head.y + yvel);
	
	var dead = dies(n);
	if (dead) {
		alert("Ouch!");
		return;
	}
	
	snake.unshift(n);
	
	var appleEaten = n.x == apple.x && n.y == apple.y;
	if (appleEaten) {
		apple = randomApple();
	} else {
		snake.pop();
	}
	
	// clear the canvas:
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.beginPath();
	bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
	bufferCtx.beginPath();

	drawApple();
	drawSnake();
	
	flipBuffer();
	
	t = intervale - (new Date().getTime() - t);
	if (t < 0) {
		t = 0;
	}
	
	if (!dead){
		setTimeout(draw, t);
	}
}


function dies(n){
	var dead = false;
	snake.forEach(function(cell){
		if (cell.x == n.x && cell.y == n.y) {
			// dies if snake bites itself
			dead = true;
		} else if (cell.x <= 0 || cell.x >= width ||
					cell.y <= 0 ||cell.y >= height) {
			// dies if snake gets out of screen
			dead = true;
		}
	});
	
	return dead;
}

function drawSnake() {
	var isHead = true;
	snake.forEach(function(cell){
		drawCell(cell.x, cell.y, step/2, isHead);
		if (isHead) {
			isHead = false;
		}
	});
}


function drawCell(cx, cy, r, isHead) {
	bufferCtx.beginPath();
	bufferCtx.arc(cx, cy, r, 0, 2 * Math.PI);
	// bufferCtx.stroke(); 
	bufferCtx.fillStyle = isHead ? "red" : "black";
	bufferCtx.fill();
}

function drawApple() {
	bufferCtx.beginPath();
	bufferCtx.arc(apple.x, apple.y, step/2, 0, 2 * Math.PI);
	bufferCtx.fillStyle = "green";
	bufferCtx.fill();
}

function Cell(x, y) {
	this.x = x;
	this.y = y;
}

 function randomApple() {
	 return new Cell(
		parseInt(Math.random() / 10 * width) * 10,
		parseInt(Math.random() / 10 * height) * 10);
 }
 
 function flipBuffer(){
	 ctx.drawImage(bufferCanvas, 0, 0);	
 }