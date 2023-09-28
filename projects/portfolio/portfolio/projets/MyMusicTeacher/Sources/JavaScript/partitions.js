
// Sert à contenir l'unique instance de la classe "Partition"
var partition;

/**
 * Constructeur de la classe "Partition" :
 * 		Crée une nouvelle partition vierge d'une taille correspondant au nombre de mesures donné en paramètre
 * @param nb_mesures
 * 		Nombre de mesures de la partition, la taille du canvas dépend de ce nombre.
 */
function Partition(nb_mesures) {

	this.nb_mesures = nb_mesures;
	this.longueur = 400;

	var cv = document.createElement('canvas');
	cv.id = "1";
	cv.width = (nb_mesures*this.longueur+1);
	cv.height = 300;
	document.getElementById("canvas").appendChild(cv);

	this.canvas = $("#1")[0];
	this.renderer = new Vex.Flow.Renderer(this.canvas,Vex.Flow.Renderer.Backends.CANVAS);

	// Partition
	this.stave_indice = 0;
	this.liste_notes = Array();
	this.ctx = this.renderer.getContext();
	this.stave = Array(nb_mesures);
	for(var i=0 ; i<nb_mesures ; i++)
	{
		this.stave[i] = new Vex.Flow.Stave(this.longueur*i, 30, this.longueur);
	}
	this.stave[0].addClef("treble");

	// Tablature
	this.tabstave_indice = 0;
	this.tabliste_notes = Array();
	this.tabctx = this.renderer.getContext();
  	this.tabctx.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
	this.tabstave = Array(nb_mesures);
	for(var i=0 ; i<nb_mesures ; i++)
	{
		this.tabstave[i] = new Vex.Flow.TabStave(this.longueur*i, 125, this.longueur);
	}
 	this.tabstave[0].addTabGlyph();

 	this.liste_positions = Array();
 	this.liste_positions[0] = 0;
 	this.liste_hauteur = Array();
 	this.compteur = 1;
}

/**
 * Méthode de la classe Partition :
 * 		Permet d'ajouter les notes contenues dans une mesure.
 * @param notes :
 * 		Liste de notes sous la forme : [ [hauteur1, hauteur2 ...] , duration ]
 * 		Il faut que l'argument contienne les notes d'une seule mesure, pas plus (ni moins).
 */
Partition.prototype.AjouterNotes = function(notes) {

	// Partition
	var vexflow_notes = Array();
	for(var i=0 ; i<notes.length ; i++)
	{
		vexflow_notes[i] = new Vex.Flow.StaveNote({ keys: Decalage(notes[i][0]), duration: notes[i][1] });
		if(notes[i][0].length == 1)
		{
			if(notes[i][0][0].replace('#', '') != notes[i][0][0])
				vexflow_notes[i].addAccidental(0, new Vex.Flow.Accidental("#"));
		}

		this.liste_positions[this.compteur] = this.liste_positions[this.compteur-1] + Temps_Distance(notes[i][1]);
		this.liste_hauteur[this.compteur-1] = Anglais_Vers_Francais( notes[i][0] );
		if(notes[i][1] == "qr" || notes[i][1] == "hr" || notes[i][1] == "wr" || notes[i][1] == "8r" || notes[i][1] == "16r")
			this.liste_hauteur[this.compteur-1] = "Silence !";

		this.compteur++;
		longueur++;
	}
	this.liste_notes[this.stave_indice] = vexflow_notes;
	this.stave_indice++;

	// Tablature
	var vexflow_tabnotes = Array();
	var tabnotes = Array();
	for(var i=0 ; i<notes.length ; i++)
	{
		tabnotes = Conversion(notes[i][0]);
		if(tabnotes.length == 1)
			vexflow_tabnotes[i] = new Vex.Flow.TabNote({positions: [{str: tabnotes[0][0], fret: tabnotes[0][1]}], duration:  notes[i][1]});
		else if(tabnotes.length == 2)
			vexflow_tabnotes[i] = new Vex.Flow.TabNote({positions: [{str: tabnotes[0][0], fret: tabnotes[0][1]}, {str: tabnotes[1][0], fret: tabnotes[1][1]}], duration:  notes[i][1]});
		else if(tabnotes.length == 3)
			vexflow_tabnotes[i] = new Vex.Flow.TabNote({positions: [{str: tabnotes[0][0], fret: tabnotes[0][1]}, {str: tabnotes[1][0], fret: tabnotes[1][1]}, {str: tabnotes[2][0], fret: tabnotes[2][1]}], duration:  notes[i][1]});
		else
			vexflow_tabnotes[i] = new Vex.Flow.TabNote({positions: [{str: tabnotes[0][0], fret: tabnotes[0][1]}, {str: tabnotes[1][0], fret: tabnotes[1][1]}, {str: tabnotes[2][0], fret: tabnotes[2][1]}, {str: tabnotes[3][0], fret: tabnotes[3][1]}], duration:  notes[i][1]});
	}
	this.tabliste_notes[this.tabstave_indice] = vexflow_tabnotes;
	this.tabstave_indice++;

}


/**
 * Méthode de la classe Partition :
 * 		Permet d'afficher la grille ainsi que les notes ajoutées (au préalable), dans le canvas.
 */
Partition.prototype.Afficher = function() {
	// Dessiner les barres de la partition et de la tablature
	for(var i=0 ; i<this.nb_mesures ; i++)
	{
		this.stave[i].setContext(this.ctx).draw();
		this.tabstave[i].setContext(this.tabctx).draw();
	}
	// Dessiner les notes
	for(var i=0 ; i<this.stave_indice ; i++)
	{
		this.stave[i].fill_style = "#FF9999";
		Vex.Flow.Formatter.FormatAndDraw(this.ctx, this.stave[i], this.liste_notes[i]); 
	}
	for(var i=0 ; i<this.tabstave_indice ; i++)
	{
		Vex.Flow.Formatter.FormatAndDraw(this.tabctx, this.tabstave[i], this.tabliste_notes[i]); 
	}
}


/**
 * OuvrirEtAfficher :
 *		Fonction qui permet d'ouvrir un fichier contenant une partition
 * 		Créé ensuite une instance de la classe "Partition"
 * 		Puis extrait toutes les notes du fichier pour pouvoir les afficher sur la partition
 * @param fichier
 */
function OuvrirEtAfficher(fichier) {

    var xhr = null;		// instance d'objet ajax
    
    if (window.XMLHttpRequest || window.ActiveXObject) {
        if (window.ActiveXObject) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch(e) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
        } else {
            xhr = new XMLHttpRequest(); 
        }
    } else {
        alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
        return null;
    }


    /**
     * Fonction qui est appellée lorsque le fichier est prêt à être lu
     */
	xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {

            var text = xhr.responseText;
            var morceau = text.split('-');

            var tout = Array();

            // Affichage des infos du morceau
            var titre = morceau[0].split(';')[0]; 	// titre du morceau (correspond à la 1ere ligne)
            var auteur = morceau[0].split(';')[1];	// auteur du morceau
            document.getElementById('titre_mode').innerHTML += ' : "' + titre + '", ' + auteur;


            partition = new Partition( morceau[0].split(';')[2] ); // Morceau[0] correspond à la taille de la partition (3e ligne du fichier)

			// Extraction des notes du fichier :
            for( var elem = 1 ; elem < morceau.length ; elem++ ) {
            	var mesure = morceau[elem].replace(' ','').split(';');
            	
            	var res = Array();
            	for( var sousElem = 0 ; sousElem*2 < mesure.length-1 ; sousElem++ ) {
            		res[sousElem] = Array();
            		var note = mesure[sousElem*2].replace(' ','').split(',');
            		var sousRes = Array();
            		for( var sousSousElem = 0 ; sousSousElem < note.length ; sousSousElem++ ) {
            			sousRes[sousSousElem] = note[sousSousElem].replace(' ','');
            		}
            		res[sousElem][0] = sousRes;
            		res[sousElem][1] = mesure[sousElem*2+1];
            	}
            	
            	partition.AjouterNotes(res); // on ajoute toutes les notes d'une mesure

            	tout[elem-1] = res;
            }

			// Génération des rectangles bleus pour le déplacement manuel, et des rectangles qui seront coloriés en vert/rouge
            GenererCurseurs( morceau[0].split(';')[2], tout);

			// Initialisation du tempo qui est définit dans le fichier
            if(apprendre == true)
            {
            	ChangerTempo( morceau[0].split(';')[3] );
            	init_bmp = bpm;
            	init_beat_time = beat_time;
            }

			
            partition.Afficher(); // Affichage de la partition et de la tablature dans le canvas

            longueur = partition.nb_mesures; // nombre de mesures
            var position = 0; // position en pixels
            var position_indice = 0; // numéro de la note actuelle
			Deplacer(0); // On place notre partiton au point de départ

			actualiserNoteAttendue();

			// Fonction qui permet de jouer la vidéo au bon tempo
			var video = document.getElementById("videoPlayer");
			$(video).on('play',function(){
				video.playbackRate = bpm / init_bpm;
			});

        }
	};

	xhr.open("GET", fichier, true);
	xhr.send(null);	
}

/**
 * Conversion :
 * 		Permet de convertir une note (hauteur) en numérotation de tablature.
 * 		/!\ Attention ! Les risques de conflits pour les accords ne sont pas traités dans cette fonction.
 * @param notes :
 * 		Liste de notes pouvant contenir une note ou un accord.
 * @return res :
 * 		Tableau de notes contenant chacune le numéro de la corde et la frette
 *		Renvoie [0,-1] si la conversion n'a pas pu être effectuée. (cela affichera un -1 sur la tablature)
 */
function Conversion(notes) {
	var res = Array();
	for(var i=0 ; i<notes.length ; i++)
	{
		switch(notes[i]) {

			case "e/2":		res[i] = [6,0];	break;
			case "f/2":		res[i] = [6,1];	break;
			case "g/2":		res[i] = [6,3];	break;
			case "a/2":		res[i] = [5,0];	break;
			case "b/2":		res[i] = [5,2];	break;
			case "c/3":		res[i] = [5,3];	break;
			case "d/3":		res[i] = [4,0];	break;
			case "e/3":		res[i] = [4,2];	break;
			case "f/3":		res[i] = [4,3];	break;
			case "g/3":		res[i] = [3,0];	break;
			case "a/3":		res[i] = [3,2];	break;
			case "b/3":		res[i] = [2,0];	break;
			case "c/4":		res[i] = [2,1];	break;
			case "d/4":		res[i] = [2,3];	break;
			case "e/4":		res[i] = [1,0];	break;
			case "f/4":		res[i] = [1,1];	break;
			case "g/4":		res[i] = [1,3];	break;
			case "a/4":		res[i] = [1,5];	break;
			case "b/4":		res[i] = [1,7];	break;
			case "c/5":		res[i] = [1,8];	break;
			case "d/5":		res[i] = [1,10];break;
			case "e/5":		res[i] = [1,12];break;
			case "f/5":		res[i] = [1,13];break;
			case "g/5":		res[i] = [1,15];break;

			case "e#/2":	res[i] = [6,1];	break;
			case "f#/2":	res[i] = [6,2];	break;
			case "g#/2":	res[i] = [6,4];	break;
			case "a#/2":	res[i] = [5,1];	break;
			case "b#/2":	res[i] = [5,3];	break;
			case "c#/3":	res[i] = [5,4];	break;
			case "d#/3":	res[i] = [4,1];	break;
			case "e#/3":	res[i] = [4,3];	break;
			case "f#/3":	res[i] = [4,4];	break;
			case "g#/3":	res[i] = [3,1];	break;
			case "a#/3":	res[i] = [3,3];	break;
			case "b#/3":	res[i] = [2,1];	break;
			case "c#/4":	res[i] = [2,2];	break;
			case "d#/4":	res[i] = [2,4];	break;
			case "e#/4":	res[i] = [1,1];	break;
			case "f#/4":	res[i] = [1,2];	break;
			case "g#/4":	res[i] = [1,4];	break;
			case "a#/4":	res[i] = [1,6];	break;
			case "b#/4":	res[i] = [1,8];	break;
			case "c#/5":	res[i] = [1,9];	break;
			case "d#/5":	res[i] = [1,11];break;
			case "e#/5":	res[i] = [1,13];break;
			case "f#/5":	res[i] = [1,14];break;
			case "g#/5":	res[i] = [1,16];break;

			case "fb/2":	res[i] = [6,0];	break;
			case "gb/2":	res[i] = [6,2];	break;
			case "ab/2":	res[i] = [6,4];	break;
			case "bb/2":	res[i] = [5,1];	break;
			case "cb/3":	res[i] = [5,2];	break;
			case "db/3":	res[i] = [5,4];	break;
			case "eb/3":	res[i] = [4,1];	break;
			case "fb/3":	res[i] = [4,2];	break;
			case "gb/3":	res[i] = [4,4];	break;
			case "ab/3":	res[i] = [3,1];	break;
			case "bb/3":	res[i] = [3,4];	break;
			case "cb/4":	res[i] = [2,0];	break;
			case "db/4":	res[i] = [2,2];	break;
			case "eb/4":	res[i] = [2,4];	break;
			case "fb/4":	res[i] = [1,0];	break;
			case "gb/4":	res[i] = [1,2];	break;
			case "ab/4":	res[i] = [1,4];	break;
			case "bb/4":	res[i] = [1,6];	break;
			case "cb/5":	res[i] = [1,7];	break;
			case "db/5":	res[i] = [1,9];	break;
			case "eb/5":	res[i] = [1,11];break;
			case "fb/5":	res[i] = [1,12];break;
			case "gb/5":	res[i] = [1,14];break;

			default: res[i] = [0,-1];
		}
	}
	return res;
}

function Decalage(notes) {
	var res = Array();
	for(var i=0 ; i<notes.length ; i++)
	{
		switch(notes[i]) {

			case "e/1":		res[i] = "e/2";	break;
			case "f/1":		res[i] = "f/2";	break;
			case "g/1":		res[i] = "g/2";	break;
			case "a/1":		res[i] = "a/2";	break;
			case "b/1":		res[i] = "b/2";	break;
			case "c/2":		res[i] = "c/3";	break;
			case "d/2":		res[i] = "d/3";	break;
			case "e/2":		res[i] = "e/3";	break;
			case "f/2":		res[i] = "f/3";	break;
			case "g/2":		res[i] = "g/3";	break;
			case "a/2":		res[i] = "a/3";	break;
			case "b/2":		res[i] = "b/3";	break;
			case "c/3":		res[i] = "c/4";	break;
			case "d/3":		res[i] = "d/4";	break;
			case "e/3":		res[i] = "e/4";	break;
			case "f/3":		res[i] = "f/4";	break;
			case "g/3":		res[i] = "g/4";	break;
			case "a/3":		res[i] = "a/4";	break;
			case "b/3":		res[i] = "b/4";	break;
			case "c/4":		res[i] = "c/5";	break;
			case "d/4":		res[i] = "d/5";	break;
			case "e/4":		res[i] = "e/5";	break;
			case "f/4":		res[i] = "f/5";	break;
			case "g/4":		res[i] = "g/5";	break;

			case "e#/1":	res[i] = "e#/2";	break;
			case "f#/1":	res[i] = "f#/2";	break;
			case "g#/1":	res[i] = "g#/2";	break;
			case "a#/1":	res[i] = "a#/2";	break;
			case "b#/1":	res[i] = "b#/2";	break;
			case "c#/2":	res[i] = "c#/3";	break;
			case "d#/2":	res[i] = "d#/3";	break;
			case "e#/2":	res[i] = "e#/3";	break;
			case "f#/2":	res[i] = "f#/3";	break;
			case "g#/2":	res[i] = "g#/3";	break;
			case "a#/2":	res[i] = "a#/3";	break;
			case "b#/2":	res[i] = "b#/3";	break;
			case "c#/3":	res[i] = "c#/4";	break;
			case "d#/3":	res[i] = "d#/4";	break;
			case "e#/3":	res[i] = "e#/4";	break;
			case "f#/3":	res[i] = "f#/4";	break;
			case "g#/3":	res[i] = "g#/4";	break;
			case "a#/3":	res[i] = "a#/4";	break;
			case "b#/3":	res[i] = "b#/4";	break;
			case "c#/4":	res[i] = "c#/5";	break;
			case "d#/4":	res[i] = "d#/5";	break;
			case "e#/4":	res[i] = "e#/5";	break;
			case "f#/4":	res[i] = "f#/5";	break;
			case "g#/4":	res[i] = "g#/5";	break;

			case "fb/1":	res[i] = "fb/2";	break;
			case "gb/1":	res[i] = "gb/2";	break;
			case "ab/1":	res[i] = "ab/2";	break;
			case "bb/1":	res[i] = "bb/2";	break;
			case "cb/2":	res[i] = "cb/3";	break;
			case "db/2":	res[i] = "db/3";	break;
			case "eb/2":	res[i] = "eb/3";	break;
			case "fb/2":	res[i] = "fb/3";	break;
			case "gb/2":	res[i] = "gb/3";	break;
			case "ab/2":	res[i] = "ab/3";	break;
			case "bb/2":	res[i] = "bb/3";	break;
			case "cb/3":	res[i] = "cb/4";	break;
			case "db/3":	res[i] = "db/4";	break;
			case "eb/3":	res[i] = "eb/4";	break;
			case "fb/3":	res[i] = "fb/4";	break;
			case "gb/3":	res[i] = "gb/4";	break;
			case "ab/3":	res[i] = "ab/4";	break;
			case "bb/3":	res[i] = "bb/4";	break;
			case "cb/4":	res[i] = "cb/5";	break;
			case "db/4":	res[i] = "db/5";	break;
			case "eb/4":	res[i] = "eb/5";	break;
			case "fb/4":	res[i] = "fb/5";	break;
			case "gb/4":	res[i] = "gb/5";	break;

			default: res[i] = "";
		}
	}
	return res;
}

/**
 * Anglais_Vers_Francais :
 * 		Permet de convertir une note (hauteur) en notation française.
 * @param notes :
 * 		Liste de notes pouvant contenir une note ou un accord.
 * @return res :
 *		Tableau de notes sous forme de chaines de caractères en notation française.
 *		Renvoie "Note inconnue" si la conversion n'a pas pu être effectuée.
 */
function Anglais_Vers_Francais(notes) {
	var res = Array();
	for(var i=0 ; i<notes.length ; i++)
	{
		switch(notes[i]) {

			case "e/1":  res[i] = " Mi 1"; break;
			case "f/1":  res[i] = " Fa 1"; break;
			case "g/1":  res[i] = " Sol 1"; break;
			case "a/1":  res[i] = " La 1"; break;
			case "b/1":  res[i] = " Si 1"; break;
			case "c/2":  res[i] = " Do 2"; break;
			case "d/2":  res[i] = " Ré 2"; break;
			case "e/2":  res[i] = " Mi 2"; break;
			case "f/2":  res[i] = " Fa 2"; break;
			case "g/2":  res[i] = " Sol 2"; break;
			case "a/2":  res[i] = " La 2"; break;
			case "b/2":  res[i] = " Si 2"; break;
			case "c/3":  res[i] = " Do 3"; break;
			case "d/3":  res[i] = " Ré 3"; break;
			case "e/3":  res[i] = " Mi 3"; break;
			case "f/3":  res[i] = " Fa 3"; break;
			case "g/3":  res[i] = " Sol 3"; break;
			case "a/3":  res[i] = " La 3"; break;
			case "b/3":  res[i] = " Si 3"; break;
			case "c/4":  res[i] = " Do 4"; break;
			case "d/4":  res[i] = " Ré 4"; break;
			case "e/4":  res[i] = " Mi 4"; break;
			case "f/4":  res[i] = " Fa 4"; break;

			case "g/4":  res[i] = " Sol 4"; break;
			case "e#/1": res[i] = " Mi# 1"; break;
			case "f#/1": res[i] = " Fa# 1"; break;
			case "g#/1": res[i] = " Sol# 1"; break;
			case "a#/1": res[i] = " La# 1"; break;
			case "b#/1": res[i] = " Si# 1"; break;
			case "c#/2": res[i] = " Do# 2"; break;
			case "d#/2": res[i] = " Ré# 2"; break;
			case "e#/2": res[i] = " Mi# 2"; break;
			case "f#/2": res[i] = " Fa# 2"; break;
			case "g#/2": res[i] = " Sol# 2"; break;
			case "a#/2": res[i] = " La# 2"; break;
			case "b#/2": res[i] = " Si# 2"; break;
			case "c#/3": res[i] = " Do# 3"; break;
			case "d#/3": res[i] = " Ré# 3"; break;
			case "e#/3": res[i] = " Mi# 3"; break;
			case "f#/3": res[i] = " Fa# 3"; break;
			case "g#/3": res[i] = " Sol# 3"; break;
			case "a#/3": res[i] = " La# 3"; break;
			case "b#/3": res[i] = " Si# 3"; break;
			case "c#/4": res[i] = " Do# 4"; break;
			case "d#/4": res[i] = " Ré# 4"; break;
			case "e#/4": res[i] = " Mi# 4"; break;
			case "f#/4": res[i] = " Fa# 4"; break;
			case "g#/4": res[i] = " Sol# 4"; break;

			case "fb/1": res[i] = " Fa b 1"; break;
			case "gb/1": res[i] = " Sol b 1"; break;
			case "ab/1": res[i] = " La b 1"; break;
			case "bb/1": res[i] = " Si b 1"; break;
			case "cb/2": res[i] = " Do b 2"; break;
			case "db/2": res[i] = " Ré b 2"; break;
			case "eb/2": res[i] = " Mi b 2"; break;
			case "fb/2": res[i] = " Fa b 2"; break;
			case "gb/2": res[i] = " Sol b 2"; break;
			case "ab/2": res[i] = " La b 2"; break;
			case "bb/2": res[i] = " Si b 2"; break;
			case "cb/3": res[i] = " Do b 3"; break;
			case "db/3": res[i] = " Ré b 3"; break;
			case "eb/3": res[i] = " Mi b 3"; break;
			case "fb/3": res[i] = " Fa b 3"; break;
			case "gb/3": res[i] = " Sol b 3"; break;
			case "ab/3": res[i] = " La b 3"; break;
			case "bb/3": res[i] = " Si b 3"; break;
			case "cb/4": res[i] = " Do b 4"; break;
			case "db/4": res[i] = " Ré b 4"; break;
			case "eb/4": res[i] = " Mi b 4"; break;
			case "fb/4": res[i] = " Fa b 4"; break;
			case "gb/4": res[i] = " Sol b 4"; break;

			default: res[i] = "Note inconnue";

		}
	}
	return res;
}