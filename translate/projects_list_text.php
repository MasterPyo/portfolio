<?php

$projects_text = array(
"en" => array(
	"title_chess3d" => "Chess 3D",
	"txt_chess3d_1" => "[ to translate in english ... ]",
	"txt_chess3d_2" => "[ to translate in english ... ]",
	"txt_chess3d_3" => "[ to translate in english ... ]",

	"title_vertvertvert" => "VertVertVert",
	"txt_vertvertvert_1" => "[ to translate in english ... ]",

	"title_testopengl" => "My first 3D game",
	"txt_testopengl_1" => "[ to translate in english ... ]",
	"txt_testopengl_2" => "[ to translate in english ... ]",

	"title_portfoliocard" => "Web portfolio",
	"txt_portfoliocard_1" => "[ to translate in english ... ]",
	"txt_portfoliocard_2" => "[ to translate in english ... ]",

	"programming" => "Programming",
	"exam" => "Exam",
),
"fr" => array(
	"title_chess3d" => "Jeu d'échecs en 3D",
	"txt_chess3d_1" => "
		► Projet réalisé au sein de ma deuxième année de licence informatique, dans le cadre du cours de programmation objet.<br><br>
		► J'ai développé un jeu d'échecs en Java avec la librairie graphique JavaFX, dans l'IDE IntelliJ avec le framework Maven.<br><br>
		► Le jeu respecte les règles originales. Pour déplacer les pièces il suffit de cliquer dessus avec la souris, et les mouvements disponibles sont proposés. La caméra peut également être déplacée avec la souris.<br><br>
		► Vous pouvez lire <a href='doc/Rapport_-_Chess_3D.pdf'>le rapport du projet</a>.",
	"txt_chess3d_2" => "
		► Je propose une partie normale et une partie variante.<br><br>
		► Nouvelles pièces : Nwap, Giant, Magician, Kamikaze.<br><br>
		► Nouvelle règle : plateau de type 'Snake-like'.",
	"txt_chess3d_3" => "
		► Les pièces ont été modélisées sur blender.<br><br>
		► J'ai fait quelques rendus en raytracing (RT) pour le fun.<br><br>
		► J'ai exporté chaque pièce en un fichier .obj, pour pouvoir les importer dans le programme. Il n'existe pas de fonction d'importation en javaFX, j'en ai donc codée une.",
	
	"title_vertvertvert" => "VertVertVert",
	"txt_vertvertvert_1" => "
		► Petit jeu web, fait en pur CSS/JS, le but est de remplir le labyrinthe en vert en utilisant le moins de temps que possible.<br><br>
		► Déplacement très rapide et énergique. Tremblements de caméra à chaque collision. Des petites particules explosent à chaque case convertie en vert.",
	
	"title_testopengl" => "Mon premier jeu 3D",
	"txt_testopengl_1" => "
		► Projet personnel, tests et découverte.<br><br>
		► J'ai réalisé un jeu en 3D, dans lequel vous pouvez déplacer un personnage, attaquer, sauter, dans un monde contenant différents objets, cubes, ciel et sol.<br><br>
		► J'ai codé en C avec le moteur graphique OpenGL (moteur bas niveau).<br><br>",
	"txt_testopengl_2" => "
		► Fonctionnalités :<br><br>
		<ul>
			<li>Affichage d'un <strong>sol en relief</strong>, et du <strong>ciel</strong> (méthode cube intérieur 'skybox').</li>
			<li>Affichage d'une grille 3D de <strong>cubes</strong> (comme minecraft), plus des <strong>objets indépendants</strong>.</li>
			<li><strong>Simulation nuit/jour</strong>, ciel bleu-orange avec lumière ambiante, ciel nocturne.</li>
			<li>Import et affichage d'un <strong>personnage</strong> que j'ai modélisé sur 3dsMax, <strong>animations</strong> comprises (algo d'importation fait main)</li>
			<li><strong>Déplacements</strong> d'un personnage, <strong>collisions</strong> 3D (physique fait main)</li>
			<li><strong>Mode 'Editeur de terrain'</strong> (voir screenshot) : grille 2D (sol) et grille 3D (objets), avec sauvegarde sur fichier texte</li>
			<li>Tests d'herbe 3D (pas très optimisé)</li>
			<li>Animation d'<strong>attaque</strong> pour casser certains objets, le personnage peux mourir aussi</li>
		</ul>",

	"title_portfoliocard" => "Portfolio web",
	"txt_portfoliocard_1" => "
		► Projet réalisé au sein de ma deuxième année de licence informatique, dans le cadre du cours de <strong>programmation web</strong>. Le but était de réaliser un <strong>portfolio</strong> contenant notre CV ainsi que différents projets.<br><br>
		► Ce projet m'a servi d'idée de base pour le portfolio final (que vous êtes en train de lire).<br><br>
		► La page possède un <strong>thème sombre</strong> et un <strong>thème clair</strong>. Tout est traduit en <strong>français</strong> et en <strong>anglais</strong>.",
	"txt_portfoliocard_2" => "
		► Une page <strong>CV</strong> contient mon tout premier <strong>CV en ligne</strong>.<br><br>
		► Une page <strong>Musique</strong> et une page <strong>Programmation</strong> répertorient mes différents projets sous forme de <strong>carte</strong> cliquable, qui permettent de consulter les détails sur le projet.<br><br>
		► J'ai aussi développé différentes fonctionnalitées relatives à l'examen qui ne sont pas toutes liées au portfolio, certaines se trouvent dans la page <strong>Examen</strong>.",
	
	"programming" => "Programmation",	
	"exam" => "Examen",
),
);

?>