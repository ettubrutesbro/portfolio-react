import React from 'react'
import {observable, action, autorun} from 'mobx'
import {observer} from 'mobx-react'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import {rads} from '../../helpers.js'
import {mapValues} from 'lodash'

// @observer
export class SendbloomModel extends React.Component{

    @observable modalTween = null
    @observable overlayTween = null

    constructor(props, context){
        super( props, context )
        this.loadModels()
        // this.makeLogoMesh()
    }
    loadModels = () => {
        const loader = new THREE.JSONLoader()
        this.sblogo = loader.parse(require('./sb-logo.json'))
        
    }
    makeLogoMesh = () => {
        //making mesh...
        let geo = this.sblogo.geometry.clone()
        const faces = geo.faces
        let colors = []
        for (var i = 0; i<faces.length; i++){
            //96 total faces
            faces[i].materialIndex = i
            /*
            0-53: interior/extrude faces
            54-74: backside faces
            75+: frontside faces
                75-81: orange
                82-88: blue
                89-95: red 
            */
            if(i <= 17) colors[i] = new THREE.MeshBasicMaterial({color: 0x16a8a8})
            if(i >= 18 && i <= 35) colors[i] = new THREE.MeshBasicMaterial({color: 0xef9900})
            if(i >= 36 &&i <= 53) colors[i] = new THREE.MeshBasicMaterial({color: 0xdb543e})
            //backside
            if(i>=54 && i<=60) colors[i] = new THREE.MeshBasicMaterial({color: 0xffab01})
            if(i>=61 && i<=67) colors[i] = new THREE.MeshBasicMaterial({color: 0x09c3cc})
            if(i>=68 && i<=74) colors[i] = new THREE.MeshBasicMaterial({color: 0xf96244})
            //frontside    
            if(i >= 75 && i <= 81 ) colors[i] = new THREE.MeshBasicMaterial({color: 0xffab01})
            if(i >= 82 && i <= 88) colors[i] = new THREE.MeshBasicMaterial({color: 0x09c3cc})
            if(i >= 89) colors[i] = new THREE.MeshBasicMaterial({color: 0xf96244})
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
            {front: 0x8397a7, left: 0x698191, bottom: 0x698191, right: 0x698191,
                top: 0x9db2ba, back: 0x8397a7}
        )
        this.makeBoxWithFaceMtl(
            this.refs.modal,
            [1.3, .6, 0.085],
            {front: 0xededed, left: 0xd7d7cc, bottom: 0xd7d7cc, right: 0xd7d7cc,
            top: 0xfbfbfc, back: 0xededed},
            0.01
        )
        this.refs.modal.visible = false
        this.refs.overlay.visible = false

    }
    @action
    onSelect = () => {
        const store = this.props.store
        const setModal = this.setModal
        store.bodies.sendbloom.sleeping = false
        store.static = false

        this.refs.modal.visible = true
        if(this.modalTween) this.modalTween.stop()
        this.modalTween = new TWEEN.Tween({z: 0, opacity: 0})
            .to({opacity: 1, z: 0.3}, 350)
            .onUpdate(function(){
                setModal(this.z, this.opacity)
            })
            .onComplete(function(){
                store.bodies.sendbloom.sleeping = true
            })
            .delay(100)
            .start()

    }
    @action
    restoreNormal = () => {
        const store = this.props.store
        const setModal = this.setModal
        const modal = this.refs.modal
        store.bodies.sendbloom.sleeping = false
        store.static = false

        if(this.modalTween) this.modalTween.stop()
        this.modalTween = new TWEEN.Tween({opacity: 1, z: 0.3})
            .to({opacity: 0, z: 0}, 350)
            .onUpdate(function(){
                setModal(this.z, this.opacity)
            })
            .onComplete(function(){
                modal.visible = false
                store.bodies.sendbloom.sleeping = true
            })
            .start()
    }
    // @action
    setModal = (newZ, o) => {
        const modal = this.refs.modal
        //direct updates (not react or mobx)
        modal.children[0].position.set(0, 0, newZ)
        modal.children[0].material.forEach((mtl) => {
            mtl.opacity = o
        })
    }

    onExpand = () => {

    }

    render(){
        const logo = this.logo
        const modal = this.modal
        return(
            <group ref = "group">
                <group 
                    ref = "logo"
                    rotation = {new THREE.Euler(rads(90),0,0)}
                    scale = {new THREE.Vector3(1,2.25,1)}
                    position = {new THREE.Vector3(0, 0.02, 0)}
                />
                   
                <group ref = "window">
                    <mesh name = "sendbloom" ref = "overlay" position = {new THREE.Vector3(0,0,0.081)}>
                        <planeBufferGeometry width = {1.6} height = {0.85} segments = {1} />
                        <meshBasicMaterial ref = "overlay-mtl" color = {0x5e5e5e} transparent opacity = {0} />
                    </mesh>
                </group>
                <group ref = "navbar" position = {new THREE.Vector3(0,.5,0)}/>
                <group ref = "modal" position = {new THREE.Vector3(0, 0.1, 0.15)}/>

            </group>
        )
    }
}