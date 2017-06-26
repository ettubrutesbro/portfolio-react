function computeChange(start, end, multiplier, easing){
    //(startPath[i][0], endPath[i][0], percentage)
    return easing? easing(multiplier, start, end-start, 1)
    : start + ((end-start) * multiplier)
}

export function computeXformDifference(startXform, endXform, percentage, easing, units){
    // supported properties / format: {x:100, y:25, rotate:90, scale:2}
    const startKeys = Object.keys(startXform)
    const endKeys = Object.keys(endXform)
    //exit if keys aren't same
    if(JSON.stringify(startKeys.sort()) !== JSON.stringify(endKeys.sort())) return

    let translation = {x: 0, y: 0}
    if(endKeys.includes('x')) translation.x = (computeChange(startXform.x, endXform.x, percentage, easing)) + units
    if(endKeys.includes('y')) translation.y = (computeChange(startXform.y, endXform.y, percentage, easing)) + units
    translation = 'translate3d(' + translation.x + ', ' + translation.y + ', 0)'
    const rotation =  endKeys.includes('rotation')? 'rotate(' + computeChange(startXform.rotation, endXform.rotation, percentage, easing) + 'deg)' : ''
    const scale = endKeys.includes('scale')? 'scale(' + computeChange(startXform.scale, endXform.scale, percentage, easing) +')' : ''

    return translation + ' ' + rotation + ' ' + scale //prescribed order might be problematic but fine for now
    
    // return 'translate3d(100px,25%,0) rotate(90deg) scale(2)'
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

export function toEuler(quaternion){
    
    // logic taken from cannon's Quaternion.toEuler function...
    //only supports a YZX order (???)
    let target = {}
    let heading, attitude, bank
    const x = quaternion.x
    const y = quaternion.y 
    const z = quaternion.z
    const w = quaternion.w

    const test = x*y + z*w
    if(test > 0.499) { //singularity at north pole
        heading = 2 * Math.atan2(x,w)
        attitude = Math.PI/2
        bank = 0
    }
    if(test < -0.499) { //singularity at south pole
        heading = -2 * Math.atan2(x,w)
        attitude = -Math.PI/2
        bank = 0
    }
    if(isNaN(heading)){
        const sqx = x*x;
        const sqy = y*y;
        const sqz = z*z;
        heading = Math.atan2(2*y*w - 2*x*z , 1 - 2*sqy - 2*sqz); // Heading
        attitude = Math.asin(2*test); // attitude
        bank = Math.atan2(2*x*w - 2*y*z , 1 - 2*sqx - 2*sqz); // bank
    }

    target.y = heading;
    target.z = attitude;
    target.x = bank;
    console.log('euler (degrees) is...')
    console.log('x',degs(target.x), ' y',degs(target.y), ' z',degs(target.z))
    return target
    

        // function ( x, y, z ){

        // var c1 = Math.cos( x * 0.5 );
        // var c2 = Math.cos( y * 0.5 );
        // var c3 = Math.cos( z * 0.5 );
        // var s1 = Math.sin( x * 0.5 );
        // var s2 = Math.sin( y * 0.5 );
        // var s3 = Math.sin( z * 0.5 );

        // // XYZ
        // this.x = s1 * c2 * c3 + c1 * s2 * s3;
        // this.y = c1 * s2 * c3 - s1 * c2 * s3;
        // this.z = c1 * c2 * s3 + s1 * s2 * c3;
        // this.w = c1 * c2 * c3 - s1 * s2 * s3;

        // return this;

    
}

export function rads(degs){
    return degs*(Math.PI/180)
}

export function degs(rads){
    return rads*(180/Math.PI)
}




