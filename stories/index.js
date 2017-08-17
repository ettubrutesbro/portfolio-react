import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import React3 from 'react-three-renderer'
import * as THREE from 'three'

import * as utils from '../src/utilities.js'

const loader = new THREE.JSONLoader()
const dragon = loader.parse(require('../src/Projects/Eclipse/dragon.json'))

storiesOf('World (3D)', module)
    .add('Test r3r canvas', ()=> {
        return (
            <div>
                <React3
                    mainCamera = "camera"
                    width = {window.innerWidth}
                    height = {window.innerHeight}
                >
                    <scene>
                        <perspectiveCamera 
                            name = "camera"
                            fov = {30}
                            aspect = {window.innerWidth / window.innerHeight}
                            near = {0.1} far = {50}
                            position = {new THREE.Vector3(0,2,10)}
                        />
                        <mesh position = {new THREE.Vector3(0,0,0)}>
                            <boxGeometry width = {1} height = {1} depth = {1} />
                            <meshNormalMaterial />
                        </mesh>

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