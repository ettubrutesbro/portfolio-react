import React from 'react';
// import logo from './logo.svg';

//styles
// import styles from './Modules.css';
// import styles from './Modules.css'
import styles from './Portfolio.css'

import QuirkyVid from './QuirkyVid/QuirkyVid'



class App extends React.Component {
  render() {
    return (
      <div className={styles.website} >
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
        />
      </div>
    )
  }
}

export default App;
