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
        name: 'origami logic',
        physicsModel: {
            types: ['sphere'],
            sizes: [1,0,0],
            positions: [0,0,0]
        }
    },
    {
        name: 'seseme',
        physicsModel: {
            // types: ['sphere'],
            // sizes: [1,0,0], //only first # is used for radius
            // positions: [0,0,0]
            types:        ['box',           'box'],
            sizes:        [1,1.75,1,     .75,1.75,.75],
            positions:    [0,0,0,           0,1.75,0],
            debugColor: 0xff0000
        },
    },
    {},
    {},
    {},
    {},


]

export {Projects}
