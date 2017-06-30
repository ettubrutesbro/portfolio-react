import React from 'react'
// import {observable, action} from 'mobx'
// import {observer} from 'mobx-react'
import * as THREE from 'three'

// const pedestalJSON=

// @observer
export default class Seseme extends React.Component{

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

        
        return (
            <group ref = "group">
                {this.pedestal && 
                    <mesh 
                        position = {new THREE.Vector3(0.12,.55,0.1)}
                        name = 'pedestal'
                        scale = {new THREE.Vector3(0.08, 0.08, 0.08)}
                    >
                       <geometry
                         vertices={this.pedestal.geometry.vertices}
                         faces={this.pedestal.geometry.faces}
                         // faceVertexUvs = {this.parsedModel.geometry.faceVertexUvs}
                         // colors = {this.parsedModel.geometry.colors}
                       />
                       <meshPhongMaterial color={0x000fff} />
                     </mesh>
                }
                {this.pillar &&
                    <mesh

                    > 
                        <geometry
                            vertices={this.pillar.geometry.vertices}
                            faces={this.pillar.geometry.faces}
                        />
                        <meshBasicMaterial color = {0x000fff} />
                    </mesh>
                    
                }
            </group>
        )

    }
}