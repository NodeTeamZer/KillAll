$(function() {
	// open new game form on button click
	$("#open-form").click(function() {
		$("#new-champ-form").toggleClass("d-none");
	});

	// points manager
	$("#boutonPoint").click(function() {
		let point = 15 - Number($('#attaque').val()) - Number($('#defense').val()) - Number($('#agilite').val());
		if (point > 0){
			$("#pointLeft").html("il vous reste "+point+" point(s). Voulez vous vraiment lancer la partie?? <input type='submit' id='start' value='Commencer la partie' onclick='combat()'>");
		}else if (point < 0) {
			$("#pointLeft").html("Désolé vous ne pouvez pas dépasser 15 points de statistique.");
		}else if ($('#name').val() == "") {
			$('#name-alert').remove();
			$('#name').after('<div id="name-alert" class="alert alert-danger">Veuillez renseigner votre nom</div>');
		}else {
			$('#new-champ-form').submit();
		}
	});
});
