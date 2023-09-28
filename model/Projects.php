<?php

require_once 'model/Database.php';

class Projects extends Database
{
	// Constructeur
	public function __construct()
	{
		parent::__construct();
	}

	// Méthodes type "Select From"
	public function getMusic(): array {			return $this->pdo->query("SELECT * FROM music")->fetchAll(); }
	public function getMusicTag(): array { 		return $this->pdo->query("SELECT * FROM music_tag")->fetchAll(); }
	public function getProgramming(): array { 	return $this->pdo->query("SELECT * FROM programming")->fetchAll(); }
	public function getProjects(): array { 		return $this->pdo->query("SELECT * FROM projects ORDER BY weight DESC")->fetchAll(); }
	public function getProgrammingTag(): array{	return $this->pdo->query("SELECT * FROM programming_tag")->fetchAll(); }
	public function getTag(): array { 			return $this->pdo->query("SELECT * FROM tag")->fetchAll(); }
	public function getTags(): array { 			return $this->pdo->query("SELECT * FROM tags")->fetchAll(); }

	// Méthodes type "Select From" by quelque chose (c'est utilisé pour la carte demandée en AJAX)
	public function getMusicByTitle(string $title): array {
		return $this->pdo->query("SELECT * FROM music WHERE title=\"".htmlspecialchars(strip_tags($title))."\"")->fetchAll();	
	}
	public function getTagByMusicId(string $id): string {
		$music_tags = $this->getMusicTag();
		$tags = $this->getTag();
		$tag_css = array("");
		foreach ($tags as $tag) {
			array_push($tag_css, $tag['name']);
		}
		$tags_html = "";
		foreach ($music_tags as $music_tag) {
			if($music_tag['music_id'] == $id) {
				$tags_html = $tags_html.'<tag-block class="'.$tag_css[$music_tag['tag_id']].'">'.$music_tag['text'].'</tag-block>';
			}
		}
		return $tags_html;
	}

	// Check string
	private function check (string $item, int $max): bool {
		return $this->checkNotNull($item) && $this->checkString($item) && $this->checkEmpty($item) && $this->checkLength($item, $max);
	}
	private function checkLength (string $item, int $max): bool {
		return strlen($item) <= $max;
	}
	private function checkEmpty (string $item): bool {
		return $item !== '';
	}
	private function checkString (string $item): bool {
		return (is_string($item));
	}
	private function checkNotNull (string $item): bool {
		return (!is_null($item));
	}

	// Insert & Create
	public function insertMusic($data) {
		$title = htmlspecialchars(strip_tags($data['title']));
		$description = htmlspecialchars(strip_tags($data['description']));
		$article = htmlspecialchars(strip_tags($data['article']));
		if($this->check($title, 32) && $this->check($description, 256) && $this->check($article, 2048)) {
			$req = $this->pdo->prepare(
				"INSERT INTO music ('title', 'description', 'article') VALUES (:title, :description, :article)"
			);
			$req->bindValue(':title', $title);
			$req->bindValue(':description', $description);
			$req->bindValue(':article', $article);
			$req->execute();
			echo '<script>window.alert("insert executed successfully");</script>';
		}
	}
	public function createTable($data) {
		$name = htmlspecialchars(strip_tags($data['name']));
		if($this->check($name, 32)) {
			$this->pdo->query('CREATE TABLE IF NOT EXISTS '.strtolower($name).' (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				test_column_1 VARCHAR(64) NOT NULL,
				test_column_2 VARCHAR(64) NOT NULL
			)');
			echo '<script>window.alert("table created successfully");</script>';
		}
	}
}

