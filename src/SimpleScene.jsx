import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import React3 from 'react-three-renderer'
import * as THREE from 'three'
import * as OIMO from 'oimo'

export default class SimpleScene extends React.Component{

    // world = new OIMO.World()

    render(){
        return(
            <div>
                <React3
                    mainCamera = "camera"
                    width = {window.innerWidth}
                    height = {window.innerHeight}
                >
                    <scene>
                        <perspectiveCamera 
                            name = "camera"
                            fov = {30}
                            aspect = {window.innerWidth / window.innerHeight}
                            near = {0.1} far = {50}
                            position = {new THREE.Vector3(0,2,10)}
                        />
                        <mesh position = {new THREE.Vector3(0,0,0)}>
                            <boxGeometry width = {1} height = {1} depth = {1} />
                            <meshNormalMaterial />
                        </mesh>

                    </scene>
                </React3>
            </div>
        )
    }
}