var util = {
    VK_BACKSPACE: 8,
    VK_ENTER: 13,
    VK_ESCAPE: 27,
    VK_SPACE: 32,
    VK_LEFT: 37,
    VK_UP: 38,
    VK_RIGHT: 39,
    VK_DOWN: 40,
    VK_0: 48,
    VK_1: 49,
    VK_2: 50,
    VK_3: 51,
    VK_4: 52,
    VK_5: 53,
    VK_6: 54,
    VK_7: 55,
    VK_8: 56,
    VK_9: 57,
    VK_A: 65,
    VK_B: 66,
    VK_C: 67,
    VK_D: 68,
    VK_E: 69,
    VK_F: 70,
    VK_G: 71,
    VK_H: 72,
    VK_I: 73,
    VK_J: 74,
    VK_K: 75,
    VK_L: 76,
    VK_M: 77,
    VK_N: 78,
    VK_O: 79,
    VK_P: 80,
    VK_Q: 81,
    VK_R: 82,
    VK_S: 83,
    VK_T: 84,
    VK_U: 85,
    VK_V: 86,
    VK_W: 87,
    VK_X: 88,
    VK_Y: 89,
    VK_Z: 90,
    VK_KP0: 96,
    VK_KP1: 97,
    VK_KP2: 98,
    VK_KP3: 99,
    VK_KP4: 100,
    VK_KP5: 101,
    VK_KP6: 102,
    VK_KP7: 103,
    VK_KP8: 104,
    VK_KP9: 105,
    nop: function () {},
    object: function (a) {
        var b = function () {};
        b.prototype = a;
        return new b
    },
    randomInt: function (a, b) {
        return a + Math.floor((b - a + 1) * Math.random())
    },
    choose: function (a) {
        return a[Math.floor(Math.random() * a.length)]
    },
    pick: function (a) {
        var b = Math.floor(Math.random() * a.length),
            c = a[b];
        a.splice(b, 1);
        return c
    }
};
util.pickn = function (a, b) {
    for (var c = Array(a.length), d = 0; d < a.length; ++d) c[d] = a[d];
    for (var e = Array(b), d = 0; d < b; ++d) e[d] = util.pick(c);
    return e
};
util.filter = function (a, b) {
    for (var c = [], d = 0, e = a.length; d < e; ++d) b.call(null, a[d], d) && c.push(a[d]);
    return c
};
util.copyArray = function (a) {
    return a.slice(0)
};
util.makeArray = function (a, b) {
    for (var c = [], d = a; d > 0; --d) c.push(b);
    return c
};
util.makeMatrix = function (a, b, c) {
    for (var d = [], e = 0; e < b; ++e) {
        for (var f = [], g = 0; g < a; ++g) f.push(c);
        d.push(f)
    }
    return d
};
util.copyMatrix = function (a) {
    for (var b = [], c = a.length, d = 0; d < c; ++d) {
        for (var e = a[d], f = e.length, g = [], h = 0; h < f; ++h) g.push(e[h]);
        b.push(g)
    }
    return b
};
util.initLogging = function () {
    util.log = window.console ? console.log.apply ? function () {
        console.log.apply(console, arguments)
    } : function () {
        var a = [],
            b;
        for (b in arguments) a.push(arguments[b]);
        console.log(a.join(" "))
    } : window.opera ? opera.postError : util.nop
};
util.initEvents = function () {
    if (document.body.addEventListener) util.listen = function (a, b, c, d) {
        a.addEventListener(b, c, d);
        return c
    }, util.unlisten = function (a, b, c, d) {
        a.removeEventListener(b, c, d)
    };
    else if (document.body.attachEvent) util.listen = function (a, b, c, d) {
        var e = function () {
                c(window.event)
            };
        a.attachEvent("on" + b, e, d);
        return e
    }, util.unlisten = function (a, b, c, d) {
        a.detachEvent("on" + b, tmpfunc, d)
    };
    util.stopEvent = window.Event && Event.prototype.preventDefault ? function (a) {
        a.preventDefault();
        a.stopPropagation()
    } : function (a) {
        a.returnValue = !1
    };
    util.getTarget = function (a) {
        a = a.target || a.srcElement;
        if (a.nodeType == 3) a = a.parentNode;
        return a
    }
};
util.initScroll = function () {
    window.scrollX !== void 0 ? (util.windowScrollX = function () {
        return window.scrollX
    }, util.windowScrollY = function () {
        return window.scrollY
    }) : (util.windowScrollX = function () {
        return document.body.parentNode.scrollLeft
    }, util.windowScrollY = function () {
        return document.body.parentNode.scrollTop
    })
};
util.getPagePosition = function (a) {
    for (var b = 0, c = 0; a;) b += a.offsetLeft, c += a.offsetTop, a = a.offsetParent;
    return {
        x: b,
        y: c
    }
};
util.isWebKit = function () {
    return navigator.userAgent.indexOf("WebKit") >= 0
};
util.isOpera = function () {
    return navigator.userAgent.indexOf("Opera") >= 0
};
util.isIE = function () {
    return navigator.userAgent.indexOf("MSIE") >= 0
};
util.isSafari = function () {
    return navigator.userAgent.indexOf("Safari") >= 0
};
util.init = function () {
    util.initLogging();
    util.log("logging ok");
    util.initEvents();
    util.log("events ok");
    util.initScroll();
    util.log("scroll ok")
};
util.getRepository = function () {
    if (!util.repository) util.repository = {};
    return util.repository
};
util.Loader = function (a, b) {
    this.loaded = util.getRepository();
    this.left = [];
    this.loading = null;
    this.callback = a;
    this.progress = b
};
util.Loader.prototype.addImage = function (a) {
    this.loaded[a] || (this.left.push(a), this.tryLoad())
};
util.Loader.prototype.close = function () {
    this.closed = !0;
    this.checkReady()
};
util.Loader.prototype.checkReady = function () {
    this.closed && this.left.length === 0 && this.callback()
};
util.Loader.prototype.tryLoad = function () {
    if (this.loading === null && this.left.length > 0) {
        var a = this;
        this.loading = this.left.shift();
        var b = new Image;
        b.onload = function (c) {
            a.onLoad(c, b)
        };
        b.onerror = function (b) {
            a.onError(b)
        };
        b.src = this.loading
    } else this.left.length == 0 && this.checkReady()
};
util.Loader.prototype.onLoad = function (a, b) {
    this.progress instanceof Function ? this.progress(this) : this.left.length % 10 == 0 && util.log("Still " + this.left.length + " images to load");
    this.loaded[this.loading] = b;
    this.loading = null;
    this.tryLoad()
};
util.Loader.prototype.onError = function () {
    util.log("Error loading", this.loading);
    this.tryLoad()
};
util.Loader.prototype.get = function (a) {
    return this.loaded[a]
};
util.Require = function(src){
	var s = document.createElement('script');
	s.type = 'text/javascript';
	s.async = true;
	s.src = src;
	var x = document.getElementsByTagName('head')[0];
	x.appendChild(s);
};
var Observable = function () {};
Observable.prototype.addObserver = function (a) {
    if (!this.observers) this.observers = [];
    this.observers.push(a)
};
Observable.prototype.removeObserver = function (a) {
    if (this.observers) {
        for (var b = 0; b < this.observers.length; ++b) this.observers[b] === a && (this.observers.splice(b, 1), --b);
        this.observers.length == 0 && delete this.observers
    }
};
Observable.prototype.notify = function (a) {
    if (this.observers) for (var b = 0; b < this.observers.length; ++b) this.observers[b].update(a)
};
Observable.makeObservable = function (a) {
    if (typeof a == "function") a.prototype.addObserver = Observable.prototype.addObserver, a.prototype.removeObserver = Observable.prototype.removeObserver, a.prototype.notify = Observable.prototype.notify;
    else if (typeof a == "object") a.addObserver = Observable.prototype.addObserver, a.removeObserver = Observable.prototype.removeObserver, a.notify = Observable.prototype.notify;
    else throw "Cannot make observable: " + a;
};
Timer = function () {

	this.lastTime = new Date().getTime();
	
	/*this.getPeriod = function() {
		var time = new Date().getTime();
		var timeDiff = time - this.lastTime;
		this.lastTime = time;
		var period = timeDiff / 1000;
		return period;
	};*/
	
	this.getPeriod = function() {
		return this.getTimeDiff(new Date().getTime()) / 1000; 
	};
	
	this.getLastTime = function() {
		return this.lastTime
	};
	
	this.getTimeDiff = function(time) {
		var timeDiff = time - this.lastTime;
		this.lastTime = time;		
		return timeDiff;
	};
};