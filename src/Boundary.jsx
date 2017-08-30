import React from 'react'
import * as THREE from 'three'

import {v3} from './utilities'
import {noCollisions, normalCollisions, collidesWithAll} from './constants'

export default class Boundary extends React.Component{
    /* for walls and grounds
        - configurable through props
            -size, position, display
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
                this.props.mutate(this.props.name, 'setupMass', [1,true], true)
            }
            else{
                console.log('noclip disable')
                this.removeSelf()
                this.init()
                this.props.mutate(this.props.name, 'setupMass', [1, true], true)
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
            move: this.props.dynamic? true : false,
            belongsTo: normalCollisions,
            collidesWith: collidesWithAll,
        }
        if(this.props.onMount) this.props.onMount(this.props.name, physicsModel)
        if(this.props.dynamic) this.props.mutate(this.props.name, 'setPosition', [pos], true)

        let g = new THREE.Geometry()
        const box = new THREE.BoxGeometry(1,1,1)
        // this code doesnt seem to make a difference in the weird offset thing
        // it's how OIMO's examples were doing placing geometries in compound situations
        // let matrix = new THREE.Matrix4().makeTranslation( pos.x, pos.y, pos.z )
        // matrix.scale(v3(width, height, depth))
        // g.merge(box, matrix)
        // const mtl = new THREE.MeshNormalMaterial()
        // let mesh = new THREE.Mesh(g, mtl)
        // this.refs.group.add(mesh)

    }
    removeSelf = () => {
        this.props.unmount(this.props.name)
    }


    
    render(){
        const {width, height, depth} = this.props
        const pos = this.props.position
        return(
            <mesh ref = "group" position = {v3(pos.x,pos.y,pos.z)}  visible = {this.props.show}>
                <boxGeometry width = {width} depth = {depth} height = {height} />
                <meshNormalMaterial transparent opacity = {0.25} />
            </mesh>
        )
    }
}

Boundary.defaultProps = {
    show: false, 
    static: true,
    phase: false,
    dynamic: false
}