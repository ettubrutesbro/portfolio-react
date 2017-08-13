import React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'

import { InfoComponents } from '../data/projects.js'

import styles from './ProjectInfo.css'

function makeInfoComponent(props) {
  const InfoComponent = InfoComponents[props.name + 'Info']
  return InfoComponent ? <InfoComponent {...props} /> : null
}

@observer
export default class ProjectInfo extends React.Component {
  // console.log('rend')
  render() {
    console.log('rend')
    //title
    //blurb OR ExpandedInfoComponent
    const project = this.props.project
    const capitalizedName =
      project.name.charAt(0).toUpperCase() + project.name.substr(1)

    return (
      <section className={styles.ProjectInfo} style={this.props.style}>
        <h2 className={styles.title}>
          {project.name}
        </h2>

        {makeInfoComponent({
          name: capitalizedName,
          // store: store // eventually
          mode: 'blurb',
        })}
      </section>
    )
  }
}
