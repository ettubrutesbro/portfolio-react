
export function computeClipDifference(startPath, endPath, multiplier){
	//take 2 arrays containing 4 arrays with length of 2 and get differences
	//[[0,0],[100,0],[100,100],[0,100]]
	let difference = []
	for(var i = 0; i<endPath.length; i++){
		const xDifference = (endPath[i][0] - startPath[i][0]) * multiplier
		const yDifference = (endPath[i][1] - startPath[i][1]) * multiplier
		difference.push([xDifference, yDifference])
	}
	return difference
}

export function computeColorDifference(startColor, endColor, multiplier){
	//rgba(0,0,0) to rgba(255,100,0)
	//takes arrays of 4
	const colorString = 'rgb(' +
		(endColor[0] - (endColor[0] - startColor[0])) * multiplier + ',' +
		(endColor[1] - (endColor[1] - startColor[1])) * multiplier + ',' +
		(endColor[2] - (endColor[2] - startColor[2])) * multiplier + ')' 
	// console.log(colorString)
	return colorString
}

