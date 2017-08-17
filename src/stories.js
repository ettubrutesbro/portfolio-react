import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import React3 from 'react-three-renderer'
import * as THREE from 'three'
import * as OIMO from 'oimo'

import * as utils from './utilities.js'
import {noCollisions, normalCollisions, collidesWithAll} from './constants.js'

import SimpleScene from './SimpleScene'
import Ground from './Ground'

const loader = new THREE.JSONLoader()
const dragon = loader.parse(require('./Projects/Eclipse/dragon.json'))

storiesOf('World (3D)', module)
    .add('Test r3r canvas', ()=> <SimpleScene />)

    .add('basic constraints', () => {

    })

    .add('story w/ physics store', () => {
        let world = new OIMO.World()
        const animateFunction = () => {
            // console.log('what')
            world.step()
            // console.log(obj.position)
        }
        // let obj = world.add({
        //     name: 'testobj',
        //     type: 'box',
        //     pos: [0,10,0],
        //     size: [1.2,1.2,1.2],
        //     move: true,
        //     world: world,
        //     belongsTo: normalCollisions,
        //     collidesWith: collidesWithAll & ~noCollisions
        // })
        // console.log(world)


        return (
            <div>
                <React3
                    mainCamera = "camera"
                    width = {window.innerWidth}
                    height = {window.innerHeight}
                    onAnimate = {animateFunction}
                >
                    <scene>
                        <perspectiveCamera 
                            name = "camera"
                            fov = {30}
                            aspect = {window.innerWidth / window.innerHeight}
                            near = {0.1} far = {50}
                            position = {new THREE.Vector3(0,2,10)}
                        />
                        <Ground world = {world}/>
                        <mesh position = {new THREE.Vector3(0,2,0)}>
                            <geometry 
                                vertices = {dragon.geometry.vertices}
                                faces = {dragon.geometry.faces}
                            />
                            <meshNormalMaterial />
                        </mesh>
                    </scene>
                </React3>
            </div>
        )
    })




storiesOf('UI', module)
    .add('foo', ()=> <div />)