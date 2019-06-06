let cars = [];
let population = [];
const popSize = 30; // multiply of 3
let age = 0;
let generation = 1;
const lifeSpan = 600;
const mutationRatio = 0.4;
let pAge;
let pGen;

function setup() {
	createCanvas(300, 300);

	pGen = createP();
	pAge = createP();

	initCars();

	for (let i = 0; i < popSize; i++) {
		population.push(new Chicken(lifeSpan));
	}
}

function draw() {
	background(255);

	for (chicken of population) {
		chicken.update(age);
		chicken.draw();
	}

	for (car of cars) {
		car.update();
		car.draw();

		car.runover(population);
	}

	let ended = 0;
	let dead = 0;
	for (let chicken of population) {
		if (chicken.topreached) {
			ended++;
		} else if (!chicken.alive) {
			dead++;
		}
	}

	if (ended == 0 && (++age >= lifeSpan || dead == popSize)) {
		age = 0;
		generation++;
		initCars();

		const takeTheBests = selecttakeTheBests();

		let champion = merge(takeTheBests[0], takeTheBests[1]);
		let champion2 = merge(takeTheBests[2], takeTheBests[3]);
		let champion3 = merge(takeTheBests[4], takeTheBests[5]);

		let i = 0
		for (; i < popSize / 3; i++) {
			generate(champion, i);
		}

		for (; i < 2 * popSize / 3; i++) {
			generate(champion2, i);
		}

		for (; i < popSize; i++) {
			generate(champion3, i);
		}
	}

	pGen.html('Generation: ' + generation);

	if (ended == 0) {
		pAge.html('Iteration: ' + (lifeSpan - age));
	} else {
		console.log();
		pAge.html(ended + (ended > 1 ? ' CHICKENS' : ' CHICKEN') + ' CROSSED THE ROAD!');
	}
}

function generate(parent, i) {
	if (population[i].alive
		&& (population[i].y - population[i].chickenRadius <= 0)) {
		noLoop();
	}

	population[i] = parent.clone();
	population[i].mutate(mutationRatio);
}

function merge(first, second) {
	const champion = first.clone();
	first.merge(second);
	return champion;
}

function selecttakeTheBests() {
	population.sort((a, b) => b.maxcrossed - a.maxcrossed);

	return population.slice(0, 6);
}

function initCars() {
	cars = [];
	cars.push(new Car(0, 20, 5, 0));
	cars.push(new Car(0, 80, 4, 0));
	cars.push(new Car(0, 120, 2, 0));
	cars.push(new Car(0, 220, 6, 0));
	cars.push(new Car(0, 280, 1, 0));
	cars.push(new Car(0, 320, 3, 0));
}