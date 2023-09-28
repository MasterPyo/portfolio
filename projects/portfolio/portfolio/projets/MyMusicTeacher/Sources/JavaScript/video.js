

//------------------------ ENLEVER LES "idPlayer" PARTOUT, CA SERT A RIEN ---------------- */

/**
 * play :
 * 		Démarre la vidéo
 */
function play(idPlayer) {
	if(auditionner == false) {
		var player = document.querySelector('#videoPlayer');
		player.play();
	}
}

/**
 * pause :
 * 		Mets en pause la vidéo
 */
function pause(idPlayer) {
	if(auditionner == false) {
		var player = document.querySelector('#videoPlayer');
		player.pause();		
	}
}

/**
 * move :
 * 		Déplace la position de la vidéo
 */
function move(idPlayer, time) {
	if(auditionner == false && !accordeur) {
		var player = document.querySelector('#videoPlayer');
	    player.currentTime = time;
	}
}
