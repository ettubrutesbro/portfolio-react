import React from 'react'
import {observable} from 'mobx'
import {observer} from 'mobx-react'
import React3 from 'react-three-renderer'
import * as THREE from 'three'


import ParsedModel from '../parsed_model.js'
const seseme = require('./orb_lo.js')


export default class Seseme extends React.Component{

    @observable parsedModel = new ParsedModel()

    constructor( props, context) {
        super( props, context )
        console.log(seseme)
        this.parsedModel.loadJSON(seseme).then(
            function resolve(m){
                console.log('loaded', m)
            },
            function reject(e){
                console.log('error', e)
            }
        )
    }

    componentDidMount(){
        console.log(this.parsedModel)
    }

    render(){
        // let meshes = [];

        //   this.parsedModel.geometries.forEach((geometry, uuid) => {
        //     // get the right material for this geometry using the material index
        //     // let material = this.parsedModel.materialArray[materialIndices.get(uuid)];

        //     meshes.push(
        //       <mesh
        //         key={uuid}
        //       >
        //         <geometry
        //           vertices={geometry.vertices}
        //           faces={geometry.faces}
        //         />
        //         <meshBasicMaterial color= {0x000fff} />
        //       </mesh>
        //     );
        //   })


        return (
            <mesh position = {new THREE.Vector3()} rotation = {new THREE.Quaternion()} >
                <boxGeometry width = {1} height = {1} depth = {1} />
                <meshBasicMaterial color = {0xfff000} />
            </mesh>
        )

    }
}