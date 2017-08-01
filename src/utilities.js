import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

export function v3(x,y,z){
    return new THREE.Vector3(x,y,z)
}

export function twn(property, start, end, duration, target, onComplete, delay, traverseOpacity){
    const tween = new TWEEN.Tween(start)
        .to(end, duration)
        .onUpdate(function(){
            if(property==='position' || property==='scale' || property==='rotation') target.set(this.x,this.y,this.z)
            else if(traverseOpacity){
                target.traverse((child) => {
                    if(child.material){
                        if(Array.isArray(child.material)){ child.material.forEach((child)=>{child.opacity = this.opacity})} 
                        else child.material.opacity = this.opacity 
                    }
                })
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

export function makeColorMesh(name, groupref, geometry, faceColorArray, defaultOpacity){
    const faces = geometry.faces
    let colors = []
    console.log('inserting ' + faces.length + '-face geometry into ' + groupref)
    for (var i = 0; i<faces.length; i++){
        //which range am i in? 
        faces[i].materialIndex = i
        let match = false
        let it = 0
        while(!match){ //provided lo-hi range to apply a color to
            if(!faceColorArray[it]){ //error?
                colors[i] = new THREE.MeshBasicMaterial({color: 0xff0000, opacity: defaultOpacity===0?0:1, transparent: true})
                match = true
                break
            }
            if(faceColorArray[it].range){
                const lo = faceColorArray[it].range[0]
                const hi = faceColorArray[it].range[1]
                if(i >= lo && i <= hi){
                    colors[i] = new THREE.MeshBasicMaterial({color: faceColorArray[it].color, transparent: true, opacity: defaultOpacity===0?0:1})
                    match = true
                    break
                }
                it++
            }else{ //variable-length list of indices to apply color to `faces`
                if(faceColorArray[it].faces.includes(i)){
                    colors[i] = new THREE.MeshBasicMaterial({color: faceColorArray[it].color, transparent: true, opacity: defaultOpacity===0?0:1})
                    match = true
                    break
                }
                it++
            }
        }
    }
    //potentially needs to be separate, but integrated for now: addition into scene
    let mesh = new THREE.Mesh(geometry, colors)
    mesh.name = name
    groupref.add(mesh)
}

export function makeColorBox(name, groupref, dims, colors, defaultOpacity){
    let box = new THREE.BoxGeometry(dims[0],dims[1],dims[2])
    makeColorMesh(name, groupref, box, [
        {faces: [0,1], color: colors.right},
        {faces: [2,3], color: colors.left},
        {faces: [4,5], color: colors.top},
        {faces: [6,7], color: colors.bottom},
        {faces: [8,9], color: colors.front},
        {faces: [10,11], color: colors.back},
    ], defaultOpacity)
}