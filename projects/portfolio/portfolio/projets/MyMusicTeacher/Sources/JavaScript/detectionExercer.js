/**
 * detectionExercer.js
 * Module de détection de note simple adapté au mode exercé
 * @author Arnaud Steinmetz
 */

 /// =====================================================
 /// SOMMAIRE : 
 /// 1) Initialisation
 /// 2) Détection 
 /// 3) Analyse
 /// =====================================================

//Variables 
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
var sourceNode = null;
var analyser = null;
var theBuffer = null;
var audioStream;
var mediaStreamSource;

var rafID = null;
var buflen = 2048;
var buf = new Uint8Array( buflen );

var microphoneActif = false;
var transitionEnCours = false;

/// =====================================================
/// INITIALISATION
/// =====================================================
window.onload = function() {
	toggleLiveInput();
}

/* Fonction affichant une erreur s'il est impossible d'accéder au microphone */
function error() {
	microphoneActif = false;
    alert('Veuillez activer votre microphone');
}

/* Fonction demandant l'accès au microphone */
function toggleLiveInput() {
    getUserMedia({audio:true}, gotStream);
}

function getUserMedia(dictionary, callback) {
    try {
       	 navigator.getUserMedia = 
        	navigator.getUserMedia ||
        	navigator.webkitGetUserMedia ||
        	navigator.mozGetUserMedia;
        	navigator.getUserMedia(dictionary, callback, error);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }
}

function gotStream(stream) {
    //Création d'un audioNode à partir du flux
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    audioStream = stream;
    
    // Connexion à la destination
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    mediaStreamSource.connect(analyser);

    microphoneActif = true;
    if(jeu_en_cours)
    {
    	updatePitch(); //Démarrage de la détection
    }	
}

/// =====================================================
/// Détection
/// =====================================================

/**
 * Fontion issue de pitchDetect, permettant d'obtenir une fréquence à partir d'un buffer contenant le flux audio
 * @param  {string} buf    		buffer contenant le flux audio
 * @param  {string} sampleRate 	taux d'échantillonnage
 * @return {int} 				fréquence
 */
function autoCorrelate( buf, sampleRate ) {
	var MIN_SAMPLES = 4;	// corresponds to an 11kHz signal
	var MAX_SAMPLES = 1000; // corresponds to a 44Hz signal
	var SIZE = 1000;
	var best_offset = -1;
	var best_correlation = 0;
	var rms = 0;
	var foundGoodCorrelation = false;

	if (buf.length < (SIZE + MAX_SAMPLES - MIN_SAMPLES))
		return -1;  // Not enough data

	for (var i=0;i<SIZE;i++) {
		var val = (buf[i] - 128)/128;
		rms += val*val;
	}
	rms = Math.sqrt(rms/SIZE);
	if (rms<0.01)
		return -1;

	var lastCorrelation=1;
	for (var offset = MIN_SAMPLES; offset <= MAX_SAMPLES; offset++) {
		var correlation = 0;

		for (var i=0; i<SIZE; i++) {
			correlation += Math.abs(((buf[i] - 128)/128)-((buf[i+offset] - 128)/128));
		}
		correlation = 1 - (correlation/SIZE);
		if ((correlation>0.9) && (correlation > lastCorrelation))
			foundGoodCorrelation = true;
		else if (foundGoodCorrelation) {
			// short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
			return sampleRate/best_offset;
		}
		lastCorrelation = correlation;
		if (correlation > best_correlation) {
			best_correlation = correlation;
			best_offset = offset;
		}
	}
	if (best_correlation > 0.01) {
		return sampleRate/best_offset;
	}
	return -1;
}

/// =====================================================
/// ANALYSE
/// =====================================================


/** 
 * Procédure appelée récursivement pour calculer et mettre à jour la note détectée.
 */ 
function updatePitch() {
	analyser.getByteTimeDomainData( buf ); 					//Récupération du son dans un buffer
	var ac = autoCorrelate(buf, audioContext.sampleRate );	//Appel de la méthode autoCorrelate renvoyant un nombre représentant la fréquence jouée
	noteJouee = hauteurEnNote(ac); 							//Appel de la fonction qui convertit la fréquence en note
	afficherNoteJouee(noteJouee);							//Appel de la fonction mettant à jour de l'affichage de la note jouée
	if(!accordeur)
	{
		actualiserComparaison();								//Appel de la fonction comparant la note jouée et la note attendue
	}

	//Dans le mode accordeur modifie les commentaires
	if(accordeur && jeu_en_cours)
	{
		if(ac < 1000 && ac > 1)
		{
			if(ac > (noteEnHauteur(obtenirNoteAttendue()[0]) *1.0025+0.1))
			{
				document.getElementById("commentaire").innerHTML = "déserrez votre corde";
			}
			else if(ac < (noteEnHauteur(obtenirNoteAttendue()[0]) *0.9975-0.1))
			{
					document.getElementById("commentaire").innerHTML = "Serrez votre corde";
			}
			else if(ac > (noteEnHauteur(obtenirNoteAttendue()[0])*0.9975-0.1) && ac < (noteEnHauteur(obtenirNoteAttendue()[0]) *1.0025 +0.1))
			{
				document.getElementById("commentaire").innerHTML = "Corde accordé !";
				NoteSuivante();
				ColorierNote(position_indice-1, true);
			}
		}	
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = window.webkitRequestAnimationFrame;
	
	//Tant que le jeu est en cour, et qu'il n'y a pas de transition en cour, rappelle updatePitch récursivement
	if(jeu_en_cours && !transitionEnCours)
	{
		rafID = window.requestAnimationFrame(updatePitch);
	}
}

/*
* Procédure permettant d'arrêter l'enregistrement et l'analyse du son
*/
function finDetection()
{
	if(audioStream) audioStream.stop();
	if(sourceNode) sourceNode.disconnect();
}
