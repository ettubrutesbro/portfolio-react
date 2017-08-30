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
        if(this.props.noclip !== newProps.noclip){
            if(newProps.noclip){
                
            }
            else{
               
            }
        }
    }

    init = () => {
        if(this.props.dynamic){
            const pos = this.props.physicsModel.pos
            this.props.mutate(this.props.name, 'setPosition', [{x:pos[0],y:pos[1],z:pos[2]}], true)
        }
    }
    removeSelf = () => {
        this.props.unmount(this.props.name)
    }


    
    render(){
        const {physicsModel, dynamic, ...restOfProps} = this.props
        const computedPhysicsModel = {
            ...physicsModel,
            move: dynamic? true: false, 
        }

        return(

            <Body
                {...this.props}
                notSelectable = {true}
            />


        )
    }
}
