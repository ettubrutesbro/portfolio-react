// const debug = {
//     walls: false,
//     lights: true,
//     runWorld: true,
// }
import React from 'react'
import Seseme from '../Projects/Seseme/Seseme'

const Projects = [
    {
        name: 'sendbloom',
        debug: true,
    },
    {
        name: 'origami',
        debug: true,
        physicsModel: {
            types: ['sphere', 'box'],
            sizes: [.75,0,0,     .5,2,.5],
            positions: [0,0,0, 0,0,0]
        },
    },
    {
        name: 'seseme',
        // debug: true,
        physicsModel: {
            // types:        ['box',     'box'],
            // sizes:        [.915,1.475,.915,   .7,1.2,.7],
            // positions:    [0,-.55,0,        0,.625,0],
            types: ['box'],
            sizes: [.9,2.5,.9],
            positions: [0,0,0],
            debugColor: 0xff0000
        },
        selected: {
            rotation: {x: 15, y: -135, z: -0},
            camera: {
                position: {x: 2.5, y: 1.4, z: 7.7}
            }
        },
    }
]

export {Projects, Seseme}
