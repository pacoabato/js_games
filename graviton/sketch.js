// Gravitational dance
// inspired from Coding Train: https://www.youtube.com/watch?v=fML1KpvvQTc

const worlds = [];
const colors = [];

function setup() {
	createCanvas(600, 400);

	// worlds.push(new World(300, 200, 20, random(colors)));
	// worlds.push(new World(350, 280, 20, random(colors)));
	// worlds.push(new World(250, 180, 20, random(colors)));

	const alfa = 50;
	colors.push(color(102, 0, 255, alfa));
	colors.push(color(255, 0, 255, alfa));
	colors.push(color(255, 0, 64, alfa));
	colors.push(color(0, 255, 0, 0, alfa));
	colors.push(color(255, 255, 0, alfa));
	colors.push(color(255, 191, 0, alfa));
	colors.push(color(255, 64, 0, alfa));
	colors.push(color(0, 102, 26, alfa));
	colors.push(color(102, 0, 102, alfa));
	colors.push(color(102, 0, 0, alfa));
	colors.push(color(255, 230, 153, alfa));
	colors.push(color(179, 255, 153, alfa));
	colors.push(color(255, 179, 153, alfa));
}

function draw() {
	// background(255, 255, 255, 20);
	background(255);

	for (let i = 0; i < worlds.length - 1; i++) {
		const wi = worlds[i];
		for (let j = i + 1; j < worlds.length; j++) {
			const wj = worlds[j];
			let force = wi.computeForceFrom(wj);
			wi.applyForce(force);
			force = wj.computeForceFrom(wi);
			wj.applyForce(force);

			// console.log(wi, wj);
		}
	}

	for (let world of worlds) {
		world.update();
		world.draw();
	}
}

function mousePressed() {
	// also responds to touch events in smartphones
	worlds.push(new World(mouseX, mouseY, 20, random(colors)));

	return false; // to avoid default browser behaviour
}