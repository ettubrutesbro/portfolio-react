import React from 'react'
import * as THREE from 'three'

import { v3, twn, makeColorBox, makeColorMesh, rads } from '../../utilities.js'

export default class BottomBar extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.loadModels()
  }
  componentDidMount() {
    const actionblue = {
      front: 0x39aef8,
      left: 0x3b8bb8,
      bottom: 0x3b8bb8,
      right: 0x3b8bb8,
      top: 0x66ccff,
      back: 0x3b8bb8,
    }
    const bottombar = this.refs.bottombar
    const windowcolor = {
      front: 0xededed,
      left: 0xccd2d6,
      bottom: 0xededed,
      right: 0xededed,
      top: 0xfbfbfc,
      back: 0xededed,
    }

    makeColorBox('sendbloom', bottombar, [1.6, 0.1, 0.1], windowcolor)

    this.reset()
    makeColorBox('sendbloom', this.refs.button, [0.3, 0.06, 0.05], actionblue)
    makeColorBox(
      'sendbloom',
      this.refs.pointer,
      [0.05, 0.05, 0.05],
      actionblue,
      0
    )
    makeColorMesh('sendbloom', this.refs.message, this.dialog.geometry, [], 0)
    const cyl = new THREE.CylinderGeometry(0.03, 0.03, 0.02, 10)
    makeColorMesh('sendbloom', this.refs.selectcylinder1, cyl, [])
  }

  loadModels = () => {
    const loader = new THREE.JSONLoader()
    this.dialog = loader.parse(require('./dialogbox.json'))
  }

  reset() {
    const bottombar = this.refs.bottombar
    bottombar.visible = false
    bottombar.position.set(0, -0.4, 0.09)
    bottombar.scale.set(1, 0.001, 1)

    this.refs.message.position.set(0.54, 0.07, 0.03)
    this.refs.button.position.set(0.6, 0, 0.01)
    this.refs.button.visible = true
    this.refs.message.scale.set(1, 0.001, 1)
    this.refs.message.visible = false

    // this.refs.pointer.position.set(-0.57, 0.075, 0.1) //bottombar1
    this.refs.pointer.position.set(-0.65, 0.25, 0.01)
    this.refs.pointer.visible = false

    this.refs.selectcylinder1.position.set(-0.58, 0.25, -0.01)
    // this.refs.pointer.position.set(.5, -0.2, 0.22) //bottombar2(textfield)
    // this.refs.pointer.position.set(0.5, .2, 0.13)

    // const store = this.props.store
    // store.bodies.sendbloom.allowSleep = true
  }

  cycleIn() {
    this.reset()

    const store = this.props.store
    const bottombar = this.refs.bottombar
    const button = this.refs.button
    const message = this.refs.message
    const pointer = this.refs.pointer
    store.bodies.sendbloom.allowSleep = false
    store.bodies.sendbloom.sleeping = false
    store.static = false

    bottombar.visible = true
    this.bottomTweens = [
      twn('position', { y: -0.4 }, { y: -0.35 }, 250, bottombar.position),
      twn('opacity', { opacity: 0 }, { opacity: 1 }, 250, bottombar, {
        traverseOpacity: true,
      }),
      twn('scale', { y: 0.001 }, { y: 1 }, 250, bottombar.scale),
      //pointer moves from prospect check to textfield
      twn(
        'position',
        { x: -0.65, y: 0.25 },
        { x: -0.57, y: 0.4075 },
        175,
        pointer.position,
        {
          delay: 425,
          onStart: () => {
            pointer.visible = true
          },
        }
      ),
      twn(
        'position',
        { x: -0.57, y: 0.4075, z: 0.01 },
        { x: 0.5, y: 0.2, z: 0.13 },
        300,
        pointer.position,
        { delay: 1000 }
      ),

      //bottom and speech bubble thing come out
      twn('position', { z: 0.01 }, { z: 0.055 }, 250, button.position, {
        delay: 350,
      }),
      twn('position', { y: 0.07 }, { y: 0.12 }, 250, message.position, {
        delay: 500,
        onStart: () => {
          message.visible = true
        },
      }),
      // twn('opacity',{opacity:0},{opacity:1},200,message,{delay:400, traverseOpacity: true}),
      twn('scale', { y: 0.001 }, { y: 1 }, 250, message.scale, { delay: 500 }),
    ]
  }
  cycleOut() {
    const store = this.props.store
    const bottombar = this.refs.bottombar
    const button = this.refs.button
    const message = this.refs.message
    store.bodies.sendbloom.allowSleep = false
    store.bodies.sendbloom.sleeping = false
    store.static = false

    this.bottomTweens = [
      twn('position', { z: 0.055 }, { z: 0.01 }, 175, button.position, {
        delay: 50,
        onComplete: () => {
          button.visible = false
        },
      }),
      twn('position', { y: 0.12 }, { y: 0.07 }, 175, message.position, {
        onComplete: () => {
          message.visible = false
        },
      }),
      twn('scale', { y: 1 }, { y: 0.001 }, 175, message.scale),
      twn(
        'position',
        { x: bottombar.position.x },
        { x: 0.8 },
        400,
        bottombar.position,
        { delay: 150 }
      ),
      twn('opacity', { opacity: 1 }, { opacity: 0 }, 250, bottombar, {
        traverseOpacity: true,
        delay: 200,
      }),
      twn('scale', { x: 1 }, { x: 0.0001 }, 400, bottombar.scale, {
        delay: 150,
        onComplete: () => {
          bottombar.visible = false
        },
      }),
    ]
  }
  sendbloomUnmount() {
    this.refs.bottombar.visible = false
  }
  render() {
    return (
      <group ref="bottombar">
        <mesh ref="shadow" position={v3(-0.005, 0.15, 0.0)}>
          <planeBufferGeometry width={1.6} height={0.2} />
          <meshBasicMaterial color={0x000000} transparent />
        </mesh>
        <group ref="button" />
        <group ref="message" />
        <group ref="pointer" />

        <group
          ref="selectcylinder1"
          rotation={new THREE.Euler(rads(90), 0, 0)}
        />
        <group ref="selectcylinder2" />
      </group>
    )
  }
}
