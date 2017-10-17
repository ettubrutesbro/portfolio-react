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
        const enclosure = makeEnclosure(
            { x: 13, y: 30, z: 4.25 }, //volume
            {x: 0, y: 0, z: 0} //position offset
        )
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
            debug = {this.props.debug}
            debugCamPos = {this.props.debugCamPos}
        >
           {Array.from(Array(2)).map((body, i) => {
                return (
                    <Body
                        key = {'debugbody'+i}
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
                return (
                    <Boundary
                        key = {'wall'+i}
                        name={b.name}
                        pos={{ x: b.x, y: b.y, z: b.z }}
                        exists = {this.selected? false: true}
                        width={b.w}
                        height={b.h}
                        depth={b.d}
                        showCollider={b.name.includes('frontwall') ? false : true}
                        // showCollider = {true}
                        debugMtl = 'phong'
                        // dynamic = {false}
                    />
                )
            })}



        </InteractiveScene> 
    )}
}