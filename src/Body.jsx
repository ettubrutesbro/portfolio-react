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
    init = () =>{
        this.props.onMount(this.props.name,this.physicsModel)
    }
    componentDidMount(){ this.init() }
    componentWillReceiveProps(newProps){
        if(newProps.exists!==this.props.exists){
            if(newProps.exists) this.init()
            if(!newProps.exists) this.removeSelf()
        }
    }
    componentWillUnmount(){
        console.log('body ' + this.props.name + ' is unmounting')
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
                    {makeColliderMesh(this.physicsModel)}

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
    exists: true,
    showCollider: false
}
