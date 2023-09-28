<!doctype html>

<?php require "html/lang.php"; ?>
<?php require "translate/cv_text.php"; ?>

<html lang=<?php echo "\"".$lang."\""?> >
<head>
	<?php require "html/meta.php"; ?>
	<link rel="stylesheet" href="css/cv.css">
</head>
<body>
<?php require "html/header.php"; ?>
<main>
<section id="CV">

	<section id="profil"><bg-filter>
		<img src="img/profile_pyo_2022.jpg" alt=<?=$cv_alt[$lang]["profile_olivierpyo"]?>>
		<section><h1>Olivier Pyo</h1><p><?=$cv_text[$lang]["profile"]?></p></section>
	</bg-filter></section>

	<section id="bio">
		<img src="img/logo_pyo_2021.jpg" alt=<?=$cv_alt[$lang]["logo_olivierpyo"]?>>
		<section><?=$cv_text[$lang]["bio"]?></section>
	</section>

	<section id="skill">
		<section><bg-gradient>
			<h1><?=$cv_text[$lang]["audio_skills"]?></h1>
			<p><strong>FL Studio</strong>, <?=$cv_text[$lang]["expert"]?> 18<?=$cv_text[$lang]["age"]?></p>
			<p><strong>Ableton Live</strong>, <?=$cv_text[$lang]["good"]?> 4<?=$cv_text[$lang]["age"]?></p>
			<p><strong><?=$cv_text[$lang]["piano"]?></strong>, 10<?=$cv_text[$lang]["age"]?></p>
			<p><strong><?=$cv_text[$lang]["bbx"]?></strong>, 4<?=$cv_text[$lang]["age"]?></p>
			<br>
			<img src="img/logo_FL.png" alt=<?=$cv_alt[$lang]["logo_fl"]?>>
			<img src="img/logo_ableton.jpg" alt=<?=$cv_alt[$lang]["logo_ableton"]?>>
		</bg-gradient></section>
		<section><bg-gradient>
			<h1><?=$cv_text[$lang]["video_skills"]?></h1>
			<p><strong>After Effect</strong>, <?=$cv_text[$lang]["expert"]?> 8<?=$cv_text[$lang]["age"]?></p>
			<p><strong>Premiere Pro</strong>, <?=$cv_text[$lang]["good"]?></p>
			<br>
			<img src="img/logo_ae.jpg" alt=<?=$cv_alt[$lang]["logo_ae"]?>>
			<img src="img/logo_pr.jpg" alt=<?=$cv_alt[$lang]["logo_pr"]?>>
		</bg-gradient></section>
		<section><bg-gradient>
			<h1><?=$cv_text[$lang]["3d_modelling"]?></h1>
			<p><strong>Blender</strong>, <?=$cv_text[$lang]["very_good"]?> 4<?=$cv_text[$lang]["age"]?></p>
			<p><strong>3DS Max</strong>, <?=$cv_text[$lang]["good"]?> 2<?=$cv_text[$lang]["age"]?></p>
			<p><strong><?=$cv_text[$lang]["modding"]?></strong>, <?=$cv_text[$lang]["good"]?></p>
			<br>
			<img src="img/logo_blender.png" alt=<?=$cv_alt[$lang]["logo_blender"]?>>
			<img src="img/logo_3DS.jpg" alt=<?=$cv_alt[$lang]["logo_3ds"]?>>
		</bg-gradient></section>
		<section><bg-gradient>
			<h1><?=$cv_text[$lang]["programming"]?></h1>
			<p><strong><?=$cv_text[$lang]["web_dev"]?></strong>, <?=$cv_text[$lang]["very_good"]?> 6<?=$cv_text[$lang]["age"]?>,</p>
			<p><?=$cv_text[$lang]["landing_pages"]?></p>
			<p><strong>C / C# / Python / Java</strong>, <?=$cv_text[$lang]["good"]?></p>
			<p><strong>OpenGL / SDL / SFML</strong>, <?=$cv_text[$lang]["good"]?></p>
		</bg-gradient></section>
	</section>

	<section id="degree">
		<h1><?=$cv_text[$lang]["degrees"]?> :</h1>
		<section>
			<img src="img/degree_dut.jpg" alt=<?=$cv_alt[$lang]["degree_dut"]?>><br>
			<p>
				<strong>DUT Informatique</strong><br>
				<i>IUT Robert Schumann</i> (Illkirch)<br>
				<br>
				<label>→ <?=$cv_text[$lang]["dut"]?></label><br>
			</p>
		</section>
		<section>
			<img src="img/degree_bac.jpg" alt=<?=$cv_alt[$lang]["degree_bac"]?>>
			<p>
				<strong>Baccalauréat Général S-SI</strong>, Scientifique - Sciences de l'Ingénieur<br>
				<strong>Spécialité ISN</strong>, Informatique et Sciences du Numérique<br>
				<i>Lycée Marc Bloch</i> (Bischheim)<br>
				<br>
				<label>→ <?=$cv_text[$lang]["bac"]?></label>
			</p>
		</section>
	</section>

</section>
</main>
</body>
</html>

<?php require "html/scripts.php"; ?>
