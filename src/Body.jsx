import React from 'react'
import * as THREE from 'three'

import {makeColliderMesh} from './utilities'
import {noCollisions, normalCollisions, collidesWithAll} from './constants'

export default class Body extends React.Component{

    /* should form the basis of all moving (and static..?) 3d objects
        physics model as prop
            - external dictionary defines shape(s), position(s), sizes, etc. 
        TENTATIVE
        unmountability
            componentWillUnmount - methods for removing the oimo body
            and the three objects from render tree blah blah

        TODO
        container for children
            - collision model optionally displayable as child(
                -- or should it be generated from the physics model....
                -- a utility function, maybe, for generating a physics mesh
            - presentation model should be contained within
        able to receive selection / states
            - prop from outside?
            - needs to know when it's been clicked
        kinematic; can be animated to fixed position
            - tween support: cant affect external prop from inside here, so 
            it should be able to pass destinations / data to its parent for 
            a tween
            
    */
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
    componentWillUnmount(){
        console.log('body ' + this.props.name + ' is unmounting')
    }
    onSelect = () => {
        const {name, force, onSelect} = this.props

        force(name, 'rotation', onSelect.rotation || {x:0,y:0,z:0})
        force(name, 'position', onSelect.position || {x:0,y:1.5,z:0})

        //presentation model: play selection animation
    }
    onDeselect = () => {
        // body.controlRot = false
        // body.isKinematic = false
        // body.sleeping = false

        //presentation model: reverse play selection animation
    }
    removeSelf = () => {
        console.log(this.props.name + ' being removed from scene')
        this.props.unmount(this.props.name)
    }

    render(){
        const {showCollider} = this.props
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
                            let geometry
                            if(mesh.geo === 'box'){
                                geometry = <boxGeometry
                                    width = {mesh.size.w}
                                    height = {mesh.size.h}
                                    depth = {mesh.size.d}
                                />
                            }
                            else if(mesh.geo === 'sphere'){
                                geometry = <sphereGeometry
                                    radius = {mesh.size.r}
                                    widthSegments = {8}
                                    heightSegments = {8}
                                />

                            }
                            else if(mesh.geo === 'cylinder'){
                                geometry = <cylinderGeometry
                                    radiusTop = {mesh.size.r}
                                    radiusBottom = {mesh.size.r}
                                    height = {mesh.size.h}
                                    radialSegments = {8}
                                />
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
        position: {x: 0,y:0,z:0}, 
        rotation: {x:0,y:1.5,z:0}
    },
    exists: true,
    showCollider: false
}
