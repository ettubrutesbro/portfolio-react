import React from 'react'
import {findDOMNode} from 'react-dom'
import {action, observable} from 'mobx'
// import {observer} from 'mobx-react'

// import p2 from 'p2'
import ProjectHeap from './ProjectHeap/ProjectHeap'

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
            <Test />
          </section>
        )
      }
}

class Test extends React.Component{
  //p2.js or matter.js for physics
  //react-konva, react-pixi or react-canvas for rendering

  // @observable world = new p2.World({
  //   gravity: [0, -10]
  // })

  // @observable circlebody = new p2.Body({
  //   mass: 5, position: [0,10]
  // })
  // @observable circleshape = new p2.Circle({ radius: 1 })
  // @observable ground = new p2.Body({
  //   mass: 0
  // })
  // @observable groundshape = new p2.Plane()
  // @observable timeStep = 1/60

  // drawbox(){
    
  // }

  componentDidMount(){
    // this.circlebody.addShape(this.circleshape)
    // this.world.addBody(this.circlebody)
    // this.world.addBody(this.ground)
    // console.log(this.circlebody)
  }
  render(){
    return(
      <div />
    )
  }


}