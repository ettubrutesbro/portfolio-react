
    /* basic scene should contain:
        physics 
            - a store for rotation and positions of objects
        TENTATIVE
        mouseinput / picking 
            - tell children through props when they are clicked / selected / etc.
            - parent App needs to know, too. 
        responsive support
            - resize should affect canvas, etc. 
            - mousepicking changes too
            - design reconsiderations at mobile resolution, etc.? 

        TODO
        debug camera control
        manual rendering support
            - API must be carefully considered - based on sleeping, etc.
            - must be easy to unset and reset...
        scene restart?
    */

import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import React3 from 'react-three-renderer'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import * as OIMO from 'oimo'

import MouseInput from '../../helpers/MouseInput'
const tempVector2 = new THREE.Vector2()

import {findDOMNode} from 'react-dom'
import {debounce, flatten} from 'lodash'
import {twn, cap1st, rads, v3} from '../../helpers/utilities'
import ThreePointLights from './ThreePointLights'

class SceneStore{
    @observable screenWidth = window.innerWidth
    @observable screenHeight = window.innerHeight

    world = new OIMO.World({
        timestep: 1/60,
        iterations: 15,
    })
    @observable bodies = {}
    @observable positions = new Map()
    @observable rotations = new Map()

    @observable selected = null
    @observable respawnQuartileCounter = 0

    

}
let store = new SceneStore()
window.scene = store


@observer
export default class InteractiveScene extends React.Component{

    componentDidMount(){
        const camGoal = this.props.cameraGoal
        this.camera.position.set(camGoal.x,camGoal.y,camGoal.z)
        // this.camera.lookAt({x: 0, y: 0, z:-1}) //seems to be default anyways..? 
        this.camera.target = {x: 0, y: camGoal.y, z: -1} //this is better logic than the above, not sure if setting a property like this is prudent
        this.camera.lookAt(this.camera.target)
        window.addEventListener('resize', this.handleResize)

    }
    componentWillReceiveProps(newProps){
        const {width, height, cameraGoal} = this.props
        console.log(newProps.cameraGoal, this.props.cameraGoal)
        if(newProps.width !== width || newProps.height !== height){
            console.log('width / height props changed')
            this.handleResize()
        }
        if(newProps.cameraGoal !== cameraGoal){
            // console.log('got new cam goal, begin interpolation of actual pos/zoom')
            if(!store.selected){
                this.moveCamera(
                    newProps.cameraGoal, 
                    1000,
                    400,
                    {curve: 'Cubic', side: 'InOut'}
                )
            }
            else if(store.selected){
                this.moveCamera(
                    newProps.cameraGoal, 
                    300,
                    0,
                    {curve: 'Cubic', side: 'Out'}
                )
            }
        }
    }

    @action onAnimate = () => {
        const { mouseInput, camera } = this
        if (!mouseInput.isReady()) {
            const { scene, container } = this.refs
            mouseInput.ready(scene, container, camera)
            mouseInput.setActive(false)
        }

        store.world.step()
        TWEEN.update()
        const bodies = Object.keys(store.bodies)
        for(var i = 0; i<bodies.length; i++){
            const name = bodies[i]
            const body = store.bodies[name]
            // if(!body.isSelectable) continue
            store.positions.set(name, new THREE.Vector3().copy(body.getPosition()))
            store.rotations.set(name, new THREE.Quaternion().copy(body.getQuaternion()))

            if(store.positions.get(name).y < this.props.abyssDepth){
                if(body.isSelectable){
                    //TODO - random within constraints and ensure these won't run into each other
                    
                    //divide container width into quadrants or thirds
                    console.log(this.props.envelope.width, store.respawnQuartileCounter)
                    const xPlacement = (((this.props.envelope.width / 4) * (4-store.respawnQuartileCounter)) - (this.props.envelope.width / 8)) - this.props.envelope.width / 2
                    
                    body.resetPosition(
                        xPlacement,
                        this.props.spawnHeight + ((Math.random()-0.5)*2),
                        (Math.random()-0.5))
                }
                if(store.respawnQuartileCounter < 3) store.respawnQuartileCounter++
                else store.respawnQuartileCounter = 0 
            }
        }
    }

    @action addBody = (name, physicsModel, isSelectable, isKinematic) => {
        console.log('adding', name, 'at', physicsModel.pos)
        store.bodies[name] = store.world.add(physicsModel)
        if(isSelectable) store.bodies[name].isSelectable = true
        if(isKinematic) store.bodies[name].isKinematic = true
            // store.positions.set(name, new THREE.Vector3().copy(store.bodies[name].getPosition()))
            // store.rotations.set(name, new THREE.Quaternion().copy(store.bodies[name].getQuaternion()))

    }
    @action moveStaticBody = (name, goal) => {
        const body = store.bodies[name]
        body.resetPosition(...goal)
        // store.positions.set(name, new THREE.Vector3().copy(body.getPosition()))
    }
    moveCamera = (newData, duration, delay, easing, cut) => {
        const animateZoom = newData.zoom !== this.camera.zoom
        const sceneCamera = this.camera
        const easeOption = easing || {curve: 'Quadratic', side: 'Out'}

        if(this.camera.posTween) this.camera.posTween.stop()
        this.camera.posTween = new TWEEN.Tween(Object.assign(this.camera.position, {zoom: this.camera.zoom}))
            .to(newData, duration)
            .onUpdate(function(){
                sceneCamera.position.set(this.x,this.y,this.z)
                if(animateZoom) sceneCamera.zoom = this.zoom
                sceneCamera.updateProjectionMatrix()
            })
            .easing(TWEEN.Easing[easeOption.curve][easeOption.side])

        if(delay) this.camera.posTween.delay(delay)

        this.camera.posTween.start()

    }
    cameraLookAt = (lookTarget, duration) => {

        const sceneCamera = this.camera

        if(this.camera.lookTween) this.camera.lookTween.stop()
        this.camera.lookTween = new TWEEN.Tween(this.camera.target)
            .to(lookTarget, duration)
            .onUpdate(function(){
                sceneCamera.target = this
                sceneCamera.lookAt(this)
                sceneCamera.updateProjectionMatrix()
            })
            .start()
    }

    @action animateDynamicBody = (name, property, goal, duration) => {
        //can force animate position or rotation
        const body = store.bodies[name]
        const object = property==='position'? 'position' : 'quaternion'

        if(!duration) duration = 500
        const current = body['get'+cap1st(object)]()
        
        let start = {x: current.x, y: current.y, z: current.z, w: current.w}
        let end
        if(property==='position'){
            end = {
                x: !goal.x && goal.x!==0? current.x : goal.x, 
                y: !goal.y && goal.y!==0? current.y : goal.y, 
                z: !goal.z && goal.z!==0? current.z : goal.z
            }
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
            body.sleeping = true
        })
        .start()
    }

    @action letGoOfSelectedBody = (name) =>{
        const body = store.bodies[name]

        if(body.positionTween) body.positionTween.stop()
        if(body.rotationTween) body.rotationTween.stop()

        body.controlRot = false
        body.isKinematic = false
        body.sleeping = false

        store.selected = null
    }

    @action handleClick = evt => {
        const intersect = this.mouseInput._getIntersections(
          tempVector2.set(evt.clientX, evt.clientY)
        )
        for(var i = 0; i<Object.keys(store.bodies).length; i++){
            console.log('waking', Object.keys(store.bodies)[i])
            store.bodies[Object.keys(store.bodies)[i]].awake()
            store.bodies[Object.keys(store.bodies)[i]].allowSleep = false
            store.bodies[Object.keys(store.bodies)[i]].applyImpulse(
                {x:0,y:0,z:0},
                {x:(Math.random()*.2)-.1 ,y: (Math.random()*.2)-.1,z: (Math.random()*.2)-.1}
            )
        }
        let selection = null
        if(intersect.length > 0){
            const target = intersect[0].object.name
            if(store.bodies[target].isSelectable && this.selected!==target){ 
                store.selected = target
                // this.cameraLookAt(store.bodies[target].position, 200)
                if(this.props.onSelect) this.props.onSelect(store.selected)   

            }
            else this.clickedNothing()
        }
        else this.clickedNothing()
        
        console.log('selected: ' + store.selected)
    }

    clickedNothing = () => {
        if(store.selected){
            if(this.props.onDeselect) this.props.onDeselect()
            this.letGoOfSelectedBody(store.selected)
            // this.cameraLookAt({x: 0, y: this.props.cameraGoal.y, z: -1})
        }
    }

    @action handleResize = debounce(() =>{
        store.screenWidth = window.innerWidth
        store.screenHeight = window.innerHeight
        this.mouseInput.containerResized()
    },50)


    render(){

        // const {positions, rotations, bodies} = this

        const positions = store.positions
        const rotations = store.rotations

        return(
            <div 
                ref = "container"
                onClick = {this.handleClick}
                style = {{width: '100%', height: '100%'}}
            >
                <React3
                    mainCamera = "camera"
                    width = {store.screenWidth}
                    height = {store.screenHeight}
                    onAnimate = {this.onAnimate}
                    clearColor = {this.props.background}
                >
                    <module ref={(module)=>{this.mouseInput = module}} descriptor={MouseInput} />
                    <scene ref = "scene">
                        <perspectiveCamera 
                            name = "camera"
                            ref = {(perspectiveCamera)=>{this.camera = perspectiveCamera}}
                            fov = {30}
                            aspect = {store.screenWidth / store.screenHeight}
                            near = {1} far = {200}
                           
                        />

                        {this.props.lights}

                        { /* physics-enabled children only */
                            React.Children.map(this.props.children, (child,i)=>{
                                //TODO name
                                const posRot = i+1 > positions.size? 
                                    { position: v3(0,0,0), rotation: new THREE.Quaternion() }
                                    : {position: positions.get(child.props.name), rotation: rotations.get(child.props.name)}

                                const foistedProps = {
                                    key: 'sceneChild'+i,
                                    ...child.props, 
                                    ...posRot,
                                    onMount: this.addBody,
                                    force: this.animateDynamicBody,
                                    move: this.moveStaticBody,
                                    letGo: this.letGoOfSelectedBody,
                                    selected: store.selected===child.props.name?true:store.selected?'other':false,
                                    baseline: this.props.baseline,
                                }

                                return React.cloneElement(
                                    child, 
                                    foistedProps
                                )
                            })
                        }

                    </scene>
                </React3>
                {this.props.debug && 
                <div id = 'diagnostic'
                    style = {{
                        backgroundColor: 'black',
                        position:'absolute', 
                        right: 0, 
                        bottom: 0, 
                        color: 'white'
                    }}
                >
                    <ul style = {{listStyleType: 'none'}}>
                        <li>Awake dynamic bodies: {
                            Object.keys(store.bodies).filter((body)=>{
                                return !store.bodies[body].sleeping && store.bodies[body].isDynamic
                            }).length
                        }</li>

                        <li>Selected: {store.selected || 'n/a'}</li>
                    </ul>

                    <div id = 'button' style = {{background: 'blue', padding: '10px'}}
                        onClick = {this.debugCycleCamera}
                    >
                        Cycle camera position
                    </div>

                </div>
                }
            </div>
        )
    }

}


    InteractiveScene.defaultProps = {
        background: 0x000000,
        cameraPosition: {x: 0, y: 0, z: 40},
        defaultLighting: false,
        lights: null,
        envelope: {width: 10, height: 20, depth: 3.25},
        spawnHeight: 10,
        abyssDepth: -20, //point on Y axis at which out-of-view objects will be frozen
    }