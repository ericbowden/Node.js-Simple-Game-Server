function Player(data, playable) {

	this.top = data.top;
	this.left = data.left;
	this.color = data.color;
	this.id = data.id;
	
	var css = {
		position:'absolute',
		width:10,
		height:10,
		'background-color':this.color
	};
	var $this = $('<div></div>').attr({'id':this.id}).css(css);
	$('body').append($this);
	
	this.update = function(period) {
	
		if(!playable)
			return;
			
		var newLeft = this.left;
		var newTop = this.top;

		var linearSpeed = 500; //px/s
		var linearDistEachFrame = linearSpeed * period;
		
		if(keys[util.VK_LEFT])
			newLeft -= linearDistEachFrame;
			
		if(keys[util.VK_RIGHT]) 
			newLeft += linearDistEachFrame;
			
		if(keys[util.VK_UP]) 
			newTop -= linearDistEachFrame;
			
		if(keys[util.VK_DOWN]) 
			newTop += linearDistEachFrame;
			
		if(newLeft != this.left || newTop != this.top) {
			//this.left = newLeft;
			//this.top = newTop;
			//console.log('new');
			//socket.emit('sync',Players);
			//console.time("time");
			//console.log(newTop,newLeft);
			socket.emit('update',this.id,newLeft,newTop);
			pause=true;
		}
	}
	
	this.paint = function() {
		$this.css({top:this.top,left:this.left});
	};
	
	this.disconnect = function() {
		$this.remove();
	
	};
	
}