import React from 'react'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

import { v3, rads } from '../../helpers/utilities.js'


export default class Wake extends React.Component{
    
    constructor(props, context){
        super(props,context)
        this.loadModels()
    }

    loadModels = () => {
        const loader = new THREE.JSONLoader()
        this.sleeper = loader.parse(require('./sleeper'))
        this.blanketL = loader.parse(require('./blanketL'))
        this.blanketR = loader.parse(require('./blanketR'))
        this.pillows = loader.parse(require('./pillows'))
        this.openeyes = loader.parse(require('./openeyes'))
        this.closedeyes = loader.parse(require('./closedeyes'))
    }

    render(){
        return(
            <group ref = "group" scale = {{x: 0.4, y: 0.4, z: 0.4}}>
                <resources>
                    {this.sleeper &&
                        <geometry resourceId = "sleeper"
                            vertices = {this.sleeper.geometry.vertices}
                            faces = {this.sleeper.geometry.faces}
                        />
                    }
                </resources>

                <mesh name = "wake" ref = "pillows">
                    <geometry vertices = {this.pillows.geometry.vertices} faces = {this.pillows.geometry.faces} />
                    <meshBasicMaterial color = {0xff0000} />
                </mesh>
                <mesh name = "wake" ref = "sleeperL">
                    <geometry vertices = {this.sleeper.geometry.vertices} faces = {this.sleeper.geometry.faces} />
                    <meshBasicMaterial color = {0x001133} />
                </mesh>
                <mesh name = "wake" ref = "sleeperR" position = {v3(0,0,1.775)}>
                    <geometry vertices = {this.sleeper.geometry.vertices} faces = {this.sleeper.geometry.faces} />
                    <meshBasicMaterial color = {0x001133} />
                </mesh>
                    
                    <mesh name = "wake" ref = "blanketL">
                        <geometry vertices = {this.blanketL.geometry.vertices} faces = {this.blanketL.geometry.faces} />
                        <meshBasicMaterial color = {0xff0000} />
                    </mesh>
                    <mesh name = "wake" ref="blanketR">
                        <geometry vertices = {this.blanketR.geometry.vertices} faces = {this.blanketR.geometry.faces} />
                        <meshBasicMaterial color = {0xab99ff} />
                    </mesh>
                    
            </group>
        )
    }
}