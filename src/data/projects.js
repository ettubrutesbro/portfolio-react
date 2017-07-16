
//PresentationComponents: THREE groups/meshes/geometries with event animations
import {SesemeModel, SesemeInfo} from '../Projects/Seseme/Seseme'
import {SendbloomModel} from '../Projects/Sendbloom/Sendbloom.jsx'
//with each new project, update this manifest
const PresentationModels = { SesemeModel, SendbloomModel }

//InfoComponents: HOC that renders Blurb or Article depending on app state
const InfoComponents = { SesemeInfo }

//basic project data: physics models, title, debug things
const Projects = [
    {
        name: 'sendbloom',
        displayTitle: 'Sendbloom',
        // debug: true,
        physicsModel: {
            types: ['box'],
            sizes: [1.6,1,0.375],
            positions: [0,0.1,0],
            debugColor: 0xff0000
        },
        selected: {
            rotation: {x: 10, y: 35, z: 0}
        }
    },
    {
        name: 'origami',
        displayTitle: 'Origami Logic',
        debug: true,
        physicsModel: {
            types: ['sphere', 'box'],
            sizes: [.75,0,0,     .5,2,.5],
            positions: [0,0,0, 0,0,0],
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
        expandable: true,
    }
]

export {Projects, PresentationModels, InfoComponents}
