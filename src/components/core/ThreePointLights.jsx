import React from 'react'
import * as THREE from 'three'

import { v3 } from '../../helpers/utilities'

export default class ThreePointLights extends React.Component {
    render() {
        const sf = this.props.scale
        const { light1, light2, light3 } = this.props
        return (
            <group>
                <pointLight
                    position={v3(
                        light1.position.x * sf,
                        light1.position.y * sf,
                        light1.position.z * sf
                    )}
                    color={light1.color}
                    decay={3}
                    distance={36}
                    visible={light1.on}
                    intensity={light1.intensity}
                />
                <pointLight
                    position={v3(
                        light2.position.x * sf,
                        light2.position.y * sf,
                        light2.position.z * sf
                    )}
                    color={light2.color}
                    decay={3}
                    distance={36}
                    visible={light2.on}
                    intensity={light2.intensity}
                />
                <pointLight
                    position={v3(
                        light3.position.x * sf,
                        light3.position.y * sf,
                        light3.position.z * sf
                    )}
                    color={light3.color}
                    decay={3}
                    distance={36}
                    visible={light3.on}
                    intensity={light3.intensity}
                />
            </group>
        )
    }
}

ThreePointLights.defaultProps = {
    scale: 2,
    light1: {
        position: v3(3, 2, 3.5),
        intensity: 0.6,
        color: 0xff0000,
        on: true,
    },
    light2: {
        position: v3(-5, -1, 1.5),
        intensity: 0.35,
        color: 0xffff00,
        on: true,
    },
    light3: {
        position: v3(0, 3, -0.5),
        intensity: 0.7,
        color: 0x0077ff,
        on: true,
    },
}
