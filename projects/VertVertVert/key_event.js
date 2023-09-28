// CONSTANTS
const UP = 0, RIGHT = 1, DOWN = 2, LEFT = 3;

// Key event
document.onkeydown = checkKey;
function checkKey(e) {

	let has_moved = false;
	let move = true;
	let dir = -1;
	let nb = 0;

	e = e || window.event;
	if 		(e.keyCode == '38') { dir = UP; }
	else if (e.keyCode == '39') { dir = RIGHT; }
	else if (e.keyCode == '40') { dir = DOWN; }
	else if (e.keyCode == '37') { dir = LEFT; }
	
	while(move) {
		if 		(dir == -1) 	{ move = false; }
		else if (dir == UP) 	{ if(check_UP() && getTile_UP() != "█") 		{ p_y--; nb++; } else { move = false; } }
		else if (dir == RIGHT) 	{ if(check_RIGHT() && getTile_RIGHT() != "█") 	{ p_x++; nb++; } else { move = false; } }
		else if (dir == DOWN) 	{ if(check_DOWN() && getTile_DOWN() != "█") 	{ p_y++; nb++; } else { move = false; } }
		else if (dir == LEFT) 	{ if(check_LEFT() && getTile_LEFT() != "█") 	{ p_x--; nb++; } else { move = false; } }

		// New tile
		if(getTile_PLAYER() == ".") {
			setTile_PLAYER("v");
			document.getElementById("b_" + p_x + "_" + p_y).style.background = "#8f8";
			blink(p_x, p_y);
			sparkle(p_x, p_y);
			total--;
		}
		// Already visited tile
		else if(getTile_PLAYER() == "v") {
			blink(p_x, p_y);
		}

		// Start timer if moving
		if(status == "waiting" && nb > 0) {
			status = "playing";
			temps = new Date().getTime();
		}

		// Go to next level if done
		if(total == 0) {
			status = "completed";
			document.getElementById("map").style.opacity = "0";
			total = -1;
			current_map++;
			setTimeout( load_map, 1100, current_map);
		}
	}

	// Update player position inside map
	document.getElementById("player").style.left = p_x*size + "px";
	document.getElementById("player").style.top = p_y*size + "px";

	// Update shadow-fog
	document.getElementById("shadow").style.left = (p_x-(shadow_size/2))*size + "px";
	document.getElementById("shadow").style.top = (p_y-(shadow_size/2))*size + "px";

	// Update map position (to center player on screen)
	document.getElementById("map").style.left = (window.innerWidth-size)/2 - p_x*size + "px";
	document.getElementById("map").style.top = (window.innerHeight-size)/2 - p_y*size + "px";

	// Shake effect if player has moved
	if(nb > 0) {
		setTimeout( map_shake, 100, 1);
		setTimeout( map_shake, 110, 0);
		setTimeout( map_shake, 120, -1);
		setTimeout( map_shake, 130, 0);
	}

}

