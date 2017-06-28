var timeGranularityObserver = TimeGranularityObserver(
	3, 12, //attempt 3 times setTimeout, 12 milliseconds apart
	2000, //update every 2 seconds
	function isHiRes(msDelta){return msDelta<27;} //utility function
	);
timeGranularityObserver.start(
	4000, //delay first readout
	provideOnFlipWorker() //callback
	);

function provideOnFlipWorker() {
		{
			// create <style type="text/css"> node
			// from https://stackoverflow.com/a/524721/8119317
			var css = 'body, body * { -webkit-transition: none !important;  transition: none !important; }';
			var headNode = document.head || document.getElementsByTagName('head')[0];
			var styleNode = document.createElement('style');
			styleNode.type = 'text/css';
			if (styleNode.styleSheet){
				styleNode.styleSheet.cssText = css;
			} else {
				styleNode.appendChild(document.createTextNode(css));
			}
			var isAppended = false;
		} //css: { transition: none !important; }
		
		/*-----------------------------------------*/
		return function onFlipWorker(observer, quality, msDelta) {
			if (!quality && !isAppended) {
				isAppended = true;
				headNode.appendChild(styleNode);
				
			} else if (quality && isAppended) {
				isAppended = false;
				headNode.removeChild(styleNode);
			}
		}
	};

function TimeGranularityObserver(burstSize, burstInterval, readoutInterval, qualityFunction) {
	var i;
	i = {
		'package': {
			'name': 'Peter Fargas',
			'web': 'https://informatik-handwerk.de',
			'licence': undefined,
			'version': '1.0.0'
		},
		
		'start': start,
		'off': off,
		'quality': function qualityFunction_bound() { return qualityFunction(i.state.msDelta); },
		
		'callback': null,
		
		'config': {
			'burstSize': burstSize,
			'burstInterval': burstInterval,
			'readoutInterval': readoutInterval
		},
		'state': {
			'msDelta': undefined,
			'iteration': 0,
			'quality': undefined,
			'flipped': undefined
		},
		'burst': {
			//volatile
		}
	};
	return i;
	
	/*---------------------------------------------------------------------*/
	function start(delay, callback) {
		i.callback = callback || i.callback;
		
		if (delay) {
			i.burst.id = setTimeout(i.start, delay);
		} else {
			i.burst.cx = i.config.burstSize;
			i.burst.start = Date.now();
			i.burst.id = setTimeout(burstTickCallback, i.config.burstInterval);
		} //if-else
	}; //public routine
	/*---------------------------------------------------------------------*/
	function off() {
		clearTimeout(i.burst.id);
		i.callback = false;
	}; //public routine
	
	/*---------------------------------------------------------------------*/
	function burstTickCallback() {
		i.burst.cx--;
		
		if (i.burst.cx === 0) {
			i.burst.end = Date.now();
			measurementEvaluate();
		} else {
			i.burst.id = setTimeout(burstTickCallback, i.config.burstInterval);
		} //if-else
	}; //private routine
	
	/*---------------------------------------------------------------------*/
	function measurementEvaluate() {
		i.state.iteration++;
		i.state.msDelta = (i.burst.end- i.burst.start)/ i.config.burstSize;
		var quality = i.quality();
		i.state.flipped = (i.state.quality !== quality);
		i.state.quality = quality;
		
		if (i.state.flipped || i.callback) {
			i.callback(i, i.state.quality, i.state.msDelta);
		} //if
		
		i.burst.id = setTimeout(i.start, i.config.readoutInterval);
	}; //private routine
}; //factory