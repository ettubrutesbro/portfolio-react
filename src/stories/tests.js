import React from 'react';
import * as THREE from 'three'

import SimpleScene from '../components/core/SimpleScene'
import {v3, rads} from '../helpers/utilities'

import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs'


const tests = storiesOf('Tests', module)

tests.add('BasicLighting', () => {
    return(
        <SimpleScene>
            <mesh position = {v3(0,-2,0)} rotation = {new THREE.Euler(rads(-90),0,0)} >
                <boxGeometry width = {5} height = {5} depth = {1}/>
                <meshBasicMaterial color = {0xff0000} />
            </mesh>
        </SimpleScene>
    )
})