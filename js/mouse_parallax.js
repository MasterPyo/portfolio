
newX = (window.innerWidth/2)/16;
newY = (window.innerHeight/2)/16;
/*if(window.innerWidth > 1400) {
	newX += (window.innerWidth-1400)/2;
}*/
if(window.innerWidth < 992) {// plus petit que tablette ou PC
	newX = 0;
	newY = 0;
}

document.body.addEventListener('mousemove', (event) => {
	if(parallax) {
		// récupère la position de la souris et positionne le container
		newY = -(event.clientY - window.innerHeight/2)/16;
		newX = -(event.clientX - window.innerWidth/2)/16;
		// centre le container si il n'est pas plein sur la page
		/*if(window.innerWidth > 1400) {
			newX += (window.innerWidth-1400)/2;
		}*/
		if(window.innerWidth < 992) {// plus petit que tablette ou PC
			newX = 0;
			newY = 0;
		}
	}
});