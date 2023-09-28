/*
const cards = document.querySelectorAll("#projects article a");
cards.forEach((card) => {
	card.addEventListener('click', function(event) {
		closePage_and_open('m_article.php?name=' + this.dataset.name);
	});
});
*/

const cards = document.querySelectorAll("#projects article");
cards.forEach((card) => {
	card.addEventListener('click', function(event) {
		this.classList.toggle("rotate3d");
		this.querySelector("a").classList.toggle("hidden");
		this.querySelector("iframe").classList.toggle("hidden");
	});
});