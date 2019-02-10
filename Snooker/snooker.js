var intervale = 10; // ms

var width = 234;
var height = 117;

var c;
var ctx;
var bufferCanvas;
var bufferCtx;
var stickCanvas;
var stickCtx;

var zoom = 3;

var balls = [];
var targetBall;

var touchdirX;
var touchdirY;

var fa = 0.25;	// shooting force attenuation
var ff = 0.991;	// frictional force ball-floor
var radius = 20;

var stickStartx = 0;
var stickStarty = 0;

// collision restitution factor:
// 0 balls gets stick each other, 1 perfect elastic collision
var restitution = 0.9;


function onload() {
	initCanvas();
	initBalls();
	initListeners();
	
	draw();
}

function draw() {
	var t = new Date().getTime(); // ms
	
	// clear the canvas:
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.beginPath();
	bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
	bufferCtx.beginPath();
	
	moveBalls();
	drawBalls();
	flipBuffer();
	
	t = intervale - (new Date().getTime() - t);
	if (t < 0) {
		t = 0;
	}
	
	setTimeout(draw, t);
}

function moveBalls() {
	balls.forEach(function(ball){
		ball.velx = ball.velx * ff;
		ball.vely = ball.vely * ff;
		ball.x += ball.velx;
		ball.y += ball.vely;
		
		// truly stop the ball when it moves too slow
		if (Math.abs(ball.velx) <= 0.15) {
			ball.velx = 0;
		}
		if (Math.abs(ball.vely) <= 0.15) {
			ball.vely = 0;
		}
		
		// bounce against borders if needed
		if (ball.x + radius > c.width) {
			ball.x = c.width + c.width - ball.x - radius - radius;
			ball.velx = -ball.velx;
		}
		
		if (ball.x - radius < 0) {
			ball.x = radius + radius - ball.x;
			ball.velx = -ball.velx;
		}
		
		if (ball.y + radius > c.height) {
			ball.y = c.height + c.height - ball.y - radius - radius;
			ball.vely = -ball.vely;
		}
		
		if (ball.y - radius < 0) {
			ball.y = radius + radius - ball.y;
			ball.vely = -ball.vely;
		}
		
		// collisions
		for (var i = 0; i < balls.length; i++) {  
			for (var j = i + 1; j < balls.length; j++) {
				if (colliding(balls[i], balls[j])) {
					resolveCollision(balls[i], balls[j]);
				}
			}
		}
	});
}



function drawBalls() {
	balls.forEach(function(ball){
		drawBall(ball.x, ball.y, ball.color);
	});
}

function drawBall(x, y, color) {
	bufferCtx.beginPath();
	bufferCtx.arc(x, y, radius, 0, 2 * Math.PI);
	bufferCtx.stroke(); 
	bufferCtx.fillStyle = color;
	bufferCtx.fill();
}

function flipBuffer(){
	ctx.drawImage(bufferCanvas, 0, 0);
	ctx.drawImage(stickCanvas, 0, 0);
}

function setTargetBall(ex, ey) {
	var allStopped = true;
	
	var allStopped = true;
	balls.forEach(function(ball){
		if (ball.velx != 0 || ball.vely != 0) {
			allStopped = false;
		}
	});
	
	balls.forEach(function(ball){
		if (Math.abs(ball.x - ex) <= radius
			&& Math.abs(ball.y - ey) <= radius) {
			targetBall = ball;
		} else if (Math.abs(ball.x - ex) <= 2 * radius
			&& Math.abs(ball.y - ey) <= 2 * radius) {
			// search for a nearby ball
			targetBall = ball;
		}
	});
}

function endTrackingPointer(xx, yy) {
	stickCtx.clearRect(
			0, 0, stickCanvas.width, stickCanvas.height);
	stickCtx.beginPath();
	
	if (targetBall) {
		targetBall.velx = (xx - stickStartx) * fa;
		targetBall.vely = (yy - stickStarty) * fa;
		
		targetBall = null;
	}
}

function drawStick(xx, yy) {
	stickCtx.clearRect(
		0, 0, stickCanvas.width, stickCanvas.height);
	
	stickCtx.beginPath();
	stickCtx.moveTo(stickStartx, stickStarty);
	stickCtx.lineTo(xx, yy);
	stickCtx.stroke();
}

function Ball(x, y, color, velx, vely) {
	this.x = x;
	this.y = y;
	this.color = color;
	this.velx = velx;
	this.vely= vely;
}

function initCanvas() {
	c = document.getElementById("myCanvas");
	c.width = width * zoom;
	c.height = height * zoom;
	ctx = c.getContext("2d");
	
	bufferCanvas = document.createElement("canvas");
	bufferCanvas.width = width * zoom;
	bufferCanvas.height = height * zoom;
	bufferCtx = bufferCanvas.getContext("2d");
	
	stickCanvas = document.createElement("canvas");
	stickCanvas.width = width * zoom;
	stickCanvas.height = height * zoom;
	stickCtx = stickCanvas.getContext("2d");
}

function initBalls() {
	balls.push(
		new Ball(30, 30, "green", 0, 0));
	balls.push(
		new Ball(80, 75, "red", 0, 0));
	balls.push(
		new Ball(30, 50, "blue", 10, 5));
}

function initListeners() {
	c.onmousedown = function(e) {
		if (e.button == 0) {
			var ex = e.offsetX;
			var ey = e.offsetY;
			
			setTargetBall(ex, ey);
			
			if (targetBall) {
				stickStartx = targetBall.x;
				stickStarty = targetBall.y;
			}
		}
	};
	
	c.onmousemove = function(e) {
		if (targetBall) {
			var xx = e.offsetX;
			var yy = e.offsetY;
			
			drawStick(xx, yy);
		}
	};
	
	c.onmouseup = function(e) {
		var xx = e.offsetX;
		var yy = e.offsetY;
		
		endTrackingPointer(xx, yy);
	};
	
	c.ontouchstart = function(e) {
		var rect = e.target.getBoundingClientRect();
		var ex = e.changedTouches[0].pageX - rect.left;
		var ey = e.changedTouches[0].pageY - rect.top;
		
		setTargetBall(ex, ey);
		
		if (targetBall) {
			stickStartx = targetBall.x;
			stickStarty = targetBall.y;
		}
	};
	
	c.ontouchmove = function(e) {
		if (targetBall) {
			var rect = e.target.getBoundingClientRect();
			var xx = e.changedTouches[0].pageX - rect.left;
			var yy = e.changedTouches[0].pageY - rect.top;
			
			drawStick(xx, yy);
		}
	};
	
	c.ontouchend = function(e) {
		var rect = e.target.getBoundingClientRect();
		var xx = e.changedTouches[0].pageX - rect.left;
		var yy = e.changedTouches[0].pageY - rect.top;
		
		endTrackingPointer(xx, yy);
	};
}

// colliding and resolveCollision taken from:
// https://stackoverflow.com/questions/345838/ball-to-ball-collision-detection-and-handling
function colliding(ballA, ballB) {
    var xd = ballA.x - ballB.x;
    var yd = ballA.y - ballB.y;

    var sumRadius = 2 * radius;
    var sqrRadius = sumRadius * sumRadius;

    var distSqr = (xd * xd) + (yd * yd);

    if (distSqr <= sqrRadius) {
        return true;
    }

    return false;
}

function resolveCollision(ballA, ballB) {
    // get the mtd
    var deltaX = ballA.x - ballB.x;
	var deltaY = ballA.y - ballB.y;
	var d = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // minimum translation distance to push balls apart after intersecting

	// var mtdX = deltaX * ((radius + radius - d) / d);
	var mtdX = deltaX * (radius + radius - d) / d;
	// var mtdY = deltaY * ((radius + radius - d) / d);
	var mtdY = deltaY * (radius + radius - d) / d;
	
    // resolve intersection
	
    // push-pull them apart
	ballA.x = ballA.x + (mtdX / 2);
	ballA.y = ballA.y + (mtdY / 2);
	
    // impact speed
	var vx = ballA.velx - ballB.velx;
	var vy = ballA.vely - ballB.vely;
	
		// normalize mtd
	var d_mtd = Math.sqrt(mtdX * mtdX + mtdY * mtdY);
	var mtdX_norm = mtdX / d_mtd;
	var mtdY_norm = mtdY / d_mtd;
	
		// dot product v · mtd_norm
	var vn = vx * mtdX_norm + vy * mtdY_norm;
	
	
    // sphere intersecting but moving away from each other already
    if (vn > 0) return;

    // collision impulse
    var i = (-(1 + restitution) * vn) / (2);
	var impulseX = mtdX_norm * i;
	var impulseY = mtdY_norm * i;

    // change in momentum
	ballA.velx = ballA.velx + impulseX;
	ballA.vely = ballA.vely + impulseY;
	
	ballB.velx = ballB.velx - impulseX;
	ballB.vely = ballB.vely - impulseY;
}