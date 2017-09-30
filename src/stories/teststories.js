import React from 'react';
import * as THREE from 'three'

import SimpleScene from '../components/core/SimpleScene'
import {v3, rads} from '../helpers/utilities'

import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs'


const tests = storiesOf('Tests', module)
tests.addDecorator(withKnobs)

tests.add('BasicLighting', () => {

    const point1 = boolean('point light 1', true)
    const point2 = boolean('point light 2', true)
    const hemisphere = boolean('hemisphere light', true)

    const point1X = number('point 1, X', 2) // right edge
    const point1Y = number('point 1, Y', 1) // just above 'ground' level
    const point1Z = number('point 1, Z', 3.5) // near where the near edge is
    const point2X = number('point 2, X', -3) // left edge
    const point2Y = number('point 2, Y', 1) // just above 'ground' level
    const point2Z = number('point 2, Z', 4.5) // near where the near edge is

    return(
        <SimpleScene>
            <ambientLight color = {0x878787} intensity = {0.5} />
            <pointLight position = {v3(point1X,point1Y,point1Z)} color = {0xff0000} decay = {3} distance = {36} visible = {point1}/>
            <pointLight position = {v3(point2X,point2Y,point2Z)} color = {0xffff00} decay = {3} distance = {36} visible = {point2} intensity = {0.3}/>

            <hemisphereLight skyColor = {0xffe8bb} groundColor = {0x8aaabb} intensity = {0.6}/>



            <mesh position = {v3(0,-2,0)} rotation = {new THREE.Euler(rads(-90),0,0)} >
                <boxGeometry width = {5} height = {5} depth = {1}/>
                <meshPhongMaterial color = {0x878787} />
            </mesh>

            <mesh position = {v3(0,-1.125,0)} rotation = {new THREE.Euler(0,rads(45),0)}>
                <boxGeometry width = {0.75} height = {0.75} depth = {1} />
                <meshPhongMaterial color = {0xdedede} />


            </mesh>

        </SimpleScene>
    )
})