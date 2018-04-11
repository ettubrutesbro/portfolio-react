
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
    
    @observable viewHeight = 20 //based on screenHeight? (Y distance viewable by camera)
    @observable baseline = 0
    // @observable cameraGoal = {x: 0, y: 0, z: 50, zoom: 1}

    @computed get spawnHeight(){return this.baseline + (this.viewHeight * 1.5)}
    @computed get abyssDepth(){return this.baseline - this.viewHeight}

    @action changebaseline = (newPos) => {
        this.baseline = newPos
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
        const cameraGoal = {
            x: 0,
            y: this.itemSelected? this.baseline + (this.viewHeight * 2) : this.baseline + (this.viewHeight * .5),
            z: 40,
            zoom: this.itemSelected? 1.5 : 1
        }

         return (
            <div>
            <DebugInfo
                baseline = {this.baseline}
                spawnHeight = {this.spawnHeight}
                cameraGoal = {cameraGoal}
            />
            <InteractiveScene
                envelope = {{width: container.width, height: container.height, depth: container.depth}}
                
                viewHeight = {this.viewHeight}
                baseline = {this.baseline}
                abyssDepth = {this.abyssDepth} //a certain amount below camera's y position
                spawnHeight = {this.spawnHeight}
                
                onSelect = {(v)=>{
                    console.log('selected', v)
                    this.changebaseline(this.baseline-(this.viewHeight * 2))
                    this.itemSelected = true
                }}
                onDeselect = {()=>{
                    console.log('deselected')
                    this.itemSelected = false
                }}
                // cameraPosition = {{x: 0, y: 0, z: 40}}
                cameraGoal = {cameraGoal}
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
                            pos={{ x: b.x, y: this.baseline + (b.h/2), z: b.z }}
                            width={b.w}
                            height={b.h}
                            depth={b.d}
                            showCollider={b.name === 'frontwall' ? false : true}
                            // showCollider = {false}
                            debugMtl = 'wire'
                        />
                    )
                })}
                    <Boundary
                        name="ground"
                        pos={{ x: 0, y: this.baseline - .5, z: 0 }}
                        width={13.5}
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
    container: {width: 14, depth: 5, height: 20}
}

const DebugInfo = (props) => {
    return(
        <ul className = 'debugInfo'>
            <li>selected: {props.selected}</li>
            <li>mode: -- </li>
            <li>cameraGoal: {Object.values(props.cameraGoal).join(', ')} </li>
            <li>baseline: {props.baseline} </li>
            <li>spawnHeight: {props.spawnHeight} </li>
            <li>abyssDepth: {props.abyssDepth} </li>
        </ul>
    )
}