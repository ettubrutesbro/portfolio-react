import React from 'react'
import * as THREE from 'three'

import { v3 } from '../../helpers/utilities'

export default class ThreePointLights extends React.Component {
    render() {
        const sf = this.props.scale
        const { light1, light2, light3, debug } = this.props

        const debugGeometry = (<boxGeometry width = {0.25} height = {0.25} depth = {0.25} />)

        return (
            <group>
                <group
                    position={v3(
                        light1.position.x * sf,
                        light1.position.y * sf,
                        light1.position.z * sf
                    )}
                >
                {debug && 
                    <mesh> 
                        {debugGeometry} 
                        <meshBasicMaterial wireframe = {true} color = {light1.color} /> 
                    </mesh>
                }
                <pointLight
                    color={light1.color}
                    decay={this.props.decay}
                    distance={this.props.distance}
                    visible={light1.on}
                    intensity={light1.intensity}
                />
                </group>

                <group 
                    position={v3(
                        light2.position.x * sf,
                        light2.position.y * sf,
                        light2.position.z * sf
                    )}
                >
                {debug && 
                    <mesh> 
                        {debugGeometry} 
                        <meshBasicMaterial wireframe = {true} color = {light2.color} /> 
                    </mesh>
                }
                <pointLight
                    color={light2.color}
                    decay={this.props.decay}
                    distance={this.props.distance}
                    visible={light2.on}
                    intensity={light2.intensity}
                />
                </group>

                <group
                    position={v3(
                        light3.position.x * sf,
                        light3.position.y * sf,
                        light3.position.z * sf
                    )}
                >
                {debug && 
                    <mesh> 
                        {debugGeometry} 
                        <meshBasicMaterial wireframe = {true} color = {light3.color} /> 
                    </mesh>
                }
                <pointLight
                    color={light3.color}
                    decay={this.props.decay}
                    distance={this.props.distance}
                    visible={light3.on}
                    intensity={light3.intensity}
                />
                </group>

            </group>
        )
    }
}

ThreePointLights.defaultProps = {
    scale: 1,
    decay: 3, 
    distance: 36,
    light1: {
        position: v3(6,3,8),
        intensity: 0.7,
        color: 0xD0F7F7,
        on: true,
    },
    light2: {
        position: v3(-6,0.5,1),
        intensity: .2,
        color: 0x806554,
        on: true,
    },
    light3: {
        position: v3(0,5,0),
        intensity: 0.6,
        color: 0xB9CCD4,
        on: true,
    },
    debug: false
}
