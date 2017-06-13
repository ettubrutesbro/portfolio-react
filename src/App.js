import React from 'react';
import {observable, action, observe, computed} from 'mobx'
import {observer} from 'mobx-react'
import {zipObject} from 'lodash'

import styles from './Portfolio.css'
import {JLPortfolioStore} from './Store'
import {computeClipDifference, computeColorDifference} from './helpers.js'

import Intro from './Intro'
import Work from './Work'


@observer class App extends React.Component {
  logScroll(){
    // console.log('scroll position')
    // console.log(window.scrollY)
    store.scrollposition = window.scrollY
  }

  componentDidMount(){
    window.addEventListener('scroll',()=>{window.requestAnimationFrame(this.logScroll)})
  }
  render() {
    const assetsReady = store.assetsReady
    //render either initialloader or portfolio depending on assetsReady
    return (
      <div 
          // className={[styles.website, !assetsReady? styles.load: ''].join(' ')} 
          className={styles.website} 
      >
        {!assetsReady && <div className = {styles.loader} > Loading </div>}
        
        <FixedTitleBlock />
        <Intro store = {store}/>
        <Work store = {store}/>
        
      </div>
    )
  }
}

class FixedTitleBlock extends React.Component {
  render(){
    return(
      <header className = {styles.fixedTitleBlock}>
        <div className = {styles.left}>
          <Moballax
                yStart = {0} 
                yEnd = {300} 
                styleAtStart = {{color: [0,255,0]}} 
                styleAtEnd = {{color: [255,0,0]}}
          >
            <h1 className = {styles.jackleng}> Jack Leng</h1>
          </Moballax>
          <h2 className = {styles.workHeader}>SELECTED WORKS 2011-7</h2>
        </div>
        <div className = {styles.left}>
          <h3>he/him who designs and builds</h3>
          <h3>lively interfaces and other digital media</h3>
        </div>
      </header>
    )
  }
}

@observer class Moballax extends React.Component {
  //funky parallax wrapper takes a start px value and an end px value
  //if the window's scroll position falls between those values, its
  // % "through" the provided range gets multiplied by offset differences
  // and turned into inline style 
      //<Moballax yStart = {0} yEnd = {200} styleAtStart = {opacity: 0} styleAtEnd = {opacity: 1}>
  
  //needs some logic for CSS transforms and clip-path and rgb(a)

  @computed get percentage(){
    return store.scrollposition > this.props.yStart && store.scrollposition < this.props.yEnd? 
      (store.scrollposition - this.props.yStart) / (this.props.yEnd - this.props.yStart)
      : store.scrollposition <= this.props.yStart? 0 //these are wrong 
      : store.scrollposition >= this.props.yEnd? 1 //these are wrong 
      : null
  }
  @computed get interpolatedStyle(){
    const allKeys = Object.keys(this.props.styleAtEnd)
    const startValues = Object.values(this.props.styleAtStart)
    const endValues = Object.values(this.props.styleAtEnd)
    const interpolatedValues = endValues.map((val,i)=>{
      return allKeys[i]==='opacity'? (val - startValues[i]) * this.percentage
        : allKeys[i]==='clipPath'? computeClipDifference(startValues[i], val, this.percentage)
        : allKeys[i]===('translateX'||'translateY')? (val - startValues[i]) * this.percentage + 'px'
        : allKeys[i]==='color'? computeColorDifference(startValues[i], val, this.percentage)
        : null
    })
    console.log(zipObject(allKeys, interpolatedValues))
    return zipObject(allKeys, interpolatedValues)
  }
  render(){
    return(
      <div className = {this.props.className} style = {this.interpolatedStyle}>
        {this.props.children}
      </div>
    )
  }

  
}



const store = new JLPortfolioStore()
window.jlstore = store

export default App;
