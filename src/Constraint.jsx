import React from 'react'

import * as THREE from 'three'

export default class Constraint extends React.Component{
    /* for walls and grounds
        - configurable through props
            -size, position, display
        - upon prop phase, the collision group should change, allowing
            bodies to pass through
    */

    componentDidMount(){
        const {width, height, depth} = this.props
        const pos = this.props.position
        const physicsModel = {
            type: 'box', 
            size: [width, height, depth], 
            pos: [pos.x,pos.y,pos.z],
            friction: 0.6,
            // belongsTo: physics.normalCollisions,
            // collidesWith: physics.collidesWithAll,
        }
        if(this.props.onMount) this.props.onMount(this.props.name, physicsModel)
    }
    
    render(){
        const {width, height, depth} = this.props
        const pos = this.props.position
        return(
            <mesh position = {new THREE.Vector3(pos.x, pos.y, pos.z)}>
                <boxGeometry width = {width} height = {height} depth = {depth} />
                <meshNormalMaterial />
            </mesh>
        )
    }
}

Constraint.defaultProps = {
    static: true
}