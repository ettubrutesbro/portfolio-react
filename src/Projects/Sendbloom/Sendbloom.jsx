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
        this.sbmodal = loader.parse(require('./sb-modal.json'))
        
    }
    makeLogoMesh = () => {
        this.makeMeshWithMtlIndices('sendbloom', 'logo', this.sblogo.geometry, [
            {range: [0, 17], color: 0x16a8a8},
            {range: [18, 35], color: 0xef9900},
            {range: [36, 53], color: 0xdb543e},
            {range: [54, 60], color: 0xffab01},
            {range: [61, 67], color: 0x09c3cc},
            {range: [68, 74], color: 0xf96244},
            {range: [75, 81], color: 0xffab01}, 
            {range: [82, 88], color: 0x09c3cc}, 
            {range: [89, 95], color: 0xf96244}, //dumb repetition but whatever for now
        ])

    }
    makeModalMesh = () => {
        this.makeMeshWithMtlIndices('sendbloom', 'modal', this.sbmodal.geometry, [
            {faces: [6,7], color: 0xfcfdff}, //top
            {range: [118,119], color: 0xb1b1b1}, //chamfers
            {range: [138,145], color: 0xccd2d6}, //sides
            {faces: [42,43,44,45,82,83], color: 0xededed}, //front
            {range: [101,115], color: 0xededed}, 
            {range: [120,137], color: 0xededed}, 
            {range: [95,101], color: 0xededed}, 
            {faces: [89,90], color: 0xededed}, //inside front
            {range: [78,81], color: 0xededed}, 
            {range: [48,51], color: 0xccd2d6}, //sides
            {range: [54,57], color: 0xccd2d6}, 
            {range: [62,65], color: 0xccd2d6}, 
            {faces: [70,71], color: 0xccd2d6}, 
            {faces: [87,88], color: 0xccd2d6}, 
            {faces: [84, 85, 86, 91, 92, 93, 94], color: 0xccd2d6}, //bottom
            {faces: [46,47,58,59,66,67], color: 0xccd2d6},
            {range: [20,29], color: 0xb1b1b1}, //inside X face
            {range: [8,19], color: 0xd7d7d7}, //X walls
            {range: [30,38], color: 0xd7d7d7}, 
            // {faces: [3], color: 0x39aef8}, //interior highlight for top listrow
            // {range: [45,52], color: 0x39aef8}, 
            {faces: [76,77], color: 0xffffff}
        ])

    }


    makeMeshWithMtlIndices = (name, groupref, geometry, faceColorArray) => {
        //eventually, this is probably gonna be a utility function for multiple PresentationModels
        //given a geometry and sets of ranges
        /*
        geometry , [
            {faces: [0,53], color: 0x16a8a8},
            {faces: [54,75], color: 0xff0000},
            ...etc.
        ]
        */
        const faces = geometry.faces
        let colors = []
        console.log('inserting ' + faces.length + '-face geometry into ' + groupref)
        for (var i = 0; i<faces.length; i++){
            //which range am i in? 
            faces[i].materialIndex = i
            let match = false
            let it = 0
            while(!match){ //provided lo-hi range to apply a color to
                console.log(faceColorArray, it)
                if(!faceColorArray[it]){ //error?
                    colors[i] = new THREE.MeshBasicMaterial({color: 0x000000})
                    match = true
                    break
                }
                if(faceColorArray[it].range){
                    const lo = faceColorArray[it].range[0]
                    const hi = faceColorArray[it].range[1]
                    if(i >= lo && i <= hi){
                        colors[i] = new THREE.MeshBasicMaterial({color: faceColorArray[it].color, transparent: true})
                        match = true
                        break
                    }
                    it++
                }else{ //variable-length list of indices to apply color to `faces`
                    if(faceColorArray[it].faces.includes(i)){
                        colors[i] = new THREE.MeshBasicMaterial({color: faceColorArray[it].color, transparent: true})
                        match = true
                        break
                    }
                    it++
                }
            }
        }
        //potentially needs to be separate, but integrated for now: addition into scene
        let mesh = new THREE.Mesh(geometry, colors)
        mesh.name = name
        this.refs[groupref].add(mesh)

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
        box.sortFacesByMaterialIndex()

        let mesh = new THREE.Mesh( box, mtls )
        mesh.name = "sendbloom"
        groupref.add( mesh )
    }



    componentDidMount = () =>{
        this.makeLogoMesh()
        this.makeModalMesh()
        this.makeBoxWithFaceMtl(
            this.refs.window, 
            [1.6, 0.8, 0.15], 
            {front: 0xededed, left: 0xccd2d6, bottom: 0xccd2d6, right: 0xccd2d6,
                top: 0x5e5e5e, back: 0xededed}
        )
        this.makeBoxWithFaceMtl(
            this.refs.navbar, 
            [1.6, 0.2, 0.19], 
            {front: 0x3c647c, left: 0x25485e, bottom: 0x25485e, right: 0x25485e,
                top: 0x8397a7, back: 0x3c647c}
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
        for(var i = 0; i<4; i++){
            const navitem = this.refs['navitem'+i]
            if(this.navItemTween[i]) this.navItemTween[i].stop()
            this.navItemTween[i] = new TWEEN.Tween({opacity: 1})
                .to({opacity: 0}, 250)
                .onUpdate(function(){
                    navitem.material.opacity = this.opacity
                })
                .start()
        }

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