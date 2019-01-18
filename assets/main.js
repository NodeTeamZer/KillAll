$(function() {
    var socket = io.connect('http://localhost:3000');
    
    // open new connexion form
    $("#open-connexion").click(function(){
        $("#connexion").toggleClass("d-none");
        $("#inscription").addClass("d-none");
    });
    
    // validation connexion form
    $("#connexionButton").click(function(){
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
    
    socket.on('connexionOk', function(data) {
            if (data){
                $("#open-connexion").addClass("d-none");
                $("#connexion").addClass("d-none");
                $("#open-inscription").addClass("d-none");
                // display new game button
                $("#open-form").removeClass("d-none");
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
            }
    });
    
    // open new inscription form
    $("#open-inscription").click(function(){
        $("#inscription").toggleClass("d-none");
        $("#connexion").addClass("d-none");
    })
    // validation inscription form
    $("#inscriptionButton").click(function(){
        if ($('#loginInscription').val() && $('#passwordInscription').val()){
	        let dataInscription = '{"login" : "'+$('#loginInscription').val()+'", "password" : "'+$('#passwordInscription').val()+'"}';
            socket.emit('NewInscription', dataInscription);
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
