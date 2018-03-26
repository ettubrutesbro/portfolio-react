import React from 'react'
import { observable, action, autorun } from 'mobx'
import { observer } from 'mobx-react'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

import styles from './Seseme.css'

import { v3 } from '../../helpers/utilities.js'

@observer
export default class Seseme extends React.Component {
  @observable mode = this.props.mode
  @observable tween = null
  @observable plrTweens = [null, null, null, null]

  @observable
  pillars = [
    {
      pos: { x: -0.18, y: -0.25, z: 0.18 },
      quat: new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        -Math.PI / 2
      ),
    },
    { pos: { x: 0.18, y: 0, z: 0.18 } },
    {
      pos: { x: 0.18, y: 0.37, z: -0.18 },
      quat: new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        Math.PI / 2
      ),
    },
    {
      pos: { x: -0.18, y: 0.5, z: -0.18 },
      quat: new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, -1, 0),
        Math.PI
      ),
    },
  ]
  //constructor, loadModels, and componentWillReceiveProps should be
  //generic class function
  constructor(props, context) {
    super(props, context)
    this.loadModels()
  }
  // @action
  loadModels = () => {
    const loader = new THREE.JSONLoader()
    this.pedestal = loader.parse(require('./pedestal.json'))
    this.pillar = loader.parse(require('./pillar.json'))
  }
  componentWillReceiveProps(newProps) {
    if (this.props.mode !== newProps.mode) {
      if (newProps.mode === 'expanded') this.onExpand()
      else if (newProps.mode === 'selected') this.onSelect()
      else if (newProps.mode === 'normal') this.restoreNormal()
    }
  }

  @action
  onSelect = () => {
    let store = this.props.store
    const setYPos = this.setYPos
    const newPositions = [0.1, 0.475, -0.3, 0.27]

    store.bodies.seseme.sleeping = false
    store.static = false

    this.plrTweens.map((plrtween, i) => {
      if (plrtween) plrtween.stop()
      plrtween = new TWEEN.Tween({ y: this.pillars[i].pos.y })
        .to({ y: newPositions[i] })
        .onUpdate(function() {
          setYPos(i, this.y)
        })
        .onComplete(function() {
          store.bodies.seseme.sleeping = true
        })
        .start()
    })
  }
  @action
  restoreNormal = () => {
    let store = this.props.store
    const setYPos = this.setYPos
    const originalPositions = [-0.25, 0, 0.35, 0.475]

    this.props.store.bodies.seseme.sleeping = false
    this.props.store.static = false

    this.plrTweens.map((plrtween, i) => {
      if (plrtween) plrtween.stop()
      plrtween = new TWEEN.Tween({ y: this.pillars[i].pos.y })
        .to({ y: originalPositions[i] })
        .onUpdate(function() {
          setYPos(i, this.y)
        })
        .onComplete(function() {
          // this.props.store.bodies.seseme.sleeping=true
        })
        .easing(TWEEN.Easing.Quadratic.Out)
        .start()
    })
  }

  @action setYPos = (i, y) => (this.pillars[i].pos.y = y)

  render() {

    const mtl = this.props.debugMtl

    const scaleAdjust = new THREE.Vector3(0.08, 0.08, 0.08)
    const pillarPositions = []

    return (
      <group ref="group" position={v3(0, 0.1, 0)}>
        <resources>
          {this.pillar &&
            <geometry
              resourceId="pillar"
              vertices={this.pillar.geometry.vertices}
              faces={this.pillar.geometry.faces}
            />}
        </resources>
        <mesh
          name="seseme"
          position={new THREE.Vector3(0, -1.29, 0)}
          quaternion={new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(1, 0, 0),
            Math.PI / 2
          )}
        >
          <planeBufferGeometry width={0.975} height={0.975} />
          <meshPhongMaterial {...mtl}/>
        </mesh>
        {this.pedestal &&
          <mesh
            position={new THREE.Vector3(0.12, 0.15, 0.1)}
            name="seseme"
            scale={scaleAdjust}
          >
            <geometry
              vertices={this.pedestal.geometry.vertices}
              faces={this.pedestal.geometry.faces}
              // faceVertexUvs = {this.parsedModel.geometry.faceVertexUvs}
              // colors = {this.parsedModel.geometry.colors}
            />
            <meshPhongMaterial {...mtl}/>
          </mesh>}
        {this.pillar &&
          <group>
            {this.pillars.map((p, i) => {
              return (
                <mesh
                  key={'pillar' + i}
                  name="seseme"
                  scale={scaleAdjust}
                  position={new THREE.Vector3(p.pos.x, p.pos.y, p.pos.z)}
                  quaternion={p.quat || null}
                >
                  <geometryResource resourceId="pillar" />
                  <meshPhongMaterial {...mtl}/>
                </mesh>
              )
            })}
          </group>}
      </group>
    )
  }
}
