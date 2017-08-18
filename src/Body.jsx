import React from 'react'
import * as THREE from 'three'
import {action} from 'mobx'

export default class Body extends React.Component{
    constructor(){
        super()
    }

    componentDidMount(){
        action(this.create)
    }

    create = () => {
        this.object = this.props.world.add({
            name: 'testobj',
            type: 'box',
            pos: [0,10,0],
            size: [1.2,1.2,1.2],
            move: true,
            world: this.props.world,
        //     belongsTo: normalCollisions,
        //     collidesWith: collidesWithAll & ~noCollisions
        })
    }

    render(){
        console.log(this.object)
        return(
            <mesh ref = "body">
                <boxGeometry width = {1} height = {1} depth = {1} />
                <meshNormalMaterial />
            </mesh>
        )
    }
}