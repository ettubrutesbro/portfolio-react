import React from 'react'
import {observable, action, observe} from 'mobx'
import {observer} from 'mobx-react'

import styles from './Intro.css'

import QuirkyVid from './QuirkyVid/QuirkyVid'

export default class Intro extends React.Component{

  @action loaded(){
    this.props.store.loadcontent.introvideo = true
  }
  render(){
    return(
      <section className = {styles.intro}>
        <QuirkyVid
          id="intro"
          className = {[styles.introVideo, styles['introVideo-mockClip']].join(' ')}
          clips={[
            require('../assets/3d.mp4'),
            require('../assets/weavin.mp4'),
            require('../assets/sandin.mp4'),
            require('../assets/wevi.mp4'),
            require('../assets/sketch.mp4'),
            require('../assets/paint.mp4'),
          ]}
          loaded = {()=>{this.loaded()}}
        />
      </section>
    )
  }
}
