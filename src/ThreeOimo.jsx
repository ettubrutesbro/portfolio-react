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

        console.log(OIMO.TO_RAD)
        console.log(OIMO.EulerToAxis)

        const d = 50
        this.lightPosition = new THREE.Vector3(0, 10, 0)
        this.lightTarget = new THREE.Vector3(0, 2, 0)
        
        this.cameraPosition = new THREE.Vector3(0, 2, 10)
        this.cameraQuaternion = new THREE.Quaternion()

        const world = canvas.world
        const sizeConstant = canvas.viewableSizingConstant 

        this.establishConstraints = (reestablish) => {
            const sizeConstant = canvas.viewableSizingConstant
            const world = canvas.world
            if(reestablish) this.batchConstraintAction('remove',[])
            canvas.ground = world.add({
                type: 'box',
                size: [sizeConstant, 10, sizeConstant], 
                pos: [0, -5, 0], 
                friction: 0.4,
                belongsTo: canvas.normalCollisions,
                collidesWith: canvas.collidesWithAll,
            })
            canvas.wallLeft = world.add({
                size: [1,100,sizeConstant],
                pos: [-(sizeConstant/2), 0, 0],
                density: 1
            })
            canvas.wallRight = world.add({
                size: [1,100,sizeConstant],
                pos: [sizeConstant/2, 0, 0],
                density: 1
            })
            canvas.wallBack = world.add({
                size: [sizeConstant,100,1],
                pos: [0,0,-3],
                density: 1,
            })
            canvas.wallFront = world.add({
                size: [sizeConstant,100,1],
                pos: [0,0,.5],
                density: 1
            })
            if(reestablish){
                this.batchConstraintAction('setupMass',[0x2,false])
                this.restoreLostBodies()   
            }
        }
        this.batchConstraintAction = (funcCall, parameters, equals, newVal) => {
            if(!equals){
                canvas.ground[funcCall](...parameters)
                canvas.wallLeft[funcCall](...parameters)
                canvas.wallRight[funcCall](...parameters)
                canvas.wallFront[funcCall](...parameters)
                canvas.wallBack[funcCall](...parameters)
            }
            else{
                canvas.ground[funcCall] = newVal
                canvas.wallLeft[funcCall] = newVal
                canvas.wallRight[funcCall] = newVal
                canvas.wallFront[funcCall] = newVal
                canvas.wallBack[funcCall] = newVal
            }
        }
        this.establishConstraints()

        canvas.roof = world.add({
            size: [sizeConstant, 10, sizeConstant],
            pos: [0, 40, 0],
            belongsTo: canvas.normalCollisions,
            collidesWith: canvas.collidesWithAll
        })
        canvas.hell = world.add({
            size: [30, 10, 30],
            pos: [0, -25, 0],
            friction: 1,
            belongsTo: canvas.normalCollisions,
            collidesWith: canvas.collidesWithAll
        })

         this.groundQuaternion = new THREE.Quaternion()
            .setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)

        Object.defineProperty(canvas.ground, 'belongsTo', {
                get: function(){ return this.shapes.belongsTo },
                set: function(newBits){ 
                    this.shapes.belongsTo = newBits 
                }
            })

        this.wallPositionLeft = new THREE.Vector3().copy(canvas.wallLeft.getPosition())
        this.wallPositionRight = new THREE.Vector3().copy(canvas.wallRight.getPosition())
        this.wallPositionBack = new THREE.Vector3().copy(canvas.wallBack.getPosition())
        this.wallPositionFront = new THREE.Vector3().copy(canvas.wallFront.getPosition())

        props.projects.forEach((project, i)=>{
            const model = project.physicsModel || {types: ['box'], sizes: [1,1,1], positions: [0,0,0]}
            const body = {
                name: project.name,
                type: model.types,
                size: model.sizes,
                posShape: model.positions,
                density: model.density || 10,
                restitution: model.restitution || 0.001,
                //random / programmatic for scene purposes
                pos: [((Math.random()*sizeConstant)-(sizeConstant/2))*.25, sizeConstant+(i*2), -0.75],
                rot: [(Math.random()*30)-15, (Math.random()*30)-15, (Math.random()*30)-15],
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
            .onComplete(()=> { body.sleeping = true }) //unset body.controlPos?
            .start()
    }

    forceRotate = (body, targetRotation, duration) => {
        //condensable with the above but hold off for now
        // const degtorad0.0174532925199432957
        const radtodeg = 57.295779513082320876
        const bodyrot = body.getQuaternion()
        const start = {x: bodyrot.x*radtodeg, y: bodyrot.y*radtodeg, z: bodyrot.z*radtodeg}
        console.log(bodyrot)
        console.log(' to ')
        console.log(targetRotation)

        body.rotationTween = new TWEEN.Tween(start)
            .to({x: targetRotation.x, y: targetRotation.y, z: targetRotation.z}, duration)
            .onUpdate(function(){
                body.sleeping = false
                console.log(this.x, this.y, this.z)
                body.setRotation(({x: this.x, y: this.y, z: this.z}))
                //new Quat().setFromEuler( rot.x * _Math.degtorad, rot.y * _Math.degtorad, rot.z * _Math.degtorad )
                // body.setQuaternion(new Quat({x: this.x, y: this.y, z: this.z}))
            })
            .onComplete(()=> { body.sleeping = true }) //unset body.controlRot?
            .start()
    }

    reenablePhysics = (body) => {
        // body.linearVelocity.scaleEqual(0)
        body.isKinematic = false
        body.sleeping = false 
    }

    phaseConstraints = () => {
        this.batchConstraintAction('belongsTo', null, true, canvas.nonCollisionGroup)
        this.batchConstraintAction('setupMass', [0x1, true])
    }
    
    restoreLostBodies = () => {
        //map through all bodies that are below a certain Y coord (-10)
        const sizeConstant = canvas.viewableSizingConstant
        const allBodies = Object.keys(canvas.bodies)

        allBodies.forEach((key, i) => {
            const body = canvas.bodies[key] 
            // console.log(body.getPosition())
            if(body.position.y < -5){
                console.log(key + ' restored')
                const oldPos = body.getPosition()
                if(body.sleeping) body.sleeping = false
                body.setPosition({
                    x: ((Math.random()*sizeConstant)-(sizeConstant/2))*.25, 
                    y: sizeConstant + (i*2), 
                    z: -0.75
                })
                body.setRotation({
                    x: (Math.random()*30)-15,
                    y: (Math.random()*30)-15,
                    z: (Math.random()*30)-15
                })
                // console.log(body.linearVelocity)
                setTimeout(()=>this.reenablePhysics(body), 100 + (i*50))
                // this.reenablePhysics(body)
            }
        }
                
        ) 
    }

    select = (body) => {
        console.log('selected ', body.name)
        this.phaseConstraints()
        body.setPosition(body.getPosition())
        setTimeout(() => this.forceMove(body, {x: 0, y: 1, z: 0}, 400), 400)
    }

    unselect = (body) => {
        this.establishConstraints(true)
        this.reenablePhysics(body)
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
                    ref = "camera"
                    fov = {canvas.fov}
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
                        >
                        <boxGeometry
                            width = {1}
                            height = {10}
                            depth = {sizeConstant}
                        />
                        <meshBasicMaterial color = {0xff0000} />
                    </mesh>

                    <mesh position = {this.wallPositionRight}
                        >
                        <boxGeometry
                            width = {1}
                            height = {10}
                            depth = {sizeConstant}
                            />
                            <meshBasicMaterial color = {0x0000ff} />
                    </mesh>
                    <mesh position = {this.wallPositionFront}
                        >
                        <boxGeometry
                            width = {sizeConstant}
                            height = {10}
                            depth = {1}
                            />
                            <meshBasicMaterial color = {0xffffff}  transparent opacity = {0.3} />
                    </mesh>
                    <mesh position = {this.wallPositionBack}
                        >
                        <boxGeometry
                            width = {sizeConstant}
                            height = {10}
                            depth = {1}
                            />
                            <meshBasicMaterial color = {0x550055} transparent  />
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