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
    @observable navItemTween = [null, null, null, null]

    @observable navItemPositions = [0, 0, 0.0925, .3525]

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
            [1.6, 0.8, 0.15], 
            {front: 0xededed, left: 0xd7d7cc, bottom: 0xd7d7cc, right: 0xd7d7cc,
                top: 0x5e5e5e, back: 0xededed}
        )
        this.makeBoxWithFaceMtl(
            this.refs.navbar, 
            [1.6, 0.2, 0.19], 
            {front: 0x3c647c, left: 0x25485e, bottom: 0x25485e, right: 0x25485e,
                top: 0x8397a7, back: 0x3c647c}
        )
            // const navitemWidths = [0.175, 0.07, 0.085, 0.5, 0.03]
            // for(var i = 0; i<navitemWidths.length; i++){
            //     this.makeBoxWithFaceMtl(
            //         this.refs['navitem'+(i+1)],
            //         [navitemWidths[i], 0.035, 0.025],
            //         {front: 0xededed, left: 0xd7d7cc, bottom: 0xd7d7cc, right: 0xd7d7cc,
            //             top: 0xfbfbfc, back: 0xededed}
            //     )
            // }
            
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
        this.modalTween = new TWEEN.Tween({z: 0, opacity: 0, scaleY: 0.01})
            .to({opacity: 1, scaleY: 1}, 400)
            .onUpdate(function(){
                setModal(this.opacity, this.scaleY)
            })
            .onComplete(function(){
                store.bodies.sendbloom.sleeping = true
            })
            .delay(300)
            .start()
        for(var i = 0; i<4; i++){
            const navitem = this.refs['navitem'+i]
            const delay = i>=2? (i-1)*175 : i*175
            if(this.navItemTween[i]) this.navItemTween[i].stop()
            this.navItemTween[i] = new TWEEN.Tween({opacity: 0})
                .to({opacity: 1}, 250)
                .onUpdate(function(){
                    navitem.material.opacity = this.opacity
                })
                .delay(300 + delay)
                .start()
        }
        this.refs.overlay.visible = true
        const logo = this.refs.logo.children[0]
        this.logoTween = new TWEEN.Tween({
            x: logo.position.x, y: logo.position.y, z: logo.position.z,
            scale: logo.scale.x
        })
            .to({x: -0.675, y: -0.005, z: -0.485, scale: 0.26}, 250)
            .onUpdate(function(){
                logo.position.set(this.x, this.y, this.z)
                logo.scale.set(this.scale, 0.9, this.scale)
            })
            .delay(150)
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
        this.modalTween = new TWEEN.Tween({opacity: 1, scaleY: 1})
            .to({opacity: 0, scaleY: 0.01}, 250)
            .onUpdate(function(){
                setModal(this.opacity, this.scaleY)
            })
            .onComplete(function(){
                modal.visible = false
                store.bodies.sendbloom.sleeping = true
            })
            .start()
        const logo = this.refs.logo.children[0]
        this.logoTween = new TWEEN.Tween({
            x: logo.position.x, y: logo.position.y, z: logo.position.z,
            scale: logo.scale.x
        })
            .to({x: 0, y: 0, z: 0, scale: 1}, 350)
            .onUpdate(function(){
                logo.position.set(this.x, this.y, this.z)
                logo.scale.set(this.scale, this.scale, this.scale)
            })
            .start()

    }
    // @action
    setModal = ( o, scaleY) => {
        const modal = this.refs.modal
        //direct updates (not react or mobx)
        modal.children[0].scale.set(1, scaleY, 1)
        modal.children[0].material.forEach((mtl) => {
            mtl.opacity = o
        })
        const shadow = this.refs.overlay 
        // const shadowMtl = this.refs
        shadow.scale.set(1, scaleY, 1)
        shadow.material.opacity = o 

    }

    onExpand = () => {

    }

    render(){
        const navItemPositions = [0, 0.2, 0.2925, .5525]
        const navItems = [0.15, 0.04, 0.095, 0.22].map((width,i)=>{
            return(
                <mesh ref = {'navitem'+i} 
                    position = {new THREE.Vector3(-.475 + navItemPositions[i], 0, 0.125)}
                >
                    <planeBufferGeometry width = {width} height = {0.035} segments = {i} />
                    <meshBasicMaterial color = {0xededed} transparent opacity = {0}/>
                </mesh>
            )
        })

        return(
            <group ref = "group">
                <resources>
                    <texture resourceId = "shadow" url = {require('./shadow.png')}/> 
                </resources>
                <group 
                    ref = "logo"
                    rotation = {new THREE.Euler(rads(90),0,0)}
                    scale = {new THREE.Vector3(1,2.25,1)}
                    position = {new THREE.Vector3(0, 0.02, 0)}
                />
                   
                <group ref = "window">
                    <mesh name = "sendbloom" ref = "overlay" position = {new THREE.Vector3(0,0.01,0.08)}>
                        <planeBufferGeometry width = {1.6} height = {0.85} segments = {1} />
                        <meshBasicMaterial ref = "overlayMtl" transparent opacity = {0}>
                             <textureResource resourceId = "shadow" />
                        </meshBasicMaterial>
                    </mesh>
      
                </group>
                <group ref = "navbar" position = {new THREE.Vector3(0,.5,0)}>
                    {navItems}
                </group>

                <group ref = "modal" position = {new THREE.Vector3(0, 0.1, 0.45)} />
                    <group ref = "listrow1" position = {new THREE.Vector3(0,0.2,0.49)} />
                    <group ref = "listrow2" position = {new THREE.Vector3(0,0.075,0.49)}/>
                    <group ref = "listrow3" position = {new THREE.Vector3(0,-.05,0.49)}/>
                    <group ref = "listrow4" position = {new THREE.Vector3(0,-.175,.49)}/>
                
            </group>
        )
    }
}