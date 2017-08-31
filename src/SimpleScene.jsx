import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import React3 from 'react-three-renderer'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import * as OIMO from 'oimo'

import MouseInput from './MouseInput'
const tempVector2 = new THREE.Vector2()

import {findDOMNode} from 'react-dom'
import {debounce} from 'lodash'
import {twn, cap1st, rads, v3} from './utilities'

@observer
export default class SimpleScene extends React.Component{

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
        diagnostic panel
        manual rendering support
            - API must be carefully considered - based on sleeping, etc.
            - must be easy to unset and reset...
        scene restart?
    */

    @observable width = window.innerWidth
    @observable height = window.innerHeight

    world = new OIMO.World({
        timestep: 1/60
    }) 
    bodies = {}
    cameraPosition = v3(0,2,40)

    @observable selected = null
    @observable positions = []
    @observable rotations = []

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
        this.props.children.forEach((child)=>{
                this.positions.push(null) //TODO: watch out for this, feels shaky...
              
        })
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
        const bodies = Object.keys(this.bodies)
        for(var i = 0; i<bodies.length; i++){
            const name = bodies[i]
            const body = this.bodies[name]
            //TODO watch for these indices to get dicey with add / removals...
            this.positions[i] = new THREE.Vector3().copy(body.getPosition())
            this.rotations[i] = new THREE.Quaternion().copy(body.getQuaternion())
        }
    }

    @action addBody = (name, physicsModel) => {
        console.log('adding '+name)
        this.bodies[name] = this.world.add(physicsModel)
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
            console.log('body sleeping?' + body.sleeping)
        })
        .start()
    }
    @action letGoOfBody = (name) =>{
        const body = this.bodies[name]
        body.controlRot = false
        body.isKinematic = false
        body.sleeping = false
    }
    @action removeBody = (name) =>{
        console.log('removing ' + name + ' from oimo/world')
        // this.world.removeRigidBody(this.bodies[name])
        console.log(this.world.rigidBodies)
        this.bodies[name].remove()
        console.log('remaining bodies: ' + this.world.numRigidBodies)
    }
    @action handleClick = evt => {
        const intersect = this.mouseInput._getIntersections(
          tempVector2.set(evt.clientX, evt.clientY)
        )
        if(intersect.length > 0){
            this.selected = intersect[0].object.name
        }
        else{
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
                >
                    <module ref={(module)=>{this.mouseInput = module}} descriptor={MouseInput} />
                    <scene ref = "scene">
                        <perspectiveCamera 
                            name = "camera"
                            ref = {(perspectiveCamera)=>{this.camera = perspectiveCamera}}
                            fov = {30}
                            aspect = {this.width / this.height}
                            near = {1} far = {200}
                            position = {this.cameraPosition}
                        />

                        {React.Children.map(this.props.children, (child,i)=>{

                            const foistedProps = {
                                ...child.props, 
                                position: this.positions[i] || new THREE.Vector3(),
                                rotation: this.rotations[i] || new THREE.Quaternion(),
                                onMount: this.addBody, 
                                unmount: this.removeBody, 
                                mutate: this.modifyBody,
                                force: this.forceAnimateBody,
                                letGo: this.letGoOfBody,
                                selected: this.selected===child.props.name,
                            }

                            return React.cloneElement(
                                child, 
                                foistedProps
                            )
                        })}

                    </scene>
                </React3>

                <div id = 'diagnostic'
                    style = {{position: 'absolute', right: 0, bottom: 0, color: 'white'}}
                >
                    <ul>
                        <li>Bodies: {Object.keys(this.bodies).join(', ')}</li>
                        <li>All Sleeping? {
                            Object.keys(this.bodies).filter((body)=>{
                                return this.bodies[body].sleeping
                            }).length===Object.keys(this.bodies).length? 'yes'
                            : 'no'
                        }</li>
                        <li>Selected: {this.selected || 'n/a'}</li>
                    </ul>

                    <div id = 'button' style = {{background: 'blue', padding: '10px'}}
                        onClick = {this.debugCycleCamera}
                    >
                        Cycle camera position
                    </div>

                </div>
            </div>
        )
    }
}