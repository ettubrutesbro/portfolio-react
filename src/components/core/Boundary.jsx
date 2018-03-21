import React from 'react'
import * as THREE from 'three'

import Body from './Body'

// import {v3} from '../../helpers/utilities'
// import {noCollisions, normalCollisions, collidesWithAll} from './constants'

export default class Boundary extends React.Component{
    /* for walls and grounds
        Body, always a box with some other functions called 
            either set to move: false (static boundary), 
                or true for dynamic bounds
                in the latter case, a setPosition call occurs on mount
                that allows us to animate (or set) the position away later
    */
    render(){
        const {pos, width, depth, height, ...restOfProps} = this.props
        const computedPhysicsModel = {
            type: 'box',
            pos: [pos.x,pos.y,pos.z],
            size: [width, height, depth],
            move: this.props.dynamic
        }

        return(
            <Body
                {...this.props}
                physicsModel ={computedPhysicsModel}
                isSelectable = {false}

                // kinematicByDefault = {true}
            />


        )
    }
}
