import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import React3 from 'react-three-renderer'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import * as OIMO from 'oimo'

import MouseInput from './MouseInput'
const tempVector2 = new THREE.Vector2()


import {twn, camelize, rads} from './utilities'

@observer
export default class SimpleScene extends React.Component{

    /* basic scene should contain:
        physics 
            - a store for rotation and positions of objects

        TODO
        mouseinput / picking 
            - tell children through props when they are clicked / selected / etc.
            - parent App needs to know, too. 
        responsive support
            - resize should affect canvas, etc. 
            - design reconsiderations at mobile resolution, etc.? 
        manual rendering support
            - API must be carefully considered - based on sleeping, etc.
            - must be easy to unset and reset...
        scene restart?
    */

    world = new OIMO.World() 
    bodies = {}

    @observable selected = null
    @observable positions = []
    @observable rotations = []

    componentDidMount(){
        this.initStore()
    }

    handleClick = evt => {
        const intersect = this.mouseInput._getIntersections(
          tempVector2.set(evt.clientX, evt.clientY)
        )
        console.log(intersect)

    }

    @action initStore = () => {
        this.props.children.forEach((child)=>{
            if(!child.props.static){
                this.positions.push(null) //TODO: watch out for this, feels shaky...
             }
        })
    }

    @action onAnimate = () => {

        const { mouseInput, camera } = this.refs
          if (!mouseInput.isReady()) {
            const { scene, container } = this.refs
            // console.log( scene)
            mouseInput.ready(scene, container, camera)
            mouseInput.setActive(false)
          }
          if (this.mouseInput !== mouseInput) this.mouseInput = mouseInput

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
        const current = body['get'+camelize(object)]()
        
        let start = {x: current.x, y: current.y, z: current.z, w: current.w}
        let end
        if(property==='position'){
            end = {x: goal.x || current.x, y: goal.y || current.y, z: goal.z || current.z}
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
    @action removeBody = (name) =>{
        console.log('removing ' + name + ' from oimo/world')
        // this.world.removeRigidBody(this.bodies[name])
        console.log(this.world.rigidBodies)
        this.bodies[name].remove()
        console.log('remaining bodies: ' + this.world.numRigidBodies)
    }

    render(){
        return(
            <div 
                ref = "container"
                onClick = {this.handleClick}
            >
                <React3
                    mainCamera = "camera"
                    width = {window.innerWidth}
                    height = {window.innerHeight}
                    onAnimate = {this.onAnimate}
                >
                    <module ref="mouseInput" descriptor={MouseInput} />
                    <scene ref = "scene">
                        <perspectiveCamera 
                            name = "camera"
                            ref = "camera"
                            fov = {30}
                            aspect = {window.innerWidth / window.innerHeight}
                            near = {0.1} far = {50}
                            position = {new THREE.Vector3(0,2,10)}
                        />

                        {React.Children.map(this.props.children, (child,i)=>{
                            const dynamicOrNotProps = !child.props.static? {
                                position: this.positions[i] || new THREE.Vector3(0,3.5,0),
                                rotation: this.rotations[i] || new THREE.Quaternion(),
                            } : null
                            const foistedProps = {
                                ...child.props, 
                                ...dynamicOrNotProps,
                                 onMount: this.addBody, 
                                 unmount: this.removeBody, 
                                 mutate: this.modifyBody,
                                 force: this.forceAnimateBody,
                                 selected: i===this.selected,
                            }

                            return React.cloneElement(
                                child, 
                                foistedProps
                            )
                        })}

                    </scene>
                </React3>
            </div>
        )
    }
}