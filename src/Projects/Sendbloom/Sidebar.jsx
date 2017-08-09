import React from 'react'
import * as THREE from 'three'

import {v3, twn, makeColorBox} from '../../utilities.js'

export default class Sidebar extends React.Component{
    componentDidMount(){
        const windowcolor = {front: 0xededed, left:0xccd2d6, bottom: 0xededed, right: 0xededed, top: 0xfbfbfc, back: 0xededed}
        
        makeColorBox('sendbloom', this.refs.sidebar, [0.35, 0.925, 0.075], windowcolor)
        this.refs.sidebar.position.set(-1,0,0.25)
        this.refs.sidebar.visible = false
    }

    reset(){
        const sidebar = this.refs.sidebar
        sidebar.scale.set(0.3,1,1)
        sidebar.position.set(-1,0,0.25)
    }

    cycleIn(){
        this.reset()

        const store = this.props.store
        const sidebar = this.refs.sidebar
        store.bodies.sendbloom.allowSleep = false
        store.bodies.sendbloom.sleeping = false
        store.static = false
        // sidebar.visible = true
        this.sidebarTweens = [
            twn('scale', {x: 0.3}, {x: 1}, 400, sidebar.scale, {delay: 200, onStart: ()=>{sidebar.visible=true}}),
            twn('position', {x: -1, z: 0.25} ,{x: -0.55, z: 0.325}, 400, sidebar.position, {delay: 200}),
            twn('opacity', {opacity:0}, {opacity:1}, 250, sidebar, 
                {traverseOpacity: true, onComplete: ()=>{
                    store.bodies.sendbloom.allowSleep = true
                }, delay: 200})
        ]

    }

    cycleOut(){
        const store = this.props.store
        const sidebar = this.refs.sidebar
        store.bodies.sendbloom.allowSleep = false
        store.bodies.sendbloom.sleeping = false
        store.static = false

        this.sidebarTweens = [
            twn('position', {x: -0.55, y: 0}, {x: -0.835, y:-0.4625}, 300, sidebar.position),
            twn('scale', {x: 1, y: 1, z: 1}, {x: 0.001, y:0.001, z: 0.25}, 300, sidebar.scale),
            twn('opacity', {opacity:1}, {opacity:0}, 150, sidebar, {traverseOpacity: true, delay: 150}),
        ]
    }
    unmount(){
        this.refs.sidebar.visible = false
    }
    render(){
        return(
            <group ref = "sidebar" />

        )
    }
}