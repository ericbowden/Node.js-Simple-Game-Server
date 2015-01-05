(function() {

window.requestAnimFrame = (function(callback){
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback){
        window.setTimeout(callback, 1000 / 30);
    };
})();

function animate(lastTime){

	if(!update) {
		//update
		var date = new Date();
		var time = date.getTime();
		var timeDiff = time - lastTime;
		lastTime = time;
		var period = timeDiff / 1000;
		
		for(var p in Players)
			Players[p].update(period);	
	}
	
	for(var p in Players)
		Players[p].paint();

	requestAnimFrame(function(){
		animate(lastTime);
	});
}

socket = io();
Players = {};
keys = [];
update = false;

$(document).keydown(function(e){
	var key = (e.keyCode ? e.keyCode : e.which);
	
	if(!keys[key])
		keys[key] = true;
});

$(document).keyup(function(e){
	var key = (e.keyCode ? e.keyCode : e.which);

	if(keys[key])
		keys[key] = false;
});

//stops when browser loses focus
$(window).blur(function() {
	keys = [];
});

$(document).ready(function(){ //main function
	
	socket.on('init', function (players,id) {
		console.log(players,'init');
		Players = {};
		for(var p in players)
			Players[p] = new Player(players[p],id==p?1:0);
	});
	
	socket.on('player_connect', function (player) {
		console.log(player.id,'connected');
		Players[player.id] = new Player(player);
	});
	
	socket.on('player_disconnect', function (player) {
		console.log(player.id,'disconnected');
		Players[player.id].disconnect();
		delete Players[player.id];
	});
	
	socket.on('sync', function (players) {

		console.log('update')

		for(var p in players) {
			Players[p].top = players[p].top;
			Players[p].left = players[p].left;
		}

		update=false;

	});
	
	animate();
});
})();