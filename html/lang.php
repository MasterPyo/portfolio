<?php
	// if 'lang' is in url, we get it, otherwise english is by default
	if(isset($_GET['lang'])) {
		$lang = $_GET['lang'];
	}
	else {
		$lang = "en";
	}
?>