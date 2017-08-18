import React from 'react'

import * as THREE from 'three'

export default class Body extends React.Component{

    componentDidMount(){
        const physicsModel = {
            name: this.props.name, ...this.props.physicsModel
        }
        if(this.props.onMount) this.props.onMount(this.props.name,physicsModel)
    }

    render(){
        return(

            <mesh position = {this.props.position} rotation = {this.props.rotation}>
                <boxGeometry width = {1} height = {1} depth = {1} />
                <meshNormalMaterial />
            </mesh>
        )
    }
}

Body.defaultProps = {
    physicsModel: {
        type: 'box', size: [1,1,1], move: true, pos: [0,10,0]
    }
}
