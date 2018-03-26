
import React from 'react'
import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'

import InteractiveScene from './core/InteractiveScene'
import Body, {Boundary} from './core/Body'

import {makeEnclosure} from '../helpers/utilities'


@observer
export default class AscendingCatcher extends React.Component{
    
    viewHeight = 10 //constant (Y distance viewable by camera)
    @observable groundPosition = -10
    @computed get spawnHeight(){return this.groundPosition + (this.viewHeight*2) + 2}

    render(){
        const walls = makeEnclosure({ x: 14, y: 100, z: 3 }, {x: 0, y: 40, z: 0})

         return (
            <InteractiveScene
                // debug
                // debugCamPos = {{x: 0, y: 0, z:40}}
                onSelect = {()=>{
                    console.log('selected')
                }}
                onDeselect = {()=>{
                    console.log('deselected')
                }}
            >
                {Array.from(Array(3)).map((body, i) => {
                    return (
                        <Body
                            key = {'body'+i}
                            name={'body' + i}
                            showCollider
                            physicsModel={{
                                pos: [
                                    (Math.round(Math.random()) * 2 - 1) *
                                        Math.random() *
                                        4,
                                    10 + 2 * i,
                                    0,
                                ],
                                size: [0.25 + Math.random() * 0.75],
                                type: 'sphere',
                            }}
                        />
                    )
                })}
                {walls.map((b,i) => {
                    return (
                        <Boundary
                            key = {'wall'+i}
                            name={b.name}
                            pos={{ x: b.x, y: b.y, z: b.z }}
                            width={b.w}
                            height={b.h}
                            depth={b.d}
                            showCollider={b.name === 'frontwall' ? false : true}
                        />
                    )
                })}
                    <Boundary
                        name="ground"
                        pos={{ x: 0, y: this.groundPosition - .25, z: 0 }}
                        width={16}
                        depth={5}
                        height={0.5}
                        showCollider = {true}
                    />

                    <Body
                        name = "spawnpointdebug"
                        key = 'spawnpointdebug'
                        physicsModel = {{
                            type: 'box', size: [1,1,1],
                            pos: [0, this.spawnHeight, 0],
                            move: false
                        }}
                        debugMtl = 'lambert'
                        showCollider = {true}
                        isSelectable = {false}
                    />
            </InteractiveScene>
        )
    }

}