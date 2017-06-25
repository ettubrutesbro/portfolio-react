//core
import React from 'react'
import React3 from 'react-three-renderer'
import {observable} from 'mobx'
import {observer} from 'mobx-react'
//component-specific
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
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
            // density: 100,
            friction: 0.4,
            belongsTo: canvas.normalCollisions,
            collidesWith: canvas.collidesWithAll,
            // move: true,
        })

        canvas.hell = world.add({
            size: [30, 10, 30],
            pos: [0, -20, 0],
            friction: 1,
            belongsTo: canvas.normalCollisions,
            collidesWith: canvas.collidesWithAll
        })

         this.groundQuaternion = new THREE.Quaternion()
            .setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)

        Object.defineProperty(canvas.ground, 'collidesWith', {
                get: function(){ return this.shapes.collidesWith },
                set: function(newBits){ 
                    this.shapes.collidesWith = newBits 
                }
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
            // belongsTo: canvas.belongsToBackWall,
            // collidesWith: canvas.collidesWithAll & ~canvas.noCollisionsWithBackWall
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

       
        // bodies = props.projects.map((project)=>{
        //     return this.world
        // })

        props.projects.forEach((project, i)=>{
            console.log(project)

            const model = project.physicsModel || {types: ['box'], sizes: [1,1,1], positions: [0,0,0]}

            const body = {
                type: model.types,
                size: model.sizes,
                posShape: model.positions,
                density: model.density || 1,
                restitution: model.restitution || 0.001,
                //random / programmatic for scene purposes
                pos: [0, 6+(i*1.5), (Math.random()*2)],
                rot: [0, 0, 0],
                move: true,
                world: world,
                belongsTo: canvas.normalCollisions,
                collidesWith: canvas.collidesWithAll & ~canvas.nonCollisionGroup
            }

            canvas.bodies[project.name] = canvas.world.add(body)

            canvas.meshes[i] = {
                position: new THREE.Vector3().copy(canvas.bodies[project.name].getPosition()), 
                rotation: new THREE.Quaternion().copy(canvas.bodies[project.name].getQuaternion())
            }
            if(debug.physicsMeshes){
                canvas.physicsMeshes[i] = model.types.map((type, it)=>{
                    const n = it*3
                    return {
                        geo: type, 
                        pos: {x: model.positions[n+0], y: model.positions[n+1], z: model.positions[n+2]},
                        size: {w: model.sizes[n+0], h: model.sizes[n+1], d: model.sizes[n+2], r: model.sizes[n+0]},
                        color: model.debugColor || 0x888888
                    }
                })
            }
        })
    }

    animate = () =>{
        if(debug.runWorld){
            canvas.world.step()
        }
        const projects = this.props.projects

        for(var i = 0; i<this.props.projects.length; i++){
            const name = projects[i].name
            if(!canvas.bodies[name].sleeping){
                canvas.meshes[i].position = new THREE.Vector3().copy(canvas.bodies[name].getPosition())
                canvas.meshes[i].rotation = new THREE.Quaternion().copy(canvas.bodies[name].getQuaternion())
            }
            
        }

        TWEEN.update()
    }

    testImpulse = (body) => {
        body.applyImpulse(body.position, new THREE.Vector3(0,13,0))
        body.linearVelocity.scaleEqual(0.8)
        body.angularVelocity.scaleEqual(0.2)
    }

    impulse = (body, vector, wonky) => {
        const force = vector? vector : [0, 1, 0]
        if(!wonky){
            body.applyImpulse(body.getPosition(), new THREE.Vector3(force[0],force[1],force[2]))    
        }
        else body.applyImpulse(new THREE.Vector3(force[0],force[1],force[2]), body.getPosition())
        body.linearVelocity.scaleEqual(0.3)
        body.angularVelocity.scaleEqual(0.15)
    }

    forceMove = (body, coords, duration) => {
        const bodypos = body.getPosition()
        const start = {x: bodypos.x, y: bodypos.y, z: bodypos.z}

        body.moveTween = new TWEEN.Tween(start)
            .to({x: coords.x, y: coords.y, z: coords.z}, duration)
            .onUpdate(function(){
                body.sleeping = false
                body.setPosition({x: this.x, y: this.y, z: this.z})
            })
            .onComplete(()=> { body.sleeping = true })
            .start()
    }
    reenablePhysics = (body) => {
        body.isKinematic = false
        body.sleeping = false 
    }
    removeGround = () => {
        canvas.ground.collidesWith = canvas.nonCollisionGroup
        canvas.ground.setupMass(0x1, true)
    }
    reconstituteGround = () => {
        canvas.ground
    }
    restoreLostBodies = () => {
        //map through all bodies that are below a certain Y coord
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
                    canvas.physicsMeshes[i].map((pmesh, it)=>{
                        const geo = pmesh.geo === 'box'? ( <boxGeometry width = {pmesh.size.w} height = {pmesh.size.h} depth = {pmesh.size.d} /> )
                        : pmesh.geo === 'sphere'? ( <sphereGeometry radius = {pmesh.size.r} widthSegments = {8} heightSegments = {8}/>  )
                        : <boxGeometry width = {0.1} height = {0.1} depth = {0.1} />

                        return (
                            <mesh key = {'project'+i+'-physicsmesh'+it}
                                    position = {new THREE.Vector3(pmesh.pos.x, pmesh.pos.y, pmesh.pos.z)} >
                                {geo}
                                <meshBasicMaterial color = {pmesh.color} key = {'project'+i+'physicsmtl'+it} transparent opacity = {0.4} />
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