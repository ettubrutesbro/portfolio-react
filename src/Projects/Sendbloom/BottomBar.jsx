import React from 'react'
import * as THREE from 'three'

import {v3, twn, makeColorBox} from '../../utilities.js'

export default class BottomBar extends React.Component{
    componentDidMount(){
        const windowcolor = {front: 0xededed, left:0xccd2d6, bottom: 0xededed, right: 0xededed, top: 0xfbfbfc, back: 0xededed}
        
        makeColorBox('sendbloom', this.refs.bottombar, [1.6, 0.1, 0.06], windowcolor)
        this.refs.bottombar.position.set(0,-0.35,0.09)
    }
    render(){
        return(
            <group ref = "bottombar" />

        )
    }
}