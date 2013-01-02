(function() {

socket = io.connect('/');
Players = {};
keys = [];
pause = false;
timer = new Timer();
timer2 = new Timer();
playableId=null;

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

function animate(){

	var period = timer.getPeriod();

	//if(!pause) {
		//socket.emit('sync',period);
		
		if(Players[playableId])
			Players[playableId].update(period);
	//}
	//if(!pause) {
		//update		
		//var period = timer.getPeriod();
		//for(var p in Players)
		//	Players[p].update(period);	
	//}
	
	
	
	for(var p in Players)
		Players[p].paint();

	requestAnimFrame(function(){
		animate();
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

	socket.on('init', function (players,id) {
		console.log(players,'init');
		playableId=id;
		
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
	
	socket.on('sync', function (players,time) {

		for(var p in players) {
			Players[p].top = players[p].top;
			Players[p].left = players[p].left;
			//console.log(players[p].top,players[p].left);
		}
		//console.timeEnd("time");
		pause=false;
		//console.log(timer2.getTimeDiff(time));
	});
	
	
	animate();
});
})();