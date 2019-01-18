let socket = io.connect('http://localhost:3000');
socket.emit("FightPage");

socket.on("EnemiesFound", function(data) {
	let characters_data = data
	console.log(characters_data);
	characters_data.forEach(function(c) 
	{ 
		  $('#enemyList').append(
			'<div class="col s12 m6"><div class="card"><div class="card-content"><span class="card-title">🤴 '+c.nickname+'</span><span class="new badge">ATTACK : '+c.attack+'</span> <span class="new badge"> DEFENSE : '+c.defense+'</span> <span class="new badge"> AGILITY : '+c.agility+'</span> <span class="new badge"> TOTAL KILLS : '+c.kills+'</span></div><div class="card-action" id="'+c.id+'"><a id="play" href="#">JOUER CONTRE CE PERSONNAGE</a></div></div></li>'
		  );
	});	
	$('#play').click(function() {
		fighter_id = Number($(this).parent().attr('id'));
		characters_data.forEach(function(c) {
			if(c.id === fighter_id) {
				let fighter_data = c;
				socket.emit('Fighter', fighter_data);
				$('#enemy-choser').remove();
			}
		});
	});
	socket.on('FightText', function(data){
            $('#zone_fight').prepend(data);
        })
})
let user_data = {
		user_name : '<%= user_name %>'
		, user_attack_points : '<%= user_attack_points %>'
		, user_defense_points : '<%= user_defense_points %>'
		, user_agility_points : '<%= user_agility_points %>'
 };
socket.emit('NewPlayer', user_data);


