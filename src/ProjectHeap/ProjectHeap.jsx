//core
import React from 'react'
import React3 from 'react-three-renderer'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
//component-specific
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
// import * as OIMO from 'oimo'
//utilities
import MouseInput from './MouseInput'
import {FPSStats} from 'react-stats'
const tempVector2=new THREE.Vector2()
//my stuff
import {Debug, ThreePhysicsStore} from '../Store'
import { rads} from '../helpers.js'
import ProjectGroup from './ProjectGroup'

//test

const debug=new Debug()
window.debug=debug
const physics=new ThreePhysicsStore()
window.world=physics


@observer export default class ProjectHeap extends React.Component{
    @observable mouseInput=null
    @observable eligibleForClick=[]
    @observable projectsReady=false
    @observable renderTrigger=null

    constructor(props, context){
        super(props, context)

        // const d=50
        this.lightPosition=new THREE.Vector3(0, 10, 0)
        this.lightTarget=new THREE.Vector3(0, 2, 0)
        
        this.cameraPosition=new THREE.Vector3(0, 2, 10)
        this.cameraQuaternion=new THREE.Quaternion()

        const world=physics.world
        const sizeConstant=physics.viewableSizingConstant 

        this.establishConstraints=(reestablish) => {
            const sizeConstant=physics.viewableSizingConstant
            const world=physics.world
            if(reestablish) this.batchConstraintAction('remove',[])
            physics.ground=world.add({
                type: 'box',
                size: [sizeConstant, 10, sizeConstant], 
                pos: [0, -5, 0], 
                friction: 0.6,
                belongsTo: physics.normalCollisions,
                collidesWith: physics.collidesWithAll,
            })
            physics.wallLeft=world.add({
                type: 'box',
                size: [1,100,sizeConstant],
                pos: [-(sizeConstant/2), 0, 0],
                belongsTo: physics.normalCollisions,
                collidesWith: physics.collidesWithAll
            })
            physics.wallRight=world.add({
                type: 'box',
                size: [1,100,sizeConstant],
                pos: [sizeConstant/2, 0, 0],
                belongsTo: physics.normalCollisions,
                collidesWith: physics.collidesWithAll
            })
            physics.wallBack=world.add({
                type: 'box',
                size: [sizeConstant,100,1],
                pos: [0,0,-3],
                belongsTo: physics.normalCollisions,
                collidesWith: physics.collidesWithAll
            })
            physics.wallFront=world.add({
                type: 'box',
                size: [sizeConstant,100,1],
                pos: [0,0,.5],
                belongsTo: physics.normalCollisions,
                collidesWith: physics.collidesWithAll
            })
            if(reestablish){
                this.batchConstraintAction('setupMass',[0x2,false])
                this.restoreLostBodies()   
            }
        }
        this.batchConstraintAction=(funcCall, parameters, equals, newVal) => {
            if(!equals){
                physics.ground[funcCall](...parameters)
                physics.wallLeft[funcCall](...parameters)
                physics.wallRight[funcCall](...parameters)
                physics.wallFront[funcCall](...parameters)
                physics.wallBack[funcCall](...parameters)
            }
            else{
                physics.ground[funcCall]=newVal
                physics.wallLeft[funcCall]=newVal
                physics.wallRight[funcCall]=newVal
                physics.wallFront[funcCall]=newVal
                physics.wallBack[funcCall]=newVal
            }
        }
        this.establishConstraints()

        physics.roof=world.add({
            size: [sizeConstant, 10, sizeConstant],
            pos: [0, 40, 0],
            belongsTo: physics.normalCollisions,
            collidesWith: physics.collidesWithAll
        })

         this.groundQuaternion=new THREE.Quaternion()
            .setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)

        Object.defineProperty(physics.ground, 'belongsTo', {
                get: function(){ return this.shapes.belongsTo },
                set: function(newBits){ 
                    this.shapes.belongsTo=newBits 
                }
            })

        this.wallPositionLeft=new THREE.Vector3().copy(physics.wallLeft.getPosition())
        this.wallPositionRight=new THREE.Vector3().copy(physics.wallRight.getPosition())
        this.wallPositionBack=new THREE.Vector3().copy(physics.wallBack.getPosition())
        this.wallPositionFront=new THREE.Vector3().copy(physics.wallFront.getPosition())
    }

    componentDidUpdate(newProps) {
        const {width, height}=this.props 
        if(width !== newProps.width || height !== newProps.height){
            this.refs.mouseInput.containerResized()
        }
    }

    @action
    setReady=() => {
        console.log('item ready')
        this.projectsReady++
        if(this.projectsReady === this.props.projects.length){
            console.log('all items ready')
        }
    }

    onCreateGroup=(group, index) =>  this.eligibleForClick[index]=group
    createManualRenderTrigger=(trigger) => this.renderTrigger=trigger

    @action
    animate=() =>{
        // console.log('anim')
        if(debug.runWorld && this.projectsReady === this.props.projects.length){
            const {mouseInput, camera}=this.refs
            if(!mouseInput.isReady()){
                const {scene, container}=this.refs
                mouseInput.ready(scene, container, camera)
                mouseInput.setActive(false)
            }
            if(this.mouseInput !== mouseInput) this.mouseInput=mouseInput

            physics.world.step()
        
            let numberOfSleepingBodies=0
            const projects=this.props.projects

            for(var i=0; i<projects.length; i++){
                const name=projects[i].name
                if(!physics.bodies[name].sleeping){
                    const newPos=physics.bodies[name].getPosition()
                    physics.groups[i].position=new THREE.Vector3().copy(newPos)
                    physics.groups[i].rotation=new THREE.Quaternion().copy(physics.bodies[name].getQuaternion())
                    if(newPos.y < -10){
                        //TODO: 
                        //eliminates need for physical basement,
                        //but may need adjustment depending on perspective / forces
                        console.log(name, 'is below threshold')
                        physics.bodies[name].sleeping=true
                    }
                }
                if(physics.bodies[name].sleeping){ 
                    numberOfSleepingBodies++
                }
                
                
            }

            if(numberOfSleepingBodies === projects.length){
                console.log('all are asleep, stopping constant renders')
                physics.static = true
            }

            TWEEN.update()
        }
    }

    impulse=(body, vector, wonky) => {
        const force=vector? vector : [0, 1, 0]
        if(!wonky){
            body.applyImpulse(body.getPosition(), new THREE.Vector3(force[0],force[1],force[2]))    
        }
        else body.applyImpulse(new THREE.Vector3(force[0],force[1],force[2]), body.getPosition())
        body.linearVelocity.scaleEqual(0.9)
        body.angularVelocity.scaleEqual(0.35)
    }

    forceMove=(body, coords, duration) => {
        const bodypos=body.getPosition()
        const start={x: bodypos.x, y: bodypos.y, z: bodypos.z}

        body.moveTween=new TWEEN.Tween(start)
            .to({x: coords.x, y: coords.y, z: coords.z}, duration)
            .onUpdate(function(){
                body.sleeping=false
                body.setPosition({x: this.x, y: this.y, z: this.z})
            })
            .onComplete(()=> { body.sleeping=true }) //unset body.controlPos?
            .start()
    }

    forceRotate=(body, targetRotation, duration) => {
        const start=body.getQuaternion().clone()
        const tgt=body.getQuaternion().clone().setFromEuler(rads(targetRotation.x), rads(targetRotation.y), rads(targetRotation.z))

        body.rotationTween=new TWEEN.Tween(start)
            .to(tgt, duration)
            .onUpdate(function(){
                body.sleeping=false
                body.setQuaternion(({
                    x: this.x, 
                    y: this.y, 
                    z: this.z,
                    w: this.w
                }))
            })
            .onComplete(()=> { 
                body.sleeping=true
                // body.controlRot=true
             })
            .start()
    }

    reenablePhysics=(body) => {
        body.controlRot=false
        body.isKinematic=false
        body.sleeping=false 
    }

    phaseConstraints=() => {
        this.batchConstraintAction('belongsTo', null, true, physics.nonCollisionGroup)
        this.batchConstraintAction('setupMass', [0x1, true])
    }
    
    restoreLostBodies=() => {
        //map through all bodies that are below a certain Y coord (-10)
        const sizeConstant=physics.viewableSizingConstant
        const allBodies=Object.keys(physics.bodies)

        allBodies.forEach((key, i) => {
            const body=physics.bodies[key] 
            // console.log(body.getPosition())
            if(body.position.y < -1){
                console.log(key + ' restored')
                // const oldPos=body.getPosition()
                if(body.sleeping) body.sleeping=false
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
                setTimeout(()=>this.reenablePhysics(body), 100 + (i*50))
            }
        }
                
        ) 
    }

    handleClick=(evt) => {
        console.log('clicked')
        const intersect=this.mouseInput._getIntersections(tempVector2.set(evt.clientX, evt.clientY))
        if(this.props.store.selectedProject === null && intersect.length > 0){
            if(!intersect[0].object || !intersect[0].object.name || !physics.bodies[intersect[0].object.name]){
                console.log(intersect[0].object.name)
                console.log('target doesnt have name or isnt registered in physics bodies')
                return
            }
            this.select(physics.bodies[intersect[0].object.name])
        }
        else{
            if(intersect.length === 0) this.unselect()
        }
        
    }

    @action
    select=(body) => {
        if(physics.static) physics.static=false
        this.props.store.selectedProject=body.name
        this.phaseConstraints()
        body.setPosition(body.getPosition())
        this.forceRotate(body, {x: 0, y: 0, z: 0}, 500)
        this.forceMove(body, {x: 0, y: 1.5, z: body.getPosition().z}, 400)
    }
    @action
    unselect=() => {
        if(physics.static) physics.static=false
        const selected=physics.bodies[this.props.store.selectedProject]
        console.log(selected)
        const weight=((selected.mass * 2) - 10)
        const randomVector=[
            (Math.random()*weight)-(weight*2),
            (Math.random()*weight)-(weight*2),
            (Math.random()*weight)-(weight*2)
        ]
        this.establishConstraints(true)
        this.reenablePhysics(selected)
        this.impulse(selected, randomVector, true)
        this.props.store.selectedProject=null

    }

    render(){

        const sizeConstant=physics.viewableSizingConstant

        const projectGroups=this.props.projects.map((project,i)=>{
            this.onCreateGroup.bind(this,i)
            return(
                <ProjectGroup 
                    debug={true}
                    key={project.name + 'Group'}
                    project={project}
                    store={physics}
                    index={i}
                    onReady={this.setReady}
                    mouseInput={this.mouseInput}
                    isSelected = {this.props.store.selectedProject === project.name}
                    isExpanded = {this.props.store.expandedProject === project.name}
                    // tween = {TWEEN}
                />
            )
        })

        return(
            <div ref="container" onClick={this.handleClick}> 
            { debug.fps && <FPSStats />}
            <React3 
                mainCamera="camera"
                width={this.props.width}
                height={this.props.height}
                onAnimate={this.animate}
                forceManualRender={physics.static}
                onManualRenderTriggerCreated={this.createManualRenderTrigger}
                // antialias
            >
                <module ref="mouseInput" descriptor={MouseInput} />
                <scene ref="scene">

                <perspectiveCamera 
                    name="camera"
                    ref="camera"
                    fov={physics.fov}
                    aspect={this.props.width/this.props.height}
                    near={0.001}
                    far={100}
                    position={this.cameraPosition}
                    quaternion={this.cameraQuaternion}
                />
                {debug.amblight &&
                    <ambientLight color={0xffffff} />
                }
                {debug.spotlight &&
                    <directionalLight 
                        color={0xffffff}
                        intensity={1.75}
                        castShadow
                        position={this.lightPosition}
                        lookAt={this.lightTarget}
                    />
                }
                {debug.walls && 
                <group>
                    <mesh quaternion={this.groundQuaternion}>
                        <planeBufferGeometry
                            width={sizeConstant}
                            height={sizeConstant}
                        />
                        <meshBasicMaterial color={0xffffff} />
                    </mesh>
                
                
                    <mesh 
                        position={this.wallPositionLeft}
                        >
                        <boxGeometry
                            width={1}
                            height={10}
                            depth={sizeConstant}
                        />
                        <meshBasicMaterial color={0xff0000} />
                    </mesh>

                    <mesh position={this.wallPositionRight}
                        >
                        <boxGeometry
                            width={1}
                            height={10}
                            depth={sizeConstant}
                            />
                            <meshBasicMaterial color={0x0000ff} />
                    </mesh>
                    <mesh position={this.wallPositionFront}
                        >
                        <boxGeometry
                            width={sizeConstant}
                            height={10}
                            depth={1}
                            />
                            <meshBasicMaterial color={0xffffff}  transparent opacity={0.3} />
                    </mesh>
                    <mesh position={this.wallPositionBack}
                        >
                        <boxGeometry
                            width={sizeConstant}
                            height={10}
                            depth={1}
                            />
                            <meshBasicMaterial color={0x550055} transparent  />
                    </mesh>
                </group>
                }

                {projectGroups}

                </scene>

            </React3>
            </div>
        )
    }
}


ProjectHeap.defaultProps={
    debugModels: true
}