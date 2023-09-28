const cards = document.querySelectorAll("#projects article a");
cards.forEach((card) => {
	card.addEventListener('click', function(event) {
		closePage_and_open('p_article.php?name=' + this.dataset.name);
	});
});