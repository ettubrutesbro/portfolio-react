import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import React3 from 'react-three-renderer'
import * as THREE from 'three'
import * as OIMO from 'oimo'

@observer
export default class SimpleScene extends React.Component{

    /* basic scene should contain:
        physics 
            - a store for rotation and positions of objects
        mouseinput / picking 
            - tell children through props when they are clicked / selected / etc.
            - parent App needs to know, too. 
        responsive support
            - resize should affect canvas, etc. 
            - design reconsiderations at mobile resolution, etc.? 
    */

    world = new OIMO.World() //TODO: not observable?
    bodies = {}

    @observable positions = []
    @observable rotations = []

    componentDidMount(){
        this.initStore()
    }

    @action initStore = () => {
        this.props.children.forEach((child)=>{
            if(!child.props.static){
                this.positions.push(null)
                
             }
        })
    }

    @action onAnimate = () => {
        this.world.step()

        const bodies = Object.keys(this.bodies)
        for(var i = 0; i<bodies.length; i++){
            const name = bodies[i]
            const body = this.bodies[name]
            this.positions[i] = new THREE.Vector3().copy(body.getPosition())
            this.rotations[i] = new THREE.Quaternion().copy(body.getQuaternion())
        }
    }

    @action addBody = (name, physicsModel) => {
        console.log('adding '+name)
        this.bodies[name] = this.world.add(physicsModel)
    }

    render(){
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

                        {React.Children.map(this.props.children, (child,i)=>{

                            const foistedProps = !child.props.static? {
                                ...child.props,
                                onMount: this.addBody,
                                position: this.positions[i] || new THREE.Vector3(0,3.5,0),
                                rotation: this.rotations[i] || new THREE.Quaternion()
                            }
                            :{ ...child.props, onMount: this.addBody }

                            return React.cloneElement(
                                child, 
                                foistedProps
                            )
                        })}

                    </scene>
                </React3>
            </div>
        )
    }
}