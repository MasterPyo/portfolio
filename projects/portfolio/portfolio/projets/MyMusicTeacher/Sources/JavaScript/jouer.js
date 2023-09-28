// booléen servant à savoir si la partition est en train de défiler
var jeu_en_cours = false;

// booléens servant à savoir quel mode de jeu est activée
var apprendre = false;
var exercer = false;
var auditionner = false;
var accordeur = false;

// Nombre de mesures au total
var longueur = 0;

/**
 * Apprendre :
 *   Passe le module en mode "Apprendre"
 */
function Apprendre() {
 apprendre = true;
 exercer = false;
 auditionner = false;
 accordeur = false;
}

/**
 * Exercer :
 *   Passe le module en mode "Exercer"
 */
function Exercer() {
 apprendre = false;
 exercer = true;
 auditionner = false;
 accordeur = false;
}

/**
 * Auditionner :
 *   Passe le module en mode "Auditionner"
 */
function Auditionner() {
 apprendre = false;
 exercer = false;
 auditionner = true;
 accordeur = false;
}

/**
 * Accordeur :
 *   Passe le module en mode "Accordeur"
 */
function Accordeur() {
 apprendre = false;
 exercer = false;
 auditionner = false;
 accordeur = true;
}

/**
 * obtenirNoteAttendue :
 * 		Permet de récupérer la note en cours
 * @return tableau de notes
 */
function obtenirNoteAttendue() {
	return partition.liste_hauteur[position_indice];
}

/**
 * afficherNoteAttendue :
 * 		Permet d'actualiser l'affichage de la note en cours
 */
function afficherNoteAttendue() {
	notedemandee = document.getElementById("note_demandee");
	notedemandee.innerHTML = partition.liste_hauteur[position_indice];
}

/**
 * ColorierNote :
 * 		Colorie en vert ou en rouge la note demandée
 * @param id :
 *		Indice de la note à colorier
 * @param result :
 *		Indique si la note à été réussie ou râtée
 */
function ColorierNote(id, result) {
	var note = document.getElementsByClassName("un_temps");
	if(result)
		note[id].style.background = 'rgba(0,255,0,0.25)';
	else
		note[id].style.background = 'rgba(255,0,0,0.25)';
	note[id].style.transition = "all 0.2s linear";
}

/**
 * Decompte :
 * 		Fonction qui fait un décompte d'un temps en se rapellant elle même "t" fois
 * @param t :
 * 		nombre de temps restant pour le décompte
 */
function Decompte(t) {
	var decompte = document.getElementById('decompte');
	decompte.innerHTML = t;
	document.body.appendChild(decompte);
	
	// on rapelle le décompte au prochain temps :
	window.setTimeout(function() {
		if(t > 1)
	    	Decompte(t-1);
	    else {
			var decompte = document.getElementById('decompte');
			decompte.innerHTML = "";
	    }
	}, beat_time * 1000 );
}