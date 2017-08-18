import React from 'react'
import * as THREE from 'three'

import {noCollisions, normalCollisions, collidesWithAll} from './constants'

export default class Constraint extends React.Component{
    /* for walls and grounds
        - configurable through props
            -size, position, display

        TODO
        - upon prop phase, the collision group should change, allowing
            bodies to pass through
    */

    componentDidMount(){
        this.init()
    }
    componentWillReceiveProps(newProps){
        if(this.props.noclip !== newProps.noclip){
            console.log('noclip changed')
            if(newProps.noclip){
                console.log('noclip enabled')
                this.props.mutate(this.props.name, 'belongsTo', noCollisions)
                this.props.mutate(this.props.name, 'setupMass', [0x1, true], true)
            }
            else{
                console.log('noclip disable')
                this.removeSelf()
                this.init()
                this.props.mutate(this.props.name, 'setupMass', [0x2, false], true)
            }
        }
    }

    init = () => {
        const {width, height, depth} = this.props
        const pos = this.props.position
        const physicsModel = {
            type: 'box', 
            size: [width, height, depth], 
            pos: [pos.x,pos.y,pos.z],
            friction: 0.6,
            belongsTo: normalCollisions,
            collidesWith: collidesWithAll,
        }
        if(this.props.onMount) this.props.onMount(this.props.name, physicsModel)
    }
    removeSelf = () => {
        this.props.unmount(this.props.name)
    }


    
    render(){
        const {width, height, depth} = this.props
        const pos = this.props.position
        return(
            <mesh 
                visible = {this.props.show} 
                position = {new THREE.Vector3(pos.x, pos.y, pos.z)}
            >
                <boxGeometry width = {width} height = {height} depth = {depth} />
                <meshNormalMaterial />
            </mesh>
        )
    }
}

Constraint.defaultProps = {
    show: false, 
    static: true,
    phase: false
}