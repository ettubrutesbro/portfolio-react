import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import * as InfoComponents from '../data/projects.js'

import styles from './ProjectInfo.css'

export default class ProjectInfo extends React.Component{
    render(){
        //title
        //blurb OR ExpandedInfoComponent

        console.log(this.props.project)

        return(
            <article 
                className = {styles.ProjectInfo}
                style = {this.props.style}
            >
                <h2>Fuck you</h2>
            </article>
        )

    }
}

