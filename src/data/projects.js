//PresentationComponents: THREE groups/meshes/geometries with event animations
import { SesemeModel, SesemeInfo } from '../Projects/Seseme/Seseme'
import {
  SendbloomModel,
  SendbloomInfo,
} from '../Projects/Sendbloom/Sendbloom.jsx'
//with each new project, update this manifest
const PresentationModels = { SesemeModel, SendbloomModel }

//InfoComponents: HOC that renders Blurb or Article depending on app state
const InfoComponents = { SesemeInfo, SendbloomInfo }

//basic project data: physics models, title, debug things
const Projects = [
  {
    name: 'sendbloom',
    displayTitle: 'Sendbloom',
    // debug: true,
    physicsModel: {
      types: ['box'],
      sizes: [1.6, 1, 0.35],
      positions: [0, 0, 0],
      debugColor: 0xff0000,
    },
    selected: {
      // position: {x: 2, y: 1, z: 0},
      rotation: { x: 10, y: 35, z: 0 },
      camera: {
        // position: {x: 0, y: 2.75, z: 2.75}, //ortho
        position: { x: 0, y: 4, z: 6.8 },
        zoom: 1.25,
      },
    },
  },
  {
    name: 'origami',
    displayTitle: 'Origami Logic',
    debug: true,
    physicsModel: {
      types: ['sphere', 'box'],
      sizes: [0.75, 0, 0, 0.5, 2, 0.5],
      positions: [0, 0, 0, 0, 0, 0],
    },
  },
  {
    name: 'seseme',
    displayTitle: 'SESEME',
    // debug: true,
    physicsModel: {
      types: ['box'],
      sizes: [0.95, 2.5, 0.95],
      positions: [0, 0, 0],
      debugColor: 0xff0000,
    },
    selected: {
      rotation: { x: 0, y: -135, z: -0 },
      camera: {
        position: { x: 0, y: 7, z: 7 },
        zoom: 1.2,
      },
    },
    expandable: true,
  },
]

export { Projects, PresentationModels, InfoComponents }
