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