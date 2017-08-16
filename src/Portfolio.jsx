import React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'

import {debounce} from 'lodash'

import styles from './Portfolio.css'
import { Projects } from './data/projects.js'

import World from './World.jsx'

@observer
class Portfolio extends React.Component {
  @observable screenWidth = window.innerWidth
  @observable screenHeight = window.innerHeight

  @action
  userResizedWindow = () => {
    this.screenWidth = window.innerWidth
    this.screenHeight = window.innerHeight
  }

  componentDidMount() {
    window.addEventListener('resize', debounce(this.userResizedWindow, 100))
  }

  render() {
    return (
      <div className={styles.portfolio}>
        <World
            width = {this.screenWidth}
            height = {this.screenHeight}
            projects = {Projects}

        />
      </div>
    )
  }
}

export default Portfolio
