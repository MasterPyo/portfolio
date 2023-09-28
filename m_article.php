<!doctype html>

<?php require "html/lang.php"; ?>

<html lang=<?php echo "\"".$lang."\""?> >
<head>
	<?php require "html/meta.php"; ?>
	<link rel="stylesheet" href="css/article.css">
</head>
<body>
<?php require "html/header.php"; ?>

<main>
	<section id="article">

		<?php

			if(isset($_GET) && isset($_GET['name'])) {

				$lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

				require_once 'model/Projects.php';
				$projects = new Projects();
				$musics = $projects->getMusic();
				foreach ($musics as $music) {
					if($_GET['name'] == str_replace(" " , "_", strtolower($music['title']))) {
						echo '<h1>'.$music['title'].'</h1>';
						echo '<img src="img/cover_'.$_GET['name'].'.jpg">';
						//echo $music['article'];
						echo '<p>'.$lorem.'</p>';
						echo '<p>'.$lorem.'</p>';
						echo '<p>'.$lorem.'</p>';
					}
				}

			}

		?>	
		
	</section>
</main>

<section id="spotify">
	<iframe src="https://open.spotify.com/embed/album/67H7lKz6pzuz3qNoDPJW5B?utm_source=generator&theme=0" width="500px" height="160px" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
</section>

</body>
</html>

<?php require "html/scripts.php"; ?>


