import React from 'react'
import React3 from 'react-three-renderer'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'

import * as THREE from 'three'
import { PresentationModels } from '../data/projects.js'

import {nonCollisionGroup, normalCollisions, collidesWithAll} from '../constants.js'

function makePresentationComponent(props) {
  const PresentationComponent = PresentationModels[props.name + 'Model']
  return PresentationComponent ? <PresentationComponent {...props} /> : null
}

@observer
export default class ProjectGroup extends React.Component {
  @observable physicsMeshes = []

  constructor(props, context) {
    super(props, context)
  }

  componentWillMount() {
    this.instantiateModel()
  }

  @action
  instantiateModel = () => {
    //given project's JSON data thru props, instantiate physics model and meshes
    const project = this.props.project
    let physics = this.props.store

    const i = this.props.index
    const sizeConstant = 8

    const model = project.physicsModel || {
      types: ['box'],
      sizes: [1, 1, 1],
      positions: [0, 0, 0],
    }
    const physicsGroup = {
      name: project.name,
      type: model.types,
      size: model.sizes,
      posShape: model.positions,
      density: model.density || 10,
      restitution: model.restitution || 0.001,
      //random / programmatic for scene purposes
      pos: [
        (Math.random() * sizeConstant - sizeConstant / 2) * 0.25,
        sizeConstant + i * 2,
        -0.75,
      ],
      rot: [
        Math.random() * 30 - 15,
        Math.random() * 30 - 15,
        Math.random() * 30 - 15,
      ],
      move: true,
      world: this.props.world,
      belongsTo: normalCollisions,
      collidesWith: collidesWithAll & ~nonCollisionGroup,
    }

    this.props.bodies[project.name] = this.props.world.add(physicsGroup)

    this.props.groups[this.props.index] = {
      position: new THREE.Vector3().copy(
        this.props.bodies[project.name].getPosition()
      ),
      rotation: new THREE.Quaternion().copy(
        this.props.bodies[project.name].getQuaternion()
      ),
    }
    if (this.props.debug) {
      this.physicsMeshes = model.types.map((type, i) => {
        const n = i * 3
        return {
          geo: type,
          pos: {
            x: model.positions[n + 0],
            y: model.positions[n + 1],
            z: model.positions[n + 2],
          },
          size: {
            w: model.sizes[n + 0],
            h: model.sizes[n + 1],
            d: model.sizes[n + 2],
            r: model.sizes[n + 0],
          },
          color: model.debugColor || 0x888888,
        }
      })
    }
  }

  componentDidMount() {
    this.props.onReady()
  }

  render() {
    const physics = this.props.store
    const { project, index, isExpanded, isSelected } = this.props
    const capitalizedName =
      project.name.charAt(0).toUpperCase() + project.name.substr(1)

    return (
      <group
        name={project.name}
        position={this.props.groups[index].position}
        quaternion={this.props.groups[index].rotation}
        onClick={() => console.log('what')}
      >
        {makePresentationComponent({
          name: capitalizedName,
          store: physics,
          index: index,
          mode: isExpanded ? 'expanded' : isSelected ? 'selected' : 'normal',
        })}

        {//PHYSICS MESHES:
        this.props.debug &&
          project.debug &&
          this.physicsMeshes.map((pmesh, it) => {
            const geo =
              pmesh.geo === 'box'
                ? <boxGeometry
                    width={pmesh.size.w}
                    height={pmesh.size.h}
                    depth={pmesh.size.d}
                  />
                : pmesh.geo === 'sphere'
                  ? <sphereGeometry
                      radius={pmesh.size.r}
                      widthSegments={8}
                      heightSegments={8}
                    />
                  : <boxGeometry width={0.1} height={0.1} depth={0.1} />

            return (
              <mesh
                name={project.name}
                key={project.name + 'PhysicsMesh' + it}
                position={
                  new THREE.Vector3(pmesh.pos.x, pmesh.pos.y, pmesh.pos.z)
                }
              >
                {geo}
                <meshBasicMaterial
                  color={pmesh.color}
                  transparent
                  opacity={0.4}
                />
              </mesh>
            )
          })}
      </group>
    )
  }
}
