let sparkle_id = 0;

function getRandomInt(max) { return Math.floor(Math.random() * max); }
function getRandomIntCentered(max) { return Math.floor(Math.random() * max) - (Math.floor(max/2)); }

function sparkle_move(id) {
	let sparkle = document.getElementById("sparkle_" + id);
	sparkle.style.top = (size/2-6 + getRandomIntCentered(200)) + "px";
	sparkle.style.left = (size/2-6 + getRandomIntCentered(200)) + "px";
}
function sparkle_opacity(id) {
	let sparkle = document.getElementById("sparkle_" + id);
	sparkle.style.opacity = "0";
}
function sparkle_delete(id) {
	let sparkle = document.getElementById("sparkle_" + id);
	sparkle.remove();
}

function sparkle(x, y) {
	let i;
	let sparkle;
	bloc = document.getElementById("b_" + x + "_" + y);
	for(i = 0 ; i < 16 ; i++) {
		sparkle = document.createElement("div");
		sparkle.className = "sparkle";
		sparkle.id = "sparkle_" + sparkle_id;
		sparkle.style.top = (size/2-3) + "px";
		sparkle.style.left = (size/2-3) + "px";
		sparkle.style.background = "rgb("+getRandomInt(256)+",255,"+getRandomInt(256)+")";
		bloc.append(sparkle);
		setTimeout( sparkle_move, 50, sparkle_id);
		setTimeout( sparkle_opacity, 410, sparkle_id);
		setTimeout( sparkle_delete, 810, sparkle_id);
		sparkle_id = sparkle_id+1 % 1024;
	}
}

function blink(x, y) {
	let bloc3 = document.getElementById("b2_" + x + "_" + y);
	if(!bloc3) {
		bloc = document.getElementById("b_" + x + "_" + y);
		let bloc2 = document.createElement("div");
		bloc2.id = "b2_" + x + "_" + y;
		bloc2.className = "bloc_blink";
		bloc.append(bloc2);
		bloc2.style.opacity = "1";
		setTimeout( function() {
			let bloc3 = document.getElementById("b2_" + x + "_" + y);
			bloc3.style.opacity = "0";
		}, 10);
		setTimeout( function() {
			let bloc3 = document.getElementById("b2_" + x + "_" + y);
			bloc3.remove();
		}, 510);
	}	
}

function map_shake(deg) {
	document.getElementById("map").style.rotate = deg + "deg";
}