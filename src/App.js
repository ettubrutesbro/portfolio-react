import React from 'react';
import {observable, action, observe, computed} from 'mobx'
import {observer} from 'mobx-react'
import {zipObject} from 'lodash'

import {TransitionMotion, spring} from 'react-motion'

import styles from './Portfolio.css'
import {Projects }from './data/projects.js'
import {JLPortfolioStore} from './Store'
import {computeClipDifference, computeColorDifference, computeXformDifference, easings} from './helpers.js'

import Intro from './Intro'
import ProjectHeap from './Projects/ProjectHeap'
import ProjectInfo from './Projects/ProjectInfo'

const projectNames = Projects.map(function(proj) {return proj.name})

@observer class App extends React.Component {
  logScroll(){
    store.scrollposition = window.scrollY
  }

  componentDidMount(){
    window.addEventListener('scroll',()=>{window.requestAnimationFrame(this.logScroll)})
  }

  willEnter = () => { 
    return {
      opacity: 0,
      transform: 100
    }
  }
  willLeave = () => { 
    return {
      opacity: spring(0),
      transform: spring(100)

    }
  }

  render() {
    const assetsReady = store.assetsReady
    console.log(Projects)
    const activeProject = Projects[projectNames.indexOf(store.selectedProject)]
    // console.log(activeProject)
    
    //render either initialloader or portfolio depending on assetsReady
    return (
      <div 
          // className={[styles.website, !assetsReady? styles.load: ''].join(' ')} 
          className={styles.website} 
      >

        <ProjectHeap 
            store = {store} 
            projects = {Projects} 
            width = {window.innerWidth} 
            height = {window.innerHeight} 
        />
        <TransitionMotion
          styles = { !store.selectedProject ? [] : [{
            key: 'info',
            data: {
              project: activeProject
            },
            style: {
              opacity: spring(1),
              transform: spring(0)

            }
          }]}
          willEnter = {this.willEnter}
          willLeave = {this.willLeave}
        >
          {(items) => {
            return (
              <div>
                {(items).map(item => {
                    return(
                      <ProjectInfo
                        project = {item.data.project}
                        key = {item.key}
                        style = {{
                          opacity: item.style.opacity,
                          transform: 'translateX('+item.style.transform+'px)'
                        }}
                      />
                    )
                  })
                }
              </div>
            )
          }}
        </TransitionMotion>

        {/*store.selectedProject && 
           <ProjectInfo
              project = {activeProject}
            />
        */}
        
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
                yEnd = {500} 
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
      //styleAtStart = {transform: {x:100, y:25, rotate:90, scale:2}}
  
  @computed get percentage(){
    return store.scrollposition > this.props.yStart && store.scrollposition < this.props.yEnd? 
      (store.scrollposition - this.props.yStart) / (this.props.yEnd - this.props.yStart)
      : store.scrollposition <= this.props.yStart? 0 
      : store.scrollposition >= this.props.yEnd? 1 
      : null
  }
  @computed get interpolatedStyle(){
    const allKeys = Object.keys(this.props.styleAtEnd)
    const startValues = Object.values(this.props.styleAtStart)
    const endValues = Object.values(this.props.styleAtEnd)
    const interpolatedValues = endValues.map((val,i)=>{
      return allKeys[i]==='opacity'? (val - startValues[i]) * this.percentage
        : allKeys[i]==='clipPath'? computeClipDifference(startValues[i], val, this.percentage, this.props.easing)
        : allKeys[i]==='transform'? computeXformDifference(startValues[i], val, this.percentage, this.props.easing, this.props.translationUnits)
        : allKeys[i]==='color'? computeColorDifference(startValues[i], val, this.percentage, this.props.easing)
        : null
    })
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

Moballax.defaultProps = {
    easing: easings.outCubic, //use false for linear
    translationUnits: 'px'
}



const store = new JLPortfolioStore()
window.app = store

export default App;
