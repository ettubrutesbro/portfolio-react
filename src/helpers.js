
export function computeClipDifference(startPath, endPath, multiplier){
	//take 2 arrays containing 4 arrays with length of 2 and get differences
	//[[0,0],[100,0],[100,100],[0,100]]
	let difference = []
	for(var i = 0; i<endPath.length; i++){
		const xDifference = startPath[i][0] + ((endPath[i][0] - startPath[i][0]) * multiplier)
		const yDifference = startPath[i][1] + ((endPath[i][1] - startPath[i][1]) * multiplier)
		difference.push(xDifference+'%' + ' ' + yDifference+'%')
	}
	console.log('polygon('+difference.toString()+')')
	return 'polygon('+difference.toString()+')'
}

export function computeColorDifference(startColor, endColor, multiplier){
	//rgba(0,0,0) to rgba(255,100,0)
	//takes arrays of 4
	const red = Math.floor(startColor[0] + ((endColor[0] - startColor[0]) * multiplier))
	const green = Math.floor(startColor[1] + ((endColor[1] - startColor[1]) * multiplier))
	const blue = Math.floor(startColor[2] + ((endColor[2] - startColor[2]) * multiplier))
	const colorString = 'rgb(' +red+ ',' +green+ ',' +blue+ ')' 
	// console.log(colorString)
	return colorString
}

