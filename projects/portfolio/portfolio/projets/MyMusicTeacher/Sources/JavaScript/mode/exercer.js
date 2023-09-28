/**
 * Exercer.js
 * Mode exercer
 */

/**
 * Demarrer :
 *		Synchronise la vidéo avec la position de la partition actuelle
 * 		Lance le défilement de la partition et de la vidéo après un décompte de 4 temps
 */
function Demarrer() {
	var transition;
	jeu_en_cours = true;
	Deplacer(position_indice);	
	move('videoPlayer', (partition.liste_positions[position_indice] / 100 ) * beat_time );
	Decompte(4);
	window.setTimeout(EstArrive, 4 * beat_time * 1000 - 5 );
	transitionEnCours = true;

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
				Demarrer();
				bouton.textContent = "<<";
			}
		}
		else if(!transitionEnCours)
		{
			rejouer();
			bouton.textContent = "►";
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
	jeu_en_cours=false;
 	var note = document.getElementsByClassName("un_temps");
 	for(i = 0 ; i < partition.liste_positions.length - 1 ; i++) {
  		note[i].style.background = 'rgba(255,255,255,0)';
  		note[i].style.transition = "all 0.2s linear";
 	}
 	ChangerDepart(0);
}

/**
 * EstArrive :
 * 		Cette fonciton est appellée 5ms avant la fin d'une note
 *		Elle actualise la notation en affichant les informations de la note suivante
 */
function EstArrive() {
	pause('videoPlayer');
	transitionEnCours = false;
	updatePitch();
}

/**
 * Arreter :
 * 		Mets en pause le défilement de la partition et de la vidéo
 */
function Arreter() {
	jeu_en_cours = false;
	pause('videoPlayer');
	clearTimeout(transition);
}


/**
 * NoteSuivante :
 * 		C'est la fonction au coeur du déplacement de la partition
 *		Celle-ci s'appelle récursivement pour déplacer la partition de note en note
 */
function NoteSuivante() {
	if(position_indice < partition.liste_positions.length - 1)
	{
		// on active ces booleens le temps du déplacement
		jeu_en_cours = true;
		transitionEnCours = true;

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
		play('videoPlayer'); // on démarre la vidéo

		// on continue d'actualiser les stats sauf si on est à la dernière note
		if(position_indice < partition.liste_positions.length - 1)
		{
			window.setTimeout(actualiserNoteAttendue, ecart * 10 * beat_time);
		}
		else
		{
			window.setTimeout(function(){document.getElementById("note_jouee").innerHTML = "-"}, ecart * 10 * beat_time);
			jeu_en_cours = false;
		}
		
		window.setTimeout(EstArrive, ecart * 10 * beat_time - 5 ); // on désactive les booléens tout a la fin du deplacement
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
	if(comparerNote(noteJouee, noteAttendue)) {
		notesJustes++;
		NoteSuivante();
		ColorierNote(position_indice-1, true);
		//transition = window.setTimeout(NoteSuivante, ecart * 10 * beat_time ); // ex: 5*100 = 500ms pour une noire
	}
	// Incremente le nombre de notes jouées
	notesJouees++;
}
