import React from 'react'
import {observable, action, autorun} from 'mobx'
import {observer} from 'mobx-react'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

@observer
export class SendbloomModel extends React.Component{

    constructor(props, context){
        super( props, context )
        this.loadModels()
    }

    loadModels = () => {
        const loader = new THREE.JSONLoader()
        this.logo = loader.parse(require('./sb-logo.json'))
    }

    render(){

        return(
            <group ref = "group">
                <mesh 
                    name = "sendbloom"
                    // position = {new THREE.Vector3(5,-0.5,5)}
                    rotation = {new THREE.Euler(90,0,0)}
                >
                    <geometry 
                        vertices = {this.logo.geometry.vertices}
                        faces = {this.logo.geometry.faces}
                    />
                    <meshNormalMaterial side = {THREE.DoubleSide}/>
                </mesh>

            </group>
        )
    }
}