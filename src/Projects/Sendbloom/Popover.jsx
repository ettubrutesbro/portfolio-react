import React from 'react'
import * as THREE from 'three'

import {v3, twn, makeColorBox} from '../../utilities.js'

export default class Popover extends React.Component{
    componentDidMount(){
        const windowcolor = {front: 0xededed, left:0xccd2d6, bottom: 0xededed, right: 0xededed, top: 0xfbfbfc, back: 0xededed}
        
        makeColorBox('popover', this.refs.popover, [0.6, 0.3, 0.04], windowcolor)
        
        
    }

    reset(){
        this.refs.popover.scale.set(0.001,0.001, 0.25)
        this.refs.popover.position.set(0.15,0.175, 0.2)
        this.refs.popover.visible = false
    }

    cycleIn(){
        this.reset()

        const store = this.props.store
        const popover = this.refs.popover
        store.bodies.sendbloom.allowSleep = false
        store.bodies.sendbloom.sleeping = false
        store.static = false

        this.refs.popover.visible = true

        this.popoverTweens = [
            twn('position', {x:.63, y:.35, z:0.2}, {x:.45,y:.175,z:0.2}, 200, popover.position),
            twn('scale', {x: 0.001, y: 0.001, z:0.25}, {x:1,y:1,z:1}, 200, popover.scale)
        ]

        //TODO: these get interrupted, wyd?
        this.timedTransform = setTimeout(()=>{
            this.transformTweens = [
                twn('position', {x:.45}, {x:.6}, 200, popover.position),
                twn('scale', {x: 1}, {x:.5}, 200, popover.scale)
            ]
        }, 1000)
        this.timedTransform2 = setTimeout(()=>{
            this.transformTweens = [
                twn('position', {x:.6, y:.175}, {x:.525, y: .025}, 250, popover.position),
                twn('scale', {x: .5, y: 1}, {x:.75, y: 2}, 250, popover.scale)
            ]
        }, 1800)

    }

    cycleOut(){
        const store = this.props.store
        const popover = this.refs.popover
        store.bodies.sendbloom.allowSleep = false
        store.bodies.sendbloom.sleeping = false
        store.static = false
        // this.refs.popover.visible = false

        if(this.timedTransform) clearTimeout(this.timedTransform)
        if(this.timedTransform2) clearTimeout(this.timedTransform2)
        //TODO: what about stoppping transformTweens set inside of the timeouts???

        this.popoverTweens = [
            twn('position', {x:popover.position.x, y:popover.position.y, z:popover.position.z}, {x:.63, y:.35, z:0.2},  300, popover.position),
            twn('scale', {x:popover.scale.x, y:popover.scale.y, z: popover.scale.z}, {x: 0.001, y: 0.001, z:0.25}, 300, popover.scale)
        ]

    }

    render(){
        return(
            <group ref = "popover" />

        )
    }
}