import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs'

import * as THREE from 'three'

import SimpleScene from './SimpleScene'
import Body from './Body'
import Boundary from './Boundary'

import {v3, makeEnclosure} from './utilities'

const loader = new THREE.JSONLoader()
const dragon = loader.parse(require('./Projects/Eclipse/dragon.json'))

const worldStories = storiesOf('World (3D)', module)
worldStories.addDecorator(withKnobs)


    worldStories.add('SimpleScene + Body + Constraint', ()=> {
        const showbox = boolean('make / unmake bodies', true)
        const showground = boolean('show ground', true)
        return (
            <div>
                <SimpleScene
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

                </SimpleScene>
                
            </div>

        )
    })

    worldStories.add('makeEnclosure', ()=> {
        const enclosure = makeEnclosure({x:8,y:10,z:2})
        const sampleBodies = [0,1,2,3,4,5,6,7]

        return(
            <SimpleScene>
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
            </SimpleScene>
        )
    })


storiesOf('UI', module)
    .add('foo', ()=> <div />)