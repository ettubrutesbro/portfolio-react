// const debug = {
//     walls: false,
//     lights: true,
//     runWorld: true,
// }
import React from 'react'
import Seseme from '../ProjectHeap/Seseme/Seseme'

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
        }
    },
    {
        name: 'seseme',
        // debug: true,
        presentationModel: (<Seseme />),
        physicsModel: {
            types:        ['box'],
            sizes:        [.9,2.5,.9],
            positions:    [0,0,0],
            debugColor: 0xff0000
        },
    }
]

export {Projects, Seseme}
