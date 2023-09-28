function check(query, max) {
	let input = document.querySelector(query);
	let val = input.value;
	let len = val.length;
	if(len > 0 && len < max && !Number.isInteger(Number(val))) {
		input.setAttribute("aria-invalid", "false"); return true;
	}
	else {
		input.setAttribute("aria-invalid", "true"); return false;
	}
}

function check_form1() {
	return ( check("form:nth-child(1) input", 32) );
}
function check_form2() {
	let res1 = check("form:nth-child(2) input", 32);
	let res2 = check("form:nth-child(2) textarea:nth-of-type(1)", 256);
	let res3 = check("form:nth-child(2) textarea:nth-of-type(2)", 2048);
	return (res1 && res2 && res3);
}

function submit_form1() {
	if(check_form1()) {
		document.querySelector("form:nth-child(1)").submit();
	}
}
function submit_form2() {
	if(check_form2()) {
		document.querySelector("form:nth-child(2)").submit();
	}
}

async function ajax() {
	try {
		const response = await fetch('ajax.php');
		const data = await response.json();
		console.log(data);
		let section = document.querySelector('#ajax section');
		section.innerHTML = '<article><a data-name="'+data['name']+'" onclick="closePage_and_open(\'m_article.php?name='+data['name']+'\'"><img src="img/cover_'+data['name']+'.jpg" tag="'+data['title']+' jacket"><h1>'+data['title']+'</h1><p>'+data['description']+'</p>'+data['tags_html']+'<label>Read more about '+data['title']+'...</label></a></article>';
		const cards = document.querySelectorAll("#projects article a");
		cards.forEach((card) => {
			card.addEventListener('click', function(event) {
				closePage_and_open('m_article.php?name=' + this.dataset.name);
			});
		});
	} catch (error) {
		console.log(`Error: ${error}`);
	}
}
document.querySelector('#ajax button').addEventListener('click', ajax);
