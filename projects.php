<!doctype html>

<?php require "html/lang.php"; ?>
<?php require "translate/projects_list_text.php"; ?>

<html lang=<?php echo "\"".$lang."\""?> >
<head>
	<link rel="stylesheet" href="css/projects_list.css">
	<?php require "html/meta.php"; ?>
</head>
<body>
<?php require "html/header.php"; ?>
<main>
<section id="projects">

<!--

VertVertVert	Fill the maze with green color.
OpenGL Tests	My first 3D game. The character was "made from scratch".
Voltalysis	Website for the music band Voltalysis, duo of Olivier Pyo and Ludo Harlynn.
Plan'It	Personalized planning for medicine students.
Observatoire	Web app for selecting and viewing some star data, for Observatoire de Strasbourg.
Rambo	Plateform game, pixel art designed, based on rambo characters.
Hanoï	The famous towers.
Couleurs	Distracting web app, click and have fun !
Modélisation	

-->

<?php

	require_once 'model/Projects.php';
	$data = new Projects();

	$projects = 		$data->getProjects();
	$tags = 			$data->getTags();

	foreach ($projects as $project) {
		//$name = str_replace(" " , "_", strtolower($projects['title']));

		/*$tags_html = "";
		foreach ($programming_tags as $programming_tag) {
			if($programming_tag['programming_id'] == $project['id']) {
				$tags_html = $tags_html.'<tag-block class="'.$tag_css[$programming_tag['tag_id']].'">'.$programming_tag['text'].'</tag-block>';
			}
		}*/

		echo '
			<section class="project" style="background-image: url(\'img/bg_'.$project['dataname'].'.png\');">
				<h2>'.$projects_text[$lang]["title_".$project['dataname']].'
				<span class="year"> ('.substr($project['weight'],0,4).')</span></h2>';

		$tags_html = "";
		foreach ($tags as $tag) {
			if($tag['dataname'] == $project['dataname']) {
				$tags_html = $tags_html.'<tag-block class="TAG_'.$tag['color'].'">'.$tag['tag'].'</tag-block>';
			}
		}
		echo '<div class="tags">' . $tags_html . '</div>';

		for($i = 1 ; $i <= $project['size'] ; $i++) {
			echo '
				<section class="container">
					<section class="flex1 txt">
						<section>'.$projects_text[$lang]["txt_".$project['dataname']."_".$i].'</section>
					</section>
					<section class="flex1 img"><img src="img/img_'.$project['dataname'].'_'.$i.'.jpg"></section>
				</section>';
		}

		echo '</section>';
	}

?>

<br><br><br><br><br><br><br><br><br>

<section class="project">
	<h2>Modélisation d'un personnage féminin</h2>
	<section class="container">
		<section class="flex1 txt">
			(from scratch)dfgdfhdghf<br>
			<br>
			Points principaux :<br>
			<br>
			<ul>
				<li>3DSMAX</li>
				<li>Technique Blueprint</li>
				<li>Textures</li>
				<li>Animations</li>
				<li>Export optimisé pour un futur jeu</li>
			</ul>				
		</section>
		<section class="flex1 img">
			<img src="img/screenshot_black.jpg">
		</section>
	</section>
</section>

<section class="project">
	<h2>Image en 4 couleurs sur une TI-84 (Moi, 17 ans)</h2>
	<section class="container">
		<section class="flex1 txt">
			blabla<br>
			<br>
			Points principaux :<br>
			<br>
			<ul>
				<li>??</li>
			</ul>
		</section>
		<section class="flex1 img">
			<img src="img/moi_4couleurs.jpg">
		</section>
	</section>
	<section class="container">
		<section class="flex1 txt">
			blabla<br>
			<br>
			Points principaux :<br>
			<br>
			<ul>
				<li>??</li>
			</ul>
		</section>			
		<section class="flex1 img">
			<img src="img/olivier_4.png">
		</section>
	</section>
</section>

<section class="project">

	<h2>MyMusicTeacher</h2>
	<section class="container">
		<section class="flex1 txt">
			Projet iut, ppp<br>
			<br>
			Points principaux :<br>
			<br>
			<ul>
				<li>HTML / CSS</li>
				<li>JavaScript</li>
				<li>Vexflow - affichage de partitions avec canvas</li>
			</ul>
		</section>
		<section class="flex1 img">
			<img src="img/MyMusicTeacher_2.jpg">
		</section>
	</section>

</section>
<section class="project">

	<h2>Rambo - Jeu de plateforme 2D</h2>
	<section class="container">
		<section class="flex1 txt">
			ddffff<br>
			<br>
			Points principaux :<br>
			<br>
			<ul>
				<li>Game Maker Studio</li>
			</ul>
		</section>
		<section class="flex1 img">
			<img src="img/screenshot_black.jpg">
		</section>
	</section>
</section>
</section>
</main>
</body>
</html>

<?php require "html/scripts.php"; ?>