(function() {

socket = io.connect(window.location.href);
Players = {};
keys = [];
pause = false;

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

	if(!pause) {
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

$(document).keydown(function(e){
	var key = (e.keyCode ? e.keyCode : e.which);
	
	if(!keys[key])
		keys[key] = true;
		
	//prevents default key action
	//if($.inArray(key,[37,39,32]) != -1) {
	//	e.preventDefault();	
	//}
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
	 /*$('#send').click(function() {
		var msg = $('#field').val();
		if(msg) {
			socket.send(msg);
			$('body').append('</br>You say: '+msg);
			$('#field').val('');
		}
	});
		
	$('form').on('submit', function () {
		return false;
	});*/
	
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
	
	/*socket.on('message', function (data) {
		console.log(data);
		//var messages = data.messages;
		//for(var i in messages)
		//	$('body').append('</br>'+messages[i].user +' says: '+messages[i].message);
	});*/
	
	socket.on('disconnect', function (player) {
		console.log(player.id,'disconnected');
		Players[player.id].disconnect();
		delete Players[player.id];
	});
	
	socket.on('sync', function (players) {

		for(var p in players) {
			Players[p].top = players[p].top;
			Players[p].left = players[p].left;
			console.log(players[p].top,players[p].left);
		}
		console.timeEnd("time");
		pause=false;
		//console.log('syncing');
	});
	
	animate();
});
})();