import React from 'react'
import {observable, action, autorun} from 'mobx'
import {observer} from 'mobx-react'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import {rads} from '../../helpers.js'
import {mapValues} from 'lodash'

@observer
export class SendbloomModel extends React.Component{

    constructor(props, context){
        super( props, context )
        this.loadModels()
        // this.makeLogoMesh()
    }
    loadModels = () => {
        const loader = new THREE.JSONLoader()
        this.logo = loader.parse(require('./sb-logo.json'))
        
    }
    makeLogoMesh = () => {
        //making mesh...
        let geo = this.logo.geometry.clone()
        const faces = geo.faces
        let colors = []
        for (var i = 0; i<faces.length; i++){
            //96 total faces
            faces[i].materialIndex = i

            
            if(i < 32) colors[i] = new THREE.MeshBasicMaterial({color: 0xf96244})
            if(i > 32 && i < 64) colors[i] = new THREE.MeshBasicMaterial({color: 0x09c3cc})
            if(i > 72) colors[i] = new THREE.MeshBasicMaterial({color: 0xffab01})
        }

        // let logoGeo = new THREE.Geometry(this.logo.geometry)
        let mesh = new THREE.Mesh(geo, colors)
        mesh.name = 'sendbloom'
        this.refs.logo.add(mesh)

    }
    componentWillReceiveProps(newProps){
        if(this.props.mode !== newProps.mode){
            if(newProps.mode === 'expanded') this.onExpand()
            else if(newProps.mode === 'selected') this.onSelect()
            else if(newProps.mode === 'normal') this.restoreNormal()
        }
    }
    makeBoxWithFaceMtl = (groupref, dims, colors, defaultOpacity) => {
        let box = new THREE.BoxGeometry(dims[0],dims[1],dims[2])
        colors = mapValues(colors, (c) => { 
            return new THREE.MeshBasicMaterial({
                color: c, opacity: defaultOpacity || 1, transparent: true
            })
        })
        const mtls = [
            colors.right, colors.right,
            colors.left, colors.left,
            colors.top, colors.top,
            colors.bottom, colors.bottom,
            colors.front, colors.front,
            colors.back, colors.back
        ]
        for(var i = 0; i<box.faces.length; i++){
            box.faces[i].materialIndex = i
        }
        // box.sortFacesByMaterialIndex()

        let mesh = new THREE.Mesh( box, mtls )
        mesh.name = "sendbloom"
        groupref.add( mesh )
    }



    componentDidMount = () =>{
        this.makeLogoMesh()
        this.makeBoxWithFaceMtl(
            this.refs.window, 
            [1.6, 0.85, 0.15], 
            {front: 0xededed, left: 0xd7d7cc, bottom: 0xd7d7cc, right: 0xd7d7cc,
                top: 0x5e5e5e, back: 0xededed}
        )
        this.makeBoxWithFaceMtl(
            this.refs.navbar, 
            [1.6, 0.15, 0.2], 
            {front: 0x8397a7, left: 0x3c5f77, bottom: 0x3c5f77, right: 0x3c5f77,
                top: 0xa1bbc9, back: 0x8397a7}
        )
    }

    onSelect = () => {

    }

    restoreNormal = () => {

    }

    onExpand = () => {

    }

    render(){

        return(
            <group ref = "group">
                <group 
                    ref = "logo"
                    rotation = {new THREE.Euler(rads(90),0,0)}
                    scale = {new THREE.Vector3(1,2.75,1)}
                    position = {new THREE.Vector3(0,0.02,0)}
                />
                   
                <group ref = "window" />
                <group ref = "navbar" position = {new THREE.Vector3(0,.5,0)}/>

            </group>
        )
    }
}