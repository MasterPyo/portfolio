<?php

	require_once 'model/Projects.php';
	$projects = new Projects();
	$music = $projects->getMusicByTitle("Propulsion")[0];
	$tags_html = $projects->getTagByMusicId($music['id']);	

	echo json_encode(
		[
			'name' => str_replace(" " , "_", strtolower($music['title'])), // title, but with lowercase and underscores
			'title' => $music['title'],
			'description' => $music['description'],
			'tags_html' => $tags_html
		]
	);

?>
