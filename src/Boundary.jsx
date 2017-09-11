import React from 'react'
import * as THREE from 'three'

import Body from './Body'

import {v3} from './utilities'
import {noCollisions, normalCollisions, collidesWithAll} from './constants'

export default class Boundary extends React.Component{
    /* for walls and grounds
        Body, but always a box with some other functions called 
            either set to move: false (static boundary), 
                or true for dynamic bounds
                in the latter case, a setPosition call occurs on mount
                that allows us to animate (or set) the position away later
    */

    componentDidMount(){
        this.init()
    }
    componentWillReceiveProps(newProps){
        if(this.props.selected!==newProps.selected){
            if(this.props.dynamic) console.log('bound ' + this.props.name + ' should move')
        }
    }

    init = () => {
        if(this.props.dynamic){
            const pos = this.props.pos
            this.props.mutate(this.props.name, 'setPosition', [{x:pos.x,y:pos.y,z:pos.z}], true)
        }
        this.props.mutate(this.props.name, 'sleeping', true)
    }
    removeSelf = () => {
        this.props.unmount(this.props.name)
    }


    
    render(){
        const {pos, width, depth, height, dynamic, ...restOfProps} = this.props
        const computedPhysicsModel = {
            type: 'box',
            pos: [pos.x,pos.y,pos.z],
            size: [width, height, depth],
            move: dynamic? true: false, 
        }

        return(

            <Body
                {...this.props}
                physicsModel ={computedPhysicsModel}
                isSelectable = {false}
            />


        )
    }
}
