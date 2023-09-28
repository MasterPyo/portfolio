/**
 * Apprendre.js
 * Mode apprendre
 */

// Variables globales
var transition; 
var transitionMetronome;
var transitionVideo;

/**
 * Demarrer :
 *		Synchronise la vidéo avec la position de la partition actuelle
 * 		Lance le défilement de la partition et de la vidéo après un décompte de 4 temps
 */
function Demarrer() {
	jeu_en_cours = true;
	

 	metronome();
 	window.setTimeout(function() { clearTimeout(transitionMetronome); }, 4*beat_time * 1000 - 10 );
	
	//Evite une erreur de transition css à la lecture
	Deplacer(position_indice);	

	//Positionne la vidéo selon la position du curseur dans la tablature
	move('videoPlayer', (partition.liste_positions[position_indice] / 100 ) * init_beat_time );

	//S'occupe du déplacement de la vidéo
	transitionVideo = window.setTimeout(function() { play('videoPlayer'); }, 4*beat_time * 1000 );

	//S'occupe du déplacement de la tablature après 4 temps
	transition = window.setTimeout(NoteSuivante, 4 * beat_time * 1000 );

	window.setTimeout(EstArrive,  4 * beat_time * 1000 -5 );

	Decompte(4);
}

/**
 * Jouer :
 * 		Fonction appellée par le bouton "Jouer" de l'interface
 *		Appelle "Demarrer" ou "Arreter" , pour démarrer ou mettre en pause le défilement de la partition, selon que l'on est en jeu ou pas.
 */
function Jouer() {
	 bouton = document.getElementById("jouer");
	 if(bouton.textContent == "►")
	 {
		  if(jeu_en_cours == false && position_indice < partition.liste_positions.length)
		  {
		   Demarrer();
		   bouton.textContent = "■";
		   document.getElementById("slidebar").disabled = true;
		  }
	 }
	 else
	 {
		  if(jeu_en_cours == true)
		  {
		   Arreter();
		   bouton.textContent = "►";
		   document.getElementById("slidebar").disabled = false;
		  }
	 }
}

/**
 * Obtient les notes jouées et attendues, 
 * les compare, actualise et affiche les statistiques
 */
function actualiserNoteAttendue() {

	// Recuperation/Actualisation des notes
	noteAttendue = obtenirNoteAttendue(); // définie dans jouer.js
	// Affichage des statistiques
	afficherNoteAttendue(); // définie dans jouer.js

}

/**
 * Arreter :
 * 		Mets en pause le défilement de la partition et de la vidéo
 */
function Arreter() {
	pause('videoPlayer');
	clearTimeout(transition);
	clearTimeout(transitionVideo);
}

/**
 * NoteSuivante :
 * 		C'est la fonction au coeur du déplacement de la partition
 *		Celle-ci s'appelle récursivement pour déplacer la partition de note en note
 */
function NoteSuivante() {
	
	jeu_en_cours = true; // on avctive ce booleen le temps du déplacement

	if(position_indice < partition.liste_positions.length - 1)
	{
		actualiserNoteAttendue(); // on actualise la note attendue
		position_indice++; // on passe à la note suivante
		var ecart = partition.liste_positions[position_indice] - partition.liste_positions[position_indice-1]; // ecart en pixels entre les deux notes

		// on modifie la propriété css "transition" pour le canvas et les div colorées, pour que la transition dure le temps de l'écart entre les deux notes
		var mesures = document.getElementsByClassName("mesure");
		for(var i=0 ; i<longueur ; i++)
		{
			mesures[i].style.transition = "all " + ecart/100.0*beat_time + "s linear";
		}
		var canvas = document.getElementById("1");
		canvas.style.transition = "all " + ecart/100.0*beat_time + "s linear";

		Deplacer(position_indice); // on modifie la position du canvas et des div colorées
		transition = window.setTimeout(NoteSuivante, ecart * 10 * beat_time ); // ex: 5*100 = 500ms pour une noire  // on rapelle cette fonction récursivement pour lire la note suivante des que le deplacement est fini
		window.setTimeout(EstArrive, ecart * 10 * beat_time - 5 ); // on désactive les booléens tout a la fin du deplacement
	}
	else // si on est à la dernière note on arrete de deplacer
	{
		jeu_en_cours = false;
		bouton = document.getElementById("jouer");
		bouton.textContent = "►";
		document.getElementById("slidebar").disabled = false; // on peu de nouveau changer le tempo
	}
}

/**
 * Met le jeu en pause si la fin est arrivée
 */
function EstArrive() {
	jeu_en_cours = false;
}

/**
 * Active le bruit de metronome
 */
function metronome() {
 	document.getElementById('tac').play();
 	transitionMetronome = window.setTimeout(metronome, beat_time * 1000 );
}