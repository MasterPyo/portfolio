/**
 * Notation.js
 * Module de notation et de statistiques
 * @author Jonathan Eritzian
 */

 /// =====================================================
 /// SOMMAIRE : 
 /// 1) Généralités
 /// 2) Accesseurs
 /// 3) Conversion
 /// 4) Affichage des statistiques
 /// =====================================================

// Variables
var stats;    // pourcentage de reussite des notes entre 0 et 100
var notesJouees = 0;  // nombre de notes jouées
var notesJustes = 0;  // nombre de notes justes
var noteAttendue = "";  // prochaine note à jouer sur la partition (ex: "Si 5")


/**
 * Initialise ou réinitialise les statistiques
 * @constructor
 */
function notation() {
 afficherStats(0);
 afficherCommentaire(0);
 this.notesJouees = 0;
 this.notesJustes = 0;
 this.noteJouee = "";
 this.noteAttendue = "";
}

/// =====================================================
/// GENERALITES
/// =====================================================


/**
 * Compare la note jouée et la note attendue sous forme de chaînes
 * @param  {string} noteJouee    	note(s) jouée(s) par l'utilisateur
 * @param  {string} noteAttendue 	note(s) attendue(s) sur la partition
 * @return {boolean} 				resultat
 */

function comparerNote(noteJouee, noteAttendue) {
	noteAttendue = noteAttendue.toString().trim(); // supprime l'espace crée devant la note
	return noteAttendue.indexOf(noteJouee) != -1;
}


/**
 * Calcule les stats
 * @return un pourcentage entier entre 0 et 100
 */
function calculerStats(notesJustes, notesJouees) {
	var result; 	// % de réussite

	// Calcul du pourcentage de réussite
	if(notesJouees > 0) {
		result = (notesJustes / notesJouees) * 100;
	}
	else {
		result = 0;
	}

	// Arrondit
	result = Math.round(result);

	return result;
}

/// =====================================================
/// ACCESSEURS
/// =====================================================

/**
 * Obtient la note à jouer sur la partition
 * @param renvoie la hauteur attendue
 */
function obtenirHauteurAttendue() {
	note = obtenirNoteAttendue();
	note = note.toString();
	var hauteur = noteEnHauteur(note);
	return hauteur;
}

/**
 * Obtient les commentaires
 * @param {int} stats pourcentage de réussite. Entre 0 et 100.
 * @return un commentaire associé à la performance de l'utilisateur
 */
function obtenirCommentaire(stats) {
	var comment; 	// Commentaire à afficher (resultat)

	// Génération du commentaire
	if 		(stats == 100)	{ comment = "Parfait !";	}
	else if (stats >= 95) 	{ comment = "Incroyable !";	}
	else if (stats >= 90) 	{ comment = "Excellent";	}
	else if (stats >= 80) 	{ comment = "Très bon";		}
	else if (stats >= 70) 	{ comment = "Bon";			}
	else if (stats >= 60) 	{ comment = "Plutôt bon";	}
	else if (stats >= 50) 	{ comment = "Continue";		}
	else if (stats >= 40) 	{ comment = "Pas terrible";	}
	else if (stats >= 30) 	{ comment = "Mauvais";		}
	else if (stats >= 20) 	{ comment = "Horrible";		}
	else if (stats >= 5)	{ comment = "Nul";	 		}
	else if (stats >= 0)	{ comment = "...";	 		}
	else 					{ comment = "-"; 			}

	return comment;
}

/// =====================================================
/// CONVERSION
/// =====================================================

/**
 * Convertit la hauteur en note
 * @param {float} hauteur hauteur à convertir en note
 * @return {string} note correspondante à la heuteur envoyée. Sous la forme "La# 4" par exemple
 */
function hauteurEnNote(hauteur) {
	var res = ""; 	// resultat
	var note = ""; 	// note (resultat)
	var octave = 0; // octave
	var er = 1; 	// marge d'erreur

	// Recherche de l'octave
	if     (hauteur > 82   && hauteur <= 126)	{ octave = 2; }
	else if(hauteur > 126  && hauteur <= 253)	{ octave = 3; }
	else if(hauteur > 253  && hauteur <= 508)	{ octave = 4; }
	else if(hauteur > 508  && hauteur <= 1017)	{ octave = 5; }
	else if(hauteur > 1017 && hauteur <= 1500)	{ octave = 6; }
	else 										{ octave = 0; }
	
	// Recherche de la note
	var h = hauteur / Math.pow(2, octave);
	if     (h > 20.0 && h <= 21.2) { note = "Mi";	}
	else if(h > 18.9 && h <= 20.0) { note = "Ré#";	}
	else if(h > 17.8 && h <= 18.9) { note = "Ré";	}
	else if(h > 16.8 && h <= 17.8) { note = "Do#";	}
	else if(			h <= 16.8) { note = "Do";	}
	else if(h > 30.0			 ) { note = "Si";	}
	else if(h > 28.3 && h <= 30.0) { note = "La#";	}
	else if(h > 26.7 && h <= 28.3) { note = "La";	}
	else if(h > 24.5 && h <= 26.7) { note = "Sol#";	}
	else if(h > 23.1 && h <= 24.5) { note = "Sol";	}
	else if(h > 22.5 && h <= 23.1) { note = "Fa#";	}
	else if(h > 21.2 && h <= 22.5) { note = "Fa";	}
	else 						   { note = "";		}

	// Constructionde la note
	if(octave != 0 && note != "") 	{ res = note + " " + octave; }
	else 							{ res = "-"; }

	return res;
}

/**
 * Convertit la hauteur en note
 * @param {string} note note à convertir en hauteur
 * @return {int} hauteur associé à la note envoyée
 */
function noteEnHauteur(note) {
	var hauteur = 0; 	// hauteur (resultat)
	var base0 = 0; 		// hauteur de la note octave 0
	var octave = note.split(" ")[2];

	// Recherche de la hauteur primaire
	if     (note.contains("Mi")) 	{ base0 = 20.601; }
	else if(note.contains("Ré#"))	{ base0 = 19.445; }
	else if(note.contains("Ré"))	{ base0 = 18.354; }
	else if(note.contains("Do#"))	{ base0 = 17.323; }
	else if(note.contains("Do"))	{ base0 = 16.351; }
	else if(note.contains("Si"))	{ base0 = 30.867; }
	else if(note.contains("La#"))	{ base0 = 29.135; }
	else if(note.contains("La"))	{ base0 = 27.500; }
	else if(note.contains("Sol#"))	{ base0 = 25.956; }
	else if(note.contains("Sol"))	{ base0 = 24.499; }
	else if(note.contains("Fa#"))	{ base0 = 23.124; }
	else if(note.contains("Fa"))	{ base0 = 21.826; }
	else 							{ base0 = 0;  }

	// Calcul de la hauteur en fonction de l'octave
	hauteur = base0 * Math.pow(2, octave);
	
	return hauteur;
}


/// =====================================================
/// AFFICHAGE DES STATISTIQUES
/// =====================================================

/**
 * Calcule le pourcentage de notes réussites
 * @param  {int} notesJustes nombre de notes correctement jouée
 * @param  {int} notesJouees nombre de notes jouées
 * @return {int} pourcentage de notes réussites
 */
function calculerStats(notesJustes, notesJouees) {
	// Calcul du pourcentage de réussite arrondit
	if(notesJouees > 0) { return Math.round((notesJustes / notesJouees) * 100); }
	else 				{ return 0; }
}

/**
 * Obtient les commentaires
 * @param {int} stats pourcentage de notes jouées justes. Entre 0 et 100.
 * @return un commentaire associé à la performance effectuée
 */
function obtenirCommentaire(stats) {
	var comment; 	// Commentaire à afficher (resultat)

	// Génération du commentaire
	if 		(stats == 100)	{ comment = "Parfait !";	}
	else if (stats >= 90) 	{ comment = "Incroyable !";	}
	else if (stats >= 80) 	{ comment = "Excellent";	}
	else if (stats >= 70) 	{ comment = "Très bon";		}
	else if (stats >= 60) 	{ comment = "Bon";			}
	else if (stats >= 50) 	{ comment = "Plutôt bon";	}
	else if (stats >= 40) 	{ comment = "Continue";		}
	else if (stats >= 30) 	{ comment = "Pas terrible";	}
	else if (stats >= 20) 	{ comment = "Mauvais";		}
	else if (stats >= 10) 	{ comment = "Horrible";		}
	else if (stats >= 5)	{ comment = "Nul";	 		}
	else 					{ comment = "...";	 		}

	return comment;
}

/**
 * Affiche la note jouée sur l'interface
 * @param {string} noteJouee note(s) jouée(s) par l'utilisateur
 */
function afficherNoteJouee(noteJouee) {
	document.getElementById('note_jouee').innerHTML = noteJouee;
}

/**
 * Affiche/Actualise le commentaire associé aux statistiques obtenues
 * @param {int} stats pourcentage de notes réussites
 */
function afficherCommentaire(stats) {
	document.getElementById('commentaire').innerHTML = obtenirCommentaire(stats);
}

/**
 * Affiche/Actualise les statistiques sur le pourcentage de note jouée juste
 * Affiche/Actualise le pourcentage de notes réussites
 * @param {int} stats pourcentage de notes réussites
 */
function afficherStats(stats) {
	if(stats != -1) {
		document.getElementById('pourcent').innerHTML = stats + "%";
	}
	else {
		document.getElementById('pourcent').innerHTML = "-";
	}
	document.getElementById('pourcent').innerHTML = stats + "%";
}
