import React from 'react'
import * as THREE from 'three'

import {v3, twn, makeColorBox, makeColorMesh} from '../../utilities.js'

export default class Aptec extends React.Component{
    constructor(props,context){
        super(props, context)
        this.loadModels()
    }
    loadModels = () => {
        const loader = new THREE.JSONLoader()
        this.aptecrows = loader.parse(require('./aptec-rows.json'))
        this.aptecx = loader.parse(require('./aptec-xbutton.json'))
        this.aptecslot = loader.parse(require('./aptec-xslot.json'))
    }
    componentDidMount = () => { //copy of makeModalMesh
        const actionblue = {front: 0x39aef8, left:0x3b8bb8, bottom: 0x3b8bb8, right: 0x3b8bb8,top: 0x66ccff, back: 0x3b8bb8}
        const windowcolor = {front: 0xededed, left:0xccd2d6, bottom: 0xededed, right: 0xededed, top: 0xfbfbfc, back: 0xededed}
        makeColorMesh('sendbloom', this.refs.body , this.aptecrows.geometry, [
            //front
            {range: [42,61], color: 0xededed}, {range: [64,69], color: 0xededed},
            //front inside
            {range: [32,37], color: 0xfbfbfc}, {faces: [40,41], color: 0xfbfbfc},
            //inside sides
            {range: [4,7], color: 0xccd2d6}, {range: [10,13], color: 0xccd2d6},
            {range: [18,21], color: 0xccd2d6}, {faces: [26,27,38,39], color: 0xccd2d6},
            //top and bottom inside
            {range: [14,17], color: 0xe1e3e5}, {range: [22,25], color: 0xe1e3e5},
            {range: [28,31], color: 0xe1e3e5}, {faces: [2,3,8,9], color: 0xe1e3e5},
            //sides, and back
            {range: [70,73], color: 0xccd2d6}, {faces: [0,1], color: 0xededed},
            //top and bottom
            {faces: [74,75], color: 0xfbfbfc},  {faces: [62,63], color: 0xb5bfc4}
        ])
        makeColorBox('sendbloom', this.refs.modalbutton, [0.175, 0.09, 0.0175], actionblue)   

        makeColorMesh('sendbloom', this.refs.aptecslot, this.aptecslot.geometry, [
            //front inside
            {range: [12,21], color: 0xccd2d6},
            //face up
            {faces: [0,1,6,7,10,11], color: 0xe1e3e5},
            //face down
            {faces: [2,3,4,5,8,9], color: 0xb5bfc4},{range: [22,33], color: 0xb5bfc4},
            //outsides
            {faces: [54,55], color: 0xfbfbfc}, {faces: [39,40], color: 0xccd2d6},
            {faces: [52,53,58,59], color: 0xededed},
            {range: [34,38], color: 0xededed}, {range: [41,51], color: 0xededed}
        ])

        makeColorMesh('sendbloom', this.refs.aptecx, this.aptecx.geometry, [
            {range: [0,9], color: 0x39aef8},
            {range: [16,21], color: 0x66ccff}, //light at top
            {faces: [12,13,26,27], color: 0x66ccff},
            {faces: [22,23], color: 0xa9dbef},
            {range: [28,33], color: 0x3b8bb8},
            {faces: [10,11,14,15,24,25], color: 0x3b8bb8},
        ])

        makeColorBox('sendbloom', this.refs.aptecxleft, [1.0918,0.12,0.114], windowcolor)
        makeColorBox('sendbloom', this.refs.aptecxright, [0.22,0.12,0.114], windowcolor)
        makeColorBox('sendbloom', this.refs.partymodal, [1.195, 0.605, 0.11], windowcolor)          

        makeColorBox('sendbloom', this.refs.exittext2, [0.025,0.0225,0.015], actionblue)
        makeColorBox('sendbloom', this.refs.exittext3, [0.072,0.0225,0.015], actionblue)

        this.refs.aptecx.position.set(0,0,-0.05)
        this.refs.aptecxright.scale.set(0.001,1,1)
        this.refs.aptecxright.visible = false
        this.refs.modal.visible = false
        this.refs.party.visible = false
        this.refs.modal.scale.set(1,0.01,1)
        this.refs.modalshadow.material.opacity = 0
    
    }
    onSelect = (unselect) => { //copy of onSelect
        // const store = this.props.store
        // store.bodies.sendbloom.sleeping = false
        // store.static = false

        const modal = this.refs.modal
        const shadow = this.refs.modalshadow.material
        
        if(this.modalScaleTween) this.modalScaleTween.stop()

        let modalScale = [{x: modal.scale.x, y: modal.scale.y, z: modal.scale.z}, {x: 1, y: unselect? 0.01 : 1, z: 1}]

        const reset = unselect? () => { modal.visible = false; this.switchBody(true) } : null

        this.refs.modal.visible = true
        this.modalScaleTween = twn('scale', modalScale[0], modalScale[1], 400, modal.scale, {delay: !unselect? 300: 0, onComplete: reset})
        twn('opacity', {opacity: shadow.opacity}, {opacity: unselect? 0: 1}, 400, shadow, {delay: !unselect?100:0})

        this.timedSwitch = setTimeout(this.switchBody, 3500)

    }


    switchBody = (reset) => {
        const store = this.props.store
        store.bodies.sendbloom.allowSleep = false
        store.bodies.sendbloom.sleeping = false
        // store.bodies.sendbloom.isKinematic = true
        store.static = false

        const list = this.refs.aptecbody
        const partyobj = this.refs.party
        const partymodal = this.refs.partymodal
        const topleft = this.refs.aptecxleft.children[0]
        const topright = this.refs.aptecxright
        const xSlot = this.refs.aptecslot
        const xButton = this.refs.aptecx
        const exittext = this.refs.exittext




        if(this.bodyTweens){
            this.bodyTweens.forEach((tween)=>{tween.stop()})
        }

        if(!reset){
            const listPos = [{x: list.position.x}, {x: -1.3 }]
            const partyPos = [{x: partymodal.position.x}, {x: -1.187 }]
            this.bodyTweens = [
                //move / fade aptecbody
                twn('position', listPos[0], listPos[1], 450, list.position),
                twn('opacity', {opacity: 1}, {opacity: 0}, 425, list, {onComplete: ()=>{list.visible=false}, traverseOpacity: true}),
                //move / fade party
                twn('opacity', {opacity: 0}, {opacity: 1}, 425, partyobj, {onStart: ()=>{partyobj.visible=true}, traverseOpacity: true}),
                twn('position', partyPos[0], partyPos[1], 425, partymodal.position ),
                //slot and button movements
                twn('position', {x:topleft.position.x}, {x: -0.11}, 225, topleft.position, {delay: 300, onComplete: ()=>{store.bodies.sendbloom.allowSleep = true}}),
                twn('position', {x:topright.position.x}, {x: -0.1075}, 225, topright.position, {delay: 300, onStart: ()=>{topright.visible=true}}),
                twn('position', {x:xSlot.position.x}, {x: -0.2}, 225, xSlot.position, {delay: 300}),
                twn('scale', {x:topleft.scale.x}, {x: 0.8}, 225, topleft.scale, {delay: 300}),
                twn('scale', {x:topright.scale.x}, {x: 1}, 225, topright.scale, {delay: 300}),
                twn('position', {z:xButton.position.z}, {z: 0.03}, 250, xButton.position, {delay: 430}),
                twn('position', {z:exittext.position.z}, {z: 0.07}, 250, exittext.position, {delay: 430})
            ]
        }
        else{
            list.position.set(0,0,0)
            partymodal.position.set(0,0,0)
            topleft.position.set(0,0,0)
            topright.position.set(0,0,0)
            xSlot.position.set(0,0,0)
            topleft.scale.set(1,1,1)
            topright.scale.set(0.001,1,1)
            xButton.position.set(0,0,-0.05)
            exittext.position.set(0,0,0)
            this.bodyTweens = [
                twn('opacity', {opacity: 0}, {opacity: 1}, 10, list, {onStart: ()=>{list.visible=true}, traverseOpacity: true}),
                twn('opacity', {opacity: 1}, {opacity: 0}, 10, partyobj, {onComplete: ()=>{partyobj.visible=false}, traverseOpacity: true, onComplete: () => {store.bodies.sendbloom.allowSleep = true}}),
            ]

        }
    }

    render(){
        const textItems = [0.168,0.027,-0.115,-0.257].map((yPos,i)=>{
            return (
                <mesh 
                    key = {'aptectext'+i} ref = {'textitem'+i}
                    position = {v3(-0.02,yPos,0.0375)}
                >
                    <planeBufferGeometry width = {0.95} height = {0.05} />
                    <meshBasicMaterial color = {0xfbfbfc} transparent>
                        <textureResource resourceId = {'textline'+(i+1)} />
                    </meshBasicMaterial>
                </mesh>
            )
        })

        return(
              <group ref = "modal" position = {v3(-0, 0.15, 0.85)} >
                <resources>
                    <texture resourceId = "shadow" url = {require('./shadow.png')}/> 
                    <texture resourceId = "textline1" url = {require('./textline1.png')}/> 
                    <texture resourceId = "textline2" url = {require('./textline2.png')}/> 
                    <texture resourceId = "textline3" url = {require('./textline3.png')}/> 
                    <texture resourceId = "textline4" url = {require('./textline4.png')}/> 
                    <texture resourceId = "party" url = {require('./party.png')}/> 
                </resources>
                    <mesh name = "sendbloom" ref = "modalshadow" position = {v3(0,-0.14,-.7575)}>
                        <planeBufferGeometry width = {1.58} height = {0.8} />
                        <meshBasicMaterial transparent >
                             <textureResource resourceId = "shadow" />
                        </meshBasicMaterial>
                    </mesh>
                    <group ref = "aptecbody">
                        <group ref = "body" />
                        <group ref = "modalbutton" position = {v3(0.425,0.175,0.05)} />
                        {textItems}
                        <mesh name = "sendbloom" ref = "modalbuttontext" position = {v3(0.395,0.175,0.059)} >
                            <planeBufferGeometry width = {0.057} height = {0.0175} />
                            <meshBasicMaterial color = {0xfbfbfc} transparent/>
                        </mesh>                   
                        <mesh name = "sendbloom" ref = "modalbuttontext" position = {v3(0.455,0.175,0.059)} >
                            <planeBufferGeometry width = {0.02} height = {0.0175} />
                            <meshBasicMaterial color = {0xfbfbfc} transparent/>
                        </mesh>
                        </group>
                    <group ref = "aptecxleft" position = {v3(-0.089,0.3125,.0165)} />
                    <group ref = "aptecslot">
                        <group ref = "aptecx" />
                    </group>
                    <group position = {v3(0.555,0.3125,.0165)}>
                        <group ref = "aptecxright">
                            <group ref = "exittext">
                                <group ref = "exittext2" position = {v3(-0.0875,-0.01,0)} />
                                <group ref = "exittext3" position = {v3(-0.015,-0.01,0)} />
                            </group>
                        </group>
                    </group>


                    <group ref = "party" position = {v3(1.15,-0.05,.015)}>
                        <group ref = "partymodal">
                        <mesh position = {v3(0,0.125,0.0575)}>
                            <planeBufferGeometry width = {0.215} height = {0.215} />
                            <meshBasicMaterial transparent>
                                <textureResource resourceId = "party" />
                            </meshBasicMaterial>
                        </mesh>

                        <mesh position = {v3(0,-0.075,0.0575)}>
                            <planeBufferGeometry width = {0.35} height = {0.08} />
                            <meshBasicMaterial color = {0x5e5e5e} />
                        </mesh>
                        </group>

                    </group>

                </group>
        )
    }

}