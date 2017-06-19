
import React from 'react'
import React3 from 'react-three-renderer'
import * as THREE from 'three'

import * as OIMO from 'oimo'

console.log(OIMO)

// const OIMO = require('oimo')

export default class ThreeOimoTest extends React.Component{
    constructor(props, context){
        super(props, context)

        const d = 50
        this.lightPosition = new THREE.Vector3(d, d, d)
        this.lightTarget = new THREE.Vector3(0, 0, 0)
        this.groundQuaternion = new THREE.Quaternion()
            .setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)
        this.cameraPosition = new THREE.Vector3(10, 2, 0)
        this.cameraQuaternion = new THREE.Quaternion()
            .setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)

        const bodies = []

        const ground = this.props.store.world.add({
            size: [50, 10, 50], pos: [0, -5, 0], density: 1
        })

        this.props.store.physicsBodies[0] = this.props.store.world.add({
            type: 'sphere', 
            size: [0.5], 
            pos: [0, 10, 0],
            move: true,
            world: this.props.store.world
        })

        this.props.store.threeMeshes[0] = 
            new THREE.Mesh(new THREE.BufferGeometry().fromGeometry(
                new THREE.SphereGeometry(1,16,10)
            ))
        



    }

    componentDidMount(){

    }

    onAnimate = () => {
        const store = this.props.store
            const world = this.props.store.world
            if(world===null) return
            world.step()
        // console.log(store.physicsBodies)
         
            if(store.physicsBodies[0].sleeping) console.log('slep')
            else{
               console.log(store.physicsBodies[0].getPosition().y)
                store.threeMeshes[0].position.copy(store.physicsBodies[0].getPosition())
                store.threeMeshes[0].quaternion.copy(store.physicsBodies[0].getQuaternion())
                console.log(store.threeMeshes[0].position)
            }
    }


    render(){
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
                        width = {100}
                        height = {100}
                    />
                    <meshBasicMaterial color = {0xff0000} />
                </mesh>
                <mesh 
                    quaternion = {this.props.store.threeMeshes[0].quaternion}
                    position = {this.props.store.threeMeshes[0].position} >

                    <sphereGeometry
                        radius = {0.5}

                    />
                    <meshBasicMaterial color = {0x0000ff} />
                </mesh>


                </scene>

            </React3>
        )
    }
}