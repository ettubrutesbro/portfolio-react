// const debug = {
//     walls: false,
//     lights: true,
//     runWorld: true,
// }

const Projects = [
    {
        name: 'sendbloom',
    },
    {
        name: 'origami',
        physicsModel: {
            types: ['sphere', 'box'],
            sizes: [.75,0,0,     .5,2,.5],
            positions: [0,0,0, 0,0,0]
        }
    },
    {
        name: 'seseme',
        physicsModel: {
            types:        ['box', 'box',           'box'],
            sizes:        [1.15,.25,1.15,      .9,1,.9,     .8,1,.8],
            positions:    [0,-.75,0,      0,-.25,0,           0,.75,0],
            debugColor: 0xff0000
        },
    }
]

export {Projects}
