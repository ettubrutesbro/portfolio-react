
import React from 'react'
import React3 from 'react-three-renderer'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import * as OIMO from 'oimo'

// const TWEEN = require('@tweenjs/tween.js')

import {observable} from 'mobx'

console.log(OIMO)

// const OIMO = require('oimo')

export default class ThreeOimoTest extends React.Component{

    @observable meshPosition = null

    constructor(props, context){
        super(props, context)

        const d = 50
        this.lightPosition = new THREE.Vector3(d, d, d)
        this.lightTarget = new THREE.Vector3(0, 0, 0)
        
        this.cameraPosition = new THREE.Vector3(10, 2, 0)
        this.cameraQuaternion = new THREE.Quaternion()
            .setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)

        const world = this.props.store.world
        const sizeConstant = this.props.store.viewableSizingConstant 

        const ground = world.add({
            size: [sizeConstant, 10, sizeConstant], 
            pos: [0, -5, 0], 
            density: 1,
            friction: 0.3
        })

        const wallA = world.add({
            size: [sizeConstant,10,1],
            // rot: [90, 0, 0],
            pos: [0, 0, sizeConstant/2],
            density: 1
        })
        const wallB = world.add({
            size: [sizeConstant,10,1],
            // rot: [90, 0, 0],
            pos: [0, 0, -(sizeConstant/2)],
            density: 1
        })
        const wallC = world.add({
            size: [1,10,sizeConstant],
            pos: [-(sizeConstant/2),0,0],
            density: 1
        })
        const wallD = world.add({
            size: [1,10,sizeConstant],
            pos: [-3,0,0],
            density: 1
        })

        // this.wall1Quaternion = new THREE.Quaternion().copy(wallA.getQuaternion())
        // this.wall2Quaternion = new THREE.Quaternion().copy(wallB.getQuaternion())
        this.wall1Position = new THREE.Vector3().copy(wallA.getPosition())
        this.wall2Position = new THREE.Vector3().copy(wallB.getPosition())

        this.groundQuaternion = new THREE.Quaternion()
            .setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)

        const body = world.add({
            type: 'box', 
            size: [0.5,0.5,0.5], 
            pos: [0, 5, 0],
            move: true,
            world: world,
            restitution: 0.1
        })

        const other = world.add({
            type: 'box',
            size: [1,1,1],
            pos: [0.25, 10, -.25],
            move: true,
            world: world,

            restitution: 0.1
        })


        this.onAnimate = () => {
            world.step()
            // this.meshPostion = new THREE.Vector3().copy(body.getPosition())
            this.setState({
                meshPosition: new THREE.Vector3().copy(body.getPosition()),
                meshRotation: new THREE.Quaternion().copy(body.getQuaternion()),
                otherPosition: new THREE.Vector3().copy(other.getPosition()),
                otherRotation: new THREE.Quaternion().copy(other.getQuaternion())
            })
            // console.log(body.getPosition())
            // console.log(this.meshPosition)
        }


        this.impulse = () => {
            console.log(world.gravity)
            world.setGravity([0,0,0])
            body.applyImpulse(body.position, new THREE.Vector3(0,1,0))
            body.linearVelocity.scaleEqual(0.5)
            body.angularVelocity.scaleEqual(0.1)
        }

        this.state = {
            meshPosition: new THREE.Vector3().copy(body.getPosition()),
            otherPosition: new THREE.Vector3().copy(other.getPosition()),
                meshRotation: new THREE.Quaternion().copy(body.getQuaternion()),

                otherRotation: new THREE.Quaternion().copy(other.getQuaternion())
        }

    }

    componentDidMount(){

    }

    // onAnimate = () => {
    //     const store = this.props.store
    //         const world = this.props.store.world
    //         if(world===null) return
    //         world.step()
    //     // console.log(store.physicsBodies)
         
    //         if(store.physicsBodies[0].sleeping) console.log('slep')
    //         else{
    //            // console.log(store.physicsBodies[0].getPosition().y)
    //             // store.threeMeshes[0].position.copy(store.physicsBodies[0].getPosition())
    //             // store.threeMeshes[0].quaternion.copy(store.physicsBodies[0].getQuaternion())

    //             // store.threeMeshes[0].position.set(store.physicsBodies[0].getPosition().x, store.physicsBodies[0].getPosition().y, store.physicsBodies[0].getPosition().z)
    //             const what = store.physicsBodies[0].getPosition()
    //             this.meshPosition = new THREE.Vector3().copy(what)
    //             console.log(this.meshPosition)

    //         }
    // }


    render(){

        const sizeConstant = this.props.store.viewableSizingConstant

        return(
            <React3 
                mainCamera = "camera"
                width = {1400}
                height = {700}
                onAnimate = {this.onAnimate}
            >
                <scene>
                <perspectiveCamera 
                    name = "camera"
                    fov = {30}
                    aspect = {1400/700}
                    near = {0.5}
                    far = {100}
                    position = {this.cameraPosition}
                    quaternion = {this.cameraQuaternion}
                    ref = "camera"
                />

                <mesh quaternion = {this.groundQuaternion}>
                    <planeBufferGeometry
                        width = {sizeConstant}
                        height = {sizeConstant}
                    />
                    <meshBasicMaterial color = {0xff0000} />
                </mesh>

                <mesh 
                    position = {this.wall1Position}
                    quaternion = {this.wall1Quaternion}
                    >
                    <boxGeometry
                        width = {sizeConstant}
                        height = {10}
                        depth = {1}
                    />
                    <meshBasicMaterial color = {0x5e5e5e} />
                </mesh>

                <mesh position = {this.wall2Position}
                    quaternion = {this.wall2Quaternion}
                    >
                    <boxGeometry
                        width = {sizeConstant}
                        height = {10}
                        depth = {1}
                        />
                        <meshBasicMaterial color = {0x5e5e5e} />
                </mesh>

                <mesh 
                    quaternion = {this.state.meshRotation}
                    position = {this.state.meshPosition} 
                    >

                    <boxGeometry
                        width = {0.5}
                        height = {0.5}
                        depth = {0.5}
                    />
                    <meshNormalMaterial color = {0x0000ff} />
                </mesh>
                <mesh
                    quaternion = {this.state.otherRotation}
                        position = {this.state.otherPosition}>
                    
                    <boxGeometry
                        width = {1}
                        height = {1}
                        depth = {1}
                    />
                    <meshNormalMaterial />
                </mesh>

                


                </scene>

            </React3>
        )
    }
}