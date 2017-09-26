import React from 'react'
import * as THREE from 'three'

import { v3, twn, makeColorBox } from '../../helpers/utilities'

export default class Sidebar extends React.Component {
  componentDidMount() {
    const windowcolor = {
      front: 0xededed,
      left: 0xccd2d6,
      bottom: 0xededed,
      right: 0xededed,
      top: 0xfbfbfc,
      back: 0xededed,
    }

    makeColorBox(
      'sendbloom',
      this.refs.sidebar,
      [0.35, 0.925, 0.075],
      windowcolor
    )
    // this.refs.sidebar.position.set(-1,0,0.25)
    this.reset()
  }

  reset() {
    const sidebar = this.refs.sidebar
    this.refs.sidebar.visible = false
    sidebar.scale.set(0.3, 1, 1)
    sidebar.position.set(-0.75, 0, 0.325)
    this.refs.shadow.material.opacity = 0
  }

  cycleIn() {
    this.reset()

    const store = this.props.store
    const sidebar = this.refs.sidebar
    store.bodies.sendbloom.allowSleep = false
    store.bodies.sendbloom.sleeping = false
    store.static = false
    // sidebar.visible = true
    this.sidebarTweens = [
      twn('scale', { x: 0.3 }, { x: 1 }, 250, sidebar.scale, {
        delay: 200,
        onStart: () => {
          sidebar.visible = true
        },
      }),
      twn('position', { x: -0.77 }, { x: -0.55 }, 250, sidebar.position, {
        delay: 200,
      }),
      twn('opacity', { opacity: 0 }, { opacity: 1 }, 250, sidebar, {
        traverseOpacity: true,
        onComplete: () => {
          store.bodies.sendbloom.allowSleep = true
        },
        delay: 200,
      }),
      twn(
        'opacity',
        { opacity: 0 },
        { opacity: 1 },
        200,
        this.refs.shadow.material,
        { delay: 200 }
      ),
      // twn('position', {x:-1})
    ]
  }

  cycleOut() {
    const store = this.props.store
    const sidebar = this.refs.sidebar
    store.bodies.sendbloom.allowSleep = false
    store.bodies.sendbloom.sleeping = false
    store.static = false

    this.sidebarTweens = [
      twn(
        'position',
        { x: -0.55, y: 0 },
        { x: -0.835, y: -0.4625 },
        300,
        sidebar.position
      ),
      twn(
        'scale',
        { x: 1, y: 1, z: 1 },
        { x: 0.001, y: 0.001, z: 0.25 },
        300,
        sidebar.scale
      ),
      twn('opacity', { opacity: 1 }, { opacity: 0 }, 150, sidebar, {
        traverseOpacity: true,
        delay: 150,
      }),
    ]
  }
  unmount() {
    this.refs.sidebar.visible = false
  }
  render() {
    return (
      <group ref="sidebar">
        <mesh
          ref="shadow"
          // position = {v3(-0.55,0.075,0.085)}
          position={v3(0, 0.075, -0.24)}
        >
          <planeBufferGeometry width={0.425} height={0.92} />
          <meshBasicMaterial color={0x000000} transparent />
        </mesh>
      </group>
    )
  }
}
