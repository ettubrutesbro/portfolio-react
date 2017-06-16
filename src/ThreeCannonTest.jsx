
import React from 'react'
import React3 from 'react-three-renderer'
import * as THREE from 'three'
import 


export default class ThreeCannonTest extends React.Component{
    constructor(props, context){
        super(props, context)

        /*
            React3: define constants:
                fog, light positions, rotation quaternions
                for ground & camera (unless latter is dynamic)

            Cannon: instantiate and initalize:
                const world = new CANNON.World()
                    // world is the physics hub that manages objects and simulation.
                    
                const bodies = [] 
                const meshRefs = []

                const initCannon = () => { 

                    //establish world's constants

                        world.quatNormalizeSkip = 8 // perf
                        world.quatNormalizeFast = true // perf

                        world.gravity.set(0, 0, -9.82) 
                                // meters per second in Z direction
                                // the react-three-renderer demo actually has -Y direction..??
                        world.broadphase = new CANNON.NaiveBroadPhase()
                                // broadphase algo lets world find colliding body 

                    //GROUND: shape, static mass, and rotation
                        const groundShape = new CANNON.Plane()
                        const groundBody = new CANNON.Body({mass: 0, shape: groundShape})
                        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)

                    //make walls for container
                        //to my knowledge it's like plane, just rotated on different axes...?

                    //define COLLISION SHAPES
                        //loading manager down the road?
                        //recur through project JSON, which should carry unique params for colision boxes
                            // new CANNON.Box(new CANNON.Vec3(0.5,0.5,0.5))

                }

                

                initCannon()
                
                const timeStep = 1 / 60 
                    // 1/60th second is the update interval
                
                const updatePhysics = () => {
                    world.step(timeStep) // every timestep, advance one frame...? 
                }
        */

    }
}