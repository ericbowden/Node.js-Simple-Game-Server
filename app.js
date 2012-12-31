var express = require('express'),
    app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server),
  fs = require('fs');
    //,util = require('util');

io.set('log level', 2); // reduce logging
//io.set('log level', 1); // only warnings and errors

//specify static www dir
app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});

server.listen(3000);

var players = {};
io.sockets.on('connection', function(client){

	//console.log(Date()+"\n");
	
    players[client.id]={};
    var clientObj = players[client.id];
    clientObj.color = '#'+(function(h){return new Array(7-h.length).join("0")+h})((Math.random()*(0xFFFFFF+1)<<0).toString(16));
    clientObj.id = client.id;//;'User'+client.id.substr(client.id.length-3,3);
	clientObj.top = 10;
	clientObj.left = Math.random()*500;
    
    //io.sockets.emit('message','Send to all clients');

	client.emit('init',players,clientObj.id);
	client.broadcast.emit('player_connect',clientObj); //to others
	//client.emit('message',players);

	//on client message receive
    client.on('sync', function(id,left,top){
    	//console.log(newData,players[newData.id]);
		//players = newData;
        //players[newData.id]= newData;
        players[id].left = left;
        players[id].top = top;
        //client.broadcast.emit('sync',players);
        io.sockets.emit('sync',players);
    });

	//on client receive
    client.on('disconnect', function(){
        client.broadcast.emit('disconnect',clientObj);
        delete players[client.id];
        if(Object.keys(players).length == 0) {
        	console.log('No players, stopping server');
        	fs.writeFile("save.p", "I00\n.",function(err) {
				//if(err) console.log(err); 
				//else console.log("The file was saved!");
				//process.exit();
			});
        }
		
    });
});