import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs'

import * as THREE from 'three'

import SimpleScene from './SimpleScene'
import Body from './Body'
import Wall from './Wall'

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
                        name = "box" 
                        exists = {showbox}
                        showCollider = {true} 
                    />
                    <Body 
                        name = "box2" 
                        exists = {showbox}
                        showCollider = {true} 
                        physicsModel = {{
                            pos: [0,14,0],
                            type: 'box',
                            size: [1,1,1]
                        }}
                    />
                    <Body 
                        name = "box3" 
                        exists = {showbox}
                        showCollider = {true} 
                        physicsModel = {{
                            pos: [0,12,0],
                            type: 'box',
                            size: [1,1,1]
                        }}
                    />

                    <Wall 
                        name = "ground"
                        position = {{x:0,y:5,z:0}} 
                        width={10} depth={10} height={5}
                        show = {showground}
                        noclip = {phaseground}
                    />
                    <Wall 
                        name = "basement"
                        position = {{x:0,y:-9,z:0}} 
                        width={10} depth={10} height={1}
                        show = {showground}
                    />
                </SimpleScene>
                
            </div>

        )
    })


storiesOf('UI', module)
    .add('foo', ()=> <div />)