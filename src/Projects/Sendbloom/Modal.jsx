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
        ], 0)
        makeColorBox('sendbloom', this.refs.modalbutton, [0.175, 0.09, 0.0175], actionblue, 0)   

        makeColorMesh('sendbloom', this.refs.aptecslot, this.aptecslot.geometry, [
            //front inside
            {range: [12,21], color: 0xccd2d6},
            //face up
            {faces: [0,1,6,7,10,11], color: 0xe1e3e5},
            //face down
            {faces: [2,3,4,5,8,9], color: 0xb5bfc4},{range: [22,33], color: 0xb5bfc4},
            //outsides
            {faces: [54,55], color: 0xfbfbfc}, {faces: [39,40], color: 0xccd2d6},
            {faces: [52,53,58,59], color: 0x5e5e5e},
            {range: [34,38], color: 0xededed}, {range: [41,51], color: 0xededed}
        ], 0)

        makeColorMesh('sendbloom', this.refs.aptecx, this.aptecx.geometry, [
            {range: [0,100], color: 0x39aef8}
        ])

        makeColorBox('sendbloom', this.refs.aptecxleft, [1.0918,0.12,0.115], windowcolor, 0)
        makeColorBox('sendbloom', this.refs.aptecxright, [0.22,0.12,0.115], windowcolor, 0)
        makeColorBox('sendbloom', this.refs.partymodal, [1.195, 0.605, 0.11], windowcolor, 0)          

        makeColorBox('sendbloom', this.refs.exittext2, [0.025,0.025,0.015], actionblue)
        makeColorBox('sendbloom', this.refs.exittext3, [0.072,0.025,0.015], actionblue)


        this.refs.aptecxright.scale.set(0.001,1,1)
        this.refs.aptecxright.visible = false
        this.refs.modal.visible = false
        this.refs.party.visible = false
        this.refs.modal.scale.set(1,0.01,1)


    
    }
    onSelect = (unselect) => { //copy of onSelect
        // const store = this.props.store
        // store.bodies.sendbloom.sleeping = false
        // store.static = false

        const modal = this.refs.modal
        
        if(this.modalScaleTween) this.modalScaleTween.stop()
        if(this.modalOpacityTween) this.modalOpacityTween.stop()

        let fade = [{opacity: !unselect? 0 : 1}, {opacity: !unselect? 1 : 0}]
        let modalScale = [{x: modal.scale.x, y: modal.scale.y, z: modal.scale.z}, {x: 1, y: unselect? 0.01 : 1, z: 1}]

        this.refs.modal.visible = true
        this.modalScaleTween = twn('scale', modalScale[0], modalScale[1], 400, modal.scale, null, !unselect? 300:0)
        this.modalOpacityTween = twn('opacity', fade[0], fade[1], 400, modal, unselect?()=>{modal.visible=false} : null, !unselect? 300:0, true)

        setTimeout(this.party, 3500)

    }

    party = () => {
        const store = this.props.store
        store.bodies.sendbloom.sleeping = false
        store.static = false
        const listPos = [{x:0}, {x: -1.3}]
        const partyPos = [{x: 0}, {x: -1.187}]

        this.aptecPositionTween = twn('position', listPos[0], listPos[1], 500, this.refs.aptecbody.position, null, null)
        this.aptecOpacityTween = twn('opacity', {opacity: 1}, {opacity: 0}, 500, this.refs.aptecbody, ()=>{this.refs.aptecbody.visible=false}, null, true)
        this.refs.party.visible = true
        this.partyOpacityTween = twn('opacity', {opacity: 0}, {opacity: 1}, 500, this.refs.party, null, null, true)
        this.partyTween = twn('position', partyPos[0], partyPos[1], 500, this.refs.partymodal.position, null, null)

        twn('position', {x:0}, {x: -0.11}, 250, this.refs.aptecxleft.children[0].position, null, 200)
        twn('position', {x:0}, {x: -0.1075}, 250, this.refs.aptecxright.position, null, 200)
        twn('position', {x:0}, {x: -0.2}, 250, this.refs.aptecslot.position, null, 200)
        twn('position', {z:0}, {z: 0.03}, 250, this.refs.aptecx.position, null, 200)
        this.refs.aptecxright.visible = true
        twn('scale', {x:1}, {x: 0.8}, 250, this.refs.aptecxleft.children[0].scale, null, 200)
        twn('scale', {x:0.01}, {x: 1}, 250, this.refs.aptecxright.scale, null, 200)
        
    }

    render(){
        const textItems = [0.168,0.027,-0.115,-0.257].map((yPos,i)=>{
            return (
                <mesh 
                    key = {'aptectext'+i} ref = {'textitem'+i}
                    position = {v3(-0.02,yPos,0.0375)}
                >
                    <planeBufferGeometry width = {0.95} height = {0.05} />
                    <meshBasicMaterial color = {0xfbfbfc} transparent opacity = {0}>
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
                        <meshBasicMaterial transparent opacity = {0}>
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
                    <group ref = "aptecxleft" position = {v3(-0.089,0.3125,.01625)} />
                    <group ref = "aptecslot">
                        <group ref = "aptecx" />
                    </group>
                    <group position = {v3(0.55,0.3125,.01625)}>
                        <group ref = "aptecxright">
                            <group ref = "exittext">
                                <group ref = "exittext2" position = {v3(-0.0875,-0.01,0.07)} />
                                <group ref = "exittext3" position = {v3(-0.015,-0.01,0.07)} />
                            </group>
                        </group>
                    </group>


                    <group ref = "party" position = {v3(1.15,-0.05,.015)}>
                        <group ref = "partymodal">
                        <mesh position = {v3(0,0.075,0.0575)}>
                            <planeBufferGeometry width = {0.225} height = {0.225} />
                            <meshBasicMaterial transparent>
                                <textureResource resourceId = "party" />
                            </meshBasicMaterial>
                        </mesh>

                        <mesh position = {v3(0,-0.1,0.0575)}>
                            <planeBufferGeometry width = {0.35} height = {0.025} />
                            <meshBasicMaterial color = {0x5e5e5e} />
                        </mesh>
                        </group>

                    </group>

                </group>
        )
    }

}