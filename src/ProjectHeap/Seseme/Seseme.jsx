import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
// import React3 from 'react-three-renderer'
import * as THREE from 'three'


// import ParsedModel from '../parsed_model.js'

// require('three-obj-loader')(THREE)
        

// const duckOBJ=require('./duck.obj')
const duckJSON=require('./duck.model.json')

// import {duck} from './duck.model.json'

@observer export default class Seseme extends React.Component{

    @observable parsedModel=null
    @observable geometry=null

    constructor( props, context) {
        super( props, context )
        // console.log(seseme)
        // let loader=require('three-json-loader')(THREE)
        // this.parsedModel.load('./duck.obj')
        // this.parsedModel=loader(duck)
        
        // loader.onLoad=()=>{console.log('yay')}
        // this.loadOBJ()
        // this.loadJSON()
        // this.askwonLoad()

        // this.parsedModel = new THREE.JSONLoader().parse(duckJSON)
        this.setModel()

    }

    @action setModel = () => {
        this.parsedModel = new THREE.JSONLoader().parse(duckJSON)
    }

    @action
    askwonLoad = () => {
        const loadingManager = new THREE.LoadingManager();
        loadingManager.itemStart('./duck.model.json');

        // const jsonLoader = new THREE.XHRLoader()
        const jsonLoader = new THREE.JSONLoader()
        console.log(jsonLoader)
        console.log(jsonLoader.parse(duckJSON))
        // jsonLoader.parse(duck)
        jsonLoader.load(require('./duck.model.json'), duck => {
            // console.log(duck)
            // this.setState({ myshit });
            loadingManager.itemEnd('./duck.model.json');
        }, (prog)=> { console.log(prog) }, ()=>{console.log('errer')});
    }


    // @action
    // loadJSON = () => {
    //     // const duck = require('./duck.model.js')
    //     // console.log(duck)
    //     const duckjson = JSON.parse(duck)
    //     console.log(duckjson)
    //     var loader = new THREE.JSONLoader()
    //     loader.load(duckjson, (geo) => {
    //         // this.refs.group.add(object)
    //         console.log(geo)
    //     })
    // }
    // @action
    // loadOBJ = () =>{
    //     var loader=new THREE.OBJLoader()
    //     loader.load(duckOBJ, object => {
    //         for(let child of object.children) {
    //             child.material.side = THREE.DoubleSide
    //             this.refs.group.add(child)
    //         }
    //         // this.parsedModel = object
    //         // this.refs.group.add(object)
    //     })
    // }

    componentDidMount(){
        console.log(this.parsedModel.geometry)
        // this.refs.group.add(this.parsedModel)
    }

    render(){
        // let meshes=[];

        //   this.parsedModel.geometries.forEach((geometry, uuid) => {
        //     // get the right material for this geometry using the material index
        //     // let material=this.parsedModel.materialArray[materialIndices.get(uuid)];

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
        // console.log('parsed mdl children 1')
        console.log(this.parsedModel)

        return (
            <group ref = "group">
                <mesh >
                    <boxGeometry width = {1} height = {1} depth = {1} />
                    <meshBasicMaterial color = {0x000888} />
                </mesh>
                {this.parsedModel && 
                    <mesh 
                            scale = {new THREE.Vector3(0.05, 0.05, 0.05)}
                            position = {new THREE.Vector3(-2, 2, -5)} >
                       <geometry
                         vertices={this.parsedModel.geometry.vertices}
                         faces={this.parsedModel.geometry.faces}
                         // faceVertexUvs = {this.parsedModel.geometry.faceVertexUvs}
                         // colors = {this.parsedModel.geometry.colors}
                       />
                       <meshPhongMaterial color= {0x000fff} />
                     </mesh>
                }
            </group>
        )

    }
}