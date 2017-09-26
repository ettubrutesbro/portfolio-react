import React from 'react'
import * as THREE from 'three'

import { v3, twn, makeColorBox, rads } from '../../helpers/utilities'

export default class Popover extends React.Component {
    componentDidMount() {
        const windowcolor = {
            front: 0xededed,
            left: 0xccd2d6,
            bottom: 0xededed,
            right: 0xededed,
            top: 0xfbfbfc,
            back: 0xededed,
        }

        makeColorBox(
            'sendbloom',
            this.refs.popover,
            [0.6, 0.3, 0.04],
            windowcolor
        )

        makeColorBox(
            'sendbloom',
            this.refs.triangle,
            [0.06, 0.04, 0.06],
            windowcolor
        )

        this.reset()
    }

    reset() {
        this.refs.popover.scale.set(0.001, 0.001, 0.25)
        this.refs.popover.position.set(0, 0, 0.09)
        this.refs.popover.visible = false

        // this.refs.shadow1.material.opacity = 0
        // this.refs.shadow2.material.opacity = 0
        // this.refs.shadow3.material.opacity = 0

        this.refs.shadow.visible = false
        this.refs.shadow.position.set(0, -0.05, 0)
    }

    cycleIn() {
        this.reset()

        const store = this.props.store
        const popover = this.refs.popover
        const shadow = this.refs.shadow
        store.bodies.sendbloom.allowSleep = false
        store.bodies.sendbloom.sleeping = false
        store.static = false

        this.refs.popover.visible = true

        this.popoverTweens = [
            twn('position', { x: 0 }, { x: -0.15 }, 200, popover.position),
            twn(
                'scale',
                { x: 0.001, y: 0.001, z: 0.25 },
                { x: 1, y: 1, z: 1 },
                200,
                popover.scale
            ),
            twn('position', { x: 0 }, { x: -0.15 }, 200, shadow.position),
            twn(
                'scale',
                { x: 0.001, y: 0.001, z: 0.25 },
                { x: 1, y: 1, z: 1 },
                200,
                shadow.scale
            ),
        ]

        this.refs.shadow.visible = true
        //TODO: these get interrupted, wyd?
        this.timedTransform = setTimeout(() => {
            this.transformTweens = [
                twn(
                    'position',
                    { x: -0.15 },
                    { x: -0.3 },
                    200,
                    popover.position
                ),
                twn(
                    'position',
                    { x: -0.15 },
                    { x: -0.3 },
                    200,
                    shadow.position
                ),
                twn('scale', { x: 1 }, { x: 0.5 }, 200, popover.scale),
                twn('scale', { x: 1 }, { x: 0.5 }, 200, shadow.scale),
            ]
        }, 1000)
        this.timedTransform2 = setTimeout(() => {
            // this.refs.shadow.position.set(0.555, 0.02, 0.11)
            // this.refs.shadow.scale.set(0.75, 2, 1)
            this.transformTweens = [
                twn(
                    'position',
                    { x: -0.3, y: 0 },
                    { x: -0.225, y: -0.15 },
                    250,
                    popover.position
                ),
                twn(
                    'position',
                    { x: -0.3, y: -0.05 },
                    { x: -0.225, y: -0.2 },
                    250,
                    shadow.position
                ),
                twn(
                    'scale',
                    { x: 0.5, y: 1 },
                    { x: 0.75, y: 2 },
                    250,
                    popover.scale
                ),
                twn(
                    'scale',
                    { x: 0.5, y: 1 },
                    { x: 0.75, y: 1.8 },
                    250,
                    shadow.scale
                ),
            ]
        }, 1800)
    }

    cycleOut() {
        const store = this.props.store
        const popover = this.refs.popover
        store.bodies.sendbloom.allowSleep = false
        store.bodies.sendbloom.sleeping = false
        store.static = false
        // this.refs.popover.visible = false

        if (this.timedTransform) clearTimeout(this.timedTransform)
        if (this.timedTransform2) clearTimeout(this.timedTransform2)
        //TODO: what about stoppping transformTweens set inside of the timeouts???

        this.popoverTweens = [
            twn(
                'position',
                {
                    x: popover.position.x,
                    y: popover.position.y,
                },
                { x: -0.45, y: 0.15 },
                300,
                popover.position
            ),
            twn(
                'scale',
                { x: popover.scale.x, y: popover.scale.y, z: popover.scale.z },
                { x: 0.001, y: 0.001, z: 0.25 },
                300,
                popover.scale
            ),
        ]
    }

    render() {
        return (
            <group position={v3(-0.3, 0.2, 0.11)}>
                <resources>
                    <texture
                        url={require('./shadow2.png')}
                        resourceId="shadow2"
                    />
                </resources>

                <mesh ref="shadow">
                    <planeBufferGeometry
                        dynamic={true}
                        width={0.7}
                        height={0.4}
                    />
                    <meshBasicMaterial transparent depthWrite={false}>
                        <textureResource resourceId="shadow2" />
                    </meshBasicMaterial>
                </mesh>
                <group
                    ref="triangle"
                    position={v3(-0.3, 0.15, 0.09)}
                    rotation={new THREE.Euler(rads(-90), rads(45), 0)}
                />
                <group ref="popover" />
            </group>
        )
    }
}
