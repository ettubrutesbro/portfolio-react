import React from 'react';

import {JLPortfolioStore} from './Store.jsx'
// import logo from './logo.svg';

//styles
// import styles from './Modules.css';
// import styles from './Modules.css'
import styles from './Portfolio.css'

import QuirkyVid from './QuirkyVid/QuirkyVid'

import {observable, action} from 'mobx'
import {observer} from 'mobx-react'


class App extends React.Component {
  render() {
    return (
      <div className={styles.website} >
        <IntroVideo />
      </div>
    )
  }
}

class IntroVideo extends React.Component {

  @action loaded(){
    store.loadcontent.introvideo = true
  }

  render(){
    return(
      <QuirkyVid
          id="intro"
          clips={[
            require('../assets/3d.mp4'),
            require('../assets/weavin.mp4'),
            require('../assets/sandin.mp4'),
            require('../assets/wevi.mp4'),
            require('../assets/sketch.mp4'),
            require('../assets/paint.mp4'),
          ]}
          loaded = {this.loaded}
        />
    )
  }
}

const store = new JLPortfolioStore()
window.jlstore = store

export default App;
