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