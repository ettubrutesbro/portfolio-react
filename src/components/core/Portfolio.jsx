import React from 'react'
import {observer} from 'mobx-react'
import {observable, action} from 'mobx'

import InteractiveScene from './InteractiveScene'
import ThreePointLights from './ThreePointLights'

import Body from './Body'
import Boundary from './Boundary'

import {makeEnclosure} from '../../helpers/utilities'

@observer
export default class Portfolio extends React.Component{

    //projects
    @observable selected = null

    componentDidMount(){
        this.uglyObservablePulseForStorybook()
    }

    @action uglyObservablePulseForStorybook = () => {
        this.selected = 'wat'
        this.selected = null
    }

    @action selectProject = selected => {
        this.selected = selected
    }
    @action deselectProject = () => {
        this.selected = null
    }

    render(){
        const enclosure = makeEnclosure({ x: 10, y: 14, z: 4.25 }, {x: 0, y: -1.5, z: 0})
        const lights = (
            <ThreePointLights
                scale = {4.25}
                decay = {1.5}
                distance = {72}
            />
        )
        const selected = this.selected

        return(
        <InteractiveScene
            background = {0xdedede}
            lights = {lights}
            onSelect = {this.selectProject}
            onDeselect = {this.deselectProject}
        >
           {Array.from(Array(12)).map((body, i) => {
                return (
                    <Body
                        debugMtl = 'phong'
                        name={'body' + i}
                        showCollider
                        physicsModel={{
                            pos: [
                                (Math.round(Math.random()) * 1.5 - 1) *
                                    Math.random() *
                                    4,
                                10 + 2 * i,
                                0,
                            ],
                            size: [1 + Math.random() * 1],
                            type: 'sphere',
                        }}
                    />
                )
            })}

            {enclosure.map((b,i) => {
                console.log(enclosure)
                return (
                    <Boundary
                        key = {'wall'+i}
                        name={b.name}
                        pos={{ x: b.x, y: b.y, z: b.z }}
                        exists = {this.selected? false: true}
                        width={b.w}
                        height={b.h}
                        depth={b.d}
                        // showCollider={b.name.includes('frontwall') ? false : true}
                        // showCollider = {true}
                        dynamic = {false}
                    />
                )
            })}
        </InteractiveScene> 
    )}
}