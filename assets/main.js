/**
 * String method definition used to copy the str.format() method from python.
 */
if (!String.prototype.format) {
    String.prototype.format = function() {
        const args = arguments;

        return this.replace(/{(\d+)}/g, function(match, number) {
            return (typeof args[number] != 'undefined') ? args[number] : match;
        });
    };
}

$(function() {
    var socket = io.connect('http://localhost:3000');
    
    // open new connexion form
    $("#open-connexion").click(function(){
        $("#connexion").toggleClass("d-none");
        $("#inscription").addClass("d-none");
    });
    
    // validation connexion form
    $("#connexionButton").click(function(event){
	event.preventDefault();
        if ($('#login').val() && $('#password').val()){
            let dataConnexion = '{"login" : "'+$('#login').val()+'", "password" : "'+$('#password').val()+'"}';
            socket.emit('NewConnexion', dataConnexion);
        }
        if ($('#login').val() == ""){
            $('#login-alert').remove();
			$('#login').after('<div id="login-alert" class="alert alert-danger">Veuillez renseigner votre identifiant.</div>');
        }
        if ($('#password').val() == ""){
            $('#password-alert').remove();
			$('#password').after('<div id="password-alert" class="alert alert-danger">Veuillez renseigner votre mot de passe.</div>');
        } 
    });
    
    socket.on('ConnexionOk', function(data) {
            if (data){
		M.toast({html: 'Bienvenue !'})
                if (data.length > 0) {
                    const characterList = $("#characterList");

                    for (elt in data) {
                            const line = document.createElement("li");
                            line.innerHTML = "<a href='#' class='character-list mt-2'><h2>🤴 {0}</h2> Attack: {1} - Defense: {2} - Agility: {3} - Kills: {4}</a>"
                                .format(data[elt].nickname,
                                    data[elt].attack,
                                    data[elt].defense,
                                    data[elt].agility,
                                    data[elt].kills);

                            characterList.append(line);
                    }
                }
                $("#open-connexion").addClass("d-none");
                $("#connexion").addClass("d-none");
                $("#open-inscription").addClass("d-none");
                // display new game button
                $("#open-form").removeClass("d-none");
                // open new game form on button click
                $("#open-form").click(function() {
		    $([document.documentElement, document.body]).animate({
				scrollTop: $("#open-form").offset().top
		    }, 2000);
                    $("#new-champ-form").toggleClass("d-none");
                });

                // points manager
                $("#boutonPoint").click(function(event) {
		    event.preventDefault();
                    let point = 15 - Number($('input[id="attack"]').val()) - Number($('input[id="defense"]').val()) - Number($('input[id="agility"]').val());
		console.log(point);
                    if (point > 0){
		M.toast({html: "il vous reste "+point+" point(s). Voulez vous vraiment lancer la partie??<input class='ml-3 btn orange darken-3 waves-effect waves-light btn-large' type='submit' id='start' value='Commencer la partie' onclick='combat()'>"});
                    }else if (point < 0) {
                        M.toast({html: "Désolé, vous ne pouvez pas dépasser 15 points de statistique."});
                    }else if ($('#name').val() == "") {
                        $('#name-alert').remove();
                        $('#name').after('<div id="name-alert" class="alert alert-danger">Veuillez renseigner votre nom</div>');
                    }else {
                        $('#new-champ-form').submit();
                    }
                });
            }
    });
    
    // open new inscription form
    $("#open-inscription").click(function(){
        $("#inscription").toggleClass("d-none");
        $("#connexion").addClass("d-none");
    });

    // validation inscription form
    $("#inscriptionButton").click(function(event){
	event.preventDefault();
        if ($('#loginInscription').val() && $('#passwordInscription').val()){
	    let dataInscription = '{"login" : "'+$('#loginInscription').val()+'", "password" : "'+$('#passwordInscription').val()+'"}';
            socket.emit('NewInscription', dataInscription);
	    M.toast({html: 'Compte créé ! À présent, veuillez vous connecter.'})
	    $('#inscription').addClass('d-none');
	    $('#connexion').removeClass('d-none');
        }
        if ($('#loginInscription').val() == ""){
            $('#loginInscription-alert').remove();
			$('#loginInscription').after('<div id="loginInscription-alert" class="alert alert-danger">Veuillez renseigner votre identifiant.</div>');
        }
        if ($('#passwordInscription').val() == ""){
            $('#passwordInscription-alert').remove();
			$('#passwordInscription').after('<div id="passwordInscription-alert" class="alert alert-danger">Veuillez renseigner votre mot de passe.</div>');
        } 
    });
});
