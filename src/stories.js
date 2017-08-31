import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs'

import * as THREE from 'three'

import SimpleScene from './SimpleScene'
import Body from './Body'
import Boundary from './Boundary'

import {v3} from './utilities'

const loader = new THREE.JSONLoader()
const dragon = loader.parse(require('./Projects/Eclipse/dragon.json'))

const worldStories = storiesOf('World (3D)', module)
worldStories.addDecorator(withKnobs)


    worldStories.add('SimpleScene + Body + Constraint', ()=> {
        const showbox = boolean('box', true)
        const showground = boolean('show ground', false)
        const phaseground = boolean('phase ground', false)

        return (
            <div>
                <SimpleScene
                >

                    <Body 
                        name = "box2" 
                        exists = {showbox}
                        showCollider = {true} 
                        physicsModel = {{
                            pos: [0,14,0],
                            type: 'box',
                            size: [1,1,1],
                            move: true
                        }}
                    />
                    <Body 
                        name = "box3" 
                        exists = {showbox}
                        showCollider = {true} 
                        physicsModel = {{
                            pos: [0,12,0],
                            type: 'box',
                            size: [1,1,1],
                            move: true
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


storiesOf('UI', module)
    .add('foo', ()=> <div />)