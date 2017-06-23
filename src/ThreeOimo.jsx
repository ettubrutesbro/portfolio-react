//core
import React from 'react'
import React3 from 'react-three-renderer'
import {observable} from 'mobx'
import {observer} from 'mobx-react'
//component-specific
import * as THREE from 'three'
// import * as TWEEN from '@tweenjs/tween.js'
import * as OIMO from 'oimo'
import {FPSStats} from 'react-stats'

//my stuff
import {Debug, ThreePhysicsStore} from './Store'

@observer export default class ThreeOimoTest extends React.Component{


    constructor(props, context){
        super(props, context)

        const d = 50
        this.lightPosition = new THREE.Vector3(0, 10, 0)
        this.lightTarget = new THREE.Vector3(0, 2, 0)
        
        this.cameraPosition = new THREE.Vector3(10, 2, 0)
        this.cameraQuaternion = new THREE.Quaternion()
            .setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)

        const world = canvas.world
        const sizeConstant = canvas.viewableSizingConstant 

        canvas.ground = world.add({
            size: [sizeConstant, 10, sizeConstant], 
            pos: [0, -5, 0], 
            density: 1,
            friction: 0.3
        })

        canvas.wallLeft = world.add({
            size: [sizeConstant,100,1],
            pos: [0, 0, sizeConstant/2],
            density: 1
        })
        canvas.wallRight = world.add({
            size: [sizeConstant,100,1],
            pos: [0, 0, -(sizeConstant/2)],
            density: 1
        })
        canvas.wallBack = world.add({
            size: [1,100,sizeConstant],
            pos: [-3,0,0],
            density: 1,
            belongsTo: 1,
            // collidesWith: allCollisions & ~noCollideWithBackWall
        })
        canvas.wallFront = world.add({
            size: [1,100,sizeConstant],
            pos: [.5,0,0],
            density: 1
        })
        this.wallPositionLeft = new THREE.Vector3().copy(canvas.wallLeft.getPosition())
        this.wallPositionRight = new THREE.Vector3().copy(canvas.wallRight.getPosition())
        this.wallPositionBack = new THREE.Vector3().copy(canvas.wallBack.getPosition())
        this.wallPositionFront = new THREE.Vector3().copy(canvas.wallFront.getPosition())

        this.groundQuaternion = new THREE.Quaternion()
            .setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)

        // bodies = props.projects.map((project)=>{
        //     return this.world
        // })

        props.projects.forEach((project, i)=>{
            console.log(project)

            const model = project.physicsModel || {types: ['box'], sizes: [1,1,1], positions: [0,0,0]}

            canvas.bodies[i] = canvas.world.add({
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

            canvas.meshes[i] = {
                position: new THREE.Vector3().copy(canvas.bodies[i].getPosition()), 
                rotation: new THREE.Quaternion().copy(canvas.bodies[i].getQuaternion())
            }

            //debugModels?
            //map through model types. 
            //let array
            canvas.physicsMeshes[i] = model.types.map((type, it)=>{
                const n = it*3
                return {
                    geo: type, 
                    pos: {x: model.positions[n+0], y: model.positions[n+1], z: model.positions[n+2]},
                    size: {w: model.sizes[n+0], h: model.sizes[n+1], d: model.sizes[n+2], r: model.sizes[n+0]},
                    color: model.debugColor || 0x888888
                }
            })
            // console.log(this.physicsMeshes[i])

        })
    }

    animate = () =>{
        if(debug.runWorld){
            canvas.world.step()
        }
        
        for(var i = 0; i<this.props.projects.length; i++){
            if(!canvas.bodies[i].sleeping){
                canvas.meshes[i].position = new THREE.Vector3().copy(canvas.bodies[i].getPosition())
                canvas.meshes[i].rotation = new THREE.Quaternion().copy(canvas.bodies[i].getQuaternion())
            }
            
        }
    }

    render(){

        const sizeConstant = canvas.viewableSizingConstant

        const projectMeshes = canvas.meshes.map((mesh, i)=>{
            return(
                <group
                        key = {'project'+i+'group'}
                        position = {mesh.position}
                        quaternion = {mesh.rotation}>
                    {debug.physicsMeshes && 
                    canvas.physicsMeshes[i].map((mesh, it)=>{
                        const geo = mesh.geo === 'box'? ( <boxGeometry width = {mesh.size.w} height = {mesh.size.h} depth = {mesh.size.d} /> )
                        : mesh.geo === 'sphere'? ( <sphereGeometry radius = {mesh.size.r} widthSegments = {8} heightSegments = {8}/>  )
                        : <boxGeometry width = {0.1} height = {0.1} depth = {0.1} />

                        return (
                            <mesh key = {'project'+i+'-physicsmesh'+it}
                                    position = {new THREE.Vector3(mesh.pos.x, mesh.pos.y, mesh.pos.z)} >
                                {geo}
                                <meshBasicMaterial color = {mesh.color} key = {'project'+i+'physicsmtl'+it} transparent opacity = {0.4} />
                            </mesh>
                        )
                    })
                    }

                    
                </group>
            )
        })

        return(
            <div> 
            { debug.fps && <FPSStats />}
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
                {debug.amblight &&
                    <ambientLight color = {0xffffff} />
                }
                {debug.spotlight &&
                    <directionalLight 
                        color = {0xffffff}
                        intensity = {1.75}
                        // castShadow
                        position = {this.lightPosition}
                        lookAt = {this.lightTarget}
                    />
                }
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
            </div>
        )
    }
}

const debug = new Debug()
window.debug = debug
const canvas = new ThreePhysicsStore()
window.world = canvas

ThreeOimoTest.defaultProps = {
    debugModels: true
}