let temps = 0;

function update_timer() {
	document.querySelector("header h1").innerHTML = Math.floor((new Date().getTime() - temps)/10)/100;
}