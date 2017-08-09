import React from 'react'
import * as THREE from 'three'

import {v3, twn, makeColorBox} from '../../utilities.js'

export default class Popover extends React.Component{
    componentDidMount(){
        const windowcolor = {front: 0xededed, left:0xccd2d6, bottom: 0xededed, right: 0xededed, top: 0xfbfbfc, back: 0xededed}
        
        makeColorBox('popover', this.refs.popover, [0.375, 0.35, 0.04], windowcolor)
        this.refs.popover.scale.set(0.001,0.001, 0.25)
        this.refs.popover.position.set(0.45,0.175, 0.2)
        this.refs.popover.visible = false
    }

    cycleIn(){
        const store = this.props.store
        const popover = this.refs.popover
        store.bodies.sendbloom.allowSleep = false
        store.bodies.sendbloom.sleeping = false
        store.static = false

        this.refs.popover.visible = true

        this.popoverTweens = [
            twn('position', {x:.63, y:.35, z:0.2}, {x:.45,y:.175,z:0.2}, 250, popover.position),
            twn('scale', {x: 0.001, y: 0.001, z:0.25}, {x:1,y:1,z:1}, 250, popover.scale)
        ]

    }
    cycleOut(){
        const store = this.props.store
        store.bodies.sendbloom.allowSleep = false
        store.bodies.sendbloom.sleeping = false
        store.static = false
        this.refs.popover.visible = false
    }

    render(){
        return(
            <group ref = "popover" />

        )
    }
}