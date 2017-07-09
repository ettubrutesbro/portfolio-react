
//PresentationComponents: THREE groups/meshes/geometries with event animations
import Seseme from '../Projects/Seseme/Seseme'
const PresentationComponents = { Seseme }

const Projects = [
    {
        name: 'sendbloom',
        displayTitle: 'Sendbloom',
        debug: true,
    },
    {
        name: 'origami',
        displayTitle: 'Origami Logic',
        debug: true,
        physicsModel: {
            types: ['sphere', 'box'],
            sizes: [.75,0,0,     .5,2,.5],
            positions: [0,0,0, 0,0,0]
        },
    },
    {
        name: 'seseme',
        displayTitle: 'SESEME',
        physicsModel: {
            types: ['box'],
            sizes: [.9,2.5,.9],
            positions: [0,0,0],
            debugColor: 0xff0000
        },
        selected: {
            rotation: {x: 0, y: -135, z: -0},
            camera: {
                position: {x: 0, y: 7, z: 7}
            }
        },
        blurb: 'public data vis / robotics installation proposing public monuments with public data and blah blah blah',
        expandable: true,
    }
]

export {Projects, PresentationComponents}
