import React from 'react'
import * as THREE from 'three'

import {makeColliderMesh, v3} from './utilities'
import {noCollisions, normalCollisions, collidesWithAll} from './constants'

export default class Body extends React.Component{
    physicsModel = { 
        name: this.props.name, 
        belongsTo: normalCollisions,
        collidesWith: collidesWithAll & ~noCollisions,
        ...this.props.physicsModel 
    }
    colliderMeshes = this.props.showCollider? makeColliderMesh(this.physicsModel) : null
    init = () =>{
        this.props.onMount(this.props.name,this.physicsModel)
    }
    componentDidMount(){ this.init() }
    componentWillReceiveProps(newProps){
        if(newProps.exists!==this.props.exists){
            if(newProps.exists) this.init()
            if(!newProps.exists) this.removeSelf()
        }
        if(newProps.selected!==this.props.selected){
            if(newProps.selected) this.onSelect()
            else if(!newProps.selected) this.onDeselect()
        }
    }
    onSelect = () => {
        const {name, force, onSelect} = this.props
        force(name, 'rotation', onSelect.rotation || {x:0,y:0,z:0})
        force(name, 'position', onSelect.position || {x:0,y:1.5,z:0})
    }
    onDeselect = () => { this.props.letGo(this.props.name) }
    removeSelf = () => {
        console.log(this.props.name + ' being removed from scene')
        this.props.unmount(this.props.name)
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
                            // let geo = new THREE.Geometry()
                            let geometry
                            // let matrix = new THREE.Matrix4().makeTranslation(position.x,position.y,position.z)
                            
                            if(mesh.geo === 'box'){
                                geometry = <boxGeometry width = {1} depth = {1} height = {1} />
                                // matrix.scale(v3(mesh.size.w,mesh.size.h,mesh.size.d))
                                // geo.merge(geometry, matrix)
                            }
                            else if(mesh.geo === 'sphere'){
                                geometry = <sphereGeometry radius = {1} widthSegments = {8}  heightSegments = {8} />
                                // matrix.scale(v3(mesh.size.r,mesh.size.r,mesh.size.r))
                                // geo.merge(geometry, matrix)
                            }
                            else if(mesh.geo === 'cylinder'){
                                geometry = <cylinderGeometry
                                    radiusTop = {1}
                                    radiusBottom = {1}
                                    height = {1}
                                    radialSegments = {8}
                                />
                                //  matrix.scale(v3(mesh.size.w,mesh.size.h,mesh.size.d))
                                // geo.merge(geometry, matrix)

                            }
                            return (
                                <mesh name = {this.props.name} key = {'collider'+i}> 
                                    {geometry} 
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
        type: 'box', size: [1,1,1], move: true, pos: [0,10,0]
    },
    onSelect: {
        position: {x: 0,y:1.5,z:0}, 
        rotation: {x:15,y:45,z:30}
    },
    exists: true,
    showCollider: false
}
