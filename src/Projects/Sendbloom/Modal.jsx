import React from 'react'
import * as THREE from 'three'

import {v3, twn, makeColorBox, makeColorMesh} from '../../utilities.js'

export default class Modal extends React.Component{
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
        makeColorMesh('sendbloom', this.refs.modal , this.aptecrows.geometry, [
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

        makeColorMesh('sendbloom', this.refs.modal, this.aptecslot.geometry, [
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
        ])
        makeColorBox('sendbloom', this.refs.aptecxleft, [1.092,0.12,0.115], windowcolor)
        makeColorBox('sendbloom', this.refs.aptecxright, [0.25,0.12,0.115], windowcolor)

        makeColorBox('sendbloom', this.refs.party, [1.1, 0.605, 0.11], windowcolor)          

        makeColorBox('sendbloom', this.refs.exittext1, [0.025,0.025,0.0175], actionblue)
        makeColorBox('sendbloom', this.refs.exittext2, [0.025,0.025,0.0175], actionblue)
        makeColorBox('sendbloom', this.refs.exittext3, [0.06,0.025,0.0175], actionblue)


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
        // const logo = this.refs.logo.children[0]
        // const logoPos = logo.position
        // const prospects = this.refs.prospects
        
        if(this.modalScaleTween) this.modalScaleTween.stop()
        if(this.modalOpacityTween) this.modalOpacityTween.stop()
        // if(this.prospectsTween) this.prospectsTween.stop()
        // if(this.logoPosTween) this.logoPosTween.stop()
        // if(this.logoScaleTween) this.logoScaleTween.stop()

        let fade = [{opacity: !unselect? 0 : 1}, {opacity: !unselect? 1 : 0}]
        let modalScale = [{x: modal.scale.x, y: modal.scale.y, z: modal.scale.z}, {x: 1, y: unselect? 0.01 : 1, z: 1}]
        // let logoPositions = [{x: logoPos.x, y: logoPos.y, z: logoPos.z}, !unselect? {x: -0.675, y:-.005, z: -.485} : {x:0, y:0, z:0}]
        // let logoScales = [{x: logo.scale.x, y: logo.scale.y, z: logo.scale.z}, !unselect? {x: 0.26, y:0.8, z: 0.26} : {x:1,y:1,z:1}]

        // this.prospectsTween = twn('opacity', {opacity: prospects.material.opacity}, fade[1], 400, prospects.material, null, null)
        this.refs.modal.visible = true
        this.modalScaleTween = twn('scale', modalScale[0], modalScale[1], 400, modal.scale, null, !unselect? 300:0)
        this.modalOpacityTween = twn('opacity', fade[0], fade[1], 400, modal, unselect?()=>{modal.visible=false} : null, !unselect? 300:0, true)
        // this.logoPosTween = twn('position', logoPositions[0], logoPositions[1], 250, logo.position, null, !unselect? 150:0)
        // this.logoScaleTween = twn('scale', logoScales[0], logoScales[1], 250, logo.scale, null, !unselect? 150:0)
        // for(var i = 0; i<4; i++){
        //     const navitem = this.refs['navitem'+i]
        //     navitem.visible = true
        //     const delay = i>=2? (i-1)*175 : i*175
        //     if(this.navItemTween[i]) this.navItemTween[i].stop()
        //     this.navItemTween[i] = twn('opacity', fade[0], fade[1], 250, navitem.material, unselect? ()=>{navitem.visible=false} : null ,!unselect? 300+delay:0)
        // }

    }

    render(){
        const textItems = [0.168,0.027,-0.115,-0.257].map((yPos,i)=>{
            return (
                <mesh 
                    key = {'aptectext'+i} ref = {'textitem'+i}
                    position = {v3(-0.02,yPos,0.0375)}
                >
                    <planeBufferGeometry width = {0.95} height = {0.05} />
                    <meshBasicMaterial color = {0xfbfbfc} >
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
                </resources>
                    <mesh name = "sendbloom" ref = "modalshadow" position = {v3(0,-0.14,-.7575)}>
                        <planeBufferGeometry width = {1.58} height = {0.83} />
                        <meshBasicMaterial transparent opacity = {0}>
                             <textureResource resourceId = "shadow" />
                        </meshBasicMaterial>
                    </mesh>
                    <group ref = "modalbutton" position = {v3(0.425,0.175,0.05)} />
                    <group ref = "aptecxleft" position = {v3(-0.089,0.3125,.01625)} />
                    <group ref = "aptecxright" position = {v3(0.55,0.3125,.01625)}>
                        <group ref = "exittext1" position = {v3(-0.06,0,0.09)} />
                        <group ref = "exittext2" position = {v3(-0.02,0,0.09)} />
                        <group ref = "exittext3" position = {v3(0.036,0,0.09)} />
                    </group>
                    <mesh name = "sendbloom" ref = "modalbuttontext" position = {v3(0.395,0.175,0.059)} >
                        <planeBufferGeometry width = {0.057} height = {0.0175} />
                        <meshBasicMaterial color = {0xfbfbfc} />
                    </mesh>                   
                    <mesh name = "sendbloom" ref = "modalbuttontext" position = {v3(0.455,0.175,0.059)} >
                        <planeBufferGeometry width = {0.02} height = {0.0175} />
                        <meshBasicMaterial color = {0xfbfbfc} />
                    </mesh>

                    {textItems}

                    <group ref = "party" position = {v3(1.15,-0.05,.015)}>

                        <mesh position = {v3(0,0.075,0.0575)}>
                            <planeBufferGeometry width = {0.175} height = {0.175} />
                            <meshBasicMaterial color = {0xff0000} />
                        </mesh>

                        <mesh position = {v3(0,-0.1,0.0575)}>
                            <planeBufferGeometry width = {0.35} height = {0.125} />
                            <meshBasicMaterial color = {0xff0000} />
                        </mesh>

                    </group>

                </group>
        )
    }

}