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

//Variables utilisés pour l'analyse du son
var noteDeReference = ""; 
var detectionNbNoteJouee = 0;
var detectionNbNoteJuste = 0;
var detectionNbNoteAjouee = 5;

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
    updatePitch();	//Démarrage de la détection
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
	analyser.getByteTimeDomainData( buf );					//récupération des notes jouées dans un buffer
	var ac = autoCorrelate(buf, audioContext.sampleRate ); 	//Appel de la méthode autoCorrelate renvoyant un nombre représentant la fréquence jouée
	noteJouee = hauteurEnNote(ac);							//Appel de la fonction qui convertit la fréquence en note
	
	if(noteJouee != "-") // ATTENTION
	{
		if(detectionNbNoteJouee == 0)
		{
			noteDeReference = noteJouee;
			detectionNbNoteJouee++;

		}
		if(detectionNbNoteJouee < detectionNbNoteAjouee)
		{
			detectionNbNoteJouee++;
			if(noteJouee == noteDeReference)
			{
				detectionNbNoteJuste++;
			}
		}
		if (detectionNbNoteJouee == detectionNbNoteAjouee)
		{		
			if ((detectionNbNoteJuste/detectionNbNoteJouee) > 0.1) 
			{
				afficherNoteJouee(noteDeReference);
			}
			detectionNbNoteJouee = 0;
			detectionNbNoteJuste = 0;
		}
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = window.webkitRequestAnimationFrame;
	
	//Tant que le jeu est en cour, appelle récursivement de updatePitch
	if(jeu_en_cours)
	{
		rafID = window.requestAnimationFrame(updatePitch);
	}
	else if(!jeu_en_cours) {
		afficherNoteJouee("-");
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
