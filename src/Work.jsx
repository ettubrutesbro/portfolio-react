import React from 'react'
import {findDOMNode} from 'react-dom'
import {action} from 'mobx'
// import {observer} from 'mobx-react'

import styles from './Work.css'

export default class Work extends React.Component {
    componentDidMount(){
       this.setWorkTop(findDOMNode(this.refs.section).offsetTop)
    }
    @action setWorkTop(value){
        this.props.store.worktop = value
    }
    render(){
      return(
          <section ref = "section" className = {styles.work}>
            <h2 className = {styles.titleblock} >My Work 2011-2017</h2>
          </section>
        )
      }
}