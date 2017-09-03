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
        const showbox = boolean('box', true)
        const showground = boolean('show ground', false)
        const phaseground = boolean('phase ground', false)

        // const groundY = number('groundY',)

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
                        showCollider = {true}

                    />

                </SimpleScene>
                
            </div>

        )
    })

    worldStories.add('makeEnclosure', ()=> {

        //makeEnclosure({x: 8, y: 10, z: 2})
        /*
            loop 5

            rightwall:
            x:4.5,y:0,z:0
            w:1,h:10,z:2
            ground: 
            x:0,y:-5.5,z:0
            w:8,h:1,d:2
            backwall: 
            x:0,y:0,z:-2.5
            w:8,h:10,z:1

        */

        const enclosure = makeEnclosure({x:8,y:10,z:2})

        return(
            <SimpleScene>
                <Body name = "test" showCollider/>
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