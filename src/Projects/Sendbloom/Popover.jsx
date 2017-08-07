import React from 'react'
import * as THREE from 'three'

import {v3, twn, makeColorBox} from '../../utilities.js'

export default class Popover extends React.Component{
    componentDidMount(){
        const windowcolor = {front: 0xededed, left:0xccd2d6, bottom: 0xededed, right: 0xededed, top: 0xfbfbfc, back: 0xededed}
        
        makeColorBox('popover', this.refs.popover, [0.375, 0.35, 0.04], windowcolor)
        this.refs.popover.position.set(0.45,0.175, 0.2)
    }
    render(){
        return(
            <group ref = "popover" />

        )
    }
}