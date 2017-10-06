import React from 'react'
import * as THREE from 'three'

import SimpleScene from '../components/core/SimpleScene'
import { v3, rads } from '../helpers/utilities'

import { storiesOf } from '@storybook/react'
import {
    withKnobs,
    text,
    boolean,
    number,
    select,
} from '@storybook/addon-knobs'

import ThreePointLights from '../components/core/ThreePointLights'

const tests = storiesOf('Tests', module)
tests.addDecorator(withKnobs)


tests.add('ThreePointLights', () => {
    return(
    <SimpleScene>
        <ThreePointLights />
        <mesh
            position={v3(0, -2, 0)}
            rotation={new THREE.Euler(rads(-90), 0, 0)}
        >
            <boxGeometry width={5} height={5} depth={1} />
            <meshPhongMaterial color={0x878787} />
        </mesh>

        <mesh
            position={v3(0, -1.125, 0)}
            rotation={new THREE.Euler(0, rads(45), 0)}
        >
            <sphereGeometry radius = {0.4} heightSegments = {12} widthSegments ={12} />
            <meshPhongMaterial color={0xdedede} />
        </mesh>
        <mesh
            position={v3(1, -1.125, 0)}
            rotation={new THREE.Euler(0, rads(45), 0)}
        >
            <boxGeometry width = {0.5} depth = {0.5} height = {0.5} />
            <meshPhongMaterial color={0xdedede} />
        </mesh>
    </SimpleScene>
    )
})
