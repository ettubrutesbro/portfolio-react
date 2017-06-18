
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
                            //const boxShape = new CANNON.Box(new CANNON.Vec3(0.5,0.5,0.5))
                    
                    for(let i = 0; i< N; ++i){
                        const boxBody = new CANNON.Body({ mass: x })
                        boxBody.addShape(boxShape)
                        boxBody.position.set(x, y, z)
                        world.addBody(boxBody)
                        bodies.push(boxBody)

                        meshRefs.push((mesh)=> {
                            if(mesh){
                                mesh.userData._bodyIndex = i
                                this.meshes.push(mesh)
                            }
                        })
                    } //end recursion over project objects


                }

                initCannon()
                
                const timeStep = 1 / 60 
                    // 1/60th second is the update interval
                
                const updatePhysics = () => {
                    world.step(timeStep) // every timestep, advance the world one frame...? 
                }

                const getMeshStates = () => bodies.map(({ position, quaternion }, bodyIndex) => ({
                    position: new THREE.Vector3().copy(position),
                    quaternion: new THREE.Quaternion().copy(quaternion),
                    ref: meshRefs[bodyIndex],
                }))
                    //maps over CANNON bodies, and copies their positions / rotation data into
                    //an array of new THREE objects (uses index for ref for react3)
                        //being a const i guess this just runs once in the constructor?

                this.onAnimate = () => {
                    updatePhysics()
                     this.setState({
                        meshStates: _getMeshStates(), //use MOBX?
                    })
                }
                 //why isn't this defined apart from the constructor?

                 this.state = { 
                    meshStates: _getMeshStates()
                 }
                // finally: this is the actual state instantiation within constructor

                this.meshes = [] //why is meshes instantiated at end as empty...
            
        */
    }

    componentDidMount(){
        //mouse event stuff
    }

    componentDidUpdate(newProps) {
        const { width, height } = this.props
        if(width!== newProps.width || height !== newProps.height){
            //if there are mouse interactions (yes there are) with THREE
            //a function needs to be here for remapping input if window size
            // changes
            //  in the example, it was:
                // mouseInput.containerResized()
        }
    }

    componentWillUnmount(){
        delete this.world
    }

    render(){
        const {width, height } = this.props
        //const { meshStates } = this.state
            // do with mobx
    }


}