class World {
	constructor(x, y, mass, color) {
		this.pos = createVector(x, y);
		this.vel = createVector(0, 0);
		this.radius = mass;
		this.mass = mass;
		this.g = 0.0001; // simulation of gravitational universal constant
		this.trayectory = [];
		this.color = color;
	}

	draw() {
		fill(this.color);
		strokeWeight(2);
		stroke(this.color);
		ellipse(this.pos.x, this.pos.y, this.radius * 2);

		for (let i = 0; i < this.trayectory.length - 1; i++) {
			const posi = this.trayectory[i];
			const posj = this.trayectory[i + 1];

			this.color.setAlpha(i * 2);
			stroke(this.color);
			line(posi.x, posi.y, posj.x, posj.y);
		}
		this.color.setAlpha(50);

	}

	update() {
		this.trayectory.push(createVector(this.pos.x, this.pos.y));
		if (this.trayectory.length > 100) {
			this.trayectory.shift();
		}
		this.pos = this.pos.add(this.vel);
	}

	computeForceFrom(world) {
		const dVector = p5.Vector.sub(world.pos, this.pos);
		const d = dVector.mag();
		const dUnit = dVector.normalize();
		const forceMagnitude = this.g * this.mass * world.mass / d * d;
		const force = dUnit.mult(forceMagnitude);
		return force;
	}

	applyForce(force) {
		this.vel = this.vel.add(force);
	}
}