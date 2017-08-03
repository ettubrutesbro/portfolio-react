import React from 'react'
import { action, observable } from 'mobx'
// import {observer} from 'mobx-react'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

import {rads} from '../../helpers.js'
import { v3, twn, makeColorMesh, makeColorBox } from '../../utilities.js'

import {mapValues} from 'lodash'

import Aptec from './Modal'


// @observer
export class SendbloomModel extends React.Component{
    @observable activeelement = null

    constructor(props, context){
        super( props, context )
        this.loadModels()
    }
    loadModels = () => {
        const loader = new THREE.JSONLoader()
        this.sblogo = loader.parse(require('./sb-logo.json'))
    }
    makeLogoMesh = () => {
        makeColorMesh('sendbloom', this.refs.logo, this.sblogo.geometry, [
            {range: [0, 17], color: 0x16a8a8},
            {range: [18, 35], color: 0xef9900},
            {range: [36, 53], color: 0xdb543e},
            {range: [54, 60], color: 0xffab01},
            {range: [61, 67], color: 0x09c3cc},
            {range: [68, 74], color: 0xf96244},
            {range: [75, 81], color: 0xffab01}, 
            {range: [82, 88], color: 0x09c3cc}, 
            {range: [89, 95], color: 0xf96244}, //dumb repetition but whatever for now
        ])

    }

    componentWillReceiveProps(newProps){
        if(this.props.mode !== newProps.mode){
            if(newProps.mode === 'expanded') this.onExpand()
            else if(newProps.mode === 'selected') this.onSelect()
            else if(newProps.mode === 'normal') this.restoreNormal()
        }
    }
    componentDidMount = () =>{
        this.makeLogoMesh()
        // this.makeModalMesh()
        makeColorBox('sendbloom', this.refs.window, [1.6, 0.8, 0.15], 
            {front: 0xededed, left: 0xccd2d6, bottom: 0xccd2d6, right: 0xccd2d6,
                top: 0x5e5e5e, back: 0xededed}
        )
        makeColorBox('sendbloom', this.refs.navbar, [1.6, 0.2, 0.15], 
            {front: 0x3c647c, left: 0x25485e, bottom: 0x25485e, right: 0x25485e,
                top: 0x8397a7, back: 0x3c647c}
        )
    }
    @action
    onSelect = (unselect) => {
        // navitem, prospects, and logo animate 
        const logo = this.refs.logo.children[0]
        const prospects = this.refs.prospects
        const nav = this.refs.navitems

        const logoPositions = [
            {x: logo.position.x, y: logo.position.y, z: logo.position.z}, 
            !unselect? {x: -0.675, y:-.005, z: -.485} : {x:0, y:0, z:0}
        ]
        const logoScales = [
            {x: logo.scale.x, y: logo.scale.y, z: logo.scale.z}, 
            !unselect? {x: 0.26, y:0.8, z: 0.26} : {x:1,y:1,z:1}
        ]
        const fade = [{opacity: !unselect? 0 : 1}, {opacity: !unselect? 1 : 0}]
        const navPos = [{x: nav.position.x, y: nav.position.y, z: nav.position.z} , !unselect? {x: .115, y: 0, z: 0} : {x: 0, y: 0, z: 0}]

        this.navitemTween = twn('position', navPos[0], navPos[1], 300, this.refs.navitems.position, null, !unselect? 150:0)
        this.prospectsTween = twn('opacity', {opacity: prospects.material.opacity}, fade[1], 400, prospects.material, null, null)
        this.logoPosTween = twn('position', logoPositions[0], logoPositions[1], 250, logo.position, null, !unselect? 150:0)
        this.logoScaleTween = twn('scale', logoScales[0], logoScales[1], 250, logo.scale, null, !unselect? 150:0)
       
        // begin animation loop for subcomponents
        console.log('begin animation loop')
            this.refs.aptec.onSelect(unselect)

        if(!unselect){

        }

        if(unselect){
            //find activeelement and deactivate it
        }

    }

    cycleOpenAnimations = () => {
        console.log(this.activeelement + ' out')
    }

    restoreNormal = () => this.onSelect(true)
    

    onExpand = () => {

    }

    render(){
        const navItemPositions = [0, 0.2, 0.2925, .5525]
        const navItems = [0.15, 0.04, 0.095, 0.22].map((width,i)=>{
            return(
                <mesh key = {'navitem'+i} ref = {'navitem'+i} 
                    position = {v3(navItemPositions[i], 0, 0)}
                >
                    <planeBufferGeometry width = {width} height = {0.035} />
                    <meshBasicMaterial color = {0xededed} transparent opacity = {1}/>
                </mesh>
            )
        })
        

        return(
            <group ref = "group" position = {v3(0,-0.05,0)} >
                <resources>
                    <texture resourceId = "prospects" url = {require('./prospects.png')}/> 
                </resources>
                <group 
                    ref = "logo"
                    rotation = {new THREE.Euler(rads(90),0,0)}
                    scale = {v3(1,2.25,1)}
                    position = {v3(0, 0.02, 0)}
                />
                   
                <group ref = "window">
                    <mesh name = "sendbloom" ref = "prospects" position = {v3(0,0,0.08)}>
                        <planeBufferGeometry width = {1.6} height = {0.81} />
                        <meshBasicMaterial opacity = {0} transparent >
                            <textureResource resourceId = "prospects" />
                        </meshBasicMaterial>
                    </mesh>
                </group>

                <group ref = "navbar" position = {v3(0,.5,0)}>
                    <group position = {v3(-.6,0,0.09)}>
                        <group ref = "navitems">
                            {navItems}
                        </group>
                    </group>
                </group>

              <Aptec ref = "aptec" store = {this.props.store} />

            </group>
        )
    }
}

export class SendbloomInfo extends React.Component{
    render(){
        return(
            <div>
                When I started working at Sendbloom ____ ago, I was looking for a short-term job to make some money while I finished my portfolio at nights. I didn't believe I'd thrive
                 working on enterprise sales software, but I've been pleased by my growth as a designer/developer in my tenure, which has long exceeded the initially-agreed-upon 3 months. 
                </div>
        )
    }
}