/**
 * Editor.js
 * Module d'éditeur de partition
 * @author Jonathan Eritzian, Thomas Heiny
 * Docuementation : Jonathan Eritzian, Thomas Heiny
 */

/**
 * Génère la note en fonction de l'élément droppé
 * @param  {string} chemin relatif de l'image droppé 
 * @param  {eventHandler} évènement généré lors du drop de l'image
 */
function ecrireNote(note, e){
    var type = e.dataTransfer.getData('text/plain');
    type = type.substr(type.length-9,9);
    if(type == 'noire.png')
    {
        type = 'q';
    }
    else if(type == 'anche.png')
    {
        type = 'h';
    }
    else
    {
        type = 'w';
    }
	document.getElementById('generer').innerHTML += note + type + '; ';
}

/**
 * génère les paramètres que l'utilisateur a entré avec la syntax du fichier
 */
function ajoutParam(){
	if(document.getElementById('titre_morceau').value.indexOf(';') == -1 && document.getElementById('auteur_morceau').value.indexOf(';') == -1
	&& document.getElementById('nb_mesures_morceau').value.indexOf(';') == -1 && document.getElementById('nb_mesures_morceau').value.indexOf(';') == -1)
	{
		document.getElementById('titre').innerHTML = document.getElementById('titre_morceau').value + ";";
		document.getElementById('auteur').innerHTML = document.getElementById('auteur_morceau').value + ";";
		document.getElementById('nb_mesures').innerHTML = document.getElementById('nb_mesures_morceau').value + ";";
		document.getElementById('tempo').innerHTML = document.getElementById('tempo_morceau').value + ";";
	}
	else {
		alert('Ne mettez pas de ";" s\'il vous plait');
	}
}

/**
 * Augmente le nombre de mesure et met un tiret dans le texte généré
 */
function mesureSuivante(){
    document.getElementById('nb_mesures_morceau').value++;
    document.getElementById('nb_mesures').innerHTML = document.getElementById('nb_mesures_morceau').value + ";";
    document.getElementById('generer').innerHTML += "<br/> - ";
}

/**
 * ajoute la propriété droppable au ligne de la partition
 */
document.querySelector('#ligne1').addEventListener('dragover', function(e) {
    e.preventDefault(); // Annule l'interdiction de drop
}, false);
document.querySelector('#ligne2').addEventListener('dragover', function(e) {
    e.preventDefault(); // Annule l'interdiction de drop
}, false);
document.querySelector('#ligne3').addEventListener('dragover', function(e) {
    e.preventDefault(); // Annule l'interdiction de drop
}, false);
document.querySelector('#ligne4').addEventListener('dragover', function(e) {
    e.preventDefault(); // Annule l'interdiction de drop
}, false);
document.querySelector('#ligne5').addEventListener('dragover', function(e) {
    e.preventDefault(); // Annule l'interdiction de drop
}, false);
document.querySelector('#ligne6').addEventListener('dragover', function(e) {
    e.preventDefault(); // Annule l'interdiction de drop
}, false);
document.querySelector('#ligne7').addEventListener('dragover', function(e) {
    e.preventDefault(); // Annule l'interdiction de drop
}, false);
document.querySelector('#ligne8').addEventListener('dragover', function(e) {
    e.preventDefault(); // Annule l'interdiction de drop
}, false);
document.querySelector('#ligne9').addEventListener('dragover', function(e) {
    e.preventDefault(); // Annule l'interdiction de drop
}, false);
document.querySelector('#ligne10').addEventListener('dragover', function(e) {
    e.preventDefault(); // Annule l'interdiction de drop
}, false);
document.querySelector('#ligne11').addEventListener('dragover', function(e) {
    e.preventDefault(); // Annule l'interdiction de drop
}, false);
document.querySelector('#ligne12').addEventListener('dragover', function(e) {
    e.preventDefault(); // Annule l'interdiction de drop
}, false);
document.querySelector('#ligne13').addEventListener('dragover', function(e) {
    e.preventDefault(); // Annule l'interdiction de drop
}, false);
document.querySelector('#ligne14').addEventListener('dragover', function(e) {
    e.preventDefault(); // Annule l'interdiction de drop
}, false);
document.querySelector('#ligne15').addEventListener('dragover', function(e) {
    e.preventDefault(); // Annule l'interdiction de drop
}, false);


/**
 * Evènement généré lorsque l'élément est droppé
 */
document.querySelector('#ligne1').addEventListener('drop', function(e) { e.preventDefault();ecrireNote("b/4;", e) }, false);
document.querySelector('#ligne2').addEventListener('drop', function(e) { e.preventDefault();ecrireNote("a/4;", e) }, false);
document.querySelector('#ligne3').addEventListener('drop', function(e) { e.preventDefault();ecrireNote("g/4;", e) }, false);
document.querySelector('#ligne4').addEventListener('drop', function(e) { e.preventDefault();ecrireNote("f/4;", e) }, false);
document.querySelector('#ligne5').addEventListener('drop', function(e) { e.preventDefault();ecrireNote("e/4;", e) }, false);
document.querySelector('#ligne6').addEventListener('drop', function(e) { e.preventDefault();ecrireNote("d/4;", e) }, false);
document.querySelector('#ligne7').addEventListener('drop', function(e) { e.preventDefault();ecrireNote("c/4;", e) }, false);
document.querySelector('#ligne8').addEventListener('drop', function(e) { e.preventDefault();ecrireNote("b/3;", e) }, false);
document.querySelector('#ligne9').addEventListener('drop', function(e) { e.preventDefault();ecrireNote("a/3;", e) }, false);
document.querySelector('#ligne10').addEventListener('drop', function(e) { e.preventDefault();ecrireNote("g/3;", e) }, false);
document.querySelector('#ligne11').addEventListener('drop', function(e) { e.preventDefault();ecrireNote("f/3;", e) }, false);
document.querySelector('#ligne12').addEventListener('drop', function(e) { e.preventDefault();ecrireNote("e/3;", e) }, false);
document.querySelector('#ligne13').addEventListener('drop', function(e) { e.preventDefault();ecrireNote("d/3;", e) }, false);
document.querySelector('#ligne14').addEventListener('drop', function(e) { e.preventDefault();ecrireNote("c/3;", e) }, false);
document.querySelector('#ligne15').addEventListener('drop', function(e) { e.preventDefault();ecrireNote("b/3;", e) }, false);


