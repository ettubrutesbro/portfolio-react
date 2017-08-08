import React from 'react'
import * as THREE from 'three'

import {v3, twn, makeColorBox} from '../../utilities.js'

export default class Popover extends React.Component{
    componentDidMount(){
        const windowcolor = {front: 0xededed, left:0xccd2d6, bottom: 0xededed, right: 0xededed, top: 0xfbfbfc, back: 0xededed}
        
        makeColorBox('popover', this.refs.popover, [0.375, 0.35, 0.04], windowcolor)
        this.refs.popover.position.set(0.45,0.175, 0.2)
        this.refs.popover.visible = false
    }

    mount(){
        const store = this.props.store
        store.bodies.sendbloom.allowSleep = false
        store.bodies.sendbloom.sleeping = false
        store.static = false
        this.refs.popover.visible = true
    }
    unmount(){
        this.refs.popover.visible = false
    }

    render(){
        return(
            <group ref = "popover" />

        )
    }
}