import React from 'react'
import * as THREE from 'three'

import {makeColliderMesh, v3} from '../../helpers/utilities'
import {noCollisions, normalCollisions, collidesWithAll} from './constants'

export default class Body extends React.Component{

    constructor(props, context){
        super(props, context)
        const {move} = this.props.physicsModel
        this.physicsModel = { 
            name: this.props.name, 
            belongsTo: normalCollisions,
            collidesWith: collidesWithAll & ~noCollisions,
            move: !move && move!==false? true: false,
            ...this.props.physicsModel 
        }
        this.colliderMeshes = this.props.showCollider? makeColliderMesh(this.physicsModel) : null
    }
    init = () =>{
        this.props.onMount(this.props.name,this.physicsModel,this.props.isSelectable)
    }
    componentDidMount(){ this.init() }
    componentWillReceiveProps(newProps){
        if(newProps.exists!==this.props.exists){
            if(newProps.exists) this.init()
            if(!newProps.exists) this.removeSelf()
        }
        if(newProps.selected!==this.props.selected){
            if(newProps.selected===true) this.onSelect()
            else if(newProps.selected){ } //another has been selected
            else if(this.props.selected===true && !newProps.selected) this.onDeselect()
        }
    }

    onSelect = () => {
        if(this.props.notSelectable) return
        const {name, force, onSelect} = this.props
        force(name, 'rotation', onSelect.rotation || {x:0,y:0,z:0})
        force(name, 'position', onSelect.position || {x:0,y:1.5,z:0})
    }
    onDeselect = () => { this.props.letGo(this.props.name) }
    removeSelf = () => {
        console.log(this.props.name + ' being removed from scene')
        this.props.unmount(this.props.name)
        this.setupMass()
    }
    setupMass = () => {
        this.props.mutate(
            this.props.name, 'setupMass', [0x1, true], true
        )
    }

    render(){
        const {showCollider, position} = this.props
        return(
            <group 
                ref = "group"
                position = {this.props.position} 
                rotation = {new THREE.Euler().setFromQuaternion(this.props.rotation)}
                visible = {this.props.exists}
            >
                {showCollider && 
                    <group>
                        {this.colliderMeshes.map((mesh,i)=>{
                            let geo
                            if(mesh.geo === 'box'){
                                geo = <boxGeometry width = {mesh.size.w} depth = {mesh.size.d} height = {mesh.size.h} />
                            }
                            else if(mesh.geo === 'sphere'){
                                geo = <sphereGeometry radius = {mesh.size.r} widthSegments = {8}  heightSegments = {8} />
                            }
                            else if(mesh.geo === 'cylinder'){
                                geo = <cylinderGeometry
                                    radiusTop = {mesh.size.r}
                                    radiusBottom = {mesh.size.r}
                                    height = {mesh.size.h}
                                    radialSegments = {8}
                                /> 
                            }
                            return (
                                <mesh name = {this.props.name} key = {'collider'+i}> 
                                    {geo} 
                                    <meshNormalMaterial /> 
                                </mesh>
                            )
                            
                        })}
                    </group>
                }

                {this.props.children}

            </group>
        )
    }

}

Body.defaultProps = {
    physicsModel: {
        type: 'box', size: [1,1,1], pos: [0,10,0], move: true
    },
    onSelect: {
        position: {x: 0,y:1.5,z:0}, 
        rotation: {x:15,y:45,z:30}
    },
    exists: true,
    showCollider: false,
    isSelectable: true
}
