import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

export function v3(x,y,z){
    return new THREE.Vector3(x,y,z)
}

export function twn(property, start, end, duration, target, onComplete, delay, traverseOpacity){
    /* example use:
        this.prospectsTween = twn({opacity: 0}, {opacity: 1}, 400, null, prospects.material, null, null)

    */
    const tween = new TWEEN.Tween(start)
        .to(end, duration)
        .onUpdate(function(){
            if(property==='position' || property==='scale' || property==='rotation') target.set(this.x,this.y,this.z)
            else if(traverseOpacity){
                target.traverse((child) => {if(child.material){ child.material.opacity = this.opacity }})
            }
            else{ //opacity etc.
                const allProps = Object.keys(this)
                allProps.forEach((prop) => target[prop] = this[prop])
            }
        })
        if(onComplete) tween.onComplete(onComplete)
        if(delay) tween.delay(delay)

        tween.start()

    return tween
}