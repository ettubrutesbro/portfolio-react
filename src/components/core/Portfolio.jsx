import React from 'react'
import {observable, action} from 'mobx'
// import {observer} from 'mobx-react'

import InteractiveScene from './InteractiveScene'
import ThreePointLights from './ThreePointLights'

import Body from './Body'
import Boundary from './Boundary'

import {makeElevator} from '../../helpers/utilities'

// @observer
export default class Portfolio extends React.Component{

    //projects
    @observable selected = null



    render(){

        const enclosure = makeElevator({ x: 8, y: 12, z: 2 }, null, 'foo')
        const lights = (
            <ThreePointLights
                scale = {4.25}
                decay = {1.5}
                distance = {72}
            />
        )

        return(
        <InteractiveScene
            background = {0xdedede}
            lights = {lights}
        >
            <Body
                name = 'testbox' 
                showCollider 
                exists
                physicsModel = {{
                    pos: [0,10,0],
                    size: [0.5,2,1],
                    type: 'box'            
                }}
            />

            <Body name = "test2box"
                showCollider
                exists
                physicsModel = {{
                    pos: [3,0,0],
                    size: [1],
                    type: 'sphere'
                }}
            />

            {enclosure.map((b,i) => {
                console.log(enclosure)
                return (
                    <Boundary
                        key = {'wall'+i}
                        name={b.name}
                        pos={{ x: b.x, y: b.y, z: b.z }}
                        exists = {true}
                        width={b.w}
                        height={b.h}
                        depth={b.d}
                        showCollider={b.name.includes('frontwall') ? false : true}
                        // showCollider = {true}
                        // dynamic = {true}
                    />
                )
            })}
        </InteractiveScene> 
    )}
}