
var count = 0;

var intervale = 10; // ms

var a1 = Math.PI / 2;
var a2 = Math.PI / 2;
var a1_v = 0;
var a2_v = 0;

var width = 500;
var height = 500;

var xini = width / 2;
var yini = 200;

var r1 = 100;
var r2 = 100;

var m1 = 20;
var m2 = 20;

var c;
var ctx;
var bufferCanvas;
var bufferCtx;

var g = 1;

function onload() {
	c = document.getElementById("myCanvas");
	ctx = c.getContext("2d");
	
	bufferCanvas = document.createElement("canvas");
	bufferCanvas.width = width;
	bufferCanvas.height = height;
	bufferCtx = bufferCanvas.getContext("2d");
	
	draw();
}

function draw() {
	var t = new Date().getTime(); // ms
	
	var a1_a = calculateAngle1(a1, a2, a1_v, a2_v);
	var a2_a = calculateAngle2(a1, a2, a1_v, a2_v);
	
	a1_v += a1_a;
	a1_v = normalizeAngle(a1_v);
	a2_v += a2_a;
	a2_v = normalizeAngle(a2_v);
	a1 += a1_v;
	a1 = normalizeAngle(a1);
	a2 += a2_v;
	a2 = normalizeAngle(a2);
	
	// rozamiento del aire:
	//a1_v *= 0.999;
	//a2_v *= 0.999;
	
	// console.log(a1);
	// console.log(a2);
	
	// clear the canvas:
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.beginPath();
	
	var xy1 = lineToAngle(ctx, xini, yini, r1, a1);
	drawCircle(ctx, xy1.x, xy1.y, m1);
	var xy2 = lineToAngle(ctx, xy1.x, xy1.y, r2, a2);
	drawCircle(ctx, xy2.x, xy2.y, m2);
	
	drawCircle(bufferCtx, xy2.x, xy2.y, 3);
	ctx.drawImage(bufferCanvas, 0, 0);	
	
	
	
	
	// if (count > 50) {
		// ctx.strokeStyle = "#FF0000";
	// }
	
	t = intervale - (new Date().getTime() - t);
	if (t < 0) {
		t = 0;
	}
	
	count = count + 1;
	if (count < 50000) {
		setTimeout(draw, t);
	}
}

// var TWO_PI = 2 * Math.PI;

// function normalizeAngle(theta) {
    // var normalized = theta % TWO_PI;
    // normalized = (normalized + TWO_PI) % TWO_PI;
    // return normalized <= Math.PI ? normalized : normalized - TWO_PI;
// }

function normalizeAngle(angle) {
	return Math.atan2(Math.sin(angle), Math.cos(angle))
}

function calculateAngle1(a1, a2, a1_v, a2_v) {
	// taken from https://www.myphysicslab.com/pendulum/double-pendulum-en.html
	
	var p1 = -1*g*(2*m1+m2)*Math.sin(a1);
	var p2 = m2*g*Math.sin(a1-2*a2);
	var p3 = 2*Math.sin(a1-a2)*m2*(a2_v*a2_v*r2+a1_v*a1_v*r1*Math.cos(a1-a2));
	var p4 = r1*(2*m1+m2-m2*Math.cos(2*a1-2*a2));
	
	var res = (p1-p2-p3) / p4;
	return res;
}

function calculateAngle2(a1, a2, a1_v, a2_v) {
	var p1 = 2*Math.sin(a1-a2);
	var p2 = a1_v*a1_v*r1*(m1+m2)+g*(m1+m2)*Math.cos(a1)+a2_v*a2_v*r2*m2*Math.cos(a1-a2);
	var p3 = r2*(2*m1+m2-m2*Math.cos(2*a1-2*a2));
	
	var res = p1*p2/p3;
	return res;
}

function drawCircle(ctx, cx, cy, r) {
	ctx.beginPath();
	ctx.arc(cx, cy, r, 0, 2 * Math.PI);
	// ctx.stroke(); 
	ctx.fill();
}

function lineToAngle(ctx, x1, y1, length, angle) {

    // angle *= Math.PI / 180;

    var x2 = x1 + length * Math.sin(angle),
        y2 = y1 + length * Math.cos(angle);

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    return {x: x2, y: y2};
}