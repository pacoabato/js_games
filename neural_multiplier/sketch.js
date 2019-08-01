
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let maxValue;
let nn;
let column;
const columnWidth = 1;

let statsAcum = 0;
let lastStat = 0;

let logEntries = [];

const operationSymbol = '*'; // only works for + and *

function func_(a, b) {
	return eval('a' + operationSymbol + 'b');
}

function setup() {
	createCanvas(700, 300);

	maxValue = max(numbers);

	nn = new NeuralNetwork(numbers.length * 2, 16, func_(maxValue, maxValue));
	column = 100;

	background(255);
}

function draw() {
	let inputs;
	let targets;

	for (let i = 0; i < 40; i++) {
		let a = random(numbers);
		let b = random(numbers);
		inputs = fillInputs(a, b, numbers.length);
		targets = fillTargets(func_(a, b), func_(maxValue, maxValue));

		nn.train(inputs, targets);
	}

	a = random(numbers);
	b = random(numbers);
	inputs = fillInputs(a, b, numbers.length);
	let res = nn.predict(inputs);
	let resTranslated = translateResult(res);

	noStroke();
	fill(180);

	let error = abs(func_(a, b) - resTranslated);
	rect(column, height - error * 2, columnWidth, error * 2);

	// smoothly clears graph in advance:
	fill(255, 255, 255, 20);
	rect(column + 20, 100, 80, height);

	// shows the log:
	if (frameCount % 75 == 0) {
		let t = a + operationSymbol + b + '=' + resTranslated;
		logEntries.unshift(t); // insert the first
		if (logEntries.length > 10) {
			logEntries.pop(); // removes the last
		}
	}
	// clears the log panel:
	fill('white');
	rect(0, 0, 100, height);
	// writes the log:
	noStroke();
	fill('black');
	textSize(20);
	let pos = 30;
	for (let t of logEntries) {
		text(t, 5, pos);
		pos = pos + 30;
	}
	// ends the log


	// shows errors stats:
	statsAcum += error;
	if (frameCount % 10 == 0) {
		let stats = statsAcum / 10;

		stroke('red');
		line(
			column - 10,
			height - lastStat * 2,
			column,
			height - stats * 2);

		fill(255, 0, 0, 100);
		noStroke();
		quad(
			column - 10, height,
			column - 10, height - lastStat * 2,
			column, height - stats * 2,
			column, height
		);

		lastStat = stats;
		statsAcum = 0;
	}

	column += columnWidth;

	if (column >= width) {
		column = 100;
		// clear the leftiest "band"
		fill(255);
		rect(100, 100, 80, height);
	}

}

// Creates an array with zeros and ones so the index of the ones points
// to a and b (for b the count starts after len/2):
//		inputs[a-1] == 1
//		inputs[len/2 + b-1] == 1
//		the rest of inputs filled with zeros
//	len is the maximum possible value of a or b, multiplied by 2 and
// will be the size of the returned array.
function fillInputs(a, b, len) {
	let inputs = [];

	let i = 1
	for (; i < a; i++) {
		inputs.push(0);
	}

	inputs.push(1);
	i++;

	for (; i <= len; i++) {
		inputs.push(0);
	}

	i = 1
	for (; i < b; i++) {
		inputs.push(0);
	}

	inputs.push(1);
	i++;

	for (; i <= len; i++) {
		inputs.push(0);
	}

	return inputs;
}

// Returns an array with length maxValue filled with zeroes
// and a one in the position of target-1.
//		targets[target-1] == 1
function fillTargets(target, maxValue) {
	let targets = [];

	let i = 1;
	for (; i < target; i++) {
		targets.push(0);
	}

	targets.push(1);
	i++;

	for (; i <= maxValue; i++) {
		targets.push(0);
	}

	return targets;
}

// Converts the neural network output (an array) to the numerical value.
function translateResult(res) {
	let maxIndex = 0;
	let maxValue = 0;
	for (let i = 0; i < res.length; i++) {
		if (res[i] > maxValue) {
			maxIndex = i;
			maxValue = res[i];
		}
	}
	return maxIndex + 1;
}