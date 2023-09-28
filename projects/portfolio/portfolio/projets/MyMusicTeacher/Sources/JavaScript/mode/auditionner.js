/**
 * Auditionner.js
 * Mode auditionner
 */

/**
 * Demarrer :
 *		Synchronise la vidéo avec la position de la partition actuelle
 * 		Lance le défilement de la partition et de la vidéo après un décompte de 4 temps
 */
function Demarrer() {
	var transition;
	var transitionMetronome;

 	metronome();
	
	jeu_en_cours = true;
	Deplacer(position_indice);	
	Decompte(4);
	window.setTimeout(updatePitch, 4 * beat_time * 1000 ); // on attend une mesure pour commencer
	transition = window.setTimeout(NoteSuivante,  4 * beat_time * 1000 ); 
}

/**
 * Jouer :
 * 		Fonction appellée par le bouton "Jouer" de l'interface
 *		Appelle "Demarrer" ou "Arreter" , pour démarrer ou mettre en pause le défilement de la partition, selon que l'on est en jeu ou pas.
 */
function Jouer() {
	bouton = document.getElementById("jouer");
	if(microphoneActif)
	{
		if(bouton.textContent == "►")
		{
			if(jeu_en_cours == false && position_indice < partition.liste_positions.length)
			{
				rejouer();
				Demarrer();
				bouton.textContent = "<<";
			}
		}
		else
		{
			if(!jeu_en_cours)
			{
				rejouer();
				bouton.textContent = "►";
			}	
		}
	}
	else
	{
		alert("Veuillez activer votre micophone");
	}

}

/**
 * Permet de rejouer le morceau
 */
function rejouer() {
//remise à 0 des stats
notation();
jeu_en_cours=false;
 	var note = document.getElementsByClassName("un_temps");
 	for(i = 0 ; i < partition.liste_positions.length - 1 ; i++) {
  		note[i].style.background = 'rgba(255,255,255,0)';
  		note[i].style.transition = "all 0.2s linear";
 	}
 	ChangerDepart(0);
}

/**
 * NoteSuivante :
 * 		C'est la fonction au coeur du déplacement de la partition
 *		Celle-ci s'appelle récursivement pour déplacer la partition de note en note
 */
function NoteSuivante() {
	if(position_indice < partition.liste_positions.length - 1)
	{
		afficherNoteJouee("-"); //reset
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
		window.setTimeout(actualiserComparaison, (ecart * 10 * beat_time) *(3/4)); // On colorie la note en vert ou en rouge lorsqu'on a parcouru les 3/4 de la note selon que la notes est jouée ou pas
	}
	else
	{
		jeu_en_cours = false; // permet d'autoriser le bouton "replay"
		clearTimeout(transitionMetronome); // coupe le métronome
	}
}

/**
 * Obtient les notes jouées et attendues, 
 * les compare, actualise et affiche les statistiques
 */
function actualiserNoteAttendue() {
	// Recuperation/Actualisation de la note attendue
	noteAttendue = obtenirNoteAttendue(); // définie dans jouer.js
	afficherNoteAttendue(); // définie dans jouer.js

}

/**
 * Actualise la comparaison des notes jouées et attendues
 */
function actualiserComparaison()
{
	// Comparaison de la note jouee
	if(comparerNote(document.getElementById('note_jouee').innerHTML, noteAttendue)) {
		notesJustes++;
		ColorierNote(position_indice-1, true);
		//transition = window.setTimeout(NoteSuivante, ecart * 10 * beat_time ); // ex: 5*100 = 500ms pour une noire
	}
	else
	{
		ColorierNote(position_indice-1, false);
	}
	// Incremente le nombre de notes jouées
	notesJouees++;

	stats = calculerStats(notesJustes, notesJouees);
	afficherStats(stats);
	afficherCommentaire(stats);

}

/**
 * Active le bruit de metronome
 */
function metronome() {
 	document.getElementById('tac').play();
 	transitionMetronome = window.setTimeout(metronome, beat_time * 1000 );
}