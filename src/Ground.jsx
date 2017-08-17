import React from 'react'
import * as THREE from 'three'
import {noCollisions, normalCollisions, collidesWithAll} from './constants.js'


export default class Ground extends React.Component{

    componentDidMount(){
        this.create()
    }

    create = () =>{
        this.props.world.add({
            name: 'ground',
            type: 'box',
            pos: this.props.position,
            size: [this.props.size, 10, this.props.size],
            friction: 0.6,
            world: this.props.world,
            belongsTo: normalCollisions,
            collidesWith: collidesWithAll,
        })

        console.log(this.props.world)
    }

    render(){

        return(
            <group>
                <mesh quaternion = {new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(1,0,0), -Math.PI/2)}
                >
                    <planeBufferGeometry width = {this.props.size} height = {this.props.size} />
                    <meshNormalMaterial />
                </mesh>
            </group>
        )
    }
}


    Ground.defaultProps = {
        display: true,
        size: 8,
        position: [0, -1, 0],
        phase: false, //instead of switching belongsTo
    }    