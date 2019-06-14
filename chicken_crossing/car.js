class Car {
	constructor(x, y, velx) {
		this.x = x;
		this.y = y;
		this.velx = velx;
		this.carRadius = 10;
	}

	update() {
		this.x += this.velx;

		if (this.x - 20 >= width) {
			this.x = -20;
		}


	}

	draw() {
		fill(200, 0, 0);
		ellipse(this.x, this.y, 4 * this.carRadius, 2 * this.carRadius);
	}

	runover(population) {
		for (let chicken of population) {
			// modeling cars as two circles to detect collisions:
			// first circle centered at x - radius
			if (dist(this.x - this.carRadius, this.y, chicken.x, chicken.y) <=
				this.carRadius + chicken.chickenRadius) {
				chicken.kill();
			}

			// second circle centered at x + radius
			if (dist(this.x + this.carRadius, this.y, chicken.x, chicken.y) <=
				this.carRadius + chicken.chickenRadius) {
				chicken.kill();
			}
		}
	}
}