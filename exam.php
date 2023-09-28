<!doctype html>

<?php require "html/lang.php"; ?>
<?php require "translate/exam_text.php"; ?>

<html lang=<?php echo "\"".$lang."\""?> >
<head>
	<?php require "html/meta.php"; ?>
	<link rel="stylesheet" href="css/exam.css">
	<link rel="stylesheet" href="css/projects.css">
</head>
<body>
<?php require "html/header.php"; ?>
<main>
	<section id="exam">

		<form onkeyup="check_form1()" action="" method="get">
			<h1><?=$exam_text[$lang]["form1"]?></h1>
			<section>
				<label for="name"><?=$exam_text[$lang]["name"]?> : </label>
				<input type="text" name="name" aria-required="true">
			</section>
			<button type="button" onclick="submit_form1()"><?=$exam_text[$lang]["add"]?></button>
		</form>

		<form onkeyup="check_form2()" action="" method="post">
			<h1><?=$exam_text[$lang]["form2"]?></h1>
			<section>
				<label for="title"><?=$exam_text[$lang]["title"]?> : </label>
				<input type="text" name="title" aria-required="true"><br>
				<label for="description"><?=$exam_text[$lang]["desc"]?> : </label>
				<textarea type="text" name="description" aria-required="true"></textarea><br>
				<label for="article"><?=$exam_text[$lang]["article"]?> : </label>
				<textarea type="text" name="article" aria-required="true"></textarea>
			</section>
			<button type="button" onclick="submit_form2()"><?=$exam_text[$lang]["insert"]?></button>
		</form>

		<form id="ajax">
			<h1>AJAX fetch</h1>
			<button type="button"><?=$exam_text[$lang]["ajax_btn"]?></button>
			<section id="projects">
			</section>
		</form>

	</section>
</main>
</body>
</html>

<?php
	
	require_once 'model/Projects.php';
	$projects = new Projects();

	if(isset($_POST) && isset($_POST['title']) && isset($_POST['description']) && isset($_POST['article'])) {
 		$projects->insertMusic($_POST);
	}
	elseif(isset($_GET) && isset($_GET['name'])) {
		$projects->createTable($_GET);
	}

?>

<?php require "html/scripts.php"; ?>
<script type="text/javascript" src="js/exam.js"></script>