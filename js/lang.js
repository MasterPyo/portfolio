
function toggle_lang() {
	let lang = document.querySelector("html").getAttribute('lang');
	if(lang == "en") {
		lang = "fr";
	}
	else {
		lang = "en";
	}
	closePage_and_open("?lang=" + lang);
}

document.getElementById("lang").onclick = toggle_lang;


