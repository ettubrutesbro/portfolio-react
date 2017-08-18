
import React from 'react'
import React3 from 'react-three-renderer'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'

import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import * as OIMO from 'oimo'

import MouseInput from './MouseInput'
const tempVector2 = new THREE.Vector2()

// import { Debug, ThreePhysicsStore } from '../Store'
import { rads, v3 } from './utilities.js'
import ProjectGroup from './Projects/ProjectGroup'
import styles from './Projects/ProjectHeap.css'

import {nonCollisionGroup, normalCollisions, collidesWithAll} from './constants.js'


// const physics = new ThreePhysicsStore()
// window.world = physics

@observer
export default class World extends React.Component {

  @observable static = false

  @observable world = new OIMO.World()
  @observable walls = []
  @observable bodies = {}
  @observable groups = []

  @observable mouseInput = null
  @observable eligibleForClick = []
  @observable projectsReady = false
  @observable renderTrigger = null

  @observable cameraPosition = new THREE.Vector3(0, 2, 10)

  constructor(props, context) {
    super(props, context)

    this.lightPosition = new THREE.Vector3(0, 10, 0)
    this.lightTarget = new THREE.Vector3(0, 2, 0)

    const sizeConstant = 8 //set through debug / settings / other
    const world = this.world

    this.establishConstraints = reestablish => {
      if (reestablish) this.batchConstraintAction('remove', [])

      this.ground = world.add({
        type: 'box',
        size: [sizeConstant, 10, sizeConstant],
        pos: [0, -5, 0],
        friction: 0.6,
        belongsTo: normalCollisions,
        collidesWith: collidesWithAll,
      })

      //add walls (left, right, back, front)
      const wallSizes = [
        [1,100,sizeConstant],
        [1,100,sizeConstant],
        [sizeConstant, 100, 1],
        [sizeConstant, 100, 1],
      ]
      const wallPositions = [[-(sizeConstant/2),0,0], [sizeConstant/2,0,0], [0,0,-3], [0,0,0.5]]
      for(var i = 0; i<4; i++){
        this.walls[i] = world.add({
          type: 'box',
          size: wallSizes[i],
          pos: wallPositions[i],
          belongsTo: normalCollisions,
          collidesWith: collidesWithAll,
        })
      }

      if (reestablish) {
        this.batchConstraintAction('setupMass', [0x2, false])
        this.restoreLostBodies()
      }
    }
    this.batchConstraintAction = (funcCall, parameters, equals, newVal) => {
      if (!equals) {
        this.ground[funcCall](...parameters)
        this.walls[0][funcCall](...parameters)
        this.walls[1][funcCall](...parameters)
        this.walls[2][funcCall](...parameters)
        this.walls[3][funcCall](...parameters)
      } else {
        this.ground[funcCall] = newVal
        this.walls[0][funcCall] = newVal
        this.walls[1][funcCall] = newVal
        this.walls[2][funcCall] = newVal
        this.walls[3][funcCall] = newVal
      }
    }
    this.establishConstraints()

    // physics.roof = world.add({
    //   size: [sizeConstant, 10, sizeConstant],
    //   pos: [0, 40, 0],
    //   belongsTo: normalCollisions,
    //   collidesWith: collidesWithAll,
    // })

    Object.defineProperty(this.ground, 'belongsTo', {
      get: function() {
        return this.shapes.belongsTo
      },
      set: function(newBits) {
        this.shapes.belongsTo = newBits
      },
    })
  }

  componentDidUpdate(newProps) {
    const { width, height } = this.props
    if (width !== newProps.width || height !== newProps.height) {
      if (this.static) this.static = false
      this.resizeForInput()
    }
  }
  resizeForInput = () => {
    this.refs.mouseInput.containerResized()
  }

  @action
  setReady = () => {
    console.log('item ready')
    this.projectsReady++
    if (this.projectsReady === this.props.projects.length) {
      console.log('all items ready')
    }
  }

  onCreateGroup = (group, index) => (this.eligibleForClick[index] = group)
  createManualRenderTrigger = trigger => (this.renderTrigger = trigger)

  @action
  animate = () => {
    // console.log('anim')
    if (this.projectsReady === this.props.projects.length) {
      const { mouseInput, camera } = this.refs
      if (!mouseInput.isReady()) {
        const { scene, container } = this.refs
        mouseInput.ready(scene, container, camera)
        mouseInput.setActive(false)
      }
      if (this.mouseInput !== mouseInput) this.mouseInput = mouseInput

      this.world.step()

      let numberOfSleepingBodies = 0
      const projects = this.props.projects

      for (var i = 0; i < projects.length; i++) {
        const name = projects[i].name
        if (!this.bodies[name].sleeping) {
          const newPos = this.bodies[name].getPosition()
          this.groups[i].position = new THREE.Vector3().copy(newPos)
          this.groups[i].rotation = new THREE.Quaternion().copy(
            this.bodies[name].getQuaternion()
          )
          if (newPos.y < -10) {
            //TODO: eliminates need for physical basement, might need adjust
            this.bodies[name].sleeping = true
          }
        }
        if (this.bodies[name].sleeping) {
          numberOfSleepingBodies++
        }
      }

      if (numberOfSleepingBodies === projects.length) {
        console.log('all are asleep, pausing render')
        this.static = true
      }
      TWEEN.update()
    }
  }

  impulse = (body, vector, wonky) => {
    const force = vector ? vector : [0, 1, 0]
    if (!wonky) {
      body.applyImpulse(
        body.getPosition(),
        new THREE.Vector3(force[0], force[1], force[2])
      )
    } else
      body.applyImpulse(
        new THREE.Vector3(force[0], force[1], force[2]),
        body.getPosition()
      )
    body.linearVelocity.scaleEqual(0.9)
    body.angularVelocity.scaleEqual(0.35)
  }

  forceMove = (body, coords, duration) => {
    const bodypos = body.getPosition()
    const start = { x: bodypos.x, y: bodypos.y, z: bodypos.z }

    if (!duration) {
      //dynamic duration
      const startVector = new THREE.Vector3().copy(bodypos)
      const endVector = new THREE.Vector3(coords.x, coords.y, coords.z)
      duration = startVector.distanceTo(endVector) * 100 + 125
    }

    body.moveTween = new TWEEN.Tween(start)
      .to({ x: coords.x, y: coords.y, z: coords.z }, duration)
      .onUpdate(function() {
        body.sleeping = false
        body.setPosition({ x: this.x, y: this.y, z: this.z })
      })
      .onComplete(() => {
        body.sleeping = true
      }) //unset body.controlPos?
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
  }

  forceRotate = (body, targetRotation, duration) => {
    const start = body.getQuaternion().clone()
    const tgt = body
      .getQuaternion()
      .clone()
      .setFromEuler(
        rads(targetRotation.x),
        rads(targetRotation.y),
        rads(targetRotation.z)
      )

    if (!duration) {
      //dynamic duration
      const startEuler = new THREE.Euler()
        .setFromQuaternion(new THREE.Quaternion().copy(start))
        .toVector3()
      const endEuler = new THREE.Euler()
        .setFromQuaternion(new THREE.Quaternion().copy(tgt))
        .toVector3()
      duration = startEuler.distanceTo(endEuler) * 90 + 50
      console.log(duration)
    }

    body.rotationTween = new TWEEN.Tween(start)
      .to(tgt, duration)
      .onUpdate(function() {
        body.sleeping = false
        body.setQuaternion({
          x: this.x,
          y: this.y,
          z: this.z,
          w: this.w,
        })
      })
      .onComplete(() => {
        body.sleeping = true
        // body.controlRot=true
      })
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
  }

  @action //only mobx'd because it manipulates store's static boolean
  moveCamera = (newPos, duration) => {
    //direct manipulation
    const camera = this.refs.camera
    const current = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    }
    this.static = false
    if (this.cameraTween) this.cameraTween.stop()
    this.cameraTween = new TWEEN.Tween({
      x: current.x,
      y: current.y,
      z: current.z,
    })
      .to({ x: newPos.x, y: newPos.y, z: newPos.z }, 600)
      .onUpdate(function() {
        if (this.static) this.static = false
        camera.position.set(this.x, this.y, this.z)
        camera.updateProjectionMatrix()
      })
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
  }
  @action
  lookAt = (position, origin, zoom) => {
    const camera = this.refs.camera
    // const bodyPos = body? new THREE.Vector3().copy(body.getPosition()) : new THREE.Vector3()
    const startRotation = new THREE.Euler().copy(camera.rotation)
    const startPosition = new THREE.Vector3().copy(camera.position)
    let endRotation
    if (position) {
      if (origin) camera.position.copy(origin)
      camera.lookAt(position)
      endRotation = new THREE.Euler().copy(camera.rotation)
      camera.rotation.copy(startRotation)
    } else {
      if (origin) camera.position.copy(startPosition)
      endRotation = new THREE.Euler()
    }

    console.log(startRotation, endRotation)
    this.static = false
    this.cameraRotationTween = new TWEEN.Tween({
      x: startRotation.x,
      y: startRotation.y,
      z: startRotation.z,
      zoom: camera.zoom,
    })
      .to(
        {
          x: endRotation.x,
          y: endRotation.y,
          z: endRotation.z,
          zoom: zoom || 1,
        },
        600
      )
      .onUpdate(function() {
        if (this.static) this.static = false
        camera.zoom = this.zoom
        camera.rotation.set(this.x, this.y, this.z)
        camera.updateProjectionMatrix()
      })
      // .onComplete(function(){ this.static = true })
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
  }

  reenablePhysics = body => {
    body.controlRot = false
    body.isKinematic = false
    body.sleeping = false
  }

  phaseConstraints = () => {
    this.batchConstraintAction(
      'belongsTo',
      null,
      true,
      nonCollisionGroup
    )
    this.batchConstraintAction('setupMass', [0x1, true])
  }

  restoreLostBodies = () => {
    //map through all bodies that are below a certain Y coord (-10)
    const sizeConstant = 8
    const allBodies = Object.keys(this.bodies)

    allBodies.forEach((key, i) => {
      const body = this.bodies[key]
      // console.log(body.getPosition())
      if (body.position.y < -1) {
        //TODO: more foolproof version of this.
        console.log(key + ' restored')
        // const oldPos=body.getPosition()
        if (body.sleeping) body.sleeping = false
        body.setPosition({
          x: (Math.random() * sizeConstant - sizeConstant / 2) * 0.25,
          y: sizeConstant + i * 2,
          z: -0.75,
        })
        body.setRotation({
          x: Math.random() * 30 - 15,
          y: Math.random() * 30 - 15,
          z: Math.random() * 30 - 15,
        })
        setTimeout(() => this.reenablePhysics(body), 100 + i * 50)
      }
    })
  }

  handleClick = evt => {
    console.log('clicked')
    const intersect = this.mouseInput._getIntersections(
      tempVector2.set(evt.clientX, evt.clientY)
    )
    if (this.props.store.selectedProject === null && intersect.length > 0) {
      if (
        !intersect[0].object ||
        !intersect[0].object.name ||
        !this.bodies[intersect[0].object.name]
      ) {
        console.log(intersect[0].object.name)
        console.log(
          'target doesnt have name or isnt registered in physics bodies'
        )
        return
        // }
        // if(intersect[0].object.name === this.props.store.selectedProject){ //expansion
        //     console.log('expand ', intersect[0].object.name)
      } else {
        //selection
        const index = Object.keys(this.bodies).indexOf(
          intersect[0].object.name
        )
        if (this.props.projects[index].selected) {
          //custom selection object specifies rotation / position / other
          const custom = this.props.projects[index].selected
          const pos = custom.position
          const rot = custom.rotation
          const cam = custom.camera
          this.select(this.bodies[intersect[0].object.name], pos, rot, cam)
        } else {
          this.select(this.bodies[intersect[0].object.name])
        }
      }
    } else if (intersect.length > 0) {
      //something is already selected
      if (intersect[0].object.name === this.props.store.selectedProject) {
        const index = Object.keys(this.bodies).indexOf(
          intersect[0].object.name
        )
        if (this.props.projects[index].expandable) {
          console.log('expand', intersect[0].object.name)
        } else console.log('not gonna expand', intersect[0].object.name)
      }
    } else {
      if (intersect.length === 0) this.unselect()
    }
  }

  @action
  select = (body, selectPosition, selectRotation, selectCamera) => {
    if (this.static) this.static = false
    this.props.store.selectedProject = body.name

    if (selectCamera) this.moveCamera(selectCamera.position, 600)
    // else this.moveCamera({x: 1, y: 1.5, z: 8}, 500)

    const position = selectPosition || {
      x: 0,
      y: 1.5,
      z: body.getPosition().z,
    }
    const rotation = selectRotation || { x: 0, y: 0, z: 0 }

    this.phaseConstraints()
    body.setPosition(body.getPosition())
    // console.log('what?')
    // how to get the
    this.forceRotate(body, rotation)
    this.forceMove(body, position)
    this.lookAt(
      position,
      selectCamera ? selectCamera.position : new THREE.Vector3(0,2,10),
      selectCamera ? selectCamera.zoom : ''
    )
  }
  @action
  unselect = () => {
    if (this.props.store.selectedProject) {
      if (this.static) this.static = false
      this.moveCamera(this.defaultCameraPosition, 500)
      this.lookAt() //TODO: default camera target

      const selected = this.bodies[this.props.store.selectedProject]
      console.log(selected)
      const weight = selected.mass * 2 - 10
      const randomVector = [
        Math.random() * weight - weight * 2,
        Math.random() * weight - weight * 2,
        Math.random() * weight - weight * 2,
      ]
      this.establishConstraints(true)
      this.reenablePhysics(selected)
      this.impulse(selected, randomVector, true)
      this.props.store.selectedProject = null
    }
  }

  expand = () => {}
  unexpand = () => {}

  render() {
    const sizeConstant = 8
    const orthographicAspectHeight =
      sizeConstant * (this.props.height / this.props.width)
    console.log(orthographicAspectHeight)
    const projectGroups = this.props.projects.map((project, i) => {
      this.onCreateGroup.bind(this, i)
      return (
        <ProjectGroup
          debug={true}
          key={project.name + 'Group'}
          project={project}
          index={i}
          onReady={this.setReady}
          mouseInput={this.mouseInput}
          world = {this.world}
          bodies = {this.bodies}
          groups = {this.groups}
          // isSelected={this.props.store.selectedProject === project.name}
          // isExpanded={this.props.store.expandedProject === project.name}
        />
      )
    })

    return (
      <div
        ref="container"
        onClick={this.handleClick}
        style={this.props.style}
        className={[
          styles.container,
          // this.props.store.selectedProject ? styles.selected : '',
        ].join(' ')}
        onTransitionEnd={this.resizeForInput}
      >
        <React3
          alpha
          // clearColor={0xfbfbfc}
          mainCamera="camera"
          width={this.props.width}
          height={this.props.height}
          onAnimate={this.animate}
          forceManualRender={this.static}
          onManualRenderTriggerCreated={this.createManualRenderTrigger}
          antialias
        >
          <module ref="mouseInput" descriptor={MouseInput} />
          <scene ref="scene">
            {
              <perspectiveCamera
                name="camera"
                ref="camera"
                fov={30}
                aspect={this.props.width / this.props.height}
                near={3}
                far={100}
                position={this.cameraPosition}
                quaternion={this.cameraQuaternion}
              />
            }
            {
              <group>
                <mesh quaternion={new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(1,0,0), -Math.PI/2
                  )}>
                  <planeBufferGeometry
                    width={sizeConstant}
                    height={sizeConstant}
                  />
                  <meshBasicMaterial color={0xd7d7d7} />
                </mesh>

                <mesh position={v3().copy(this.walls[0].getPosition())} >
                  <boxGeometry width={1} height={10} depth={sizeConstant} />
                  <meshBasicMaterial color={0xff0000} />
                </mesh>

                <mesh position={v3().copy(this.walls[1].getPosition())} >
                  <boxGeometry width={1} height={10} depth={sizeConstant} />
                  <meshBasicMaterial color={0x0000ff} />
                </mesh>
                <mesh position={v3().copy(this.walls[2].getPosition())} >
                  <boxGeometry width={sizeConstant} height={10} depth={1} />
                  <meshBasicMaterial
                    color={0xffffff}
                    transparent
                    opacity={0.3}
                  />
                </mesh>
                <mesh position={v3().copy(this.walls[3].getPosition())} visible = {false}>
                  <boxGeometry width={sizeConstant} height={10} depth={1} />
                  <meshBasicMaterial color={0x550055} transparent />
                </mesh>
              </group>
            }

            {projectGroups}
          </scene>
        </React3>
      </div>
    )
  }
}