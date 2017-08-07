import React from 'react'
import * as THREE from 'three'

import {v3, twn, makeColorBox} from '../../utilities.js'

export default class Sidebar extends React.Component{
    componentDidMount(){
        const windowcolor = {front: 0xededed, left:0xccd2d6, bottom: 0xededed, right: 0xededed, top: 0xfbfbfc, back: 0xededed}
        
        makeColorBox('sendbloom', this.refs.sidebar, [0.35, 0.925, 0.075], windowcolor)
        this.refs.sidebar.position.set(-0.55,0,0.325)
    }
    render(){
        return(
            <group ref = "sidebar" />

        )
    }
}