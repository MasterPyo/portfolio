function toggle_light_theme() {
	document.body.classList.toggle("slow_transition");
	document.body.classList.toggle("light_theme");
	if(theme == "dark") {
		theme = "light";
	}
	else {
		theme = "dark";
	}
	localStorage.setItem("theme", theme);
	setTimeout(function(){
		document.body.classList.toggle("slow_transition");
	}, 500);
}



let theme = localStorage.getItem("theme");
if(theme === null) {
	theme = "dark";
}
else if(theme == "light") {
	document.body.classList.toggle("light_theme");
	document.querySelector("#theme input").checked = false;
}


document.querySelector("#theme input").onchange = toggle_light_theme;