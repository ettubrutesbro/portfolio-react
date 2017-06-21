
import React from 'react'
import React3 from 'react-three-renderer'
import * as THREE from 'three'
// import * as TWEEN from '@tweenjs/tween.js'
import * as OIMO from 'oimo'


import {observable} from 'mobx'
import {observer} from 'mobx-react'

@observer export default class ThreeOimoTest extends React.Component{

    @observable meshPosition = null
    @observable world = new OIMO.World({
        // broadphase: 3 //3 seems to get rid of jiggling but perf unknown
    })
    @observable bodies = []
    @observable meshes = []
    @observable physicsMeshes = []
    @observable viewableSizingConstant = 8


    constructor(props, context){
        super(props, context)

        const d = 50
        this.lightPosition = new THREE.Vector3(d, d, d)
        this.lightTarget = new THREE.Vector3(0, 0, 0)
        
        this.cameraPosition = new THREE.Vector3(10, 2, 0)
        this.cameraQuaternion = new THREE.Quaternion()
            .setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)

        const world = this.world
        const sizeConstant = this.viewableSizingConstant 

        const ground = world.add({
            size: [sizeConstant, 10, sizeConstant], 
            pos: [0, -5, 0], 
            density: 1,
            friction: 0.3
        })

        const wallA = world.add({
            size: [sizeConstant,100,1],
            pos: [0, 0, sizeConstant/2],
            density: 1
        })
        const wallB = world.add({
            size: [sizeConstant,100,1],
            pos: [0, 0, -(sizeConstant/2)],
            density: 1
        })
        const wallC = world.add({
            size: [1,100,sizeConstant],
            pos: [-2.5,0,0],
            density: 1
        })
        const wallD = world.add({
            size: [1,100,sizeConstant],
            pos: [.5,0,0],
            density: 1
        })
        this.wall1Position = new THREE.Vector3().copy(wallA.getPosition())
        this.wall2Position = new THREE.Vector3().copy(wallB.getPosition())

        this.groundQuaternion = new THREE.Quaternion()
            .setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)

        // bodies = props.projects.map((project)=>{
        //     return this.world
        // })

        props.projects.forEach((project, i)=>{
            console.log(project)

            const model = project.physicsModel || {types: ['box'], sizes: [1,1,1], positions: [0,0,0]}

            this.bodies[i] = this.world.add({
                //per-project hardcoded (projects.js) physicsModel
                type: model.types,
                size: model.sizes,
                posShape: model.positions,
                density: model.density || 1,
                restitution: model.restitution || 0.001,
                //random / programmatic for scene purposes
                pos: [Math.random()-0.5, 6+(i*1.5), (Math.random()*2)],
                rot: [Math.random()*90, (Math.random()*90)-45, Math.random()*90],
                move: true,
                world: world
            })

            this.meshes[i] = {
                position: new THREE.Vector3().copy(this.bodies[i].getPosition()), 
                rotation: new THREE.Quaternion().copy(this.bodies[i].getQuaternion())
            }
        })
    }

    animate = () =>{
        this.world.step()

        for(var i = 0; i<this.props.projects.length; i++){
            if(!this.bodies[i].sleeping){
                this.meshes[i].position = new THREE.Vector3().copy(this.bodies[i].getPosition())
                this.meshes[i].rotation = new THREE.Quaternion().copy(this.bodies[i].getQuaternion())
            }
            
        }
    }

    render(){


        const sizeConstant = this.viewableSizingConstant

        const projectMeshes = this.meshes.map((mesh, i)=>{
            return(
                <mesh
                        key = {'projectmesh'+i}
                        position = {mesh.position}
                        quaternion = {mesh.rotation}>
                     <boxGeometry
                        key = {'projectgeo'+i}
                        width = {1}
                        height = {1}
                        depth = {1}
                    />
                    <meshNormalMaterial key = {'projectmtl'+i}/>
                </mesh>
            )
        })

        return(
            <React3 
                mainCamera = "camera"
                width = {1400}
                height = {700}
                onAnimate = {this.animate}
                // antialias
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
                    <meshBasicMaterial color = {0xffffff} />
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
                    <meshBasicMaterial color = {0xffffff} />
                </mesh>

                <mesh position = {this.wall2Position}
                    quaternion = {this.wall2Quaternion}
                    >
                    <boxGeometry
                        width = {sizeConstant}
                        height = {10}
                        depth = {1}
                        />
                        <meshBasicMaterial color = {0xffffff} />
                </mesh>

                {projectMeshes}

                


                </scene>

            </React3>
        )
    }
}

ThreeOimoTest.defaultProps = {
    debugModels: true
}