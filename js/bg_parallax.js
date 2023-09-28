

document.body.onscroll = bg_parallax;

function bg_parallax() {
	document.body.style.backgroundPositionY = -window.scrollY/12 + "px";
}