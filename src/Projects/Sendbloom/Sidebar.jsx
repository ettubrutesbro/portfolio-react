import React from 'react'
import * as THREE from 'three'

import {v3, twn, makeColorBox} from '../../utilities.js'

export default class Sidebar extends React.Component{
    componentDidMount(){
        const windowcolor = {front: 0xededed, left:0xccd2d6, bottom: 0xededed, right: 0xededed, top: 0xfbfbfc, back: 0xededed}
        
        makeColorBox('sendbloom', this.refs.sidebar, [0.35, 0.925, 0.075], windowcolor)
        this.refs.sidebar.position.set(-1,0,0.325)
        this.refs.sidebar.visible = false
    }

    mount(){
        const store = this.props.store
        const sidebar = this.refs.sidebar
        store.bodies.sendbloom.allowSleep = false
        store.bodies.sendbloom.sleeping = false
        store.static = false
        sidebar.visible = true
        this.sidebarTweens = [
            twn('scale', {x: 0.3}, {x: 1}, 250, sidebar.scale),
            twn('position', {x: -1} ,{x: -0.55}, 250, sidebar.position),
            twn('opacity', {opacity:0}, {opacity:1}, 250, sidebar, {traverseOpacity: true})
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