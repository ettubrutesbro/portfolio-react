import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs'
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import React3 from 'react-three-renderer'
import * as THREE from 'three'
import * as OIMO from 'oimo'

import * as utils from './utilities.js'
import {noCollisions, normalCollisions, collidesWithAll} from './constants.js'

import SimpleScene from './SimpleScene'
import Body from './Body'
import Constraint from './Constraint'

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
                <SimpleScene>
                    <Body name = "box" exists = {showbox} />
                    <Constraint 
                        name = "ground"
                        position = {{x:0,y:-5,z:0}} 
                        width={8} depth={8} height={10}
                        show = {showground}
                        noclip = {phaseground}
                    />
                </SimpleScene>
                
            </div>

        )
    })


storiesOf('UI', module)
    .add('foo', ()=> <div />)