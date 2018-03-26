import React from 'react'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

export function v3(x, y, z) {
  return new THREE.Vector3(x||0, y||0, z||0)
}

export function twn(property, start, end, duration, target, options) {
  const tween = new TWEEN.Tween(start).to(end, duration).onUpdate(function() {
    if (options) {
      if (options.onUpdate) options.onUpdate()
      if(options.call) target[options.call](...this)
      if (options.traverseOpacity) {
        target.traverse(child => {
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(child => {
                child.opacity = this.opacity
              })
            } else child.material.opacity = this.opacity
          }
        })
      }
    }
    if (
      property === 'position' ||
      property === 'scale' ||
      property === 'rotation'
    ){
        if(Array.isArray(target)){
            target.forEach((tgt)=>{
                tgt.set(this.x || target.x, this.y || target.y, this.z || target.z)
            })
        }else{
          target.set(this.x || target.x, this.y || target.y, this.z || target.z)
        }
    }
    else {
      //opacity etc.
      const allProps = Object.keys(this)
      allProps.forEach(prop => (target[prop] = this[prop]))
    }
  })
  if (options) {
    if (options.onStart) tween.onStart(options.onStart)
    if (options.onComplete) tween.onComplete(options.onComplete)
    if (options.delay) tween.delay(options.delay)
  }

  tween.start()

  return tween
}

export function makeColorMesh(
  name,
  groupref,
  geometry,
  faceColorArray,
  defaultOpacity
) {
  const faces = geometry.faces
  let colors = []
  console.log('inserting ' + faces.length + '-face geometry into ' + groupref)
  for (var i = 0; i < faces.length; i++) {
    //which range am i in?
    faces[i].materialIndex = i
    let match = false
    let it = 0
    while (!match) {
      //provided lo-hi range to apply a color to
      if (!faceColorArray[it]) {
        //error?
        colors[i] = new THREE.MeshNormalMaterial({
          opacity: defaultOpacity === 0 ? 0 : 1,
          transparent: true,
        })
        // colors[i] = new THREE.MeshBasicMaterial({color: 0xff0000, opacity: defaultOpacity===0?0:1, transparent: true})
        match = true
        break
      }
      if (faceColorArray[it].range) {
        const lo = faceColorArray[it].range[0]
        const hi = faceColorArray[it].range[1]
        if (i >= lo && i <= hi) {
          colors[i] = new THREE.MeshBasicMaterial({
            color: faceColorArray[it].color,
            transparent: true,
            opacity: defaultOpacity === 0 ? 0 : 1,
          })
          match = true
          break
        }
        it++
      } else {
        //variable-length list of indices to apply color to `faces`
        if (faceColorArray[it].faces.includes(i)) {
          colors[i] = new THREE.MeshBasicMaterial({
            color: faceColorArray[it].color,
            transparent: true,
            opacity: defaultOpacity === 0 ? 0 : 1,
          })
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

export function makeColorBox(name, groupref, dims, colors, defaultOpacity) {
  let box = new THREE.BoxGeometry(dims[0], dims[1], dims[2])
  makeColorMesh(
    name,
    groupref,
    box,
    [
      { faces: [0, 1], color: colors.right },
      { faces: [2, 3], color: colors.left },
      { faces: [4, 5], color: colors.top },
      { faces: [6, 7], color: colors.bottom },
      { faces: [8, 9], color: colors.front },
      { faces: [10, 11], color: colors.back },
    ],
    defaultOpacity
  )
}

export function stopAllTweens(tweenArray) {
  if (!tweenArray) return
  if (!Array.isArray(tweenArray)) return
  else {
    tweenArray.forEach(tween => {
      tween.stop()
    })
  }
}

export function makeColliderMesh(physicsModel){
  // console.log(physicsModel)
    const model = physicsModel
    let types
    // if(!model.types && model.type) types = [model.type]
    // else types = model.types

    if(!Array.isArray(model.type)) types = [model.type]
    else types = model.type

    //a physics model in OIMO should have keys:
      // type, size, pos, posShape, move, world, name, config (restitution etc)
      // sizes pos posShape are all arrays for oimo, convert them to xyz objects here?
    // console.log(types)
    const physicsMeshes = types.map((type, i) => {
      const n = i * 3 //this only works if everything is composed of boxes or you issue dummy values
      let pos
      if(!model.posShape) pos = {x:0,y:0,z:0}
      else pos = {
        x:  model.posShape[n] || 0,
        y:  model.posShape[n+1] || 0,
        z:  model.posShape[n+2] || 0
      }
      return {
        geo: type, 
        pos: {
          x: pos.x,
          y:  pos.y,
          z:  pos.z
        },
        size: {
          w: model.size[n] || 0,
          h: model.size[n+1] || 0,
          d: model.size[n+2] || 0,
          r: model.size[n+0] || 0
        },
      }
  })
  return physicsMeshes

}

export function makeEnclosure(volume, position, key){
  //given XYZ volume, create a 5-walled (open-top) enclosure with physics/mesh
  //return an array of objects {x,y,z,w,h,d}
  if(!key) key = ''
  let offset
  if(!position) offset = {x:0,y:volume.y/2,z:0}
  else offset = position

  let bounds = [
    {name: key+'rightwall', x: (volume.x/2)+.5, y: 0, z:0, w: 1, h: volume.y, d: volume.z}, //r
    {name: key+'leftwall', x: -(volume.x/2)-.5, y: 0, z:0, w: 1, h: volume.y, d: volume.z}, //l
    {name: key+'backwall', x: 0, y: 0, z:-(volume.z/2)-.5, w: volume.x, h: volume.y, d: 1}, //b
    {name: key+'frontwall', x: 0, y: 0, z:(volume.z/2)+.5, w: volume.x, h: volume.y, d: 1}, //f
   ]

  bounds.forEach((boundary)=>{
    boundary.x += offset.x
    boundary.y += offset.y 
    boundary.z += offset.z
  })

  return bounds
}
export const cap1st = string => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const rads = degs => {
  return degs * (Math.PI / 180)
}
export const degs = rads => {
  return rads * (180 / Math.PI)
}
export const hashCode = () => {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 7; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};