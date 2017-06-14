function computeChange(start, end, multiplier, easing){
	//(startPath[i][0], endPath[i][0], percentage)
	return easing? easing(multiplier, start, end-start, 1)
	: start + ((end-start) * multiplier)
}

export function computeClipDifference(startPath, endPath, percentage, easing){
	//take 2 arrays containing 4 arrays with length of 2 and get differences
	// e.g. [[0,0],[100,0],[100,100],[0,100]]
	let difference = []
	for(var i = 0; i<endPath.length; i++){
		const xDifference = computeChange(startPath[i][0], endPath[i][0], percentage, easing||false)
		const yDifference = computeChange(startPath[i][1], endPath[i][1], percentage, easing||false)
		difference.push(xDifference+'%' + ' ' + yDifference+'%')
	}
	return 'polygon('+difference.toString()+')'
}

export function computeColorDifference(startColor, endColor, percentage, easing){
	//rgb(0,0,0) to rgb(255,100,0)
	//takes arrays of 3; can be updated for alpha later
	const red = Math.floor(computeChange(startColor[0], endColor[0], percentage, easing||false))
	const green = Math.floor(computeChange(startColor[1], endColor[1], percentage, easing||false))
	const blue = Math.floor(computeChange(startColor[2], endColor[2], percentage, easing||false))
	const colorString = 'rgb(' +red+ ',' +green+ ',' +blue+ ')' 
	return colorString
}


export const easings = {
	//easings.inOutQuad(percentage, start, difference, 1)
	inOutQuad: function(t,b,c,d){
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	outQuad: function(t,b,c,d){
		return -c *(t/=d)*(t-2) + b;
	},
	inCubic: function(t,b,c,d){
		return c*(t/=d)*t*t + b;
	},
	outCubic: function (t, b, c, d) {
		t /= d;
		t--;
		return c*(t*t*t + 1) + b;
	}
}