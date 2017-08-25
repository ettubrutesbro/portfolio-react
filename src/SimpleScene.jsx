import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import React3 from 'react-three-renderer'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import * as OIMO from 'oimo'

import {twn, camelize} from './utilities'

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

    @observable positions = []
    @observable rotations = []

    componentDidMount(){
        this.initStore()
    }

    @action initStore = () => {
        this.props.children.forEach((child)=>{
            if(!child.props.static){
                this.positions.push(null) //TODO: watch out for this, feels shaky...
             }
        })
    }

    @action onAnimate = () => {
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
        const coords = body['get'+camelize(object)]()
        const start = {x: coords.x, y: coords.y, z: coords.z}

        // const start = this.bodies[]
        const end ={x: goal.x, y: goal.y, z: goal.z}
        console.log(start, end)
        // body.getQuaternion.clone().setFromEuler(rads(goal.x),rads(goal.y),rads(goal.z))

        // const body 
        // twn(
        //     null, start, end, duration, body,
        //     {
        //         call: 'set'+camelize(object), 
        //         onUpdate: ()=>{body.sleeping = false}
        //     }
        // )
        this.iono = new TWEEN.Tween(start).to(end, 500)
        .onUpdate(function(){
            console.log('tween')
            body.setPosition({x:this.x, y: this.y, z: this.z})
        }).onStart(function(){
            body.allowSleep = false
            body.sleeping = false
        }).onComplete(function(){
            body.allowSleep = true
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
            <div>
                <React3
                    mainCamera = "camera"
                    width = {window.innerWidth}
                    height = {window.innerHeight}
                    onAnimate = {this.onAnimate}
                >
                    <scene>
                        <perspectiveCamera 
                            name = "camera"
                            fov = {30}
                            aspect = {window.innerWidth / window.innerHeight}
                            near = {0.1} far = {50}
                            position = {new THREE.Vector3(0,2,10)}
                        />

                        {React.Children.map(this.props.children, (child,i)=>{
                            const dynamicProps = !child.props.static? {
                                position: this.positions[i] || new THREE.Vector3(0,3.5,0),
                                rotation: this.rotations[i] || new THREE.Quaternion(),
                            } : null
                            const foistedProps = {
                                ...child.props, 
                                ...dynamicProps,
                                 onMount: this.addBody, 
                                 unmount: this.removeBody, 
                                 mutate: this.modifyBody
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