import React from 'react'
import * as THREE from 'three'
import {isEqual} from 'lodash'
// import {observer} from 'mobx-react'

import {makeColliderMesh, v3} from '../../helpers/utilities'
import {noCollisions, normalCollisions, collidesWithAll} from './constants'

// @observer
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
    makeBody = () =>{
        this.props.onMount(
            this.props.name,
            this.physicsModel,
            this.props.isSelectable,
            !this.props.isSelectable
        )
    }
    componentDidMount(){ 
        if(this.props.exists) this.makeBody()
    }
    componentWillReceiveProps(newProps){
        if(newProps.selected!==this.props.selected && this.props.isSelectable){
            if(newProps.selected===true) this.onSelect()
            else if(newProps.selected==='other' && this.props.selected===true){ this.onDeselect() } //another has been selected
            else if(this.props.selected===true && !newProps.selected) this.onDeselect()
            // else if(this.props.selected==='other' && !newProps.selected) this.respawn()
        }
        //if non selectable (e.g. boundaries) objects see a change to pos, reposition them
        if(!isEqual(newProps.physicsModel.pos, this.props.physicsModel.pos) && !this.props.isSelectable){
            // this.props.force(this.props.name, 'position', newProps.physicsModel.pos)
            this.props.move(this.props.name, newProps.physicsModel.pos)
        }
    }

    onSelect = () => {
        if(this.props.notSelectable) return
        const {name, force, onSelect, baseline} = this.props
        //cobweb for now: the idea that there's an external defined 'selected position'
        force(name, 'rotation', onSelect.rotation || {x:0,y:0,z:0})
        force(name, 'position', {x: onSelect.position.x, y: baseline + onSelect.position.y, z: onSelect.position.z} || {x:0,y:1.5,z:0})
         
        //current design: preserve position, curate rotation, camera looks at object
        // force(name, 'position', this.props.position)
    }
    onDeselect = () => { this.props.letGo(this.props.name) }


    render(){
        const {showCollider, position, debugMtl, name} = this.props
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
                                geo = <boxGeometry key = {name+'geo'+i} width = {mesh.size.w} depth = {mesh.size.d} height = {mesh.size.h} />
                            }
                            else if(mesh.geo === 'sphere'){
                                geo = <sphereGeometry key = {name+'geo'+i} radius = {mesh.size.r} widthSegments = {8}  heightSegments = {8} />
                            }
                            else if(mesh.geo === 'cylinder'){
                                geo = <cylinderGeometry key = {name+'geo'+i}
                                    radiusTop = {mesh.size.r}
                                    radiusBottom = {mesh.size.r}
                                    height = {mesh.size.h}
                                    radialSegments = {8}
                                /> 
                            }
                            return (
                                <mesh name = {this.props.name} key = {'collider'+i}> 
                                    {geo} 
                                    {debugMtl === 'wire' && <meshBasicMaterial wireframe = {true} color = {0xffffff} /> }
                                    {debugMtl === 'normal' && <meshNormalMaterial />}
                                    {debugMtl === 'lambert' && <meshLambertMaterial color = {0xb1b1b1} />}
                                    {debugMtl === 'phong' && <meshPhongMaterial color = {0xd7d7d7} shininess = {0} emissive = {0xb1b1b1}/>}
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
    debugMtl: 'normal',
    physicsModel: {
        type: 'box', size: [1,1,1], pos: [0,10,0], move: true
    },
    onSelect: {
        position: {x: 0,y:3,z:0}, 
        rotation: {x:15,y:45,z:30}
    },
    exists: true,
    showCollider: false,
    isSelectable: true
}

export const Boundary = (props) => {
    return(
        <Body 
            {...props}
            // debugMtl = "wire"
            physicsModel = {{
                type: 'box',
                pos: [props.pos.x,props.pos.y,props.pos.z],
                size: [props.width, props.height, props.depth],
                move: true,
                // friction: 1,
            }}
            isSelectable = {false}
        />
    )
}