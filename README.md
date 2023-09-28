> Voici mon rapport pour le projet Portfolio, en web L2S4. Pour chaque fonctionnalité du barême j'ai rédigé des explications, avec exemples de code pour la plupart.

# Fonctionnalités :

## Client :

### Système de traduction (2pts) :

- La langue est stockée dans l'url, puis en PHP dans la variable globale `$lang`.
- Elle est également stockée chez le client dans le tag `<html>`.
- Si aucune langue n'est spécifiée le site prendra par défaut `lang=en`.
- J'ai crée un dossier "translate" qui contient des listes PHP pour les traductions statiques.
- J'utilise un array à deux dimensions, une pour la langue, une pour le dictionnaire de traduction, de cette manière :
```php
$data = array(
	"en" => array(
		"text1" => "my value 1",
		"text2" => "my value 2",
	),
	"fr" => array(
		"text1" => "ma valeur 1",
		"text2" => "ma valeur 2",
	),
);
```
Puis extrait comme ci-dessous :
```html
<?=$data[$lang]["text2"]?>
```

### Responsive (1pt) :

J'utilise des media queries CSS. 
1. Un layout "< 768px" compact, pour petit smartphone.
2. Un layout "> 768px" taille normale, pour le reste, grand smartphone / tablette / PC 1080p.
- Les pages sont limitées à 800px en width, pour garder une structure visuelle verticale.
- Je ne gère pas les écrans 2k et 4k pour l'instant.
3. Excepté les pages projets, qui sont adaptables en width, limitées à 1800px, j'utilise un media query personnalisé de 300px / 600px / 900px / 1200px / 1500px / 1800px, pour respectivement 1, 2, 3, 4, 5, 6 colonnes de cartes projets.
4. Le header en mode compact transforme les textes en icones (que j'ai dessinées), pour pouvoir rester horizontal.
5. Le format compact (le plus petit) est celui par défaut, les grands formats sont dans les media queries, c'est pour donner l'avantage aux téléphones / petits téléphones.

### AJAX Client (3pts) :

Dans l'onglet "exam", (le code se trouve dans "exam.php")il y a un bouton qui permet de récupérer en AJAX via fetch, et async/await, la carte projet "Propulsion", de manière asynchrone.
Si la promesse est validée, et le json aussi, ma fonction génère la carte.
Voici le code :
```javascript
async function ajax() {
	try {
		const response = await fetch('ajax.php');
		const data = await response.json();
		console.log(data);
		let section = document.querySelector('#ajax section');
		section.innerHTML = '<article><a data-name="'+data['name']+'"><img src="img/cover_'+data['name']+'.jpg" tag="'+data['title']+' jacket"><h1>'+data['title']+'</h1><p>'+data['description']+'</p>'+data['tags_html']+'<label>Read more about '+data['title']+'...</label></a></article>';
	} catch (error) {
		console.log(`Error: ${error}`);
	}
}
document.querySelector('#ajax button').addEventListener('click', ajax);
```

### Inclusions d'éléments redondants (2pts) :

- J'ai crée un dossier "html" qui contient différents contenus redondants.
- Entre autres, le header, l'initialisation de la langue, du contenu de la balise head, des scripts à éxécuter en fin de page.

### Respect des règles d'accessibilité (2pts) :

- Mes images fixes on des attributs alt avec une description complète (descriptions qui sont traduites).

```php
"fr" => array(
	"profile_olivierpyo" => "\"Olivier Pyo, profil 2022\"",
	"logo_olivierpyo" => "\"Olivier Pyo, logo 2021\"",
	"logo_fl" => "\"FL Studio de Image Line, logo du logiciel\"",
	"logo_ableton" => "\"Ableton Live de Ableton AG, logo du logiciel\"",
	"logo_ae" => "\"After Effect de Adobe, logo du logiciel\"",
	"logo_pr" => "\"Premiere Pro de Adobe, logo du logiciel\"",
	"logo_blender" => "\"Blender de Blender Foundation, logo du logiciel\"",
	"logo_3ds" => "\"3ds Max de 'Autodesk Media and Entertainment', logo du logiciel\"",
	"degree_dut" => "\"'Diplôme Universitaire Technologique' DUT en Math-Informatique\"",
	"degree_bac" => "\"'Baccalauréat' Bac général scientifique, option sciences de l'ingénieur, spécialité Informatique\"",
),
```

- Les images des projets on également un alt adapté.
- Lors du passage de souris sur un projet, il est écrit 'en lire plus sur...' et le nom du projet.
- Tout élément possèdant un lien ou faisant une redirection aura un pointeur de souris type "pointer".

Pour les formulaires :

- Les éléments obligatoires sont spécifiés avec `aria-required="true"`.
- Pour les inputs invalides, j'ai utilisé des attributs `aria-invalid="true"`.
- Tous les inputs on une balise `<label>` respectivement, et des attributs `for` et `name`.
- Je n'utilise pas d'id pour les inputs, je les selectionne en javascript avec des query "nth-child". (la lisibilité est préservée grâce aux `name`, mais certes, pas en javascript. J'évite juste les "id" car demandé pour ce projet).

### AJAX Serveur (2pts) :

- J'ai une page (non répertoriée par le header) nommée "ajax.php", qui contient la partie serveur pour la requete asynchrone de la demande de carte projet. 
- Cette page php est appellée par le `fetch()` côté client.
- Les informations sont récupérées dans la base de données, via mes classes php :
```php
require_once 'model/Projects.php';
$projects = new Projects();
$music = $projects->getMusicByTitle("Propulsion");
```
- Puis, entre autres, je revoie un JSON à la fin comme cela:
```php
echo json_encode(
	[
		'name' => str_replace(" " , "_", strtolower($music[0]['title'])), // title, but with lowercase and underscores
		'title' => $music[0]['title'],
		'description' => $music[0]['description'],
		'tags_html' => $tags_html
	]
);
```

### Utilisation de balises HTML nommées (2pts) :

> Mon portfolio ne contient aucun `<div>` et aucun `<span>`.

J'ai crée exceptionnellement 3 balises personnalisées :
1. `<tag-block>` : je trouve que pour les tags des projets c'est plus clair et lisible d'avoir une balise personnalisée à son rôle.
2. `<bg-filter>` : visuel uniquement, c'est pour avoir un background-image + un background semi transparent par dessus. Cela me permet d'ajuster la luminosité d'une image en fonction du theme sombre/clair, sans avoir a préparer des images filtrées.
3. `<bg-gradient>` : pareil, mais avec des gradients semi transparents (voir mon CV section "SKILLS").

### Utilisation de sélécteurs CSS (2pts) :
J'ai réduit au minimum l'utilisation des "id" et "class".
Chaque utilisation à une justification :
- Mes "id" servent uniquement pour les `<section>` qui se comportent comme un conteneur (autre que le main), pour pouvoir faire un CSS adapté aux composants qui s'y trouvent.
- Mes "class" servent uniquement à gérer des fonctionnalités de "toggle" et de selection (et les couleurs des tags), au final, uniquement des "fonctionnalités visuelles bonus, hors barème" : 
1. `.selected` pour spécifier dans le header sur quelle page on se trouve.
2. `.light_theme` uniquement sur le `<body>`, pour faciliter le changement du theme clair VS theme foncé. Je précise, sans avoir à recharger la page, c'est l'avantage.
3. `.slow_transition` uniquement sur le `<body>`, active pendant une demi seconde au moment du clic, pour avoir un changement "doux/smooth" de sombre à clair, et aussi pour éviter qu'il y ai une transition au chargement de la page.
4. Les tags projets ont différentes "significations couleur", j'ai dû utiliser des classes.


### Respect de l'architecture d'un projet web (2pts) :

Les fichiés de mon projet sont rangés dans différents dossiers :
- html : contenus redondants.
- css : feuilles de style.
- js : scripts (indépendants du PHP).
- img : images et icones.
- translate : tables de traductions.
- projects : projets portables hostés sur le site.
- model : classes php.

Les pages sont à la raçine : index, music, programming, exam, m_article, p_article.

> PS : l'index correspond au CV, je souhaite que ce soit ma page d'accueil par défaut.

### Tous les éléments HTML obligatoires sont présents (1pt) :

Liste des balises HTML que j'utilise :
`<html>` `<head>` `<title>` `<link>` `<meta>` `<body>` `<main>` `<header>` `<nav>` `<section>` `<article>` `<p>` `<h1>` `<img>` `<a>` `<strong>` `<i>` `<label>` et `<tag-block>` `<bg-filter>` `<bg-gradient>`

## Serveur :

### Formulaire et HTML (1pt) :

- Allez dans l'onglet "exam" de mon site.
- Mon formulaire POST utilise des balises `<input>` et `<textarea>`.
- Les entrées sont des textes, donc j'ai spécifié `type="text"`.
- Je n'utilise pas d'input type submit, j'utilise un bouton.

### Formulaires fonctionnels (1pt) :

Allez dans l'onglet "exam" de mon site.
Il y a deux formulaires, un de chaque type (GET / POST).
- Un pour créer une table, en GET.
- Un pour remplir une ligne de la table "music" (mes projets musicaux), en POST.

### Vérification des données avant envoi (3pts) :

Pour prévenir le formulaire d'être validé, je ne mets pas d'éléments type submit. Le `<button>` est par défaut `type="submit"`, donc je précise le bouton en `type="button"` pour éviter l'envoi.
Celui-ci appelle une fonction javascript qui vérifie si tous les champs sont valides, et si oui, la fonction submit le formulaire.
1. Texte existant
2. Longueur maximum
3. N'est pas un nombre

> Bonus : à chaque touche pressée, je pré-vérifie les input avec un encadré vert ou rouge.

### Envoi des données après vérification (1pt) :

Si les champs sont validés par le javascript, le formulaire est envoyé avec la commande `this.submit();`.

### Utilisation de PDO (1pt) :

J'ai bien utilisé PDO pour me connecter à la base de données. Voici une partie de mon code, lors de la récupération des articles musicaux et des tags :

```php
	require_once 'model/Projects.php';
	$projects = new Projects();

	$musics = $projects->getMusic();
	$music_tags = $projects->getMusicTag();
	$tags = $projects->getTag();
```
Projects étend la classe abstraite Database : 
```php
abstract class Database
{
	protected PDO $pdo;

	public function __construct()
	{
		$this->pdo = new PDO('sqlite:database.sqlite');
		$this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
		$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
}
```
Voici une des fonctions appelées dans Projects :
```php
public function getMusic(): array {
	return $this->pdo->query("SELECT * FROM music")->fetchAll();
}
```

### Les données du projet sont fournies (1pt) :

Ma base de donnée est fournie en SQLITE dans le fichier "database.sqlite".

### Création d'une table (1pt) :

Voici ma fonction de création de table :
```php
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
```

### Insertion en BdD (2pts) :

Voici ma fonction d'insertion d'élement pour la table "music" : 
```php
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
```

### Vérification des données en PHP (2pts) :

J'ai crée des méthodes privées pour tester les variables. Je teste :
1. Pas NULL
2. Est un String
3. String pas vide
4. Taille plus petite que le max

```php
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
```
Puis, je teste les variables avec la méthode check comme ci-dessous :
```php
if($this->check($title, 32) && $this->check($description, 256) && $this->check($article, 2048)) { ... }
```

### Prise en charge de la faille XSS (1pt) :

il existe `htmlspecialchars()` et `htmlentities()` pour enlever des caractères spéciaux, et `strip_tags()` pour enlever directement les balises. Dans le doute j'en ai mis deux, mais normalement htmlspecialchars suffit déjà :
```php
$title = htmlspecialchars(strip_tags($data['title']));
$description = htmlspecialchars(strip_tags($data['description']));
$article = htmlspecialchars(strip_tags($data['article']));
```

### Prise en charge de la faille "injection SQL" (1pt) : 

Pour éviter les injections SQL, j'utilise `prepare()` pour que la requête soit interprêtée indépendamment des variables, voici un exemple dans mon code :
```php
$req = $this->pdo->prepare(
	"INSERT INTO music ('title', 'description', 'article') VALUES (:title, :description, :article)"
);
$req->bindValue(':title', $title);
$req->bindValue(':description', $description);
$req->bindValue(':article', $article);
$req->execute();
```

### Extraction de données en BdD (2pts) :

- Voici une de mes extractions dans ma base de données : 
```php
$musics = $pdo->query("SELECT * FROM music")->fetchAll();
```
- Puis, la version finale, après avoir fait des classes PHP : 
```php
require_once 'model/Projects.php';
$projects = new Projects();
$musics = $projects->getMusic();
```
- Elle me permet de récupérer les données pour me permettre d'afficher les différentes cartes d'albums et singles via PHP.
- Les valeurs sont extraites de cette manière -> `$music['colonne']` : 
```php
echo '<article><a data-name="'.$name.'"><img src="img/cover_'.$name.'.jpg" tag="'.$music['title'].' '.$projects_text[$lang]["jacket"].'"><h1>'.$music['title'].'</h1><p>'.$music['description'].'</p>'.$tags_html.'<label>'.$projects_text[$lang]["more"].' '.$music['title'].'...</label></a></article>';
```

### Utilisation de class PHP (3pts) :

J'ai fait un dossier "model" qui contient les classes PHP pour les bases de données.

1. "Database.php" pour la connexion PDO
2. "Projects.php" pour la gestion des tables des projets, avec des méthodes pour get, insert, create, vérifications php, etc.


# Indications supplémentaires : 

- J'ai pris soin de réduire les images en taille (width height) relativement petite, de les passer en `.jpg`, et pour les images avec transparences je les ai compressées via le site "TinyPNG.com". Mon dossier "img" est actuellement d'une taille d'environ `1,5Mo`.

- Le thème sombre/clair n'était n'est pas dans le barème, mais j'ai souhaité le faire pour moi. J'ai implémenté un slider en haut de page, et une transition douce d'un thème à l'autre.

- Il est possible d'ouvrir le portfolio sans écrire `index.php`, j'ai pris soin de considérer cette possibilité et d'éviter d'éventuels bugs, notamment, pour mettre en surbrillance automatiquement le "tab" correspondant à la catégorie de page en cours, car je me sert de l'url pour cela. J'ai donc prévu une liste PHP pour indiquer quelle page correspond à quel numéro d'onglet de navigation de 1 à 4 pour les quatres onglets :

```php
$pages = array(
	"" => 1,
	"index" => 1,
	"music" => 2,
	"m_article" => 2,
	"programming" => 3,
	"p_article" => 3,
	"exam" => 4
);
```
```php
echo 'document.querySelector("header a:nth-child('.
	$pages[explode('.', explode('/', $_SERVER['REQUEST_URI'])[2])[0]].
	')").className = "selected";';
```