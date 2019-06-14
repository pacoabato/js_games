const step = 1;
const mutateStep = 5;

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

			// for (let i = 0; i < lifespan; i++) {
			// 	this.movings[i] = createVector(
			// 		random(-step, step), random(-step, step));
			// }
		}

		this.alive = true;
		this.topreached = false;
		this.maxcrossed = 0;

		this.walkedpath = []
		this.walkedpath.push(this.x, this.y);
	}

	update(age) {
		if (this.alive && !this.topreached) {
			this.x += this.movings[age].x;
			this.y += this.movings[age].y;
			this.walkedpath.push([this.x, this.y]);

			// if (this.y < this.maxcrossed) {
			this.maxcrossed = height - this.y;
			// }

			if (this.maxcrossed < 0) {
				this.maxcrossed = 10;
			}

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

	draw(showPath) {
		if (showPath && this.alive) {
			strokeWeight(1);

			let pathColor = color('black');

			// if (!this.alive) {
			// 	pathColor = color('purple');
			// }

			pathColor.setAlpha(50);
			stroke(pathColor);

			for (let i = 0; i < this.walkedpath.length - 1; i++) {
				line(this.walkedpath[i][0], this.walkedpath[i][1],
					this.walkedpath[i + 1][0], this.walkedpath[i + 1][1])
			}
		}

		// draw the chicken
		strokeWeight(1);
		stroke(0, 0, 0);

		if (this.topreached) {
			fill('green');
		} else if (this.alive) {
			fill('yellow');
		} else {
			fill('purple');
		}

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
		// chicken.maxcrossed = 0;
		chicken.maxcrossed = this.maxcrossed;

		return chicken;
	}

	mutate(mutationRatio) {
		for (let i = 0; i < this.movings.length; i++) {
			if (random(1) <= mutationRatio) {
				this.movings[i] =
					createVector(
						random(-mutateStep, mutateStep),
						random(-mutateStep, mutateStep)
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

		this.maxcrossed = (this.maxcrossed + chicken.maxcrossed) / 2;
	}
}