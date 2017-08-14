import React from 'react'
import * as THREE from 'three'

import {observable, action } from 'mobx'
import {observer} from 'mobx-react'

import { v3, twn, makeColorBox } from '../../utilities.js'

@observer
export default class Popover extends React.Component {

  @observable groupPos = {x:0,y:0,z:0.2}

  componentDidMount() {
    const windowcolor = {
      front: 0xededed,
      left: 0xccd2d6,
      bottom: 0xededed,
      right: 0xededed,
      top: 0xfbfbfc,
      back: 0xededed,
    }

    makeColorBox('popover', this.refs.popover, [0.6, 0.3, 0.04], windowcolor)
  }

  reset() {
    this.refs.popover.scale.set(0.001, 0.001, 0.25)
    this.refs.popover.visible = false

    // this.refs.shadow.children[0].position.set(0.15, 0.175, 0.11)
    

    // this.refs.popovershadow.material.opacity = 0
    // console.log(this.refs.popovershadow.material.opacity)
  }

  cycleIn() {
    this.reset()

    const store = this.props.store
    const popover = this.refs.popover
    const shadow = this.refs.shadow
    store.bodies.sendbloom.allowSleep = false
    store.bodies.sendbloom.sleeping = false
    store.static = false

    this.refs.popover.visible = true

    this.popoverTweens = [
      twn(
        'observable',
        { x: 0, y: 0 },
        { x: 0.45, y: 0.175 },
        200,
        this.groupPos
      ),
      twn(
        'scale',
        { x: 0.001, y: 0.001, z: 0.25 },
        { x: 1, y: 1, z: 1 },
        200,
        popover.scale
      ),    
      twn(
        'opacity',
        { opacity: 0 },
        { opacity: 1 },
        200,
        shadow.children[0].material
      ),
    ]

    //TODO: these get interrupted, wyd?
    this.timedTransform = setTimeout(() => {
      this.transformTweens = [
        // twn('position', { x: 0.45 }, { x: 0.6 }, 200, popover.position),
        twn('scale', { x: 1 }, { x: 0.5 }, 200, popover.scale),
      ]
    }, 1000)
    this.timedTransform2 = setTimeout(() => {
      this.transformTweens = [
        // twn(
        //   'position',
        //   { x: 0.6, y: 0.175 },
        //   { x: 0.525, y: 0.025 },
        //   250,
        //   popover.position
        // ),
        twn('scale', { x: 0.5, y: 1 }, { x: 0.75, y: 2 }, 250, popover.scale),
      ]
    }, 1800)
  }

  cycleOut() {
    const store = this.props.store
    const popover = this.refs.popover
    store.bodies.sendbloom.allowSleep = false
    store.bodies.sendbloom.sleeping = false
    store.static = false
    // this.refs.popover.visible = false

    if (this.timedTransform) clearTimeout(this.timedTransform)
    if (this.timedTransform2) clearTimeout(this.timedTransform2)
    //TODO: what about stoppping transformTweens set inside of the timeouts???

    this.popoverTweens = [
      // twn(
      //   'position',
      //   { x: popover.position.x, y: popover.position.y },
      //   { x: 0.63, y: 0.35 },
      //   300,
      //   popover.position
      // ),
      twn(
        'scale',
        { x: popover.scale.x, y: popover.scale.y, z: popover.scale.z },
        { x: 0.001, y: 0.001, z: 0.25 },
        300,
        popover.scale
      ),
    ]
  }

  render() {
    return (
      <group ref = "popover" position = {v3(this.groupPos.x,this.groupPos.y,this.groupPos.z)}>
        <resources>
          <texture resourceId = "shadow" url = {require('./shadow2.png')}/>
        </resources>
        <group ref = "shadow" position = {v3(0,0,-0.1)}>
          <mesh>
            <planeGeometry width={0.7} height={0.375} />
            <meshBasicMaterial transparent>
              <textureResource resourceId = "shadow" />
            </meshBasicMaterial>
          </mesh>
        </group>
        
      </group>
    )
  }
}
