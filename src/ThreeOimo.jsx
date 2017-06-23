
import React from 'react'
import React3 from 'react-three-renderer'
import * as THREE from 'three'
// import * as TWEEN from '@tweenjs/tween.js'
import * as OIMO from 'oimo'

import {Debug} from './Store'

import {observable} from 'mobx'
import {observer} from 'mobx-react'

@observer export default class ThreeOimoTest extends React.Component{

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
            pos: [-3,0,0],
            density: 1
        })
        const wallD = world.add({
            size: [1,100,sizeConstant],
            pos: [.5,0,0],
            density: 1
        })
        this.wallPositionLeft = new THREE.Vector3().copy(wallA.getPosition())
        this.wallPositionRight = new THREE.Vector3().copy(wallB.getPosition())
        this.wallPositionBack = new THREE.Vector3().copy(wallC.getPosition())
        this.wallPositionFront = new THREE.Vector3().copy(wallD.getPosition())

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
                rot: [Math.random()*90, 0, Math.random()*90],
                move: true,
                world: world
            })

            this.meshes[i] = {
                position: new THREE.Vector3().copy(this.bodies[i].getPosition()), 
                rotation: new THREE.Quaternion().copy(this.bodies[i].getQuaternion())
            }

            //debugModels?
            //map through model types. 
            //let array
            this.physicsMeshes[i] = model.types.map((type, it)=>{
                const n = it*3
                return {
                    geo: type, 
                    pos: {x: model.positions[n+0], y: model.positions[n+1], z: model.positions[n+2]},
                    size: {w: model.sizes[n+0], h: model.sizes[n+1], d: model.sizes[n+2], r: model.sizes[n+0]},
                    color: model.debugColor || 0x888888
                }
            })
            console.log(this.physicsMeshes[i])

        })
    }

    animate = () =>{
        if(debug.runWorld){
            this.world.step()
        }
        

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
                <group
                        key = {'project'+i+'group'}
                        position = {mesh.position}
                        quaternion = {mesh.rotation}>
                    {
                    this.physicsMeshes[i].map((mesh, it)=>{
                        const geo = mesh.geo === 'box'? ( <boxGeometry width = {mesh.size.w} height = {mesh.size.h} depth = {mesh.size.d} /> )
                        : mesh.geo === 'sphere'? ( <sphereGeometry radius = {mesh.size.r} widthSegments = {8} heightSegments = {8}/>  )
                        : <boxGeometry width = {0.1} height = {0.1} depth = {0.1} />

                        return (
                            <mesh key = {'project'+i+'-physicsmesh'+it}
                                    position = {new THREE.Vector3(mesh.pos.x, mesh.pos.y, mesh.pos.z)} >
                                {geo}
                                <meshBasicMaterial key = {'project'+i+'physicsmtl'+it} color = {mesh.color} transparent opacity = {0.6}/>
                            </mesh>
                        )
                    })
                    }

                    
                </group>
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
                    near = {0.001}
                    far = {100}
                    position = {this.cameraPosition}
                    quaternion = {this.cameraQuaternion}
                    ref = "camera"
                />

                {debug.walls && 
                <group>
                    <mesh quaternion = {this.groundQuaternion}>
                        <planeBufferGeometry
                            width = {sizeConstant}
                            height = {sizeConstant}
                        />
                        <meshBasicMaterial color = {0xffffff} />
                    </mesh>
                
                
                    <mesh 
                        position = {this.wallPositionLeft}
                        quaternion = {this.wall1Quaternion}
                        >
                        <boxGeometry
                            width = {sizeConstant}
                            height = {10}
                            depth = {1}
                        />
                        <meshNormalMaterial />
                    </mesh>

                    <mesh position = {this.wallPositionRight}
                        quaternion = {this.wall2Quaternion}
                        >
                        <boxGeometry
                            width = {sizeConstant}
                            height = {10}
                            depth = {1}
                            />
                            <meshNormalMaterial />
                    </mesh>
                    <mesh position = {this.wallPositionFront}
                        quaternion = {this.wall2Quaternion}
                        >
                        <boxGeometry
                            width = {1}
                            height = {10}
                            depth = {sizeConstant}
                            />
                            <meshNormalMaterial  transparent opacity = {0.3} />
                    </mesh>
                    <mesh position = {this.wallPositionBack}
                        quaternion = {this.wall2Quaternion}
                        >
                        <boxGeometry
                            width = {1}
                            height = {10}
                            depth = {sizeConstant}
                            />
                            <meshBasicMaterial color = {0x00ffff} transparent  />
                    </mesh>
                </group>
                }

                {projectMeshes}

                


                </scene>

            </React3>
        )
    }
}

const debug = new Debug()
window.debug = debug

ThreeOimoTest.defaultProps = {
    debugModels: true
}