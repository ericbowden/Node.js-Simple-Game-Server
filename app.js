var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//specify static www dir
app.use(express.static(__dirname + '/public'));

http.listen(3000);

var players = {};
io.on('connection', function(client){

	console.log("Player connected");
	
    players[client.id]={};
    var clientObj = players[client.id];
    clientObj.color = '#'+(function(h){return new Array(7-h.length).join("0")+h})((Math.random()*(0xFFFFFF+1)<<0).toString(16));
    clientObj.id = client.id;
	clientObj.top = 10;
	clientObj.left = Math.random()*500;

	client.emit('init',players,clientObj.id);
	client.broadcast.emit('player_connect',clientObj); //to others

	//on client message receive
    client.on('sync', function(id,left,top){
        players[id].left = left;
        players[id].top = top;
        io.sockets.emit('sync',players);
    });

	//on client receive
    client.on('disconnect', function(){
        client.broadcast.emit('player_disconnect',clientObj);
        delete players[client.id];		
    });
});