import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs'

import * as THREE from 'three'

import SimpleScene from './SimpleScene'
import InteractiveScene from './InteractiveScene'
import Body from './Body'
import Boundary from './Boundary'

import {v3, makeEnclosure, makeElevator, rads} from './utilities'

import {SendbloomModel} from './Projects/Sendbloom/Sendbloom'
import {SesemeModel} from './Projects/Seseme/Seseme'


const models = storiesOf('Models', module)

const loader = new THREE.JSONLoader()
const dragon = loader.parse(require('./Projects/Eclipse/dragon.json'))
const wakebed = loader.parse(require('./Projects/Wake/bed.json'))
const wakesleeper = loader.parse(require('./Projects/Wake/sleeper.json'))
const wakesleeperl = loader.parse(require('./Projects/Wake/sleeperL.json'))


models.addDecorator(withKnobs)
models.add('Cube', () => {
    return(
        <SimpleScene>
            <mesh>
                <boxGeometry width = {1} height = {1} depth = {1} />
                <meshNormalMaterial />
            </mesh>
        </SimpleScene>
    )
})
models.add('Dragon', () => {
    const yRot = number('rotate Y', 90)
    return(
        <SimpleScene>
            <mesh rotation = {new THREE.Euler(0,rads(yRot),0)}>
                <geometry 
                    vertices = {dragon.geometry.vertices}
                    faces = {dragon.geometry.faces}
                />
                <meshNormalMaterial />
            </mesh>
        </SimpleScene>
    )
})
models.add('Sendbloom', () => {
    const yRot = number('rotate Y', 0)
    return(
        <SimpleScene>
            <group rotation = {new THREE.Euler(0,rads(yRot),0)}>
            <SendbloomModel />
            </group>
        </SimpleScene>
    )
})
models.add('Seseme', () => {
    const sesemeyRot = number('rotate Y', 0)
    return(
        <SimpleScene>
            <group rotation = {new THREE.Euler(0,rads(sesemeyRot),0)}>
            <SesemeModel />
            </group>
        </SimpleScene>
    )
})
models.add('Wake', () => {
    const wakexRot = number('rotate X', 15)
    const wakeyRot = number('rotate Y', 150)
    return(
        <SimpleScene>
            <group
                rotation = {new THREE.Euler(rads(wakexRot),rads(wakeyRot),0)}
            >
            <mesh>
                <geometry vertices = {wakebed.geometry.vertices}
                    faces = {wakebed.geometry.faces}
                />
                <meshNormalMaterial />
            </mesh>
            <mesh>
                <geometry 
                    vertices = {wakesleeper.geometry.vertices}
                    faces = {wakesleeper.geometry.faces} 
                />
                <meshNormalMaterial />
            </mesh>
            <mesh>
                <geometry 
                    vertices = {wakesleeperl.geometry.vertices}
                    faces = {wakesleeperl.geometry.faces} 
                />
                <meshNormalMaterial />
            </mesh>
            </group>
        </SimpleScene>
    )
})



const worldStories = storiesOf('World (3D)', module)
worldStories.addDecorator(withKnobs)


    worldStories.add('InteractiveScene + Body + Constraint', ()=> {
        const showbox = boolean('make / unmake bodies', true)
        const showground = boolean('show ground', true)
        return (
            <div>
                <InteractiveScene
                >

                    <Body 
                        name = "box2" 
                        exists = {showbox}
                        showCollider = {true} 
                        physicsModel = {{
                            pos: [0,10,0],
                            type: 'box',
                            size: [1,1,1]
                        }}
                    />

                    <Body 
                        name = "testsphere" 
                        exists = {showbox}
                        showCollider = {true} 
                        physicsModel = {{
                            pos: [0.5,7,0],
                            type: 'sphere',
                            size: [0.5]
                        }}
                    />



                    <Boundary 
                        name = "ground"
                        pos = {{x: 0, y: 1, z: 0}}
                        width = {10} depth = {10} height = {1}
                        dynamic = {true}
                        showCollider = {showground}

                    />

                </InteractiveScene>
                
            </div>

        )
    })

    worldStories.add('makeEnclosure', ()=> {
        const enclosure = makeEnclosure({x:8,y:10,z:2})

        return(
            <InteractiveScene>
                {Array.from(Array(25)).map((body, i)=>{
                    return(
                    <Body name = {'body'+i} showCollider
                        physicsModel = {{
                            pos: [(Math.round(Math.random()) * 2 - 1) * Math.random()*4 ,10+(2*i),0],
                            size: [0.25+(Math.random()*0.75)],
                            type: 'sphere'
                        }}
                        
                    />
                    )
                })}
                {enclosure.map((b)=>{
                    return <Boundary
                        name = {b.name}
                        pos= {{x:b.x, y:b.y, z:b.z}}
                        width = {b.w} height = {b.h} depth = {b.d}
                        showCollider = {b.name==='frontwall'?false: true}
                    />
                })}
            </InteractiveScene>
        )
    })

    worldStories.add('makeElevator', ()=>{
        const elevator = makeElevator({x:8,y:10,z:2})
        return(
            <InteractiveScene>
                {Array.from(Array(12)).map((body, i)=>{
                    return(
                    <Body name = {'body'+i} showCollider
                        physicsModel = {{
                            pos: [(Math.round(Math.random()) * 2 - 1) * Math.random()*4 ,10+(2*i),0],
                            size: [0.5+(Math.random()*0.5)],
                            type: 'sphere'
                        }}
                        
                    />
                    )
                })}
                {elevator.map((b)=>{
                    return <Boundary
                        name = {b.name}
                        pos= {{x:b.x, y:b.y, z:b.z}}
                        width = {b.w} height = {b.h} depth = {b.d}
                        showCollider = {b.name==='frontwall'?false: true}
                        dynamic = {b.name==='bottom'?true:false}
                    />
                })}


            </InteractiveScene>
        )
    } )


storiesOf('UI', module)
    .add('foo', ()=> <div />)