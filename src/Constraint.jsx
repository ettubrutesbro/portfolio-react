import React from 'react'
import * as THREE from 'three'

import {v3} from './utilities'
import {noCollisions, normalCollisions, collidesWithAll} from './constants'

export default class Constraint extends React.Component{
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

        let g = new THREE.Geometry()
        const box = new THREE.BoxGeometry(1,1,1)
        //matrix4.maketranslation(pos)
        //scale that by v3(sizes)
        //merge?? it with the geometry object
        let matrix = new THREE.Matrix4().makeTranslation( pos.x, pos.y, pos.z )
        matrix.scale(v3(width, height, depth))
        g.merge(box, matrix)
        const mtl = new THREE.MeshNormalMaterial()
        let mesh = new THREE.Mesh(g, mtl)
        this.refs.group.add(mesh)

    }
    removeSelf = () => {
        this.props.unmount(this.props.name)
    }


    
    render(){
        const {width, height, depth} = this.props
        const pos = this.props.position
        return(
            <group ref = "group"  visible = {this.props.show}>

            </group>
        )
    }
}

Constraint.defaultProps = {
    show: false, 
    static: true,
    phase: false
}