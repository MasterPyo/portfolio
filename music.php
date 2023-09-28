<!doctype html>

<?php require "html/lang.php"; ?>
<?php require "translate/projects_text.php"; ?>

<html lang=<?php echo "\"".$lang."\""?> >
<head>
	<?php require "html/meta.php"; ?>
	<link rel="stylesheet" href="css/projects.css">
</head>
<body>
<?php require "html/header.php"; ?>
<main>
	<section id="projects">

<?php
	
	require_once 'model/Projects.php';
	$projects = new Projects();

	$musics = 		$projects->getMusic();
	$music_tags = 	$projects->getMusicTag();
	$tags = 		$projects->getTag();

	$tag_css = array("");
	foreach ($tags as $tag) {
		array_push($tag_css, $tag['name']);
	}

	foreach ($musics as $music) {
		$name = str_replace(" " , "_", strtolower($music['title']));

		$tags_html = "";
		foreach ($music_tags as $music_tag) {
			if($music_tag['music_id'] == $music['id']) {
				$tags_html = $tags_html.'<tag-block class="'.$tag_css[$music_tag['tag_id']].'">'.$music_tag['text'].'</tag-block>';
			}
		}

		/* VERSION LISIBLE - génération des articles */

		/*$html = 			'<article><a data-name="' . $name . '">';
		$html = $html . 		'<img src="img/cover_'.$name.'.jpg" tag="'.$music['title'].' '.$projects_text[$lang]["jacket"].'">';
		$html = $html . 		'<h1>' . $music['title'] . '</h1>';
		$html = $html . 		'<p>' . $music['description'] . '</p>';
		$html = $html . 		$tags_html;
		$html = $html . 		'<label>'.$projects_text[$lang]["more"].' '.$music['title'].'...</label>';
		$html = $html . 	'</a></article>';
		echo $html;*/
		
		//echo '<article><a data-name="'.$name.'"><img src="img/cover_'.$name.'.jpg" tag="'.$music['title'].' '.$projects_text[$lang]["jacket"].'"><h1>'.$music['title'].'</h1><p>'.$music['description'].'</p>'.$tags_html.'<label>'.$projects_text[$lang]["more"].' '.$music['title'].'...</label></a></article>';

		echo '<article><a data-name="'.$name.'"><img src="img/cover_'.$name.'.jpg" tag="'.$music['title'].' '.$projects_text[$lang]["jacket"].'"><label>'.$projects_text[$lang]["more"].' '.$music['title'].'...</label></a><iframe class="hidden" src="https://open.spotify.com/embed/album/67H7lKz6pzuz3qNoDPJW5B?utm_source=generator&theme=0" width="382px" height="382px" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe></article>';

	}

?>



	</section>
</main>
</body>
</html>

<script type="text/javascript" src="js/card.js"></script>

<?php require "html/scripts.php"; ?>
<script type="text/javascript" src="js/mouse_parallax.js"></script>


