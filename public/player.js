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

		var linearSpeed = 300; //px/s
		var linearDistEachFrame = linearSpeed * period;
		
		if(keys[util.VK_LEFT] || keys[util.VK_A])
			newLeft -= linearDistEachFrame;
			
		if(keys[util.VK_RIGHT] || keys[util.VK_D]) 
			newLeft += linearDistEachFrame;
			
		if(keys[util.VK_UP] || keys[util.VK_W]) 
			newTop -= linearDistEachFrame;
			
		if(keys[util.VK_DOWN] || keys[util.VK_S]) 
			newTop += linearDistEachFrame;
			
		if(newLeft != this.left || newTop != this.top) {
			socket.emit('sync',this.id,newLeft,newTop);
			update=true;
		}
	}
	
	this.paint = function() {
		$this.css({top:this.top,left:this.left});
	};
	
	this.disconnect = function() {
		$this.remove();
	
	};
	
}