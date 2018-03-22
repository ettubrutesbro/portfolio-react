
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import InteractiveScene from './core/InteractiveScene'
import Body, {Boundary} from './core/Body'

import {makeEnclosure} from '../helpers/utilities'

export default class AscendingCatcher extends React.Component{

    @observable onBottom = 'b' 

    render(){
        const enclosureA = makeEnclosure({ x: 8, y: 10, z: 3 }, {x: 0, y: -10, z: 0}, 'a')
        const enclosureB = makeEnclosure({ x: 8, y: 10, z: 3 }, {x: 0, y: 10, z: 0}, 'b')

        return(
            <InteractiveScene
                debug
                debugCamPos = {{x: 0, y: 2, z: 100}}
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
                {enclosureA.map((b,i) => {
                    return (
                        <Boundary
                            key = {'a-wall'+i}
                            name={b.name}
                            pos={{ x: b.x, y: b.y, z: b.z }}
                            width={b.w}
                            height={b.h}
                            depth={b.d}
                            showCollider={b.name === 'a-frontwall' ? false : true}

                        />
                    )
                })}
                 <Boundary
                        name="a-ground"
                        pos={{ x: 0, y: 5, z: 0 }}
                        width={10}
                        depth={10}
                        height={0.5}
                        showCollider = {true}
                        dynamic = {false}
                        // exists = {false}
                />
                {enclosureB.map((b,i) => {
                    return (
                        <Boundary
                            key = {'b-wall'+i}
                            name={b.name}
                            pos={{ x: b.x, y: b.y, z: b.z }}
                            width={b.w}
                            height={b.h}
                            depth={b.d}
                            showCollider={b.name === 'b-frontwall' ? false : true}
                        />
                    )
                })}
                <Boundary
                    name="b-ground"
                    pos={{ x: 0, y: -15, z: 0 }}
                    width={10}
                    depth={10}
                    height={0.5}
                    // exists = {walls}
                    showCollider = {true}
                    dynamic = {false}
                />
            </InteractiveScene>
        )
    }
}