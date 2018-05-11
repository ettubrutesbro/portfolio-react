
import React from 'react'
import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'

import styles from './AscendingCatcher.css'

import InteractiveScene from './core/InteractiveScene'
import Body, {Boundary} from './core/Body'

import {makeEnclosure} from '../helpers/utilities'

@observer
export default class AscendingCatcher extends React.Component{

    @observable itemSelected = false
    
    @observable viewHeight = 20 //based on screenHeight? (Y distance viewable by camera)
    @observable baseline = 0

    @observable tooltip = {x: 0, y: 0}
    // @observable cameraGoal = {x: 0, y: 0, z: 50, zoom: 1}

    @computed get spawnHeight(){return this.baseline + (this.viewHeight * 1.5)}
    @computed get abyssDepth(){return this.baseline - this.viewHeight}

    @action changebaseline = (newPos) => {
        this.baseline = newPos
    }
    @action updateTooltip = (coords) => {
        console.log('updating tooltip', coords)
        this.tooltip.x = coords.x
        this.tooltip.y = coords.y
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
            <div className = {styles.wrapper}>
            <div className = {styles.domTarget} 
                style = {{
                    transform: `translate(${this.tooltip.x}px, ${this.tooltip.y}px)`
                }}
            >
                dom
            </div>
            <DebugInfo
                selected = {this.itemSelected}
                baseline = {this.baseline}
                spawnHeight = {this.spawnHeight}
                cameraGoal = {cameraGoal}
            />
            <InteractiveScene
                envelope = {{
                    width: container.width, 
                    height: container.height, 
                    depth: container.depth
                }}
                viewHeight = {this.viewHeight}
                baseline = {this.baseline}
                abyssDepth = {this.abyssDepth} 
                spawnHeight = {this.spawnHeight}
                
                onSelect = {(v, c)=>{
                    console.log('selected', v)
                    this.changebaseline(this.baseline-(this.viewHeight * 2))
                    this.itemSelected = v
                    // this.updateTooltip(c)
                }}
                onDeselect = {()=>{
                    console.log('deselected')
                    this.itemSelected = false
                }}
                // cameraPosition = {{x: 0, y: 0, z: 40}}
                cameraGoal = {cameraGoal}
            >
                {
                    // this.props.children
                    React.Children.map(this.props.children, (child)=>{
                        return React.cloneElement(child, {isSelected: this.itemSelected === child.props.name})
                    })
                }
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
        <ul className = {styles.debugInfo}>
            <li>selected: {props.selected}</li>
            <li>mode: -- </li>
            <li>cameraGoal: {Object.values(props.cameraGoal).join(', ')} </li>
            <li>baseline: {props.baseline} </li>
            <li>spawnHeight: {props.spawnHeight} </li>
            <li>abyssDepth: {props.abyssDepth} </li>
        </ul>
    )
}