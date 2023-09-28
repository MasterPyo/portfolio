// global, main container
var main = document.querySelector("main");


// parralax, when mouse move
let posX = 0, posY = 0, newX = 0, newY = 0, parallax = 1;
/*if(window.innerWidth > 1400) {
	newX += (window.innerWidth-1400)/2;
}*/
if(window.innerWidth < 992) {// plus petit que tablette ou PC
	newX = 0;
	newY = 0;
}
main.style.position = "absolute";
main.style.marginLeft = "100vw";

// deplace le container à la position voulue
function update() {
	
	if(newX != posX || newY != posY) {
		posY = (posY*3 + newY)/4;
		posX = (posX*3 + newX)/4;
		if(Math.abs(posX-newX) < 1) { posX = newX; }
		if(Math.abs(posY-newY) < 1) { posY = newY; }
		main.style.top = posY + "px";
		main.style.left = posX + "px";	
	}
	// background eventually :
	//document.body.style.backgroundPositionY = -window.scrollY/12 + posY/12 + "px";
	//document.body.style.backgroundPositionX = posX/12 + "px";

}


setTimeout(function(){
	main.style.marginLeft = "0px"; 
	main.style.opacity = "1";
	setInterval(update, 10);
}, 100);


function closePage_and_open(url) {
	parallax = 0;
	newX = 0;
	newY = 0;
	//newY = 1200;
	main.style.marginLeft = "100vw";
	setTimeout(function(){
		main.style.marginLeft = "0px";
		window.location = url;
	}, 500, url);
}
