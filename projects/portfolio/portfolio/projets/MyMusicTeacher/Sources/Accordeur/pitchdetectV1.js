window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext();
var sourceNode = null;
var analyser = null;
var theBuffer = null;
var audioStream;
var pitchElem;
var tendageElem;
var	noteElem;
var mediaStreamSource;
var selection = document.getElementById('first').options[document.getElementById('first').selectedIndex].value;


window.onload = function() {
	/*
	//définition de l'url du fichier audio
	var audioFileUrl = "./divagation.mp3";
	//création de la requete
	var request = new XMLHttpRequest();
	request.open("GET", audioFileUrl, true); 
	request.responseType = "arraybuffer";
	request.onload = function() {


	//extrait les informations de la requête http et le décode dans le buffer
	  audioContext.decodeAudioData(request.response, function(buffer) 
	  { 
	    	theBuffer = buffer;
		} );
	}
	request.send();

*/
	pitchElem = document.getElementById("pitch");
	noteElem = document.getElementById("note");
	tendageElem = document.getElementById("tendage");
}

function error() {
    alert('Stream generation failed.');
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
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    audioStream = stream;
    
    // Connect it to the destination.
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    mediaStreamSource.connect(analyser);

    updatePitch();
}

function toggleLiveInput() {
    getUserMedia({audio:true}, gotStream);
}

//note Anglophone 
function noteFromPitch( frequency ) {
	var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
	return Math.round( noteNum ) + 69;
}

function frequencyFromNoteNumber( note ) {
	return 440 * Math.pow(2,(note-69)/12);
}

/*
function centsOffFromPitch( frequency, note ) {
	return Math.floor( 1200 * Math.log( frequency / frequencyFromNoteNumber( note ))/Math.log(2) );
}
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
		// console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
		return sampleRate/best_offset;
	}
	return -1;
//	var best_frequency = sampleRate/best_offset;
}






var noteStrings = ["Do  C", "Do#  C#", "Ré  D", "Ré#  D#", "Mi  E", "Fa  F", "Fa#  F#", "Sol  G", "Sol#  G#", "La  A", "La#  A#", "Si  B"];

var duree = 0;
var nbJuste = 0;
var dureeAttendue = 500;

function updatePitch( time ) {
	analyser.getByteTimeDomainData( buf );

	// possible other approach to confidence: sort the array, take the median; go through the array and compute the average deviation
	var ac = autoCorrelate(buf, audioContext.sampleRate );
	//ajout d'une unité de duree par ms
	duree++;
 	/*
 	* Si l'accordage la fréquence est supérieur à 1000, ou que la fonction autocorellate
 	* renvoie une valeur négative, alors n'actualise pas l'affichage de la détection
 	*/
 	if (ac == -1 || ac >= 1000) {
	 	pitchElem.innerText = "--";
		noteElem.innerText = "--";

 	} 
 	else {
 		pitch = Math.floor(ac);

 		// Affichage de la fréquence sur la page 
	 	pitchElem.innerText = pitch;
	 	//Vérification de la correspondance entre la note attendue et la note jouée
	 	correspondanceNote(pitch);

	 	if(duree == dureeAttendue)
	 	{
	 		nbJuste=0;
	 		duree=0;
	 	}

	 	if(nbJuste == 300)
	 	{
	 		nbJuste=0;
	 		duree=0;
	 		alert('OK note jouée : ' + pitch + ' Note attendue : ' + selection);
	 	}
	 	
	 	
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = window.webkitRequestAnimationFrame;
	rafID = window.requestAnimationFrame( updatePitch );
}











var rafID = null;
var tracks = null;
var buflen = 2048;
var buf = new Uint8Array( buflen );
var MINVAL = 134;  // 128 == zero.  MINVAL is the "minimum detected signal" level.



//Fonction et méthodes personnelles 

/*
*
* Fonction permettant d'arrêter l'enregistrement et l'analyse du son
*
*/
function finAccorder()
{
	if(audioStream) audioStream.stop();
	if(sourceNode) sourceNode.disconnect();
}

/*
*
* Fonction permettant de modifier l'affichage du bouton d'activation et de désactivation
* de l'enregistrement et de l'analyse du son
*
*/
function demarrerStopAccorder()
{	
	var dem = document.getElementById('demarrer');
	if(dem.innerText == 'Activer')
	{
		dem.innerText = 'Désactiver';
		toggleLiveInput();
	}
	else
	{
		dem.innerText = 'Activer';
		finAccorder();
	}		
}

/*
* Fonction vérifiant la correspondance entre la note jouée et la note attendue avec une marge
* d'erreur admise de 5Hz (pour le moment)
* Celle-ci affiche également si la guitariste doit tendre ou détendre la corde pour atteindre
* la note attendue.
*/
function correspondanceNote(pitch)
{
	if(pitch < selection - 5)
	{
		tendageElem.innerText = 'Tendre la corde ' + duree;
	}
	else if(pitch > selection + 5)
	{
		tendageElem.innerText = 'Détendre la corde ' + duree;
	}
	else 
	{
		tendageElem.innerText = 'Note juste ' + duree;
		nbJuste++;
	}
}