import React from 'react'
import {extendObservable, action} from 'mobx'
import {observer} from 'mobx-react'

import React3 from 'react-three-renderer'
import * as THREE from 'three'
import * as OIMO from 'oimo'

import Body from './Body'
import Ground from './Ground'

export default class SimpleScene extends React.Component{

    // world = new OIMO.World()
    constructor(){
        super()
        extendObservable(this, {
            world: new OIMO.World(),
            bodies: {}
        })
    }

    onAnimate = () => {
        // console.log('wta')
        this.world.step()
    }

    render(){
        // console.log(this.world)
        return(
            <div>
                <React3
                    mainCamera = "camera"
                    width = {window.innerWidth}
                    height = {window.innerHeight}
                    onAnimate = {this.onAnimate}
                >
                    <scene>
                        <perspectiveCamera 
                            name = "camera"
                            fov = {30}
                            aspect = {window.innerWidth / window.innerHeight}
                            near = {0.1} far = {50}
                            position = {new THREE.Vector3(0,2,10)}
                        />

                            {React.Children.map((child)=>{
                                return React.cloneElement()
                            })}

                        <Body world = {this.world} bodies = {this.bodies}/>

                        <Ground world = {this.world} />

                    </scene>
                </React3>
            </div>
        )
    }
}