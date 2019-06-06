const step = 1;
const mutateStep = 1;

class Chicken {
	constructor(lifespan) {
		this.chickenRadius = 5;

		this.x = width / 2;
		this.y = height - this.chickenRadius - 5;

		this.movings = [];
		if (lifespan) {
			let xVel = random(-step, step);
			let yVel = random(-step, step);
			for (let i = 0; i < lifespan; i++) {
				this.movings[i] = createVector(
					xVel, yVel);
			}
		}

		this.alive = true;
		this.topreached = false;
		this.maxcrossed = Number.MAX_VALUE; // the max the crossing the min the y
	}

	update(age) {
		if (this.alive && !this.topreached) {
			this.x += this.movings[age].x;
			this.y += this.movings[age].y;

			// if (this.y < this.maxcrossed) {
			this.maxcrossed = height - this.y
			// }

			if (this.x - this.chickenRadius < 0
				|| this.x + this.chickenRadius > width
				// || this.y + this.chickenRadius <= 0
				|| this.y + this.chickenRadius - 30 > height // die below the bottom border to not look ugly
			) {
				this.kill();
			}

			if (this.y - this.chickenRadius <= 0) {
				this.success();
				this.y = this.chickenRadius / 2;
			}
		}

		return this.alive;
	}

	draw() {
		if (this.topreached) {
			fill('green');
		} else if (this.alive) {
			fill('yellow');
		} else {
			fill('purple');
		}
		noStroke();
		// rect(this.x, this.y, 20, 20);
		ellipse(this.x, this.y, 2 * this.chickenRadius);
	}

	kill() {
		this.alive = false;
	}

	success() {
		this.topreached = true;
	}

	clone() {
		const chicken = new Chicken();

		chicken.chickenRadius = this.chickenRadius;

		chicken.x = width / 2;
		chicken.y = height - this.chickenRadius;

		chicken.movings = [];
		for (let i = 0; i < this.movings.length; i++) {
			const v = this.movings[i];
			chicken.movings[i] = createVector(v.x, v.y);
		}

		chicken.alive = true;
		chicken.maxcrossed = 0;

		return chicken;
	}

	mutate(mutationRatio) {
		for (let i = 0; i < this.movings.length; i++) {
			if (random(1) <= mutationRatio) {
				this.movings[i] = this.movings[i].add(
					createVector(
						random(-mutateStep, mutateStep),
						random(-mutateStep, mutateStep))
				);
			}
		}
	}

	merge(chicken) {
		const firstHalf = this.movings.slice(
			0, this.movings.length / 2);
		const secondHalf = chicken.movings.slice(
			chicken.movings.length / 2, chicken.movings.length);
		this.movings = firstHalf.concat(secondHalf);
	}
}