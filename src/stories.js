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

import './stories.css'

import * as THREE from 'three'

import SimpleScene from './components/core/SimpleScene'
import InteractiveScene from './components/core/InteractiveScene'
import Body, {Boundary} from './components/core/Body'
import ThreePointLights from './components/core/ThreePointLights'

import AscendingCatcher from './components/AscendingCatcher'

import { v3, makeEnclosure, rads } from './helpers/utilities'

import { SendbloomModel } from './components/Sendbloom'
import Seseme from './components/Seseme/Seseme'
import Wake from './components/Wake'

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
        position: '6,3,8',
        intensity: 7
    })
    const l1color = color('light1 color(hex)', '#D0F7F7')
    const light2 = object('light 2', {
        position: '-6,0.5,1',
        intensity: 2
    })
    const l2color = color('light2 color(hex)', '#806554')
    const light3 = object('light 3', {
        position: '0,5,0',
        intensity: 6
    })
    const l3color = color('light3 color(hex)', '#B9CCD4')

    const mtlcolor  = color('material color', '#777777')
    const emissive = color('emissive', '#B5B8B8')
    const specular = color('specular', '#FF8F4A')
    const shininess = number('shininess', 1.5)

    const yRot = number('rotate Y', 90)

    return (
        <SimpleScene clearColor = {0xededed}>
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
                    color={mtlcolor}
                    emissive = {emissive}
                    specular = {specular}
                    shininess = {shininess}
                />
            </mesh>
        </SimpleScene>
    )
})
models.add('Sendbloom', () => {
    const yRot = number('rotate Y', 0)

    const mode = select('mode', ['expanded', 'selected', 'normal'], 'normal')

    return (
        <SimpleScene>
            <group rotation={new THREE.Euler(0, rads(yRot), 0)}>
                <SendbloomModel mode = {mode}/>
            </group>
        </SimpleScene>
    )
})
models.add('Seseme', () => {
        const debugshowlights = boolean('show light positions', true)

    const light1 = object('light 1', {
        position: '6,3,8',
        intensity: 7
    })
    const l1color = color('light1 color(hex)', '#D0F7F7')
    const light2 = object('light 2', {
        position: '-6,0.5,1',
        intensity: 2
    })
    const l2color = color('light2 color(hex)', '#806554')
    const light3 = object('light 3', {
        position: '0,5,0',
        intensity: 6
    })
    const l3color = color('light3 color(hex)', '#B9CCD4')

    const mtlcolor  = color('material color', '#FFFFFF')
    const emissive = color('emissive', '#383838')
    const specular = color('specular', '#D69D68')
    const shininess = number('shininess', 15)

    const decay = number('decay', 3)
    const distance = number('distance', 36)

    const sesemeyRot = number('rotate Y', 0)
    return (
        <SimpleScene clearColor = {0xdedede} >
            <hemisphereLight
                skyColor={0xffe8bb}
                groundColor={0x8aaabb}
                intensity={0.1}
                visible={true}
            />
            <ThreePointLights
                scale={0.8}
                decay = {decay}
                distance = {distance}
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
            <group rotation={new THREE.Euler(0, rads(sesemeyRot), 0)}>
                <Seseme 
                    debugMtl = {{color: mtlcolor, emissive: emissive, specular: specular, shininess: shininess}}
                />
            </group>
        </SimpleScene>
    )
})
models.add('Wake (component)', () => {
    return(
        <SimpleScene>
            <Wake />
        </SimpleScene> 
    )
})
// models.add('Wake', () => {
//     const wakexRot = number('rotate X', 15)
//     const wakeyRot = number('rotate Y', 150)
//     return (
//         <SimpleScene>
//             <group
//                 rotation={new THREE.Euler(rads(wakexRot), rads(wakeyRot), 0)}
//             >
//                 <mesh>
//                     <geometry
//                         vertices={wakebed.geometry.vertices}
//                         faces={wakebed.geometry.faces}
//                     />
//                     <meshNormalMaterial />
//                 </mesh>
//                 <mesh>
//                     <geometry
//                         vertices={wakesleeper.geometry.vertices}
//                         faces={wakesleeper.geometry.faces}
//                     />
//                     <meshNormalMaterial />
//                 </mesh>
//                 <mesh>
//                     <geometry
//                         vertices={wakesleeperl.geometry.vertices}
//                         faces={wakesleeperl.geometry.faces}
//                     />
//                     <meshNormalMaterial />
//                 </mesh>
//             </group>
//         </SimpleScene>
//     )
// })


const interactiveModels = storiesOf('Animating models', module)

// interactiveModels.addDecorator(withKnobs)
interactiveModels.add('wtf', ()=>{
    return(
        <InteractiveScene>
            <Body
                name = "wtfbox"
                showCollider={true}
                physicsModel={{
                    pos: [0, 10, 0],
                    type: 'box',
                    size: [1, 1, 1],
                }}
            />
            <Boundary
                name = "wtfground"
                pos={{ x: 0, y: 1, z: 0 }}
                width={10}
                depth={10}
                height={1}
                // showCollider={showground}
            />
        </InteractiveScene>

    )
})
interactiveModels.add('sendbloom test', ()=> {
    return(
            <InteractiveScene
            >
                <Body
                    name="sendbloom"
                    showCollider={true}
                    physicsModel={{
                        pos: [0, 10, 0],
                        type: 'box',
                        size: [1, 1, 1],
                    }}
                >
                    <SendbloomModel />
                </Body>

                <Boundary
                    name="sbtestground"
                    pos={{ x: 0, y: -5, z: 0 }}
                    width={10}
                    depth={10}
                    height={1}
                    // showCollider={showground}
                    showCollider = {true}
                />

            </InteractiveScene>
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
                >
                    <SendbloomModel />
                </Body>

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
                    showCollider={showground}
                />
            </InteractiveScene>
        </div>
    )
})

worldStories.add('makeEnclosure', () => {
    const enclosure = makeEnclosure({ x: 8, y: 10, z: 2 })

    const walls = boolean('walls exist', true)

    return (
        <InteractiveScene
            debug
            debugCamPos = {{x: 0, y: 2, z:40}}
            onSelect = {()=>{
                console.log('selected')
            }}
            onDeselect = {()=>{
                console.log('deselected')
            }}
        >
            {Array.from(Array(3)).map((body, i) => {
                return (
                    <Body
                        key = {'body'+i}
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
            {enclosure.map((b,i) => {
                return (
                    <Boundary
                        key = {'wall'+i}
                        name={b.name}
                        pos={{ x: b.x, y: b.y, z: b.z }}
                        width={b.w}
                        height={b.h}
                        depth={b.d}
                        showCollider={b.name === 'frontwall' ? false : true}
                        exists = {walls}
                        // dynamic = {true}
                    />
                )
            })}
                <Boundary
                    name="ground"
                    pos={{ x: 0, y: -0.25, z: 0 }}
                    width={10}
                    depth={10}
                    height={0.5}
                    exists = {walls}
                    showCollider = {true}
                    // dynamic = {true}
                />
        </InteractiveScene>
    )
})
.add('AscendingCatcher', ()=> {
    // const camZoom = number('zoom level', 1)
    // const camX = number('cam X', 0)
    // const camY = number('cam Y', 0)
    // const camZ = number('cam Z', 40)
    return(
        <AscendingCatcher 
            // cameraGoal = {{x: camX, y: camY, z: camZ, zoom: camZoom}}
            // groundA = {groundA}
            // groundB = {groundB}
        >
            {Array.from(Array(12)).map((body, i) => {
                    return (
                        <Body
                            key = {'body'+i}
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
                                rot: [
                                    (Math.random()*20)-10, 
                                    (Math.random()*20)-10, 
                                    (Math.random()*20)-10 
                                ],
                                size: [
                                    1 + Math.random() * 1.75,
                                    1 + Math.random() * 1.75,
                                    1 + Math.random() * 1.75,
                                ],
                                type: 'box',
                            }}
                            onSelect = {{
                                position: {x:0, y:0, z:0},
                                rotation: {x:0, y:0, z:0},
                                // onComplete: this.updateTooltip
                            }}
                        />
                    )
                })}
        </AscendingCatcher>
    )
})


// storiesOf('UI (DOM)', module)
//     .add('foo', () => {
//         return(
//             <div>
//                 ffff
//             </div>
//         )
//     })
