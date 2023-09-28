// CONSTANTS 
const MAP_W = 0, MAP_H = 1, MAP_PX = 2, MAP_PY = 3, MAP = 4;

// Variables
let map_data, map_w, map_h, shadow_size, size = 48, p_x, p_y, total, current_map = 0, status = "waiting";

function getTile(x, y) 			{ return map_data[MAP][(y)*map_w+x]; }
function setTile(x, y, tile) 	{ map_data[MAP][(y)*map_w+x] = tile; }

function getTile_UP() 			{ return getTile(p_x, p_y-1); }
function getTile_RIGHT() 		{ return getTile(p_x+1, p_y); }
function getTile_DOWN() 		{ return getTile(p_x, p_y+1); }
function getTile_LEFT() 		{ return getTile(p_x-1, p_y); }
function getTile_PLAYER() 		{ return getTile(p_x, p_y); }
function setTile_PLAYER(tile) 	{ setTile(p_x, p_y, tile); }

function check_UP() 			{ return p_y > 0; }
function check_RIGHT() 			{ return p_x < map_w-1; }
function check_DOWN() 			{ return p_y < map_h-1; }
function check_LEFT() 			{ return p_x > 0; }

function create_element(tag, id, className, width, height, left, top) {
	let b = document.createElement(tag);
	if(id != "") { b.id = id; }
	if(className != "") { b.className = className; }
	b.style.width = width + "px";
	b.style.height = height + "px";
	b.style.left = left + "px";
	b.style.top = top + "px";
	return b;
}

function load_map(n) {

	// Update variables
	status = "waiting";
	if(n < 0 || n > data.length) {
		return 0;
	}
	total = 0;
	map_data = data[n];
	map_w = map_data[MAP_W];
	map_h = map_data[MAP_H];
	shadow_size = Math.max(map_w, map_h)*2;
	p_x = map_data[MAP_PX];
	p_y = map_data[MAP_PY];

	// Reset the map HTML container
	let map = document.getElementById("map");
	map.innerHTML = "";
	map.style.width = (size*map_w) + "px";
	map.style.height = (size*map_h) + "px";
	map.style.opacity = "1";

	// Generate gray blocs
	let i, j;
	for(j = 0 ; j < map_h ; j++) {
		for(i = 0 ; i < map_w ; i++) {
			if(getTile(i, j) == ".") {
				total++;
				map.append(create_element("div", "b_" + i + "_" + j, "bloc", size, size, i*size, j*size));
			}
		}
	}

	// Generate player
	map.append(create_element("div", "player", "", size, size, p_x*size, p_y*size));

	// Generate shadow-fog
	let s = size*(shadow_size+1);
	map.append(create_element("div", "shadow", "", s, s, (p_x-(shadow_size/2))*size, (p_y-(shadow_size/2))*size));

	// Update once map, by sending a NULL key event
	checkKey(-1); 

}
