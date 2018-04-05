
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

    @action changeGroundPosition = (newPos) => {
        this.groundPosition = newPos
    }

    render(){
        const {container} = this.props
        const walls = makeEnclosure({ x: container.width, y: container.height, z: container.depth }, {x: 0, y: container.height * .4, z: 0})

         return (
            <InteractiveScene
                envelope = {{width: container.width, height: container.height, depth: container.depth}}
                // abyssDepth = {} //a certain amount below camera's y position
                spawnHeight = {this.spawnHeight}
                onSelect = {()=>{
                    console.log('selected')
                    this.changeGroundPosition(this.groundPosition+this.viewHeight)
                }}
                onDeselect = {()=>{
                    console.log('deselected')
                }}
            >
                {Array.from(Array(30)).map((body, i) => {
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
                        pos={{ x: 0, y: this.groundPosition - .5, z: 0 }}
                        width={16}
                        depth={5}
                        height={1}
                        showCollider = {true}
                    />
            </InteractiveScene>
        )
    }

}

AscendingCatcher.defaultProps = {
    container: {width: 14, depth: 3, height: 100}
}