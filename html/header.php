<?php
	$tabs = array("index", "music", "projects");
	$pages = array(
		"" => 1,
		"index" => 1,
		"music" => 2,
		"projects" => 3
	);	
?>
<?php require "translate/header_text.php"; ?>
<header>
	<nav>
		<?php
			foreach($tabs as $tab) {
				echo '<a data-name="'.$tab.'">'.'<img src="img/icon_'.$tab.'.png"><p>'.$header_text[$lang][$tab].'</p></a>';
			}
		?>
	</nav>
	<section id="theme">
		<label>
			<input type="checkbox" checked>
			<p></p>
		</label>
	</section>
	<?php echo '<section id="lang"><img src="img/lang_' . $lang . '.jpg"><p>'.strtoupper($lang).'</p></section>'; ?> <!-- ▼ -->
</header>

<script type="text/javascript">
	const tabs = document.querySelectorAll("header nav a");
	tabs.forEach((tab) => {
		tab.addEventListener('click', function(event) {
			<?php echo 'closePage_and_open(this.dataset.name + ".php?lang=' . $lang . '");'; ?>
		});
	});
	<?php
	echo 'document.querySelector("header a:nth-child('.
		$pages[explode('.', explode('/', $_SERVER['REQUEST_URI'])[2])[0]].
		')").className = "selected";';
	?>
</script>
