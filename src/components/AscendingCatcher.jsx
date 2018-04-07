
import React from 'react'
import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'

import './AscendingCatcher.css'

import InteractiveScene from './core/InteractiveScene'
import Body, {Boundary} from './core/Body'

import {makeEnclosure} from '../helpers/utilities'

@observer
export default class AscendingCatcher extends React.Component{

    @observable itemSelected = false
    
    @observable viewHeight = 10 //based on screenHeight? (Y distance viewable by camera)
    @observable groundPosition = 0
    // @observable cameraGoal = {x: 0, y: 0, z: 50, zoom: 1}

    @computed get spawnHeight(){return this.groundPosition + (this.viewHeight*2) + 2}
    @computed get abyssDepth(){return this.groundPosition - (this.viewHeight*1.5)}

    @action changeGroundPosition = (newPos) => {
        this.groundPosition = newPos
    }

    render(){
        const {container} = this.props
        const walls = makeEnclosure({ 
            x: container.width, 
            y: container.height, 
            z: container.depth }, 
            {
                x: 0, 
                y: container.height * .4, 
                z: 0
            }
        )

         return (
            <div>
            <DebugInfo
                groundPosition = {this.groundPosition}
                spawnHeight = {this.spawnHeight}
                cameraGoal = {{
                    x: 0,
                    y: this.itemSelected? this.groundPosition + this.viewHeight : this.groundPosition,
                    z: 40
                }}
            />
            <InteractiveScene
                envelope = {{width: container.width, height: container.height, depth: container.depth}}
                abyssDepth = {this.abyssDepth} //a certain amount below camera's y position
                spawnHeight = {this.spawnHeight}
                onSelect = {(v)=>{
                    console.log('selected', v)
                    this.changeGroundPosition(this.groundPosition-this.viewHeight)
                    this.itemSelected = true
                }}
                onDeselect = {()=>{
                    console.log('deselected')
                    this.itemSelected = false
                }}
                // cameraPosition = {{x: 0, y: 0, z: 40}}
                cameraGoal = {{
                    x: 0,
                    y: this.itemSelected? this.groundPosition + this.viewHeight : this.groundPosition,
                    z: 40
                }}
            >
                {Array.from(Array(12)).map((body, i) => {
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
                                rot: [
                                    (Math.random()*20)-10, 
                                    (Math.random()*20)-10, 
                                    (Math.random()*20)-10 
                                ],
                                size: [
                                    1 + Math.random() * 1.75,
                                    1 + Math.random() * 1.75,
                                    1 + Math.random() * 1.75,
                                ],
                                type: 'box',
                            }}
                        />
                    )
                })}
                {walls.map((b,i) => {
                    return (
                        <Boundary
                            key = {'wall'+i}
                            name={b.name}
                            pos={{ x: b.x, y: this.groundPosition + (b.h/2), z: b.z }}
                            width={b.w}
                            height={b.h}
                            depth={b.d}
                            // showCollider={b.name === 'frontwall' ? false : true}
                            showCollider = {false}
                        />
                    )
                })}
                    <Boundary
                        name="ground"
                        pos={{ x: 0, y: this.groundPosition - .5, z: 0 }}
                        width={13}
                        depth={4.5}
                        height={1}
                        showCollider = {true}
                    />
            </InteractiveScene>
            </div>
        )
    }

}

AscendingCatcher.defaultProps = {
    container: {width: 14, depth: 5, height: 10}
}

const DebugInfo = (props) => {
    return(
        <ul className = 'debugInfo'>
            <li>selected: {props.selected}</li>
            <li>mode: -- </li>
            <li>cameraGoal: {Object.values(props.cameraGoal).join(', ')} </li>
            <li>groundPosition: {props.groundPosition} </li>
            <li>spawnHeight: {props.spawnHeight} </li>
            <li>abyssDepth: {props.abyssDepth} </li>
        </ul>
    )
}