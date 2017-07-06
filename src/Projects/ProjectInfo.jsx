import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import * as InfoComponents from '../data/projects.js'

import styles from './ProjectInfo.css'

export default class ProjectInfo extends React.Component{
    //renders DOM
    render(){

        return(
            <div className = {styles.ProjectInfo}>
                Info
            </div>
        )

    }
}

