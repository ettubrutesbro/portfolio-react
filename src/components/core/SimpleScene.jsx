import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import React3 from 'react-three-renderer'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import * as OIMO from 'oimo'

const tempVector2 = new THREE.Vector2()

import {findDOMNode} from 'react-dom'
import {debounce} from 'lodash'
import {twn, cap1st, rads, v3} from '../../helpers/utilities'

@observer
export default class SimpleScene extends React.Component{



    @observable width = window.innerWidth
    @observable height = window.innerHeight

    cameraPosition = v3(0,0,10)


    componentDidMount(){
        window.addEventListener('resize', this.handleResize)
    }
    componentWillReceiveNewProps(newProps){
        const {width, height } = this.props
        if(newProps.width !== width || newProps.height !== height){
            console.log('width / height props changed')
            // if(physics.static) physics.static = false // so that canvas can adjust if sleeping
            this.handleResize()
        }
    }

    @action handleResize = debounce(() =>{
        this.width = window.innerWidth
        this.height = window.innerHeight
    },50)

    @action debugCycleCamera = () => {

        if(this.camera.position.z === 10) this.cameraPosition = v3(0,2,22)
        else if(this.camera.position.z === 22) this.cameraPosition = v3(0,2,10)
    }

    render(){
        return(
            <div 
                ref = "container"
                onClick = {this.handleClick}
            >
                <React3
                    mainCamera = "camera"
                    width = {this.width}
                    height = {this.height}
                    onAnimate = {this.onAnimate}
                >
                    <scene ref = "scene">
                        <perspectiveCamera 
                            name = "camera"
                            ref = {(perspectiveCamera)=>{this.camera = perspectiveCamera}}
                            fov = {30}
                            aspect = {this.width / this.height}
                            near = {1} far = {200}
                            position = {this.cameraPosition}
                        />

                        {this.props.children}

                    </scene>
                </React3>
            </div>
        )
    }
}