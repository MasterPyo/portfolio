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

	$programmings = 	$projects->getProgramming();
	$programming_tags = $projects->getProgrammingTag();
	$tags = 			$projects->getTag();

	$tag_css = array("");
	foreach ($tags as $tag) {
		array_push($tag_css, $tag['name']);
	}

	foreach ($programmings as $programming) {
		$name = str_replace(" " , "_", strtolower($programming['title']));

		$tags_html = "";
		foreach ($programming_tags as $programming_tag) {
			if($programming_tag['programming_id'] == $programming['id']) {
				$tags_html = $tags_html.'<tag-block class="'.$tag_css[$programming_tag['tag_id']].'">'.$programming_tag['text'].'</tag-block>';
			}
		}
		
		echo '<article><a data-name="'.$name.'"><img src="img/screenshot_'.$name.'.jpg" tag="'.$programming['title'].' '.$projects_text[$lang]["jacket"].'"><h1>'.$programming['title'].'</h1><p>'.$programming['description'].'</p>'.$tags_html.'<label>'.$projects_text[$lang]["more"].' '.$programming['title'].'...</label></a></article>';
	}

?>

	</section>
</main>
</body>

<script type="text/javascript" src="js/card_p.js"></script>

<?php require "html/scripts.php"; ?>
<script type="text/javascript" src="js/mouse_parallax.js"></script>