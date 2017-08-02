import React from 'react'
import {observable, action, autorun} from 'mobx'
import {observer} from 'mobx-react'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

import styles from './Seseme.css'

import {v3} from '../../utilities.js'

@observer
export class SesemeModel extends React.Component{
    @observable mode = this.props.mode
    @observable tween = null
    @observable plrTweens = [null,null,null,null]

    @observable pillars = [
        {pos: {x:-0.18, y: -.25, z:0.18}, quat: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -Math.PI/2)},
        {pos: {x:0.18, y: 0, z:0.18} },
        {pos: {x:0.18, y: .37, z:-0.18}, quat: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2)},
        {pos: {x:-0.18, y: .5, z:-0.18}, quat: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,-1,0), Math.PI)}
    ]
    //constructor, loadModels, and componentWillReceiveProps should be 
    //generic class function
    constructor( props, context) {
        super( props, context )
        this.loadModels()
    }
    // @action
    loadModels = () => {
        const loader=new THREE.JSONLoader()
        this.pedestal=loader.parse(require('./pedestal.json'))
        this.pillar=loader.parse(require('./pillar.json'))
    }
    componentWillReceiveProps(newProps){
        if(this.props.mode !== newProps.mode){
            if(newProps.mode === 'expanded') this.onExpand()
            else if(newProps.mode === 'selected') this.onSelect()
            else if(newProps.mode === 'normal') this.restoreNormal()
        }
    }

    @action
    onSelect = () => {
        let store = this.props.store
        const setYPos = this.setYPos
        const newPositions = [ .1, .475, -.3, .27 ]
        
        store.bodies.seseme.sleeping = false
        store.static = false

        this.plrTweens.map((plrtween, i)=>{
            if(plrtween) plrtween.stop()
            plrtween = new TWEEN.Tween({y: this.pillars[i].pos.y})
                .to({y: newPositions[i] })
                .onUpdate(function(){
                    setYPos(i,this.y)
                })
                .onComplete(function(){
                    store.bodies.seseme.sleeping=true
                })
                .start()
        })
    }
    @action
    restoreNormal = () => {
        let store = this.props.store
        const setYPos = this.setYPos
        const originalPositions = [  -.25, 0, .35, .475 ]

        this.props.store.bodies.seseme.sleeping = false
        this.props.store.static = false
      
        this.plrTweens.map((plrtween, i)=>{
            if(plrtween) plrtween.stop()
            plrtween = new TWEEN.Tween({y: this.pillars[i].pos.y})
                .to({y: originalPositions[i] })
                .onUpdate(function(){
                    setYPos(i,this.y)
                })
                .onComplete(function(){
                    // this.props.store.bodies.seseme.sleeping=true
                })
                .easing(TWEEN.Easing.Quadratic.Out)
                .start()
        })

    }

    @action setYPos = (i,y) =>  this.pillars[i].pos.y = y

    render(){
        const scaleAdjust = new THREE.Vector3(0.08,0.08,0.08)
        const pillarPositions = []

        return (
            <group ref = "group" position = {v3(0,0.1,0)}>
                <resources>
                    {this.pillar &&
                        <geometry 
                            resourceId = "pillar" 
                            vertices = {this.pillar.geometry.vertices}
                            faces = {this.pillar.geometry.faces}
                        />
                    }
                </resources>
                <mesh
                    name = 'seseme'
                    position = {new THREE.Vector3(0,-1.29,0)}
                    quaternion = {new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI/2)}
                >
                    <planeBufferGeometry width = {0.975} height = {0.975} />
                    <meshNormalMaterial />

                </mesh>
                {this.pedestal && 
                    <mesh 
                        position = {new THREE.Vector3(0.12,.15,0.1)}
                        name = 'seseme'
                        scale = {scaleAdjust}
                    >
                       <geometry
                         vertices={this.pedestal.geometry.vertices}
                         faces={this.pedestal.geometry.faces}
                         // faceVertexUvs = {this.parsedModel.geometry.faceVertexUvs}
                         // colors = {this.parsedModel.geometry.colors}
                       />
                       <meshNormalMaterial color={0x000fff} />
                     </mesh>
                }
                {this.pillar &&
                    <group>
                        {this.pillars.map((p,i)=>{
                            return(
                                <mesh
                                    key = {'pillar'+i}
                                    name = 'seseme'
                                    scale = {scaleAdjust} 
                                    position = {new THREE.Vector3(p.pos.x, p.pos.y, p.pos.z)}
                                    quaternion = {p.quat || null}
                                >
                                    <geometryResource
                                       resourceId = "pillar"
                                    />
                                    <meshNormalMaterial />
                                </mesh>
                            )
                        })}
                    </group>
                }
            </group>
        )

    }
}

@observer export class SesemeInfo extends React.Component{
    //extend InfoComponent someday....
    render(){
        return(
            <div className = {styles.seseme}>
                An interactive installation combining robotics & a webapp, SESEME is what I mostly worked on for 2 1/2 years after graduation — and a project I remember very fondly. 
            </div>
        )
    }
}