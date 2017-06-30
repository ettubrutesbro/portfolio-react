import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'


@observer
export default class Seseme extends React.Component{

    @observable pillars = [
        {pos: {x:-0.18, y: -.25, z:0.18}, quat: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -Math.PI/2)},
        {pos: {x:0.18, y: 0, z:0.18} },
        {pos: {x:0.18, y: .37, z:-0.18}, quat: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2)},
        {pos: {x:-0.18, y: .5, z:-0.18}, quat: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,-1,0), Math.PI)}
    ]

    constructor( props, context) {
        super( props, context )
        this.setModel()
    }
    // @action
    setModel = () => {
        const loader=new THREE.JSONLoader()
        this.pedestal=loader.parse(require('./pedestal.json'))
        this.pillar=loader.parse(require('./pillar.json'))
    }

    render(){
        const scaleAdjust = new THREE.Vector3(0.08,0.08,0.08)
        const pillarPositions = []

        return (
            <group ref = "group">
                <mesh
                    position = {new THREE.Vector3(0,-1.29,0)}
                    quaternion = {new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI/2)}
                >
                    <planeBufferGeometry width = {0.97} height = {0.97} />
                    <meshNormalMaterial />

                </mesh>
                {this.pedestal && 
                    <mesh 
                        position = {new THREE.Vector3(0.12,.15,0.1)}
                        name = 'seseme'
                        scale = {scaleAdjust}
                    >
                       <geometry
                         vertices={this.pedestal.geometry.vertices}
                         faces={this.pedestal.geometry.faces}
                         // faceVertexUvs = {this.parsedModel.geometry.faceVertexUvs}
                         // colors = {this.parsedModel.geometry.colors}
                       />
                       <meshNormalMaterial color={0x000fff} />
                     </mesh>
                }
                {this.pillar &&
                    <group>
                        {this.pillars.map((p)=>{
                            return(
                                <mesh
                                    name = 'seseme'
                                    scale = {scaleAdjust} 
                                    position = {new THREE.Vector3(p.pos.x, p.pos.y, p.pos.z)}
                                    quaternion = {p.quat || null}
                                >
                                    <geometry
                                        vertices = {this.pillar.geometry.vertices}
                                        faces = {this.pillar.geometry.faces}
                                    />
                                    <meshNormalMaterial />
                                </mesh>
                            )
                        })}
                    </group>
                }
            </group>
        )

    }
}