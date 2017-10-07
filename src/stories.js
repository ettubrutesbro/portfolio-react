import React from 'react'

import { storiesOf } from '@storybook/react'
import {
    withKnobs,
    text,
    boolean,
    number,
    select,
    color,
    object,
} from '@storybook/addon-knobs'

import * as THREE from 'three'

import SimpleScene from './components/core/SimpleScene'
import InteractiveScene from './components/core/InteractiveScene'
import Body from './components/core/Body'
import Boundary from './components/core/Boundary'
import ThreePointLights from './components/core/ThreePointLights'

import { v3, makeEnclosure, makeElevator, rads } from './helpers/utilities'

import { SendbloomModel } from './components/Sendbloom/Sendbloom'
import { SesemeModel } from './components/Seseme/Seseme'

const models = storiesOf('Models', module)

const loader = new THREE.JSONLoader()
const dragon = loader.parse(require('./components/Eclipse/dragon.json'))
const wakebed = loader.parse(require('./components/Wake/bed.json'))
const wakesleeper = loader.parse(require('./components/Wake/sleeper.json'))
const wakesleeperl = loader.parse(require('./components/Wake/sleeperL.json'))

models.addDecorator(withKnobs)
models.add('Cube', () => {
    return (
        <SimpleScene>
            <mesh>
                <boxGeometry width={1} height={1} depth={1} />
                <meshNormalMaterial />
            </mesh>
        </SimpleScene>
    )
})
models.add('Dragon (lit)', () => {
    const debugshowlights = boolean('show light positions', true)

    const light1 = object('light 1', {
        position: '1.5,0,3.5',
        intensity: 3
    })
    const l1color = color('light1 color(hex)', '#99ccdf')
    const light2 = object('light 2', {
        position: '-1,0,1',
        intensity: 6
    })
    const l2color = color('light2 color(hex)', '#deddbb')
    const light3 = object('light 3', {
        position: '0,3,-.5',
        intensity: 10.5
    })
    const l3color = color('light3 color(hex)', '#6989ff')


    const yRot = number('rotate Y', 90)

    return (
        <SimpleScene>
            <ambientLight intensity={0.1} color={0xffffff} />
            <ThreePointLights
                scale={0.8}
                debug={debugshowlights}
                light1={{
                    position: v3(...light1.position.split(',')),
                    intensity: light1.intensity / 10,
                    color: parseInt('0x'+l1color.replace('#','')),
                    on: true,
                }}
                light2={{
                    position: v3(...light2.position.split(',')),
                    intensity: light2.intensity / 10,
                    color: parseInt('0x'+l2color.replace('#','')),
                    on: true,
                }}
                light3={{
                    position: v3(...light3.position.split(',')),
                    intensity: light3.intensity / 10,
                    color: parseInt('0x'+l3color.replace('#','')),
                    on: true,
                }}
            />
            <mesh rotation={new THREE.Euler(0, rads(yRot), 0)}>
                <geometry
                    vertices={dragon.geometry.vertices}
                    faces={dragon.geometry.faces}
                />
                <meshPhongMaterial 
                    color={0xdedede}

                />
            </mesh>
        </SimpleScene>
    )
})
models.add('Sendbloom', () => {
    const yRot = number('rotate Y', 0)
    return (
        <SimpleScene>
            <group rotation={new THREE.Euler(0, rads(yRot), 0)}>
                <SendbloomModel />
            </group>
        </SimpleScene>
    )
})
models.add('Seseme', () => {
    const sesemeyRot = number('rotate Y', 0)
    return (
        <SimpleScene>
            <group rotation={new THREE.Euler(0, rads(sesemeyRot), 0)}>
                <SesemeModel />
            </group>
        </SimpleScene>
    )
})
models.add('Wake', () => {
    const wakexRot = number('rotate X', 15)
    const wakeyRot = number('rotate Y', 150)
    return (
        <SimpleScene>
            <group
                rotation={new THREE.Euler(rads(wakexRot), rads(wakeyRot), 0)}
            >
                <mesh>
                    <geometry
                        vertices={wakebed.geometry.vertices}
                        faces={wakebed.geometry.faces}
                    />
                    <meshNormalMaterial />
                </mesh>
                <mesh>
                    <geometry
                        vertices={wakesleeper.geometry.vertices}
                        faces={wakesleeper.geometry.faces}
                    />
                    <meshNormalMaterial />
                </mesh>
                <mesh>
                    <geometry
                        vertices={wakesleeperl.geometry.vertices}
                        faces={wakesleeperl.geometry.faces}
                    />
                    <meshNormalMaterial />
                </mesh>
            </group>
        </SimpleScene>
    )
})

const worldStories = storiesOf('Interactive Scenes', module)
worldStories.addDecorator(withKnobs)

worldStories.add('InteractiveScene + Body + Constraint', () => {
    const showbox = boolean('make / unmake bodies', true)
    const showground = boolean('show ground', true)
    return (
        <div>
            <InteractiveScene>
                <Body
                    name="box2"
                    exists={showbox}
                    showCollider={true}
                    physicsModel={{
                        pos: [0, 10, 0],
                        type: 'box',
                        size: [1, 1, 1],
                    }}
                />

                <Body
                    name="testsphere"
                    exists={showbox}
                    showCollider={true}
                    physicsModel={{
                        pos: [0.5, 7, 0],
                        type: 'sphere',
                        size: [0.5],
                    }}
                />

                <Boundary
                    name="ground"
                    pos={{ x: 0, y: 1, z: 0 }}
                    width={10}
                    depth={10}
                    height={1}
                    dynamic={true}
                    showCollider={showground}
                />
            </InteractiveScene>
        </div>
    )
})

worldStories.add('makeEnclosure', () => {
    const enclosure = makeEnclosure({ x: 8, y: 10, z: 2 })

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
                        width={b.w}
                        height={b.h}
                        depth={b.d}
                        showCollider={b.name === 'frontwall' ? false : true}
                    />
                )
            })}
        </InteractiveScene>
    )
})

worldStories.add('makeElevator', () => {
    const elevator = makeElevator({ x: 8, y: 10, z: 2 })
    return (
        <InteractiveScene>
            {Array.from(Array(12)).map((body, i) => {
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
                            size: [0.5 + Math.random() * 0.5],
                            type: 'sphere',
                        }}
                    />
                )
            })}
            {elevator.map(b => {
                return (
                    <Boundary
                        name={b.name}
                        pos={{ x: b.x, y: b.y, z: b.z }}
                        width={b.w}
                        height={b.h}
                        depth={b.d}
                        showCollider={b.name === 'frontwall' ? false : true}
                        dynamic={b.name === 'bottom' ? true : false}
                    />
                )
            })}
        </InteractiveScene>
    )
})

storiesOf('UI (DOM)', module).add('foo', () => <div />)
