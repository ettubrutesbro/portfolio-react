import React from 'react'
import {observable, action, toJS} from 'mobx'
import {observer} from 'mobx-react'

import React3 from 'react-three-renderer'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import * as OIMO from 'oimo'

import MouseInput from '../../helpers/MouseInput'
const tempVector2 = new THREE.Vector2()

import {findDOMNode} from 'react-dom'
import {debounce, flatten} from 'lodash'
import {twn, cap1st, rads, v3} from '../../helpers/utilities'
import ThreePointLights from './ThreePointLights'

// import {toJS} from 'mobx'
// console.log(toJS)

@observer
export default class InteractiveScene extends React.Component{

    /* basic scene should contain:
        physics 
            - a store for rotation and positions of objects
        TENTATIVE
        mouseinput / picking 
            - tell children through props when they are clicked / selected / etc.
            - parent App needs to know, too. 
        responsive support
            - resize should affect canvas, etc. 
            - mousepicking changes too
            - design reconsiderations at mobile resolution, etc.? 

        TODO
        debug camera control
        manual rendering support
            - API must be carefully considered - based on sleeping, etc.
            - must be easy to unset and reset...
        scene restart?
    */

    @observable width = window.innerWidth
    @observable height = window.innerHeight

    world = new OIMO.World({
        timestep: 1/60,
        iterations: 15,
    }) 
    bodies = {}
    cameraPosition = v3(0,2,40)

    @observable selected = null
    @observable positions = new Map()
    @observable rotations = new Map()

    componentDidMount(){
        this.initStore()
        window.addEventListener('resize', this.handleResize)
    }
    componentWillReceiveNewProps(newProps){
        const {width, height } = this.props
        if(newProps.width !== width || newProps.height !== height){
            console.log('width / height props changed')
            // if(physics.static) physics.static = false // so that canvas can adjust if sleeping
            this.handleResize()
        }
    }

    @action initStore = () => {
        //flatmap children

    }

    @action onAnimate = () => {
        const { mouseInput, camera } = this
        if (!mouseInput.isReady()) {
            const { scene, container } = this.refs
            mouseInput.ready(scene, container, camera)
            mouseInput.setActive(false)
        }

        this.world.step()
        TWEEN.update()
        // console.log(this.positions)

        // console.log(positions)
        // console.log(this.positions)


        const positionKeys = this.positions.keys()
        for(var i = 0; i<positionKeys.length; i++){
            // console.log(positionKeys[i])
            const name = positionKeys[i]
            const newPos = this.bodies[name].getPosition()
            const newRot = this.bodies[name].getQuaternion()
            // console.log(newPos)
            // console.log(this.positions.values[name])
            // const position = this.positions[name]
            // const rotation = this.rotations[name]
            
            //this would be good but you need this function to set the position of
            //non-dynamic bodies at least ONCE - was breaking showCollider for
            // boundaries
            // if(!body.isDynamic) continue

            //crude sleep
            // const velocities = Object.values(body.linearVelocity).concat(Object.values(body.angularVelocity))
            // if(velocities.find((v)=>{return Math.abs(v) > 0.025})){ } // do nothing
            // else body.sleep()

            //TODO watch out for these indices to get dicey with add / removals...
            // console.log(this.positions[name])
            // const newPos = new THREE.Vector3().copy(this.positions[name])
            this.positions.set(name, newPos)
            this.rotations.set(name, newRot)
            // console.log(this.positions.get(name))
            // console.log(this.positions.get(name))
            // // console.log(this.positions[name].y)
            // this.rotations.set(name, new THREE.Quaternion().copy(rotation))

            //threshold sleeping = no infinite abysses
                //TODO: this threshold # should be a prop or something
            // if(this.positions[name].y < -20){
            //     body.sleep()
            // }
        }
    }

    @action addBody = (name, physicsModel, isSelectable) => {
        console.log('adding '+name)
        // console.log('@pos: ')
        console.log('@pos: '+ physicsModel.pos)
        this.bodies[name] = this.world.add(physicsModel)
        this.positions.set(name, new THREE.Vector3().copy(this.bodies[name].getPosition()))
        this.rotations.set(name, new THREE.Quaternion().copy(this.bodies[name].getQuaternion()))
        // this.rotations[name] = new THREE.Quaternion().copy(this.bodies[name].getQuaternion())
        if(isSelectable) this.bodies[name].isSelectable = true
    }
    modifyBody = (name, propOrFunctionCall, parameters, isFunction) => {
        console.log('mutating: ' + name, ' prop/function ' + propOrFunctionCall + '(' + parameters + ')')
        if(!isFunction) this.bodies[name][propOrFunctionCall] = parameters
        else this.bodies[name][propOrFunctionCall](...parameters)
    }
    @action forceAnimateBody = (name, property, goal, duration) => {
        //can force animate position or rotation
        const body = this.bodies[name]
        const object = property==='position'? 'position' : 'quaternion'
        if(!duration) duration = 500
        const current = body['get'+cap1st(object)]()
        
        let start = {x: current.x, y: current.y, z: current.z, w: current.w}
        let end
        if(property==='position'){
            end = {
                x: !goal.x && goal.x!==0? current.x : goal.x, 
                y: !goal.y && goal.y!==0? current.y : goal.y, 
                z: !goal.z && goal.z!==0? current.z : goal.z
            }
        }
        else if(property==='rotation'){ 
            end = body.getQuaternion().clone().setFromEuler(
                rads(goal.x), rads(goal.y), rads(goal.z)
            )
        }
        
        if(body[property+'Tween']) body[property+'Tween'].stop()

        body[property+'Tween'] = new TWEEN.Tween(start).to(end, duration)
        .onUpdate(function(){
            if(property==='position') body.setPosition({x:this.x, y: this.y, z: this.z})
            else body.setQuaternion({x:this.x,y:this.y,z:this.z,w:this.w})
        }).onStart(function(){
            body.allowSleep = false
            body.sleeping = false
        }).onComplete(function(){
            body.allowSleep = true
            body.sleeping = true
        })
        .start()
    }
    @action restoreBodies = (wasSelected) => {
        const bodies = Object.keys(this.bodies)
        for(var i = 0; i<bodies.length; i++){
            const name = bodies[i]
            if(wasSelected === name) continue
            const body = this.bodies[name]

            body.awake()
            //TODO: randomize x position and some rotation stuff?
                //also be using the enclosure's aperture as guiding constant here
            body.setPosition({x: (Math.random() * 6) - 3, y: 15+i*3.5, z: 0})
            setTimeout(()=>{this.letGoOfBody(name)}, 100)
        }
    }
    @action letGoOfBody = (name) =>{
        const body = this.bodies[name]
        body.controlRot = false
        body.isKinematic = false
        body.sleeping = false
    }
    @action removeBody = (name) =>{
        console.log('removing ' + name + ' from oimo/world')
        // console.log(this.positions.length)
        // this.world.removeRigidBody(this.bodies[name])
        console.log(this.world.rigidBodies)
        this.bodies[name].remove()
        // console.log(this.positions.length)
        console.log('remaining bodies: ' + this.world.numRigidBodies)
    }
    @action handleClick = evt => {
        const intersect = this.mouseInput._getIntersections(
          tempVector2.set(evt.clientX, evt.clientY)
        )

        //logic here is confusing TODO
        let selection = null
        if(intersect.length > 0){ //user clicked something
            const target = intersect[0].object.name
            if(!this.bodies[target].isSelectable){ //non-selectable target
                if(this.selected && this.props.onDeselect) this.props.onDeselect()
                if(this.selected) this.restoreBodies()
                this.selected = null
            }
            else{
                this.selected = intersect[0].object.name
                if(this.props.onSelect) this.props.onSelect(this.selected)   
            }
        }
        else{ //user clicked empty space
            if(this.selected && this.props.onDeselect) this.props.onDeselect()
            if(this.selected) this.restoreBodies(this.selected)
            this.selected = null
        }
        console.log('selected: ' + this.selected)
    }
    @action handleResize = debounce(() =>{
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.mouseInput.containerResized()
    },50)

    @action debugCycleCamera = () => {

        if(this.camera.position.z === 10) this.cameraPosition = v3(0,2,22)
        else if(this.camera.position.z === 22) this.cameraPosition = v3(0,2,10)
    }

    render(){

        // const {positions, rotations, bodies} = this

        const {debugCamPos} = this.props

        const positions = toJS(this.positions)
        const rotations = this.rotations.toJS()
        // console.log(this.positions.toJS())
        // console.log(this.positions)
        console.log(positions)

        const debugCameraPos = v3(debugCamPos.x, debugCamPos.y, debugCamPos.z)

        return(
            <div 
                ref = "container"
                onClick = {this.handleClick}
            >
                <React3
                    mainCamera = "camera"
                    width = {this.width}
                    height = {this.height}
                    onAnimate = {this.onAnimate}
                    clearColor = {this.props.background}
                >
                    <module ref={(module)=>{this.mouseInput = module}} descriptor={MouseInput} />
                    <scene ref = "scene">
                        <perspectiveCamera 
                            name = "camera"
                            ref = {(perspectiveCamera)=>{this.camera = perspectiveCamera}}
                            fov = {30}
                            aspect = {this.width / this.height}
                            near = {1} far = {200}
                            position = {!this.props.debug? this.cameraPosition : debugCameraPos}
                        />

                        {this.props.lights}

                        { /* physics-enabled children only */
                            React.Children.map(this.props.children, (child,i)=>{
                                const name = child.props.name
                                // console.log(positions[name])
                                const newPos = i >= Object.keys(positions).length? v3(0,0,0) : 
                                v3().copy(positions[name])

                                // console.log(newPos)
                                // console.log(v3().copy(newPos))
                                // console.log(name + ' @ position ' + newPos)
                                // console.log(newPos)
                                const positionRotation = {position: newPos, rotation: new THREE.Quaternion()}

                                const foistedProps = {
                                    ...child.props, 
                                    ...positionRotation,
                                    // position: this.positions[i] || new THREE.Vector3(),
                                    // rotation: this.rotations[i] || new THREE.Quaternion(),
                                    // position: v3(0,0,0),
                                    // rotation: new THREE.Quaternion(),
                                    onMount: this.addBody, 
                                    unmount: this.removeBody, 
                                    mutate: this.modifyBody,
                                    force: this.forceAnimateBody,
                                    letGo: this.letGoOfBody,
                                    selected: this.selected===child.props.name?true:this.selected?'other':false,
                                }

                                return React.cloneElement(
                                    child, 
                                    foistedProps
                                )
                            })
                        }

                    </scene>
                </React3>
                {this.props.debug && 
                <div id = 'diagnostic'
                    style = {{
                        backgroundColor: 'black',
                        position:'absolute', 
                        right: 0, 
                        bottom: 0, 
                        color: 'white'
                    }}
                >
                    <ul>
                        <li>Awake dynamic bodies: {
                            Object.keys(this.bodies).filter((body)=>{
                                return !this.bodies[body].sleeping && this.bodies[body].isDynamic
                            })
                        }</li>

                        <li>Selected: {this.selected || 'n/a'}</li>
                    </ul>

                    <div id = 'button' style = {{background: 'blue', padding: '10px'}}
                        onClick = {this.debugCycleCamera}
                    >
                        Cycle camera position
                    </div>

                </div>
                }
            </div>
        )
    }

}


    InteractiveScene.defaultProps = {
        background: 0x000000,
        defaultLighting: false,
        lights: null,
        debugCamPos: {x: 0, y: 0, z: 0}
    }