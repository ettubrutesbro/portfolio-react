
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
    @observable cameraPosition = v3(0,2,40)
}
let store = new SceneStore()
window.store = store


@observer
export default class InteractiveScene extends React.Component{

    componentDidMount(){
        window.addEventListener('resize', this.handleResize)
    }
    componentWillReceiveNewProps(newProps){
        const {width, height } = this.props
        if(newProps.width !== width || newProps.height !== height){
            console.log('width / height props changed')
            this.handleResize()
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
            store.positions.set(name, new THREE.Vector3().copy(body.getPosition()))
            store.rotations.set(name, new THREE.Quaternion().copy(body.getQuaternion()))

            if(store.positions.get(name).y < this.props.abyssDepth){
                if(body.isSelectable){
                    //TODO - random within constraints and ensure these won't run into each other
                    const maxItemHeight = 3 //coefficient for avoiding y-collisions
                    body.resetPosition(0,2*maxItemHeight,0)
                 }
            }
        }
    }

    @action addBody = (name, physicsModel, isSelectable) => {
        console.log('adding', name, 'at', physicsModel.pos)
        store.bodies[name] = store.world.add(physicsModel)
        if(isSelectable) store.bodies[name].isSelectable = true
    }
    @action forceAnimateBody = (name, property, goal, duration) => {
        //can force animate position or rotation
        const body = store.bodies[name]
        if(!body.isStatic){
            //body isn't dynamic - instead of tweening, use resetPosition
            console.log('what')
            console.log('attempting to move',name,'to',goal.join(','))
            body.resetPosition(...goal)
            return
        }
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
        let selection = null
        if(intersect.length > 0){
            const target = intersect[0].object.name
            if(store.bodies[target].isSelectable){ 
                store.selected = intersect[0].object.name
                if(this.props.onSelect) this.props.onSelect(store.selected)   
            }
            else this.clickedNothing()
        }
        else this.clickedNothing()
        
        console.log('selected: ' + store.selected)
    }

    clickedNothing = () => {
        if(store.selected && this.props.onDeselect) this.props.onDeselect()
        if(store.selected) this.letGoOfSelectedBody(store.selected)
    }

    @action handleResize = debounce(() =>{
        store.screenWidth = window.innerWidth
        store.screenHeight = window.innerHeight
        this.mouseInput.containerResized()
    },50)


    render(){

        // const {positions, rotations, bodies} = this

        const {debugCamPos} = this.props

        const positions = store.positions
        const rotations = store.rotations

        const debugCameraPos = v3(debugCamPos.x, debugCamPos.y, debugCamPos.z)

        return(
            <div 
                ref = "container"
                onClick = {this.handleClick}
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
                            position = {!this.props.debug? store.cameraPosition : debugCameraPos}
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
                                    force: this.forceAnimateBody,
                                    letGo: this.letGoOfSelectedBody,
                                    selected: store.selected===child.props.name?true:store.selected?'other':false,
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
        defaultLighting: false,
        lights: null,
        debugCamPos: {x: 0, y: 0, z: 0},
        abyssDepth: -20, //point on Y axis at which out-of-view objects will be frozen
    }