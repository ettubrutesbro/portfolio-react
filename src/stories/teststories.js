import React from 'react'
import * as THREE from 'three'

import SimpleScene from '../components/core/SimpleScene'
import InteractiveScene from '../components/core/InteractiveScene'
import Body from '../components/core/Body'
import Boundary from '../components/core/Boundary'

import { v3, rads, makeEnclosure, makeElevator } from '../helpers/utilities'

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

// tests.add('joint hinge from oimo?', () => {
//     return(

//     )
// })


tests.add('disappearing-ground enclosure', () => {
     const enclosure = makeElevator({ x: 8, y: 10, z: 2 })
     const wallsExist = boolean('walls?', true)

    return (
        <InteractiveScene>
            {Array.from(Array(25)).map((body, i) => {
                return (
                    <Body
                        name={'body' + i}
                        showCollider
                        physicsModel={{
                            pos: [
                                (Math.round(Math.random()) * 2 - 1) *
                                    Math.random() *
                                    4,
                                10 + 2 * i,
                                0,
                            ],
                            size: [0.25 + Math.random() * 0.75],
                            type: 'sphere',
                        }}
                    />
                )
            })}
            {enclosure.map(b => {
                return (
                    <Boundary
                        name={b.name}
                        pos={{ x: b.x, y: b.y, z: b.z }}
                        exists = {b.name==='bottom'? wallsExist: true}
                        width={b.w}
                        height={b.h}
                        depth={b.d}
                        showCollider={b.name === 'frontwall' ? false : true}
                        // dynamic = {true}
                    />
                )
            })}
        </InteractiveScene>
    )
})


tests.add('threepointlights, spelled out', () => {
    const point1 = boolean('point light 1', true)
    const point2 = boolean('point light 2', true)
    const point3 = boolean('point light 3', true)
    const hemisphere = boolean('hemisphere light', false)

    const point1intensity = number('point1 intensity', 0.6)
    const point2intensity = number('point2 intensity', 0.35)
    const point3intensity = number('point3 intensity', 0.7)
    const hemisphereintensity = number('hemisphere intensity', 0.15)

    //right side, medium height, in front of foreground
    const point1X = number('point 1, X', 3) 
    const point1Y = number('point 1, Y', 2) 
    const point1Z = number('point 1, Z', 3.5)
    //farther off to left, lower than ground, even with foreground
    const point2X = number('point 2, X', -5)
    const point2Y = number('point 2, Y', -1) 
    const point2Z = number('point 2, Z', 1.5)     
    //center, high above, a little behind foreground
    const point3X = number('point 3, X', 0) 
    const point3Y = number('point 3, Y', 3) 
    const point3Z = number('point 3, Z', -0.5) 

    const rotateCube = number('rotate cube (y)', 45)

    return (
        <SimpleScene>
            <pointLight
                position={v3(point1X, point1Y, point1Z)}
                color={0xff0000}
                decay={3}
                distance={36}
                visible={point1}
                intensity={point1intensity}
            />
            <pointLight
                position={v3(point2X, point2Y, point2Z)}
                color={0xffff00}
                decay={3}
                distance={36}
                visible={point2}
                intensity={point2intensity}
            />
            <pointLight
                position = {v3(point3X, point3Y, point3Z)}
                color = {0x0077ff}
                decay = {3}
                distance = {36}
                visible = {point3}
                intensity = {point3intensity}
            />

            <hemisphereLight
                skyColor={0xffe8bb}
                groundColor={0x8aaabb}
                intensity={hemisphereintensity}
                visible={hemisphere}
            />

            <mesh
                position={v3(0, -2, 0)}
                rotation={new THREE.Euler(rads(-90), 0, 0)}
            >
                <boxGeometry width={5} height={5} depth={1} />
                <meshPhongMaterial color={0x878787} />
            </mesh>

            <mesh
                position={v3(0, -1.125, 0)}
                rotation={new THREE.Euler(0, rads(rotateCube), 0)}
            >
                <sphereGeometry radius = {0.4} heightSegments = {12} widthSegments ={12} />
                <meshPhongMaterial color={0xdedede} />
            </mesh>
            <mesh
                position={v3(1, -1.125, 0)}
                rotation={new THREE.Euler(0, rads(rotateCube), 0)}
            >
                <boxGeometry width = {0.5} depth = {0.5} height = {0.5} />
                <meshPhongMaterial color={0xdedede} />
            </mesh>
        </SimpleScene>
    )
})


tests.add('ThreePointLights (rgb)', () => {
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

tests.add('ThreePointLights (orangeyblue-white) ', () => {
    return(
    <SimpleScene>
        <ThreePointLights 
            //API needs improvement....too verbose for small changes
            light1 = {{position: v3(1.5,-0,3.5), intensity: 0.3, color: 0x99ccdf, on: true}}
            light2 = {{position: v3(-4,0,1), intensity: 0.6, color: 0xdeddbb, on: true}}
            light3 = {{position: v3(0,3,-0.5), intensity: 1.05, color: 0x6989ff, on: true}}
        />
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
