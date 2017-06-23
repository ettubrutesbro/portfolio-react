const Projects = [
    {
        name: 'sendbloom',
        debugCubeColor: 0xff0000,
        debugModel: true,
    },
    {
        name: 'origami logic',
        debugCubeColor: 0x00ff00,
        debugModel: true,
        physicsModel: {
            types: ['box'],
            sizes: [2,2,2],
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
            sizes:        [1.25,2,1.25,     1,2,1],
            positions:    [0,0,0,           0,2,0],
            debugColor: 0xff0000
        },
        debugCubeColor: 0x0000ff,
        debugModel: true,
    },
    {},
    {},
    {},
    {},


]

export {Projects}
