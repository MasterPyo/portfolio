/**
 * Deplacements.js
 * Module de déplacement des partitions
 * @author Olivier Pillods
 * Docuementation : Jonathan Eritzian
 */

// Variables
var bpm = 120; 				// Battements par minutes (= tempo)
var init_bpm = 120; 		// Battements par minutes initial
var beat_time = 0.5; 		// Beat Time
var init_beat_time = 0.5; 	// Beat Time initial

/**
 * Déplace la partition d'une certaine distance
 * @param {int} distance distance de déplacement de la partition
 */
function Deplacer(distance)
{
	// Initialisation des positions
	position_indice = distance;
	distance = partition.liste_positions[position_indice];
	position = distance;

	// Modification des mesures
	var mesures = document.getElementsByClassName("mesure");
	for(var i=0 ; i<longueur ; i++)
	{
		mesures[i].style.position = "relative";
		mesures[i].style.left = ((i*400-distance/*+376*/)+'px');
	}

	// Modification du canvas
	var canvas = document.getElementById("1");
	canvas.style.position = "relative";
	canvas.style.left = (-distance)+'px';
}

/**
 * Génère le curseur de la partition
 * @param {int} nb_mesures  nombre total de mesures sur la partition
 * @param {List<string>} liste_notes Liste des notes à jouer
 */
function GenererCurseurs(nb_mesures, liste_notes)
{
	// Initialisation
	var selection = ""; // code HTML à rajouter pour la génération du curseur
	var n = 0; 			// compteur

	// Génération du code HTML du curseur
	selection += '<div class="partition" width=100%>';
	selection += '<div class="curseur"></div>';
	for(var i=0 ; i<nb_mesures ; i++)
	{
		selection += '<div class="mesure">';
		for(var j=0 ; j<liste_notes[i].length ; j++)
		{
			selection += '<div class="un_temps" style="width:' + Temps_Distance(liste_notes[i][j][1]) + 'px;" onClick="ChangerDepart(' + n + ')"></div>';
			n++;
		}
		selection += '</div>';
	}
	selection += '</div>';

	// Ajout du code HTML sur le document
	document.getElementById("selection").innerHTML = selection;

	// Déplacement des mesures
	var mesures = document.getElementsByClassName("mesure");
	for(var i=0 ; i<nb_mesures ; i++)
	{
		mesures[i].style.position = "relative";
		mesures[i].style.left = ((i*400)+'px');
		mesures[i].style.top = (-(i*301)+'px');
	}
}

/**
 * Conversion de la durée de la note en distance d'affichage sur l'interface
 * @param {string} temps durée de la note
 * @return {int} distance d'affichage (entre 25 et 400 px)
 */
function Temps_Distance(temps) {
	var distance;

	if(temps == "w")
		distance = 400;
	else if(temps == "h")
		distance = 200;
	else if(temps == "q")
		distance = 100;
	else if(temps == "8")
		distance = 50;
	else if(temps == "16")
		distance = 25;
	else
		distance = 100;

	return distance;
}

/**
 * Change le départ
 * @param {int} distance distance à changer pour le départ
 */
function ChangerDepart(distance)
{
	if(!jeu_en_cours)
	{
		// Placer à une vitesse de 0.5 secondes pour le deplacement manuel
		var mesures = document.getElementsByClassName("mesure");
		for(var i=0 ; i<longueur ; i++)
		{
			mesures[i].style.transition = "all " + 0.5 + "s linear";
		}
		var canvas = document.getElementById("1");
		canvas.style.transition = "all " + 0.5 + "s linear";

		// Déplacer
		Deplacer(distance);
		move('videoPlayer', (partition.liste_positions[position_indice] / 100 ) * beat_time ); // 2 secondes 
		position = distance;
		actualiserNoteAttendue();
	}
}

/**
 * Change le tempo de la partition
 * @param {int} nouveau_bpm Nouvelle valeur du tempo
 */
function ChangerTempo(nouveau_bpm) {
		bpm = nouveau_bpm;
		beat_time = 60/bpm;
		
		// actualise le texte correspondant au tempo
		if(apprendre == true) {
			document.getElementById("range").innerHTML = nouveau_bpm;
			document.getElementById("slidebar").value = parseInt(nouveau_bpm,10);
		}	
}