var worldDimension = 100; // e.g. 100 is for 100x100
var canvas0Div = null;
var canvas1Div = null;
var buffer = new Array();
var array0 = new Array(); //array of cells
var array1 = new Array();
var bufferActive = 0;
var timeBetweenCicles = 300;

function init() {
	canvas0Div = $('canvas0');
	canvas1Div = $('canvas1');
	buffer[0] = array0;
	buffer[1] = array1;

	$R(0, worldDimension - 1).each(function (row) {
		array0[row] = new Array();
		array1[row] = new Array();
		var newRow0 = document.createElement('div');
		newRow0.className = 'row';
		var newRow1 = document.createElement('div');
		newRow1.className = 'row';

		canvas0Div.appendChild(newRow0);
		canvas1Div.appendChild(newRow1);

		$R(0, worldDimension - 1).each(function (col) {

			var newCell = document.createElement('div');

			if (Math.random() < 0.1) { // 10% are alive at startup
				newCell.className = 'cellAlive';
			} else {
				newCell.className = 'cell';
			}

			newCell.observe('click', function (event) {
				var cell = Event.element(event);
				if (cell.className == 'cell') {
					cell.className = 'cellAlive';
				} else {
					cell.className = 'cell';
				}
			});

			var clon = copyCell(newCell);
			clon.observe('click', function (event) {
				var cell = Event.element(event);
				if (cell.className == 'cell') {
					cell.className = 'cellAlive';
				} else {
					cell.className = 'cell';
				}
			});

			newRow0.appendChild(newCell);
			newRow1.appendChild(clon);

			array0[row][col] = newCell;
			array1[row][col] = clon;
		});
	});
	setInterval(live, timeBetweenCicles);
}

function live() {

	evalLeftTopCorner();
	evalRightTopCorner();
	evalLeftBottomCorner();
	evalRightBottomCorner();
	evalFirstRow();
	evalLastRow();
	evalFirstColumm();
	evalLastColumm();

	var col = 1;
	var row = 1;

	for (; row <= worldDimension - 2; row++) {
		for (col = 1; col <= worldDimension - 2; col++) {
			evalCell(row, col);
			//console.log(row + " " + col);
		}
	}

	interchangeBuffer();
}

function evalLeftTopCorner() {
	var cell = buffer[bufferActive][0][0];
	var around = 0; // near alive cells
	if (buffer[bufferActive][0][1].className == 'cellAlive')
		around++;
	if (buffer[bufferActive][1][1].className == 'cellAlive')
		around++;
	if (buffer[bufferActive][1][0].className == 'cellAlive')
		around++;

	dieOrBorn(around, 0, 0);
}

function evalRightTopCorner() {
	var cell = buffer[bufferActive][0][worldDimension - 1];
	var around = 0; // near alive cells
	if (buffer[bufferActive][0][worldDimension - 2].className == 'cellAlive')
		around++;
	if (buffer[bufferActive][1][worldDimension - 2].className == 'cellAlive')
		around++;
	if (buffer[bufferActive][1][worldDimension - 1].className == 'cellAlive')
		around++;

	dieOrBorn(around, 0, worldDimension - 1);
}

function evalLeftBottomCorner() {
	var cell = buffer[bufferActive][worldDimension - 1][0];
	var around = 0; // near alive cells
	if (buffer[bufferActive][worldDimension - 2][0].className == 'cellAlive')
		around++;
	if (buffer[bufferActive][worldDimension - 2][1].className == 'cellAlive')
		around++;
	if (buffer[bufferActive][worldDimension - 1][1].className == 'cellAlive')
		around++;

	dieOrBorn(around, worldDimension - 1, 0);
}

function evalRightBottomCorner() {
	var cell = buffer[bufferActive][worldDimension - 1][worldDimension - 1];
	var around = 0; // near alive cells
	if (buffer[bufferActive][worldDimension - 2][worldDimension - 1].className == 'cellAlive')
		around++;
	if (buffer[bufferActive][worldDimension - 2][worldDimension - 2].className == 'cellAlive')
		around++;
	if (buffer[bufferActive][worldDimension - 1][worldDimension - 2].className == 'cellAlive')
		around++;

	dieOrBorn(around, worldDimension - 1, worldDimension - 1);
}

function evalFirstRow() {
	$R(1, worldDimension - 2).each(function (col) {
		var cell = buffer[bufferActive][0][col];
		var around = 0; // near alive cells

		if (buffer[bufferActive][0][col - 1].className == 'cellAlive')
			around++;
		if (buffer[bufferActive][1][col - 1].className == 'cellAlive')
			around++;
		if (buffer[bufferActive][1][col].className == 'cellAlive')
			around++;
		if (buffer[bufferActive][1][col + 1].className == 'cellAlive')
			around++;
		if (buffer[bufferActive][0][col + 1].className == 'cellAlive')
			around++;

		dieOrBorn(around, 0, col);
	});
}

function evalLastRow() {
	$R(1, worldDimension - 2).each(function (col) {
		var cell = buffer[bufferActive][worldDimension - 1][col];
		var around = 0; // near alive cells

		if (buffer[bufferActive][worldDimension - 1][col - 1].className == 'cellAlive')
			around++;
		if (buffer[bufferActive][worldDimension - 2][col - 1].className == 'cellAlive')
			around++;
		if (buffer[bufferActive][worldDimension - 2][col].className == 'cellAlive')
			around++;
		if (buffer[bufferActive][worldDimension - 2][col + 1].className == 'cellAlive')
			around++;
		if (buffer[bufferActive][worldDimension - 1][col + 1].className == 'cellAlive')
			around++;

		dieOrBorn(around, worldDimension - 1, col);
	});
}

function evalFirstColumm() {
	$R(1, worldDimension - 2).each(function (row) {
		var cell = buffer[bufferActive][row][0];
		var around = 0; // near alive cells

		if (buffer[bufferActive][row - 1][0].className == 'cellAlive')
			around++;
		if (buffer[bufferActive][row - 1][1].className == 'cellAlive')
			around++;
		if (buffer[bufferActive][row][1].className == 'cellAlive')
			around++;
		if (buffer[bufferActive][row + 1][1].className == 'cellAlive')
			around++;
		if (buffer[bufferActive][row + 1][0].className == 'cellAlive')
			around++;

		dieOrBorn(around, row, 0);
	});
}

function evalLastColumm() {
	$R(1, worldDimension - 2).each(function (row) {
		var cell = buffer[bufferActive][row][worldDimension - 1];
		var around = 0; // near alive cells

		if (buffer[bufferActive][row - 1][worldDimension - 1].className == 'cellAlive')
			around++;
		if (buffer[bufferActive][row - 1][worldDimension - 2].className == 'cellAlive')
			around++;
		if (buffer[bufferActive][row][worldDimension - 2].className == 'cellAlive')
			around++;
		if (buffer[bufferActive][row + 1][worldDimension - 2].className == 'cellAlive')
			around++;
		if (buffer[bufferActive][row + 1][worldDimension - 1].className == 'cellAlive')
			around++;

		dieOrBorn(around, row, worldDimension - 1);
	});
}

function evalCell(row, col) {
	var cell = buffer[bufferActive][row][col];
	var around = 0; // near alive cells

	if (buffer[bufferActive][row - 1][col - 1].className == 'cellAlive')
		around++;
	if (buffer[bufferActive][row - 1][col].className == 'cellAlive')
		around++;
	if (buffer[bufferActive][row - 1][col + 1].className == 'cellAlive')
		around++;
	if (buffer[bufferActive][row][col + 1].className == 'cellAlive')
		around++;
	if (buffer[bufferActive][row + 1][col + 1].className == 'cellAlive')
		around++;
	if (buffer[bufferActive][row + 1][col].className == 'cellAlive')
		around++;
	if (buffer[bufferActive][row + 1][col - 1].className == 'cellAlive')
		around++;
	if (buffer[bufferActive][row][col - 1].className == 'cellAlive')
		around++;

	dieOrBorn(around, row, col);
}

function dieOrBorn(around, row, col) {
	var buffInact = bufferInactive();

	if (buffer[bufferActive][row][col].className == 'cell') {
		if (around == 3) { // if dead and 3 living neighbours
			buffer[buffInact][row][col].className = 'cellAlive'; // it reborns
		} else {
			buffer[buffInact][row][col].className = 'cell'; // keeps dead
		}
	} else if (buffer[bufferActive][row][col].className == 'cellAlive') { // if alive
		if (around < 2 || around > 3) { // and less than 2 or more than 3 alive neighbours
			buffer[buffInact][row][col].className = 'cell'; // it dies
		} else {
			buffer[buffInact][row][col].className = 'cellAlive'; // keeps alive
		}
	}
}

function copyCell(cell) {
	var clone = document.createElement('div');
	clone.className = cell.className;
	return clone;
	//	var clon= document.createElement('div');
	//	clon.setAttribute('className', cell.className);
	//	return clon;
}

function interchangeBuffer() {

	if (bufferActive) { //1
		canvas0Div.setStyle({ display: 'block' });
		canvas1Div.setStyle({ display: 'none' });
	} else { //0
		canvas1Div.setStyle({ display: 'block' });
		canvas0Div.setStyle({ display: 'none' });
	}

	bufferActive = bufferInactive();
}

function bufferInactive() {
	//	return= (bufferActive+1)%2;
	return bufferActive ? 0 : 1;
}
